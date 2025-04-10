import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCertificateForm = () => {
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState({
    type: "",
    file: null, // New field for PDF upload
    status: "Pending",
  });

  // Handle input changes
  const handleChange = (e) => {
    setCertificate({ ...certificate, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setCertificate({ ...certificate, file: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!certificate.type || !certificate.file) {
      alert("Please select a document type and upload a PDF file.");
      return;
    }

    // Get existing qualifications from localStorage
    const savedQualifications = JSON.parse(localStorage.getItem("qualifications")) || [];

    // Add new qualification
    const updatedQualifications = [...savedQualifications, certificate];

    // Save updated data
    localStorage.setItem("qualifications", JSON.stringify(updatedQualifications));

    // Navigate back to qualifications section
    navigate("/profile");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Qualification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
          <select
            name="type"
            value={certificate.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Type</option>
            <option value="Academic">Academic</option>
            <option value="Job Experience">Job Experience</option>
          </select>
        </div>

        {/* PDF Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Supporting Document (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Add Qualification
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
            onClick={() => navigate("/profile")}
          >
            Cancel

          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCertificateForm;
