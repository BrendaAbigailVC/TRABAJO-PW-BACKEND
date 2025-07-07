import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import JuegosController from "./controllers/JuegosController"
import ReviewsController from "./controllers/ReviewController"
import AuthController from "./controllers/AuthController"
import dotenv from "dotenv"
import UsuariosController from "./controllers/UsuariosController"
import RegisterController from "./controllers/RegisterController"

dotenv.config()
const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(cors())
const PORT = process.env.PORT

app.use("/juegos", JuegosController())
app.use("/reviews", ReviewsController())
app.use("/api/auth", AuthController())
app.use("/usuarios", UsuariosController()); 
app.use('/api/usuarios', RegisterController());


app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en puerto ${PORT}`)
})