import express from 'express';
import jwt from 'jsonwebtoken';
import Reporter from '../models/Reporter.js';
import { authenticateReporter } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new reporter (only one reporter allowed)
 */
router.post('/register', async (req, res) => {
  try {
    // Check if reporter already exists (only one reporter allowed)
    const existingReporter = await Reporter.findOne();
    if (existingReporter) {
      return res.status(400).json({
        success: false,
        message: 'Reporter account already exists. Only one reporter is allowed.'
      });
    }

    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Create reporter
    const reporter = new Reporter({
      username,
      email,
      password
    });

    await reporter.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: reporter._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Reporter registered successfully',
      token,
      reporter: {
        id: reporter._id,
        username: reporter.username,
        email: reporter.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error registering reporter',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Login reporter
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find reporter
    const reporter = await Reporter.findOne({ email });
    if (!reporter) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await reporter.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: reporter._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      reporter: {
        id: reporter._id,
        username: reporter.username,
        email: reporter.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/me
 * Get current reporter info (protected route)
 */
router.get('/me', authenticateReporter, async (req, res) => {
  try {
    res.json({
      success: true,
      reporter: {
        id: req.reporter._id,
        username: req.reporter.username,
        email: req.reporter.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reporter info',
      error: error.message
    });
  }
});

export default router;

