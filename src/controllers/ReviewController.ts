import express, { Request, Response } from "express";
import { Review, reviews, juegos, usuarios } from "../data";

let nextReviewId = reviews.length + 1;

const ReviewsController = () => {
    const router = express.Router();

    // Obtener review
    router.get("/:juegoId", (req: Request, res: Response) => {
        const juegoId = parseInt(req.params.juegoId);

        const resultado = reviews
            .filter(r => r.juegoId === juegoId)
            .map(r => {
                const usuario = usuarios.find(u => u.usuarioId === r.usuarioId);
                return {
                    reviewId: r.reviewId,
                    juegoId: r.juegoId,
                    usuarioId: r.usuarioId,
                    username: usuario?.username || "Usuario desconocido",
                    rating: r.rating,
                    comment: r.comment,
                    fecha: r.fecha
                };
            });

        res.json(resultado);
    });

    // Crear nueva reseña
    router.post("/", (req: Request, res: Response) => {
        const { juegoId, usuarioId, rating, comment } = req.body;

        if (!juegoId || !usuarioId || typeof rating !== "number") {
            res.status(400).json({ error: "Datos incompletos" });
            return
        }

        const juegoExiste = juegos.find(j => j.juegoId === juegoId);
        const usuarioExiste = usuarios.find(u => u.usuarioId === usuarioId);

        if (!juegoExiste || !usuarioExiste) {
            res.status(404).json({ error: "Juego o usuario no encontrado" });
            return
        }

        const nuevaReview: Review = {
            reviewId: nextReviewId++,
            juegoId,
            usuarioId,
            rating,
            comment,
            fecha: new Date().toISOString().split("T")[0]
        };

        reviews.push(nuevaReview);
        res.status(201).json(nuevaReview);
    });

    return router;
};

export default ReviewsController;