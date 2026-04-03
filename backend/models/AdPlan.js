import mongoose from 'mongoose';

const adPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    internalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    durationDays: {
      type: Number,
      default: 7
    },
    placements: [{
      type: String,
      enum: ['header', 'sidebar', 'footer', 'inline', 'popup', 'in-feed']
    }],
    perks: [{
      type: String
    }],
    isCustom: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('AdPlan', adPlanSchema);
