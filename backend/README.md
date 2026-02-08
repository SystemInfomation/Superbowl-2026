# Super Bowl 2026 Voting - Backend API

Backend API server for the Super Bowl LX (2026) voting application.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- CORS enabled

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### GET /api/votes
Get current vote counts and percentages.

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

**Request Body:**
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
  "votes": {
    "patriots": 151,
    "seahawks": 200,
    "total": 351,
    "percentages": {
      "patriots": 43,
      "seahawks": 57
    }
  }
}
```

### GET /health
Health check endpoint.

## Deployment

This backend is designed to be deployed on platforms like:
- Render.com (recommended)
- Heroku
- Railway
- Any Node.js hosting service

Make sure to set environment variables on your hosting platform.
