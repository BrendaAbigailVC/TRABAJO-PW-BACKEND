import express, { Request, Response } from "express";
import { Review, reviews, juegos, usuarios } from "../data";

let nextReviewId = reviews.length + 1;

const ReviewsController = () => {
    const router = express.Router();

    // Obtener reseñas de un juego
    router.get("/:juegoId", async (req: Request, res: Response) => {
        const juegoId = parseInt(req.params.juegoId);

        try {
            const reviews = await prisma.review.findMany({
                where: { juegoId },
                include: {
                    usuario: true,  // Incluye los detalles del usuario en la reseña
                },
            });

            // Formatear las reseñas antes de responder
            const resultado = reviews.map(r => ({
                reviewId: r.reviewId,
                juegoId: r.juegoId,
                usuarioId: r.usuarioId,
                username: r.usuario.username, // Usando el nombre del usuario desde la relación
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

    // Crear una nueva reseña
    router.post("/:juegoId", verificarTokenMiddleware, async (req: Request, res: Response) => {
        const { rating, comment } = req.body;
        const juegoId = parseInt(req.params.juegoId);
        const usuarioId = req.user.id;  // Usuario del token autenticado

        try {
            // Verificar si el juego existe
            const juego = await prisma.juego.findUnique({
                where: { juegoId },
            });

            if (!juego) {
                return res.status(404).json({ error: "Juego no encontrado" });
            }

            // Verificar si el usuario ha comprado el juego
            const historialCompras = await prisma.venta.findMany({
                where: {
                    usuarioId,
                    juegos: {
                        some: {
                            juegoId,
                        },
                    },
                },
            });

            if (historialCompras.length === 0) {
                return res.status(403).json({ error: "No has comprado este juego" });
            }

            // Crear la nueva reseña
            const nuevaResena = await prisma.review.create({
                data: {
                    rating,
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