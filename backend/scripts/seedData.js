import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reporter from '../models/Reporter.js';
import News from '../models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multilingual_news';

/**
 * Seed script to populate database with sample data
 * Run with: npm run seed
 */
async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Reporter.deleteMany({});
    await News.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create reporter account
    const reporter = new Reporter({
      username: 'admin',
      email: 'dipakkhekare1@gmail.com',
      password: 'DSK@2026' // Will be hashed automatically
    });
    await reporter.save();
    console.log('✅ Created reporter account:');
    console.log('   Email: dipakkhekare1@gmail.com');
    console.log('   Password: DSK@2026');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

