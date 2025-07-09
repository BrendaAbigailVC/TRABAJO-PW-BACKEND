-- CreateTable
CREATE TABLE "ClaveDisponible" (
    "claveDisponibleId" SERIAL NOT NULL,
    "juegoId" INTEGER NOT NULL,
    "codigoClave" TEXT NOT NULL,

    CONSTRAINT "ClaveDisponible_pkey" PRIMARY KEY ("claveDisponibleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClaveDisponible_codigoClave_key" ON "ClaveDisponible"("codigoClave");

-- AddForeignKey
ALTER TABLE "ClaveDisponible" ADD CONSTRAINT "ClaveDisponible_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("juegoId") ON DELETE RESTRICT ON UPDATE CASCADE;
