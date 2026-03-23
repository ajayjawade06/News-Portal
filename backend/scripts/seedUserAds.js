import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ad from '../models/Ad.js';
import AdBooking from '../models/AdBooking.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const REPORTER_ID = '699f81ae62ec194ac0248019'; // Use existing reporter
const UPLOADS_DIR = 'uploads/ads';

const seedUserAds = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI not found');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Clear existing ads and bookings
    await Ad.deleteMany({});
    await AdBooking.deleteMany({});
    console.log('🗑️ Cleared existing ads and bookings');

    // 2. Get list of uploaded images
    const adFiles = fs.readdirSync(UPLOADS_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    if (adFiles.length === 0) {
      console.log('⚠️ No images found in uploads/ads');
      // Fallback or exit
    }

    const placements = ['header', 'sidebar', 'footer', 'inline', 'in-feed'];
    const plans = ['basic', 'standard', 'premium', 'enterprise'];
    const now = new Date();

    // 3. Create Ads
    const newAds = [];
    adFiles.forEach((file, index) => {
      // Rotate through placements and plans
      const placement = placements[index % placements.length];
      const plan = plans[index % plans.length];
      const price = plan === 'basic' ? 999 : plan === 'standard' ? 2499 : plan === 'premium' ? 4999 : 9999;
      
      newAds.push({
        title: `Campaign ${index + 1}: ${file.split('.')[0]}`,
        type: 'image',
        content: `/uploads/ads/${file}`,
        targetLink: 'https://lokawani.vercel.app',
        placement,
        priority: Math.floor(Math.random() * 10),
        plan,
        price,
        startDate: new Date(now.getTime() - (index * 24 * 60 * 60 * 1000)), // Spread start dates in the past
        endDate: new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)), // 30 days from now
        isActive: true,
        views: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 50) + 5,
        createdBy: REPORTER_ID
      });
    });

    await Ad.insertMany(newAds);
    console.log(`✨ Seeded ${newAds.length} ads with user images`);

    // 4. Create dummy bookings to show "Blocked" dates for demo
    const dummyBookings = [
      {
        advertiserName: 'John Doe',
        email: 'john@example.com',
        businessName: 'Global Tech',
        planId: 'premium',
        placement: 'header',
        startDate: new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000)), // Starts in 2 days
        endDate: new Date(now.getTime() + (16 * 24 * 60 * 60 * 1000)), // Ends in 16 days
        status: 'approved',
        amountPaid: 4999
      },
      {
        advertiserName: 'Jane Smith',
        email: 'jane@fashion.com',
        businessName: 'Vogue Styles',
        planId: 'standard',
        placement: 'sidebar',
        startDate: new Date(),
        endDate: new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)),
        status: 'approved',
        amountPaid: 2499
      },
      {
        advertiserName: 'Mike Ross',
        email: 'mike@delivery.com',
        businessName: 'QuickDrop',
        planId: 'basic',
        placement: 'in-feed',
        startDate: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)),
        endDate: new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000)),
        status: 'pending',
        amountPaid: 999
      }
    ];

    await AdBooking.insertMany(dummyBookings);
    console.log(`📅 Seeded ${dummyBookings.length} bookings for demo blocking`);

    mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding ads:', error);
    process.exit(1);
  }
};

seedUserAds();
