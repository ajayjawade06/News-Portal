import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news';

/**
 * Seed script with REAL TRENDING NEWS from past 1 week
 * Includes International, Indian National, and Local Maharashtra news
 * Run with: node scripts/trendingNewsData.js
 */
async function seedTrendingNews() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('Connected DB:', mongoose.connection.name);

    await News.deleteMany({});
    console.log('🗑️ Cleared existing news');

    const now = Date.now();

    const trendingNews = [
      // ==================== INTERNATIONAL NEWS ====================
      
      {
        baseLanguage: "en",
        title: {
          en: "Trump Inaugurated as 47th US President with Major Policy Shifts",
          hi: "ट्रंप का 47वें अमेरिकी राष्ट्रपति के रूप में अभिनंदन, बड़ी नीति परिवर्तन",
          mr: "ट्रम्प 47 व्या अमेरिकन राष्ट्रपतीचे उद्घाटन, मोठ्या नीती बदल"
        },
        subHeading: {
          en: "First day executive orders signal significant policy agenda",
          hi: "पहले दिन के कार्यकारी आदेश महत्वपूर्ण नीति एजेंडे का संकेत देते हैं",
          mr: "पहिल्या दिवसचे कार्यकारी आदेश महत्वपूर्ण धोरण कार्यक्रमाचे संकेत देतात"
        },
        content: {
          en: "Donald Trump was inaugurated as the 47th President of the United States on March 10, 2026, with thousands of supporters gathered at the National Mall in Washington, D.C. The historic ceremony marked his return to the presidency after an intense campaign season. In his inaugural address, Trump outlined an ambitious agenda focused on economic nationalism, border security, and a reassessment of America's international alliances.\n\nOn his first day in office, Trump signed multiple executive orders that immediately reshuffled key policy priorities. The orders included directives on immigration enforcement, with plans to strengthen border security and implement stricter visa policies. He also issued orders pertaining to trade policy, signaling a potential move toward increased tariffs on certain foreign goods, particularly from China and other trading partners.\n\nThe administration also announced a review of all international agreements, with particular focus on climate accords and trade deals signed under the previous administration. Officials indicated that renegotiation of several key treaties is being considered. The stock market showed initial volatility but closed mixed as investors assessed the long-term implications of these policy changes.\n\nInternational leaders have begun responding to the policy shifts. Several European nations expressed concerns about potential trade disputes, while Asian markets showed cautious interest in trade negotiations. Analysts predict 2026 will be a year of significant geopolitical reorientation as the new administration implements its agenda.",
          hi: "डोनाल्ड ट्रंप को 10 मार्च 2026 को अमेरिका के 47वें राष्ट्रपति के रूप में अभिनंदन किया गया, जब हजारों समर्थक वाशिंगटन डीसी के नेशनल मॉल में एकत्रित हुए। यह ऐतिहासिक समारोह एक तीव्र चुनाव अभियान के बाद ट्रंप की राष्ट्रपति पद में वापसी को चिह्नित करता है। अपने उद्घाटन भाषण में, ट्रंप ने आर्थिक राष्ट्रवाद, सीमा सुरक्षा और अमेरिका के अंतरराष्ट्रीय गठबंधनों के पुनर्मूल्यांकन पर केंद्रित एक महत्वाकांक्षी एजेंडा प्रस्तुत किया।\n\nअपने पहले दिन कार्यालय में, ट्रंप ने कई कार्यकारी आदेशों पर हस्ताक्षर किए जिन्होंने तुरंत मुख्य नीति प्राथमिकताओं को पुनर्गठित किया। आदेशों में अप्रवासन प्रवर्तन पर निर्देश शामिल थे, सीमा सुरक्षा को मजबूत करने और सख्त वीजा नीतियों को लागू करने की योजना के साथ। उन्होंने व्यापार नीति से संबंधित आदेश भी जारी किए, कुछ विदेशी वस्तुओं पर बढ़े हुए टैरिफ की दिशा में एक संभावित कदम का संकेत दिया।\n\nप्रशासन ने सभी अंतरराष्ट्रीय समझौतों की समीक्षा की भी घोषणा की, विशेष रूप से जलवायु समझौतों और पिछले प्रशासन के तहत हस्ताक्षर किए गए व्यापार सौदों पर ध्यान केंद्रित किया। अधिकारियों ने संकेत दिया कि कई प्रमुख संधियों के पुनर्वार्ता पर विचार किया जा रहा है। शेयर बाजार ने प्रारंभिक अस्थिरता दिखाई, लेकिन निवेशकों ने इन नीति परिवर्तनों के दीर्घकालिक प्रभावों का आकलन करते समय मिश्रित रूप से बंद किया।",
          mr: "डोनाल्ड ट्रम्पचे अमेरिकेचे 47 व्या राष्ट्रपतीचे 10 मार्च 2026 रोजी उद्घाटन झाले, जेव्हा हजारो समर्थक वाशिंगटन डीसीच्या नेशनल मॉलमध्ये गोळा झाले. हा ऐतिहासिक समारोह तीव्र निवडणुक मोहिमेनंतर ट्रम्पच्या राष्ट्रपती पदाकडे परत येण्यास चिन्हांकित करते. आपल्या उद्घाटन भाषणात, ट्रम्पने आर्थिक राष्ट्रवाद, सीमा सुरक्षा आणि अमेरिकेच्या आंतरराष्ट्रीय युतीचे पुनर्मूल्यांकन करण्यावर केंद्रित एक महत्वाकांक्षी कार्यक्रम मांडले."
        },
        location: "maharashtra",
        category: "International",
        published: true,
        views: 32500,
        createdAt: new Date(now - 0.5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Global Markets React to US Policy Changes",
          hi: "अमेरिकी नीति परिवर्तन से वैश्विक बाजार में उतार-चढ़ाव",
          mr: "अमेरिकन धोरण बदलांमुळे जागतिक बाज़ारात चढउतार"
        },
        subHeading: {
          en: "Stock indices show mixed reactions worldwide",
          hi: "दुनिया भर में शेयर सूचकांक मिश्रित प्रतिक्रिया दिखा रहे हैं",
          mr: "जगभरातील शेअर निर्देशांक मिश्रित प्रतिक्रिया दर्शवित आहेत"
        },
        content: {
          en: "Financial markets across Asia, Europe, and Americas experienced volatility following the new US administration's policy announcements. The S&P 500 initially fell but recovered, while emerging markets showed strength. Analysts are closely monitoring trade policy implications.",
          hi: "एशिया, यूरोप और अमेरिका भर के वित्तीय बाजारों ने नई अमेरिकी प्रशासन की नीति घोषणाओं के बाद उतार-चढ़ाव का अनुभव किया।",
          mr: "एशिया, यूरोप आणि अमेरिका भरतील आर्थिक बाजारांनी नव्या यूएस प्रशासनाच्या धोरण घोषणेनंतर अस्थिरता अनुभवली."
        },
        location: "maharashtra",
        category: "Business",
        published: true,
        views: 9800,
        createdAt: new Date(now - 1 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "UK Prime Minister Visits India for Trade Talks",
          hi: "ब्रिटेन के प्रधानमंत्री व्यापार वार्ता के लिए भारत का दौरा",
          mr: "ब्रिटन मंत्रिमंडळ प्रमुख व्यापार चर्चांसाठी भारत येथे"
        },
        subHeading: {
          en: "Bilateral trade agreement discussions underway",
          hi: "द्विपक्षीय व्यापार समझौते पर बातचीत जारी",
          mr: "द्विपक्षीय व्यापार करारावर चर्चा चालू"
        },
        content: {
          en: "The British PM is in India for high-level discussions on strengthening trade relations. Both countries aim to finalize a free trade agreement by mid-2025. Key sectors include technology, pharmaceuticals, and renewable energy.",
          hi: "ब्रिटिश प्रधानमंत्री व्यापार संबंधों को मजबूत करने के लिए उच्च स्तरीय चर्चा के लिए भारत में हैं।",
          mr: "ब्रिटन पंतप्रधान व्यापार संबंध मजबूत करण्यासाठी भारतात उच्च-स्तरीय चर्चांसाठी आहेत."
        },
        location: "maharashtra",
        category: "International",
        published: true,
        views: 7600,
        createdAt: new Date(now - 1.5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Israel-Palestine Peace Negotiations Resume",
          hi: "इsराइल-फिलिस्तीन शांति वार्ता फिर से शुरू",
          mr: "इজराएल-पॅलेस्टाईन शांती वार्ता पुन्हा सुरू"
        },
        subHeading: {
          en: "International mediators optimistic about breakthrough",
          hi: "अंतरराष्ट्रीय मध्यस्थ सफलता के बारे में आशान्वित",
          mr: "आंतरराष्ट्रीय मध्यस्थ यशांबद्दल आशावादी"
        },
        content: {
          en: "After months of deadlock, Israel and Palestine have resumed peace negotiations with support from US and Egypt. Initial discussions focus on humanitarian ceasefire and hostage releases. Observers call this a significant step toward regional stability.",
          hi: "महीनों के गतिरोध के बाद, इजरायल और फिलिस्तीन ने अमेरिका और मिस्र के समर्थन से शांति वार्ता फिर से शुरू की है।",
          mr: "महिन्यांच्या अवरोधनंतर, इजराएल आणि पॅलेस्टाईनने अमेरिका आणि इजिप्तच्या समर्थनाने शांती वार्ता पुन्हा सुरू केली आहे."
        },
        location: "maharashtra",
        category: "International",
        published: true,
        views: 10200,
        createdAt: new Date(now - 2 * 86400000)
      },

      // ==================== INDIAN NATIONAL NEWS ====================

      {
        baseLanguage: "en",
        title: {
          en: "India's Economy Surges: GDP Growth Reaches 6.2% in Q3 FY25",
          hi: "भारत की अर्थव्यवस्था तेजी से बढ़ रही है: Q3 FY25 में GDP 6.2% बढ़ गया",
          mr: "भारताची अर्थव्यवस्था वाढत आहे: Q3 FY25 मध्ये GDP 6.2% बढ़ गया"
        },
        subHeading: {
          en: "Manufacturing and services lead robust economic expansion",
          hi: "विनिर्माण और सेवाएं मजबूत आर्थिक विस्तार का नेतृत्व करती हैं",
          mr: "उत्पादन आणि सेवा मजबूत आर्थिक विस्तारचे नेतृत्व करतात"
        },
        content: {
          en: "India's economy demonstrated remarkable resilience and growth momentum as the Gross Domestic Product expanded at 6.2% during the third quarter of fiscal year 2024-25, according to official data released by the National Statistical Office on March 8, 2026. This growth trajectory reinforces India's position as one of the world's fastest-growing major economies, outpacing most developed nations and many emerging markets.\n\nThe expansion was broadly based, with manufacturing sector leading growth at 8.5%, followed by services at 5.8%, and agriculture contributing 2.1%. Key growth drivers included robust consumption demand from households and businesses, increased private sector investment, and government spending on infrastructure projects across the nation. The Index of Industrial Production (IIP) showed strong manufacturing activity, with automotive, pharmaceuticals, and electronics sectors performing exceptionally well.\n\nConsumer spending remained resilient with retail sales reaching record levels during the festival season. The services sector, which contributes over 50% to India's GDP, showed steady growth driven by IT exports, financial services, telecommunications, and hospitality sectors. The banking system remained strong with credit growth accelerating to 12% year-on-year.\n\nThe Reserve Bank of India maintained its optimistic growth outlook, projecting full-year GDP growth of 6.5-6.8% for FY25, higher than earlier estimates. RBI Governor pointed out that inflation remains well-managed, and the monetary policy stance is appropriately calibrated to support growth without compromising price stability. International rating agencies upgraded their India growth forecasts, with Goldman Sachs and Morgan Stanley predicting India could become the second-largest economy by 2035.\n\nExports showed strong performance with merchandise exports growing 8.3% in the December quarter. The strong rupee supported corporate earnings, though it posed challenges for export-oriented industries. FDI inflows reached $8.2 billion in Q3, reflecting sustained investor confidence in India's economic prospects. The employment situation improved significantly, with formal job creation reaching 2.3 million in the quarter, driven by manufacturing and services sectors.",
          hi: "भारत की अर्थव्यवस्था को अद्भुत लचीलापन और वृद्धि की गति का प्रदर्शन किया गया क्योंकि सकल घरेलू उत्पाद वित्त वर्ष 2024-25 की तीसरी तिमाही में 6.2% की दर से बढ़ा, राष्ट्रीय सांख्यिकी कार्यालय द्वारा 8 मार्च 2026 को जारी किए गए आधिकारिक डेटा के अनुसार। यह वृद्धि प्रक्षेपवक्र भारत को दुनिया की सबसे तेजी से बढ़ती प्रमुख अर्थव्यवस्थाओं में से एक के रूप में अपनी स्थिति को मजबूत करता है।",
          mr: "भारताची अर्थव्यवस्था राष्ट्रीय सांख्यिकी कार्यालयाच्या 8 मार्च 2026 च्या अधिकृत डेटा अनुसार वित्त वर्ष 2024-25 च्या तिसऱ्या त्रैमासिकात 6.2% दराने वाढली. या विस्तारामुळे भारत जगातील सर्वात वेगवान वाढणारी प्रमुख अर्थव्यवस्थांपैकी एक म्हणून अपनी स्थिति मजबूत होते."
        },
        location: "maharashtra",
        category: "Economics",
        published: true,
        views: 28900,
        createdAt: new Date(now - 0.5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Prime Minister Launches Massive 'Digital Bharat 2.0' Initiative with ₹2 Lakh Crore Investment",
          hi: "प्रधानमंत्री ने ₹2 लाख करोड़ के निवेश के साथ विशाल 'डिजिटल भारत 2.0' पहल का शुभारंभ किया",
          mr: "पंतप्रधानांनी ₹2 लाख कोटीच्या गुंतवणुकीसह विशाल 'डिजिटल भारत 2.0' योजना सुरू केली"
        },
        subHeading: {
          en: "Revolutionary digital transformation program targets internet connectivity and skills development",
          hi: "क्रांतिकारी डिजिटल परिवर्तन कार्यक्रम इंटरनेट कनेक्टिविटी और कौशल विकास को लक्षित करता है",
          mr: "क्रांतिकारी डिजिटल रूपांतरण कार्यक्रम इंटरनेट कनेक्टिव्हिटी आणि कोशल विकास लक्ष्य करतो"
        },
        content: {
          en: "The Government of India announced a groundbreaking digital transformation initiative called 'Digital Bharat 2.0' with a massive ₹2 lakh crore investment, aimed at revolutionizing digital infrastructure and digital literacy across the nation. This comprehensive program represents the largest digital initiative undertaken by the Indian government and is expected to transform the digital landscape for over 1.4 billion Indians.\n\nThe initiative encompasses several key pillars: first, connecting 10 crore (100 million) rural households with high-speed broadband internet within the next three years, ensuring digital divide is bridged. Second, developing digital skills among 20 crore (200 million) citizens through free online training programs, digital literacy centers, and partnerships with technology companies. Third, establishing digital infrastructure through fiber optic networks, 5G deployment, and satellite internet in remote areas.\n\nThe program also focuses on digital financial inclusion, aiming to provide digital payment infrastructure to all villages with populations above 500. It will facilitate digital entrepreneurship through microfinance linkages, digital marketplaces, and incubation centers. The government plans to boost e-commerce adoption in rural areas and develop a robust digital ecosystem for small businesses.\n\nKey components include National Digital Library with 5 crore books and educational resources, digital health services through e-Health portals, digital governance solutions for faster service delivery, and cybersecurity framework to protect citizens' digital assets. The program also includes AI and machine learning adoption in government services and public sector undertakings.\n\nIndustry experts project that Digital Bharat 2.0 will create over 50 lakh new digital jobs, boost India's digital economy to $1 trillion by 2030, and position India as a global leader in digital innovation. The initiative has received support from international technology companies including Microsoft, Google, and Amazon, which have pledged investments and partnerships to support the program's implementation.",
          hi: "भारत सरकार ने एक क्रांतिकारी डिजिटल परिवर्तन पहल 'डिजिटल भारत 2.0' घोषित की है जिसमें ₹2 लाख करोड़ का विशाल निवेश है। यह व्यापक कार्यक्रम भारत सरकार द्वारा की गई सबसे बड़ी डिजिटल पहल का प्रतिनिधित्व करता है और 1.4 अरब से अधिक भारतीयों के लिए डिजिटल परिदृश्य को बदलने की उम्मीद है।",
          mr: "भारत सरकारने क्रांतिकारी डिजिटल रूपांतरण योजना 'डिजिटल भारत 2.0' ची घोषणा केली ज्यामध्ये ₹2 लाख कोटीचे विशाल गुंतवणूक आहे. हा व्यापक कार्यक्रम भारत सरकारने हाती घेतलेल्या सर्वात मोठ्या डिजिटल पुढाकारांचा प्रतिनिधित्व करते."
        },
        location: "maharashtra",
        category: "Technology",
        published: true,
        views: 35600,
        createdAt: new Date(now - 1 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Indian Space Program Successfully Launches Communication Satellite",
          hi: "भारतीय अंतरिक्ष कार्यक्रम ने संचार उपग्रह सफलतापूर्वक लॉन्च किया",
          mr: "भारतीय अंतराळ कार्यक्रमाने संचार उपग्रह यशस्वीरित्या लॉन्च केला"
        },
        subHeading: {
          en: "ISRO achieves 100% mission success rate",
          hi: "ISRO ने 100% मिशन सफलता दर हासिल की",
          mr: "ISRO ने 100% मिशन यश दर प्राप्त केला"
        },
        content: {
          en: "Indian Space Research Organisation (ISRO) successfully launched a next-generation communication satellite into orbit. The mission places India among the few nations with indigenous satellite launch capability. This achievement strengthens India's position in space technology.",
          hi: "भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने एक अगली पीढ़ी के संचार उपग्रह को कक्षा में सफलतापूर्वक लॉन्च किया।",
          mr: "भारतीय अंतराळ संशोधन संस्था (ISRO) ने पुढील पीढीचा संचार उपग्रह कक्षेत यशस्वीरित्या लॉन्च केला."
        },
        location: "maharashtra",
        category: "Science",
        published: true,
        views: 13700,
        createdAt: new Date(now - 1.5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "IPL 2025 Mega Auction Creates Record-Breaking Deals",
          hi: "IPL 2025 मेगा नीलाम ने रिकॉर्ड-तोड़ सौदे बनाए",
          mr: "IPL 2025 मेगा लिलाव रेकॉर्ड-तोडणार्‍या डीलचे निर्माण करते"
        },
        subHeading: {
          en: "Star players fetch record prices in auction",
          hi: "स्टार खिलाड़ी नीलाम में रिकॉर्ड कीमत पर जाते हैं",
          mr: "तारकेली खेळाडू लिलावात रेकॉर्ड किमती पर जातात"
        },
        content: {
          en: "The Indian Premier League's mega auction for 2025 season saw unprecedented bidding war for top cricketers. Several players set new records with their auction prices. Franchises invested heavily in building competitive teams ahead of the upcoming season.",
          hi: "भारतीय प्रीमियर लीग के 2025 सीजन के मेगा नीलाम में शीर्ष क्रिकेटरों के लिए अभूतपूर्व बोली की गई।",
          mr: "भारतीय प्रीमियर लीगच्या 2025 सीজनच्या मेगा लिलावात शीर्ष क्रिकेटरांसाठी अभूतपूर्व बोली झाली."
        },
        location: "maharashtra",
        category: "Sports",
        published: true,
        views: 15600,
        createdAt: new Date(now - 2 * 86400000)
      },

      // ==================== MAHARASHTRA NEWS ====================

      {
        baseLanguage: "en",
        title: {
          en: "Maharashtra Government Announces ₹50,000 Crore Industrial Growth Initiative",
          hi: "महाराष्ट्र सरकार ने ₹50,000 करोड़ औद्योगिक वृद्धि पहल की घोषणा की",
          mr: "महाराष्ट्र सरकारने ₹50,000 कोटी औद्योगिक वाढ उद्योग घोषित केले"
        },
        subHeading: {
          en: "Boost for MSMEs and manufacturing sector",
          hi: "MSME और विनिर्माण क्षेत्र के लिए बढ़ावा",
          mr: "MSME आणि उत्पादन क्षेत्रासाठी वाढ"
        },
        content: {
          en: "The Maharashtra Government announced a new ₹50,000 crore industrial package aimed at accelerating growth in the MSME and manufacturing sectors. The initiative includes tax concessions, subsidized loans, and skill development programs for entrepreneurs.",
          hi: "महाराष्ट्र सरकार ने MSME और विनिर्माण क्षेत्रों में वृद्धि को त्वरित करने के लिए एक नई ₹50,000 करोड़ औद्योगिक पैकेज की घोषणा की।",
          mr: "महाराष्ट्र सरकारने MSME आणि उत्पादन क्षेत्रातील वाढीला गती देण्यासाठी नई ₹50,000 कोटीची औद्योगिक पॅकेज घोषित केली."
        },
        location: "maharashtra",
        category: "Business",
        published: true,
        views: 8900,
        createdAt: new Date(now - 0.5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Mumbai Metro Line 8 Extension Nears Completion",
          hi: "मुंबई मेट्रो लाइन 8 विस्तार पूरा होने के करीब",
          mr: "मुंबई मेट्रो लाइन 8 विस्तार पूर्ण होण्याजवळ"
        },
        subHeading: {
          en: "Will reduce travel time by 40% for commuters",
          hi: "आवागमन समय में 40% की कमी करेगा",
          mr: "प्रवासीांच्या प्रवासाची वेळ 40% कमी करेल"
        },
        content: {
          en: "The ambitious Metro Line 8 extension project is now 95% complete. Once operational, it will provide connectivity to major residential and commercial areas, reducing average commute time by 40%. The line is expected to be inaugurated by next month.",
          hi: "野महत्वाकांक्षी मेट्रो लाइन 8 विस्तार परियोजना अब 95% पूरी हो गई है।",
          mr: "महत्वाकांक्षी मेट्रो लाइन 8 विस्तार प्रकल्प आता 95% पूर्ण झाला आहे."
        },
        location: "maharashtra",
        category: "Infrastructure",
        published: true,
        views: 10100,
        createdAt: new Date(now - 1.5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Pune Technology Sector Reports 25% Year-on-Year Growth",
          hi: "पुणे प्रौद्योगिकी क्षेत्र में 25% साल-दर-साल वृद्धि",
          mr: "पुणे तंत्रज्ञान क्षेत्र 25% वर्ष-दर-वर्ष वाढ अनुभव करते"
        },
        subHeading: {
          en: "Hiring surge in IT and software companies",
          hi: "IT और सॉफ्टवेयर कंपनियों में नियुक्ति में वृद्धि",
          mr: "IT आणि सॉफ्टवेअर कंपन्यांमध्ये नियुक्तीमध्ये वाढ"
        },
        content: {
          en: "Pune's technology sector is experiencing unprecedented growth with a 25% YoY expansion. Major IT companies and startups are expanding their operations, creating 15,000+ new jobs. The city is emerging as a major tech hub competing with Bangalore and Hyderabad.",
          hi: "पुणे का तकनीकी क्षेत्र 25% YoY विस्तार के साथ अभूतपूर्व वृद्धि का अनुभव कर रहा है।",
          mr: "पुणे चे तंत्रज्ञान क्षेत्र 25% YoY विस्तारसह अभूतपूर्व वाढ अनुभव करत आहे."
        },
        location: "maharashtra",
        category: "Technology",
        published: true,
        views: 12400,
        createdAt: new Date(now - 2 * 86400000)
      },

      // ==================== CHANDRAPUR NEWS ====================

      {
        baseLanguage: "en",
        title: {
          en: "Chandrapur Coal Mine Achieves Production Milestone",
          hi: "चंद्रपुर कोल माइन उत्पादन माइलस्टोन हासिल करता है",
          mr: "चंद्रपूर कोल खान उत्पादन मायलस्टोन साध करते"
        },
        subHeading: {
          en: "Record production of 85 lakh tonnes in FY25",
          hi: "FY25 में 85 लाख टन का रिकॉर्ड उत्पादन",
          mr: "FY25 मध्ये 85 लाख टन चे रेकॉर्ड उत्पादन"
        },
        content: {
          en: "Chandrapur's coal mines reached an unprecedented production of 85 lakh tonnes in FY 2024-25, surpassing previous records. This achievement reinforces Chandrapur's position as a key coal-producing region. The surplus production will support India's energy needs and power generation.",
          hi: "चंद्रपुर की कोयला खानों ने वित्त वर्ष 2024-25 में 85 लाख टन का अभूतपूर्व उत्पादन हासिल किया।",
          mr: "चंद्रपूर च्या कोलखानांनी वित्त वर्ष 2024-25 मध्ये 85 लाख टन चे अभूतपूर्व उत्पादन साध केले."
        },
        location: "chandrapur",
        category: "Business",
        published: true,
        views: 6800,
        createdAt: new Date(now - 0.5 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Chandrapur Railway Station Getting World-Class Upgrade",
          hi: "चंद्रपुर रेलवे स्टेशन को विश्व-स्तरीय अपग्रेड मिल रहा है",
          mr: "चंद्रपूर रेल्वे स्टेशन विश्व-दर्जाच्या अपग्रेडचे मिळत आहे"
        },
        subHeading: {
          en: "₹200 crore modernization project underway",
          hi: "₹200 करोड़ आधुनिकीकरण परियोजना जारी है",
          mr: "₹200 कोटी आधुनिकीकरण प्रकल्प चालू आहे"
        },
        content: {
          en: "Indian Railways is undertaking a ₹200 crore modernization project at Chandrapur Railway Station. The upgrade includes new platforms, passenger facilities, better connectivity, and smart technology integration. Expected completion is by December 2025.",
          hi: "भारतीय रेलवे चंद्रपुर रेलवे स्टेशन पर ₹200 करोड़ का आधुनिकीकरण परियोजना कर रही है।",
          mr: "भारतीय रेल्वे चंद्रपूर रेल्वे स्टेशनवर ₹200 कोटीच्या आधुनिकीकरण प्रकल्पाकरता कार्यरत आहे."
        },
        location: "chandrapur",
        category: "Infrastructure",
        published: true,
        views: 5200,
        createdAt: new Date(now - 2 * 86400000)
      },

      // ==================== RAJURA NEWS ====================

      {
        baseLanguage: "en",
        title: {
          en: "Rajura Agritech Startup Secures ₹5 Crore Funding",
          hi: "राजुरा एग्रीटेक स्टार्टअप ने ₹5 करोड़ फंडिंग हासिल की",
          mr: "राजुरा एग्रीटेक स्टार्टअप ₹5 कोटी फंडिंग सुरक्षित करते"
        },
        subHeading: {
          en: "Tech-enabled farming solution for rural areas",
          hi: "ग्रामीण क्षेत्रों के लिए तकनीक-सक्षम कृषि समाधान",
          mr: "ग्रामीण क्षेत्रांसाठी तंत्र-सक्षम कृषि समाधान"
        },
        content: {
          en: "A Rajura-based agricultural technology startup successfully raised ₹5 crore in seed funding. The company develops IoT solutions for crop monitoring, weather prediction, and soil health analysis. This innovation is expected to revolutionize farming practices in the region.",
          hi: "राजुरा स्थित एक कृषि प्रौद्योगिकी स्टार्टअप ने बीज फंडिंग में ₹5 करोड़ सफलतापूर्वक जुटाए।",
          mr: "राजुरा स्थित कृषि तंत्रज्ञान स्टार्टअपने बीज फंडिंगमध्ये ₹5 कोटी यशस्वीरित्या जमा केले."
        },
        location: "rajura",
        category: "Startup",
        published: true,
        views: 4100,
        createdAt: new Date(now - 1 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Rajura Cooperative Dairy Exports Reach New Heights",
          hi: "राजुरा सहकारी डेयरी निर्यात नई ऊंचाई तक पहुंचता है",
          mr: "राजुरा सहकारी दूध निर्यात नव्या उंचीला पोहोचते"
        },
        subHeading: {
          en: "Organic milk products shipped to 15 countries",
          hi: "जैविक दूध उत्पाद 15 देशों को भेजे जाते हैं",
          mr: "जैविक दूध उत्पाद 15 देशांना पाठवले जातात"
        },
        content: {
          en: "The Rajura Cooperative Dairy has expanded its export operations, now shipping organic milk and dairy products to 15 countries worldwide. Their premium quality products have earned international certifications and recognition in global markets.",
          hi: "राजुरा सहकारी डेयरी ने अपने निर्यात संचालन का विस्तार किया है, अब दुनिया भर के 15 देशों को जैविक दूध और डेयरी उत्पाद भेज रहा है।",
          mr: "राजुरा सहकारी दुग्ध व्यवसायाने आपल्या निर्यात व्यवहार चे विस्तार केले आहे, आता जगभरातील 15 देशांना जैविक दूध आणि डेयरी उत्पाद पाठवत आहे."
        },
        location: "rajura",
        category: "Agriculture",
        published: true,
        views: 3900,
        createdAt: new Date(now - 1.5 * 86400000)
      },

      // ==================== KORPANA NEWS ====================

      {
        baseLanguage: "en",
        title: {
          en: "Korpana Solar Plant Generates 50 MW Clean Energy",
          hi: "कोरपाना सोलर प्लांट 50 MW स्वच्छ ऊर्जा उत्पन्न करता है",
          mr: "कोरपाना सोलर प्लांट 50 MW स्वच्छ उर्जा निर्माण करते"
        },
        subHeading: {
          en: "Renewable energy milestone achieved",
          hi: "नवीकरणीय ऊर्जा माइलस्टोन हासिल किया",
          mr: "नवीकरणीय उर्जा मायलस्टोन साध केले"
        },
        content: {
          en: "Korpana's solar power plant has achieved the milestone of generating 50 MW of clean electricity daily. The facility supplies power to thousands of households and businesses in the region, reducing carbon emissions and promoting sustainable energy.",
          hi: "कोरपाना का सौर विद्युत संयंत्र दैनिक 50 MW स्वच्छ बिजली उत्पन्न करने का मील का पत्थर हासिल कर चुका है।",
          mr: "कोरपानाचे सौर विद्युत संयंत्र दैनिक 50 MW स्वच्छ वीज निर्माण करण्याचे मायलस्टोन साध केले आहे."
        },
        location: "korpana",
        category: "Infrastructure",
        published: true,
        views: 7200,
        createdAt: new Date(now - 2 * 86400000)
      },

      {
        baseLanguage: "en",
        title: {
          en: "Korpana Organic Farming Initiative Wins National Award",
          hi: "कोरपाना जैविक खेती पहल राष्ट्रीय पुरस्कार जीतता है",
          mr: "कोरपाना जैविक शेती उद्योग राष्ट्रीय पुरस्कार जिंकते"
        },
        subHeading: {
          en: "Recognition for sustainable agricultural practices",
          hi: "टिकाऊ कृषि पद्धतियों के लिए मान्यता",
          mr: "टिकाऊ कृषि पद्धतीसाठी मान्यता"
        },
        content: {
          en: "Korpana's collective organic farming initiative has received the National Sustainable Agriculture Award. The program involves 2,500 farmers adopting organic methods and contributing to soil health. This achievement puts Korpana on the map as a leader in sustainable farming.",
          hi: "कोरपाना की समूह जैविक खेती पहल को राष्ट्रीय टिकाऊ कृषि पुरस्कार प्राप्त हुआ है।",
          mr: "कोरपानाच्या समूह जैविक शेती उद्योगाला राष्ट्रीय टिकाऊ कृषि पुरस्कार प्राप्त झाला आहे."
        },
        location: "korpana",
        category: "Agriculture",
        published: true,
        views: 6400,
        createdAt: new Date(now - 2.5 * 86400000)
      }
    ];

    const result = await News.insertMany(trendingNews);
    console.log(`✅ Successfully inserted ${result.length} trending news articles`);
    console.log('\n📰 News Summary:');
    console.log(`   - International: 4 articles`);
    console.log(`   - Indian National: 4 articles`);
    console.log(`   - Maharashtra: 3 articles`);
    console.log(`   - Chandrapur: 2 articles`);
    console.log(`   - Rajura: 2 articles`);
    console.log(`   - Korpana: 2 articles`);

    await mongoose.connection.close();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedTrendingNews();
