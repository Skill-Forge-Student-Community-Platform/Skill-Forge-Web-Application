import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectsSection.css";
import userAPI from "../../../services/userAPI";

const ViewAllProjects = ({ projects = [], userId, isOwnProfile = false }) => {
  const navigate = useNavigate();
  const [loadedProjects, setLoadedProjects] = useState(projects);
  const [isLoading, setIsLoading] = useState(projects.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If projects are already provided, use them
    if (projects.length > 0) {
      setLoadedProjects(projects);
      return;
    }

    // Otherwise fetch from API
    const fetchUserProjects = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getUserProjects(userId);
        setLoadedProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching user projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProjects();
  }, [userId, projects]);

  // Navigate back to the profile page
  const handleBackToProfile = () => {
    const path = isOwnProfile ? `/profile` : `/student/${userId}`;
    navigate(path);
  };

  // Handle adding a new project (navigate to add project page)
  const handleAddProject = () => {
    navigate("/add-project");
  };

  if (isLoading) {
    return (
      <div className="projects-container">
        <div className="section-header">
          <h2>{isOwnProfile ? "My Projects" : "User Projects"}</h2>
          <button className="back-button" onClick={handleBackToProfile}>
            Back to Profile
          </button>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <div className="section-header">
          <h2>{isOwnProfile ? "My Projects" : "User Projects"}</h2>
          <button className="back-button" onClick={handleBackToProfile}>
            Back to Profile
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="section-header">
        <h2>{isOwnProfile ? "My Projects" : "User Projects"}</h2>
        <div className="header-actions">
          {isOwnProfile && (
            <button className="add-project-button" onClick={handleAddProject}>
              Add Project
            </button>
          )}
          <button className="back-button" onClick={handleBackToProfile}>
            Back to Profile
          </button>
        </div>
      </div>

      {loadedProjects.length === 0 ? (
        <div className="no-projects">
          <p>{isOwnProfile ? "You haven't added any projects yet." : "This user hasn't added any projects yet."}</p>
          {isOwnProfile && (
            <button
              className="add-project-btn"
              onClick={handleAddProject}
            >
              Add Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {loadedProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image-container">
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <div className="project-placeholder-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="project-details">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-actions">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      View Project
                    </a>
                  )}
                  {isOwnProfile && (
                    <button className="edit-project-btn">Edit</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllProjects;
