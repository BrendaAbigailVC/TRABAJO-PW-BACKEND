import express, { Request, Response } from "express";
import { usuarios } from "../data";

const AuthController = () => {
  const router = express.Router();

  // Endpoint de login
  router.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
       res.status(400).json({ error: "Email y contraseña son obligatorios." });
       return
    }

    const usuario = usuarios.find(
      u => u.email === email && u.password === password
    );

    if (!usuario) {
       res.status(401).json({ error: "Credenciales incorrectas." });
       return
    }

    res.json({
      usuarioId: usuario.usuarioId,
      username: usuario.username,
      email: usuario.email,
      token: usuario.token
    });
  });

  return router;
};

export default AuthController;
