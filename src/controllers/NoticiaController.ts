import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const NoticiaController = () => {
  const router = express.Router();

  // GET /noticias
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const noticias = await prisma.noticia.findMany();
      res.json(noticias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener noticias", details: error });
    }
  });

  // GET /noticias/:id
  router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const noticia = await prisma.noticia.findUnique({ where: { noticiaId: id } });
      if (!noticia) {
        return res.status(404).json({ error: "Noticia no encontrada" });
      }
      res.json(noticia);
    } catch (error) {
      res.status(500).json({ error: "Error interno", details: error });
    }
  });

  // POST /noticias
  router.post("/", async (req: Request, res: Response) => {
    const { titulo, texto, activo } = req.body;
    try {
      const nueva = await prisma.noticia.create({ data: { titulo, texto, activo } });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: "No se pudo crear", details: error });
    }
  });

  // PUT /noticias/:id
  router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { titulo, texto, activo } = req.body;
    try {
      const actualizada = await prisma.noticia.update({
        where: { noticiaId: id },
        data: { titulo, texto, activo },
      });
      res.json(actualizada);
    } catch (error) {
      res.status(404).json({ error: "Noticia no encontrada", details: error });
    }
  });

  // DELETE /noticias/:id
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.noticia.delete({ where: { noticiaId: id } });
      res.json({ message: "Noticia eliminada" });
    } catch (error) {
      res.status(404).json({ error: "Noticia no encontrada", details: error });
    }
  });

  return router;
};

export default NoticiaController;
