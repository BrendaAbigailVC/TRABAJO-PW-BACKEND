import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

function generarCodigoClave(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 4 }, () =>
        Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length)))
            .join('')
    ).join('-');
}

const ClaveController = () => {
    const router = express.Router();

    router.post("/generar", async (req: Request, res: Response) => {
        const { juegoId, cantidad } = req.body;

        if (!juegoId || typeof cantidad !== "number" || cantidad <= 0) {
            res.status(400).json({ message: "Datos inválidos" });
            return
        }

        const claves = Array.from({ length: cantidad }).map(() => ({
            juegoId,
            codigoClave: generarCodigoClave()
        }));

        try {
            const result = await prisma.claveDisponible.createMany({
                data: claves,
                skipDuplicates: true
            });

            res.status(201).json({ message: `${result.count} claves generadas` });
        } catch (error) {
            console.error("Error al generar claves:", error);
            res.status(500).json({ message: "Error interno", error });
        }
    });

    // GET /api/claves/disponibles/:juegoId
    router.get("/disponibles/:juegoId", async (req: Request, res: Response) => {
        const juegoId = Number(req.params.juegoId);

        if (isNaN(juegoId)) {
            res.status(400).json({ message: "ID de juego inválido" });
            return
        }

        try {
            const claves = await prisma.claveDisponible.findMany({
                where: { juegoId },
                select: { claveDisponibleId: true, codigoClave: true }
            });

            res.json(claves);
        } catch (error) {
            console.error("Error al obtener claves:", error);
            res.status(500).json({ message: "Error interno", error });
        }
    });

    router.delete("/disponibles/:claveId", async (req: Request, res: Response) => {
        const claveId = Number(req.params.claveId);

        if (isNaN(claveId)) {
            res.status(400).json({ message: "ID de clave inválido" });
            return
        }

        try {
            await prisma.claveDisponible.delete({
                where: { claveDisponibleId: claveId }
            });

            res.json({ message: "Clave eliminada exitosamente" });
        } catch (error) {
            console.error("Error al eliminar clave:", error);
            res.status(500).json({ message: "Error interno", error });
        }
    });

    return router;
};



export default ClaveController;
