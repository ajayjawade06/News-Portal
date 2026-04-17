import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

async function fixIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    console.log('Checking indexes on "users" collection...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    if (indexes.some(i => i.name === 'username_1')) {
      console.log('🗑️  Dropping "username_1" index...');
      await collection.dropIndex('username_1');
      console.log('✅ Index dropped successfully.');
    } else {
      console.log('ℹ️  "username_1" index not found.');
    }

    // Check for other potential conflicts
    if (indexes.some(i => i.name === 'phone_1')) {
       // If phone is unique but user didn't have phone before
       console.log('ℹ️  Found "phone_1" index.');
    }

    console.log('✨ Database cleanup complete.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();
