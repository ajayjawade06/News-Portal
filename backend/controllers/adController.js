import Ad from '../models/Ad.js';
import AdBooking from '../models/AdBooking.js';

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

const viewTracker = new Map();
const clickTracker = new Map();
const TTL = 3600000; // 1 hour

// Clean up maps periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of viewTracker.entries()) {
    if (now - timestamp > TTL) viewTracker.delete(key);
  }
  for (const [key, timestamp] of clickTracker.entries()) {
    if (now - timestamp > TTL) clickTracker.delete(key);
  }
}, TTL);

const isTrackedRecently = (tracker, key) => {
  const now = Date.now();
  if (tracker.has(key)) {
    if (now - tracker.get(key) < TTL) {
      return true;
    }
  }
  tracker.set(key, now);
  return false;
};

// Public: Track a view (called by frontend when ad enters viewport)
export const trackView = async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const trackKey = `${ip}_${req.params.id}`;
    
    if (isTrackedRecently(viewTracker, trackKey)) {
      return res.json({ success: true, message: 'Already tracked view recently' });
    }

    await Ad.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// Public: Track a click (called by frontend when ad link is clicked)
export const trackClick = async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const trackKey = `${ip}_${req.params.id}`;
    
    if (isTrackedRecently(clickTracker, trackKey)) {
      return res.json({ success: true, message: 'Already tracked click recently' });
    }

    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// Admin: Get aggregated analytics summary with revenue logic
export const getAnalyticsSummary = async (req, res) => {
  try {
    const now = new Date();
    const ads = await Ad.find({}, { title: 1, placement: 1, views: 1, clicks: 1, isActive: 1, plan: 1, price: 1, startDate: 1, endDate: 1 })
      .sort({ views: -1 });

    // Revenue Logic: 
    // 1. Manual Ads: ONLY active ads within their date range count
    const activeAds = ads.filter(ad => {
      const isWithinDate = (!ad.startDate || ad.startDate <= now) && (!ad.endDate || ad.endDate >= now);
      return ad.isActive && isWithinDate;
    });
    const manualRevenue = activeAds.reduce((sum, ad) => sum + (ad.price || 0), 0);

    // 2. Client Bookings: All approved bookings count
    const approvedBookings = await AdBooking.find({ status: 'approved' });
    const bookingRevenue = approvedBookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

    const totalRevenue = manualRevenue + bookingRevenue;
    const totalViews = ads.reduce((s, a) => s + (a.views || 0), 0);
    const totalClicks = ads.reduce((s, a) => s + (a.clicks || 0), 0);
    const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

    // Chart Data: Plan Distribution
    const planCounts = ads.reduce((acc, ad) => {
      acc[ad.plan] = (acc[ad.plan] || 0) + 1;
      return acc;
    }, {});
    
    const planDistribution = [
      { name: 'Basic', value: planCounts['basic'] || 0, color: '#ef4444' }, // editorial red
      { name: 'Standard', value: planCounts['standard'] || 0, color: '#1f2937' }, // ink
      { name: 'Premium', value: planCounts['premium'] || 0, color: '#2563eb' }, // blue
      { name: 'Enterprise', value: planCounts['enterprise'] || 0, color: '#fbbf24' } // yellow
    ];

    // Chart Data: Click Performance (Top 5)
    const topAdsByClicks = [...ads]
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 5)
      .map(ad => ({
        name: ad.title.length > 15 ? ad.title.substring(0, 15) + '...' : ad.title,
        clicks: ad.clicks || 0
      }));

    // Revenue by placement (for charts)
    const revenueByPlacement = activeAds.reduce((acc, ad) => {
      acc[ad.placement] = (acc[ad.placement] || 0) + ad.price;
      return acc;
    }, {});

    const placementRevenueData = Object.keys(revenueByPlacement).map(p => ({
      name: p.charAt(0).toUpperCase() + p.slice(1),
      revenue: revenueByPlacement[p]
    }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        manualRevenue,
        bookingRevenue,
        totalAdsRunning: activeAds.length,
        totalClicks,
        totalViews,
        avgCtr,
        planDistribution,
        topAdsByClicks,
        placementRevenueData,
        ads // full list for tables
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
