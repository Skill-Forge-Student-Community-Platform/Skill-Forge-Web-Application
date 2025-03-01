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
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
} ,{timestamps: true});


export const User = mongoose.model('User', userSchema);
