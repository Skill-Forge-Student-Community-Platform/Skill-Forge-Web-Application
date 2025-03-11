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
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
} ,{timestamps: true});


export const User = mongoose.model('User', userSchema);
