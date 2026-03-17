import express from 'express';
import {
  bookAdvertisement,
  getAllBookings,
  getBookedDates,
  updateBookingStatus
} from '../controllers/adBookingController.js';
import { authenticateReporter } from '../middleware/auth.js';

const router = express.Router();

// Public: Book an ad slot (called by advertisers)
router.post('/book', bookAdvertisement);

// Public: Get booked date ranges for a placement (used by CheckoutModal to block dates)
router.get('/booked-dates', getBookedDates);

// Admin: Get all bookings
router.get('/', authenticateReporter, getAllBookings);

// Admin: Update booking status (approve / reject)
router.patch('/:id/status', authenticateReporter, updateBookingStatus);

export default router;
