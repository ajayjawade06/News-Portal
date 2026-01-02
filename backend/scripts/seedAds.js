import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ad from '../models/Ad.js';

// Load environment variables
dotenv.config();

const seedAds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/multilingual_news');
    console.log('✅ Connected to MongoDB');

    // Clear existing ads
    await Ad.deleteMany({});
    console.log('🗑️ Cleared existing ads');

    // Sample ad data
    const ads = [
      {
        title: 'Sample Banner Ad 1',
        imageUrl: 'https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=Banner+Ad+1',
        redirectUrl: 'https://example.com/ad1',
        position: 'top-banner',
        page: 'home',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31')
      },
      {
        title: 'Sample Sidebar Ad 1',
        imageUrl: 'https://via.placeholder.com/300x250/10B981/FFFFFF?text=Sidebar+Ad+1',
        redirectUrl: 'https://example.com/sidebar1',
        position: 'sidebar',
        page: 'home',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31')
      },
      {
        title: 'Sample Sidebar Ad 2',
        imageUrl: 'https://via.placeholder.com/300x250/F59E0B/FFFFFF?text=Sidebar+Ad+2',
        redirectUrl: 'https://example.com/sidebar2',
        position: 'sidebar',
        page: 'home',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31')
      },
      {
        title: 'Sample Inline Ad 1',
        imageUrl: 'https://via.placeholder.com/600x100/EF4444/FFFFFF?text=Inline+Ad+1',
        redirectUrl: 'https://example.com/inline1',
        position: 'inline',
        page: 'home',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31')
      },
      {
        title: 'Sample Inline Ad 2',
        imageUrl: 'https://via.placeholder.com/600x100/8B5CF6/FFFFFF?text=Inline+Ad+2',
        redirectUrl: 'https://example.com/inline2',
        position: 'inline',
        page: 'home',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31')
      },
      {
        title: 'Category Banner Ad',
        imageUrl: 'https://via.placeholder.com/800x200/06B6D4/FFFFFF?text=Category+Banner',
        redirectUrl: 'https://example.com/category-ad',
        position: 'top-banner',
        page: 'category',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31')
      },
      {
        title: 'Article Banner Ad',
        imageUrl: 'https://via.placeholder.com/800x200/EC4899/FFFFFF?text=Article+Banner',
        redirectUrl: 'https://example.com/article-ad',
        position: 'top-banner',
        page: 'article',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31')
      }
    ];

    // Insert ads
    await Ad.insertMany(ads);
    console.log(`✅ Seeded ${ads.length} ads successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding ads:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAds();