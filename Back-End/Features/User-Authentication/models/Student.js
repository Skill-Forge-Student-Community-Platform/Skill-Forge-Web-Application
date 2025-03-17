import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  education: {
    type: String,
  },
  school: {
    type: String,
  },
  graduationYear: {
    type: Number,
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  bio: {
    type: String,
    maxlength: 500
  },
  completedWorkshops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop'
  }],
  enrolledWorkshops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop'
  }],
  profilePicture: {
    type: String
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  // New fields
  fullName: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  studentId: {
    type: String,
  },
  fieldOfStudy: {
    type: String,
  },
  yearOfStudy: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate']
  },
  preferredNotifications: [{
    type: String,
    enum: ['Email', 'SMS', 'Push']
  }],
  competitionInterests: [{
    type: String
  }],
  preferredCompetitionTypes: [{
    type: String
  }],
  hackathonTeamPreference: {
    type: String,
    enum: ['Solo', 'Team-based', 'Open to Collaboration']
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  backupEmail: {
    type: String
  },
  privacyMode: {
    type: Boolean,
    default: false
  },
  termsAccepted: {
    type: Boolean,
    default: false,
    required: true
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('student', studentSchema);
