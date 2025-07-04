import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const ClaveJuegoController = () => {
  const router = express.Router();

  // GET /claves
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const claves = await prisma.claveJuego.findMany({
        include: {
          juego: true,
          venta: true,
        },
      });
      res.json(claves);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener claves", details: error });
    }
  });

  // GET /claves/:id
  router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const clave = await prisma.claveJuego.findUnique({
        where: { claveJuegoId: id },
        include: {
          juego: true,
          venta: true,
        },
      });
      if (!clave) return res.status(404).json({ error: "Clave no encontrada" });
      res.json(clave);
    } catch (error) {
      res.status(500).json({ error: "Error interno", details: error });
    }
  });

  // POST /claves
  router.post("/", async (req: Request, res: Response) => {
    const { juegoId, ventaId, codigoClave } = req.body;
    try {
      const nueva = await prisma.claveJuego.create({
        data: { juegoId, ventaId, codigoClave },
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: "No se pudo registrar la clave", details: error });
    }
  });

  // PUT /claves/:id
  router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { juegoId, ventaId, codigoClave } = req.body;
    try {
      const actualizada = await prisma.claveJuego.update({
        where: { claveJuegoId: id },
        data: { juegoId, ventaId, codigoClave },
      });
      res.json(actualizada);
    } catch (error) {
      res.status(404).json({ error: "Clave no encontrada", details: error });
    }
  });

  // DELETE /claves/:id
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.claveJuego.delete({ where: { claveJuegoId: id } });
      res.json({ message: "Clave eliminada" });
    } catch (error) {
      res.status(404).json({ error: "Clave no encontrada", details: error });
    }
  });

  return router;
};

export default ClaveJuegoController;
