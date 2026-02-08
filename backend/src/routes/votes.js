const express = require('express');
const Vote = require('../models/Vote');
const crypto = require('crypto');

const router = express.Router();

// Helper function to hash IP addresses
const hashIP = (ip) => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};

// GET /api/votes - Get current vote counts
router.get('/votes', async (req, res) => {
  try {
    const patriotsCount = await Vote.countDocuments({ team: 'patriots' });
    const seahawksCount = await Vote.countDocuments({ team: 'seahawks' });
    const totalVotes = patriotsCount + seahawksCount;

    res.json({
      patriots: patriotsCount,
      seahawks: seahawksCount,
      total: totalVotes,
      percentages: {
        patriots: totalVotes > 0 ? Math.round((patriotsCount / totalVotes) * 100) : 0,
        seahawks: totalVotes > 0 ? Math.round((seahawksCount / totalVotes) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// POST /api/votes - Submit a new vote
router.post('/votes', async (req, res) => {
  try {
    const { team } = req.body;

    // Validate team
    if (!team || !['patriots', 'seahawks'].includes(team)) {
      return res.status(400).json({ error: 'Invalid team. Must be "patriots" or "seahawks"' });
    }

    // Check if voting is still open (before Feb 8, 2026, 6:30 PM EST)
    const kickoffDate = new Date('2026-02-08T18:30:00-05:00');
    const now = new Date();
    
    if (now >= kickoffDate) {
      return res.status(403).json({ error: 'Voting is closed. The game has started!' });
    }

    // Get IP address and hash it
    const ip = req.ip || req.connection.remoteAddress;
    const ipHash = hashIP(ip);

    // Optional: Check if this IP has already voted (server-side deduplication)
    // const existingVote = await Vote.findOne({ ipHash });
    // if (existingVote) {
    //   return res.status(409).json({ error: 'You have already voted from this IP address' });
    // }

    // Create and save the vote
    const vote = new Vote({
      team,
      ipHash
    });

    await vote.save();

    // Get updated counts
    const patriotsCount = await Vote.countDocuments({ team: 'patriots' });
    const seahawksCount = await Vote.countDocuments({ team: 'seahawks' });
    const totalVotes = patriotsCount + seahawksCount;

    res.status(201).json({
      success: true,
      message: 'Vote recorded successfully!',
      votes: {
        patriots: patriotsCount,
        seahawks: seahawksCount,
        total: totalVotes,
        percentages: {
          patriots: totalVotes > 0 ? Math.round((patriotsCount / totalVotes) * 100) : 0,
          seahawks: totalVotes > 0 ? Math.round((seahawksCount / totalVotes) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

module.exports = router;
