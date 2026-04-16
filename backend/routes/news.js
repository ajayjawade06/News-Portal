import express from 'express';
import News from '../models/News.js';
import User from '../models/User.js';
import { authenticateReporter, authenticateUser } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { translateNewsContent } from '../utils/translator.js';
import { sendModerationWarningEmail } from '../utils/emailService.js';

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
      .populate('publishedBy', 'username')
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
      .populate('publishedBy', 'username')
      .populate('createdBy', 'username')
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
   ADMIN MODERATION DASHBOARD ENDPOINTS
====================================================== */

/**
 * GET /api/news/admin/moderation/comments
 * Admin only: Get all deleted comments across all articles
 */
router.get('/admin/moderation/comments', authenticateReporter, async (req, res) => {
  try {
    const news = await News.find({ 'comments.isDeleted': true })
      .populate('publishedBy', 'username')
      .select('title comments');

    const deletedComments = [];
    
    news.forEach(article => {
      const deleted = article.comments.filter(c => c.isDeleted);
      deleted.forEach(comment => {
        deletedComments.push({
          commentId: comment._id,
          newsId: article._id,
          newsTitle: article.title.en,
          commentText: comment.text,
          commentAuthor: comment.name,
          deletedReason: comment.deletedReason,
          deletedAt: comment.deletedAt,
          deletedBy: comment.deletedBy,
          createdAt: comment.createdAt
        });
      });
    });

    // Sort by deletion date (newest first)
    deletedComments.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

    res.json({
      success: true,
      total: deletedComments.length,
      data: deletedComments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deleted comments',
      error: error.message
    });
  }
});

/**
 * GET /api/news/admin/moderation/ratings
 * Admin only: Get all deleted ratings across all articles
 */
router.get('/admin/moderation/ratings', authenticateReporter, async (req, res) => {
  try {
    const news = await News.find({ 'ratings.isDeleted': true })
      .populate('publishedBy', 'username')
      .select('title ratings');

    const deletedRatings = [];
    
    news.forEach(article => {
      const deleted = article.ratings.filter(r => r.isDeleted);
      deleted.forEach(rating => {
        deletedRatings.push({
          ratingId: rating._id,
          newsId: article._id,
          newsTitle: article.title.en,
          ratingValue: rating.ratingValue,
          ratingFeedback: rating.feedback,
          ratingAuthor: rating.name,
          deletedReason: rating.deletedReason,
          deletedAt: rating.deletedAt,
          deletedBy: rating.deletedBy,
          createdAt: rating.createdAt
        });
      });
    });

    // Sort by deletion date (newest first)
    deletedRatings.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

    res.json({
      success: true,
      total: deletedRatings.length,
      data: deletedRatings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deleted ratings',
      error: error.message
    });
  }
});

/**
 * POST /api/news/admin/moderation/comments/restore/:newsId/:commentId
 * Admin only: Restore a deleted comment
 */
router.post('/admin/moderation/comments/restore/:newsId/:commentId', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const comment = news.comments.find(c => c._id.toString() === req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (!comment.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'This comment is not deleted'
      });
    }

    // Restore comment
    comment.isDeleted = false;
    comment.deletedReason = null;
    comment.deletedAt = null;
    comment.deletedBy = null;

    await news.save();

    res.json({
      success: true,
      message: 'Comment restored successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error restoring comment',
      error: error.message
    });
  }
});

/**
 * POST /api/news/admin/moderation/ratings/restore/:newsId/:ratingId
 * Admin only: Restore a deleted rating
 */
router.post('/admin/moderation/ratings/restore/:newsId/:ratingId', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const rating = news.ratings.find(r => r._id.toString() === req.params.ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    if (!rating.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'This rating is not deleted'
      });
    }

    // Restore rating
    rating.isDeleted = false;
    rating.deletedReason = null;
    rating.deletedAt = null;
    rating.deletedBy = null;

    // Recalculate aggregate ratings
    const activeRatings = news.ratings.filter(r => !r.isDeleted);
    if (activeRatings.length > 0) {
      const sum = activeRatings.reduce((acc, r) => acc + r.ratingValue, 0);
      news.aggregateRating.averageRating = (sum / activeRatings.length).toFixed(1);
      news.aggregateRating.totalRatings = activeRatings.length;

      news.aggregateRating.ratingBreakdown = {
        fiveStar: activeRatings.filter(r => r.ratingValue === 5).length,
        fourStar: activeRatings.filter(r => r.ratingValue === 4).length,
        threeStar: activeRatings.filter(r => r.ratingValue === 3).length,
        twoStar: activeRatings.filter(r => r.ratingValue === 2).length,
        oneStar: activeRatings.filter(r => r.ratingValue === 1).length
      };
    }

    await news.save();

    res.json({
      success: true,
      message: 'Rating restored successfully',
      data: news.aggregateRating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error restoring rating',
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
    const news = await News.findById(req.params.id)
      .populate('publishedBy', 'username');

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
      published,
      isFeatured
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
      isFeatured: isFeatured === 'true' || isFeatured === true,
      views: 0,
      createdBy: req.reporter._id
    };
    if (published === 'true' || published === true) {
      // mark who published it
      newsData.publishedBy = req.reporter._id;
    }

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
   ADD COMMENTS (PUBLIC)
====================================================== */

// POST /api/news/:id/comments
// Requires user authentication
router.post('/:id/comments', authenticateUser, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const news = await News.findById(req.params.id);
    if (!news || !news.published) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const userName = (req.user.firstName && req.user.lastName) 
      ? `${req.user.firstName} ${req.user.lastName}` 
      : (req.user.name || req.user.username || 'Anonymous User');

    news.comments.push({ 
      userId: req.user._id, 
      name: userName, // Store current user name for display speed
      text 
    });
    await news.save();

    res.json({
      success: true,
      data: news.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

/**
 * GET /api/news/user/my-comments
 * Get all comments made by the logged-in user
 */
router.get('/user/my-comments', authenticateUser, async (req, res) => {
  try {
    const newsItems = await News.find({ 'comments.userId': req.user._id })
      .select('title comments')
      .lean();

    const myComments = [];
    newsItems.forEach(item => {
      item.comments.forEach(comment => {
        if (comment.userId && comment.userId.toString() === req.user._id.toString()) {
          myComments.push({
            newsId: item._id,
            newsTitle: item.title.en, // default to english title
            text: comment.text,
            createdAt: comment.createdAt,
            isDeleted: comment.isDeleted
          });
        }
      });
    });

    res.json({
      success: true,
      data: myComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your comments',
      error: error.message
    });
  }
});

/**
 * DELETE /api/news/:id/comments/:commentId
 * Admin only: Delete a comment with a reason
 */
router.delete('/:id/comments/:commentId', authenticateReporter, async (req, res) => {
  try {
    const { reason } = req.body;

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const comment = news.comments.find(c => c._id.toString() === req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Mark as deleted
    comment.isDeleted = true;
    comment.deletedReason = reason || 'Deleted by admin due to inappropriate content';
    comment.deletedAt = new Date();
    comment.deletedBy = req.reporter._id;

    await news.save();



    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: {
        commentId: comment._id,
        status: 'deleted'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
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

    // flip publish flag
    news.published = !news.published;
    if (news.published) {
      // record who published it
      news.publishedBy = req.reporter._id;
    }
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

/* ======================================================
   RATINGS SYSTEM
====================================================== */

/**
 * POST /api/news/:id/ratings
 * Requires user authentication
 */
router.post('/:id/ratings', authenticateUser, async (req, res) => {
  try {
    const { ratingValue, feedback } = req.body;

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const news = await News.findById(req.params.id);
    if (!news || !news.published) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Optional: Check if user already rated
    const existingRating = news.ratings.find(r => r.userId && r.userId.toString() === req.user._id.toString());
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this article'
      });
    }

    news.ratings = news.ratings || [];
    const userName = (req.user.firstName && req.user.lastName) 
      ? `${req.user.firstName} ${req.user.lastName}` 
      : (req.user.name || req.user.username || 'Anonymous User');

    const newRating = {
      userId: req.user._id,
      ratingValue,
      feedback: feedback || '',
      name: userName,
      email: req.user.email
    };
    news.ratings.push(newRating);

    // Update aggregate ratings
    const activeRatings = news.ratings.filter(r => !r.isDeleted);
    if (activeRatings.length > 0) {
      const sum = activeRatings.reduce((acc, r) => acc + r.ratingValue, 0);
      news.aggregateRating.averageRating = (sum / activeRatings.length).toFixed(1);
      news.aggregateRating.totalRatings = activeRatings.length;

      news.aggregateRating.ratingBreakdown = {
        fiveStar: activeRatings.filter(r => r.ratingValue === 5).length,
        fourStar: activeRatings.filter(r => r.ratingValue === 4).length,
        threeStar: activeRatings.filter(r => r.ratingValue === 3).length,
        twoStar: activeRatings.filter(r => r.ratingValue === 2).length,
        oneStar: activeRatings.filter(r => r.ratingValue === 1).length
      };
    }

    await news.save();

    res.json({
      success: true,
      message: 'Rating added successfully',
      data: {
        // Return the last pushed item from array because it contains Mongoose injected _id and createdAt
        rating: news.ratings[news.ratings.length - 1],
        aggregateRating: news.aggregateRating
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
});

/**
 * GET /api/news/:id/ratings
 * Get all ratings for an article (excluding deleted ones for regular users)
 */
router.get('/:id/ratings', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const activeRatings = news.ratings.filter(r => !r.isDeleted);

    res.json({
      success: true,
      data: {
        ratings: activeRatings,
        aggregateRating: news.aggregateRating
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings',
      error: error.message
    });
  }
});

/**
 * DELETE /api/news/:id/ratings/:ratingId
 * Admin only: Delete a rating with a reason
 */
router.delete('/:id/ratings/:ratingId', authenticateReporter, async (req, res) => {
  try {
    const { reason } = req.body;

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const rating = news.ratings.find(r => r._id.toString() === req.params.ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Mark as deleted
    rating.isDeleted = true;
    rating.deletedReason = reason || 'Deleted by admin due to inappropriate content';
    rating.deletedAt = new Date();
    rating.deletedBy = req.reporter._id;

    // Recalculate aggregate ratings
    const activeRatings = news.ratings.filter(r => !r.isDeleted);
    if (activeRatings.length > 0) {
      const sum = activeRatings.reduce((acc, r) => acc + r.ratingValue, 0);
      news.aggregateRating.averageRating = (sum / activeRatings.length).toFixed(1);
      news.aggregateRating.totalRatings = activeRatings.length;

      news.aggregateRating.ratingBreakdown = {
        fiveStar: activeRatings.filter(r => r.ratingValue === 5).length,
        fourStar: activeRatings.filter(r => r.ratingValue === 4).length,
        threeStar: activeRatings.filter(r => r.ratingValue === 3).length,
        twoStar: activeRatings.filter(r => r.ratingValue === 2).length,
        oneStar: activeRatings.filter(r => r.ratingValue === 1).length
      };
    } else {
      news.aggregateRating = {
        averageRating: 0,
        totalRatings: 0,
        ratingBreakdown: {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0
        }
      };
    }

    await news.save();



    res.json({
      success: true,
      message: 'Rating deleted successfully',
      data: news.aggregateRating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting rating',
      error: error.message
    });
  }
});

/**
 * GET /api/news/:id/ratings/admin/all
 * Admin only: Get all ratings including deleted ones (with deletion info)
 */
router.get('/:id/ratings/admin/all', authenticateReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Include deleted ratings with deletion info for admin
    const ratingsWithInfo = news.ratings.map(r => ({
      ...r.toObject(),
      status: r.isDeleted ? 'deleted' : 'active'
    }));

    res.json({
      success: true,
      data: {
        ratings: ratingsWithInfo,
        aggregateRating: news.aggregateRating,
        totalRatingsIncludingDeleted: news.ratings.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings',
      error: error.message
    });
  }
});

export default router;