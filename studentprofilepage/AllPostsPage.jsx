import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllProjectsPage.css";

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
      <h2 className="all-projects-title">Our Projects</h2>

      {/* ✅ Responsive Grid Layout for Projects */}
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus mattis.
              </p>
              <button className="read-more-btn">Read Case Study →</button>
            </div>
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
