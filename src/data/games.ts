export interface Review {
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Game {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  plataforma: string;
  precio: number;
  descuento: number; // Porcentaje de descuento (0-100)
  oferta: boolean;
  ventas: number;
  valoracion: number;
  imagen?: string | File;
  trailer?: string;
  reviews: Review[];
  claves: string[];
  imagenes?: string[];
  fecha?: string;
}


const juegosDefault: Game[] = [
  {
    id: 1,
    nombre: "Elden Ring",
    descripcion: "Un juego de mundo abierto lleno de peligros y aventuras.",
    categoria: "RPG",
    plataforma: "PC",
    precio: 59.99,
    descuento: 10,
    oferta: true,
    ventas: 150,
    valoracion: 4.8,
    imagen: "/ELDEN-RING.avif",
    trailer: "https://www.youtube.com/watch?v=E3Huy2cdih0",
    reviews: [],
    claves: ["ELDEN-RING-XXXX-XXXX-XXXX", "ELDEN-RING-YYYY-YYYY-YYYY"],
    imagenes: ["public/er1.jpeg", "public/er2.jpeg", "public/er3.jpeg"],
    fecha: "25-02-2022"
  },
  {
    id: 2,
    nombre: "God of War",
    descripcion: "Kratos regresa con una historia épica de venganza y redención.",
    categoria: "Acción",
    plataforma: "PlayStation",
    precio: 49.99,
    descuento: 0,
    oferta: false,
    ventas: 200,
    valoracion: 4.9,
    imagen: "/GOD-OF-WAR.webp",
    trailer: "https://www.youtube.com/watch?v=AN3jEjjcZ-k",
    reviews: [],
    claves: ["GOW-XXXX-XXXX-XXXX", "GOW-YYYY-YYYY-YYYY"],
    imagenes: [
      "public/GOW1.webp",
      "public/GOW2.jfif",
      "public/GOW3.jpg",
    ],
    fecha: "20-04-2018"
  },
  {
    id: 3,
    nombre: "Hollow Knight",
    descripcion: "Explora un reino subterráneo en este metroidvania desafiante.",
    categoria: "Metroidvania",
    plataforma: "PC",
    precio: 14.99,
    descuento: 25,
    oferta: true,
    ventas: 300,
    valoracion: 4.7,
    imagen: "/HOLLOW-KNIGHT.jpg",
    trailer: "https://www.youtube.com/watch?v=nSPJXlYjENE",
    reviews: [],
    claves: [],
    fecha: "24-02-2017"
  },
  {
    id: 4,
    nombre: "The Legend of Zelda",
    descripcion: "Una aventura mágica con puzles, combate y exploración.",
    categoria: "Aventura",
    plataforma: "Nintendo",
    precio: 69.99,
    descuento: 0,
    oferta: false,
    ventas: 250,
    valoracion: 4.9,
    imagen: "/XELDA.avif",
    trailer: "https://www.youtube.com/watch?v=ofH5ptn5w-A",
    reviews: [],
    claves: [],
    imagenes: ["public/er1.jpeg", "public/er2.jpeg", "public/er3.jpeg"],
    fecha: "03-03-2017"
  },
  {
    id: 5,
    nombre: "GTA 6",
    descripcion: "Próximamente: La nueva entrega de la saga Grand Theft Auto.",
    categoria: "Acción",
    plataforma: "PlayStation",
    precio: 69.99,
    descuento: 0,
    oferta: false,
    ventas: 0,
    valoracion: 0,
    imagen: "/GTA-6.jpg",
    trailer: "https://www.youtube.com/watch?v=QdBZY2fkU-0",
    reviews: [],
    claves: [],
    imagenes: ["public/er1.jpeg", "public/er2.jpeg", "public/er3.jpeg"],
    fecha: "Próximamente"
  },
  {
    id: 6,
    nombre: "The Witcher 3",
    descripcion: "Un RPG de mundo abierto con una historia épica y gráficos impresionantes.",
    categoria: "RPG",
    plataforma: "PC",
    precio: 29.99,
    descuento: 30,
    oferta: true,
    ventas: 400,
    valoracion: 4.9,
    imagen: "/WITCHER-3.jpeg",
    trailer: "https://www.youtube.com/watch?v=c0i88t0Kacs",
    reviews: [],
    claves: [],
    imagenes: ["public/er1.jpeg", "public/er2.jpeg", "public/er3.jpeg"],
    fecha: "19-05-2015"
  },
  {
    id: 7,
    nombre: "Red Dead Redemption 2",
    descripcion: "Una historia épica del salvaje oeste con gráficos realistas y jugabilidad inmersiva.",
    categoria: "Aventura",
    plataforma: "PlayStation",
    precio: 39.99,
    descuento: 0,
    oferta: false,
    ventas: 350,
    valoracion: 4.8,
    imagen: "/RDR2.jpeg",
    trailer: "https://www.youtube.com/watch?v=gmA6MrX81z4",
    reviews: [],
    claves: [],
    imagenes: ["public/er1.jpeg", "public/er2.jpeg", "public/er3.jpeg"],
    fecha: "26-10-2018"
  },
  {
    id: 8,
    nombre: "Cyberpunk 2077",
    descripcion: "Un RPG de mundo abierto en un futuro distópico con gráficos de última generación.",
    categoria: "RPG",
    plataforma: "PC",
    precio: 49.99,
    descuento: 20,
    oferta: true,
    ventas: 200,
    valoracion: 4.5,
    imagen: "/CYBERPUNK.jpeg",
    trailer: "https://www.youtube.com/watch?v=8X2kIfS6fb8",
    reviews: [],
    claves: [],
    imagenes: ["public/er1.jpeg", "public/er2.jpeg", "public/er3.jpeg"],
    fecha: "10-12-2020"
  },
  {
    id: 9,
    nombre: "The Last of Us Part II",
    descripcion: "Una historia emocionante de supervivencia y venganza en un mundo post-apocalíptico.",
    categoria: "Aventura",
    plataforma: "PlayStation",
    precio: 59.99,
    descuento: 0,
    oferta: false,
    ventas: 300,
    valoracion: 4.7,
    imagen: "/LASTOFUS2.jpeg",
    trailer: "https://www.youtube.com/watch?v=JdE9U9WW_HM",
    reviews: [],
    claves: [],
    imagenes: ["public/er1.jpeg", "public/er2.jpeg", "public/er3.jpeg"],
    fecha: "19-06-2020"
  },
  {
    id: 10,
    nombre: "FIFA 24",
    descripcion: "El simulador de fútbol más realista con gráficos y jugabilidad mejorados.",
    categoria: "Deportes",
    plataforma: "PC",
    precio: 69.99,
    descuento: 0,
    oferta: false,
    ventas: 250,
    valoracion: 4.6,
    imagen: "/FIFA24.jpg",
    trailer: "FC24TRAILER.mp4",
    reviews: [],
    claves: ["FIFA24-XXXX-XXXX-XXXX", "FIFA24-YYYY-YYYY-YYYY"],
    imagenes: [
      "public/FC241.jpg",
      "public/FIFA242.webp",
      "public/FC243.jpg"
    ],
    fecha: "29-09-2023"
  }
];

export const getJuegos = (): Game[] => {
  const juegosGuardados = localStorage.getItem("juegos");
  if (juegosGuardados) {
    const juegos = JSON.parse(juegosGuardados);
    const incompletos = juegos.some((j: Game) => !j.imagenes || !Array.isArray(j.imagenes));
    if (!incompletos) return juegos;
  }
  localStorage.setItem("juegos", JSON.stringify(juegosDefault));
  return juegosDefault;
};

export const juegos = getJuegos();
