import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { enviarCodigo } from '../utils/enviarCorreo';

const prisma = new PrismaClient();
const RegisterController = () => {
    const router = express.Router()


    function generarCodigo(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    //  Registro de usuario pendiente
    router.post('/registrar', async (req: Request, res: Response) => {
        const { email, password, username } = req.body;

        const existente = await prisma.usuario.findUnique({ where: { email } });
        if (existente) {
            res.status(409).json({ mensaje: "El correo ya está registrado." });
            return
        }

        const hash = await bcrypt.hash(password, 10);
        const codigo = generarCodigo();

        await prisma.usuarioPendiente.upsert({
            where: { email },
            update: { codigoVerificacion: codigo, password: hash, username },
            create: { email, password: hash, username, codigoVerificacion: codigo },
        });

        await enviarCodigo(email, codigo);

        res.status(200).json({ mensaje: "Código enviado. Verifica tu correo." });
        console.log(`Código de verificación enviado a ${email}: ${codigo}`);

        return
    });

    // Verificación de código
    router.post('/verificar', async (req: Request, res: Response) => {
        const { email, codigo } = req.body;

        const pendiente = await prisma.usuarioPendiente.findUnique({ where: { email } });
        if (!pendiente) {
            res.status(404).json({ mensaje: "Correo no pendiente de verificación" });
            return
        }

        if (pendiente.codigoVerificacion !== codigo) {
            res.status(400).json({ mensaje: "Código incorrecto" });
            return
        }

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                email: pendiente.email,
                password: pendiente.password,
                username: pendiente.username,
                token: '', 
                estado: 'activo'
            },
        });

        await prisma.usuarioPendiente.delete({ where: { email } });

        const token = jwt.sign({ usuarioId: nuevoUsuario.usuarioId, email: nuevoUsuario.email }, process.env.JWT_SECRET!, {
            expiresIn: '2h',
        });

        await prisma.usuario.update({
            where: { usuarioId: nuevoUsuario.usuarioId },
            data: { token },
        });

        res.json({ mensaje: "Cuenta verificada", token, usuario: nuevoUsuario });
        return
    });

    return router
}

export default RegisterController
