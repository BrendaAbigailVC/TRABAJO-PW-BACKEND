import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secreto';

export function verificarTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return; 
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET) as { usuarioId: number };
    (req as Request & { usuarioId: number }).usuarioId = decoded.usuarioId;
    next(); 
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
    return;
  }
}
