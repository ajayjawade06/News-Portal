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

// Generate random date between start and end
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const startDate = new Date('2026-03-20T00:00:00Z');
const endDate = new Date('2026-04-16T10:00:00Z');

const detailedNewsItems = [
  {
    title: 'IPL 2026 table updates: Chennai Super Kings Return to Complete Dominance',
    subHeading: 'A spectacular win on their home ground propels CSK to the top spot.',
    content: 'The Indian Premier League 2026 season has seen a massive resurgence of the Chennai Super Kings. After a rocky start in the preseason, the team has bounced back with unparalleled vigor. Captain Ruturaj Gaikwad praised the middle order for their consistency under pressure, noting that the spin department has practically choked the opposition in the middle overs. Critics had previously counted them out due to injuries, but the squad depth has proven to be their biggest asset this year. The stadium was packed as the legendary franchise claimed yet another commanding victory, establishing themselves as the firm favorites to reach the playoffs once more.',
    category: 'Sports',
    location: 'national',
  },
  {
    title: 'European Union Passes Groundbreaking AI Safety Regulations',
    subHeading: 'Tech giants face strict compliance deadlines as new framework takes effect.',
    content: 'In a significant milestone for technology governance, the European Union has officially passed its comprehensive AI Safety Regulations. The framework aims to enforce strict audits on high-risk artificial intelligence models, prioritizing user privacy, bias mitigation, and transparency. Tech giants operating across Europe now have a limited grace period to adhere to the newly established requirements or face massive financial penalties. Proponents of the bill celebrate it as a necessary step towards ethical tech development, while some industry leaders warn it could stifle innovation and shift the competitive edge to other international hubs. The global tech community is closely watching how these regulations will shape future enterprise software.',
    category: 'Technology',
    location: 'international',
  },
  {
    title: 'Indian Stock Markets Reach All-Time Highs Amid Foreign Investments',
    subHeading: 'BSE Sensex and Nifty roar past historical barriers fueled by optimistic growth data.',
    content: 'The Indian stock markets witnessed an unprecedented rally this week, with both the BSE Sensex and Nifty breaching historical resistance levels to establish all-time highs. The surge is largely attributed to a massive influx of foreign institutional investments, coupled with unexpectedly strong domestic corporate earnings in the last quarter. Analysts predict that this bull run might be sustainable if inflation models remain within the projected targets. Retail investors are increasingly pouring capital into mid-cap and small-cap mutual funds, reflecting widespread optimism in the broader economic story. Government fiscal policies aimed at boosting manufacturing and infrastructure have clearly begun to yield tangible market confidence.',
    category: 'Business',
    location: 'national',
  },
  {
    title: 'NASA Announces New Launch Window for Ambitious Mars Rover',
    subHeading: 'The upcoming mission will search for complex organic compounds beneath the Martian surface.',
    content: 'NASA has officially announced a new launch window for its highly anticipated next-generation Mars rover, designed to explore regions previously deemed inaccessible. Equipped with an advanced drill and autonomous sample caching systems, the rover aims to scan deep beneath the Martian surface for complex organic compounds. Scientists believe these subsurface layers have been shielded from harsh cosmic radiation, thereby increasing the chances of detecting ancient biosignatures. The launch is scheduled for late 2026, taking advantage of an optimal planetary alignment. Collaborative contributions from the European Space Agency will ensure that the raw data gathered by the rover can be analyzed globally within hours of transmission.',
    category: 'Science',
    location: 'international',
  },
  {
    title: 'Maharashtra Government Announces Massive Drought Relief Package',
    subHeading: 'Financial aid and water supply resources redirected to heavily affected rural districts.',
    content: 'The State Government of Maharashtra has unveiled a comprehensive drought relief package worth thousands of crores, aimed primarily at assisting farmers in the Marathwada and Vidarbha regions. Irregular monsoons over the past year have severely depleted groundwater reserves, severely affecting crop yields and rural livelihoods. The new package includes direct cash transfers to distressed farmers, subsidized fodder for livestock, and the immediate deployment of water tankers to remote villages. Additionally, long-term infrastructure projects focusing on micro-irrigation and watershed management are being fast-tracked. Opposition leaders have criticized the delay in implementing the aid, but agricultural unions have cautiously welcomed the massive intervention.',
    category: 'Politics',
    location: 'maharashtra',
  },
  {
    title: 'IPL 2026: Kolkata Knight Riders Obliterate Scoring Records',
    subHeading: 'A breathtaking display of power hitting stuns the opposition and fans alike.',
    content: 'The Kolkata Knight Riders etched their names into the history books last night with an astonishing display of batting fireworks, breaking the all-time highest team total record in the IPL. Their openers set a blistering pace right from the powerplay, clearing the boundaries with ease, while the middle order capitalized relentlessly on the weary bowling attack. The bowling side was left with no answers as yorkers and bouncers were dispatched into the stands unceremoniously. KKR management attributed this success to their new data-driven approach towards match-ups and aggressive intent from the first ball. The crowd at Eden Gardens erupted in joy as the team cemented its reputation as the most explosive batting lineup of 2026.',
    category: 'Sports',
    location: 'national',
  },
  {
    title: 'Breakthrough in Quantum Computing Achieved at MIT',
    subHeading: 'A new stable qubit design promises to accelerate the era of practical quantum computing.',
    content: 'Researchers at the Massachusetts Institute of Technology have published a groundbreaking paper detailing a new architecture for quantum bits (qubits) that dramatically increases their stability at slightly higher temperatures. Traditionally, quantum computers require near absolute zero environments to function without massive error margins, making them wildly expensive and difficult to scale. This new design implements a specialized topological structure that inherently protects quantum states from external interference. If the technology scales as projected, it could revolutionize drug discovery, complex supply chain logistics, and cryptography far sooner than previously anticipated. Industry giants like IBM and Google have already expressed intense interest in licensing the methodology.',
    category: 'Technology',
    location: 'international',
  },
  {
    title: 'Mumbai Coastal Road Phase 2 Officially Opened for Public Use',
    subHeading: 'The infrastructure marvel promises to drastically cut commute times across the city.',
    content: 'In a huge relief for Mumbai commuters, Phase 2 of the ambitious Coastal Road project has been officially inaugurated and opened for public transit. This new stretch connects key intersections in the southern suburbs to the western express networks, effectively bypassing some of the city’s most notorious traffic bottlenecks. The high-speed corridor is equipped with modern smart-traffic management systems and visually stunning sea-facing promenades designed for pedestrians and cyclists. Civic authorities report that travel times between Nariman Point and Bandra have been slashed by nearly 40 minutes during peak hours. Environmentalists, however, continue to monitor the long-term ecological impact of the reclaimed land on the local marine biodiversity.',
    category: 'Infrastructure',
    location: 'maharashtra',
  },
  {
    title: 'Global Climate Summit Concludes With Binding Agreements on Emission Cuts',
    subHeading: 'World leaders agree to phase out coal subsidies by 2030.',
    content: 'The latest United Nations Global Climate Summit has successfully concluded with multiple binding agreements that mark a pivotal shift in international environmental policy. For the first time, major industrialized nations have signed onto a legally binding commitment to entirely phase out direct coal subsidies by 2030. Furthermore, a substantial compensatory fund has been established to assist developing nations in transitioning to renewable energy grids without crippling their economic growth. While activist groups argue that the targets still fall short of the ideal 1.5°C threshold required to halt severe climate shifts, policymakers are celebrating the summit as a monumental victory for diplomacy. Execution and transparent reporting will be strongly monitored over the next four years.',
    category: 'Environment',
    location: 'international',
  },
  {
    title: 'Major EV Manufacturing Hub to be Setup Near Pune',
    subHeading: 'An international auto consortium pledges billions in investment to boost green mobility.',
    content: 'A massive boost to India’s green mobility aspirations came through today as an international consortium of auto manufacturers announced plans to establish a mega Electric Vehicle (EV) manufacturing hub on the outskirts of Pune. The facility, expected to be operational by early 2028, will not only assemble premium electric cars but also manufacture high-capacity solid-state batteries. The local government has agreed to provide subsidized land and tax incentives to facilitate the rapid development of the site. This project is projected to create over 15,000 direct jobs and foster a local ecosystem of auto-ancillary startups. It solidifies Pune’s status as the undisputed "Detroit of the East" pivoting gracefully to the EV revolution.',
    category: 'Business',
    location: 'maharashtra',
  },
  {
    title: 'National Elections Update: Voter Turnout Surges in the Second Phase',
    subHeading: 'Rural and urban constituencies witness enthusiastic participation across multiple states.',
    content: 'Early reports from the Election Commission indicate that the second phase of the national parliamentary elections has seen a substantial surge in voter turnout. Defying predictions of voter apathy caused by summer heatwaves, millions of citizens thronged to polling booths across several key northern and central states. Political analysts suggest that the high participation rate is driven entirely by deeply contested local issues, ranging from agricultural reforms to urban job creation. Both the ruling coalition and primary opposition blocs are claiming strong momentum, though official exit polls remain heavily guarded. Enhanced security protocols ensured that the voting process remained largely peaceful with minimal disruption reported.',
    category: 'Politics',
    location: 'national',
  },
  {
    title: 'T20 World Cup Preparations: BCCI Shortlists Preliminary Squad',
    subHeading: 'Selectors strike a balance between seasoned veterans and explosive young talent.',
    content: 'As the ICC T20 World Cup edges closer, the Board of Control for Cricket in India (BCCI) has officially announced a preliminary 20-member squad, ending weeks of speculation. The selection panel has reportedly emphasized recent IPL form whilst retaining the core leadership group experienced in high-pressure ICC tournaments. Surprising inclusions feature two completely uncapped spin-bowling all-rounders who have taken the domestic circuit by storm this season. The squad is scheduled to undergo an intensive strength and conditioning camp at the National Cricket Academy before heading to the host nation. Fans are intensely debating the omission of certain star players, adding immense pressure on the management to deliver a trophy.',
    category: 'Sports',
    location: 'national',
  },
  {
    title: 'Indian Cinema Shines Bright on the International Stage',
    subHeading: 'A highly acclaimed regional film wins Best Foreign Feature at a prestigious global festival.',
    content: 'Indian cinema has once again asserted its global relevance, as a critically acclaimed regional independent film swept the awards at a prestigious international film festival in Europe. The movie, which tells a deeply emotional story of rural migration and cultural identity, took home the top honor for Best Foreign Feature. The director, speaking at the award ceremony, dedicated the trophy to the unsung storytelling traditions of regional India that are finally receiving mainstream global acknowledgment. The overwhelming success has prompted major streaming platforms to aggressively acquire the distribution rights, guaranteeing the film an audience in over 100 countries. It marks a golden era where localized narratives cross borders effortlessly.',
    category: 'Entertainment',
    location: 'international',
  },
  {
    title: 'Reserve Bank of India Leaves Key Interest Rates Unchanged',
    subHeading: 'The central bank focuses on controlling core inflation while supporting GDP growth.',
    content: 'In its bi-monthly monetary policy review meeting, the Reserve Bank of India (RBI) decided unanimously to keep the primary repo rate unchanged. The Governor stated that the decision reflects a delicate balance required to nurture ongoing economic recovery while keeping a tight leash on core inflationary pressures. Global supply chain disruptions and fluctuating crude oil prices remain significant variables in the bank’s future projections. Industry leaders expressed slight disappointment as they were hoping for a marginal rate cut to reduce capital borrowing costs. Nevertheless, the RBI retains its "accommodative" stance, indicating immediate readiness to adjust levers should systemic liquidity problems arise in the upcoming quarter.',
    category: 'Business',
    location: 'national',
  },
  {
    title: 'Breakthrough Cancer Vaccine Enters Phase III Global Trials',
    subHeading: 'The mRNA-based treatment shows remarkable efficacy in preventing tumor recurrence.',
    content: 'Medical scientists have announced a monumental step forward in oncology as a personalized mRNA-based cancer vaccine officially enters Phase III global clinical trials. Initially tailored to treat aggressive forms of melanoma and pancreatic cancers, the vaccine works by training the immune system to recognize unique mutations present only in the patient’s tumor cells. Phase II results published last month showed a staggering 65% reduction in tumor recurrence among high-risk patients over a three-year span. Hospitals across the United States, Europe, and Asia are now actively enrolling participants for the final trial phase. If successful, this therapy could radically alter the standard protocol for post-operative cancer care globally.',
    category: 'Science',
    location: 'international',
  },
  {
    title: 'IPL 2026: The Rise of the Impact Substitute Rule',
    subHeading: 'Strategic substitutions are completely redefining the dynamics of T20 chases.',
    content: 'The IPL 2026 season has been heavily defined by the strategic genius behind the newly refined "Impact Substitute" rule. Franchises are no longer relying on traditional all-rounders, instead fielding specialist bowlers early in the innings and seamlessly replacing them with explosive heavy-hitters during the death overs. This has resulted in higher average team totals and matches frequently going down to the thrilling final ball. Coaches argue that the rule has significantly increased the complexity of real-time decision-making, requiring highly analytical support staff on the bench. Traditionalists remain skeptical of how it impacts player development, but the entertainment value has undeniably soared, breaking all previous viewership metrics.',
    category: 'Sports',
    location: 'national',
  },
  {
    title: 'New High-Speed Rail Corridor Announced Connecting Mumbai and Nagpur',
    subHeading: 'The project aims to integrate commercial hubs and slash travel times across the state.',
    content: 'The Central and State governments have jointly green-lit an ambitious high-speed rail corridor connecting the commercial capital Mumbai with Nagpur in central Maharashtra. Utilizing semi-maglev technology, the trains are expected to achieve cruising speeds exceeding 250 km/h, fundamentally altering the logistics and travel landscape of the state. The project is designed to run parallel to the recently constructed expressway, sharing infrastructure costs and ecological clearances. Officials estimate that direct rail travel time will be reduced to a mere four hours. While the initial capital expenditure is immense, long-term projections highlight massive boosts to tourism, freight, and decentralized urban development across the corridor.',
    category: 'Infrastructure',
    location: 'maharashtra',
  },
  {
    title: 'Tech Giants Unveil the Future of Augmented Reality at Developer Conference',
    subHeading: 'Lighter, more powerful wearables are expected to replace traditional smartphones by 2030.',
    content: 'At the highly anticipated Silicon Valley Annual Developer Conference, leading tech titans unveiled their next generation of Augmented Reality (AR) wearables. Unlike the bulky headsets of the past, these new devices resemble standard prescription glasses yet pack the processing power of a high-end laptop. Built-in neural processing units can overlay real-time contextual information, translate foreign languages instantly, and project interactive holographic displays onto empty office desks. The presentation strongly insinuated an industry-wide pivot away from handheld smartphones towards ambient computing. Pre-order demands have already crashed servers, signaling that the consumer market is finally ready to embrace the AR revolution at scale.',
    category: 'Technology',
    location: 'international',
  },
  {
    title: 'Major Agricultural Reforms Implemented Amidst Mixed Reactions',
    subHeading: 'New policies aim to digitize the farm-to-market supply chain, bypassing middlemen.',
    content: 'The Federal Agricultural Ministry has rolled out a sweeping set of reforms designed to completely digitize the supply chain from farm gate to wholesale markets. Through a centralized mobile application, farmers can now bid directly with nationwide retail conglomerates, effectively bypassing traditional local middlemen and commission agents. The government asserts that this will result in a minimum 30% increase in net income for the primary producers. However, the move has sparked localized protests in traditional wholesale hubs, where brokers argue the system threatens millions of subsidiary livelihoods. The implementation timeline is divided into phases to allow localized training, but the long-term impact on the agrarian economy remains hotly debated.',
    category: 'Politics',
    location: 'national',
  },
  {
    title: 'Diplomatic Progress Achieved in Indo-Pacific Regional Trade Talks',
    subHeading: 'Nations agree to lower supply chain barriers and share cyber-defense intelligence.',
    content: 'A major diplomatic breakthrough was achieved at the Indo-Pacific Economic Framework summit held in Tokyo this week. Key member nations have formally agreed to a multi-lateral pact aimed at reducing trade friction, easing supply chain barriers, and committing to shared intelligence regarding cyber-defense against state-sponsored actors. The agreements are largely seen as a strategic economic alignment to counterbalance the supply chain monopolies held by non-member superpower nations. Additionally, standardized protocols for rapid resource sharing during devastating natural disasters have been green-lighted. Economic analysts suggest that this pact will massively stimulate cross-border e-commerce and technological investments across the South Asian corridor over the next decade.',
    category: 'World',
    location: 'international',
  }
];

const dummyComments = [
  { name: 'John Doe', text: 'This is an incredibly detailed article, thanks for the info!' },
  { name: 'Priya Sharma', text: 'I completely agree with this perspective. Well researched.' },
  { name: 'Alex Johnson', text: 'Thanks for the quick and thorough update on this developing news.' },
  { name: 'Ramesh Singh', text: 'Excellent coverage, keep up the good journalism.' },
  { name: 'Sarah Connor', text: 'Interesting read! Looking forward to more updates regarding this.' },
  { name: 'Amit Patel', text: 'Wow, I had no idea about the deeper context. Very enlightening.' },
  { name: 'Sneha K', text: 'This helps me a lot for my exams, thanks!' },
  { name: 'David W', text: 'To be honest, I think the author missed a few critical political points.' },
  { name: 'Kiran T', text: 'Fascinating. I am sharing this on my social media right away.' },
  { name: 'Ankita R', text: 'The sports analysis is spot on. Exactly what we were discussing yesterday.' },
  { name: 'Michael B', text: 'Huge implications for the economy if this turns out to be entirely accurate.' },
  { name: 'Pooja J', text: 'Always rely on this portal for unbiased global news. Good job.' }
];

const dummyRatingsList = [
  { name: 'John Doe', feedback: 'Very well structured info', ratingValue: 5 },
  { name: 'Priya S', feedback: 'Okay article, a bit long', ratingValue: 4 },
  { name: 'Aakash M', feedback: 'Could be better researched in parts', ratingValue: 3 },
  { name: 'Rahul K', feedback: 'Loved the deep dive', ratingValue: 5 },
  { name: 'Vikas T', feedback: 'Nicely written without bias', ratingValue: 4 },
  { name: 'Kavita R', feedback: 'Very engaging and factual', ratingValue: 5 },
  { name: 'Sanjay P', feedback: 'Good stuff.', ratingValue: 4 },
  { name: 'Neha V', feedback: 'Excellent storytelling.', ratingValue: 5 }
];

function generateRandomComments() {
    const num = Math.floor(Math.random() * 6) + 3; // 3 to 8 comments
    const selected = [];
    for(let i=0; i<num; i++) {
        const c = dummyComments[Math.floor(Math.random() * dummyComments.length)];
        selected.push({ name: c.name, text: c.text, createdAt: randomDate(startDate, endDate) });
    }
    return selected;
}

function generateRandomRatings() {
    const num = Math.floor(Math.random() * 8) + 4; // 4 to 11 ratings
    const selected = [];
    for(let i=0; i<num; i++) {
        const r = dummyRatingsList[Math.floor(Math.random() * dummyRatingsList.length)];
        selected.push({ name: r.name, feedback: r.feedback, ratingValue: r.ratingValue, createdAt: randomDate(startDate, endDate) });
    }
    return selected;
}

function calculateAggregateRating(ratings) {
  let totalRatings = ratings.length;
  if(totalRatings === 0) return { averageRating: 0, totalRatings: 0, ratingBreakdown: { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 } };

  let sum = 0;
  let breakdown = { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 };
  for(let r of ratings) {
    sum += r.ratingValue;
    if(r.ratingValue === 5) breakdown.fiveStar++;
    if(r.ratingValue === 4) breakdown.fourStar++;
    if(r.ratingValue === 3) breakdown.threeStar++;
    if(r.ratingValue === 2) breakdown.twoStar++;
    if(r.ratingValue === 1) breakdown.oneStar++;
  }
  return {
    averageRating: Number((sum / totalRatings).toFixed(1)),
    totalRatings: totalRatings,
    ratingBreakdown: breakdown
  };
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Inserting 20 highly detailed news items...');
        let count = 0;

        for(let item of detailedNewsItems) {
            const comments = generateRandomComments();
            const ratings = generateRandomRatings();
            const views = Math.floor(Math.random() * 4000) + 500; // Large views
            const aggregateRating = calculateAggregateRating(ratings);
            const pubDate = randomDate(startDate, endDate);

            const newNews = new News({
                baseLanguage: 'en',
                title: { en: item.title, hi: '', mr: '' },
                subHeading: { en: item.subHeading, hi: '', mr: '' },
                content: { en: item.content, hi: '', mr: '' },
                location: item.location,
                category: item.category,
                published: true,
                isFeatured: Math.random() > 0.6, // 40% chance to be featured
                createdAt: pubDate,
                views,
                comments,
                ratings,
                aggregateRating
            });

            await newNews.save();
            count++;
        }
        
        console.log(`Successfully added ${count} highly detailed news items spanning from March 20 to today.`);
        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);

    } catch (e) {
        console.error('Error during seeding:', e);
        process.exit(1);
    }
}

seed();
