import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';
import { translateNewsContent } from '../utils/translator.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multilingual_news';

async function retranslateDSK() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find DSK news
    const dskNews = await News.findOne({ 'title.en': 'DSK' });
    
    if (!dskNews) {
      console.log('❌ DSK news not found');
      process.exit(1);
    }
    
    console.log('📝 Found DSK news, re-translating...');
    console.log(`Current Title EN: ${dskNews.title.en}`);
    console.log(`Current Title HI: ${dskNews.title.hi}`);
    console.log(`Current Title MR: ${dskNews.title.mr}`);
    console.log(`Base Language: ${dskNews.baseLanguage}\n`);
    
    const baseLang = dskNews.baseLanguage || 'en';
    const baseTitle = dskNews.title.en || '';
    const baseContent = dskNews.content.en || '';
    
    console.log('🔄 Translating...');
    const translated = await translateNewsContent(baseTitle, baseContent, baseLang);
    
    dskNews.title = translated.title;
    dskNews.content = translated.content;
    
    await dskNews.save();
    
    console.log('\n✅ Translation complete!');
    console.log(`New Title EN: ${dskNews.title.en}`);
    console.log(`New Title HI: ${dskNews.title.hi}`);
    console.log(`New Title MR: ${dskNews.title.mr}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

retranslateDSK();

