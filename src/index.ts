import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import JuegosController from "./controllers/JuegosController"
import ReviewsController from "./controllers/ReviewController"

const app = express()

const PORT = 5000

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(cors())

app.use("/juegos", JuegosController())
app.use("/reviews", ReviewsController())


app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en puerto ${PORT}`)
})