import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCertificateForm.css"; // ✅ Ensure you have this CSS file

const AddCertificateForm = () => {
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState({
    type: "",
    degree: "",
    status: "Pending",
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    setCertificate({ ...certificate, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Get existing qualifications from localStorage
    const savedQualifications = JSON.parse(localStorage.getItem("qualifications")) || [];

    // ✅ Add new qualification
    const updatedQualifications = [...savedQualifications, certificate];

    // ✅ Save updated data
    localStorage.setItem("qualifications", JSON.stringify(updatedQualifications));

    // ✅ Navigate back to qualifications section
    navigate("/");
  };

  return (
    <div className="add-certificate-container">
      <h2>Add New Qualification</h2>
      <form onSubmit={handleSubmit}>
        <label>Document Type</label>
        <select name="type" value={certificate.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Academic">Academic</option>
          <option value="Job Experience">Job Experience</option>
        </select>

        <label>Degree / Position</label>
        <input type="text" name="degree" value={certificate.degree} onChange={handleChange} required />

        <button type="submit">Add Qualification</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
};

export default AddCertificateForm;
