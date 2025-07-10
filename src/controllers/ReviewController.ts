import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { verificarTokenMiddleware } from "../utils/verificarTokenMiddleware";

const prisma = new PrismaClient();

const ReviewsController = () => {
    const router = express.Router();

    // Obtener reseñas de un juego con nombre e imagen del usuario
    router.get("/:juegoId", async (req: Request, res: Response) => {
        const juegoId = parseInt(req.params.juegoId);

        try {
            const reviews = await prisma.review.findMany({
                where: { juegoId },
                include: {
                    usuario: {
                        select: {
                            username: true,
                            imagen: true,
                        },
                    },
                },
                orderBy: {
                    fecha: 'desc',
                },
            });

            const resultado = reviews.map(r => ({
                reviewId: r.reviewId,
                juegoId: r.juegoId,
                usuarioId: r.usuarioId,
                username: r.usuario.username,
                imagenUsuario: r.usuario.imagen,
                rating: r.rating,
                comment: r.comment,
                fecha: r.fecha,
            }));

            res.json(resultado);
        } catch (error) {
            console.error("Error al obtener reseñas:", error);
            res.status(500).json({ error: "Error al obtener reseñas" });
        }
    });

    // Crear una nueva reseña (si ha comprado el juego)
    router.post("/:juegoId", verificarTokenMiddleware, async (req: Request, res: Response) => {
        const { rating, comment } = req.body;
        const juegoId = parseInt(req.params.juegoId);
        const usuarioId = (req as Request & { usuarioId?: number }).usuarioId;

        if (!usuarioId) {
            res.status(401).json({ error: "Usuario no autenticado" });
            return
        }

        try {
            const juego = await prisma.juego.findUnique({ where: { juegoId } });
            if (!juego) {
                res.status(404).json({ error: "Juego no encontrado" });
                return
            }

            // Verificar si el usuario ha comprado este juego
            const haComprado = await prisma.venta.findFirst({
                where: {
                    usuarioId,
                    juegoId,
                },
            });

            if (!haComprado) {
                res.status(403).json({ error: "No has comprado este juego" });
                return
            }

            const nuevaResena = await prisma.review.create({
                data: {
                    rating: parseInt(rating), // aseguramos tipo numérico
                    comment,
                    juegoId,
                    usuarioId,
                    fecha: new Date(),
                },
            });

            res.status(201).json(nuevaResena);
        } catch (error) {
            console.error("Error al agregar reseña:", error);
            res.status(500).json({ error: "Error interno al agregar reseña" });
        }
    });

    return router;
};

export default ReviewsController;
