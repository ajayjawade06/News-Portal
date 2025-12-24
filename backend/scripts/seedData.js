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
      email: 'reporter@news.com',
      password: 'admin123' // Will be hashed automatically
    });
    await reporter.save();
    console.log('✅ Created reporter account:');
    console.log('   Email: reporter@news.com');
    console.log('   Password: admin123');

    // Create sample news posts
    // Note: Seed data includes pre-translated content for demonstration
    // In production, baseLanguage would be set and translations auto-generated
    const sampleNews = [
      {
        baseLanguage: 'en', // Base language for seed data
        title: {
          en: 'Local Festival Brings Community Together',
          hi: 'स्थानीय त्योहार समुदाय को एक साथ लाता है',
          mr: 'स्थानीय सण समुदायाला एकत्र आणते'
        },
        content: {
          en: 'The annual local festival was celebrated with great enthusiasm this year. Thousands of residents gathered to enjoy traditional food, music, and cultural performances. The event showcased the rich cultural heritage of our region.',
          hi: 'इस वर्ष वार्षिक स्थानीय त्योहार बड़े उत्साह के साथ मनाया गया। हजारों निवासी पारंपरिक भोजन, संगीत और सांस्कृतिक प्रदर्शन का आनंद लेने के लिए एकत्र हुए।',
          mr: 'या वर्षी वार्षिक स्थानीय सण मोठ्या उत्साहाने साजरा करण्यात आला. हजारो रहिवासी पारंपरिक अन्न, संगीत आणि सांस्कृतिक कार्यक्रमांचा आनंद घेण्यासाठी एकत्र आले.'
        },
        coverage: 'local',
        category: 'Culture',
        published: true
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'National GDP Growth Exceeds Expectations',
          hi: 'राष्ट्रीय सकल घरेलू उत्पाद वृद्धि अपेक्षाओं से अधिक',
          mr: 'राष्ट्रीय सकल देशांतर्गत उत्पाद वाढ अपेक्षांपेक्षा जास्त'
        },
        content: {
          en: 'The national economy has shown remarkable growth this quarter, exceeding all expectations. Experts attribute this success to strong manufacturing output and increased foreign investment. The government has announced new initiatives to sustain this growth momentum.',
          hi: 'राष्ट्रीय अर्थव्यवस्था ने इस तिमाही में उल्लेखनीय वृद्धि दिखाई है, जो सभी अपेक्षाओं से अधिक है। विशेषज्ञ इस सफलता को मजबूत विनिर्माण उत्पादन और बढ़े हुए विदेशी निवेश के लिए जिम्मेदार ठहराते हैं।',
          mr: 'राष्ट्रीय अर्थव्यवस्थेने या तिमाहीत उल्लेखनीय वाढ दर्शविली आहे, जी सर्व अपेक्षांपेक्षा जास्त आहे. तज्ज्ञ या यशाचे श्रेय मजबूत उत्पादन आणि वाढलेल्या परदेशी गुंतवणुकीला देतात.'
        },
        coverage: 'national',
        category: 'Economy',
        published: true
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'International Climate Summit Reaches Historic Agreement',
          hi: 'अंतर्राष्ट्रीय जलवायु शिखर सम्मेलन ने ऐतिहासिक समझौता किया',
          mr: 'आंतरराष्ट्रीय हवामान शिखर परिषदेने ऐतिहासिक करार केला'
        },
        content: {
          en: 'World leaders have reached a historic agreement at the International Climate Summit. The new pact commits nations to reduce carbon emissions by 50% by 2030. Environmental activists worldwide have praised this as a crucial step towards combating climate change.',
          hi: 'विश्व नेताओं ने अंतर्राष्ट्रीय जलवायु शिखर सम्मेलन में एक ऐतिहासिक समझौता किया है। नए समझौते में देशों ने 2030 तक कार्बन उत्सर्जन को 50% तक कम करने का संकल्प लिया है।',
          mr: 'जगभरातील नेत्यांनी आंतरराष्ट्रीय हवामान शिखर परिषदेत ऐतिहासिक करार केला आहे. नवीन करारात देशांनी 2030 पर्यंत कार्बन उत्सर्जन 50% कमी करण्याची प्रतिबद्धता व्यक्त केली आहे.'
        },
        coverage: 'international',
        category: 'Environment',
        published: true
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Local Sports Team Wins Championship',
          hi: 'स्थानीय खेल टीम ने चैंपियनशिप जीती',
          mr: 'स्थानीय क्रीडा संघाने विजेतेपद जिंकले'
        },
        content: {
          en: 'Our local sports team has achieved a remarkable victory, winning the regional championship for the first time in 20 years. The team displayed exceptional skill and determination throughout the tournament. Fans celebrated throughout the city.',
          hi: 'हमारी स्थानीय खेल टीम ने एक उल्लेखनीय जीत हासिल की है, 20 वर्षों में पहली बार क्षेत्रीय चैंपियनशिप जीती है। टीम ने पूरे टूर्नामेंट में असाधारण कौशल और दृढ़ संकल्प दिखाया।',
          mr: 'आमच्या स्थानीय क्रीडा संघाने उल्लेखनीय विजय मिळवला आहे, 20 वर्षांत प्रथमच प्रादेशिक विजेतेपद जिंकले आहे. संघाने संपूर्ण स्पर्धेत असाधारण कौशल्य आणि दृढनिश्चय दर्शविला.'
        },
        coverage: 'local',
        category: 'Sports',
        published: true
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'National Education Policy Reforms Announced',
          hi: 'राष्ट्रीय शिक्षा नीति सुधारों की घोषणा',
          mr: 'राष्ट्रीय शिक्षा धोरण सुधारणांची घोषणा'
        },
        content: {
          en: 'The government has announced major reforms to the national education policy. The new framework focuses on skill-based learning and digital literacy. Education experts believe these changes will better prepare students for the modern workforce.',
          hi: 'सरकार ने राष्ट्रीय शिक्षा नीति में प्रमुख सुधारों की घोषणा की है। नया ढांचा कौशल-आधारित शिक्षा और डिजिटल साक्षरता पर केंद्रित है।',
          mr: 'सरकारने राष्ट्रीय शिक्षा धोरणात मोठ्या सुधारणांची घोषणा केली आहे. नवीन चौकट कौशल्य-आधारित शिक्षण आणि डिजिटल साक्षरतेवर लक्ष केंद्रित करते.'
        },
        coverage: 'national',
        category: 'Education',
        published: true
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Draft: Upcoming Technology Conference',
          hi: 'मसौदा: आगामी प्रौद्योगिकी सम्मेलन',
          mr: 'मसुदा: आगामी तंत्रज्ञान परिषद'
        },
        content: {
          en: 'A major technology conference is scheduled for next month. The event will feature keynote speakers from leading tech companies and showcase the latest innovations in artificial intelligence and machine learning.',
          hi: 'अगले महीने एक प्रमुख प्रौद्योगिकी सम्मेलन निर्धारित है। इस कार्यक्रम में अग्रणी तकनीकी कंपनियों के मुख्य वक्ता शामिल होंगे और कृत्रिम बुद्धिमत्ता और मशीन लर्निंग में नवीनतम नवाचारों का प्रदर्शन करेंगे।',
          mr: 'पुढच्या महिन्यात एक मोठी तंत्रज्ञान परिषद नियोजित आहे. या कार्यक्रमात अग्रगण्य तंत्रज्ञान कंपन्यांचे मुख्य वक्ते असतील आणि कृत्रिम बुद्धिमत्ता आणि मशीन लर्निंगमधील नवीनतम नवकल्पना दर्शविल्या जातील.'
        },
        coverage: 'international',
        category: 'Technology',
        published: false // Draft
      }
    ];

    await News.insertMany(sampleNews);
    console.log(`✅ Created ${sampleNews.length} sample news posts`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📝 Sample News Posts:');
    console.log('   - 5 Published posts');
    console.log('   - 1 Draft post');
    console.log('   - Coverage: Local, National, International');
    console.log('   - Categories: Culture, Economy, Environment, Sports, Education, Technology');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

