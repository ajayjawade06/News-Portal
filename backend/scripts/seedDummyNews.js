import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multilingual_news';

/**
 * Seed script to delete all news and create dummy news data for presentation
 * Run with: node scripts/seedDummyNews.js
 */
async function seedDummyNews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing news
    const deleteResult = await News.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing news posts`);

    // Create dummy news posts with realistic data
    // Includes all locations, subHeadings, views, and various categories
    const dummyNews = [
      // Maharashtra News
      {
        baseLanguage: 'en',
        title: {
          en: 'Maharashtra Government Announces New Infrastructure Projects',
          hi: 'महाराष्ट्र सरकार ने नई बुनियादी ढांचा परियोजनाओं की घोषणा की',
          mr: 'महाराष्ट्र सरकारने नवीन पायाभूत सुविधा प्रकल्पांची घोषणा केली'
        },
        subHeading: {
          en: 'Multi-billion rupee investment to boost state development',
          hi: 'राज्य के विकास को बढ़ावा देने के लिए अरबों रुपये का निवेश',
          mr: 'राज्य विकासाला चालना देण्यासाठी अब्जावधी रुपयांची गुंतवणूक'
        },
        content: {
          en: 'The Maharashtra government has announced a series of major infrastructure projects worth over 50,000 crores. The projects include new highways, metro rail expansions, and smart city initiatives. Chief Minister stated that these projects will create thousands of jobs and significantly improve connectivity across the state. The first phase is expected to begin within the next six months.',
          hi: 'महाराष्ट्र सरकार ने 50,000 करोड़ से अधिक की प्रमुख बुनियादी ढांचा परियोजनाओं की श्रृंखला की घोषणा की है। इन परियोजनाओं में नई राजमार्ग, मेट्रो रेल विस्तार और स्मार्ट सिटी पहल शामिल हैं।',
          mr: 'महाराष्ट्र सरकारने 50,000 कोटींपेक्षा जास्त मूल्याच्या प्रमुख पायाभूत सुविधा प्रकल्पांच्या मालिकेची घोषणा केली आहे. या प्रकल्पांमध्ये नवीन महामार्ग, मेट्रो रेल्वे विस्तार आणि स्मार्ट सिटी उपक्रमांचा समावेश आहे.'
        },
        location: 'maharashtra',
        category: 'Infrastructure',
        published: true,
        views: 1250,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Maharashtra Tourism Sees Record Growth This Year',
          hi: 'महाराष्ट्र पर्यटन में इस वर्ष रिकॉर्ड वृद्धि',
          mr: 'महाराष्ट्र पर्यटनाला या वर्षी रेकॉर्ड वाढ'
        },
        subHeading: {
          en: 'Over 15 million tourists visited the state in the first quarter',
          hi: 'पहली तिमाही में 15 मिलियन से अधिक पर्यटकों ने राज्य का दौरा किया',
          mr: 'पहिल्या तिमाहीत 15 दशलक्षाहून अधिक पर्यटकांनी राज्याचा दौरा केला'
        },
        content: {
          en: 'Maharashtra has witnessed unprecedented growth in tourism this year, with over 15 million visitors in the first quarter alone. Popular destinations like Mumbai, Pune, and Aurangabad have seen a significant increase in footfall. The tourism department has launched new campaigns to promote offbeat destinations and cultural heritage sites.',
          hi: 'महाराष्ट्र ने इस वर्ष पर्यटन में अभूतपूर्व वृद्धि देखी है, केवल पहली तिमाही में 15 मिलियन से अधिक आगंतुक आए हैं।',
          mr: 'महाराष्ट्राने या वर्षी पर्यटनात अभूतपूर्व वाढ अनुभवली आहे, फक्त पहिल्या तिमाहीत 15 दशलक्षाहून अधिक भेट देणारे आले आहेत.'
        },
        location: 'maharashtra',
        category: 'Tourism',
        published: true,
        views: 890,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      
      // Chandrapur News
      {
        baseLanguage: 'en',
        title: {
          en: 'Chandrapur District Launches Digital Literacy Program',
          hi: 'चंद्रपुर जिले ने डिजिटल साक्षरता कार्यक्रम शुरू किया',
          mr: 'चंद्रपूर जिल्ह्याने डिजिटल साक्षरता कार्यक्रम सुरू केला'
        },
        subHeading: {
          en: 'Free training for 10,000 residents to bridge digital divide',
          hi: 'डिजिटल विभाजन को पाटने के लिए 10,000 निवासियों के लिए मुफ्त प्रशिक्षण',
          mr: 'डिजिटल विभाजन दूर करण्यासाठी 10,000 रहिवाशांसाठी मोफत प्रशिक्षण'
        },
        content: {
          en: 'Chandrapur district administration has launched an ambitious digital literacy program aimed at training 10,000 residents in basic computer skills and internet usage. The program, funded by the state government, will provide free training sessions across 50 centers in the district. District Collector emphasized the importance of digital skills in today\'s world and encouraged all eligible residents to enroll.',
          hi: 'चंद्रपुर जिला प्रशासन ने 10,000 निवासियों को बुनियादी कंप्यूटर कौशल और इंटरनेट उपयोग में प्रशिक्षित करने के उद्देश्य से एक महत्वाकांक्षी डिजिटल साक्षरता कार्यक्रम शुरू किया है।',
          mr: 'चंद्रपूर जिल्हा प्रशासनाने 10,000 रहिवाशांना मूलभूत संगणक कौशल्ये आणि इंटरनेट वापरात प्रशिक्षित करण्याच्या उद्देशाने एक महत्वाकांक्षी डिजिटल साक्षरता कार्यक्रम सुरू केला आहे.'
        },
        location: 'chandrapur',
        category: 'Education',
        published: true,
        views: 2100,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'New Hospital Inaugurated in Chandrapur City',
          hi: 'चंद्रपुर शहर में नया अस्पताल उद्घाटन',
          mr: 'चंद्रपूर शहरात नवीन रुग्णालयाचे उद्घाटन'
        },
        subHeading: {
          en: '200-bed facility to serve over 5 lakh residents',
          hi: '5 लाख से अधिक निवासियों की सेवा के लिए 200 बिस्तरों की सुविधा',
          mr: '5 लाखाहून अधिक रहिवाशांची सेवा करण्यासाठी 200 बेडची सुविधा'
        },
        content: {
          en: 'A state-of-the-art 200-bed hospital was inaugurated in Chandrapur city today. The hospital is equipped with modern medical facilities including ICU, operation theaters, and diagnostic centers. Health Minister attended the inauguration ceremony and praised the initiative. The hospital will provide affordable healthcare to over 5 lakh residents of the region.',
          hi: 'चंद्रपुर शहर में आज एक अत्याधुनिक 200 बिस्तरों वाले अस्पताल का उद्घाटन किया गया। अस्पताल में आईसीयू, ऑपरेशन थिएटर और नैदानिक केंद्र सहित आधुनिक चिकित्सा सुविधाएं हैं।',
          mr: 'चंद्रपूर शहरात आज एक अत्याधुनिक 200 बेडच्या रुग्णालयाचे उद्घाटन करण्यात आले. रुग्णालयात आयसीयू, ऑपरेशन थिएटर आणि निदान केंद्रांसह आधुनिक वैद्यकीय सुविधा आहेत.'
        },
        location: 'chandrapur',
        category: 'Health',
        published: true,
        views: 1850,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      
      // Korpana News
      {
        baseLanguage: 'en',
        title: {
          en: 'Korpana Village Gets 24x7 Electricity Supply',
          hi: 'कोरपाना गाँव को 24x7 बिजली आपूर्ति मिली',
          mr: 'कोरपाना गावाला 24x7 वीज पुरवठा मिळाला'
        },
        subHeading: {
          en: 'Historic achievement brings light to 5,000 households',
          hi: 'ऐतिहासिक उपलब्धि 5,000 घरों में रोशनी लाती है',
          mr: 'ऐतिहासिक यश 5,000 घरांमध्ये प्रकाश आणते'
        },
        content: {
          en: 'Korpana village has achieved a major milestone with the launch of 24x7 electricity supply. The project, completed under the central government\'s rural electrification scheme, will benefit over 5,000 households. Villagers expressed joy and gratitude, stating that this will transform their daily lives and enable new economic opportunities.',
          hi: 'कोरपाना गाँव ने 24x7 बिजली आपूर्ति के शुभारंभ के साथ एक बड़ी उपलब्धि हासिल की है। केंद्र सरकार की ग्रामीण विद्युतीकरण योजना के तहत पूर्ण की गई इस परियोजना से 5,000 से अधिक घरों को लाभ होगा।',
          mr: 'कोरपाना गावाने 24x7 वीज पुरवठ्याच्या सुरुवातीसह एक मोठे यश मिळवले आहे. केंद्र सरकारच्या ग्रामीण विद्युतीकरण योजनेअंतर्गत पूर्ण झालेल्या या प्रकल्पाचा 5,000 पेक्षा जास्त घरांना फायदा होईल.'
        },
        location: 'korpana',
        category: 'Infrastructure',
        published: true,
        views: 3200,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Korpana Farmers Adopt Organic Farming Techniques',
          hi: 'कोरपाना किसान जैविक खेती तकनीक अपना रहे हैं',
          mr: 'कोरपाना शेतकरी जैविक शेती तंत्रज्ञान स्वीकारत आहेत'
        },
        subHeading: {
          en: 'Training program helps 200 farmers transition to sustainable agriculture',
          hi: 'प्रशिक्षण कार्यक्रम 200 किसानों को स्थायी कृषि में संक्रमण में मदद करता है',
          mr: 'प्रशिक्षण कार्यक्रम 200 शेतकऱ्यांना शाश्वत शेतीत संक्रमण करण्यात मदत करतो'
        },
        content: {
          en: 'Over 200 farmers in Korpana have successfully transitioned to organic farming methods following a comprehensive training program. The initiative, supported by agricultural experts and government subsidies, has shown promising results with increased crop yields and better soil health. Farmers report higher profits and reduced dependency on chemical fertilizers.',
          hi: 'कोरपाना में 200 से अधिक किसानों ने एक व्यापक प्रशिक्षण कार्यक्रम के बाद सफलतापूर्वक जैविक खेती के तरीकों में संक्रमण किया है।',
          mr: 'कोरपानामध्ये 200 पेक्षा जास्त शेतकऱ्यांनी एक व्यापक प्रशिक्षण कार्यक्रमानंतर यशस्वीरित्या जैविक शेती पद्धतींमध्ये संक्रमण केले आहे.'
        },
        location: 'korpana',
        category: 'Agriculture',
        published: true,
        views: 1450,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      },
      
      // Rajura News
      {
        baseLanguage: 'en',
        title: {
          en: 'Rajura Town Celebrates Annual Cultural Festival',
          hi: 'राजुरा शहर वार्षिक सांस्कृतिक उत्सव मनाता है',
          mr: 'राजुरा शहर वार्षिक सांस्कृतिक उत्सव साजरा करते'
        },
        subHeading: {
          en: 'Three-day event showcases local traditions and arts',
          hi: 'तीन दिवसीय कार्यक्रम स्थानीय परंपराओं और कलाओं को प्रदर्शित करता है',
          mr: 'तीन दिवसीय कार्यक्रम स्थानिक परंपरा आणि कला प्रदर्शित करते'
        },
        content: {
          en: 'Rajura town is hosting its annual cultural festival, attracting thousands of visitors from across the region. The three-day event features traditional dance performances, folk music, local cuisine, and handicraft exhibitions. Organizers say this year\'s festival is the largest ever, with participation from over 50 cultural groups.',
          hi: 'राजुरा शहर अपना वार्षिक सांस्कृतिक उत्सव आयोजित कर रहा है, जो पूरे क्षेत्र से हजारों आगंतुकों को आकर्षित कर रहा है।',
          mr: 'राजुरा शहर आपला वार्षिक सांस्कृतिक उत्सव आयोजित करत आहे, जो संपूर्ण प्रदेशातून हजारो भेट देणाऱ्यांना आकर्षित करत आहे.'
        },
        location: 'rajura',
        category: 'Culture',
        published: true,
        views: 2750,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'New School Building Inaugurated in Rajura',
          hi: 'राजुरा में नई स्कूल इमारत का उद्घाटन',
          mr: 'राजुरामध्ये नवीन शाळा इमारतीचे उद्घाटन'
        },
        subHeading: {
          en: 'Modern facility to accommodate 500 students',
          hi: '500 छात्रों को समायोजित करने के लिए आधुनिक सुविधा',
          mr: '500 विद्यार्थ्यांना समाविष्ट करण्यासाठी आधुनिक सुविधा'
        },
        content: {
          en: 'A new modern school building was inaugurated in Rajura today, providing state-of-the-art educational facilities for 500 students. The building includes smart classrooms, science laboratories, a library, and sports facilities. Education Minister praised the initiative and emphasized the importance of quality education in rural areas.',
          hi: 'राजुरा में आज एक नई आधुनिक स्कूल इमारत का उद्घाटन किया गया, जो 500 छात्रों के लिए अत्याधुनिक शैक्षिक सुविधाएं प्रदान करती है।',
          mr: 'राजुरामध्ये आज एक नवीन आधुनिक शाळा इमारतीचे उद्घाटन करण्यात आले, जी 500 विद्यार्थ्यांसाठी अत्याधुनिक शैक्षणिक सुविधा प्रदान करते.'
        },
        location: 'rajura',
        category: 'Education',
        published: true,
        views: 1100,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      
      // More news for variety
      {
        baseLanguage: 'en',
        title: {
          en: 'Chandrapur Industrial Zone Expansion Approved',
          hi: 'चंद्रपुर औद्योगिक क्षेत्र विस्तार को मंजूरी',
          mr: 'चंद्रपूर औद्योगिक क्षेत्र विस्तार मंजूर'
        },
        subHeading: {
          en: 'Project expected to create 2,000 new jobs',
          hi: 'परियोजना से 2,000 नई नौकरियां सृजित होने की उम्मीद',
          mr: 'प्रकल्पातून 2,000 नवीन नोकऱ्या निर्माण होण्याची अपेक्षा'
        },
        content: {
          en: 'The state government has approved the expansion of Chandrapur industrial zone, a move expected to attract investments worth 500 crores and create over 2,000 employment opportunities. The expansion will include new manufacturing units, logistics facilities, and support infrastructure. Industry leaders have welcomed the decision.',
          hi: 'राज्य सरकार ने चंद्रपुर औद्योगिक क्षेत्र के विस्तार को मंजूरी दे दी है, एक कदम जिससे 500 करोड़ की निवेश आकर्षित होने और 2,000 से अधिक रोजगार के अवसर पैदा होने की उम्मीद है।',
          mr: 'राज्य सरकारने चंद्रपूर औद्योगिक क्षेत्राच्या विस्ताराला मंजुरी दिली आहे, एक कृती ज्यामुळे 500 कोटींची गुंतवणूक आकर्षित होण्याची आणि 2,000 पेक्षा जास्त रोजगार संधी निर्माण होण्याची अपेक्षा आहे.'
        },
        location: 'chandrapur',
        category: 'Business',
        published: true,
        views: 1950,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Korpana Village Gets High-Speed Internet Connection',
          hi: 'कोरपाना गाँव को हाई-स्पीड इंटरनेट कनेक्शन मिला',
          mr: 'कोरपाना गावाला हाय-स्पीड इंटरनेट कनेक्शन मिळाले'
        },
        subHeading: {
          en: 'Fiber optic network brings digital revolution to rural area',
          hi: 'फाइबर ऑप्टिक नेटवर्क ग्रामीण क्षेत्र में डिजिटल क्रांति लाता है',
          mr: 'फायबर ऑप्टिक नेटवर्क ग्रामीण भागात डिजिटल क्रांती आणते'
        },
        content: {
          en: 'Korpana village has become one of the first rural areas in the region to receive high-speed fiber optic internet connection. The service, provided by a leading telecom company, will enable residents to access online education, telemedicine, and e-commerce services. Village head expressed gratitude and highlighted the transformative impact this will have on the community.',
          hi: 'कोरपाना गाँव इस क्षेत्र के पहले ग्रामीण क्षेत्रों में से एक बन गया है जिसे हाई-स्पीड फाइबर ऑप्टिक इंटरनेट कनेक्शन मिला है।',
          mr: 'कोरपाना गाव हा प्रदेशातील पहिल्या ग्रामीण भागांपैकी एक बनला आहे ज्याला हाय-स्पीड फायबर ऑप्टिक इंटरनेट कनेक्शन मिळाले आहे.'
        },
        location: 'korpana',
        category: 'Technology',
        published: true,
        views: 1650,
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Rajura Sports Complex Renovation Completed',
          hi: 'राजुरा स्पोर्ट्स कॉम्प्लेक्स का नवीकरण पूरा',
          mr: 'राजुरा क्रीडा संकुल नूतनीकरण पूर्ण'
        },
        subHeading: {
          en: 'World-class facilities now available for local athletes',
          hi: 'स्थानीय एथलीटों के लिए अब विश्व स्तरीय सुविधाएं उपलब्ध',
          mr: 'स्थानिक क्रीडापटूंसाठी आता जागतिक दर्जाच्या सुविधा उपलब्ध'
        },
        content: {
          en: 'The renovated Rajura Sports Complex was officially opened today, featuring world-class facilities including an Olympic-size swimming pool, modern gymnasium, and multi-purpose courts. The 5-crore renovation project will serve as a training ground for local athletes and host regional sports competitions.',
          hi: 'नवीकृत राजुरा स्पोर्ट्स कॉम्प्लेक्स को आज आधिकारिक रूप से खोला गया, जिसमें ओलंपिक आकार के स्विमिंग पूल, आधुनिक जिमनैजियम और बहुउद्देशीय कोर्ट सहित विश्व स्तरीय सुविधाएं हैं।',
          mr: 'नूतनीकृत राजुरा क्रीडा संकुलाचे आज अधिकृतपणे उद्घाटन करण्यात आले, ज्यामध्ये ऑलिम्पिक आकाराचे पोहण्याचे तलाव, आधुनिक व्यायामशाळा आणि बहुउद्देशीय मैदानांसह जागतिक दर्जाच्या सुविधा आहेत.'
        },
        location: 'rajura',
        category: 'Sports',
        published: true,
        views: 980,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Maharashtra State Budget Focuses on Rural Development',
          hi: 'महाराष्ट्र राज्य बजट ग्रामीण विकास पर केंद्रित',
          mr: 'महाराष्ट्र राज्य अर्थसंकल्प ग्रामीण विकासावर लक्ष केंद्रित करते'
        },
        subHeading: {
          en: '40% allocation for agriculture and infrastructure projects',
          hi: 'कृषि और बुनियादी ढांचा परियोजनाओं के लिए 40% आवंटन',
          mr: 'शेती आणि पायाभूत सुविधा प्रकल्पांसाठी 40% वाटप'
        },
        content: {
          en: 'The Maharashtra state budget for the fiscal year allocates 40% of funds to rural development initiatives, with special focus on agriculture, infrastructure, and healthcare. Finance Minister presented the budget in the assembly, highlighting schemes for farmer welfare, rural connectivity, and village infrastructure development.',
          hi: 'वित्तीय वर्ष के लिए महाराष्ट्र राज्य बजट ग्रामीण विकास पहलों के लिए 40% धन आवंटित करता है, जिसमें कृषि, बुनियादी ढांचा और स्वास्थ्य सेवा पर विशेष ध्यान दिया गया है।',
          mr: 'आर्थिक वर्षासाठी महाराष्ट्र राज्य अर्थसंकल्प ग्रामीण विकास उपक्रमांसाठी 40% निधी वाटप करते, ज्यामध्ये शेती, पायाभूत सुविधा आणि आरोग्यसेवेवर विशेष लक्ष केंद्रित केले आहे.'
        },
        location: 'maharashtra',
        category: 'Politics',
        published: true,
        views: 2200,
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) // 11 days ago
      },
      {
        baseLanguage: 'en',
        title: {
          en: 'Draft: Chandrapur Water Conservation Project',
          hi: 'मसौदा: चंद्रपुर जल संरक्षण परियोजना',
          mr: 'मसुदा: चंद्रपूर जल संरक्षण प्रकल्प'
        },
        subHeading: {
          en: 'Proposed initiative to address water scarcity issues',
          hi: 'जल संकट के मुद्दों को संबोधित करने के लिए प्रस्तावित पहल',
          mr: 'पाण्याच्या कमतरतेच्या समस्यांना संबोधित करण्यासाठी प्रस्तावित उपक्रम'
        },
        content: {
          en: 'A comprehensive water conservation project is being planned for Chandrapur district to address recurring water scarcity issues. The project includes rainwater harvesting systems, check dams, and watershed management initiatives. Public consultation meetings will be held next month to gather community input.',
          hi: 'चंद्रपुर जिले में आवर्ती जल संकट के मुद्दों को संबोधित करने के लिए एक व्यापक जल संरक्षण परियोजना की योजना बनाई जा रही है।',
          mr: 'चंद्रपूर जिल्ह्यातील आवर्ती पाण्याच्या कमतरतेच्या समस्यांना संबोधित करण्यासाठी एक व्यापक जल संरक्षण प्रकल्प आखला जात आहे.'
        },
        location: 'chandrapur',
        category: 'Environment',
        published: false, // Draft
        views: 0,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
      }
    ];

    await News.insertMany(dummyNews);
    console.log(`✅ Created ${dummyNews.length} dummy news posts`);

    console.log('\n🎉 Dummy news data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total News: ${dummyNews.length}`);
    console.log(`   - Published: ${dummyNews.filter(n => n.published).length}`);
    console.log(`   - Drafts: ${dummyNews.filter(n => !n.published).length}`);
    console.log('\n📍 Location Distribution:');
    const locationCounts = {};
    dummyNews.forEach(n => {
      locationCounts[n.location] = (locationCounts[n.location] || 0) + 1;
    });
    Object.entries(locationCounts).forEach(([loc, count]) => {
      console.log(`   - ${loc}: ${count} articles`);
    });
    console.log('\n📈 Views Range:');
    const views = dummyNews.filter(n => n.published).map(n => n.views);
    console.log(`   - Highest: ${Math.max(...views)} views`);
    console.log(`   - Lowest: ${Math.min(...views)} views`);
    console.log(`   - Average: ${Math.round(views.reduce((a, b) => a + b, 0) / views.length)} views`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding dummy news:', error);
    process.exit(1);
  }
}

seedDummyNews();

