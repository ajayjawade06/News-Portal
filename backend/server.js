import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';

import adRoutes from './routes/adRoutes.js';
import adBookingRoutes from './routes/adBookingRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';
import adPlanRoutes from './routes/adPlanRoutes.js';
import userAuthRoutes from './routes/userAuth.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'BREVO_API_KEY'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
  console.warn(`\x1b[33m⚠️  Warning: Missing environment variables: ${missingEnv.join(', ')}\x1b[0m`);
  console.warn('\x1b[33m   Using defaults or some features (like email/auth) may fail.\x1b[0m');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
// CORS configuration for production - More permissive for debugging
const corsOptions = {
  origin: ['https://lokawani.vercel.app', 'https://lokawani.co.in', 'https://www.lokawani.co.in', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};
app.use(cors(corsOptions));

// Additional CORS headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});
// Request logger middleware removed to keep terminal clean

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

app.use('/api/ads', adRoutes);
app.use('/api/bookings', adBookingRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/plans', adPlanRoutes);
app.use('/api/user-auth', userAuthRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:');
    console.error(`   Message: ${error.message}`);
    console.error('   Please check if your IP address is whitelisted in MongoDB Atlas and MONGODB_URI is correct.');
  });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

