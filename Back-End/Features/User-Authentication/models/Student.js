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
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('student', studentSchema);
