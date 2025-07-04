import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import JuegosController from "./controllers/JuegosController"
import ReviewsController from "./controllers/ReviewController"
import AuthController from "./controllers/AuthController"
import UsuarioController from "./controllers/UsuarioController";
import NoticiaController from "./controllers/NoticiaController";
import VentaController from "./controllers/VentaController";
import CategoriaController from "./controllers/CategoriaController";
import PlataformaController from "./controllers/PlataformaController";
import ClaveJuegoController from "./controllers/ClaveJuegoController";
import ImagenJuegoController from "./controllers/ImagenJuegoController";

app.use("/imagenes", ImagenJuegoController());

app.use("/claves", ClaveJuegoController());

app.use("/plataformas", PlataformaController());

app.use("/categorias", CategoriaController());

app.use("/ventas", VentaController());

app.use("/noticias", NoticiaController());

app.use("/usuarios", UsuarioController()); 

const app = express()

const PORT = 5000

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(cors())

app.use("/juegos", JuegosController())
app.use("/reviews", ReviewsController())
app.use("/auth", AuthController())


app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en puerto ${PORT}`)
})