import express, { Request, Response } from "express"
import { Juego, juegos, categorias, plataformas } from "../data"
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

let nextId = juegos.length + 1

const JuegosController = () => {
  const router = express.Router()

  // Obtener todos los juegos con nombres de categoría y plataforma
  router.get("/", async (req: Request, res: Response) => {
    try {
      const juegos = await prisma.juego.findMany({
        include: {
          categoria: true,
          plataforma: true,
        },
      })

      const juegosEnriquecidos = juegos.map(juego => ({
        juegoId: juego.juegoId,
        nombre: juego.nombre,
        descripcion: juego.descripcion,
        precio: juego.precio,
        descuento: juego.descuento,
        oferta: juego.oferta,
        ventas: juego.ventas,
        valoracion: juego.valoracion,
        imagen: juego.imagen,
        trailer: juego.trailer,
        fecha: juego.fecha,
        categoria: juego.categoria?.nombre || "Desconocida",
        plataforma: juego.plataforma?.nombre || "Desconocida",
      }))

      res.json(juegosEnriquecidos)
    } catch (error) {
      console.error("Error al obtener juegos:", error)
      res.status(500).json({ msg: "Error al obtener juegos" })
    }
  })

  // Agregar un juego nuevo
  router.post("/", async (req: Request, res: Response) => {
    const {
      nombre,
      descripcion,
      categoria,
      plataforma,
      precio,
      descuento,
      oferta,
      ventas,
      valoracion,
      imagen,
      trailer
    } = req.body

    try {
      const categoriaEncontrada = await prisma.categoria.findFirst({
        where: { nombre: categoria }
      })

      const plataformaEncontrada = await prisma.plataforma.findFirst({
        where: { nombre: plataforma }
      })

      if (!categoriaEncontrada || !plataformaEncontrada) {
        res.status(400).json({
          error: "Categoría o plataforma inválida"
        })
        return
      }

      const nuevoJuego = await prisma.juego.create({
        data: {
          nombre,
          descripcion,
          categoriaId: categoriaEncontrada.categoriaId,
          plataformaId: plataformaEncontrada.plataformaId,
          precio,
          descuento,
          oferta,
          ventas,
          valoracion,
          imagen,
          trailer,
          fecha: new Date()
        }
      })

      res.status(201).json(nuevoJuego)
    } catch (error) {
      console.error("Error al crear juego:", error)
      res.status(500).json({ error: "Error interno al crear juego" })
    }
  })

  // Editar un juego por ID
  router.put("/:id", async (req: Request, res: Response) => {
    const juegoId = parseInt(req.params.id)

    const {
      nombre,
      descripcion,
      categoria,
      plataforma,
      precio,
      descuento,
      oferta,
      ventas,
      valoracion,
      imagen,
      trailer
    } = req.body

    try {
      const juegoExistente = await prisma.juego.findUnique({
        where: { juegoId }
      })

      if (!juegoExistente) {
        res.status(404).json({ error: "Juego no encontrado" })
        return
      }

      const categoriaEncontrada = await prisma.categoria.findFirst({
        where: { nombre: categoria }
      })

      const plataformaEncontrada = await prisma.plataforma.findFirst({
        where: { nombre: plataforma }
      })

      if (!categoriaEncontrada || !plataformaEncontrada) {
        res.status(400).json({
          error: "Categoría o plataforma inválida"
        })
        return
      }


      const juegoActualizado = await prisma.juego.update({
        where: { juegoId },
        data: {
          nombre,
          descripcion,
          categoriaId: categoriaEncontrada.categoriaId,
          plataformaId: plataformaEncontrada.plataformaId,
          precio,
          descuento,
          oferta,
          ventas,
          valoracion,
          imagen,
          trailer
        }
      })

      res.json(juegoActualizado)
    } catch (error) {
      console.error("Error al actualizar juego:", error)
      res.status(500).json({ error: "Error interno al actualizar juego" })
    }
  })

  // Eliminar un juego por ID
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
      const eliminado = await prisma.juego.delete({
        where: { juegoId: id },
      });

      res.json(eliminado);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: "Juego no encontrado" });
      } else {
        res.status(500).json({ error: "Error al eliminar el juego" });
      }
    }
  });

  //Busqueda de juego mediante nombre
  router.get("/search", async (req: Request, res: Response) => {
  const { nombre } = req.query;

  if (!nombre || typeof nombre !== "string") {
    res.status(400).json({ error: "Debes proporcionar un nombre de juego a buscar." });
    return;
  }

  const nombreBuscado = nombre.trim().toLowerCase();

  try {
    const resultados = await prisma.juego.findMany({
      where: {
        nombre: {
          contains: nombreBuscado,
          mode: "insensitive", 
        },
      },
      include: {
        categoria: true,
        plataforma: true,
      },
    });

    const resultadosFormateados = resultados.map(juego => ({
      ...juego,
      categoria: juego.categoria?.nombre || "Desconocida",
      plataforma: juego.plataforma?.nombre || "Desconocida",
    }));

    res.json(resultadosFormateados);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar juegos" });
  }
});

  //Filtrar juegos mediante categoria, fecha y rango de precios
  
router.get("/filtrar", async (req: Request, res: Response) => {
  const { categoria, fecha, precioMin, precioMax } = req.query;

  try {
    // Filtro dinámico
    const filtros: any = {};

    // Buscar ID de categoría por nombre
    if (categoria && typeof categoria === "string") {
      const categoriaEncontrada = await prisma.categoria.findFirst({
        where: {
          nombre: { equals: categoria, mode: "insensitive" },
        },
      });

      if (!categoriaEncontrada) {
         res.status(404).json({ error: "Categoría no encontrada." });
         return
      }

      filtros.categoriaId = categoriaEncontrada.categoriaId;
    }

    // Filtrar por fecha exacta 
    if (fecha && typeof fecha === "string") {
      filtros.fecha = new Date(fecha);
    }

    // Filtrar por rango de precio
    if (precioMin || precioMax) {
      filtros.precio = {};
      if (precioMin) filtros.precio.gte = parseFloat(precioMin as string);
      if (precioMax) filtros.precio.lte = parseFloat(precioMax as string);
    }

    const juegosFiltrados = await prisma.juego.findMany({
      where: filtros,
      include: {
        categoria: true,
        plataforma: true,
      },
    });

    const resultados = juegosFiltrados.map(juego => ({
      ...juego,
      categoria: juego.categoria?.nombre || "Desconocida",
      plataforma: juego.plataforma?.nombre || "Desconocida",
    }));

    res.json(resultados);
  } catch (error) {
    console.error("Error al filtrar juegos:", error);
    res.status(500).json({ error: "Error al filtrar juegos" });
  }
});

  return router
}

export default JuegosController
