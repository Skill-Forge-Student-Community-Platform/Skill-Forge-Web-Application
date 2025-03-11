import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResumePreview from "./ResumePreview";
import axios from "axios";
import { AiOutlineClose } from 'react-icons/ai';

function ResumeForm({ initialTitle = "", onSave, onCancel,userId }) {
  const { id } = useParams(); // Get resume ID from URL if editing
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeTitle, setResumeTitle] = useState(initialTitle);
  
  // Initial empty form structure
  const [formData, setFormData] = useState({
    title: initialTitle,
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    experience: [{ company: "", role: "", duration: "", description: "" }],
    education: [{ school: "", degree: "", year: "" }],
    skills: "",
    projects: [{ title: "", description: "", link: "" }],
    userId: userId,
  });

  // Fetch resume data if editing an existing one
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      
      axios.get(`http://localhost:3000/resumes/${id}`)
        .then((response) => {
          const data = response.data;
          setFormData(data);
          
          // Set the resume title from the fetched data
          if (data.title) {
            setResumeTitle(data.title);
          }
        })
        .catch((error) => {
          console.error("Error fetching resume:", error);
          setError("Failed to load resume data. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id,userId]);//see this################################################

  // Handle form field changes
  const handleChange = (e, section, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      // For array fields (experience, education, projects)
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      // For simple fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setResumeTitle(e.target.value);
    // Also update the title in the main form data
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  // Add a new entry to an array field
  const addField = (section) => {
    const newField =
      section === "experience"
        ? { company: "", role: "", duration: "", description: "" }
        : section === "education"
        ? { school: "", degree: "", year: "" }
        : { title: "", description: "", link: "" };

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newField],
    }));
  };

  // Remove an entry from an array field
  const removeField = (section, index) => {
    if (formData[section].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      }));
    } else {
      alert(`You need at least one ${section} entry.`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare complete data with title
    const completeData = { 
      ...formData, 
      userId: userId,
      title: resumeTitle || "Untitled Resume",
      lastUpdated: new Date().toISOString()
    };

    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      if (id) {
        // Update existing resume
        response = await axios.put(`http://localhost:3000/resumes/${id}`, completeData);
      } else {
        // Create new resume
        response = await axios.post("http://localhost:3000/resumes", completeData);
      }
      
      // Handle successful save
      alert(`Resume ${id ? 'updated' : 'created'} successfully! ${userId}`);
      
      // Call the onSave callback with the saved data
      if (onSave && typeof onSave === 'function') {
        onSave(response.data || completeData);
      } else {
        // If no onSave function provided, navigate back to dashboard
       navigate('/dashbord');
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      setError("Failed to save resume. Please try again.");
    } finally {
      setIsLoading(false);
    }

    
  };

  // Show loading state
  if (isLoading && id) {
    return <div className="flex justify-center items-center h-64">Loading resume data...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Form Section */}
      <div className="p-6 w-full md:w-1/2 bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Resume Title
          </label>
          <input
            id="resumeTitle"
            type="text"
            value={resumeTitle}
            onChange={handleTitleChange}
            placeholder="Enter resume title"
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>
        
        <h2 className="font-bold text-2xl mb-4">{id ? `Edit Resume` : `Create New Resume`}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              placeholder="Full Name"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              placeholder="Phone"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="Address"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            <textarea
              name="summary"
              value={formData.summary}
              placeholder="Professional Summary"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full h-24"
            />
          </div>

          {/* Work Experience */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Work Experience</h3>
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md relative">
                <button
                  type="button"
                  onClick={() => removeField("experience", index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <AiOutlineClose />
                </button>
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleChange(e, "experience", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Job Title"
                  value={exp.role}
                  onChange={(e) => handleChange(e, "experience", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                  value={exp.duration}
                  onChange={(e) => handleChange(e, "experience", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
                />
                <textarea
                  name="description"
                  placeholder="Job Description and Achievements"
                  value={exp.description}
                  onChange={(e) => handleChange(e, "experience", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full h-24"
                />
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 font-medium"
              onClick={() => addField("experience")}
            >
              + Add Experience
            </button>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Education</h3>
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md relative">
                <button
                  type="button"
                  onClick={() => removeField("education", index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  ✕
                </button>
                <input
                  type="text"
                  name="school"
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => handleChange(e, "education", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
                />
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree/Certificate"
                  value={edu.degree}
                  onChange={(e) => handleChange(e, "education", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
                />
                <input
                  type="text"
                  name="year"
                  placeholder="Graduation Year"
                  value={edu.year}
                  onChange={(e) => handleChange(e, "education", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full"
                />
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 font-medium"
              onClick={() => addField("education")}
            >
              + Add Education
            </button>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Skills</h3>
            <textarea
              name="skills"
              value={formData.skills}
              placeholder="Enter your skills (comma-separated)"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full h-24"
            />
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Projects</h3>
            {formData.projects.map((proj, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md relative">
                <button
                  type="button"
                  onClick={() => removeField("projects", index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <AiOutlineClose />
                </button>
                <input
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) => handleChange(e, "projects", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
                />
                <textarea
                  name="description"
                  placeholder="Project Description"
                  value={proj.description}
                  onChange={(e) => handleChange(e, "projects", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2 h-24"
                />
                <input
                  type="text"
                  name="link"
                  placeholder="Project Link"
                  value={proj.link}
                  onChange={(e) => handleChange(e, "projects", index)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full"
                />
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 font-medium"
              onClick={() => addField("projects")}
            >
              + Add Project
            </button>
          </div>
          
       
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              if (id) {
                navigate('/dashbord');
              } else if (onCancel) {
                onCancel(); // Call the onCancel function if provided
              }
            }}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
          >
            {id ? "Cancel " : "Cancel"}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (id ? "Update Resume" : "Save Resume")}
          </button>
        </div>


         
        </form>
      </div>

      {/* Preview Section */}
      <div className="w-full md:w-1/2">
        <div className="sticky top-4">
          <h3 className="font-semibold text-xl mb-3">Preview</h3>
          <ResumePreview formData={{...formData, title: resumeTitle}} />
        </div>
      </div>
    </div>
  );
}

export default ResumeForm;















