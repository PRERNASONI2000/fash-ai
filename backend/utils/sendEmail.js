// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

// const sendEmail = async (to, subject, text) => {
//     // Create a transporter using your email service credentials smtp.gmail.com for Gmail
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

  
// //   await transporter.verify();
// //   console.log("Email transporter verified successfully.");


//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   });
  
// };

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
//     from: process.env.EMAIL_FROM,
//     to,
//     subject,
//     text,
//   });
// };


const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;