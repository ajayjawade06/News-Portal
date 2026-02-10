import express from 'express';
import News from '../models/News.js';
import { authenticateReporter } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { translateNewsContent } from '../utils/translator.js';

const router = express.Router();

/**
 * GET /api/news
 * Get all published news (public route)
 * Query params: location, category, language (for fallback)
 * 
 * Updated to use 'location' instead of 'coverage' for location-based filtering
 * Location values: maharashtra, chandrapur, korpana, rajura
 * 
 * IMPORTANT: This endpoint does NOT increment views
 * Views are only incremented when a guest opens the detail page (GET /api/news/:id)
 * This ensures accurate view tracking - list views don't count as engagement
 */
router.get('/', async (req, res) => {
  try {
    const { location, category, language = 'en' } = req.query;
    
    // Build query - only published news
    const query = { published: true };
    
    // Support both 'location' (new) and 'coverage' (old) for backward compatibility
    // But prefer 'location' if provided
    if (location) {
      query.location = location;
    } else if (req.query.coverage) {
      // Legacy support: map old coverage values to location if needed
      // For now, just use the coverage value directly if location not provided
      query.location = req.query.coverage;
    }
    
    if (category) {
      query.category = category;
    }

    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
});

/**
 * GET /api/news/latest
 * Get latest published news (public route)
 * Returns 5 most recent published news articles, sorted by createdAt DESC
 * 
 * For MCA Viva: This endpoint powers the "Latest News" sidebar section
 * Shows the most recently published news to keep readers up-to-date
 * 
 * IMPORTANT: This route must come before /:id to avoid route conflicts
 * 
 * Error Handling:
 * - Always returns an array (empty if no news exists)
 * - Never throws errors that crash the frontend
 * - Only returns published news (published: true)
 */
router.get('/latest', async (req, res) => {
  try {
    // Query only published news, sorted by creation date (newest first)
    const news = await News.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-__v')
      .lean(); // Use lean() for better performance

    // Always return an array, even if empty
    // This prevents frontend crashes when no news exists
    res.json({
      success: true,
      count: news ? news.length : 0,
      data: news || []
    });
  } catch (error) {
    // Log error for debugging but return empty array to prevent frontend crash
    console.error('Error fetching latest news:', error);
    res.json({
      success: true, // Still return success to prevent UI crash
      count: 0,
      data: [] // Return empty array instead of throwing error
    });
  }
});

/**
 * GET /api/news/trending
 * Get trending published news (public route)
 * Returns top 5 published news articles with highest views count
 * 
 * For MCA Viva: This endpoint powers the "Trending News" sidebar section
 * Trending logic: Articles with highest views are considered most trending
 * This helps readers discover popular content that others are reading
 * 
 * IMPORTANT: This route must come before /:id to avoid route conflicts
 * 
 * Difference between Latest vs Trending:
 * - Latest: Most recently published news (sorted by createdAt DESC)
 * - Trending: Most viewed news (sorted by views DESC)
 * 
 * Error Handling:
 * - Always returns an array (empty if no news exists)
 * - Handles undefined/null views field (defaults to 0)
 * - Never throws errors that crash the frontend
 * - Only returns published news (published: true)
 */
router.get('/trending', async (req, res) => {
  try {
    // Query only published news
    // Sort by views descending (highest views first), then by creation date
    // Handle cases where views field might be undefined/null (for existing news without views)
    const news = await News.find({ published: true })
      .sort({ 
        views: -1, // Sort by views descending (highest first)
        createdAt: -1 // Secondary sort by date (newest first)
      })
      .limit(5)
      .select('-__v')
      .lean(); // Use lean() for better performance

    // Ensure views field is always a number (default to 0 if undefined/null)
    // This prevents sorting errors and ensures consistent data
    // Handles existing news items that might not have views field
    const newsWithViews = (news || []).map(item => {
      // Convert to plain object if needed
      const newsItem = item.toObject ? item.toObject() : item;
      return {
        ...newsItem,
        views: (typeof newsItem.views === 'number' && newsItem.views >= 0) ? newsItem.views : 0
      };
    });

    // Always return an array, even if empty
    // This prevents frontend crashes when no news exists
    res.json({
      success: true,
      count: newsWithViews.length,
      data: newsWithViews
    });
  } catch (error) {
    // Log error for debugging but return empty array to prevent frontend crash
    console.error('Error fetching trending news:', error);
    res.json({
      success: true, // Still return success to prevent UI crash
      count: 0,
      data: [] // Return empty array instead of throwing error
    });
  }
});

/**
 * GET /api/news/:id
 * Get single news post by ID (public route)
 * Automatically increments view count when accessed by guests
 * 
 * For MCA Viva: This demonstrates view tracking for trending news feature
 * 
 * IMPORTANT: Views are incremented ONLY on the detail page (this endpoint)
 * Views are NOT incremented on:
 * - List views (GET /api/news)
 * - Latest news fetch (GET /api/news/latest)
 * - Trending news fetch (GET /api/news/trending)
 * 
 * This ensures accurate view tracking - only when a guest actually opens and reads the article
 */
/**
 * GET /api/news/:id
 * Get single published news post by ID (public route)
 * Automatically increments view count when accessed by guests
 * 
 * IMPORTANT: Unpublished/draft news is NOT accessible to public users
 * Only authenticated users (admin/reporter) can view draft news via /api/news/admin/:id
 * 
 * For MCA Viva: This demonstrates view tracking for trending news feature
 * 
 * Views are incremented ONLY on the detail page (this endpoint)
 * Views are NOT incremented on:
 * - List views (GET /api/news)
 * - Latest news fetch (GET /api/news/latest)
 * - Trending news fetch (GET /api/news/trending)
 * 
 * This ensures accurate view tracking - only when a guest actually opens and reads the article
 */
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    // SECURITY: Check if news is published
    // Guests (non-authenticated users) can only view published news
    // Draft/unpublished news should not be visible to the public
    if (!news.published) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    // Increment views count ONLY when guest opens the detail page
    // This is used for trending news calculation
    // 
    // Why only on detail page?
    // - List views don't indicate actual engagement
    // - Detail page views show genuine reader interest
    // - This makes trending news more accurate and meaningful
    if (news.published) {
      // Ensure views is always a number (handle undefined/null cases)
      const currentViews = typeof news.views === 'number' && news.views >= 0 ? news.views : 0;
      news.views = currentViews + 1;
      
      // Save with error handling
      try {
        await news.save();
      } catch (saveError) {
        // Log error but don't fail the request
        console.error('Error saving view count:', saveError);
        // Continue to return the news data even if view save fails
      }
    }

    // Ensure views field is a number in response (for consistency)
    const newsData = news.toObject ? news.toObject() : news;
    if (typeof newsData.views !== 'number' || newsData.views < 0) {
      newsData.views = (typeof news.views === 'number' && news.views >= 0) ? news.views : 0;
    }

    res.json({
      success: true,
      data: newsData
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
});

/**
 * GET /api/news/admin/all
 * Get all news (including unpublished) - Protected route
 * Only authenticated reporters can see draft/unpublished news
 */
router.get('/admin/all', authenticateReporter, async (req, res) => {
  try {
    const news = await News.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
});

/**
 * GET /api/news/admin/:id
 * Get single news post by ID (including unpublished/draft) - Protected route
 * Only authenticated reporters can view draft news
 * Public users cannot access this endpoint
 */
router.get('/admin/:id', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
});

/**
 * POST /api/news
 * Create new news post with auto-translation - Protected route
 * 
 * For MCA Viva: This endpoint demonstrates:
 * - Single language input (title, subHeading, content, baseLanguage)
 * - Automatic translation to all supported languages (title, subHeading, content)
 * - Location-based news categorization (maharashtra, chandrapur, korpana, rajura)
 * - Fallback mechanism if translation fails
 */
router.post('/', authenticateReporter, upload.single('image'), async (req, res) => {
  try {
    // New simplified input: reporter writes in ONE language only
    const { title, subHeading = '', content, baseLanguage = 'en', location, category, published } = req.body;

    // Validation
    if (!title || !content || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, baseLanguage, location, and category'
      });
    }

    // Validate baseLanguage
    if (!['en', 'hi', 'mr'].includes(baseLanguage)) {
      return res.status(400).json({
        success: false,
        message: 'baseLanguage must be one of: en, hi, mr'
      });
    }

    // Validate location
    if (!['maharashtra', 'chandrapur', 'korpana', 'rajura'].includes(location)) {
      return res.status(400).json({
        success: false,
        message: 'location must be one of: maharashtra, chandrapur, korpana, rajura'
      });
    }

    // AUTO-TRANSLATION: Translate title, subHeading, and content to all languages
    // For MCA Viva: This is the core feature - automatic translation
    // Sub-heading improves readability by providing additional context below the title
    let translated;
    try {
      translated = await translateNewsContent(title, content, baseLanguage, subHeading);
    } catch (translationError) {
      // Even if translation fails, save the post with base language only
      // This ensures the post is created even if translation API is down
      console.error('Translation failed, using base language as fallback:', translationError.message);
      translated = {
        title: { [baseLanguage]: title },
        subHeading: { [baseLanguage]: subHeading || '' },
        content: { [baseLanguage]: content }
      };
      // Fill other languages with base language as fallback
      ['en', 'hi', 'mr'].forEach(lang => {
        if (lang !== baseLanguage) {
          translated.title[lang] = title;
          translated.subHeading[lang] = subHeading || '';
          translated.content[lang] = content;
        }
      });
    }

    // Build news object with translated content
    const newsData = {
      baseLanguage, // Store the original language reporter wrote in
      title: translated.title, // Contains en, hi, mr translations
      subHeading: translated.subHeading || { en: '', hi: '', mr: '' }, // Contains en, hi, mr translations
      content: translated.content, // Contains en, hi, mr translations
      location, // Location-based coverage (replaces old coverage field)
      category,
      published: published === 'true' || published === true,
      views: 0 // Initialize views counter for trending news feature
    };

    // Add image if uploaded
    if (req.file) {
      newsData.image = `/uploads/${req.file.filename}`;
    }

    const news = new News(newsData);
    await news.save();

    res.status(201).json({
      success: true,
      message: 'News post created successfully with auto-translation',
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating news post',
      error: error.message
    });
  }
});

/**
 * PUT /api/news/:id
 * Update news post with auto-translation - Protected route
 * 
 * For MCA Viva: Updates trigger re-translation if title/subHeading/content/baseLanguage changes
 * Supports location-based updates (replaces old coverage field)
 */
router.put('/:id', authenticateReporter, upload.single('image'), async (req, res) => {
  try {
    // New simplified input: reporter writes in ONE language only
    const { title, subHeading, content, baseLanguage, location, category, published } = req.body;

    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    // Check if title/subHeading/content/baseLanguage changed - if so, re-translate
    const currentBaseLang = news.baseLanguage || 'en';
    const needsRetranslation = 
      (title && title !== news.title[currentBaseLang]) ||
      (subHeading !== undefined && subHeading !== (news.subHeading?.[currentBaseLang] || '')) ||
      (content && content !== news.content[currentBaseLang]) ||
      (baseLanguage && baseLanguage !== currentBaseLang);

    if (needsRetranslation && title && content) {
      // Determine which language to use for translation
      const translationBaseLang = baseLanguage || currentBaseLang;
      const translationTitle = title || news.title[currentBaseLang];
      const translationSubHeading = subHeading !== undefined ? subHeading : (news.subHeading?.[currentBaseLang] || '');
      const translationContent = content || news.content[currentBaseLang];

      // AUTO-TRANSLATION: Re-translate if content changed
      const translated = await translateNewsContent(
        translationTitle,
        translationContent,
        translationBaseLang,
        translationSubHeading
      );

      // Update translated content
      news.baseLanguage = translationBaseLang;
      news.title = translated.title;
      news.subHeading = translated.subHeading || { en: '', hi: '', mr: '' };
      news.content = translated.content;
    } else {
      // Only update individual fields if provided (for partial updates)
      if (title) news.title[currentBaseLang] = title;
      if (subHeading !== undefined) {
        if (!news.subHeading) news.subHeading = { en: '', hi: '', mr: '' };
        news.subHeading[currentBaseLang] = subHeading;
      }
      if (content) news.content[currentBaseLang] = content;
      if (baseLanguage && baseLanguage !== currentBaseLang) {
        // If baseLanguage changed, need to re-translate
        const translationTitle = news.title[currentBaseLang];
        const translationSubHeading = news.subHeading?.[currentBaseLang] || '';
        const translationContent = news.content[currentBaseLang];
        const translated = await translateNewsContent(
          translationTitle,
          translationContent,
          baseLanguage,
          translationSubHeading
        );
        news.baseLanguage = baseLanguage;
        news.title = translated.title;
        news.subHeading = translated.subHeading || { en: '', hi: '', mr: '' };
        news.content = translated.content;
      }
    }

    // Update other fields
    if (location) {
      // Validate location
      if (!['maharashtra', 'chandrapur', 'korpana', 'rajura'].includes(location)) {
        return res.status(400).json({
          success: false,
          message: 'location must be one of: maharashtra, chandrapur, korpana, rajura'
        });
      }
      news.location = location;
    }
    if (category) news.category = category;
    if (published !== undefined) {
      news.published = published === 'true' || published === true;
    }

    // Update image if new one is uploaded
    if (req.file) {
      news.image = `/uploads/${req.file.filename}`;
    }

    await news.save();

    res.json({
      success: true,
      message: 'News post updated successfully',
      data: news
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating news post',
      error: error.message
    });
  }
});

/**
 * PATCH /api/news/:id/increment-views
 * Increment view count for a news article (public route)
 * 
 * For MCA Viva: This endpoint allows explicit view increment
 * (Views are also auto-incremented in GET /api/news/:id, but this provides explicit control)
 */
router.patch('/:id/increment-views', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    // Only increment views for published news
    if (news.published) {
      news.views = (news.views || 0) + 1;
      await news.save();
    }

    res.json({
      success: true,
      message: 'View count incremented',
      data: { views: news.views }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error incrementing view count',
      error: error.message
    });
  }
});

/**
 * DELETE /api/news/:id
 * Delete news post - Protected route
 */
router.delete('/:id', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    res.json({
      success: true,
      message: 'News post deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting news post',
      error: error.message
    });
  }
});

/**
 * PATCH /api/news/:id/publish
 * Toggle publish status - Protected route
 */
router.patch('/:id/publish', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    news.published = !news.published;
    await news.save();

    res.json({
      success: true,
      message: `News post ${news.published ? 'published' : 'unpublished'} successfully`,
      data: news
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating publish status',
      error: error.message
    });
  }
});

export default router;

