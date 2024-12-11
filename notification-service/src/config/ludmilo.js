const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 465,
    service: 'gmail',

    auth: {
        user: "elghazi.mohamed.ilyass@gmail.com",
        pass: "drnqhqyfpzlyivxi",
    },
    tls: {
        rejectUnauthorized: false // Disable SSL verification (for development purposes only)
      }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
