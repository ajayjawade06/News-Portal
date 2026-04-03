import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['image', 'script'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    targetLink: {
      type: String,
      trim: true
    },
    placement: {
      type: String,
      enum: ['header', 'sidebar', 'footer', 'inline', 'popup', 'in-feed'],
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reporter',
      required: true
    },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    plan: {
      type: String,
      default: 'none'
    },
    price: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Ad', adSchema);
