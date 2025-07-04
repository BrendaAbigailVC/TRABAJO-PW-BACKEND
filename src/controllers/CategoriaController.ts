import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const CategoriaController = () => {
  const router = express.Router();

  // GET /categorias
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const categorias = await prisma.categoria.findMany({
        include: { juegos: true },
      });
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener categorías", details: error });
    }
  });

  // GET /categorias/:id
  router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const categoria = await prisma.categoria.findUnique({
        where: { categoriaId: id },
        include: { juegos: true },
      });
      if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: "Error interno", details: error });
    }
  });

  // POST /categorias
  router.post("/", async (req: Request, res: Response) => {
    const { nombre } = req.body;
    try {
      const nueva = await prisma.categoria.create({
        data: { nombre },
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: "No se pudo crear la categoría", details: error });
    }
  });

  // PUT /categorias/:id
  router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    try {
      const actualizada = await prisma.categoria.update({
        where: { categoriaId: id },
        data: { nombre },
      });
      res.json(actualizada);
    } catch (error) {
      res.status(404).json({ error: "Categoría no encontrada", details: error });
    }
  });

  // DELETE /categorias/:id
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.categoria.delete({ where: { categoriaId: id } });
      res.json({ message: "Categoría eliminada" });
    } catch (error) {
      res.status(404).json({ error: "Categoría no encontrada", details: error });
    }
  });

  return router;
};

export default CategoriaController;
