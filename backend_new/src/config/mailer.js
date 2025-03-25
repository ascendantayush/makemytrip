// backend_new/src/config/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, SMTP_USERNAME, SMTP_PASSWORD, SMTP_PORT, SMTP_HOST } = process.env;

const transporter = nodemailer.createTransport({
  host: NODE_ENV === 'development' ? 'smtp.mailtrap.io' : SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

export default transporter;