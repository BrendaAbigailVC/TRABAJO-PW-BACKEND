import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const ImagenJuegoController = () => {
  const router = express.Router();

  // GET /imagenes - obtener todas
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const imagenes = await prisma.imagenJuego.findMany({
        include: { juego: true }
      });
      res.json(imagenes);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener imágenes", details: error });
    }
  });

  // GET /imagenes/:id - obtener una imagen
  router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const imagen = await prisma.imagenJuego.findUnique({
        where: { imagenJuegoId: id },
        include: { juego: true }
      });
      if (!imagen) return res.status(404).json({ error: "Imagen no encontrada" });
      res.json(imagen);
    } catch (error) {
      res.status(500).json({ error: "Error interno", details: error });
    }
  });

  // POST /imagenes - crear una imagen
  router.post("/", async (req: Request, res: Response) => {
    const { juegoId, urlImagen } = req.body;
    try {
      const nueva = await prisma.imagenJuego.create({
        data: { juegoId, urlImagen }
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: "No se pudo registrar la imagen", details: error });
    }
  });

  // PUT /imagenes/:id - actualizar una imagen
  router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { juegoId, urlImagen } = req.body;
    try {
      const actualizada = await prisma.imagenJuego.update({
        where: { imagenJuegoId: id },
        data: { juegoId, urlImagen }
      });
      res.json(actualizada);
    } catch (error) {
      res.status(404).json({ error: "Imagen no encontrada", details: error });
    }
  });

  // DELETE /imagenes/:id - eliminar una imagen
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.imagenJuego.delete({ where: { imagenJuegoId: id } });
      res.json({ message: "Imagen eliminada" });
    } catch (error) {
      res.status(404).json({ error: "Imagen no encontrada", details: error });
    }
  });

  return router;
};

export default ImagenJuegoController;
