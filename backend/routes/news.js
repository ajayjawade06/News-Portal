import express from 'express';
import News from '../models/News.js';
import { authenticateReporter } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { translateNewsContent } from '../utils/translator.js';

const router = express.Router();

/**
 * GET /api/news
 * Get all published news (public route)
 * Query params: coverage, category, language (for fallback)
 */
router.get('/', async (req, res) => {
  try {
    const { coverage, category, language = 'en' } = req.query;
    
    // Build query - only published news
    const query = { published: true };
    
    if (coverage) {
      query.coverage = coverage;
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
 * GET /api/news/:id
 * Get single news post by ID (public route)
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
 * GET /api/news/admin/all
 * Get all news (including unpublished) - Protected route
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
 * POST /api/news
 * Create new news post with auto-translation - Protected route
 * 
 * For MCA Viva: This endpoint demonstrates:
 * - Single language input (title, content, baseLanguage)
 * - Automatic translation to all supported languages
 * - Fallback mechanism if translation fails
 */
router.post('/', authenticateReporter, upload.single('image'), async (req, res) => {
  try {
    // New simplified input: reporter writes in ONE language only
    const { title, content, baseLanguage = 'en', coverage, category, published } = req.body;

    // Validation
    if (!title || !content || !coverage || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, baseLanguage, coverage, and category'
      });
    }

    // Validate baseLanguage
    if (!['en', 'hi', 'mr'].includes(baseLanguage)) {
      return res.status(400).json({
        success: false,
        message: 'baseLanguage must be one of: en, hi, mr'
      });
    }

    // AUTO-TRANSLATION: Translate title and content to all languages
    // For MCA Viva: This is the core feature - automatic translation
    let translated;
    try {
      translated = await translateNewsContent(title, content, baseLanguage);
    } catch (translationError) {
      // Even if translation fails, save the post with base language only
      // This ensures the post is created even if translation API is down
      console.error('Translation failed, using base language as fallback:', translationError.message);
      translated = {
        title: { [baseLanguage]: title },
        content: { [baseLanguage]: content }
      };
      // Fill other languages with base language as fallback
      ['en', 'hi', 'mr'].forEach(lang => {
        if (lang !== baseLanguage) {
          translated.title[lang] = title;
          translated.content[lang] = content;
        }
      });
    }

    // Build news object with translated content
    const newsData = {
      baseLanguage, // Store the original language reporter wrote in
      title: translated.title, // Contains en, hi, mr translations
      content: translated.content, // Contains en, hi, mr translations
      coverage,
      category,
      published: published === 'true' || published === true
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
 * For MCA Viva: Updates trigger re-translation if title/content/baseLanguage changes
 */
router.put('/:id', authenticateReporter, upload.single('image'), async (req, res) => {
  try {
    // New simplified input: reporter writes in ONE language only
    const { title, content, baseLanguage, coverage, category, published } = req.body;

    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News post not found'
      });
    }

    // Check if title/content/baseLanguage changed - if so, re-translate
    const needsRetranslation = 
      (title && title !== news.title[news.baseLanguage]) ||
      (content && content !== news.content[news.baseLanguage]) ||
      (baseLanguage && baseLanguage !== news.baseLanguage);

    if (needsRetranslation && title && content) {
      // Determine which language to use for translation
      const translationBaseLang = baseLanguage || news.baseLanguage;
      const translationTitle = title || news.title[news.baseLanguage];
      const translationContent = content || news.content[news.baseLanguage];

      // AUTO-TRANSLATION: Re-translate if content changed
      const translated = await translateNewsContent(
        translationTitle,
        translationContent,
        translationBaseLang
      );

      // Update translated content
      news.baseLanguage = translationBaseLang;
      news.title = translated.title;
      news.content = translated.content;
    } else {
      // Only update individual fields if provided (for partial updates)
      if (title) news.title[news.baseLanguage] = title;
      if (content) news.content[news.baseLanguage] = content;
      if (baseLanguage && baseLanguage !== news.baseLanguage) {
        // If baseLanguage changed, need to re-translate
        const translationTitle = news.title[news.baseLanguage];
        const translationContent = news.content[news.baseLanguage];
        const translated = await translateNewsContent(
          translationTitle,
          translationContent,
          baseLanguage
        );
        news.baseLanguage = baseLanguage;
        news.title = translated.title;
        news.content = translated.content;
      }
    }

    // Update other fields
    if (coverage) news.coverage = coverage;
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

