const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Use ethereal for dev/testing
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: { user: 'test@ethereal.email', pass: 'test' },
      });
      console.log('[Email] SMTP not configured - emails will be logged only');
    }
  }
  return transporter;
};

const sendContactEmail = async ({ name, phone, email, message }) => {
  const contactEmail = process.env.CONTACT_EMAIL || 'contacto@citadental.cc';

  const mailOptions = {
    from: `"CitaDental - Formulario de Contacto" <noreply@citadental.cc>`,
    to: contactEmail,
    subject: `Nuevo mensaje de contacto - ${name}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Tel\u00e9fono:</strong> ${phone || 'No proporcionado'}</p>
      <p><strong>Email:</strong> ${email || 'No proporcionado'}</p>
      <hr />
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
      <hr />
      <small>Enviado desde el formulario de contacto de CitaDental</small>
    `,
  };

  try {
    const t = getTransporter();
    await t.sendMail(mailOptions);
    console.log(`[Email] Contact email sent to ${contactEmail}`);
  } catch (error) {
    console.error('[Email] Failed to send contact email:', error.message);
    // Don't throw - email failure shouldn't block the contact form
  }
};

const sendAppointmentNotification = async (userEmail, { subject, html }) => {
  try {
    const t = getTransporter();
    await t.sendMail({
      from: '"CitaDental" <noreply@citadental.cc>',
      to: userEmail,
      subject,
      html,
    });
    console.log(`[Email] Notification sent to ${userEmail}`);
  } catch (error) {
    console.error('[Email] Failed to send notification:', error.message);
  }
};

module.exports = { sendContactEmail, sendAppointmentNotification };
