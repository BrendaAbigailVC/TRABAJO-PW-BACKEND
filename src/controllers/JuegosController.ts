import express, { Request, Response } from "express"
import { Juego, juegos } from "../data"

let nextId = juegos.length + 1

const JuegosController = () => {
  const router = express.Router()

  // Obtener todos los juegos
  router.get("/", async (req: Request, res: Response) => {
    res.json(juegos)
  })

  // Agregar un nuevo juego
  router.post("/", async (req: Request, res: Response) => {
    const nuevoJuego: Juego = { juegoId: nextId++, ...req.body }
    juegos.push(nuevoJuego)
    res.status(201).json(nuevoJuego)
  })

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
