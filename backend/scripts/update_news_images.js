import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import News from '../models/News.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

function getImageKeyword(category) {
    if(!category) return 'news,world';
    category = category.toLowerCase();
    if(category.includes('sport')) return 'sports,cricket';
    if(category.includes('tech')) return 'technology,computer';
    if(category.includes('politi')) return 'politics,election';
    if(category.includes('business')) return 'business,finance';
    if(category.includes('science')) return 'science,research';
    if(category.includes('infrastructure')) return 'infrastructure,building';
    if(category.includes('environment')) return 'environment,nature';
    if(category.includes('entertainment')) return 'entertainment,movie';
    return 'news,world';
}

async function updateImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const articles = await News.find({});
        console.log(`Found ${articles.length} news articles. Updating images where missing or setting default...`);

        let count = 0;
        for (let news of articles) {
            // Overwriting or setting image if it doesn't exist
            if (!news.image || news.image.trim() === '') {
                const keyword = getImageKeyword(news.category);
                const randomId = Math.floor(Math.random() * 1000);
                news.image = `https://loremflickr.com/800/600/${keyword}?random=${randomId}`;
                await news.save();
                count++;
            } else if (news.image && !news.image.startsWith('http') && !news.image.includes('/')) {
                // If the string is a local path but invalid, maybe we should overwrite
                // Let's just focus on empty ones or the ones we just added (which have no image field)
                const keyword = getImageKeyword(news.category);
                const randomId = Math.floor(Math.random() * 1000);
                news.image = `https://loremflickr.com/800/600/${keyword}?random=${randomId}`;
                await news.save();
                count++;
            }
        }
        
        console.log(`Successfully added images to ${count} news items.`);
        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);

    } catch (e) {
        console.error('Error during image update:', e);
        process.exit(1);
    }
}

updateImages();
