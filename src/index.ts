import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import JuegosController from "./controllers/JuegosController"

const app = express()

const PORT = 5000

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(cors())

app.use("/juegos", JuegosController())


app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en puerto ${PORT}`)
})