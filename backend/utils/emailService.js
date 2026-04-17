import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM
} = process.env;

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(SMTP_PORT) || 587,
  secure: parseInt(SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  debug: true, // show debug output
  logger: true, // log information in console
  tls: {
    rejectUnauthorized: false // helps with some certificate issues
  }
});

/**
 * Send email using Nodemailer (SMTP)
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Lokawani News" <${EMAIL_FROM || SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email sending failed to ${to}:`, error.message);
    throw new Error(`Email service error: ${error.message}`);
  }
};

/**
 * Send OTP for Registration
 */
export const sendRegisterOTP = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #c41e3a; text-align: center;">Welcome to Lokawani</h2>
      <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your account:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; border: 1px dashed #c41e3a;">
          ${otp}
        </span>
      </div>
      <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eeeeee;" />
      <p style="font-size: 12px; color: #888; text-align: center;">Lokawani News - Your Daily Multilingual News Portal</p>
    </div>
  `;

  return sendEmail(email, 'Verify your Lokawani Account', html);
};

/**
 * Send OTP for Password Reset
 */
export const sendPasswordResetOTP = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #c41e3a; text-align: center;">Password Reset</h2>
      <p>We received a request to reset your password. Use the following OTP to proceed:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; border: 1px dashed #c41e3a;">
          ${otp}
        </span>
      </div>
      <p>This OTP is valid for 10 minutes. If you did not request a password reset, please change your password immediately.</p>
      <hr style="border: 0; border-top: 1px solid #eeeeee;" />
      <p style="font-size: 12px; color: #888; text-align: center;">Lokawani News Support</p>
    </div>
  `;

  return sendEmail(email, 'Password Reset Request', html);
};

/**
 * Send Booking Confirmation Email
 */
export const sendBookingConfirmation = async (booking) => {
  const startDate = new Date(booking.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const endDate = new Date(booking.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const amount = Number(booking.amountPaid).toLocaleString('en-IN');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #c41e3a, #a01830); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Your advertisement has been successfully booked</p>
      </div>

      <div style="padding: 30px 20px;">
        <!-- Booking ID Banner -->
        <div style="background: #f8f8f8; border: 2px dashed #c41e3a; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Booking ID</p>
          <p style="margin: 5px 0 0; font-size: 28px; font-weight: bold; color: #c41e3a; letter-spacing: 2px;">${booking.bookingId}</p>
        </div>

        <p style="color: #333;">Dear <strong>${booking.advertiserName}</strong>,</p>
        <p style="color: #555;">Thank you for booking an advertisement with Lokawani News. Here are your booking details:</p>

        <!-- Details Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px; width: 40%;">Business Name</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #333;">${booking.businessName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Plan</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #333; text-transform: uppercase;">${booking.planId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Placement</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #333; text-transform: capitalize;">${booking.placement.replace('-', ' ')}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Campaign Period</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #333;">${startDate} — ${endDate}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Amount Paid</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #c41e3a; font-size: 18px;">₹${amount}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Status</td>
            <td style="padding: 12px 8px;">
              <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Pending Review</span>
            </td>
          </tr>
        </table>

        <!-- Next Steps -->
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; border-radius: 0 8px 8px 0; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #166534;">What happens next?</p>
          <ol style="margin: 8px 0 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
            <li>Our team will review your booking within 24 hours</li>
            <li>You'll receive an email once your ad is approved</li>
            <li>Your ad will go live on the scheduled start date</li>
          </ol>
        </div>

        <p style="color: #888; font-size: 13px;">If you have any questions, reply to this email or contact our support team.</p>
      </div>

      <!-- Footer -->
      <div style="background: #f8f8f8; padding: 15px 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="margin: 0; font-size: 12px; color: #888;">Lokawani News — Your Daily Multilingual News Portal</p>
        <p style="margin: 4px 0 0; font-size: 11px; color: #aaa;">Please save your Booking ID <strong>${booking.bookingId}</strong> for future reference.</p>
      </div>
    </div>
  `;

  return sendEmail(booking.email, `Booking Confirmed — ${booking.bookingId} | Lokawani News`, html);
};

/**
 * Send Booking Status Update Email (Approved/Rejected)
 */
export const sendBookingStatusEmail = async (booking, status) => {
  const isApproved = status === 'approved';
  const headerColor = isApproved ? '#22c55e' : '#ef4444';
  const headerTitle = isApproved ? 'Booking Approved!' : 'Booking Rejected';
  const headerSubtitle = isApproved ? 'Your advertisement mapping is approved and scheduled.' : 'We could not approve your advertisement booking at this time.';
  const amount = Number(booking.amountPaid).toLocaleString('en-IN');
  
  const statusBadge = isApproved 
    ? '<span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Approved</span>'
    : '<span style="background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Rejected</span>';

  const nextStepsHTML = isApproved
    ? `<li>Your ad will go live automatically on the scheduled start date.</li>
       <li>You can track its performance in your dashboard once it's active.</li>
       <li>Thank you for choosing Lokawani News for your advertising needs.</li>`
    : `<li>Please review our advertising guidelines to ensure your content meets our standards.</li>
       <li>You can submit a new booking request with updated details.</li>
       <li>Any payments processed will be refunded to your original payment method within 3-5 business days.</li>`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <div style="background: ${headerColor}; color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">${headerTitle}</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">${headerSubtitle}</p>
      </div>

      <div style="padding: 30px 20px;">
        <p style="color: #333;">Dear <strong>${booking.advertiserName}</strong>,</p>
        <p style="color: #555;">Here are your booking details:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px; width: 40%;">Booking ID</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #333;">${booking.bookingId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Business</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #333;">${booking.businessName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Amount Paid</td>
            <td style="padding: 12px 8px; font-weight: bold; color: #c41e3a;">₹${amount}</td>
          </tr>
           <tr>
            <td style="padding: 12px 8px; color: #888; font-size: 13px;">Status</td>
            <td style="padding: 12px 8px;">${statusBadge}</td>
          </tr>
        </table>

        <div style="background: #f8f8f8; border-left: 4px solid ${headerColor}; padding: 15px; border-radius: 0 8px 8px 0; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #333;">What happens next?</p>
          <ol style="margin: 8px 0 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
            ${nextStepsHTML}
          </ol>
        </div>
      </div>
    </div>
  `;

  return sendEmail(booking.email, `Booking ${isApproved ? 'Approved' : 'Rejected'} — Lokawani News`, html);
};

/**
 * Send warning email when a comment or rating is deleted by moderation
 */
export const sendModerationWarningEmail = async (email, name, contentType, contentText, reason) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #ef4444; text-align: center;">Content Moderation Notice</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your recent ${contentType} on Lokawani News was reviewed by our moderation team and has been removed because it violates our community guidelines.</p>
      
      <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #991b1b; text-transform: uppercase; font-weight: bold;">Reason for Removal:</p>
        <p style="margin: 0; color: #7f1d1d; font-style: italic;">"${reason}"</p>
      </div>

      <p style="font-size: 13px; color: #666; border-left: 3px solid #ccc; padding-left: 10px; margin-bottom: 20px;">
        <strong>Your deleted ${contentType}:</strong><br/>
        "${contentText}"
      </p>

      <p>Please ensure future contributions abide by our community standards. Repeated violations may result in account suspension.</p>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0 15px;" />
      <p style="font-size: 12px; color: #888; text-align: center;">Lokawani News Moderation Team</p>
    </div>
  `;

  return sendEmail(email, 'Notice regarding your recent content — Lokawani News', html);
};
