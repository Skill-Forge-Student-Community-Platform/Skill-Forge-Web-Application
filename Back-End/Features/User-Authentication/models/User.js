import mongoose from 'mongoose';

// enabling timestamps for the userSchema to keep track of the creation and update time of the user
const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  Username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'organizer'],
    default: null
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role'
  },
  // New social networking fields
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sentRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  coverImg: {
    type: String,
    default: "",
  },
  likedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: [],
  }],
  link: {
    type: String,
    default: "",
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  // For Team Collaboration
  teams: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  // Add friends array if it doesn't exist
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  // XP system fields
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  level: {
    type: Number,
    default: 1
  },
  currentXP: {
    type: Number,
    default: 0
  },
  totalXP: {
    type: Number,
    default: 0
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  rank: {
    type: String,
    default: 'Novice'
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
} ,{timestamps: true});

// Method to calculate next level XP requirement
userSchema.methods.getNextLevelXP = function() {
  return Math.floor(1000 * Math.pow(1.5, this.level - 1));
};

// Method to update level based on XP
userSchema.methods.updateLevel = function() {
  const nextLevelXP = this.getNextLevelXP();
  if (this.currentXP >= nextLevelXP) {
    this.level += 1;
    this.currentXP -= nextLevelXP;

    // Update rank based on level
    if (this.level <= 10) {
      const ranks = ['Novice', 'Beginner', 'Intermediate', 'Pro Competitor',
        'Expert', 'Master', 'Grandmaster', 'Legend', 'Champion', 'Ultimate Champion'];
      this.rank = ranks[this.level - 1];
    } else {
      this.rank = `Ultimate Champion ${this.level - 10}`;
    }

    return true;
  }
  return false;
};

export const User = mongoose.model('User', userSchema);
