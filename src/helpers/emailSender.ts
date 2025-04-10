// src/helpers/emailSender.ts
import nodemailer from 'nodemailer';
import config from '../config/index.js'; // Use .js
import AppError from '../utils/AppError.js'; // Use .js
import httpStatus from 'http-status';
import { errorLogger } from '../shared/logger.js'; // Use .js

export interface IEmailOptions {
  to: string; // Recipient email address
  subject: string;
  text?: string; // Plain text body
  html: string; // HTML body
  // You can add cc, bcc, attachments etc. here if needed
  // attachments?: { filename: string; content: Buffer | string; contentType?: string }[];
}

/**
 * Sends an email using configured SMTP settings.
 * @param options - Email options including to, subject, text, and html.
 */
export const sendEmail = async (options: IEmailOptions): Promise<void> => {
  // 1. Create a transporter
  // Validate essential SMTP config
  if (!config.email.smtp_host || !config.email.smtp_port || !config.email.smtp_user || !config.email.smtp_pass || !config.email.email_from) {
     const errorMsg = 'SMTP configuration incomplete. Cannot send email.';
     errorLogger.error(errorMsg, { required: ['host', 'port', 'user', 'pass', 'email_from'] });
     // Decide whether to throw or just log depends on how critical email sending is
     throw new AppError(errorMsg, httpStatus.INTERNAL_SERVER_ERROR);
     // Or just: console.error(errorMsg); return;
  }

  const transporter = nodemailer.createTransport({
    host: config.email.smtp_host,
    port: config.email.smtp_port,
    auth: {
      user: config.email.smtp_user,
      pass: config.email.smtp_pass,
    },
    // secure: config.email.smtp_port === 465, // Use true for port 465, false for others like 587 or 2525
    // logger: config.env === 'development', // Log SMTP communication in dev
    // debug: config.env === 'development',
  });

  // 2. Define the email options
  const mailOptions = {
    from: config.email.email_from, // Use configured sender address
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    // attachments: options.attachments,
  };

  // 3. Actually send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    if (config.env === 'development') {
      console.log('Email sent: %s'.cyan, info.messageId);
      // Preview URL for Mailtrap: console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error: any) {
    // Log the error for debugging
    errorLogger.error('Error sending email:', { to: options.to, subject: options.subject, error: error.message });
    // Throw a generic error to the caller, avoid exposing too much detail
    throw new AppError('There was an error sending the email. Please try again later.', httpStatus.INTERNAL_SERVER_ERROR);
  }
};
