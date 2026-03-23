import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ad from '../models/Ad.js';

dotenv.config();

const REPORTER_ID = '699f81ae62ec194ac0248019';

const ads = [
  {
    title: 'Modern Furniture Sale',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=728&h=90',
    targetLink: 'https://unsplash.com',
    placement: 'header',
    priority: 10,
    plan: 'premium',
    price: 4999,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Luxury Watches Exclusive',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=600',
    targetLink: 'https://unsplash.com',
    placement: 'sidebar',
    priority: 5,
    plan: 'standard',
    price: 2499,
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Gourmet Coffee Subscription',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=728&h=250',
    targetLink: 'https://unsplash.com',
    placement: 'in-feed',
    priority: 8,
    plan: 'premium',
    price: 3999,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Travel Paradise Deals',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=728&h=90',
    targetLink: 'https://unsplash.com',
    placement: 'footer',
    priority: 3,
    plan: 'basic',
    price: 999,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Tech Gadgets 2026',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=728&h=250',
    targetLink: 'https://unsplash.com',
    placement: 'inline',
    priority: 6,
    plan: 'standard',
    price: 2999,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

const seedAds = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI not found');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Optionally clear existing ads
    // await Ad.deleteMany({});
    // console.log('🗑️ Cleared existing ads');

    const adsWithReporter = ads.map(ad => ({ ...ad, createdBy: REPORTER_ID }));
    await Ad.insertMany(adsWithReporter);
    console.log('✨ Seeded dummy ads successfully');

    mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding ads:', error);
    process.exit(1);
  }
};

seedAds();
