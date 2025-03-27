import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import ResumeForm from "./ResumeForm";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getApiBaseUrl } from "../../utils/environment";

function Dashboard({userId}) {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [editingResumeIndex, setEditingResumeIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch resumes from the API
  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${getApiBaseUrl()}/resumes`);
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch resumes when component mounts or when returning to dashboard
  useEffect(() => {
    fetchResumes();
  }, [location.pathname]); // This will refetch data when navigating back to dashboard

  const handleCreate = () => {
    if (resumeTitle.trim() !== "") {
      setShowForm(true);
      setIsOpen(false);
    } else {
      alert("Please enter a resume title.");
    }
  };

  const handleSaveResume = async (resumeData) => {
    // After saving resume, refresh the resume list
    await fetchResumes();

    if (editingResumeIndex !== null) {
      setEditingResumeIndex(null);
    }

    setShowForm(false);
    navigate('/'); // Return to dashboard after saving
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await axios.delete(`${getApiBaseUrl()}/resumes/${resumeId}`);
      // Directly update the state to show changes immediately
      setResumes(prevResumes => prevResumes.filter(resume => resume._id !== resumeId));
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  if (showForm) {
    return (
      <ResumeForm
        initialTitle={resumeTitle}
        onSave={handleSaveResume}
        onCancel={() => {
          setShowForm(false);
          setEditingResumeIndex(null);
          setResumeTitle("");
        }}
        resumeData={editingResumeIndex !== null ? resumes[editingResumeIndex] : null}
        userId={userId}
      />
    );
  }



  // Filter resumes to include only those that match the userId
  const userResumes = resumes.filter(event => event.userId === userId);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="font-bold text-3xl text-gray-800 mb-2">My Resumes</h2>
          <p className="text-gray-600">Create and manage your professional resumes for your next career opportunity.</p>

        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {/* Plus Button to create new resume - First position */}
            <div
              className="group relative p-6 bg-white border-2 border-dashed border-blue-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors duration-300">
                <FaPlus className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-medium text-lg text-gray-800 mb-1">Create New Resume</h3>
              <p className="text-gray-500 text-sm text-center">Start building your professional profile</p>
            </div>



            {/* Existing Resumes */}
            {userResumes.map((resume) => (
              <div
                key={resume._id}
                className="group relative bg-white border border-gray-200 rounded-xl h-64 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Card Body */}
                <div
                  className="p-6 h-full flex flex-col justify-between cursor-pointer"
                  onClick={() => navigate(`/resume/${resume._id}`)}
                >
                  <div>
                    <h3 className="font-semibold text-xl text-gray-800 mb-2 truncate">{resume.title || "Untitled Resume"}</h3>
                    {resume.fullName && <p className="text-gray-700 truncate">{resume.fullName}</p>}
                    {resume.email && <p className="text-gray-500 text-sm truncate">{resume.email}</p>}

                    {/* Last edited info - placeholder, you could add actual timestamp */}
                    <p className="text-xs text-gray-400 mt-3">Last edited: {new Date().toLocaleDateString()}</p>
                  </div>

                  <div className="text-blue-600 text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to edit
                  </div>
                </div>

                {/* Actions Overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this resume?")) {
                        handleDeleteResume(resume._id);
                      }
                    }}
                    aria-label="Delete resume"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Resume Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            <div className="bg-white text-black p-6 rounded-xl shadow-xl w-96 max-w-full mx-4 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Resume</h3>
              <p className="text-gray-600 mb-4">Give your resume a title that reflects your career goals.</p>

              <div className="mb-6">
                <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">Resume Title</label>
                <input
                  id="resumeTitle"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  type="text"
                  placeholder="e.g., Full Stack Developer Resume"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;