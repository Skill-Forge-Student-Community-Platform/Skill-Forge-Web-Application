import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllProjects.css";

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // ✅ Get Projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(savedProjects);
  }, []);

  return (
    <div className="all-projects-container">
      <h2 className="all-projects-title">All Projects</h2>

      {/* ✅ Horizontal Scrollable Row */}
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
            <p className="project-title">{project.title}</p>
            <p className="project-location">{project.location}</p>
            <div className="project-rating">⭐ {project.rating}</div>
            <p className="project-price">{project.price}</p>
          </div>
        ))}
      </div>

      {/* ✅ Back to Profile Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Profile
      </button>
    </div>
  );
};

export default AllProjects;
