import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProjectPage.css";

const AddProject = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    location: "",
    rating: "",
    price: "",
    image: "",
  });

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Retrieve Existing Projects
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // ✅ Add New Project
    const updatedProjects = [...savedProjects, project];

    // ✅ Save Updated Projects to localStorage
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    // ✅ Navigate Back to Projects Section
    navigate("/view-projects");
  };

  return (
    <div className="add-project-container">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Title</label>
        <input type="text" name="title" value={project.title} onChange={handleChange} required />

        <label>Location</label>
        <input type="text" name="location" value={project.location} onChange={handleChange} required />

        <label>Rating</label>
        <input type="number" step="0.1" name="rating" value={project.rating} onChange={handleChange} required />

        <label>Price</label>
        <input type="text" name="price" value={project.price} onChange={handleChange} required />

        <label>Image URL</label>
        <input type="text" name="image" value={project.image} onChange={handleChange} required />

        <button type="submit">Add Project</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
};

export default AddProject;
