import mongoose from 'mongoose';

const adBookingSchema = new mongoose.Schema(
  {
    advertiserName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    planId: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      required: true
    },
    placement: {
      type: String,
      enum: ['header', 'sidebar', 'in-feed'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    amountPaid: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('AdBooking', adBookingSchema);
