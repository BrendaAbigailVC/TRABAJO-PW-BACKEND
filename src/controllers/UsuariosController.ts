import express, { Request, Response } from "express"
import { PrismaClient } from "../generated/prisma"
import { verificarTokenMiddleware } from "../utils/verificarTokenMiddleware";
import type { } from 'express';

const prisma = new PrismaClient();

const UsuariosController = () => {
    const router = express.Router()

    router.get('/perfil', verificarTokenMiddleware, async (req: Request, res: Response) => {
        const id = (req as Request & { usuarioId?: number }).usuarioId;
        if (!id) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return
        }

        try {
            const usuario = await prisma.usuario.findUnique({
                where: { usuarioId: id },
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
            console.error("Error al obtener el perfil:", error);
            res.status(500).json({ error: 'Error al obtener el perfil' });
        }
    });

    router.patch('/perfil', verificarTokenMiddleware, async (req: Request, res: Response) => {
        const id = (req as Request & { usuarioId?: number }).usuarioId;
        if (!id) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return
        }

        const { username, email, imagen } = req.body;

        try {
            const usuarioActualizado = await prisma.usuario.update({
                where: { usuarioId: id },
                data: {
                    ...(username && { username }),
                    ...(email && { email }),
                    ...(imagen !== undefined && { imagen }), // permite null también
                },
                select: {
                    usuarioId: true,
                    username: true,
                    email: true,
                    imagen: true,
                }
            });

            res.json(usuarioActualizado);
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            res.status(500).json({ error: 'Error al actualizar el perfil' });
        }
    });

    return router
}

export default UsuariosController
