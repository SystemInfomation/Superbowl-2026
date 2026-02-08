# Super Bowl LX (2026) Voting Application 🏈

A complete, production-ready voting poll application for Super Bowl LX (2026) - **New England Patriots vs. Seattle Seahawks**.

> **Game Date:** February 8, 2026, 6:30 PM EST

## 🌐 Live Application

**Frontend**: https://superbowl-2026.vercel.app/

**Backend API**: https://superbowl-2026.onrender.com/

## 📸 Screenshots

### Desktop View
![Desktop View](https://github.com/user-attachments/assets/78db6b4f-c760-40ad-8b51-79c21ed6de44)

### Mobile View
![Mobile View](https://github.com/user-attachments/assets/9ae460c9-6958-4ec4-b0aa-cca0823377da)

## 🎯 Overview

This is a modern, visually stunning monorepo application that allows users to vote for their favorite team in Super Bowl LX. The application features:

- 🎨 **Beautiful Dark Mode UI** with neon glows and team-colored gradients
- ⏱️ **Live Countdown Timer** to kickoff
- 📊 **Real-time Vote Results** with animated progress bars
- 🎉 **Confetti Animations** on vote submission
- 📱 **Fully Responsive** design (desktop, tablet, mobile)
- 🔒 **One Vote Per User** (localStorage + optional IP hashing)
- 🔄 **Auto-refreshing** vote counts every 5 seconds

## 🏗️ Monorepo Structure

```
Superbowl-2026/
├── frontend/          # Next.js 16 (App Router) application
│   ├── app/           # App Router pages and layouts
│   ├── public/        # Static assets
│   └── package.json
│
├── backend/           # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── models/    # Mongoose schemas
│   │   ├── routes/    # API routes
│   │   └── index.js   # Server entry point
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
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure your MongoDB URI and other variables in `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Configure the API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

5. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📦 Tech Stack

### Frontend
- **Next.js 16** with App Router (upgraded for security)
- **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **React Hot Toast** for toast notifications
- **Canvas Confetti** for celebration effects
- **SWR** for real-time data fetching with auto-refresh

### Backend
- **Node.js** + **Express** 4.18.2
- **MongoDB** + **Mongoose** 8.0.3
- **CORS** enabled for cross-origin requests
- **IP Hashing** for vote deduplication (optional)
- **dotenv** for environment configuration

## 🎨 Design Features

- Dark mode base with vibrant neon glows
- Animated grid background with subtle pulsing
- Split-screen aesthetic with team-colored gradients
- Official team logos from Wikimedia
- Hover effects with scale transformation and neon glow
- Smooth progress bar fill animations
- Full-screen confetti burst on vote submission
- Fully responsive (mobile: stacked cards, desktop: side-by-side)
- Google Fonts: Bebas Neue, Orbitron, Montserrat

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
