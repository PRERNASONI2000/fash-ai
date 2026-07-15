// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Create a transporter using your email service credentials smtp.gmail.com for Gmail
  const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  
//   await transporter.verify();
//   console.log("Email transporter verified successfully.");


  await transporter.sendMail({
     from: `"FashionStudioAI" <support@ugcstudioai.pro>`,
    to,
    subject,
    text,
  });
  
};

// module.exports = sendEmail;

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false, // Port 587 uses STARTTLS
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const sendEmail = async (to, subject, text) => {
//   await transporter.sendMail({
//     from: `"FashAI" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     text,
//   });
// };

module.exports = sendEmail;