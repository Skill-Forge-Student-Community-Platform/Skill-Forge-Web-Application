import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCertificateForm.css"; // ✅ Ensure you have this CSS file

const AddCertificateForm = () => {
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState({
    type: "",
    file: null, // ✅ New field for PDF upload
    status: "Pending",
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    setCertificate({ ...certificate, [e.target.name]: e.target.value });
  };

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    setCertificate({ ...certificate, file: e.target.files[0] });
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validate inputs
    if (!certificate.type || !certificate.file) {
      alert("Please select a document type and upload a PDF file.");
      return;
    }

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
        {/* ✅ Document Type Dropdown */}
        <label>Document Type</label>
        <select name="type" value={certificate.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Academic">Academic</option>
          <option value="Job Experience">Job Experience</option>
        </select>

        {/* ✅ PDF Upload Field */}
        <label>Upload Supporting Document (PDF)</label>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />

        {/* ✅ Buttons */}
        <button type="submit">Add Qualification</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCertificateForm;
