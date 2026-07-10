// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration error: EMAIL_USER and EMAIL_PASS must be set.');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

const sendEmail = async (to, subject, text) => {
  console.log('sendEmail: preparing email to:', to);
  const emailTransporter = getTransporter();

  try {
    await emailTransporter.verify();
    console.log('sendEmail: transporter.verify() succeeded');
  } catch (verifyError) {
    console.error('sendEmail: transporter.verify() failed:', verifyError);
    throw new Error(`Email transporter verification failed: ${verifyError.message}`);
  }

  try {
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('sendEmail: transporter.sendMail() succeeded', { messageId: info.messageId });
  } catch (sendError) {
    console.error('sendEmail: transporter.sendMail() failed:', sendError);
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Email send failed: ${sendError.message}`);
    }
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;