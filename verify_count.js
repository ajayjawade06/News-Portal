import mongoose from 'mongoose';
import News from './backend/models/News.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

async function verifySeeding() {
  try {
    await mongoose.connect(MONGODB_URI);
    const count = await News.countDocuments();
    const categories = await News.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } }
    ]);
    
    console.log(`Total News Count: ${count}`);
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count}`);
    });
    
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

verifySeeding();
