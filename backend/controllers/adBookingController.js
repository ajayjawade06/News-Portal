import AdBooking from '../models/AdBooking.js';
import Ad from '../models/Ad.js';

// Max simultaneous bookings per placement. Increased to 5 to allow rotational setups.
const MAX_ADS_PER_PLACEMENT = {
  'header': 5,
  'sidebar': 5,
  'in-feed': 5
};

// Public: Book a new advertisement slot
export const bookAdvertisement = async (req, res) => {
  try {
    const { advertiserName, email, businessName, planId, placement, startDate, endDate, amountPaid } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // 1. Check availability for the requested dates and placement
    // Find all active Ads in this placement that overlap with the requested dates
    const overlappingAds = await Ad.countDocuments({
      placement,
      isActive: true,
      $and: [
        { startDate: { $lte: end } },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: start } }
          ]
        }
      ]
    });

    // Find all pending/approved AdBookings in this placement that overlap
    const overlappingBookings = await AdBooking.countDocuments({
      placement,
      status: { $in: ['pending', 'approved'] },
      $and: [
        { startDate: { $lte: end } },
        { endDate: { $gte: start } }
      ]
    });

    const totalOverlapping = overlappingAds + overlappingBookings;
    const maxAllowed = MAX_ADS_PER_PLACEMENT[placement] || 5;

    if (totalOverlapping >= maxAllowed) {
      return res.status(400).json({
        success: false,
        message: `The ${placement} placement is fully booked for the selected dates. Please choose different dates or a different placement.`
      });
    }

    // 2. Create the booking
    const booking = await AdBooking.create({
      advertiserName,
      email,
      businessName,
      planId,
      placement,
      startDate: start,
      endDate: end,
      amountPaid
    });

    res.status(201).json({
      success: true,
      message: 'Advertisement booked successfully! Our team will contact you shortly.',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing advertisement booking',
      error: error.message
    });
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await AdBooking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Public: Get booked date ranges for a placement so frontend can block unavailable dates
export const getBookedDates = async (req, res) => {
  try {
    const { placement } = req.query;
    if (!placement) {
      return res.status(400).json({ success: false, message: 'placement query param required' });
    }

    const now = new Date();

    // Fetch active Ad slots for this placement
    const adSlots = await Ad.find({
      placement,
      isActive: true,
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    }, { startDate: 1, endDate: 1 });

    // Fetch pending/approved bookings for this placement
    const bookings = await AdBooking.find({
      placement,
      status: { $in: ['pending', 'approved'] },
      endDate: { $gte: now }
    }, { startDate: 1, endDate: 1, status: 1 });

    const maxAllowed = MAX_ADS_PER_PLACEMENT[placement] || 5;

    res.json({
      success: true,
      data: {
        maxAllowed,
        adSlots: adSlots.map(a => ({ startDate: a.startDate, endDate: a.endDate })),
        bookings: bookings.map(b => ({ startDate: b.startDate, endDate: b.endDate, status: b.status }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching booked dates', error: error.message });
  }
};

// Admin: Update booking status (approve / reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const booking = await AdBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: `Booking ${status} successfully`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking status', error: error.message });
  }
};
