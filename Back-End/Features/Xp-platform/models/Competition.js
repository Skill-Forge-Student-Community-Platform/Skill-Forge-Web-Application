const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  maxParticipants: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  winners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rank: Number,
    reward: Number
  }],
  tags: [{
    type: String
  }],
  requirements: {
    minLevel: {
      type: Number,
      default: 1
    },
    badges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    }]
  }
}, {
  timestamps: true
});

// Virtual for checking if competition is full
competitionSchema.virtual('isFull').get(function() {
  return this.participants.length >= this.maxParticipants;
});

// Virtual for checking if competition is ongoing
competitionSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

// Method to check if a user can join
competitionSchema.methods.canUserJoin = async function(user) {
  if (this.isFull) return false;
  if (this.status !== 'upcoming' && this.status !== 'active') return false;
  if (user.level < this.requirements.minLevel) return false;
  
  // Check if user has required badges
  if (this.requirements.badges.length > 0) {
    const userBadges = user.badges.map(b => b.toString());
    const requiredBadges = this.requirements.badges.map(b => b.toString());
    const hasAllBadges = requiredBadges.every(badge => userBadges.includes(badge));
    if (!hasAllBadges) return false;
  }
  
  return true;
};

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition; 