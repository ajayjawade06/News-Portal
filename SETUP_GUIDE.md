# Quick Setup Guide

## Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] npm or yarn installed

## Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/multilingual_news
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Seed database (optional):
```bash
npm run seed
```

Start server:
```bash
npm start
# OR for development with auto-reload:
npm run dev
```

✅ Backend should be running on http://localhost:5000

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend should be running on http://localhost:3000

### 3. Access Application

Open browser: http://localhost:3000

**Default Reporter Credentials** (after seeding):
- Email: `reporter@news.com`
- Password: `admin123`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check MONGODB_URI in `.env` file
- Default MongoDB URI: `mongodb://localhost:27017/multilingual_news`

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### Images Not Loading
- Ensure backend is running
- Check CORS settings
- Verify image path in browser console

### Module Not Found Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Project Structure

```
SEM IV/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite App
└── README.md         # Full documentation
```

## Next Steps

1. Read full README.md for detailed documentation
2. Explore the codebase
3. Customize as needed
4. Deploy when ready

Happy Coding! 🚀

