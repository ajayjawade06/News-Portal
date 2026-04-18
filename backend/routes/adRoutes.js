import express from 'express';
import {
  getActiveAds,
  getAllAdsAdmin,
  createAd,
  updateAd,
  deleteAd,
  toggleAdActiveStatus,
  trackView,
  trackClick,
  getAnalyticsSummary
} from '../controllers/adController.js';
import { authenticateReporter } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

/* ======================================================
   PUBLIC ROUTES
====================================================== */
router.get('/active', getActiveAds);
router.post('/:id/view', trackView);
router.post('/:id/click', trackClick);

/* ======================================================
   ADMIN ROUTES (Protected)
====================================================== */
router.get('/', authenticateReporter, getAllAdsAdmin);
router.get('/analytics', authenticateReporter, getAnalyticsSummary);
router.post('/', authenticateReporter, upload.single('image'), createAd);
router.put('/:id', authenticateReporter, upload.single('image'), updateAd);
router.delete('/:id', authenticateReporter, deleteAd);
router.patch('/:id/toggle', authenticateReporter, toggleAdActiveStatus);

export default router;
