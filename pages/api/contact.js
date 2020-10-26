import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_PORT,
  CONTACT_EMAIL,
  IS_PRODUCTION
} = require('../../config');

export default async (request, res) => {
  const {method, body} = request;

  const transporter = IS_PRODUCTION ? nodemailer.createTransport({
    sendmail: true,
    newline: 'unix'
  }) : nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    }
  });

  if (method === 'POST') {
    const email = await transporter.sendMail({
      from: `"Contact Form" <${SMTP_USER}>`, // Sender address
      replyTo: `"${body.fromName}" <${body.fromEmail}>`,
      to: CONTACT_EMAIL, // List of receivers
      subject: `[Contact Form] ${body.subjectCategory}: ${body.subjectName}`, // Subject line
      text: `${body.message} \n\n -- This email was sent from the contact form on the Film Board website.` // Plain text body
    });

    return res.json(email);
  }
};
