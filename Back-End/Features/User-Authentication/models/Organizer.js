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
  // New fields
  organizerType: {
    type: String,
    enum: ['Individual', 'Student Club', 'University', 'Company', 'NGO']
  },
  mobileNumber: {
    type: String
  },
  preferredEventTypes: [{
    type: String
  }],
  expectedParticipantsRange: {
    type: String,
    enum: ['Small (<50)', 'Medium (50-200)', 'Large (200+)']
  },
  eventFormatPreference: {
    type: String,
    enum: ['Online', 'In-Person', 'Hybrid']
  },
  backupContact: {
    type: String
  },
  termsAccepted: {
    type: Boolean,
    default: false,
    required: true
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
