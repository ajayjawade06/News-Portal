import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

async function seedDummyNews() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('Connected DB:', mongoose.connection.name);

    await News.deleteMany({});
    console.log('🗑️ Cleared existing news');

    const now = Date.now();

    const dummyNews = [

      // ================= MAHARASHTRA =================
      {
        baseLanguage: "en",
        title: {
          en: "Maharashtra Announces Mega Infrastructure Plan",
          hi: "महाराष्ट्र ने मेगा इंफ्रास्ट्रक्चर योजना की घोषणा की",
          mr: "महाराष्ट्राने मेगा पायाभूत सुविधा योजना जाहीर केली"
        },
        subHeading: {
          en: "₹60,000 crore allocated for highways and metro",
          hi: "₹60,000 करोड़ हाईवे और मेट्रो के लिए",
          mr: "₹60,000 कोटी महामार्ग आणि मेट्रोसाठी"
        },
        content: {
          en: "The Maharashtra government unveiled a large-scale infrastructure development program to boost economic growth.",
          hi: "महाराष्ट्र सरकार ने आर्थिक विकास के लिए बड़ी योजना की घोषणा की।",
          mr: "आर्थिक विकासासाठी मोठी योजना जाहीर करण्यात आली."
        },
        location: "maharashtra",
        category: "Infrastructure",
        published: true,
        views: 5200,
        createdAt: new Date(now - 1 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Maharashtra Tourism Records Historic Growth",
          hi: "महाराष्ट्र पर्यटन में ऐतिहासिक वृद्धि",
          mr: "महाराष्ट्र पर्यटनात ऐतिहासिक वाढ"
        },
        subHeading: {
          en: "20 million visitors this year",
          hi: "इस वर्ष 20 मिलियन पर्यटक",
          mr: "या वर्षी 20 दशलक्ष पर्यटक"
        },
        content: {
          en: "Tourism sector reports record-breaking growth across major destinations.",
          hi: "पर्यटन क्षेत्र में रिकॉर्ड वृद्धि दर्ज की गई।",
          mr: "पर्यटन क्षेत्रात विक्रमी वाढ झाली."
        },
        location: "maharashtra",
        category: "Tourism",
        published: true,
        views: 4100,
        createdAt: new Date(now - 3 * 86400000)
      },

      // ================= CHANDRAPUR =================
      {
        baseLanguage: "en",
        title: {
          en: "Chandrapur Launches Digital Literacy Program",
          hi: "चंद्रपुर में डिजिटल साक्षरता कार्यक्रम शुरू",
          mr: "चंद्रपूरमध्ये डिजिटल साक्षरता कार्यक्रम सुरू"
        },
        subHeading: {
          en: "Training for 12,000 residents",
          hi: "12,000 लोगों को प्रशिक्षण",
          mr: "12,000 नागरिकांना प्रशिक्षण"
        },
        content: {
          en: "District administration begins free digital training initiative.",
          hi: "जिला प्रशासन ने मुफ्त डिजिटल प्रशिक्षण शुरू किया।",
          mr: "जिल्हा प्रशासनाने मोफत डिजिटल प्रशिक्षण सुरू केले."
        },
        location: "chandrapur",
        category: "Education",
        published: true,
        views: 2700,
        createdAt: new Date(now - 2 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Chandrapur Industrial Zone Expansion Approved",
          hi: "चंद्रपुर औद्योगिक क्षेत्र विस्तार मंजूर",
          mr: "चंद्रपूर औद्योगिक क्षेत्र विस्तार मंजूर"
        },
        subHeading: {
          en: "Expected to create 3,000 jobs",
          hi: "3,000 नौकरियों की संभावना",
          mr: "3,000 नोकऱ्यांची अपेक्षा"
        },
        content: {
          en: "Government clears industrial expansion boosting employment.",
          hi: "सरकार ने औद्योगिक विस्तार को मंजूरी दी।",
          mr: "सरकारने औद्योगिक विस्ताराला मंजुरी दिली."
        },
        location: "chandrapur",
        category: "Business",
        published: true,
        views: 3300,
        createdAt: new Date(now - 4 * 86400000)
      },

      // ================= KORPANA =================
      {
        baseLanguage: "en",
        title: {
          en: "Korpana Gets 24x7 Power Supply",
          hi: "कोरपाना को 24x7 बिजली आपूर्ति",
          mr: "कोरपानाला 24x7 वीज पुरवठा"
        },
        subHeading: {
          en: "5,500 households benefit",
          hi: "5,500 घरों को लाभ",
          mr: "5,500 घरांना लाभ"
        },
        content: {
          en: "Village celebrates uninterrupted electricity supply.",
          hi: "गाँव में लगातार बिजली आपूर्ति शुरू।",
          mr: "गावात अखंड वीज पुरवठा सुरू."
        },
        location: "korpana",
        category: "Infrastructure",
        published: true,
        views: 4500,
        createdAt: new Date(now - 5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Korpana Farmers Shift to Organic Farming",
          hi: "कोरपाना किसान जैविक खेती की ओर",
          mr: "कोरपाना शेतकरी जैविक शेतीकडे"
        },
        subHeading: {
          en: "Sustainable agriculture movement grows",
          hi: "सतत कृषि आंदोलन",
          mr: "शाश्वत शेती आंदोलन"
        },
        content: {
          en: "More than 300 farmers adopt organic techniques.",
          hi: "300 से अधिक किसान जैविक खेती अपना रहे हैं।",
          mr: "300 पेक्षा जास्त शेतकरी जैविक शेती करत आहेत."
        },
        location: "korpana",
        category: "Agriculture",
        published: true,
        views: 2100,
        createdAt: new Date(now - 6 * 86400000)
      },

      // ================= RAJURA =================
      {
        baseLanguage: "en",
        title: {
          en: "Rajura Cultural Festival Draws Huge Crowd",
          hi: "राजुरा सांस्कृतिक उत्सव में बड़ी भीड़",
          mr: "राजुरा सांस्कृतिक महोत्सवात मोठी गर्दी"
        },
        subHeading: {
          en: "Three-day celebration concludes successfully",
          hi: "तीन दिवसीय कार्यक्रम सफलतापूर्वक संपन्न",
          mr: "तीन दिवसीय कार्यक्रम यशस्वी"
        },
        content: {
          en: "Thousands participated in Rajura's annual festival.",
          hi: "हजारों लोग वार्षिक उत्सव में शामिल हुए।",
          mr: "हजारो लोक वार्षिक उत्सवात सहभागी झाले."
        },
        location: "rajura",
        category: "Culture",
        published: true,
        views: 2900,
        createdAt: new Date(now - 7 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Rajura Sports Complex Renovated",
          hi: "राजुरा स्पोर्ट्स कॉम्प्लेक्स का नवीकरण",
          mr: "राजुरा क्रीडा संकुल नूतनीकरण"
        },
        subHeading: {
          en: "Modern gym and swimming pool added",
          hi: "आधुनिक जिम और स्विमिंग पूल",
          mr: "आधुनिक जिम आणि स्विमिंग पूल"
        },
        content: {
          en: "The sports complex now offers world-class facilities.",
          hi: "स्पोर्ट्स कॉम्प्लेक्स में नई सुविधाएं जोड़ी गईं।",
          mr: "क्रीडा संकुलात नवीन सुविधा उपलब्ध."
        },
        location: "rajura",
        category: "Sports",
        published: true,
        views: 2600,
        createdAt: new Date(now - 8 * 86400000)
      },

      // ================= EXTRA ARTICLES =================
      {
        baseLanguage: "en",
        title: {
          en: "Maharashtra Budget Focuses on Rural Development",
          hi: "महाराष्ट्र बजट ग्रामीण विकास पर केंद्रित",
          mr: "महाराष्ट्र अर्थसंकल्प ग्रामीण विकासावर लक्ष"
        },
        subHeading: { en: "40% allocation for agriculture", hi: "40% कृषि के लिए", mr: "40% शेतीसाठी" },
        content: { en: "Budget prioritizes rural infrastructure and farmer welfare.", hi: "बजट ग्रामीण क्षेत्रों पर केंद्रित है।", mr: "अर्थसंकल्प ग्रामीण भागावर लक्ष केंद्रित करतो." },
        location: "maharashtra",
        category: "Politics",
        published: true,
        views: 3800,
        createdAt: new Date(now - 9 * 86400000)
      },

      {
        baseLanguage: "en",
        title: { en: "Chandrapur Hospital Inaugurated", hi: "चंद्रपुर में नया अस्पताल उद्घाटन", mr: "चंद्रपूरमध्ये नवीन रुग्णालय उद्घाटन" },
        subHeading: { en: "200-bed modern facility", hi: "200 बेड की सुविधा", mr: "200 बेड सुविधा" },
        content: { en: "New hospital improves regional healthcare.", hi: "नया अस्पताल स्वास्थ्य सेवाएं बेहतर करेगा।", mr: "नवीन रुग्णालय आरोग्य सेवा सुधारेल." },
        location: "chandrapur",
        category: "Health",
        published: true,
        views: 3100,
        createdAt: new Date(now - 10 * 86400000)
      },

      {
        baseLanguage: "en",
        title: { en: "Korpana Internet Connectivity Improved", hi: "कोरपाना में इंटरनेट सुविधा बेहतर", mr: "कोरपानात इंटरनेट सुविधा सुधारली" },
        subHeading: { en: "Fiber network installed", hi: "फाइबर नेटवर्क स्थापित", mr: "फायबर नेटवर्क बसवले" },
        content: { en: "High-speed internet now available in rural areas.", hi: "ग्रामीण क्षेत्रों में हाई-स्पीड इंटरनेट उपलब्ध।", mr: "ग्रामीण भागात हाय-स्पीड इंटरनेट उपलब्ध." },
        location: "korpana",
        category: "Technology",
        published: true,
        views: 2400,
        createdAt: new Date(now - 11 * 86400000)
      },

      {
        baseLanguage: "en",
        title: { en: "Rajura School Receives Smart Classrooms", hi: "राजुरा स्कूल में स्मार्ट क्लासरूम", mr: "राजुरा शाळेत स्मार्ट वर्ग" },
        subHeading: { en: "Digital education initiative", hi: "डिजिटल शिक्षा पहल", mr: "डिजिटल शिक्षण उपक्रम" },
        content: { en: "Smart classrooms enhance student learning.", hi: "स्मार्ट क्लासरूम से शिक्षा बेहतर।", mr: "स्मार्ट वर्गामुळे शिक्षण सुधारले." },
        location: "rajura",
        category: "Education",
        published: true,
        views: 1800,
        createdAt: new Date(now - 12 * 86400000)
      },

      // ================= DRAFTS =================
      {
        baseLanguage: "en",
        title: { en: "Draft: Upcoming Water Conservation Policy", hi: "मसौदा: जल संरक्षण नीति", mr: "मसुदा: जलसंवर्धन धोरण" },
        subHeading: { en: "Policy under review", hi: "नीति समीक्षा में", mr: "धोरण पुनरावलोकनात" },
        content: { en: "Government is reviewing new water policies.", hi: "सरकार नई नीति की समीक्षा कर रही है।", mr: "सरकार नवीन धोरणाचा आढावा घेत आहे." },
        location: "chandrapur",
        category: "Environment",
        published: false,
        views: 0,
        createdAt: new Date(now - 13 * 86400000)
      },

      {
        baseLanguage: "en",
        title: { en: "Draft: Rural Startup Promotion Scheme", hi: "मसौदा: ग्रामीण स्टार्टअप योजना", mr: "मसुदा: ग्रामीण स्टार्टअप योजना" },
        subHeading: { en: "Support for young entrepreneurs", hi: "युवा उद्यमियों के लिए समर्थन", mr: "तरुण उद्योजकांसाठी समर्थन" },
        content: { en: "A scheme to promote rural entrepreneurship is being planned.", hi: "ग्रामीण उद्यमिता को बढ़ावा देने की योजना।", mr: "ग्रामीण उद्योजकता प्रोत्साहन योजना." },
        location: "maharashtra",
        category: "Business",
        published: false,
        views: 0,
        createdAt: new Date(now - 14 * 86400000)
      }

    ];

    await News.insertMany(dummyNews);
    console.log(`✅ Inserted ${dummyNews.length} news articles`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDummyNews();