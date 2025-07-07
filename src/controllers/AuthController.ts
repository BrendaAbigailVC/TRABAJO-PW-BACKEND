import express, { Request, Response } from "express";
import { usuarios } from "../data";
import { PrismaClient } from '../generated/prisma';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import { verificarTokenMiddleware } from "../utils/verificarTokenMiddleware";

const AuthController = () => {
  const router = express.Router();

  // Endpoint de login
  router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email y contraseña son obligatorios." });
      return
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      res.status(401).json({ error: "Credenciales incorrectas." });
      return
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      res.status(401).json({ error: "Credenciales incorrectas." });
      return
    }

    const token = jwt.sign(
      { usuarioId: usuario.usuarioId, email: usuario.email },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    // Puedes guardar el token si quieres persistirlo en la base de datos
    await prisma.usuario.update({
      where: { usuarioId: usuario.usuarioId },
      data: { token }
    });

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        usuarioId: usuario.usuarioId,
        username: usuario.username,
        email: usuario.email,
        estado: usuario.estado,
      },

    });
  });


  router.get('/perfil', verificarTokenMiddleware, async (req: Request, res: Response) => {
    const usuarioId = (req as Request & { usuarioId: number }).usuarioId;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { usuarioId },
        select: {
          usuarioId: true,
          username: true,
          email: true,
          imagen: true
        }
      });

      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return
      }

      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el perfil', details: error });
    }
  });



  return router;
};

export default AuthController;
