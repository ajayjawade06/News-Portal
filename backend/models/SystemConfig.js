import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      default: 'global_settings'
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isDiscountActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('SystemConfig', systemConfigSchema);
