import Ad from '../models/Ad.js';

// Get active ads based on placement
export const getActiveAds = async (req, res) => {
  try {
    const { placement } = req.query;
    const now = new Date();

    const query = {
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    };

    if (placement) {
      query.placement = placement;
    }

    const ads = await Ad.find(query).sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active ads',
      error: error.message
    });
  }
};

// Admin: Get all ads
export const getAllAdsAdmin = async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ads',
      error: error.message
    });
  }
};

// Admin: Create ad
export const createAd = async (req, res) => {
  try {
    const adData = {
      ...req.body,
      createdBy: req.reporter._id
    };

    // If there's an image file uploaded, set it to the content
    if (req.file) {
      adData.content = `/uploads/ads/${req.file.filename}`;
    }

    const ad = await Ad.create(adData);

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating ad',
      error: error.message
    });
  }
};

// Admin: Update ad
export const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    const updates = { ...req.body };
    
    // Convert empty strings to null for endDate, otherwise Mongoose cast error
    if (updates.endDate === "") {
        updates.endDate = null;
    }

    if (req.file) {
      updates.content = `/uploads/ads/${req.file.filename}`;
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Ad updated successfully',
      data: updatedAd
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ad',
      error: error.message
    });
  }
};

// Admin: Delete ad
export const deleteAd = async (req, res) => {
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
};

// Admin: Toggle ad active status
export const toggleAdActiveStatus = async (req, res) => {
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
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ad status',
      error: error.message
    });
  }
};
