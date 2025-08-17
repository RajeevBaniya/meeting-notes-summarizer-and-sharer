import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendSummaryEmail = async (recipients, summary, subject = 'Meeting Summary') => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }

  const transporter = createTransporter();

  const emailContent = `
<h2>Meeting Summary</h2>
<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; font-family: Arial, sans-serif;">
  <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${summary}</pre>
</div>
<br>
<p style="color: #666; font-size: 12px;">This summary was generated automatically.</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(', '),
    subject: subject,
    html: emailContent
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};
