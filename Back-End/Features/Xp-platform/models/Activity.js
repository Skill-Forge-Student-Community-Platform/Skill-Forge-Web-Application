const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'challenge_completion',
      'competition_participation', 
      'competition_win',
      'badge_earned',
      'article_submission',
      'mentoring',
      'daily_login',
      'profile_update',
      'level_up',
      'other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  xpEarned: {
    type: Number,
    required: true,
    default: 0
  },
  metadata: {
    // For storing additional content based on activity type
    // For example, competition ID, badge ID, etc.
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient retrieval of user activities
activitySchema.index({ user: 1, timestamp: -1 });

// Static method to get recent activities for a user
activitySchema.statics.getRecentForUser = async function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get global activity feed
activitySchema.statics.getGlobalFeed = async function(limit = 20) {
  return this.find()
    .populate('user', 'name username avatar')
    .sort({ timestamp: -1 })
    .limit(limit);
};

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
