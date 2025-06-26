import express, { Request, Response } from "express"
import { Juego, juegos } from "../data";
const JuegosController = () => {
    const router = express.Router()

    // Obtener todos los juegos
    router.get("/", async (req: Request, resp: Response) => {
        resp.json(juegos);
    });

    return router
}

export default JuegosController