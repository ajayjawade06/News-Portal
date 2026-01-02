import mongoose from 'mongoose';

/**
 * Ad Schema for Advertising System
 * Supports banner, sidebar, and inline ad placements
 */
const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  redirectUrl: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    enum: ['top-banner', 'sidebar', 'inline'],
    required: true
  },
  page: {
    type: String,
    enum: ['home', 'category', 'article', 'all'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  impressionsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  clicksCount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
adSchema.index({ position: 1, page: 1, isActive: 1 });
adSchema.index({ startDate: 1, endDate: 1 });

const Ad = mongoose.model('Ad', adSchema);

export default Ad;