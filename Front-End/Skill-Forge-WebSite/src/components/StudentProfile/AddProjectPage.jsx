import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProjectPage.css"; // Make sure to create this CSS file

const AddProjectPage = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    location: "",
    image: "",
  });

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProject({ ...project, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const updatedProjects = [...savedProjects, project];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    navigate("/"); // Redirect back to profile page
  };

  return (
    <div className="add-project-container">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Title</label>
        <input
          type="text"
          name="title"
          value={project.title}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={project.location}
          onChange={handleChange}
          required
        />

        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} required />

        {project.image && <img src={project.image} alt="Preview" className="image-preview" />}

        <button type="submit">Add Project</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
};

export default AddProjectPage;
