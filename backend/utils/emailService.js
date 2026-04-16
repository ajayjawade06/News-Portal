import dotenv from 'dotenv';
dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

/**
 * Send email using Brevo HTTP API (more reliable than SMTP)
 */
const sendEmail = async (to, subject, htmlContent) => {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'Lokawani News', email: EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Brevo API error (${response.status}): ${errorData.message || response.statusText}`);
  }

  return response.json();
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
