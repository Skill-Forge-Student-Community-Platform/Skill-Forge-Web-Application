const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Participation', 'Skill-Based', 'Achievement', 'Community', 'Special']
  },
  icon: {
    type: String,
    required: true
  },
  unlockRequirement: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  },
  requiredLevel: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to check if a user meets the badge requirements
badgeSchema.methods.checkRequirements = async function(user) {
  // This is a placeholder method - implement actual requirement checking logic
  if (user.level >= this.requiredLevel) {
    return true;
  }
  return false;
};

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge; 