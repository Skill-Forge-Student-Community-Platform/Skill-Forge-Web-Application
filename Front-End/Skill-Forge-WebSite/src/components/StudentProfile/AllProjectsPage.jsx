import React from "react";
import { useNavigate } from "react-router-dom";
import "./AllProjectsPage.css";

const AllProjectsPage = () => {
  const navigate = useNavigate();
  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  return (
    <div className="all-projects-container">
      <h2>All Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <img src={project.image} alt={project.title} />
            <p className="project-title">{project.title}</p>
            <p className="project-location">{project.location}</p>
            <div className="project-rating">⭐ {project.rating}</div>
            <p className="project-price">{project.price}</p>
          </div>
        ))}
      </div>

      {/* ✅ Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>Back to Profile</button>
    </div>
  );
};

export default AllProjectsPage;
