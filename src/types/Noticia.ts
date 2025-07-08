export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string;
  fecha: string;
  autor: string;
  destacada: boolean;
} 