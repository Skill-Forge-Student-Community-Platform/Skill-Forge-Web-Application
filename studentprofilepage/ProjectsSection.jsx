import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // ✅ Default Projects (Always Displayed)
    const defaultProjects = [
      {
        title: "Enjoy the beauty of the Floating Islands",
        location: "Maldives Islands",
        rating: 5.0,
        price: "$1270",
        image: process.env.PUBLIC_URL + "/images/floating-islands.jpg",
      },
      {
        title: "Enjoy the best kayak experience",
        location: "Maraina Lake",
        rating: 4.5,
        price: "$1350",
        image: process.env.PUBLIC_URL + "/images/kayak.jpg",
      },
    ];

    // ✅ Get Saved Projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // ✅ Combine Default + Saved Projects
    const combinedProjects = [...defaultProjects, ...savedProjects];

    // ✅ Update State
    setProjects(combinedProjects);
  }, []);

  return (
    <div className="projects-container">
      <h2>Projects</h2>
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

      {/* ✅ Buttons: Add Project & View All Projects */}
      <div className="project-buttons">
        <button className="add-project-btn" onClick={() => navigate("/add-project")}>
          Add Project
        </button>
        <button className="view-projects-btn" onClick={() => navigate("/view-projects")}>
          View All Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;
