-- CreateTable
CREATE TABLE "Usuario" (
    "usuarioId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateTable
CREATE TABLE "Noticia" (
    "noticiaId" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("noticiaId")
);

-- CreateTable
CREATE TABLE "Venta" (
    "ventaId" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "juegoId" INTEGER NOT NULL,
    "montoPagado" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("ventaId")
);

-- CreateTable
CREATE TABLE "Juego" (
    "juegoId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "plataformaId" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL,
    "oferta" BOOLEAN NOT NULL,
    "ventas" INTEGER NOT NULL,
    "valoracion" DOUBLE PRECISION NOT NULL,
    "imagen" TEXT NOT NULL,
    "trailer" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("juegoId")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "categoriaId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("categoriaId")
);

-- CreateTable
CREATE TABLE "Plataforma" (
    "plataformaId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Plataforma_pkey" PRIMARY KEY ("plataformaId")
);

-- CreateTable
CREATE TABLE "ClaveJuego" (
    "claveJuegoId" SERIAL NOT NULL,
    "juegoId" INTEGER NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "codigoClave" TEXT NOT NULL,

    CONSTRAINT "ClaveJuego_pkey" PRIMARY KEY ("claveJuegoId")
);

-- CreateTable
CREATE TABLE "ImagenJuego" (
    "imagenJuegoId" SERIAL NOT NULL,
    "juegoId" INTEGER NOT NULL,
    "urlImagen" TEXT NOT NULL,

    CONSTRAINT "ImagenJuego_pkey" PRIMARY KEY ("imagenJuegoId")
);

-- CreateTable
CREATE TABLE "Review" (
    "reviewId" SERIAL NOT NULL,
    "juegoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClaveJuego_ventaId_key" ON "ClaveJuego"("ventaId");

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("juegoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("categoriaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "Plataforma"("plataformaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaveJuego" ADD CONSTRAINT "ClaveJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("juegoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaveJuego" ADD CONSTRAINT "ClaveJuego_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("ventaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagenJuego" ADD CONSTRAINT "ImagenJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("juegoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("juegoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;
