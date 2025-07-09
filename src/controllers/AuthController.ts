import express, { Request, Response } from "express";
import { usuarios } from "../data";
import { PrismaClient } from '../generated/prisma';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import type { } from 'express';
import { enviarCodigo } from '../utils/enviarCorreo';

const AuthController = () => {
  const router = express.Router();

  // ENDPOINTS PARA LOGIN

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
        imagen: usuario.imagen,
        rol: usuario.rol,
      },

    });
  });


  //ENDPOINTS PARA REGISTRO
  function generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //  Registro de usuario pendiente
  router.post('/registrar', async (req: Request, res: Response) => {
    const { email, password, username, rol } = req.body;

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      res.status(409).json({ mensaje: "El correo ya está registrado." });
      return
    }

    const hash = await bcrypt.hash(password, 10);
    const codigo = generarCodigo();

    await prisma.usuarioPendiente.upsert({
      where: { email },
      update: { codigoVerificacion: codigo, password: hash, username },
      create: { email, password: hash, username, codigoVerificacion: codigo },
    });

    await enviarCodigo(email, codigo);

    res.status(200).json({ mensaje: "Código enviado. Verifica tu correo." });
    console.log(`Código de verificación enviado a ${email}: ${codigo}`);

    return
  });

  // Verificación de código
  router.post('/verificar', async (req: Request, res: Response) => {
    const { email, codigo, rol } = req.body;

    const pendiente = await prisma.usuarioPendiente.findUnique({ where: { email } });
    if (!pendiente) {
      res.status(404).json({ mensaje: "Correo no pendiente de verificación" });
      return
    }

    if (pendiente.codigoVerificacion !== codigo) {
      res.status(400).json({ mensaje: "Código incorrecto" });
      return
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email: pendiente.email,
        password: pendiente.password,
        username: pendiente.username,
        token: '',
        estado: 'activo',
        rol: req.body.rol === 'admin' ? 'admin' : 'user',
      },
    });

    await prisma.usuarioPendiente.delete({ where: { email } });

    const token = jwt.sign({ usuarioId: nuevoUsuario.usuarioId, email: nuevoUsuario.email }, process.env.JWT_SECRET!, {
      expiresIn: '2h',
    });

    await prisma.usuario.update({
      where: { usuarioId: nuevoUsuario.usuarioId },
      data: { token },
    });

    res.json({
      mensaje: "Cuenta verificada",
      token,
      usuario: {
        usuarioId: nuevoUsuario.usuarioId,
        email: nuevoUsuario.email,
        username: nuevoUsuario.username,
        estado: nuevoUsuario.estado,
        rol: nuevoUsuario.rol,
        imagen: nuevoUsuario.imagen || null,
      }
    });

    return
  });

  return router;
};

export default AuthController;

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
