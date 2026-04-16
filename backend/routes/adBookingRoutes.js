import express from 'express';
import {
  bookAdvertisement,
  getAllBookings,
  getBookedDates,
  getUserBookings,
  updateBookingStatus
} from '../controllers/adBookingController.js';
import { authenticateReporter, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// User: Book an ad slot (Protected)
router.post('/book', authenticateUser, bookAdvertisement);

// User: Get current user's bookings (Protected)
router.get('/my-bookings', authenticateUser, getUserBookings);

// Public: Get booked date ranges for a placement
router.get('/booked-dates', getBookedDates);

// Admin: Get all bookings
router.get('/', authenticateReporter, getAllBookings);

// Admin: Update booking status (approve / reject)
router.patch('/:id/status', authenticateReporter, updateBookingStatus);

export default router;
