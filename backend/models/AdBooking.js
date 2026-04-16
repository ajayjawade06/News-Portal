import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const adBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
    phone: {
      type: String,
      required: true,
      trim: true
    },
    planId: {
      type: String,
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

// Auto-generate bookingId before saving
adBookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'bookingId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const year = new Date().getFullYear();
      const padded = String(counter.seq).padStart(5, '0');
      this.bookingId = `LK-AD-${year}-${padded}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model('AdBooking', adBookingSchema);
