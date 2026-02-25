import express from 'express';
import News from '../models/News.js';
import { authenticateReporter } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { translateNewsContent } from '../utils/translator.js';

const router = express.Router();

/* ======================================================
   PUBLIC ROUTES
====================================================== */

/**
 * GET /api/news
 * Get all published news with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { location, category } = req.query;

    const query = { published: true };

    if (location) query.location = location;
    if (category) query.category = category;

    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

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
 * Get 5 most recent published articles
 */
router.get('/latest', async (req, res) => {
  try {
    const news = await News.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-__v')
      .lean();

    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    console.error('Latest fetch error:', error);
    res.json({ success: true, count: 0, data: [] });
  }
});

/**
 * GET /api/news/trending
 * Get 5 most viewed published articles
 */
router.get('/trending', async (req, res) => {
  try {
    const news = await News.find({ published: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(5)
      .select('-__v')
      .lean();

    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    console.error('Trending fetch error:', error);
    res.json({ success: true, count: 0, data: [] });
  }
});

/* ======================================================
   ADMIN ROUTES (Protected)
====================================================== */

/**
 * GET /api/news/admin/all
 */
router.get('/admin/all', authenticateReporter, async (req, res) => {
  try {
    const news = await News.find()
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin news',
      error: error.message
    });
  }
});

/**
 * GET /api/news/admin/:id
 */
router.get('/admin/:id', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.id).select('-__v');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
});

/* ======================================================
   SINGLE NEWS (Public - MUST COME AFTER SPECIFIC ROUTES)
====================================================== */

/**
 * GET /api/news/:id
 * Get single published article and increment views
 */
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news || !news.published) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Atomic increment (better than manual save)
    await News.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });

    res.json({
      success: true,
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

/* ======================================================
   CREATE NEWS
====================================================== */

router.post('/', authenticateReporter, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      subHeading = '',
      content,
      baseLanguage = 'en',
      location,
      category,
      published
    } = req.body;

    if (!title || !content || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, location and category are required'
      });
    }

    let translated;

    try {
      translated = await translateNewsContent(
        title,
        content,
        baseLanguage,
        subHeading
      );
    } catch (err) {
      translated = {
        title: { en: title, hi: title, mr: title },
        subHeading: { en: subHeading, hi: subHeading, mr: subHeading },
        content: { en: content, hi: content, mr: content }
      };
    }

    const newsData = {
      baseLanguage,
      title: translated.title,
      subHeading: translated.subHeading,
      content: translated.content,
      location,
      category,
      published: published === 'true' || published === true,
      views: 0
    };

    if (req.file) {
      newsData.image = `/uploads/${req.file.filename}`;
    }

    const news = await News.create(newsData);

    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: news
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: error.message
    });
  }
});

/* ======================================================
   UPDATE NEWS
====================================================== */

router.put('/:id', authenticateReporter, upload.single('image'), async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const updates = req.body;

    Object.keys(updates).forEach(key => {
      news[key] = updates[key];
    });

    if (req.file) {
      news.image = `/uploads/${req.file.filename}`;
    }

    await news.save();

    res.json({
      success: true,
      message: 'News updated successfully',
      data: news
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: error.message
    });
  }
});

/* ======================================================
   DELETE NEWS
====================================================== */

router.delete('/:id', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.json({
      success: true,
      message: 'News deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: error.message
    });
  }
});

/* ======================================================
   TOGGLE PUBLISH
====================================================== */

router.patch('/:id/publish', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    news.published = !news.published;
    await news.save();

    res.json({
      success: true,
      message: `News ${news.published ? 'published' : 'unpublished'} successfully`,
      data: news
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating publish status',
      error: error.message
    });
  }
});

export default router;