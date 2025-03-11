import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  userId: {
    type:String,
   // type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    required: false, // Optional field
},

  title: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  summary: { type: String },
  experience: [{
    company: { type: String },
    role: { type: String },
    duration: { type: String },
    description: { type: String },
  }],
  education: [{
    school: { type: String },
    degree: { type: String },
    year: { type: String },
  }],
  skills: { type: String },
  projects: [{
    title: { type: String },
    description: { type: String },
    link: { type: String },
  }],
});

const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;
