import express from 'express';
import {
  getActivePlans,
  getAllPlansAdmin,
  createPlan,
  updatePlan,
  deletePlan,
  getSystemConfig,
  updateSystemConfig
} from '../controllers/adPlanController.js';
import { authenticateReporter } from '../middleware/auth.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/active', getActivePlans);
router.get('/config', getSystemConfig);

// --- ADMIN ROUTES ---
router.get('/', authenticateReporter, getAllPlansAdmin);
router.post('/', authenticateReporter, createPlan);
router.put('/:id', authenticateReporter, updatePlan);
router.delete('/:id', authenticateReporter, deletePlan);

// Config Admin
router.put('/config/update', authenticateReporter, updateSystemConfig);

export default router;
