import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdPlan from './models/AdPlan.js';
import SystemConfig from './models/SystemConfig.js';
dotenv.config();

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed Config
    const configExists = await SystemConfig.findOne({ type: 'global_settings' });
    if (!configExists) {
      await SystemConfig.create({ type: 'global_settings', discountPercentage: 10, isDiscountActive: true });
      console.log('Created default SystemConfig');
    }

    const plans = [
      {
        name: 'Basic',
        internalId: 'basic',
        title: 'Basic Plan',
        price: 999,
        durationDays: 7,
        placements: ['sidebar'],
        perks: ['Sidebar Ad Only', '1 Week Campaign', 'Basic Visibility'],
        isCustom: false,
        isActive: true
      },
      {
        name: 'Standard',
        internalId: 'standard',
        title: 'Standard Plan',
        price: 2499,
        durationDays: 7,
        placements: ['sidebar', 'in-feed'],
        perks: ['Sidebar + In-Feed Ads', '1 Week Campaign', 'Medium Visibility', 'Homepage Reach'],
        isCustom: false,
        isActive: true
      },
      {
        name: 'Premium',
        internalId: 'premium',
        title: 'Premium Plan',
        price: 4999,
        durationDays: 7,
        placements: ['header', 'in-feed', 'sidebar'],
        perks: ['ALL placements – Header, In-Feed & Sidebar', '1 Week Campaign', 'Maximum Reach', 'Newsletter Inclusion'],
        isCustom: false,
        isActive: true
      },
      {
        name: 'Enterprise',
        internalId: 'enterprise',
        title: 'Custom Enterprise Plan',
        price: 0,
        durationDays: 1,
        placements: ['header', 'in-feed', 'sidebar'],
        perks: ['Custom Date Range', 'All Placements', 'Weekday/Weekend Pricing', 'Dedicated Account Manager'],
        isCustom: true,
        isActive: true
      }
    ];

    for (const planData of plans) {
      const exists = await AdPlan.findOne({ internalId: planData.internalId });
      if (!exists) {
        await AdPlan.create(planData);
        console.log(`Created plan: ${planData.name}`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDatabase();
