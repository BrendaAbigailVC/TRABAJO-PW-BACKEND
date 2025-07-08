interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendGameKeysEmail = async (email: string, orderNumber: string, games: { nombre: string, clave: string }[]): Promise<boolean> => {
  try {
    // En un entorno real, aquí se conectaría con un servicio de email como SendGrid, Mailgun, etc.
    // Por ahora, simularemos el envío guardando el email en localStorage
    const emailData: EmailData = {
      to: email,
      subject: `Tus claves de juego - Orden ${orderNumber}`,
      text: `Gracias por tu compra. Aquí están tus claves de juego:\n\n${games.map(g => `${g.nombre}: ${g.clave}`).join('\n')}`,
      html: `
        <h1>¡Gracias por tu compra!</h1>
        <p>Orden: ${orderNumber}</p>
        <h2>Tus claves de juego:</h2>
        <ul>
          ${games.map(g => `<li><strong>${g.nombre}:</strong> ${g.clave}</li>`).join('')}
        </ul>
        <p>¡Disfruta de tus juegos!</p>
      `
    };

    // Guardar el email en localStorage para simulación
    const emails = JSON.parse(localStorage.getItem('emails') || '[]');
    emails.push(emailData);
    localStorage.setItem('emails', JSON.stringify(emails));

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 