# Multilingual News Publishing Portal for Independent Reporter

A complete full-stack web application for publishing multilingual news content with support for English, Hindi, and Marathi languages. This project is built as an MCA Semester 4 Major Project.

## 📋 Project Overview

This portal allows a single authenticated reporter to publish, edit, and manage news articles in multiple languages. Guest users can browse and read published news without requiring authentication. The application supports regional categorization (Local, National, International) and dynamic language switching.

## ✨ Features

### For Reporter (Authenticated)
- **Authentication**: Secure JWT-based login system
- **Create News**: Publish news articles with **auto-translation** - write in one language, system translates to all languages
- **Edit News**: Update existing news posts with automatic re-translation
- **Delete News**: Remove news articles
- **Publish/Unpublish**: Toggle publication status
- **Image Upload**: Add images to news posts
- **Dashboard**: Overview of all posts with statistics
- **Auto-Translation**: Powered by LibreTranslate API - no manual multi-language input needed

### For Guest Users (Public)
- **Browse News**: View all published news articles
- **Filter by Coverage**: Browse Local, National, or International news
- **Language Switching**: Dynamically switch between English, Hindi, and Marathi
- **News Detail**: View full news articles with images
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18.2.0) - UI library
- **Vite** (v5.0.8) - Build tool and dev server
- **Tailwind CSS** (v3.3.6) - Utility-first CSS framework
- **React Router** (v6.20.0) - Client-side routing
- **Axios** (v1.6.2) - HTTP client
- **i18next** (v23.7.6) - Internationalization framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** (v7.6.3) - MongoDB object modeling
- **JWT** (v9.0.2) - Authentication tokens
- **bcryptjs** (v2.4.3) - Password hashing
- **Multer** (v1.4.5) - File upload handling
- **Nodemon** (v3.0.1) - Auto-restart server on file changes (dev dependency)
- **LibreTranslate API** - Free translation service for auto-translation feature

## 📁 Project Structure

```
SEM IV/
├── backend/
│   ├── models/
│   │   ├── Reporter.js          # Reporter model
│   │   └── News.js               # News model
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── news.js               # News CRUD routes
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── upload.js             # Multer configuration
│   ├── utils/
│   │   └── translator.js         # Auto-translation utility (LibreTranslate)
│   ├── scripts/
│   │   └── seedData.js           # Database seeding script
│   ├── uploads/                  # Uploaded images directory
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env                      # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation component
    │   │   ├── NewsCard.jsx      # News card component
    │   │   └── ProtectedRoute.jsx # Route protection
    │   ├── pages/
    │   │   ├── Home.jsx          # Home page
    │   │   ├── Local.jsx         # Local news page
    │   │   ├── National.jsx     # National news page
    │   │   ├── International.jsx # International news page
    │   │   ├── NewsDetail.jsx    # News detail page
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Dashboard.jsx     # Reporter dashboard
    │   │   ├── CreateNews.jsx    # Create news form
    │   │   ├── EditNews.jsx      # Edit news form
    │   │   └── ManageNews.jsx    # Manage all news
    │   ├── context/
    │   │   └── NewsContext.jsx   # News context provider
    │   ├── utils/
    │   │   └── api.js            # Axios configuration
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   ├── i18n.js               # i18next configuration
    │   └── index.css             # Global styles
    ├── package.json
    └── vite.config.js
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher) - Install and run MongoDB locally
- **npm** or **yarn** package manager

### Step 1: Clone/Download the Project

Navigate to your project directory:
```bash
cd "C:\xampp\htdocs\SEM IV"
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/multilingual_news
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Make sure MongoDB is running on your system.

5. Seed the database with sample data (optional but recommended):
```bash
npm run seed
```

This will create:
- A reporter account:
  - Email: `reporter@news.com`
  - Password: `admin123`
- 6 sample news posts (5 published, 1 draft)

6. Start the backend server:

**Production mode** (manual restart required):
```bash
npm start
```

**Development mode** (auto-restart on file changes with nodemon):
```bash
npm run dev
```

> **Note**: Use `npm run dev` during development. Nodemon will automatically restart the server whenever you save changes to backend files, making development faster and more efficient.

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Step 4: Access the Application

1. Open your browser and navigate to: `http://localhost:3000`

2. **For Guest Users**: Browse news without login
   - View all published news on the home page
   - Filter by Local, National, or International coverage
   - Switch languages using the language selector

3. **For Reporter**: Login to access dashboard
   - Go to Login page
   - Use credentials:
     - Email: `reporter@news.com`
     - Password: `admin123`
   - Access dashboard to create, edit, and manage news

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register reporter (only one allowed)
- `POST /api/auth/login` - Login reporter
- `GET /api/auth/me` - Get current reporter info (protected)

### News (Public)
- `GET /api/news` - Get all published news
  - Query params: `coverage`, `category`, `language`
- `GET /api/news/:id` - Get single news post

### News (Protected - Reporter Only)
- `GET /api/news/admin/all` - Get all news (including drafts)
- `POST /api/news` - Create new news post with auto-translation
  - Body: `{ title, content, baseLanguage, coverage, category, published, image? }`
  - Automatically translates to all languages
- `PUT /api/news/:id` - Update news post with auto-translation
  - Body: `{ title?, content?, baseLanguage?, coverage?, category?, published?, image? }`
  - Re-translates if title/content/baseLanguage changes
- `DELETE /api/news/:id` - Delete news post
- `PATCH /api/news/:id/publish` - Toggle publish status

## 🗄️ Database Schema

### Reporter Model
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### News Model
```javascript
{
  baseLanguage: String (required, enum: ["en", "hi", "mr"]), // Language reporter wrote in
  title: {
    en: String (required),
    hi: String, // Auto-translated
    mr: String  // Auto-translated
  },
  content: {
    en: String (required),
    hi: String, // Auto-translated
    mr: String  // Auto-translated
  },
  coverage: "local" | "national" | "international",
  category: String,
  image: String (URL or null),
  published: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Language Support & Auto-Translation

The application supports three languages:
- **English (en)** - Default language
- **Hindi (hi)** - हिंदी
- **Marathi (mr)** - मराठी

### 🤖 Auto-Translation Feature

**For MCA Viva**: This is a key feature demonstrating API integration and automation.

- **Reporter Experience**: Reporter writes news in **ONE language only** (selected via dropdown)
- **Automatic Translation**: Backend automatically translates title and content to all other languages using LibreTranslate API
- **No Manual Input**: No need to manually enter translations for each language
- **Fallback Mechanism**: If translation fails, system falls back to base language content
- **Re-translation on Edit**: When editing, changing content triggers automatic re-translation

**How it works:**
1. Reporter selects base language (en/hi/mr) and writes news
2. On save, backend calls LibreTranslate API to translate to other languages
3. All translations are stored in MongoDB
4. Frontend displays content based on user's selected language

**Translation API**: Uses multiple translation providers with automatic fallback
- **Primary**: Google Translate (via @vitalets/google-translate-api) - Free, no API key, most reliable
- **Fallback 1**: LibreTranslate - Free, open-source translation service
- **Fallback 2**: MyMemory Translation API - Free tier available
- Automatically tries providers in order if one fails
- Supports English, Hindi, and Marathi with high accuracy
- No API keys required for basic usage

### Language Fallback Mechanism
- If content in selected language is missing, it falls back to English
- If English is also missing, it displays any available language content

## 🔒 Authentication & Security

- JWT tokens expire after 7 days
- Passwords are hashed using bcryptjs
- Protected routes require valid JWT token
- Only one reporter account is allowed in the system

## 📸 Image Upload

- Images are uploaded using Multer
- Supported formats: JPEG, JPG, PNG, GIF, WEBP
- Maximum file size: 5MB
- Images are stored in `backend/uploads/` directory
- Images are served statically at `/uploads/` endpoint

## 🎨 UI Features

- **Responsive Design**: Works on all screen sizes
- **Modern UI**: Clean and professional design using Tailwind CSS
- **Language Selector**: Easy language switching in navbar
- **News Cards**: Attractive card-based layout for news listing
- **Image Support**: News posts can include images
- **Status Indicators**: Visual indicators for published/draft status

## 🧪 Testing the Application

1. **Public Access**:
   - Visit home page - should see published news
   - Click on Local/National/International - should filter news
   - Click on a news card - should show full article
   - Change language - content should update

2. **Reporter Access**:
   - Login with reporter credentials
   - View dashboard - should show statistics
   - Create new news post - fill form and submit
   - Edit existing post - modify and save
   - Toggle publish status - publish/unpublish
   - Delete post - remove from database

## 📚 Key Concepts for MCA Evaluation

1. **Full-Stack Architecture**: Separation of frontend and backend
2. **RESTful API**: Standard HTTP methods and status codes
3. **Authentication**: JWT-based secure authentication
4. **Database Design**: MongoDB schema with multilingual support
5. **State Management**: React Context API for global state
6. **Internationalization**: Multi-language support with fallback
7. **Auto-Translation**: API integration with LibreTranslate for automatic content translation
8. **File Upload**: Multer for handling image uploads
9. **Protected Routes**: Route protection based on authentication
10. **Responsive Design**: Mobile-first approach with Tailwind CSS
11. **Error Handling**: Comprehensive error handling in both frontend and backend
12. **Development Tools**: Nodemon for automatic server restart during development

## 🔧 Development Tools

### Nodemon (Auto-Restart)

**For MCA Viva**: Nodemon is a development tool that automatically restarts the Node.js server when file changes are detected.

**Usage:**
```bash
npm run dev  # Uses nodemon for auto-restart
npm start    # Standard node execution (production)
```

**Benefits:**
- Faster development workflow
- No manual server restart needed
- Automatically detects changes in `.js` files
- Only runs in development mode (devDependency)

**Configuration**: Already configured in `package.json` scripts section.

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running
- **Port Already in Use**: Change PORT in `.env` file
- **JWT Secret Missing**: Add JWT_SECRET to `.env` file
- **Translation API Error**: LibreTranslate API may be temporarily unavailable. System falls back to base language.
- **Nodemon Not Restarting**: Ensure you're using `npm run dev` (not `npm start`)

### Frontend Issues
- **API Connection Error**: Ensure backend is running on port 5000
- **Images Not Loading**: Check image path and CORS settings
- **Language Not Changing**: Clear browser cache and localStorage
- **Translation Not Working**: Check browser console for API errors. Backend uses LibreTranslate public API which may have rate limits.

## 📄 License

This project is created for educational purposes as part of MCA Semester 4 Major Project.

## 👨‍💻 Developer Notes

- Code includes comments for better understanding
- Follows best practices for React and Node.js
- Clean code structure for easy maintenance
- Ready for production deployment with minor modifications

## 🎯 Future Enhancements

- Search functionality
- Category filtering
- Pagination for news listing
- Rich text editor for content
- Image optimization
- Cloud storage integration (Cloudinary)
- User comments and interactions
- Analytics dashboard

---

**Built with ❤️ for MCA Semester 4 Major Project**

# News-Portal
