import express from 'express';
import {
  getActiveAds,
  getAllAdsAdmin,
  createAd,
  updateAd,
  deleteAd,
  toggleAdActiveStatus
} from '../controllers/adController.js';
import { authenticateReporter } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer config for ad image uploads
// First ensure the ad upload directory exists
const adsUploadDir = path.join(process.cwd(), 'uploads', 'ads');
if (!fs.existsSync(adsUploadDir)) {
  fs.mkdirSync(adsUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, adsUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

/* ======================================================
   PUBLIC ROUTES
====================================================== */
router.get('/active', getActiveAds);

/* ======================================================
   ADMIN ROUTES (Protected)
====================================================== */
router.get('/', authenticateReporter, getAllAdsAdmin);
router.post('/', authenticateReporter, upload.single('image'), createAd);
router.put('/:id', authenticateReporter, upload.single('image'), updateAd);
router.delete('/:id', authenticateReporter, deleteAd);
router.patch('/:id/toggle', authenticateReporter, toggleAdActiveStatus);

export default router;
