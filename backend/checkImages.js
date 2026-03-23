import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from './models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

async function verifyImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const news = await News.find({});
    console.log(`Total news items: ${news.length}`);

    const brokenImages = news.filter(n => !n.image || !n.image.startsWith('http'));
    
    if (brokenImages.length > 0) {
      console.log(`Found ${brokenImages.length} items with potentially broken image paths:`);
      brokenImages.forEach(n => {
        console.log(`- ID: ${n._id}, Title: ${n.title.en}, Image: "${n.image}"`);
      });
    } else {
      console.log('All image paths start with http.');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyImages();
