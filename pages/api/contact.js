import nodemailer from 'nodemailer';

const {
  SMTP_USER,
  CONTACT_EMAIL
} = require('../../config');

export default async (req, res) => {
  const {method, body} = req;

  const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix'
  });

  if (method === 'POST') {
    const email = await transporter.sendMail({
      from: `"Contact Form" <${SMTP_USER}>`, // Sender address
      replyTo: `"${body.fromName}" <${body.fromEmail}>`,
      to: CONTACT_EMAIL, // List of receivers
      subject: `[Contact Form] ${body.subjectCategory}: ${body.subjectName}`, // Subject line
      text: body.message // Plain text body
    });

    return res.json(email);
  }
};
