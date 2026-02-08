# Super Bowl LX (2026) Voting Application 🏈

A complete, production-ready voting poll application for Super Bowl LX (2026) - **New England Patriots vs. Seattle Seahawks**.

> **Game Date:** February 8, 2026, 6:30 PM EST

## 🎯 Overview

This is a modern, visually stunning monorepo application that allows users to vote for their favorite team in Super Bowl LX. The application features:

- 🎨 **Beautiful Dark Mode UI** with neon glows and team-colored gradients
- ⏱️ **Live Countdown Timer** to kickoff
- 📊 **Real-time Vote Results** with animated progress bars
- 🎉 **Confetti Animations** on vote submission
- 📱 **Fully Responsive** design
- 🔒 **One Vote Per User** (localStorage + optional IP hashing)

## 🏗️ Monorepo Structure

```
Superbowl-2026/
├── frontend/          # Next.js 14 (App Router) application
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
└── README.md          # This file
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
- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hot Toast** for notifications
- **Canvas Confetti** for celebrations
- **SWR** for real-time data fetching

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **CORS** enabled
- **IP Hashing** for vote deduplication

## 🎨 Design Features

- Dark mode base with vibrant neon glows
- Animated grid background with subtle parallax
- Split-screen aesthetic with team-colored gradients
- Team logos from official sources
- Hover effects with scale and neon glow
- Smooth progress bar animations
- Confetti burst on vote submission
- Fully responsive (mobile & desktop)

## 🌐 Deployment

### Backend (Recommended: Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `/backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (MONGODB_URI, PORT, etc.)
7. Deploy!

### Frontend (Recommended: Vercel)

1. Import project on Vercel
2. Set root directory to `/frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`
4. Deploy!

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
