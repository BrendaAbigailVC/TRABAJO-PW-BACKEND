import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 2525,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

// Envío de código de verificación (registro o recuperación)
export const enviarCodigo = async (email: string, codigo: string) => {
  await transporter.sendMail({
    from: '"Mi App de Juegos" <30250045@aloe.ulima.edu.pe >',
    to: email,
    subject: "Código de verificación",
    text: `Tu código de verificación es: ${codigo}`,
  });
};

// Envío de detalles de compra
export async function enviarCorreoCompra(destino: string, asunto: string, detallesHtml: string) {
  await transporter.sendMail({
    from: `"GameStore" <${process.env.SMTP_USER}>`,
    to: destino,
    subject: asunto,
    html: detallesHtml,
  });
};