import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';
import Ad from '../models/Ad.js';
import AdBooking from '../models/AdBooking.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

async function clearDummyData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('Connected DB:', mongoose.connection.name);

    // Clear News
    const deletedNewsCount = await News.deleteMany({});
    console.log(`🗑️ Cleared ${deletedNewsCount.deletedCount} news articles`);

    // Clear Ads
    const deletedAdsCount = await Ad.deleteMany({});
    console.log(`🗑️ Cleared ${deletedAdsCount.deletedCount} ads`);

    // Clear Ad Bookings
    const deletedBookingsCount = await AdBooking.deleteMany({});
    console.log(`🗑️ Cleared ${deletedBookingsCount.deletedCount} ad bookings`);

    console.log('✨ Database successfully cleared of dummy news, ads, and bookings!');
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearDummyData();
