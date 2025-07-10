import express, { Request, Response } from "express"
import { Juego, juegos, categorias, plataformas } from "../data"
import { PrismaClient } from "../generated/prisma"
import { verificarTokenMiddleware } from "../utils/verificarTokenMiddleware";

const prisma = new PrismaClient()

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
        id: juego.juegoId,
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
  router.post("/", verificarTokenMiddleware, async (req: Request, res: Response) => {
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
      trailer,
      imagenes
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

      if (Array.isArray(imagenes) && imagenes.length > 0) {
        await prisma.imagenJuego.createMany({
          data: imagenes.map((url) => ({
            juegoId: nuevoJuego.juegoId,
            urlImagen: url
          }))
        });
      }

      res.status(201).json({
        id: nuevoJuego.juegoId,
        ...nuevoJuego
      })
    } catch (error) {
      console.error("Error al crear juego:", error)
      res.status(500).json({ error: "Error interno al crear juego" })
    }
  })

  // Editar un juego por ID
  router.put("/:id", verificarTokenMiddleware, async (req: Request, res: Response) => {
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
      trailer,
      imagenes
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
        },
        include: {
          categoria: true,
          plataforma: true,
          imagenes: true,
        }
      })

      if (Array.isArray(imagenes)) {
        // Eliminar imágenes actuales
        await prisma.imagenJuego.deleteMany({ where: { juegoId } });

        // Insertar nuevas imágenes
        if (imagenes.length > 0) {
          await prisma.imagenJuego.createMany({
            data: imagenes.map((url) => ({
              juegoId,
              urlImagen: url,
            })),
          });
        }
      }

      res.json({
        id: juegoActualizado.juegoId,
        nombre: juegoActualizado.nombre,
        descripcion: juegoActualizado.descripcion,
        categoria: juegoActualizado.categoria.nombre,
        plataforma: juegoActualizado.plataforma.nombre,
        precio: juegoActualizado.precio,
        descuento: juegoActualizado.descuento,
        oferta: juegoActualizado.oferta,
        ventas: juegoActualizado.ventas,
        valoracion: juegoActualizado.valoracion,
        imagen: juegoActualizado.imagen,
        trailer: juegoActualizado.trailer,
        fecha: juegoActualizado.fecha,
        imagenes: juegoActualizado.imagenes.map(i => i.urlImagen),
        reviews: []
      });

    } catch (error) {
      console.error("Error al actualizar juego:", error)
      res.status(500).json({ error: "Error interno al actualizar juego" })
    }
  })

  // Eliminar un juego por ID
  router.delete("/:id", verificarTokenMiddleware, async (req: Request, res: Response) => {
    const juegoId = parseInt(req.params.id);
    try {
      await prisma.imagenJuego.deleteMany({ where: { juegoId } });
      await prisma.claveDisponible.deleteMany({ where: { juegoId } });
      await prisma.claveJuego.deleteMany({ where: { juegoId } });
      await prisma.review.deleteMany({ where: { juegoId } });
      await prisma.venta.deleteMany({ where: { juegoId } });
      const eliminado = await prisma.juego.delete({ where: { juegoId } });

      res.json({
        id: eliminado.juegoId,
        ...eliminado
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Juego no encontrado" });
      } else {
        console.error("Error al eliminar juego:", error);
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
        id: juego.juegoId,
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
      }));

      res.json(resultadosFormateados);
    } catch (error) {
      res.status(500).json({ error: "Error al buscar juegos" });
    }
  });

  //Filtrar juegos mediante categoria, fecha y rango de precios
  router.get("/filtrar", async (req: Request, res: Response) => {
    const { plataforma, categoria, fecha, precioMin, precioMax } = req.query;

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

      // Buscar ID de plataforma por nombre
      if (plataforma && typeof plataforma === "string") {
        const plataformaEncontrada = await prisma.plataforma.findFirst({
          where: {
            nombre: { equals: plataforma, mode: "insensitive" },
          },
        });

        if (!plataformaEncontrada) {
          res.status(404).json({ error: "Plataforma no encontrada." });
          return
        }

        filtros.plataformaId = plataformaEncontrada.plataformaId;
      }

      // Filtrar por fecha exacta 
      if (fecha && typeof fecha === "string") {
        const fechaObj = new Date(fecha);
        const fechaSinHora = new Date(
          fechaObj.getFullYear(),
          fechaObj.getMonth(),
          fechaObj.getDate()
        );

        filtros.fecha = {
          gte: fechaSinHora,
        };
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
        id: juego.juegoId,
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

      res.json(resultados);
    } catch (error) {
      console.error("Error al filtrar juegos:", error);
      res.status(500).json({ error: "Error al filtrar juegos" });
    }
  });

  router.get("/categorias", async (req, res) => {
    try {
      const categorias = await prisma.categoria.findMany();
      res.json(categorias);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      res.status(500).json({ error: "Error al obtener categorías" });
    }
  });

  router.get("/plataformas", async (req, res) => {
    try {
      const plataformas = await prisma.plataforma.findMany();
      res.json(plataformas);
    } catch (error) {
      console.error("Error al obtener plataformas:", error);
      res.status(500).json({ error: "Error al obtener plataformas" });
    }
  });

  // Ranking de juegos más vendidos
router.get("/ranking", async (req: Request, res: Response) => {
  try {
    const juegos = await prisma.juego.findMany({
      orderBy: {
        ventas: 'desc', // Ordenar de mayor a menor
      },
      include: {
        categoria: true,
        plataforma: true,
        imagenes: true,
      },
    });

    const juegosFormateados = juegos.map(juego => ({
      id: juego.juegoId,
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
      imagenes: juego.imagenes.map(img => img.urlImagen),
    }));

    res.json(juegosFormateados);
  } catch (error) {
    console.error("Error al obtener el ranking de juegos:", error);
    res.status(500).json({ error: "Error interno al obtener el ranking de juegos" });
  }

  // Obtener juego por ID con imágenes extra
  router.get("/:id", async (req: Request, res: Response) => {
    const juegoId = parseInt(req.params.id)

    try {
      const juego = await prisma.juego.findUnique({
        where: { juegoId },
        include: {
          categoria: true,
          plataforma: true,
          imagenes: true,
        }
      })

      if (!juego) {
        res.status(404).json({ error: "Juego no encontrado" })
        return
      }

      const juegoFormateado = {
        id: juego.juegoId,
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
        imagenes: juego.imagenes.map((img) => img.urlImagen),
      }

      res.json(juegoFormateado)
    } catch (error) {
      console.error("Error al obtener juego por ID:", error)
      res.status(500).json({ error: "Error interno al obtener juego" })
    }
  })

// Obtener juegos ordenados por valoración descendente
router.get("/api/juegos/mas-valorados", async (req: Request, res: Response) => {
  try {
    const juegos = await prisma.juego.findMany({
      orderBy: {
        valoracion: 'desc',
      },
      include: {
        categoria: true,
        plataforma: true,
      },
    });

    const juegosEnriquecidos = juegos.map(juego => ({
      id: juego.juegoId,
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
    }));

    res.json(juegosEnriquecidos);
  } catch (error) {
    console.error("Error al obtener juegos más valorados:", error);
    res.status(500).json({ msg: "Error al obtener juegos más valorados" });
  }
});


  return router
}

export default JuegosController
