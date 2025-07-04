import express, { Request, Response } from "express"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient();

const UsuariosController = () => {
    const router = express.Router()

    // GET /usuarios
    router.get("/", async (req: Request, res: Response) => {
        try {
            const usuarios = await prisma.usuario.findMany({
                include: { reviews: true, ventas: true }
            });
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener usuarios", details: error });
        }
    })

    // GET /usuarios/:id
    router.get("/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { usuarioId: id },
                include: { reviews: true, ventas: true }
            });
            if (!usuario) {
                res.status(404).json({ error: "Usuario no encontrado" });
                return
            }

            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: "Error interno", details: error });
        }
    })

    // POST /usuarios
    router.post("/", async (req: Request, res: Response) => {
        const { email, password, username, token, estado } = req.body;
        try {
            const nuevo = await prisma.usuario.create({
                data: { email, password, username, token, estado }
            });
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el usuario", details: error });
        }
    })

    // PUT /usuarios/:id
    router.put("/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { email, password, username, token, estado } = req.body;
        try {
            const actualizado = await prisma.usuario.update({
                where: { usuarioId: id },
                data: { email, password, username, token, estado }
            });
            res.json(actualizado);
        } catch (error) {
            res.status(404).json({ error: "Usuario no encontrado", details: error });
        }
    })

    // DELETE /usuarios/:id
    router.delete("/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            await prisma.review.deleteMany({ where: { usuarioId: id } });
            await prisma.venta.deleteMany({ where: { usuarioId: id } });
            await prisma.usuario.delete({ where: { usuarioId: id } });

            res.json({ message: "Usuario eliminado" });
        } catch (error) {
            res.status(404).json({ error: "No se pudo eliminar el usuario", details: error });
        }
    });


    return router
}

export default UsuariosController
