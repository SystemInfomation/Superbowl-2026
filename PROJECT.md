# Super Bowl LX (2026) Voting Application

## 🏈 Live Demo Screenshots

### Desktop View
![Desktop View](https://github.com/user-attachments/assets/78db6b4f-c760-40ad-8b51-79c21ed6de44)

### Mobile View
![Mobile View](https://github.com/user-attachments/assets/9ae460c9-6958-4ec4-b0aa-cca0823377da)

### Voting Interaction
![Voting with Error Toast](https://github.com/user-attachments/assets/58eb5014-ed62-4180-8f27-d2a5e9cf6bc7)

## 📋 Features Implemented

### ✅ Design & UI
- Dark mode base with vibrant neon glows and team-colored gradients
- Animated grid background with subtle pulsing effect
- Split-screen aesthetic (Patriots left, Seahawks right)
- Team logos from official Wikimedia sources
- Google Fonts: Bebas Neue, Orbitron, Montserrat
- Fully responsive design (desktop, tablet, mobile)

### ✅ Interactive Elements
- **Team Cards**: Hover effects with scale, neon glow, and shadow lift
- **Countdown Timer**: Live countdown to Feb 8, 2026, 6:30 PM EST
- **Progress Bars**: Animated horizontal bars showing vote percentages
- **Confetti**: Full-screen burst animation on vote submission
- **Toast Notifications**: Success, error, and info messages

### ✅ Voting Features
- One vote per user (localStorage-based)
- Real-time vote updates every 5 seconds (SWR polling)
- Automatic voting lockout at kickoff time
- Server-side IP hashing for additional deduplication
- Vote validation and error handling

### ✅ Backend API
- Node.js + Express server
- MongoDB + Mongoose for data persistence
- CORS enabled for frontend communication
- RESTful API endpoints (GET/POST /api/votes)
- Health check endpoint
- IP hashing for vote deduplication

### ✅ Security & Quality
- Next.js upgraded to v16.1.6 (all vulnerabilities fixed)
- Input validation on vote submission
- Environment variable configuration
- Proper error handling and logging
- TypeScript for type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

Visit `http://localhost:3000` to see the application!

## 📦 Project Structure

```
Superbowl-2026/
├── frontend/              # Next.js 16 (App Router)
│   ├── app/
│   │   ├── page.tsx      # Main voting page
│   │   ├── layout.tsx    # Root layout with fonts
│   │   └── globals.css   # Global styles & animations
│   └── package.json
│
├── backend/              # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   └── index.js      # Server entry point
│   └── package.json
│
├── DEPLOYMENT.md         # Deployment instructions
├── TESTING.md           # Comprehensive testing guide
├── vercel.json          # Vercel deployment config
└── netlify.toml         # Netlify deployment config
```

## 🌐 Deployment

### Frontend (Vercel - Recommended)
1. Import repository on Vercel
2. Set Root Directory: `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

### Backend (Render.com - Recommended)
1. Create new Web Service
2. Set Root Directory: `backend`
3. Add MongoDB URI and other environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

Comprehensive testing guide available in [TESTING.md](./TESTING.md).

Quick verification:
```bash
# Backend
curl http://localhost:4000/api/votes

# Frontend
npm run build  # Should complete without errors
```

## 🎨 Color Scheme

### New England Patriots
- Navy: `#002244`
- Red: `#c60c30`
- Silver: `#b0b7bc`

### Seattle Seahawks
- College Navy: `#002244`
- Action Green: `#69be28`
- Wolf Gray: `#a5acaf`

## 📱 Responsive Breakpoints

- Desktop: 1024px+ (side-by-side team cards)
- Tablet: 768px-1023px (adjusted spacing)
- Mobile: <768px (stacked team cards)

## 🔧 Technologies Used

### Frontend
- Next.js 16.1.6 (App Router)
- React 18.2.0
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Hot Toast (notifications)
- Canvas Confetti (celebrations)
- SWR (data fetching)

### Backend
- Node.js
- Express 4.18.2
- MongoDB + Mongoose 8.0.3
- CORS 2.8.5
- dotenv 16.3.1

## 📄 API Documentation

### GET /api/votes
Returns current vote counts and percentages.

**Response:**
```json
{
  "patriots": 150,
  "seahawks": 200,
  "total": 350,
  "percentages": {
    "patriots": 43,
    "seahawks": 57
  }
}
```

### POST /api/votes
Submit a new vote.

**Request:**
```json
{
  "team": "patriots"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote recorded successfully!",
  "votes": { ... }
}
```

### GET /health
Health check endpoint.

## 🎯 Performance

- Next.js build: ✅ Successful
- Lighthouse score target: 90+
- Real-time updates: Every 5 seconds
- Animation performance: 60fps

## 📝 License

MIT

## 🏆 Credits

Built with ❤️ using Next.js, Express, and MongoDB

Team logos courtesy of Wikimedia Commons:
- [Patriots Logo](https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg)
- [Seahawks Logo](https://upload.wikimedia.org/wikipedia/en/8/8e/Seattle_Seahawks_logo.svg)

---

**Go Patriots! Go Seahawks! May the best team win Super Bowl LX! 🏈**
