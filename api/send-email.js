// /api/send-email.js
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
   if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER, // Your sending email address
      pass: process.env.EMAIL_PASS, // The App Password you generated
    },
  });

  // This is the email you will send TO.
  const receivingEmail = process.env.EMAIL_USER;

  try {
    // Send the email
    await transporter.sendMail({
      from: `"${name}" <${receivingEmail}>`, // Appears as "John Doe" <your-email@gmail.com>
      to: receivingEmail, // The email address that receives the form submission
      subject: `New Portfolio Message from ${name}`,
      replyTo: email, // So you can reply directly to the sender
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send a success response
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    // Send an error response
    return res.status(500).json({ message: 'Error sending email.' });
  }
}