# Deployment Guide

This guide will help you deploy the Multilingual News Portal to production.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

2. **Deployment Platforms:**
   - **Frontend:** Vercel, Netlify, or GitHub Pages
   - **Backend:** Railway, Render, or Heroku

## Step 1: Prepare MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs - less secure but easier)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/multilingual_news
   ```

## Step 2: Deploy Backend

### Option A: Railway (Recommended - Easy & Free)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 5000 (or leave default)
   - `JWT_SECRET`: Generate a random secret key
6. Railway will auto-detect Node.js and deploy
7. Note your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to https://render.com
2. Sign up and create a new "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Build Command:** (leave empty, auto-detected)
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random secret key
6. Deploy

## Step 3: Deploy Frontend

### Option A: Vercel (Recommended - Easy & Free)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project" → Import your repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_API_BASE_URL`: Your backend URL (e.g., `https://your-app.railway.app`)
   - `VITE_IMAGE_BASE_URL`: Your backend URL (same as above)
6. Deploy

### Option B: Netlify

1. Go to https://netlify.com
2. Sign up and create a new site
3. Connect your GitHub repository
4. Build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Add environment variables:
   - `VITE_API_BASE_URL`: Your backend URL
   - `VITE_IMAGE_BASE_URL`: Your backend URL
6. Deploy

## Step 4: Update CORS Settings

After deploying backend, update `backend/server.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

Or set `CORS_ORIGINS` environment variable in your backend platform.

## Step 5: Seed Initial Data

After deployment, run the seed script to populate dummy data:

```bash
# On your local machine or via SSH
cd backend
npm run seed-dummy
```

Or use MongoDB Atlas shell to run the seed script.

## Step 6: Test Deployment

1. Visit your frontend URL
2. Test login (default: reporter@news.com / admin123)
3. Create a news post
4. Verify Latest News and Trending News sidebars work
5. Test location-based filtering

## Troubleshooting

### Backend Issues:
- Check MongoDB Atlas connection string
- Verify environment variables are set
- Check server logs for errors
- Ensure PORT is set correctly

### Frontend Issues:
- Verify API_BASE_URL is correct
- Check browser console for CORS errors
- Ensure build completed successfully
- Check network tab for API calls

### Common Errors:
- **CORS Error:** Update backend CORS settings
- **MongoDB Connection Failed:** Check connection string and IP whitelist
- **404 on API calls:** Verify API_BASE_URL environment variable

## Production Checklist

- [ ] MongoDB Atlas cluster created and connected
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend domain
- [ ] Initial data seeded
- [ ] Tested all features
- [ ] Changed default JWT_SECRET
- [ ] Changed default reporter password

## Quick Deploy Commands

### Build Frontend Locally (for testing):
```bash
cd frontend
npm run build
npm run preview  # Test production build
```

### Test Backend Locally:
```bash
cd backend
npm start
```

