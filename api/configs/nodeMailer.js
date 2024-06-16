const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const sendMail = (email, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    if (!email) {
      reject(new Error('Email address is required'));
      return;
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.sendMail({
      from: `"GardenSense" <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: htmlContent, // html body
    })
      .then(info => {
        console.log('Message sent: %s', info.messageId);
        resolve({ success: true, message: 'Email sent successfully' });
      })
      .catch(error => {
        console.error('Error sending email:', error);
        reject({ success: false, message: 'Failed to send email' });
      });
  });
};

module.exports = sendMail;

