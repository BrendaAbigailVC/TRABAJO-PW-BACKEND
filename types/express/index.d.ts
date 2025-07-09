import { Request } from 'express';

declare module 'express' {
  export interface Request {
    usuarioId?: number;
  }
  console.log("Express types loaded");

}
