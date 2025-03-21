import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // ✅ Default Project (Image Only Initially)
    const defaultProjects = [
      {
        title: "Enjoy the beauty of the Floating Islands",
        location: "Maldives Islands",
        rating: 5.0,
        price: "$1270",
        image: process.env.PUBLIC_URL + "/images/maldives.jpg",
      },
    ];

    // ✅ Get Saved Projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // ✅ Show the first project as default
    const combinedProjects = savedProjects.length > 0 ? savedProjects : defaultProjects;
    setProjects(combinedProjects);
  }, []);

  return (
    <div className="projects-container">
      <h2>Projects</h2>

      <div className="projects-wrapper">
        {/* ✅ Show Only the Image Initially */}
        {projects.length > 0 && (
          <div className="project-card">
            <img 
              src={projects[0].image} 
              alt={projects[0].title} 
              className="project-image"
            />
          </div>
        )}

        {/* ✅ "Add More" Section */}
        <div className="add-more-card" onClick={() => navigate("/add-project")}>
          <p className="add-more-text">+ Add More</p>
        </div>
      </div>

      {/* ✅ View All Projects Button */}
      <div className="project-buttons">
        <button className="view-projects-btn" onClick={() => navigate("/view-projects")}>
          View All Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;
