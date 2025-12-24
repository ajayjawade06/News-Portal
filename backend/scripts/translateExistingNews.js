/**
 * Migration Script: Translate All Existing News Items
 * 
 * This script translates all existing news items that don't have
 * translations in all languages (en, hi, mr).
 * 
 * Usage: node scripts/translateExistingNews.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';
import { translateNewsContent } from '../utils/translator.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multilingual_news';

/**
 * Check if a news item needs translation
 */
function needsTranslation(newsItem) {
  const languages = ['en', 'hi', 'mr'];
  const baseLang = newsItem.baseLanguage || 'en';
  
  // Check if all languages have content
  for (const lang of languages) {
    if (!newsItem.title[lang] || !newsItem.title[lang].trim()) {
      return true;
    }
    if (!newsItem.content[lang] || !newsItem.content[lang].trim()) {
      return true;
    }
  }
  
  return false;
}

/**
 * Translate a single news item
 */
async function translateNewsItem(newsItem) {
  try {
    const baseLang = newsItem.baseLanguage || 'en';
    const baseTitle = newsItem.title[baseLang] || newsItem.title.en || '';
    const baseContent = newsItem.content[baseLang] || newsItem.content.en || '';
    
    if (!baseTitle || !baseContent) {
      console.log(`⚠️  Skipping ${newsItem._id}: Missing base language content`);
      return false;
    }
    
    console.log(`\n📝 Translating news: "${baseTitle.substring(0, 50)}..."`);
    console.log(`   Base Language: ${baseLang}`);
    console.log(`   ID: ${newsItem._id}`);
    
    // Translate to all languages
    const translated = await translateNewsContent(baseTitle, baseContent, baseLang);
    
    // Update the news item
    newsItem.baseLanguage = baseLang;
    newsItem.title = translated.title;
    newsItem.content = translated.content;
    
    await newsItem.save();
    
    console.log(`✅ Successfully translated news: ${newsItem._id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error translating news ${newsItem._id}:`, error.message);
    return false;
  }
}

/**
 * Main function to translate all existing news
 */
async function translateAllNews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find all news items
    const allNews = await News.find({});
    console.log(`\n📊 Found ${allNews.length} news items`);
    
    // Filter news items that need translation
    const newsToTranslate = allNews.filter(needsTranslation);
    console.log(`🔄 ${newsToTranslate.length} news items need translation`);
    
    if (newsToTranslate.length === 0) {
      console.log('\n✅ All news items already have translations!');
      process.exit(0);
    }
    
    // Translate each news item
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < newsToTranslate.length; i++) {
      const newsItem = newsToTranslate[i];
      console.log(`\n[${i + 1}/${newsToTranslate.length}] Processing...`);
      
      const success = await translateNewsItem(newsItem);
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Add a small delay to avoid rate limiting
      if (i < newsToTranslate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Translation Summary:');
    console.log(`   Total items: ${allNews.length}`);
    console.log(`   Needed translation: ${newsToTranslate.length}`);
    console.log(`   ✅ Successfully translated: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log('='.repeat(50));
    
    console.log('\n🎉 Translation process completed!');
    console.log('💡 Refresh your browser to see translated content.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
translateAllNews();

