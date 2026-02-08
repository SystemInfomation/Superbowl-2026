# Super Bowl 2026 Voting - Frontend

Frontend application for the Super Bowl LX (2026) voting poll built with Next.js 14 (App Router).

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Hot Toast (notifications)
- Canvas Confetti (celebrations)
- SWR (data fetching)

## Features
- 🎨 Modern dark mode design with neon glows
- 🏈 Team-colored gradients (Patriots & Seahawks)
- ⏱️ Live countdown timer to kickoff
- 📊 Real-time vote results with animated progress bars
- 🎉 Confetti animations on vote submission
- 📱 Fully responsive (mobile & desktop)
- 🔒 One vote per user (localStorage)
- 🔄 Auto-refreshing vote counts every 5 seconds

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production, set to your backend API URL (e.g., https://your-backend.render.com)

## Running the Application

Development:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Deployment

This frontend can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any static hosting service**

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project on Vercel
3. Set the root directory to `/frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`
5. Deploy!

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (required)

## Design Details

### Color Scheme
- **Patriots**: Navy (#002244), Red (#c60c30), Silver (#b0b7bc)
- **Seahawks**: College Navy (#002244), Action Green (#69be28), Wolf Gray (#a5acaf)

### Typography
- **Bebas Neue** - Large headings
- **Orbitron** - Countdown timer
- **Montserrat** - Body text

### Animations
- Card hover effects with scale and glow
- Progress bar fill animations
- Confetti burst on vote
- Floating team logos
- Pulsing grid background
