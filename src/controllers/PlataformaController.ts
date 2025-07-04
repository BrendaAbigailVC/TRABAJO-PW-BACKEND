import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const PlataformaController = () => {
  const router = express.Router();

  // GET /plataformas
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const plataformas = await prisma.plataforma.findMany({
        include: { juegos: true },
      });
      res.json(plataformas);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener plataformas", details: error });
    }
  });

  // GET /plataformas/:id
  router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const plataforma = await prisma.plataforma.findUnique({
        where: { plataformaId: id },
        include: { juegos: true },
      });
      if (!plataforma) return res.status(404).json({ error: "Plataforma no encontrada" });
      res.json(plataforma);
    } catch (error) {
      res.status(500).json({ error: "Error interno", details: error });
    }
  });

  // POST /plataformas
  router.post("/", async (req: Request, res: Response) => {
    const { nombre } = req.body;
    try {
      const nueva = await prisma.plataforma.create({
        data: { nombre },
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: "No se pudo crear la plataforma", details: error });
    }
  });

  // PUT /plataformas/:id
  router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    try {
      const actualizada = await prisma.plataforma.update({
        where: { plataformaId: id },
        data: { nombre },
      });
      res.json(actualizada);
    } catch (error) {
      res.status(404).json({ error: "Plataforma no encontrada", details: error });
    }
  });

  // DELETE /plataformas/:id
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.plataforma.delete({ where: { plataformaId: id } });
      res.json({ message: "Plataforma eliminada" });
    } catch (error) {
      res.status(404).json({ error: "Plataforma no encontrada", details: error });
    }
  });

  return router;
};

export default PlataformaController;
