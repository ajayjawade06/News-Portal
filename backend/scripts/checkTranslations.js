import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multilingual_news';

async function checkTranslations() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const allNews = await News.find({}).limit(5);
    
    console.log(`Found ${allNews.length} news items:\n`);
    
    allNews.forEach((news, index) => {
      console.log(`\n[${index + 1}] News ID: ${news._id}`);
      console.log(`Title EN: ${news.title.en?.substring(0, 60) || 'MISSING'}`);
      console.log(`Title HI: ${news.title.hi?.substring(0, 60) || 'MISSING'}`);
      console.log(`Title MR: ${news.title.mr?.substring(0, 60) || 'MISSING'}`);
      console.log(`Base Language: ${news.baseLanguage || 'en'}`);
      console.log(`Has HI: ${!!news.title.hi && news.title.hi.trim().length > 0}`);
      console.log(`Has MR: ${!!news.title.mr && news.title.mr.trim().length > 0}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTranslations();

