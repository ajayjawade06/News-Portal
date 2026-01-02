import express from 'express';
import Ad from '../models/Ad.js';
import { authenticateReporter, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/ads
 * Get ads based on position and page (public route)
 * Query params: position, page
 */
router.get('/', async (req, res) => {
  try {
    const { position, page } = req.query;

    if (!position || !page) {
      return res.status(400).json({
        success: false,
        message: 'Position and page parameters are required'
      });
    }

    const now = new Date();

    // Build query
    const query = {
      position,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    };

    // Handle 'all' page or specific page
    if (page !== 'all') {
      query.$or = [
        { page: 'all' },
        { page }
      ];
    }

    const ads = await Ad.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ads',
      error: error.message
    });
  }
});

/**
 * GET /api/ads/admin
 * Get all ads for admin panel (admin only)
 */
router.get('/admin', authenticateReporter, requireAdmin, async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ads',
      error: error.message
    });
  }
});

/**
 * POST /api/ads
 * Create a new ad (admin only)
 */
router.post('/', authenticateReporter, requireAdmin, async (req, res) => {
  try {
    const { title, imageUrl, redirectUrl, position, page, startDate, endDate } = req.body;

    // Validation
    if (!title || !imageUrl || !redirectUrl || !position || !page || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate URLs
    try {
      new URL(imageUrl);
      new URL(redirectUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const ad = new Ad({
      title,
      imageUrl,
      redirectUrl,
      position,
      page,
      startDate: start,
      endDate: end
    });

    await ad.save();

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      ad
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating ad',
      error: error.message
    });
  }
});

/**
 * PUT /api/ads/:id
 * Update an ad (admin only)
 */
router.put('/:id', authenticateReporter, requireAdmin, async (req, res) => {
  try {
    const { title, imageUrl, redirectUrl, position, page, isActive, startDate, endDate } = req.body;

    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Validate URLs if provided
    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid image URL format'
        });
      }
    }

    if (redirectUrl) {
      try {
        new URL(redirectUrl);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid redirect URL format'
        });
      }
    }

    // Validate dates if provided
    let start = ad.startDate;
    let end = ad.endDate;

    if (startDate) {
      start = new Date(startDate);
    }
    if (endDate) {
      end = new Date(endDate);
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Update fields
    if (title !== undefined) ad.title = title;
    if (imageUrl !== undefined) ad.imageUrl = imageUrl;
    if (redirectUrl !== undefined) ad.redirectUrl = redirectUrl;
    if (position !== undefined) ad.position = position;
    if (page !== undefined) ad.page = page;
    if (isActive !== undefined) ad.isActive = isActive;
    if (startDate !== undefined) ad.startDate = start;
    if (endDate !== undefined) ad.endDate = end;

    await ad.save();

    res.json({
      success: true,
      message: 'Ad updated successfully',
      ad
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating ad',
      error: error.message
    });
  }
});

/**
 * DELETE /api/ads/:id
 * Delete an ad (admin only)
 */
router.delete('/:id', authenticateReporter, requireAdmin, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting ad',
      error: error.message
    });
  }
});

/**
 * PATCH /api/ads/:id/toggle
 * Toggle ad active status (admin only)
 */
router.patch('/:id/toggle', authenticateReporter, requireAdmin, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    ad.isActive = !ad.isActive;
    await ad.save();

    res.json({
      success: true,
      message: `Ad ${ad.isActive ? 'activated' : 'deactivated'} successfully`,
      ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling ad status',
      error: error.message
    });
  }
});

/**
 * PATCH /api/ads/:id/impression
 * Increment impression count (public route)
 */
router.patch('/:id/impression', async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressionsCount: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording impression',
      error: error.message
    });
  }
});

/**
 * PATCH /api/ads/:id/click
 * Increment click count (public route)
 */
router.patch('/:id/click', async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicksCount: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording click',
      error: error.message
    });
  }
});

export default router;