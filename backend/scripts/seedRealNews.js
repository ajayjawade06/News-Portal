import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';
import Ad from '../models/Ad.js';
import { internationalNews } from './newsInternational.js';
import { nationalNews } from './newsNational.js';
import { maharashtraNews, chandrapurNews, rajuraNews, korpanaNews } from './newsRegional.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

async function seedRealNews() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await News.deleteMany({});
    console.log('🗑️ Cleared all existing news');
    await Ad.deleteMany({});
    console.log('🗑️ Cleared all existing ads');

    const allNews = [
      ...internationalNews,
      ...nationalNews,
      ...maharashtraNews,
      ...chandrapurNews,
      ...rajuraNews,
      ...korpanaNews,
    ];

    const result = await News.insertMany(allNews);

    console.log(`\n✅ Successfully inserted ${result.length} news articles!`);
    console.log(`   🌍 International: ${internationalNews.length}`);
    console.log(`   🇮🇳 National: ${nationalNews.length}`);
    console.log(`   📍 Maharashtra: ${maharashtraNews.length}`);
    console.log(`   📍 Chandrapur: ${chandrapurNews.length}`);
    console.log(`   📍 Rajura: ${rajuraNews.length}`);
    console.log(`   📍 Korpana: ${korpanaNews.length}`);
    console.log(`\n   Categories: ${[...new Set(allNews.map(n => n.category))].join(', ')}`);
    console.log(`   Views range: ${Math.min(...allNews.map(n => n.views))} — ${Math.max(...allNews.map(n => n.views))}`);

    await mongoose.connection.close();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedRealNews();
