import express, { Request, Response } from "express"
import { Juego, juegos, categorias, plataformas } from "../data"

let nextId = juegos.length + 1

const JuegosController = () => {
  const router = express.Router()

  // Obtener todos los juegos con nombres de categoría y plataforma
  router.get("/", async (req: Request, res: Response) => {
    const juegosEnriquecidos = juegos.map(juego => {
      const categoria = categorias.find(c => c.categoriaId === juego.categoriaId);
      const plataforma = plataformas.find(p => p.plataformaId === juego.plataformaId);

      return {
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
        categoria: categoria?.nombre || "Desconocida",
        plataforma: plataforma?.nombre || "Desconocida"
      };
    });

    res.json(juegosEnriquecidos);
  });

  // Agregar un nuevo juego
  router.post("/", async (req: Request, res: Response) => {
    const { nombre, descripcion, categoria, plataforma, precio, descuento, oferta, ventas, valoracion, imagen, trailer,
    } = req.body;

    const categoriaEncontrada = categorias.find(c => c.nombre === categoria);
    const plataformaEncontrada = plataformas.find(p => p.nombre === plataforma);

    if (!categoriaEncontrada || !plataformaEncontrada) {
      res.status(400).json({ error: "Categoría o plataforma inválida" });
      return
    }

    const fechaActual = new Date().toISOString().split("T")[0];

    const nuevoJuego: Juego = {
      juegoId: nextId++,
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
      fecha: fechaActual
    };

    juegos.push(nuevoJuego);
    res.status(201).json(nuevoJuego);
  });

  // Editar un juego por ID
  router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = juegos.findIndex(j => j.juegoId === id);

    if (index === -1) {
      res.status(404).json({ error: "Juego no encontrado" });
      return
    }

    const { nombre, descripcion, categoria, plataforma, precio, descuento, oferta, ventas, valoracion, imagen, trailer } = req.body;
    const categoriaEncontrada = categorias.find(c => c.nombre === categoria);
    const plataformaEncontrada = plataformas.find(p => p.nombre === plataforma);

    if (!categoriaEncontrada || !plataformaEncontrada) {
      res.status(400).json({ error: "Categoría o plataforma inválida" });
      return
    }

    const juegoActualizado: Juego = {
      ...juegos[index],
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
    };

    juegos[index] = juegoActualizado;

    res.json(juegoActualizado);
  });

  // Eliminar un juego por ID
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const index = juegos.findIndex(j => j.juegoId === id)
    if (index === -1) {
      res.status(404).json({ error: "Juego no encontrado" });
      return
    }

    const eliminado = juegos.splice(index, 1)[0]
    res.json(eliminado)
  })

  //Busqueda de juego mediante nombre
  router.get("/search", (req: Request, res: Response) => {
    const { nombre } = req.query;

    if (!nombre || typeof nombre !== "string") {
      res.status(400).json({ error: "Debes proporcionar un nombre de juego a buscar." });
      return
    }

    // Búsqueda insensible a mayúsculas y espacios
    const nombreBuscado = nombre.trim().toLowerCase();

    const resultados = juegos.filter(j =>
      j.nombre.toLowerCase().includes(nombreBuscado)
    );

    const resultadosEnriquecidos = resultados.map(juego => {
      const categoria = categorias.find(c => c.categoriaId === juego.categoriaId);
      const plataforma = plataformas.find(p => p.plataformaId === juego.plataformaId);

      return {
        ...juego,
        categoria: categoria?.nombre || "Desconocida",
        plataforma: plataforma?.nombre || "Desconocida"
      };
    });

    res.json(resultadosEnriquecidos);
  });

  //Filtrar juegos mediante categoria, fecha y rango de precios
  router.get("/filtrar", (req: Request, res: Response) => {
    const { categoria, fecha, precioMin, precioMax } = req.query;

    let juegosFiltrados = [...juegos];

    // Filtrar por categoría
    if (categoria && typeof categoria === "string") {
      const categoriaEncontrada = categorias.find(
        c => c.nombre.toLowerCase() === categoria.toLowerCase()
      );

      if (!categoriaEncontrada) {
        res.status(404).json({ error: "Categoría no encontrada." });
        return
      }

      juegosFiltrados = juegosFiltrados.filter(
        j => j.categoriaId === categoriaEncontrada.categoriaId
      );
    }

    // Filtrar por fecha
    if (fecha && typeof fecha === "string") {
      juegosFiltrados = juegosFiltrados.filter(j => j.fecha === fecha);
    }

    //Filtrar por rango de precio
    const min = precioMin ? parseFloat(precioMin as string) : null;
    const max = precioMax ? parseFloat(precioMax as string) : null;

    if (min !== null) {
      juegosFiltrados = juegosFiltrados.filter(j => j.precio >= min);
    }

    if (max !== null) {
      juegosFiltrados = juegosFiltrados.filter(j => j.precio <= max);
    }

    const resultados = juegosFiltrados.map(juego => {
      const categoriaObj = categorias.find(c => c.categoriaId === juego.categoriaId);
      const plataforma = plataformas.find(p => p.plataformaId === juego.plataformaId);

      return {
        ...juego,
        categoria: categoriaObj?.nombre || "Desconocida",
        plataforma: plataforma?.nombre || "Desconocida"
      };
    });

    res.json(resultados);
  });

  return router
}

export default JuegosController
