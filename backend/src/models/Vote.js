const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  team: {
    type: String,
    required: true,
    enum: ['patriots', 'seahawks']
  },
  votedAt: {
    type: Date,
    default: Date.now
  },
  ipHash: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Vote', voteSchema);
