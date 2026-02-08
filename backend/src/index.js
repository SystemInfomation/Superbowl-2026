require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const votesRouter = require('./routes/votes');
const gameRouter = require('./routes/game');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['https://superbowl-2026.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: true
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://superbowl-2026.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});
app.use(express.json());

// Trust proxy to get correct IP addresses (important for Render, Heroku, etc.)
app.set('trust proxy', true);

// MongoDB Connection
const connectDB = async () => {
  try {
    // Force use of hardcoded MongoDB URI regardless of environment
    const mongoURI = 'mongodb+srv://blakeflyz1_db_user:REkE0JzAuMQUWZNU@cluster0.fh6dmbp.mongodb.net/?appName=Cluster0';
    
    // Set mongoose options for better connection handling
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      retryWrites: true,
      writeConcern: { w: 'majority' }
    });
    
    console.log('✅ MongoDB connected successfully to:', mongoURI.replace(/:([^:@]+)@/, ':***@'));
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Attempted URI:', mongoURI.replace(/:([^:@]+)@/, ':***@'));
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
app.use('/api', votesRouter);
app.use('/api', gameRouter);

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
      game: {
        get: '/api/game - Get real-time game data and scores'
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
