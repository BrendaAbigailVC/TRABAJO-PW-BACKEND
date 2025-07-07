-- CreateTable
CREATE TABLE "UsuarioPendiente" (
    "usuarioPendienteId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "codigoVerificacion" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioPendiente_pkey" PRIMARY KEY ("usuarioPendienteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioPendiente_email_key" ON "UsuarioPendiente"("email");
