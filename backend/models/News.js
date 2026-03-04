import mongoose from 'mongoose';

/**
 * News Schema with Auto-Translation Support
 * 
 * For MCA Viva: This schema includes:
 * - baseLanguage: The language in which reporter writes the news
 * - title/subHeading/content: Multilingual fields (en, hi, mr) automatically populated via translation
 * - location: Location-based coverage (maharashtra, chandrapur, korpana, rajura)
 *   This replaces the old coverage field (local/national/international) to provide
 *   more specific location-based news filtering for regional news portals.
 * - views: Tracks how many times a news article has been viewed by guests
 *   Used for trending news calculation (highest views = most trending)
 * - subHeading: Optional sub-heading that provides additional context to the title
 *   Improves readability and helps readers quickly understand the news topic
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
  // Sub-heading: Additional context below the title
  // Auto-translated to all languages like title and content
  // Improves readability and helps readers quickly understand news context
  subHeading: {
    en: {
      type: String,
      default: '',
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
  // Location-based coverage: Replaces old coverage field (local/national/international)
  // Allows filtering news by specific locations: maharashtra, chandrapur, korpana, rajura
  // This is more useful for regional news portals that focus on specific geographic areas
  location: {
    type: String,
    enum: ['maharashtra', 'chandrapur', 'korpana', 'rajura'],
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
  // Views counter: Tracks how many times guests have viewed this article
  // Used for trending news calculation - articles with highest views are most trending
  // Incremented automatically when a guest opens the news detail page (NOT on list views)
  // 
  // Validation: Always a number, defaults to 0 if undefined
  // This ensures trending news sorting works correctly
  views: {
    type: Number,
    default: 0,
    min: 0, // Views cannot be negative
    // Custom validator that handles undefined/null gracefully
    validate: {
      validator: function(value) {
        // Allow undefined/null (will use default)
        if (value === undefined || value === null) return true;
        // If value exists, it must be an integer >= 0
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Views must be a non-negative integer'
    }
  },
  // Array of comments from readers. Since we don't have login, each comment stores
  // the name provided by the user along with the text and timestamp. This is kept
  // simple and public; comments are available when fetching the article.
  comments: [
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // which reporter created the article
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reporter'
  },
  // who most recently published it (username kept by population)
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reporter'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
// Updated to use 'location' instead of 'coverage'
newsSchema.index({ location: 1, published: 1, createdAt: -1 });
newsSchema.index({ category: 1, published: 1 });
// Index for trending news queries (sort by views descending)
newsSchema.index({ published: 1, views: -1 });
// Index for latest news queries (sort by createdAt descending)
newsSchema.index({ published: 1, createdAt: -1 });

const News = mongoose.model('News', newsSchema);

export default News;

