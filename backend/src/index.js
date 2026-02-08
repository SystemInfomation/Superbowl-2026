require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const votesRouter = require('./routes/votes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Trust proxy to get correct IP addresses (important for Render, Heroku, etc.)
app.set('trust proxy', true);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/superbowl2026');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api', votesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Super Bowl LX (2026) Voting API',
    endpoints: {
      votes: {
        get: '/api/votes - Get current vote counts',
        post: '/api/votes - Submit a vote (body: { team: "patriots" | "seahawks" })'
      },
      health: '/health - Health check'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
