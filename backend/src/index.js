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

// System status endpoint - Comprehensive health check
app.get('/api/status', async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Test MongoDB by doing a simple query
    let dbTest = 'unknown';
    try {
      await mongoose.connection.db.admin().ping();
      dbTest = 'responsive';
    } catch (err) {
      dbTest = 'unresponsive';
    }

    const Vote = require('./models/Vote');
    const voteCount = await Vote.countDocuments();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      server: {
        port: PORT,
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB'
        }
      },
      database: {
        status: mongoStatus,
        test: dbTest,
        totalVotes: voteCount
      },
      endpoints: {
        health: '/health',
        status: '/api/status',
        votes: '/api/votes',
        voteStats: '/api/votes/stats',
        game: '/api/game',
        gameTest: '/api/game/test'
      }
    });
  } catch (error) {
    console.error('Error in status endpoint:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Super Bowl LX (2026) Voting API',
    endpoints: {
      system: {
        health: '/health - Quick health check',
        status: '/api/status - Comprehensive system status'
      },
      votes: {
        get: '/api/votes - Get current vote counts',
        post: '/api/votes - Submit a vote (body: { team: "patriots" | "seahawks" })',
        stats: '/api/votes/stats - Get detailed voting statistics',
        reset: '/api/votes/reset - Reset all votes (DELETE)'
      },
      game: {
        get: '/api/game - Get real-time game data and scores',
        test: '/api/game/test - Test game data structure'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
