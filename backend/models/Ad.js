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
      enum: ['header', 'sidebar', 'footer', 'inline', 'popup'],
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
    }
  },
  { timestamps: true }
);

export default mongoose.model('Ad', adSchema);
