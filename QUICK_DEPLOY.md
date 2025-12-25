# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Step 1: MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database password
7. Add database name: `multilingual_news`
8. Final string: `mongodb+srv://username:password@cluster.mongodb.net/multilingual_news`
9. Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)

### Step 2: Deploy Backend to Railway (10 minutes)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js
6. Click on your service → "Variables" tab
7. Add these environment variables:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/multilingual_news
   PORT = 5000
   JWT_SECRET = your-random-secret-key-here
   ```
8. Railway will auto-deploy
9. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variables:
   ```
   VITE_API_BASE_URL = https://your-app.railway.app
   VITE_IMAGE_BASE_URL = https://your-app.railway.app
   ```
7. Click "Deploy"

### Step 4: Seed Dummy Data

After backend is deployed, seed the database:

**Option A: Via Railway Console**
1. Go to Railway dashboard
2. Click on your backend service
3. Open "Deployments" → Click on latest deployment
4. Open "Logs" tab
5. Use Railway CLI or connect via SSH

**Option B: Local Machine**
1. Update your local `.env` with production MongoDB URI
2. Run: `cd backend && npm run seed-dummy`
3. This will populate 13 dummy news articles

### Step 5: Update CORS (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
};
```

Or set `CORS_ORIGINS` environment variable in Railway:
```
CORS_ORIGINS = https://your-frontend.vercel.app,http://localhost:3000
```

## ✅ Test Your Deployment

1. Visit your frontend URL
2. Test login: `reporter@news.com` / `admin123`
3. Create a news post
4. Check Latest News sidebar
5. Check Trending News sidebar
6. Test location filtering

## 🎉 Done!

Your app is now live! Share the frontend URL with users.

---

## Alternative: Deploy Both on Same Platform

### Render.com (All-in-One)

**Backend:**
1. Create "Web Service" on Render
2. Connect GitHub repo
3. Root Directory: `backend`
4. Build: `npm install`
5. Start: `npm start`
6. Add environment variables

**Frontend:**
1. Create "Static Site" on Render
2. Connect GitHub repo
3. Root Directory: `frontend`
4. Build: `npm run build`
5. Publish: `frontend/dist`

---

## Troubleshooting

**CORS Error?**
- Add frontend URL to backend CORS settings
- Check environment variables

**API 404?**
- Verify `VITE_API_BASE_URL` is correct
- Check backend is running

**MongoDB Error?**
- Verify connection string
- Check IP whitelist (0.0.0.0/0 for all)
- Verify database name

**Build Failed?**
- Check Node.js version (18+)
- Verify all dependencies installed
- Check build logs

