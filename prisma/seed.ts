// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  // Categorías
  const categorias = await prisma.categoria.createMany({
    data: [
      { nombre: "Acción" },
      { nombre: "Aventura" },
      { nombre: "RPG" },
      { nombre: "Puzle" },
    ],
  });

  // Plataformas
  const plataformas = await prisma.plataforma.createMany({
    data: [
      { nombre: "PC" },
      { nombre: "PlayStation" },
      { nombre: "Nintendo" },
    ],
  });

  // Usuarios
  const [alice, bob] = await prisma.$transaction([
    prisma.usuario.create({
      data: {
        email: "alice@example.com",
        password: "123",
        username: "alice",
        token: "abc123",
        estado: "activo",
      },
    }),
    prisma.usuario.create({
      data: {
        email: "bob@example.com",
        password: "456",
        username: "bob",
        token: "def456",
        estado: "inactivo",
      },
    }),
  ]);

  // Juegos
  const juegos = await prisma.juego.createMany({
    data: [
      {
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
        fecha: new Date("2024-10-01"),
      },
      {
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
        fecha: new Date("2024-08-15"),
      },
      {
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
        fecha: new Date("2025-01-20"),
      },
      {
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
        fecha: new Date("2023-12-05"),
      },
    ],
  });

  // Venta
  const venta = await prisma.venta.create({
    data: {
      fecha: new Date("2025-06-15"),
      usuarioId: alice.usuarioId,
      juegoId: 1,
      montoPagado: 53.99,
    },
  });

  // Claves de juego
  await prisma.claveJuego.create({
    data: {
      juegoId: 1,
      ventaId: venta.ventaId,
      codigoClave: "ABC-123-XYZ",
    },
  });

  // Imágenes extra del juego
  await prisma.imagenJuego.createMany({
    data: [
      {
        juegoId: 1,
        urlImagen: "https://example.com/images/cyberquest1.jpg",
      },
      {
        juegoId: 1,
        urlImagen: "https://example.com/images/cyberquest2.jpg",
      },
    ],
  });

  // Reviews
  await prisma.review.createMany({
    data: [
      {
        juegoId: 1,
        usuarioId: alice.usuarioId,
        rating: 5,
        comment: "¡Excelente juego!",
        fecha: new Date("2025-06-16"),
      },
      {
        juegoId: 1,
        usuarioId: bob.usuarioId,
        rating: 4,
        comment: "Muy entretenido, pero podría tener más misiones.",
        fecha: new Date("2025-06-17"),
      },
    ],
  });

  // Noticia
  await prisma.noticia.create({
    data: {
      titulo: "Nueva expansión disponible",
      texto: "CyberQuest recibe su primera expansión gratuita.",
      activo: true,
    },
  });

  console.log("Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
