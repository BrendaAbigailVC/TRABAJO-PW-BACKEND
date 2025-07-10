-- DropForeignKey
ALTER TABLE "ClaveJuego" DROP CONSTRAINT "ClaveJuego_juegoId_fkey";

-- AlterTable
ALTER TABLE "ClaveJuego" ALTER COLUMN "juegoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClaveJuego" ADD CONSTRAINT "ClaveJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("juegoId") ON DELETE SET NULL ON UPDATE CASCADE;
