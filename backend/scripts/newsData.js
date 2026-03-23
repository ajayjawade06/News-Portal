// Real news data from Jan-Mar 2026 (last 2 months)
// Views kept under 5k for realism
const now = Date.now();
const d = (days) => new Date(now - days * 86400000);

export const intlNews = [
  {
    baseLanguage: "en",
    title: { en: "US Federal Reserve Holds Interest Rates Steady at 4.25-4.50%", hi: "अमेरिकी फेडरल रिजर्व ने ब्याज दरों को 4.25-4.50% पर स्थिर रखा", mr: "अमेरिकन फेडरल रिझर्व्हने व्याजदर 4.25-4.50% वर स्थिर ठेवले" },
    subHeading: { en: "Fed signals cautious approach amid persistent inflation concerns", hi: "लगातार मुद्रास्फीति चिंताओं के बीच फेड ने सतर्क रुख का संकेत दिया", mr: "सातत्याने चलनवाढीच्या चिंतेमध्ये फेडने सावध भूमिकेचे संकेत दिले" },
    content: { en: "The US Federal Reserve kept benchmark interest rates unchanged at 4.25-4.50% at its March 2026 meeting, citing persistent inflation that remains above the 2% target. Fed Chair Jerome Powell stated the committee needs more evidence of cooling inflation before considering rate cuts. Markets had priced in a possible cut, and the decision triggered a brief sell-off in equities before stabilizing.", hi: "अमेरिकी फेडरल रिजर्व ने मार्च 2026 की बैठक में ब्याज दरों को 4.25-4.50% पर अपरिवर्तित रखा।", mr: "अमेरिकन फेडरल रिझर्व्हने मार्च 2026 च्या बैठकीत व्याजदर 4.25-4.50% वर अपरिवर्तित ठेवले." },
    location: "maharashtra", category: "International", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 3421, createdAt: d(4)
  },
  {
    baseLanguage: "en",
    title: { en: "Russia-Ukraine Ceasefire Talks Resume in Istanbul After Long Pause", hi: "लंबे अंतराल के बाद इस्तांबुल में रूस-यूक्रेन युद्धविराम वार्ता फिर शुरू", mr: "दीर्घ खंडानंतर इस्तंबूलमध्ये रशिया-युक्रेन युद्धविराम चर्चा पुन्हा सुरू" },
    subHeading: { en: "Turkey mediates renewed diplomatic efforts as both sides signal openness to dialogue", hi: "तुर्की ने मध्यस्थता की क्योंकि दोनों पक्षों ने बातचीत के लिए खुलापन का संकेत दिया", mr: "दोन्ही बाजूंनी संवादाची तयारी दर्शवल्याने तुर्कीने मध्यस्थी केली" },
    content: { en: "Delegations from Russia and Ukraine met in Istanbul for the first time in over a year, mediated by Turkish President Erdogan. Discussions centered on prisoner exchanges and a possible ceasefire framework for the Donbas region. While no formal agreement was reached, both sides described the talks as constructive. The meeting was welcomed by the UN Secretary-General who called it a positive step toward peace.", hi: "रूस और यूक्रेन के प्रतिनिधिमंडल एक वर्ष से अधिक समय में पहली बार इस्तांबुल में मिले।", mr: "रशिया आणि युक्रेनचे प्रतिनिधीमंडळ एका वर्षांनंतर पहिल्यांदा इस्तंबूलमध्ये भेटले." },
    location: "maharashtra", category: "International", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 4102, createdAt: d(8)
  },
  {
    baseLanguage: "en",
    title: { en: "European Central Bank Cuts Interest Rates by 25 Basis Points", hi: "यूरोपीय सेंट्रल बैंक ने ब्याज दरों में 25 आधार अंकों की कटौती की", mr: "युरोपियन सेंट्रल बँकेने व्याजदरात 25 बेसिस पॉइंट्सची कपात केली" },
    subHeading: { en: "ECB moves to stimulate sluggish eurozone economy as inflation stabilizes", hi: "मुद्रास्फीति स्थिर होने पर ECB ने सुस्त यूरोजोन अर्थव्यवस्था को प्रोत्साहित किया", mr: "चलनवाढ स्थिर होताच ECB ने कमकुवत युरोझोन अर्थव्यवस्थेला चालना दिली" },
    content: { en: "The European Central Bank cut its main refinancing rate by 25 basis points to 3.40% in its February 2026 meeting, aiming to boost the stagnating eurozone economy. ECB President Christine Lagarde noted that inflation has stabilized near the 2% target. German and French equity markets rallied on the news, with the DAX gaining 1.8% on the day.", hi: "यूरोपीय सेंट्रल बैंक ने फरवरी 2026 की बैठक में मुख्य दर 25 आधार अंक घटाकर 3.40% किया।", mr: "युरोपियन सेंट्रल बँकेने फेब्रुवारी 2026 च्या बैठकीत मुख्य दर 25 बेसिस पॉइंट्सने 3.40% पर्यंत कमी केला." },
    location: "maharashtra", category: "International", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 2876, createdAt: d(28)
  },
  {
    baseLanguage: "en",
    title: { en: "OpenAI Launches GPT-5 with Breakthrough Reasoning Capabilities", hi: "OpenAI ने सफल तर्क क्षमताओं के साथ GPT-5 लॉन्च किया", mr: "OpenAI ने सफल तर्क क्षमतांसह GPT-5 लॉन्च केले" },
    subHeading: { en: "New AI model demonstrates PhD-level problem solving across science and mathematics", hi: "नया AI मॉडल विज्ञान और गणित में PhD-स्तर की समस्या-समाधान क्षमता प्रदर्शित करता है", mr: "नवीन AI मॉडेल विज्ञान आणि गणितात PhD-स्तरीय समस्या-निराकरण क्षमता दर्शवतो" },
    content: { en: "OpenAI officially released GPT-5 in February 2026, showcasing significant advances in multi-step reasoning and mathematical problem-solving. The model demonstrated PhD-level accuracy in physics, chemistry, and advanced mathematics benchmarks. Sam Altman called it a major step toward artificial general intelligence. Competitors Google and Anthropic announced accelerated timelines for their competing models.", hi: "OpenAI ने फरवरी 2026 में GPT-5 जारी किया, जो बहु-चरण तर्क और गणितीय समस्या-समाधान में महत्वपूर्ण प्रगति दर्शाता है।", mr: "OpenAI ने फेब्रुवारी 2026 मध्ये GPT-5 प्रसिद्ध केले, जे बहु-चरण तर्क आणि गणितीय समस्या-निराकरणात लक्षणीय प्रगती दर्शवते." },
    location: "maharashtra", category: "Technology", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 4890, createdAt: d(35)
  },
  {
    baseLanguage: "en",
    title: { en: "Champions League Quarter-Finals: Real Madrid Edges Past Bayern Munich", hi: "चैंपियंस लीग क्वार्टर-फाइनल: रियल मैड्रिड ने बायर्न म्यूनिख को हराया", mr: "चॅम्पियन्स लीग क्वार्टर-फायनल: रियल माद्रिदने बायर्न म्युनिखवर विजय मिळवला" },
    subHeading: { en: "Vinicius Jr scores late winner as Real Madrid advance to semi-finals", hi: "विनीसियस जूनियर के देर से गोल से रियल मैड्रिड सेमीफाइनल में", mr: "विनिसियस ज्युनिअरच्या उशीरा गोलने रियल माद्रिद सेमीफायनलमध्ये" },
    content: { en: "Real Madrid advanced to the Champions League semi-finals with a dramatic 3-2 aggregate victory over Bayern Munich. Vinicius Jr scored the decisive goal in the 87th minute of the second leg at the Santiago Bernabeu. Bayern had fought back from a first-leg deficit to level the tie before Madrid's late winner. The semi-final draw pairs Madrid against Arsenal, while PSG faces Inter Milan.", hi: "रियल मैड्रिड ने बायर्न म्यूनिख पर 3-2 की जीत से चैंपियंस लीग सेमीफाइनल में प्रवेश किया। विनीसियस ने 87वें मिनट में निर्णायक गोल किया।", mr: "रियल माद्रिदने बायर्न म्युनिखवर 3-2 ने विजय मिळवून चॅम्पीयन्स लीग सेमीफायनलमध्ये प्रवेश केला." },
    location: "maharashtra", category: "Sports", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 4567, createdAt: d(6)
  },
  {
    baseLanguage: "en",
    title: { en: "Earthquake of Magnitude 6.4 Hits Southern Japan, No Tsunami Warning", hi: "दक्षिणी जापान में 6.4 तीव्रता का भूकंप, सुनामी की चेतावनी नहीं", mr: "दक्षिण जपानमध्ये 6.4 तीव्रतेचा भूकंप, त्सुनामी इशारा नाही" },
    subHeading: { en: "Minor structural damage reported in Kyushu region; no casualties confirmed", hi: "क्यूशू क्षेत्र में मामूली संरचनात्मक क्षति की सूचना; कोई हताहत की पुष्टि नहीं", mr: "क्युशू प्रदेशात किरकोळ संरचनात्मक नुकसानीची नोंद; कोणताही मृत्यू नाही" },
    content: { en: "A 6.4 magnitude earthquake struck southern Japan's Kyushu region on March 15, 2026. The Japan Meteorological Agency confirmed no tsunami risk. Minor structural damage was reported in Kumamoto and Oita prefectures. Emergency response teams were deployed immediately and bullet train services were temporarily suspended for safety inspections before resuming within hours.", hi: "15 मार्च 2026 को दक्षिणी जापान के क्यूशू क्षेत्र में 6.4 तीव्रता का भूकंप आया।", mr: "15 मार्च 2026 रोजी दक्षिण जपानच्या क्युशू प्रदेशात 6.4 तीव्रतेचा भूकंप आला." },
    location: "maharashtra", category: "International", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 2190, createdAt: d(8)
  },
];

export const nationalNews = [
  {
    baseLanguage: "en",
    title: { en: "ISRO Successfully Tests Gaganyaan Crew Escape System", hi: "इसरो ने गगनयान क्रू एस्केप सिस्टम का सफल परीक्षण किया", mr: "इस्रोने गगनयान क्रू एस्केप सिस्टमची यशस्वी चाचणी केली" },
    subHeading: { en: "Key safety milestone cleared ahead of India's first manned space mission", hi: "भारत के पहले मानवयुक्त अंतरिक्ष मिशन से पहले प्रमुख सुरक्षा मील का पत्थर पार", mr: "भारताच्या पहिल्या मानवी अंतराळ मोहिमेपूर्वी प्रमुख सुरक्षा टप्पा पार" },
    content: { en: "ISRO successfully conducted the Crew Escape System test for the Gaganyaan programme at Sriharikota on March 2, 2026. The abort mission simulated an emergency during ascent phase and the crew module separated successfully and descended safely with parachutes. ISRO Chairman S Somanath said the mission is on track for late 2026. This test was the last major safety hurdle before the manned mission.", hi: "ISRO ने 2 मार्च 2026 को श्रीहरिकोटा में गगनयान के क्रू एस्केप सिस्टम का सफल परीक्षण किया।", mr: "ISRO ने 2 मार्च 2026 रोजी श्रीहरिकोटा येथे गगनयान क्रू एस्केप सिस्टमची यशस्वी चाचणी केली." },
    location: "maharashtra", category: "National", image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 4230, createdAt: d(21)
  },
  {
    baseLanguage: "en",
    title: { en: "Union Budget 2026: ₹11.2 Lakh Crore for Infrastructure Development", hi: "केंद्रीय बजट 2026: बुनियादी ढांचे के विकास के लिए ₹11.2 लाख करोड़", mr: "केंद्रीय अर्थसंकल्प 2026: पायाभूत विकासासाठी ₹11.2 लाख कोटी" },
    subHeading: { en: "FM Sitharaman announces record capital expenditure outlay with focus on railways and highways", hi: "वित्त मंत्री सीतारमण ने रेल और राजमार्गों पर ध्यान केंद्रित करते हुए रिकॉर्ड पूंजीगत व्यय की घोषणा की", mr: "अर्थमंत्री सीतारामण यांनी रेल्वे आणि महामार्गांवर लक्ष केंद्रित करत विक्रमी भांडवली खर्चाची घोषणा केली" },
    content: { en: "Finance Minister Nirmala Sitharaman presented Union Budget 2026-27 on February 1, 2026, with a record ₹11.2 lakh crore capital expenditure allocation. Key highlights include six new Vande Bharat Express routes, 25,000 km of new highways, and a ₹50,000 crore semiconductor manufacturing fund. Income tax relief was provided for the middle class with revised slabs. The stock market welcomed the budget with BSE Sensex rising 2.1% on budget day.", hi: "वित्त मंत्री सीतारमण ने 1 फरवरी 2026 को बजट प्रस्तुत किया जिसमें ₹11.2 लाख करोड़ का पूंजीगत व्यय शामिल है।", mr: "अर्थमंत्री सीतारामण यांनी 1 फेब्रुवारी 2026 रोजी ₹11.2 लाख कोटी भांडवली खर्चासह अर्थसंकल्प सादर केला." },
    location: "maharashtra", category: "National", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 4980, createdAt: d(50)
  },
  {
    baseLanguage: "en",
    title: { en: "India Beat England 4-1 to Win Test Series at Home", hi: "भारत ने इंग्लैंड को 4-1 से हराकर घरेलू टेस्ट सीरीज जीती", mr: "भारताने इंग्लंडला 4-1 ने हरवून घरच्या मैदानावर कसोटी मालिका जिंकली" },
    subHeading: { en: "Jasprit Bumrah takes 32 wickets in series; R Ashwin announces retirement", hi: "जसप्रीत बुमराह ने सीरीज में 32 विकेट लिए; आर अश्विन ने संन्यास की घोषणा की", mr: "जसप्रीत बुमराहने मालिकेत 32 विकेट्स घेतल्या; आर अश्विनने निवृत्तीची घोषणा केली" },
    content: { en: "India completed a dominant 4-1 Test series victory against England concluding on February 28, 2026. Jasprit Bumrah was named Player of the Series for his 32 wickets. In an emotional moment, veteran spinner R Ashwin announced his retirement from international cricket after the final Test in Dharamsala. Ashwin finished with 537 Test wickets, second only to Anil Kumble among Indian bowlers.", hi: "भारत ने 28 फरवरी 2026 को इंग्लैंड पर 4-1 से टेस्ट सीरीज जीत हासिल की। बुमराह ने 32 विकेट लिए।", mr: "भारताने 28 फेब्रुवारी 2026 रोजी इंग्लंडवर 4-1 ने कसोटी मालिका विजय मिळवला. बुमराहने 32 बळी घेतले." },
    location: "maharashtra", category: "Sports", image: "https://images.unsplash.com/photo-1540747913346-19e32fc3e64b?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 4750, createdAt: d(23)
  },
  {
    baseLanguage: "en",
    title: { en: "India's GDP Growth Accelerates to 7.0% in Q3 FY26", hi: "भारत की GDP वृद्धि Q3 FY26 में 7.0% तक बढ़ी", mr: "भारताची GDP वाढ Q3 FY26 मध्ये 7.0% पर्यंत वाढली" },
    subHeading: { en: "Manufacturing and services lead growth; RBI maintains positive outlook", hi: "विनिर्माण और सेवा क्षेत्र वृद्धि का नेतृत्व करते हैं; RBI ने सकारात्मक दृष्टिकोण बनाए रखा", mr: "उत्पादन आणि सेवा क्षेत्रे वाढीचे नेतृत्व करतात; RBI ने सकारात्मक दृष्टिकोन कायम ठेवला" },
    content: { en: "India's GDP grew by 7.0% in Q3 FY26 (Oct-Dec 2025), surpassing market expectations of 6.7%, according to data released by the NSO on February 28, 2026. Manufacturing grew at 8.4% and services at 6.8%. The RBI maintained its full-year growth projection of 6.8% while noting improving private investment trends and strong urban consumption demand.", hi: "NSO के आंकड़ों के अनुसार भारत की GDP Q3 FY26 में 7.0% बढ़ी, जो बाजार की उम्मीदों 6.7% से अधिक थी।", mr: "NSO च्या आकडेवारीनुसार भारताची GDP Q3 FY26 मध्ये 7.0% वाढली, जी बाजाराच्या 6.7% अपेक्षेपेक्षा अधिक होती." },
    location: "maharashtra", category: "Business", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 3150, createdAt: d(23)
  },
  {
    baseLanguage: "en",
    title: { en: "Delhi Assembly Elections 2026: AAP Wins Third Consecutive Term", hi: "दिल्ली विधानसभा चुनाव 2026: AAP ने लगातार तीसरी बार जीत हासिल की", mr: "दिल्ली विधानसभा निवडणूक 2026: AAPने सलग तिसऱ्यांदा विजय मिळवला" },
    subHeading: { en: "AAP secures 48 out of 70 seats; BJP wins 18, Congress gets 4", hi: "AAP ने 70 में से 48 सीटें हासिल कीं; BJP को 18, कांग्रेस को 4 सीटें मिलीं", mr: "AAP ने 70 पैकी 48 जागा मिळवल्या; BJP ला 18, काँग्रेसला 4 जागा" },
    content: { en: "The Aam Aadmi Party won a decisive victory in the Delhi Assembly Elections held on February 15, 2026, securing 48 of 70 seats. CM Arvind Kejriwal credited the party's focus on education and healthcare reforms. BJP improved its tally to 18 seats from 8 in the previous election. Congress won 4 seats. Voter turnout was recorded at 62.3%, higher than 2020.", hi: "AAP ने 15 फरवरी 2026 को दिल्ली विधानसभा चुनावों में 70 में से 48 सीटें जीतकर निर्णायक जीत दर्ज की।", mr: "AAP ने 15 फेब्रुवारी 2026 रोजी दिल्ली विधानसभा निवडणुकीत 70 पैकी 48 जागा जिंकून निर्णायक विजय मिळवला." },
    location: "maharashtra", category: "National", image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 4650, createdAt: d(36)
  },
  {
    baseLanguage: "en",
    title: { en: "Sensex Crosses 82,000 for First Time; IT and Banking Stocks Lead Rally", hi: "सेंसेक्स पहली बार 82,000 के पार; IT और बैंकिंग शेयरों ने बढ़त बनाई", mr: "सेन्सेक्स पहिल्यांदा 82,000 पार; IT आणि बँकिंग शेअर्सनी तेजी आणली" },
    subHeading: { en: "FII inflows and strong Q3 earnings drive market to historic milestone", hi: "FII प्रवाह और मजबूत Q3 आय ने बाजार को ऐतिहासिक मील के पत्थर तक पहुंचाया", mr: "FII प्रवाह आणि मजबूत Q3 कमाईने बाजारला ऐतिहासिक टप्प्यावर नेले" },
    content: { en: "The BSE Sensex breached the 82,000 mark for the first time on March 10, 2026, driven by strong Q3 corporate earnings and resumed foreign institutional investor inflows of ₹15,000 crore in March alone. TCS, Infosys, and HDFC Bank led the gains. Market analysts project Sensex could reach 85,000 by June 2026 if earnings momentum continues.", hi: "BSE सेंसेक्स ने 10 मार्च 2026 को पहली बार 82,000 का आंकड़ा पार किया।", mr: "BSE सेन्सेक्सने 10 मार्च 2026 रोजी पहिल्यांदा 82,000 चा टप्पा पार केला." },
    location: "maharashtra", category: "Business", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 2980, createdAt: d(13)
  },
];

export const regionalNews = [
  // CHANDRAPUR
  {
    baseLanguage: "en",
    title: { en: "Chandrapur Tiger Reserve Reports Record 78 Tigers in Annual Census", hi: "चंद्रपुर टाइगर रिजर्व में वार्षिक गणना में रिकॉर्ड 78 बाघ", mr: "चंद्रपूर व्याघ्र प्रकल्पात वार्षिक गणनेत विक्रमी 78 वाघ" },
    subHeading: { en: "Conservation efforts and community participation credited for 15% increase over 2024", hi: "संरक्षण प्रयासों और सामुदायिक भागीदारी को 2024 से 15% वृद्धि का श्रेय", mr: "संवर्धन प्रयत्न आणि सामुदायिक सहभागाला 2024 पेक्षा 15% वाढीचे श्रेय" },
    content: { en: "The Tadoba-Andhari Tiger Reserve in Chandrapur district recorded a record 78 tigers in its 2026 annual census, a 15% increase from 2024. Forest officials credited anti-poaching patrols and community-led buffer zone management. The reserve's eco-tourism revenue also crossed ₹40 crore for the first time, benefiting 1,200 local families.", hi: "चंद्रपुर के ताडोबा-अंधारी टाइगर रिजर्व में 2026 की वार्षिक गणना में रिकॉर्ड 78 बाघ दर्ज किए गए।", mr: "चंद्रपूर जिल्ह्यातील ताडोबा-अंधारी व्याघ्र प्रकल्पात 2026 च्या वार्षिक गणनेत विक्रमी 78 वाघांची नोंद झाली." },
    location: "chandrapur", category: "Environment", image: "https://images.unsplash.com/photo-1561731216-c3a4d514e450?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 1890, createdAt: d(15)
  },
  {
    baseLanguage: "en",
    title: { en: "Chandrapur Smart City Project: New Bus Rapid Transit System Inaugurated", hi: "चंद्रपुर स्मार्ट सिटी: नई बस रैपिड ट्रांजिट प्रणाली का उद्घाटन", mr: "चंद्रपूर स्मार्ट सिटी: नवीन बस रॅपिड ट्रान्झिट सिस्टमचे उद्घाटन" },
    subHeading: { en: "25 km BRT corridor with electric buses to reduce city commute times by 40%", hi: "इलेक्ट्रिक बसों के साथ 25 किमी BRT कॉरिडोर शहर की यात्रा समय 40% कम करेगा", mr: "इलेक्ट्रिक बसेससह 25 किमी BRT कॉरिडोर शहरातील प्रवास वेळ 40% कमी करेल" },
    content: { en: "Chandrapur inaugurated its first Bus Rapid Transit corridor on February 20, 2026, under the Smart City Mission. The 25 km route operates 40 electric buses connecting the industrial area to the railway station. Daily ridership is expected to reach 25,000 commuters. The ₹380 crore project was completed 3 months ahead of schedule.", hi: "चंद्रपुर ने 20 फरवरी 2026 को स्मार्ट सिटी मिशन के तहत अपने पहले BRT कॉरिडोर का उद्घाटन किया।", mr: "चंद्रपूरने 20 फेब्रुवारी 2026 रोजी स्मार्ट सिटी मिशन अंतर्गत पहिल्या BRT कॉरिडोरचे उद्घाटन केले." },
    location: "chandrapur", category: "Infrastructure", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 1450, createdAt: d(31)
  },
  // RAJURA
  {
    baseLanguage: "en",
    title: { en: "Rajura Farmers Achieve Record Cotton Yield with Drip Irrigation Scheme", hi: "राजुरा किसानों ने ड्रिप सिंचाई योजना से कपास की रिकॉर्ड पैदावार हासिल की", mr: "राजुरा शेतकऱ्यांनी ठिबक सिंचन योजनेतून विक्रमी कापूस उत्पादन मिळवले" },
    subHeading: { en: "Per-acre yield up 35% as government irrigation scheme covers 10,000 hectares", hi: "सरकारी सिंचाई योजना 10,000 हेक्टेयर कवर करने से प्रति एकड़ पैदावार 35% बढ़ी", mr: "सरकारी सिंचन योजना 10,000 हेक्टर व्यापत असल्याने एकरी उत्पादन 35% वाढले" },
    content: { en: "Cotton farmers in Rajura taluka reported a bumper harvest in the 2025-26 season, with yields jumping 35% per acre. The Maharashtra Government's drip irrigation scheme now covers 10,000 hectares. Water consumption dropped 40% and farmer net income rose by ₹38,000 on average. Agriculture officials plan to expand coverage to 15,000 hectares by next season.", hi: "राजुरा तालुका के कपास किसानों ने 2025-26 सीजन में बंपर फसल की सूचना दी, प्रति एकड़ पैदावार 35% बढ़ी।", mr: "राजुरा तालुक्यातील कापूस शेतकऱ्यांनी 2025-26 हंगामात विक्रमी पीक नोंदवले, एकरी उत्पादन 35% वाढले." },
    location: "rajura", category: "Agriculture", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 980, createdAt: d(25)
  },
  {
    baseLanguage: "en",
    title: { en: "New Zilla Parishad School in Rajura Gets National Education Award", hi: "राजुरा में नया जिला परिषद स्कूल राष्ट्रीय शिक्षा पुरस्कार से सम्मानित", mr: "राजुरामधील नवीन जिल्हा परिषद शाळेला राष्ट्रीय शिक्षण पुरस्कार" },
    subHeading: { en: "School recognized for innovative digital learning program in rural Vidarbha", hi: "ग्रामीण विदर्भ में नवाचारी डिजिटल शिक्षण कार्यक्रम के लिए स्कूल को मान्यता", mr: "ग्रामीण विदर्भातील नवोन्मेषी डिजिटल शिक्षण कार्यक्रमासाठी शाळेला मान्यता" },
    content: { en: "A Zilla Parishad school in Rajura received the National Education Innovation Award from the Ministry of Education on March 5, 2026. The school's tablet-based learning program, serving 450 students, achieved 95% pass rate in board exams. Education Minister praised the model and announced ₹2 crore funding to replicate it across 50 rural schools in Vidarbha.", hi: "राजुरा के एक जिला परिषद स्कूल को 5 मार्च 2026 को शिक्षा मंत्रालय से राष्ट्रीय शिक्षा नवाचार पुरस्कार मिला।", mr: "राजुरा येथील जिल्हा परिषद शाळेला 5 मार्च 2026 रोजी शिक्षण मंत्रालयाकडून राष्ट्रीय शिक्षण नवोन्मेष पुरस्कार मिळाला." },
    location: "rajura", category: "Education", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 760, createdAt: d(18)
  },
  // KORPANA
  {
    baseLanguage: "en",
    title: { en: "Korpana Solar Park Expansion: 50 MW Phase-2 Gets Government Approval", hi: "कोरपाना सोलर पार्क विस्तार: 50 MW फेज-2 को सरकारी मंजूरी", mr: "कोरपाना सोलर पार्क विस्तार: 50 MW फेज-2 ला सरकारी मंजुरी" },
    subHeading: { en: "Expanded facility will power 20,000 additional homes in Vidarbha region", hi: "विस्तारित सुविधा विदर्भ क्षेत्र में 20,000 अतिरिक्त घरों को बिजली देगी", mr: "विस्तारित सुविधा विदर्भ प्रदेशातील अतिरिक्त 20,000 घरांना वीज देईल" },
    content: { en: "The Maharashtra Government approved Phase-2 expansion of the Korpana Solar Park on March 8, 2026, adding 50 MW capacity to the existing 30 MW installation. Construction will begin in April with completion targeted by December 2026. The expanded park will power 20,000 additional homes and create 180 local jobs. The ₹280 crore project is funded under the National Solar Mission.", hi: "महाराष्ट्र सरकार ने 8 मार्च 2026 को कोरपाना सोलर पार्क के फेज-2 विस्तार को मंजूरी दी।", mr: "महाराष्ट्र सरकारने 8 मार्च 2026 रोजी कोरपाना सोलर पार्कच्या फेज-2 विस्ताराला मंजुरी दिली." },
    location: "korpana", category: "Infrastructure", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 1120, createdAt: d(15)
  },
  {
    baseLanguage: "en",
    title: { en: "Korpana Gram Panchayat Becomes 100% Digital in Government Services", hi: "कोरपाना ग्राम पंचायत सरकारी सेवाओं में 100% डिजिटल बनी", mr: "कोरपाना ग्रामपंचायत शासकीय सेवांमध्ये 100% डिजिटल झाली" },
    subHeading: { en: "All birth, death, and land records now available online; lauded as model village", hi: "सभी जन्म, मृत्यु और भूमि रिकॉर्ड अब ऑनलाइन उपलब्ध; आदर्श गांव के रूप में सराहा गया", mr: "सर्व जन्म, मृत्यू आणि जमीन नोंदी आता ऑनलाइन उपलब्ध; आदर्श गाव म्हणून कौतुक" },
    content: { en: "Korpana Gram Panchayat became fully digital on February 25, 2026, with all civic services including birth certificates, land records, and pension applications available through a single online portal. The initiative, part of the Digital India programme, was completed with ₹45 lakh investment. District Collector called it a model for other rural panchayats in Maharashtra.", hi: "कोरपाना ग्राम पंचायत 25 फरवरी 2026 को पूरी तरह डिजिटल हो गई, सभी नागरिक सेवाएं ऑनलाइन उपलब्ध हो गईं।", mr: "कोरपाना ग्रामपंचायत 25 फेब्रुवारी 2026 रोजी पूर्णपणे डिजिटल झाली, सर्व नागरी सेवा ऑनलाइन उपलब्ध झाल्या." },
    location: "korpana", category: "Technology", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 640, createdAt: d(26)
  },
  // MAHARASHTRA
  {
    baseLanguage: "en",
    title: { en: "Mumbai Metro Line 3 Begins Trial Runs Between BKC and Aarey Colony", hi: "मुंबई मेट्रो लाइन 3 ने BKC और आरे कॉलोनी के बीच ट्रायल रन शुरू किया", mr: "मुंबई मेट्रो लाइन 3 ने BKC आणि आरे कॉलोनी दरम्यान चाचणी धाव सुरू केली" },
    subHeading: { en: "Underground Aqua Line expected to open for passengers by August 2026", hi: "भूमिगत एक्वा लाइन अगस्त 2026 तक यात्रियों के लिए खुलने की उम्मीद", mr: "भूमिगत एक्वा लाइन ऑगस्ट 2026 पर्यंत प्रवाशांसाठी खुली होण्याची अपेक्षा" },
    content: { en: "Mumbai Metro Line 3 (Aqua Line), India's first fully underground metro, began trial runs on March 18, 2026, between BKC and Aarey Colony. The 33.5 km corridor with 27 stations will connect the airport to Cuffe Parade. MMRC officials said passenger operations will begin by August 2026. The project will reduce BKC-Airport travel time from 90 minutes to 20 minutes.", hi: "मुंबई मेट्रो लाइन 3 ने 18 मार्च 2026 को BKC और आरे कॉलोनी के बीच ट्रायल रन शुरू किया।", mr: "मुंबई मेट्रो लाइन 3 ने 18 मार्च 2026 रोजी BKC आणि आरे कॉलोनी दरम्यान चाचणी धाव सुरू केली." },
    location: "maharashtra", category: "Infrastructure", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 3870, createdAt: d(5)
  },
  {
    baseLanguage: "en",
    title: { en: "Maharashtra Government Launches ₹5,000 Crore Startup Fund for Tier-2 Cities", hi: "महाराष्ट्र सरकार ने टियर-2 शहरों के लिए ₹5,000 करोड़ का स्टार्टअप फंड लॉन्च किया", mr: "महाराष्ट्र सरकारने टियर-2 शहरांसाठी ₹5,000 कोटींचा स्टार्टअप फंड लॉन्च केला" },
    subHeading: { en: "Nagpur, Nashik, Pune, and Aurangabad to get dedicated incubation centers", hi: "नागपुर, नासिक, पुणे और औरंगाबाद को समर्पित इन्क्यूबेशन सेंटर मिलेंगे", mr: "नागपूर, नाशिक, पुणे आणि औरंगाबादला समर्पित इन्क्युबेशन सेंटर मिळतील" },
    content: { en: "Chief Minister Devendra Fadnavis announced a ₹5,000 crore startup fund on March 12, 2026, targeting entrepreneurs in Nagpur, Nashik, Pune, and Aurangabad. The fund provides seed capital up to ₹50 lakh, mentorship programs, and co-working spaces. The initiative aims to create 10,000 startups and 50,000 jobs over five years, decentralizing Maharashtra's startup ecosystem beyond Mumbai.", hi: "मुख्यमंत्री देवेंद्र फडणवीस ने 12 मार्च 2026 को ₹5,000 करोड़ का स्टार्टअप फंड लॉन्च किया।", mr: "मुख्यमंत्री देवेंद्र फडणवीस यांनी 12 मार्च 2026 रोजी ₹5,000 कोटींचा स्टार्टअप फंड लॉन्च केला." },
    location: "maharashtra", category: "Business", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
    published: true, views: 2340, createdAt: d(11)
  },
];
