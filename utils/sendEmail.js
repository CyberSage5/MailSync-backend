// utils/sendEmail.js
const nodemailer = require('nodemailer');
const logger = require('./logger'); // Logging utility

const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or any other email provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        logger.info(`Email sent to ${to}: ${info.response}`);
        return info;
    } catch (error) {
        logger.error(`Error sending email to ${to}: ${error.message}`);
        throw error;
    }
};

module.exports = { sendEmail };
