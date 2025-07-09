import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { verificarTokenMiddleware } from "../utils/verificarTokenMiddleware";
import type { } from 'express';
import { enviarCorreoCompra } from '../utils/enviarCorreo';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function generarCodigoClave() {
    return `CLAVE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

const VentasController = () => {
    const router = express.Router();

    router.post("/comprar", verificarTokenMiddleware, async (req: Request, res: Response) => {
        try {
            const usuarioId = (req as Request & { usuarioId?: number }).usuarioId;

            const { juegos } = req.body;

            if (!usuarioId || !Array.isArray(juegos) || juegos.length === 0) {
                res.status(400).json({ message: "Datos incompletos o inválidos." });
                return
            }

            const ventasRealizadas: {
                ventaId: number;
                fecha: Date;
                montoPagado: number;
                juego: { nombre: string };
                claves: { codigoClave: string }[];
            }[] = [];

            await prisma.$transaction(async (tx) => {
                for (const item of juegos) {
                    const { juegoId, cantidad } = item;

                    if (!juegoId || typeof cantidad !== "number" || cantidad <= 0) continue;

                    const juego = await tx.juego.findUnique({ where: { juegoId } });
                    if (!juego) continue;


                    let descuento = juego.descuento;
                    if (descuento > 1) descuento = descuento / 100;

                    const precioFinal = juego.precio * (1 - descuento);
                    const montoPagado = precioFinal * cantidad;

                    const venta = await tx.venta.create({
                        data: {
                            fecha: new Date(),
                            usuarioId,
                            juegoId,
                            montoPagado,
                            claves: {
                                create: Array.from({ length: cantidad }).map(() => ({
                                    codigoClave: generarCodigoClave(),
                                    juegoId: juegoId,
                                })),
                            }
                        },
                        include: {
                            claves: true,
                            juego: true,
                        },
                    });

                    await tx.juego.update({
                        where: { juegoId },
                        data: {
                            ventas: { increment: cantidad },
                        },
                    });

                    ventasRealizadas.push(venta);
                }
            });

            if (ventasRealizadas.length === 0) {
                res.status(400).json({ message: "No se pudieron procesar los juegos seleccionados." });
                return
            }

            const total = ventasRealizadas.reduce((sum, venta) => sum + venta.montoPagado, 0);
            const fecha = ventasRealizadas[0].fecha;
            const orden = `ORD-${ventasRealizadas[0].ventaId}`;

            const juegosRespuesta = ventasRealizadas.map((venta) => ({
                nombre: venta.juego.nombre,
                claves: venta.claves.map((c) => c.codigoClave)
            }));

            const usuario = await prisma.usuario.findUnique({ where: { usuarioId } });
            if (usuario?.email) {
                const juegosHtml = juegosRespuesta
                    .map(
                        (j) => `
            <h3>${j.nombre}</h3>
            <ul>${j.claves.map((clave) => `<li>${clave}</li>`).join("")}</ul>`
                    )
                    .join("");

                const html = `
          <h2>¡Gracias por tu compra en GameStore!</h2>
          <p><strong>Orden:</strong> ${orden}</p>
          <p><strong>Fecha:</strong> ${new Date(fecha).toLocaleString()}</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          <h2>Tus claves:</h2>
          ${juegosHtml}
        `;

                await enviarCorreoCompra(usuario.email, "Confirmación de compra - GameStore", html);
            }


            res.status(201).json({
                message: "Compra completada.",
                fecha,
                orden,
                total: parseFloat(total.toFixed(2)),
                juegos: juegosRespuesta,
            });

        } catch (error: any) {
            console.error("Error en la compra:", error);
            res.status(500).json({
                message: "Error en el proceso de compra.",
                error: error.message || error
            });
        }

    });

    return router;
};

export default VentasController;
