import ResumeSchema from "../models/Resume.js";

export const saveResume = async (req, res) => {
  try {
    const resumeData = req.body;
    const newResume = new ResumeSchema(resumeData);
    await newResume.save();
    res.status(201).json({ message: 'Resume saved successfully', data: newResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving resume', error });
  }
};



export const getResumes = async (req, res) => {
  try {
    const resumes = await ResumeSchema.find(); // Fetch all resumes from MongoDB
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes" });
  }
};

export const getResumesbyId =async (req, res) => {
  const resumeId = req.params.id;

  try {
      const resume = await ResumeSchema.findById(resumeId); // Fetch resume by ID from MongoDB
      if (!resume) {
          return res.status(404).json({ message: "Resume not found" }); // Handle case where resume is not found
      }
      res.json(resume); // Return the found resume
  } catch (error) {
      res.status(500).json({ message: "Error fetching resume" }); // Handle server errors
  }
};

export const updateResume = async (req, res) => {
  try {
    const updatedResume = await ResumeSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: "Error updating resume" });
  }
};

export const deleteResume = async (req, res) => {
  console.log("Deleting resume with ID:", req.params.id); // Add this line
  try {
    const deletedResume = await ResumeSchema.findByIdAndDelete(req.params.id);
    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error); // Log the error
    res.status(500).json({ message: "Error deleting resume" });
  }
};




