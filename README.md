# Super Bowl LX (2026) Live Dashboard 🏈

A **production-ready, visually stunning live dashboard** for Super Bowl LX (2026) - **New England Patriots vs. Seattle Seahawks** with real-time ESPN API integration.

> **Game Date:** February 8, 2026, 6:30 PM EST at Levi's Stadium

## 🌐 Live Application

**Frontend**: https://superbowl-2026.vercel.app/

**Backend API**: https://superbowl-2026.onrender.com/

## 🎯 Overview

This is a modern, visually stunning live game tracking dashboard that displays real-time Super Bowl LX data directly from ESPN's API. The application features:

- 🔴 **100% Live ESPN Data** - NO mock data, all scores/stats from ESPN API (Event ID: 401772988)
- ⏱️ **Real-Time Updates** - Auto-refreshes every 10 seconds with TanStack Query
- 📊 **Comprehensive Stats** - Live scores, play-by-play, win probability, team/player stats
- 🎨 **Beautiful Dark Mode UI** with neon glows and team-colored gradients
- 🎉 **Confetti Animations** on touchdowns and final score
- 📱 **Fully Responsive** design (desktop, tablet, mobile)
- 🎭 **Game State Overlays** for pre-game, halftime, and final
- ⚡ **Smooth Animations** with Framer Motion throughout

## 📸 Screenshots

### Loading State
![Loading Dashboard](https://github.com/user-attachments/assets/cfa0f47b-d28d-4760-9cf6-e1816856a75d)

## 🏗️ Monorepo Structure

```
Superbowl-2026/
├── frontend/          # Next.js 16 (App Router) Live Dashboard
│   ├── app/           # App Router pages and layouts
│   │   ├── page.tsx   # Main live dashboard
│   │   ├── layout.tsx # Root layout with providers
│   │   └── globals.css # Global styles and animations
│   ├── components/    # React components
│   │   ├── ScoreboardHeader.tsx
│   │   ├── CountdownOrClock.tsx
│   │   ├── LiveScoreBox.tsx
│   │   ├── WinProbabilityGauge.tsx
│   │   ├── WinProbabilityChart.tsx
│   │   ├── PlayByPlayFeed.tsx
│   │   ├── ScoringSummary.tsx
│   │   ├── BoxScoreTables.tsx
│   │   ├── PlayerLeaders.tsx
│   │   ├── GameStateOverlay.tsx
│   │   ├── TabsNavigation.tsx
│   │   └── Providers.tsx
│   ├── lib/           # Utilities and types
│   │   ├── espn-api.ts   # ESPN API client
│   │   └── types.ts      # TypeScript definitions
│   ├── public/        # Static assets
│   └── package.json
│
├── backend/           # Node.js + Express + ESPN API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── game.js    # ESPN API integration
│   │   │   └── votes.js   # Legacy voting endpoint
│   │   └── index.js       # Server entry point
│   └── package.json
│
├── README.md          # This file
├── DEPLOYMENT.md      # Deployment guide
├── TESTING.md         # Testing guide
└── PROJECT.md         # Detailed project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend deployed at https://superbowl-2026.onrender.com/

### Frontend Setup (Local Development)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional - uses production backend by default):
```bash
cp .env.example .env.local
```

4. Configure the API URL in `.env.local` (optional):
```env
NEXT_PUBLIC_API_URL=https://superbowl-2026.onrender.com
```

5. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Backend Setup (Already Deployed)

The backend is already deployed and configured at https://superbowl-2026.onrender.com/

**Backend Endpoints:**
- `GET /api/game` - Get current live game data from ESPN
- `GET /api/game/test` - Test ESPN API integration
- `GET /health` - Health check endpoint

## 📦 Tech Stack

### Frontend
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **TanStack Query v5** for data fetching and caching (10-second polling)
- **Framer Motion** for smooth animations
- **React Hot Toast** for toast notifications
- **Canvas Confetti** for celebration effects
- **Recharts** for data visualization

### Backend
- **Node.js** + **Express** 4.18.2
- **ESPN API Integration** (Event ID: 401772988)
- **CORS** enabled for cross-origin requests
- **Real-time data parsing** from ESPN Summary and Play-by-Play endpoints

## 🎨 Design Features

- Dark mode base with vibrant neon glows
- Animated grid background with subtle pulsing
- Split-screen aesthetic with team-colored gradients (Patriots red/navy, Seahawks green/navy)
- Team logos from ESPN CDN (high-resolution)
- Hover effects with scale transformation and neon glow
- Smooth progress bar fill animations
- Full-screen confetti burst on final score
- Team-colored loading spinner
- Fully responsive (mobile: stacked cards, desktop: side-by-side)
- Google Fonts: Bebas Neue, Orbitron, Montserrat
- Custom scrollbars with team colors

## 🔴 Live Data Integration

**All data from ESPN API - NO MOCK DATA:**

- **Event ID**: `401772988`
- **Summary Endpoint**: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=401772988`
- **Patriots Roster** (Team ID 17): `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/17`
- **Seahawks Roster** (Team ID 26): `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/26`
- **Play-by-Play Endpoint**: ESPN CDN
- **Polling Interval**: 10 seconds (TanStack Query)

**Data Points:**
  - Live scores and game clock
  - Quarter and game status
  - Possession indicator (with 🏈 ball emoji)
  - Down and distance
  - Field position
  - Timeout counts
  - Win probability
  - Play-by-play feed
  - Scoring plays
  - Team statistics
  - **Full player rosters** (all positions, headshots, jerseys)
  - **Active players** (those with stats in current game)
  - Drive information

**Player Data Integration:**
  - Complete rosters from ESPN team endpoints
  - Player headshots, names, positions, jersey numbers
  - Live game statistics merged with roster data
  - Active player highlighting
  - Visual field view with players arranged by team
  - Possession indicator showing which team has the ball

## 🌐 Deployment

### Frontend (Recommended: Vercel)

1. Import project on Vercel
2. **Important for Monorepo**: Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`
4. Deploy!

**Note**: The included `vercel.json` file configures automatic routing for monorepo deployments.

### Backend (Recommended: Render.com)

1. Create a new Web Service on Render
2. Set root directory to `backend`
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 4000 (or leave empty)
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your deployed frontend URL
4. Deploy!

📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Testing

Comprehensive testing guide available in [TESTING.md](./TESTING.md).

Quick checks:
```bash
# Build frontend
cd frontend && npm run build

# Test backend API
curl http://localhost:4000/api/votes
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide with live URLs
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step deployment guide
- **[TESTING.md](./TESTING.md)** - Comprehensive testing procedures
- **[PROJECT.md](./PROJECT.md)** - Detailed project documentation with API specs
- **[PRODUCTION.md](./PRODUCTION.md)** - Production configuration and monitoring

## 🚀 Quick Start

### Live Application
Visit **https://superbowl-2026.vercel.app/** to start voting!

### Local Development
See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

## 📝 API Endpoints

### GET /api/votes
Get current vote counts and percentages.

### POST /api/votes
Submit a new vote.
```json
{
  "team": "patriots" | "seahawks"
}
```

### GET /health
Health check endpoint.

## 🔒 Voting Rules

- One vote per user (enforced client-side via localStorage)
- Optional server-side IP hashing for additional deduplication
- Voting automatically closes at kickoff time (Feb 8, 2026, 6:30 PM EST)
- Results update in real-time every 5 seconds

## 🎯 Features Checklist

- ✅ Monorepo structure with separate frontend/backend
- ✅ Next.js 14 with App Router
- ✅ MongoDB integration with Mongoose
- ✅ Dark mode with neon glows
- ✅ Team-colored gradients and animations
- ✅ Live countdown timer
- ✅ Real-time vote results
- ✅ Confetti animations
- ✅ Responsive design
- ✅ Toast notifications
- ✅ One vote per user
- ✅ Voting lockout at kickoff

## 📄 License

MIT

## 🏈 Go Team!

Choose wisely - Patriots or Seahawks? Cast your vote and watch the results come in live!
