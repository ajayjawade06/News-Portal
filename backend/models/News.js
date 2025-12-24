import mongoose from 'mongoose';

/**
 * News Schema with Auto-Translation Support
 * 
 * For MCA Viva: This schema includes:
 * - baseLanguage: The language in which reporter writes the news
 * - title/content: Multilingual fields (en, hi, mr) automatically populated via translation
 * - All other fields remain same for backward compatibility
 */
const newsSchema = new mongoose.Schema({
  // Base language: The language reporter writes in (en | hi | mr)
  // Other languages are automatically translated from this
  baseLanguage: {
    type: String,
    enum: ['en', 'hi', 'mr'],
    required: true,
    default: 'en'
  },
  title: {
    en: {
      type: String,
      required: true,
      trim: true
    },
    hi: {
      type: String,
      default: '',
      trim: true
    },
    mr: {
      type: String,
      default: '',
      trim: true
    }
  },
  content: {
    en: {
      type: String,
      required: true
    },
    hi: {
      type: String,
      default: ''
    },
    mr: {
      type: String,
      default: ''
    }
  },
  coverage: {
    type: String,
    enum: ['local', 'national', 'international'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  published: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
newsSchema.index({ coverage: 1, published: 1, createdAt: -1 });
newsSchema.index({ category: 1, published: 1 });

const News = mongoose.model('News', newsSchema);

export default News;

