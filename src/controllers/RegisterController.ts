import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { enviarCodigo } from '../utils/enviarCorreo';

const prisma = new PrismaClient();
const RegisterController = () => {
    const router = express.Router()


    return router
}

export default RegisterController
