import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 2525,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export const enviarCodigo = async (email: string, codigo: string) => {
  await transporter.sendMail({
    from: '"Mi App de Juegos" <30250045@aloe.ulima.edu.pe >',
    to: email,
    subject: "Código de verificación",
    text: `Tu código de verificación es: ${codigo}`,
  });
};
