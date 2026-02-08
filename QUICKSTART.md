# 🚀 Quick Start Guide - Super Bowl LX (2026) Voting App

## Live Application

### 🌐 Access the App
**Frontend**: https://superbowl-2026.vercel.app/

**Backend API**: https://superbowl-2026.onrender.com/

## ⚡ Quick Test

### 1. Test Backend API
```bash
# Health check
curl https://superbowl-2026.onrender.com/health

# Get current votes
curl https://superbowl-2026.onrender.com/api/votes

# Submit a test vote
curl -X POST https://superbowl-2026.onrender.com/api/votes \
  -H "Content-Type: application/json" \
  -d '{"team":"patriots"}'
```

### 2. Test Frontend
1. Open https://superbowl-2026.vercel.app/ in your browser
2. Watch the countdown timer
3. Click on a team card to vote
4. See confetti animation and success message
5. Watch vote counts update in real-time

## 🎮 How to Use

### For Users
1. Visit https://superbowl-2026.vercel.app/
2. Choose your favorite team (Patriots or Seahawks)
3. Click on the team card to vote
4. Enjoy the confetti celebration! 🎉
5. Watch the live results update
6. Share with friends!

**Note**: You can only vote once (tracked via browser localStorage)

### For Developers

#### Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with backend URL
npm run dev
```

Visit http://localhost:3000

#### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick summary:
- **Frontend**: Deploy to Vercel with root directory = `frontend`
- **Backend**: Deploy to Render with root directory = `backend`
- **Database**: MongoDB Atlas (connection string in environment variables)

## 📋 Features

✅ **Countdown Timer** - Live countdown to Super Bowl kickoff (Feb 8, 2026, 6:30 PM EST)

✅ **Team Voting** - Click on Patriots or Seahawks to vote

✅ **Real-time Results** - Vote counts update every 5 seconds

✅ **Confetti Animation** - Celebration when you vote

✅ **One Vote Per User** - Prevents multiple votes from same browser

✅ **Responsive Design** - Works on desktop, tablet, and mobile

✅ **Dark Mode** - Beautiful dark theme with neon glows

✅ **Team Colors** - Patriots (red/navy) and Seahawks (green/navy)

## 🎨 Design Highlights

- Animated grid background
- Split-screen gradients (Patriots left, Seahawks right)
- Hover effects with scale and glow
- Smooth progress bar animations
- Official team logos
- Google Fonts: Bebas Neue, Orbitron, Montserrat

## 🔧 Tech Stack

**Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS, Framer Motion

**Backend**: Node.js, Express, MongoDB, Mongoose

**Deployment**: Vercel (frontend) + Render (backend) + MongoDB Atlas

## 📚 Documentation

- **[README.md](./README.md)** - Main documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[TESTING.md](./TESTING.md)** - Testing procedures
- **[PROJECT.md](./PROJECT.md)** - Detailed project info
- **[PRODUCTION.md](./PRODUCTION.md)** - Production configuration

## 🐛 Troubleshooting

### Backend is slow to respond
- Render free tier spins down after inactivity
- First request may take 30-60 seconds
- Subsequent requests will be fast

### Can't vote
- Check if you've already voted (localStorage key: `sb2026-voted`)
- Verify countdown hasn't reached zero (voting closes at kickoff)
- Check browser console for errors

### Vote counts not updating
- Wait 5 seconds for auto-refresh (SWR polling)
- Refresh the page manually
- Check if backend is running

## 🎯 What's Next?

After Super Bowl LX (Feb 8, 2026):
- Voting automatically locks at 6:30 PM EST
- Final results remain visible
- "VOTING LOCKED" banner appears
- Confetti celebration triggers

## 🏈 Go Team!

Choose your champion:
- **New England Patriots** 🏈
- **Seattle Seahawks** 🦅

May the best team win Super Bowl LX!

---

Built with ❤️ by SystemInfomation
