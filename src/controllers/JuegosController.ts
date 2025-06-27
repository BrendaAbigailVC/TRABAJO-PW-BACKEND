import express, { Request, Response } from "express"
import { Juego, juegos, categorias, plataformas } from "../data"

let nextId = juegos.length + 1

const JuegosController = () => {
  const router = express.Router()

  // Obtener todos los juegos
  /*router.get("/", async (req: Request, res: Response) => {
     res.json(juegos)
   })*/

  // Obtener todos los juegos con nombres de categoría y plataforma
  router.get("/", async (req: Request, res: Response) => {
    const juegosEnriquecidos = juegos.map(juego => {
      const categoria = categorias.find(c => c.categoriaId === juego.categoriaId);
      const plataforma = plataformas.find(p => p.plataformaId === juego.plataformaId);

      return {
        ...juego,
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

    // Convertir nombres a IDs
    const categoriaEncontrada = categorias.find(c => c.nombre === categoria);
    const plataformaEncontrada = plataformas.find(p => p.nombre === plataforma);

    if (!categoriaEncontrada || !plataformaEncontrada) {
      res.status(400).json({ error: "Categoría o plataforma inválida" });
      return
    }

    // Generar fecha actual en formato YYYY-MM-DD
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
    const id = parseInt(req.params.id)
    const index = juegos.findIndex(j => j.juegoId === id)
    if (index === -1)
      //res.status(404).json({ error: "Juego no encontrado" })
      return

    juegos[index] = { ...juegos[index], ...req.body, juegoId: id }
    res.json(juegos[index])
  })

  // Eliminar un juego por ID
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const index = juegos.findIndex(j => j.juegoId === id)
    if (index === -1)
      //res.status(404).json({ error: "Juego no encontrado" })
      return

    const eliminado = juegos.splice(index, 1)[0]
    res.json(eliminado)
  })


  return router
}

export default JuegosController
