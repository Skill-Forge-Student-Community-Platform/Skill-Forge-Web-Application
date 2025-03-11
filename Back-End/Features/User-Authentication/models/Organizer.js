import mongoose from 'mongoose';

const organizerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationName: {
    type: String
  },
  industry: {
    type: String
  },
  position: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  expertise: [{
    type: String
  }],
  workshopsHosted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop'
  }],
  profilePicture: {
    type: String
  },
  contactEmail: {
    type: String
  },
  contactPhone: {
    type: String
  },
  website: {
    type: String
  },
  socialLinks: {
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('organizer', organizerSchema);
