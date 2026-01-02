import jwt from 'jsonwebtoken';
import Reporter from '../models/Reporter.js';

/**
 * Middleware to authenticate reporter using JWT token
 * Protects routes that require reporter authentication
 */
export const authenticateReporter = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Access denied.' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if reporter exists
    const reporter = await Reporter.findById(decoded.id).select('-password');
    
    if (!reporter) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Reporter not found.' 
      });
    }

    // Attach reporter to request object
    req.reporter = reporter;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error', 
      error: error.message 
    });
  }
};

/**
 * Middleware to check if reporter is admin
 * Protects routes that require admin privileges
 */
export const requireAdmin = (req, res, next) => {
  if (req.reporter.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

