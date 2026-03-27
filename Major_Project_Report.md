# PROJECT REPORT
## Multilingual News Publishing Portal for Independent Reporter

---

# CHAPTER 1: INTRODUCTION

## 1.1 Company Profile / Institute Profile / Client Profile
**[Your Institute Name Here]**
This project is developed as a Major Project for the Master of Computer Applications (MCA) Semester 4. The goal is to demonstrate a real-world application of full-stack web development and automated services.

## 1.2 Abstract
The **Multilingual News Publishing Portal** is a comprehensive full-stack web application designed for independent reporters to publish news content in multiple languages. The core innovation lies in its **auto-translation** capability: a reporter can write an article in one language (English, Hindi, or Marathi), and the system automatically translates the content into the other supported languages using integrated translation APIs.

Guest users can browse news by regional coverage (Local, National, International) and toggle between languages dynamically. The application ensures a seamless reading experience while reducing the manual effort required for multilingual publishing.

## 1.3 Existing System and Need for System
### Existing System
Most independent news portals or blogs require manual translation for each language, which is time-consuming and often leads to delays in publishing breaking news across different linguistic demographics. Existing CMS platforms may offer plugins, but they are often complex or expensive for individual reporters.

### Need for System
1. **Time Efficiency**: Automation of translation allows instant publishing in multiple languages.
2. **Accessibility**: Reaches a wider audience by providing news in regional languages (Hindi and Marathi) alongside English.
3. **Cost-Effective**: Uses free/open-source translation APIs and the MERN stack to maintain low overhead.
4. **Independent Reporting**: Tailored specifically for the needs of a single reporter or small news agency.

## 1.4 Scope of System
- **Reporter Dashboard**: Full CRUD (Create, Read, Update, Delete) operations for news articles.
- **Multilingual Support**: Dynamic switching between English, Hindi, and Marathi.
- **Auto-Translation**: Integration with translation services (LibreTranslate/Google Translate API).
- **Categorization**: News filtering by coverage (Local, National, International).
- **Responsive Web UI**: Accessible across desktop and mobile devices.

## 1.5 Operating Environment - Hardware and Software
### Hardware Requirements
- **Processor**: Intel Core i3 or higher (or equivalent AMD processor).
- **RAM**: Minimum 4GB (8GB recommended for development).
- **Storage**: 500MB of free space for project files and local database.
- **Display**: 1366x768 resolution or higher.

### Software Requirements
- **Operating System**: Windows 10/11 or Unix-based (Linux/macOS).
- **Database**: MongoDB (Local or Atlas).
- **Backend Runtime**: Node.js (v16.x or higher).
- **Frontend Framework**: React.js (v18.x).
- **Development Tools**: VS Code, Vite, npm/yarn.
- **Web Browser**: Chrome, Firefox, Edge, or Safari.

## 1.6 Brief Description of Technology Used
- **Operating System**: Windows (Primary Development Environment).
- **Database**: **MongoDB** – A NoSQL database used for storing flexible JSON-like documents (News and Reporter data).
- **Technology Stack (MERN)**:
  - **MongoDB**: Database layer.
  - **Express.js**: Backend web framework.
  - **React.js**: Frontend UI library.
  - **Node.js**: Server-side runtime environment.
- **Styling**: **Tailwind CSS** – For rapid UI development and modern aesthetics.
- **Authentication**: **JWT (JSON Web Tokens)** – For secure session management.
- **Internationalization**: **i18next** – To handle frontend language switching.
- **Translation**: **LibreTranslate / Google Translate API** – For automated content translation.

---

# CHAPTER 2: PROPOSED SYSTEM

## 2.1 Study of Similar Systems
Many large-scale news platforms like **Times of India**, **Dainik Jagran**, and **BBC** provide content in multiple languages. However, these platforms typically employ large teams of translators and editors to manually rewrite articles for different linguistic versions.

### Comparison with the Proposed System:
- **Manual Portals**: Slow, high cost, requires multiple editors.
- **Proposed System**: Near-instant publishing, automated translation, low cost, manageable by a single reporter.

## 2.2 Feasibility Study
### 2.2.1 Technical Feasibility
The project uses the MERN stack, which is robust and widely supported. Integrating translation APIs (LibreTranslate/Google Translate) is technically viable with standard HTTP requests. React’s state management effectively handles dynamic language switching on the frontend.

### 2.2.2 Operational Feasibility
The system is designed with a user-friendly Reporter Dashboard. Any user with basic web knowledge can operate the portal. The automated translation removes the need for multilingual proficiency, making it operationally efficient for independent reporters.

### 2.2.3 Economic Feasibility
The project uses free-tier or open-source technologies (MongoDB Atlas, Render, Vercel, LibreTranslate). There is no requirement for expensive server licenses or large-scale data storage in the initial phase, making it highly affordable.

## 2.3 Objectives of Proposed System
1. **Automated Translation**: To remove the manual overhead of translating news articles.
2. **Dynamic UI Support**: To provide a seamless multilingual user interface for readers.
3. **Reporter Efficiency**: To empower a single reporter to reach a diverse linguistic audience easily.
4. **Scalability**: To design a system that can easily add more languages or categories in the future.

## 2.4 Users of System
1. **Guest Users (Public)**:
   - Browse published news.
   - Filter news by region (Local, National, International).
   - Change the language of the entire website.
2. **Reporter (Administrator)**:
   - Secure login.
   - Access to Dashboard for managing news.
   - Ability to Create, Update, Delete news with auto-translation.
   - Toggle "Published" status to control visibility.

---

# CHAPTER 3: ANALYSIS AND DESIGN

## 3.1 System Requirements
### Functional Requirements
- **Authentication**: Reporter must be able to log in securely.
- **News Management**: Reporter can Create, Read, Update, and Delete news.
- **Auto-Translation**: System must translate content into English, Hindi, and Marathi automatically.
- **Language Switching**: Users must be able to switch the UI language dynamically.
- **Regional Filtering**: News must be categorizable into Local, National, and International.

### Non-Functional Requirements
- **Performance**: News articles should load within 2 seconds.
- **Responsiveness**: The portal must work on Mobile, Tablet, and Desktop.
- **Security**: JWT-based security for reporter-only routes.
- **Usability**: Clean, minimalist UI for error-free news reading.

## 3.2-3.8 System Diagrams
Detailed diagrams for the system are available in the `Diagram/` directory of the project. These include:
- **ERD (Entity Relationship Diagram)**: Representing Reporter and News collections.
- **Use Case Diagram**: Defining Visitor and Reporter actions.
- **Class Diagram**: Showing the structure of React components and Backend models.
- **Activity Diagram**: Workflow of news creation and translation.
- **Sequence Diagram**: Flow of API requests for authentication and news retrieval.
- **Deployment Diagram**: Visualizing the MERN stack deployment on Vercel/Render.

## 3.9 Table Structure
The system uses MongoDB (NoSQL), but the logical schemas are as follows:

### Reporter Collection
| Field | Type | Description |
|---|---|---|
| username | String | Username for login |
| email | String | Unique email of the reporter |
| password | String | Hashed password (bcrypt) |

### News Collection
| Field | Type | Description |
|---|---|---|
| baseLanguage | Enum | Source language (en, hi, mr) |
| title | Object | Translated titles (en, hi, mr) |
| content | Object | Translated content (en, hi, mr) |
| coverage | Enum | local, national, international |
| category | String | E.g., Politics, Sports, Technology |
| image | String | URL of the uploaded news image |
| published | Boolean | Status of the news article |

## 3.10 Data Dictionary
- **baseLanguage**: Stores the code of the language used by the reporter during creation.
- **title.en / content.hi**: Nested fields within the title and content objects to store specific translations.
- **coverage**: A required field to determine where the news will be listed (Local/National/Intl).
- **image**: Stores the relative path to the image stored in the `uploads/` folder.

## 3.11 Module Hierarchy Diagram
```
[Frontend] -> [Auth Context] -> [Pages: Home, Dashboard, etc.]
     |
[API (Axios)] 
     |
[Express Server] -> [Middleware: Auth, Upload]
     |
[Models: News, Reporter]
     |
[MongoDB]
```

## 3.12 Sample Input and Output Screens
*(Detailed screenshots with at least 15 valid records would be inserted here from the live application.)*
- **Screen 1**: Guest Homepage with language toggle.
- **Screen 2**: News Detail view in Marathi.
- **Screen 3**: Reporter Login Page.
- **Screen 4**: Dashboard with Analytics and News List.
- **Screen 5**: Create News form with Automatic Translation feature.

---

# CHAPTER 4: CODING

## 4.1 Algorithm
### Auto-Translation Process
1. **Input**: Reporter provides Title, Content, and Category in a Base Language (e.g., English).
2. **Detection**: System identifies the target languages (Hindi and Marathi).
3. **API Call**: Backend sends the base text to the Translation Service (Google/LibreTranslate).
4. **Handling Chunks**: If content is long (>4000 chars), it is split into sentences/chunks to avoid API character limits.
5. **Collection**: All translated segments are combined.
6. **Storage**: The original and all translated versions are stored in a single MongoDB document.
7. **Fallback**: If an API call fails, the system defaults to the base language to ensure the post is still created.

### Authentication Flow
1. **Request**: Reporter sends Email and Password.
2. **Verification**: Backend checks if the email exists and compares the hashed password using `bcrypt`.
3. **Token Generation**: If valid, a JWT (JSON Web Token) is generated and returned.
4. **Authorization**: Subsequent "Protected" requests must include this token in the header.

## 4.2 Code Snippets
### 4.2.1 Core Translation Logic (`translator.js`)
```javascript
async function translateText(text, sourceLang, targetLang) {
  const providers = [
    { name: 'google-lib', fn: translateWithGoogleLib },
    { name: 'libretranslate', fn: translateWithLibreTranslate },
    { name: 'mymemory', fn: translateWithMyMemory }
  ];

  for (const provider of providers) {
    try {
      const translated = await provider.fn(text, sourceLang, targetLang);
      if (translated && translated !== text) return translated;
    } catch (error) { continue; }
  }
  return text; // Fallback
}
```

### 4.2.2 News Creation with Translation (`news.js`)
```javascript
router.post('/', authenticateReporter, upload.single('image'), async (req, res) => {
  const { title, content, baseLanguage } = req.body;
  
  // Call the translation utility
  const translated = await translateNewsContent(title, content, baseLanguage);

  const newsData = {
    baseLanguage,
    title: translated.title,
    content: translated.content,
    publishedBy: req.reporter._id
  };

  const news = await News.create(newsData);
  res.status(201).json({ success: true, data: news });
});
```

---

# CHAPTER 5: TESTING

## 5.1 Test Strategy
The testing strategy for the Multilingual News Portal focused on **Manual Functional Testing**. Since the project involves third-party API integrations (for translation) and dynamic UI updates, manual verification ensured that the user experience remained consistent across different languages and devices.

## 5.2 Unit Test Plan
| Feature | Test Scenario | Expected Result |
|---|---|---|
| Login | Enter valid credentials | User redirected to Dashboard |
| News Creation | Create news with English base | Hindi and Marathi translations generated |
| Image Upload | Upload 2MB JPEG image | Image displayed in news detail |
| Language Toggle | Click "Marathi" in Navbar | UI and Content switch to Marathi |

## 5.3 Acceptance Test Plan
- **Accessibility**: Guest users must be able to read news without logging in.
- **Accuracy**: Translations must be readable and culturally appropriate for HI/MR.
- **Security**: Non-reporters must not be able to access the `/dashboard` or `/create-news` pages.

## 5.4 TestCase / Test Script
**Test Case ID: TC-01 (News Translation)**
1. Login as Reporter.
2. Navigate to "Create News".
3. Write Title: "Global Warming Effects" in English.
4. Click "Submit".
5. Logout and view the home page.
6. Switch language to Hindi.
7. Verify Title is translated to "ग्लोबल वार्मिंग के प्रभाव".

## 5.5 Defect Report / Test Log
| Date | Defect Description | Severity | Status |
|---|---|---|---|
| 2026-03-20 | Translation API timeout on long content | Medium | Fixed (Chunking added) |
| 2026-03-22 | Image not showing in Marathi view | High | Fixed (Path mapping corrected) |

---

# CHAPTER 6: LIMITATIONS OF THE PROPOSED SYSTEM
1. **API Dependency**: The auto-translation depends on external services (LibreTranslate/Google). If these services are down, translation defaults to the base language.
2. **Translation Accuracy**: Automated translation might occasionally miss linguistic nuances or regional idioms.
3. **Single Reporter**: Current architecture is optimized for a single reporter/admin rather than a large multi-author newsroom.

---

# CHAPTER 7: PROPOSED ENHANCEMENT
1. **Search Functionality**: Implement a full-text search across all languages.
2. **Comment Moderation**: Add an AI-based filter to automatically detect and flag spam comments.
3. **Video Integration**: Allow reporters to embed YouTube/Vimeo news clips.
4. **Push Notifications**: Notify users when new news is published in their preferred language.

---

# CHAPTER 8: CONCLUSION
The **Multilingual News Publishing Portal** successfully demonstrates how modern web technologies like the MERN stack can be combined with AI translation APIs to solve real-world communication barriers. The project meets all its core objectives of providing a fast, efficient, and accessible news platform for independent reporters.

---

# CHAPTER 9: BIBLIOGRAPHY
1. React Documentation: [react.dev](https://react.dev)
2. MDN Web Docs (Node.js/Express): [developer.mozilla.org](https://developer.mozilla.org)
3. MongoDB Manual: [mongodb.com/docs](https://www.mongodb.com/docs/)
4. i18next Framework: [i18next.com](https://www.i18next.com/)

---

# CHAPTER 10: PUBLICATION / COMPETITION CERTIFICATES
*(Placeholders for any certificates or awards received during the project duration.)*

---

# ANNEXURE - PROGRESS SHEET
*(Maintain a log of weekly progress made during the development phase.)*

---

# USER MANUAL

## 1. System Setup
1. Clone the repository.
2. Run `npm install` in both `backend` and `frontend` folders.
3. Create a `.env` file in the backend with `MONGODB_URI` and `JWT_SECRET`.
4. Run `npm run dev` to start both servers.

## 2. Using the Reporter Dashboard
### 2.1 Login
- Use your registered email and password on the login screen.
### 2.2 Creating News
- Select "Create News" from the sidebar.
- Choose your **Base Language** (this is the language you are writing in).
- Fill in the Title and Content.
- Upload an image if available.
- Click "Publish" to make it live instantly.

## 3. Browsing as a Guest
- Visit the home page.
- Use the **Coverage** filter to see Local or National news.
- Use the **Language Dropdown** in the top right corner to switch site content between English, Hindi, and Marathi.
