import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a new order
// @route   POST /api/razorpay/order
// @access  Public (or Protected depending on requirements)
export const createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message,
    });
  }
};

// @desc    Verify payment signature
// @route   POST /api/razorpay/verify
// @access  Public
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment details missing' });
  }

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature === expectedSign) {
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid signature, payment verification failed',
    });
  }
};
