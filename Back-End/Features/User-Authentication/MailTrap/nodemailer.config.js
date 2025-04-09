import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Define default sender - maintain compatibility with existing code
export const sender = {
  email: process.env.EMAIL_USER,
  name: "Skill Forge"
};

// For backward compatibility with mailtrap.client.send interface
export const client = {
  send: async (options) => {
    const mailOptions = {
      from: `"${options.from.name}" <${options.from.email}>`,
      to: options.to.map(recipient => recipient.email).join(','),
      subject: options.subject,
      html: options.html,
    };

    return transporter.sendMail(mailOptions);
  }
};
