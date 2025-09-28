import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  FROM_NAME
} = process.env;

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT == 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// Email templates
const templates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - Riders Moto Shop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Riders Moto Shop!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering with Riders Moto Shop. Please verify your email address by clicking the link below:</p>
        <a href="${data.verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${data.verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Riders Moto Shop Team</p>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset - Riders Moto Shop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested a password reset for your Riders Moto Shop account. Click the link below to reset your password:</p>
        <a href="${data.resetLink}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${data.resetLink}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>Riders Moto Shop Team</p>
      </div>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation #${data.orderNumber} - Riders Moto Shop`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hi ${data.customerName},</p>
        <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Order Date:</strong> ${data.orderDate}</p>
          <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
        </div>
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>Riders Moto Shop Team</p>
      </div>
    `
  }),

  orderShipped: (data) => ({
    subject: `Your Order Has Shipped #${data.orderNumber} - Riders Moto Shop`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Order Has Shipped!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Shipping Details</h3>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
          <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
        </div>
        <p>You can track your package using the tracking number above.</p>
        <p>Best regards,<br>Riders Moto Shop Team</p>
      </div>
    `
  })
};

// Send email
export const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    let emailContent;

    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html || html,
      text: emailContent.text || text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};

export default {
  sendEmail,
  testEmailConfig,
  templates
};
