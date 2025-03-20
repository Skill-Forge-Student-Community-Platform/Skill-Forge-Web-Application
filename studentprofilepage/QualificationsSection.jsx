import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QualificationsSection.css";

const QualificationsSection = () => {
  const navigate = useNavigate();
  const [qualifications, setQualifications] = useState([]);

  useEffect(() => {
    // ✅ Default qualifications (Preloaded)
    const defaultQualifications = [
      { type: "Academic", status: "Verified" },
      { type: "Job Experience", status: "Verified" },
      { type: "Academic", status: "Verified" },
      { type: "Job Experience", status: "Verified" },
    ];

    // ✅ Load saved qualifications from localStorage
    const savedQualifications = JSON.parse(localStorage.getItem("qualifications")) || [];

    // ✅ Prevent duplicates by checking if defaultQualifications already exist
    const isDefaultAlreadyAdded = savedQualifications.some((q) =>
      defaultQualifications.some((defaultQ) => defaultQ.type === q.type)
    );

    // ✅ If default qualifications are not already stored, add them once
    if (!isDefaultAlreadyAdded) {
      const updatedQualifications = [...defaultQualifications, ...savedQualifications];

      // ✅ Save to localStorage
      localStorage.setItem("qualifications", JSON.stringify(updatedQualifications));
      setQualifications(updatedQualifications);
    } else {
      setQualifications(savedQualifications);
    }
  }, []);

  const handleAdd = () => {
    navigate("/add-certificate");
  };

  return (
    <div className="qualifications-container">
      <h2>Certifications</h2>
      <table>
        <thead>
          <tr>
            <th>Document Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {qualifications.map((q, index) => (
            <tr key={index}>
              <td>{q.type}</td>
              <td className="status-text verified">Verified</td> {/* ✅ Always Show Verified */}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-btn" onClick={handleAdd}>Add</button>
    </div>
  );
};

export default QualificationsSection;
