export interface Usuario {
  usuarioId: number;
  email: string;
  password: string;
  username: string;
  token: string;
  estado: string;
}

export interface Noticia {
  noticiaId: number;
  titulo: string;
  texto: string;
  activo: boolean;
}

export interface Venta {
  ventaId: number;
  fecha: string;
  usuarioId: number;
  juegoId: number;
  montoPagado: number;
}

export interface Juego {
  juegoId: number;
  nombre: string;
  descripcion: string;
  categoriaId: number;
  plataformaId: number;
  precio: number;
  descuento: number;
  oferta: boolean;
  ventas: number;
  valoracion: number;
  imagen: string;
  trailer: string;
  fecha: string;
}

export interface Categoria {
  categoriaId: number;
  nombre: string;
}

export interface Plataforma {
  plataformaId: number;
  nombre: string;
}

export interface ClaveJuego {
  claveJuegoId: number;
  juegoId: number;
  codigoClave: string;
  ventaId: number;
}

export interface ImagenJuego {
  imagenJuegoId: number;
  juegoId: number;
  urlImagen: string;
}

export interface Review {
  reviewId: number;
  juegoId: number;
  usuarioId: number;
  rating: number;
  comment: string;
  fecha: string;
}



//Datos de ejemplo
export const usuarios: Usuario[] = [
  { usuarioId: 1, email: "alice@example.com", password: "123", username: "alice", token: "abc123", estado: "activo" },
  { usuarioId: 2, email: "bob@example.com", password: "456", username: "bob", token: "def456", estado: "inactivo" }
];

export const categorias: Categoria[] = [
  { categoriaId: 1, nombre: "Acción" },
  { categoriaId: 2, nombre: "Aventura" },
  { categoriaId: 3, nombre: "RPG" }
];

export const plataformas: Plataforma[] = [
  { plataformaId: 1, nombre: "PC" },
  { plataformaId: 2, nombre: "PlayStation" },
  { plataformaId: 3, nombre: "Nintendo" },
];

export const juegos: Juego[] = [
  {
    juegoId: 1,
    nombre: "CyberQuest",
    descripcion: "Juego de acción futurista.",
    categoriaId: 1,
    plataformaId: 1,
    precio: 59.99,
    descuento: 10,
    oferta: true,
    ventas: 120,
    valoracion: 4.5,
    imagen: "cyberquest.jpg",
    trailer: "cyberquest_trailer.mp4",
    fecha: "2024-10-01"
  },
  {
    juegoId: 2,
    nombre: "Fantasy Legends",
    descripcion: "Aventura épica en un mundo de fantasía.",
    categoriaId: 2,
    plataformaId: 2,
    precio: 49.99,
    descuento: 0,
    oferta: false,
    ventas: 300,
    valoracion: 4.8,
    imagen: "fantasy_legends.jpg",
    trailer: "fantasy_legends_trailer.mp4",
    fecha: "2024-08-15"
  },
  {
    juegoId: 3,
    nombre: "Speed Drift",
    descripcion: "Carreras intensas con gráficos realistas.",
    categoriaId: 3,
    plataformaId: 3,
    precio: 39.99,
    descuento: 15,
    oferta: true,
    ventas: 500,
    valoracion: 4.3,
    imagen: "speed_drift.jpg",
    trailer: "speed_drift_trailer.mp4",
    fecha: "2025-01-20"
  },
  {
    juegoId: 4,
    nombre: "Puzzle Master",
    descripcion: "Resuelve acertijos desafiantes.",
    categoriaId: 4,
    plataformaId: 1,
    precio: 19.99,
    descuento: 5,
    oferta: true,
    ventas: 200,
    valoracion: 4.0,
    imagen: "puzzle_master.jpg",
    trailer: "puzzle_master_trailer.mp4",
    fecha: "2023-12-05"
  }
];

export const ventas: Venta[] = [
  {
    ventaId: 1,
    fecha: "2025-06-15",
    usuarioId: 1,
    juegoId: 1,
    montoPagado: 53.99
  }
];

export const claveJuegos: ClaveJuego[] = [
  {
    claveJuegoId: 1,
    juegoId: 1,
    codigoClave: "ABC-123-XYZ",
    ventaId: 1
  }
];

export const imagenesJuego: ImagenJuego[] = [
  {
    imagenJuegoId: 1,
    juegoId: 1,
    urlImagen: "https://example.com/images/cyberquest1.jpg"
  },
  {
    imagenJuegoId: 2,
    juegoId: 1,
    urlImagen: "https://example.com/images/cyberquest2.jpg"
  }
];

export const reviews: Review[] = [
  {
    reviewId: 1,
    juegoId: 1,
    usuarioId: 1,
    rating: 5,
    comment: "¡Excelente juego!",
    fecha: "2025-06-16"
  },
  {
    reviewId: 2,
    juegoId: 1,
    usuarioId: 2,
    rating: 4,
    comment: "Muy entretenido, pero podría tener más misiones.",
    fecha: "2025-06-17"
  }
];

export const noticias: Noticia[] = [
  {
    noticiaId: 1,
    titulo: "Nueva expansión disponible",
    texto: "CyberQuest recibe su primera expansión gratuita.",
    activo: true
  }
];
