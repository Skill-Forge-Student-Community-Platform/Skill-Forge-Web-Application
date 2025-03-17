import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditPage.css";

const EditDetailsPage = () => {
  const [details, setDetails] = useState({
    university: "University of Westminster",
    metroCampus: "Esoft Metro Campus, Piliyandala",
    school: "St. Sebastian's College, Moratuwa.",
    internationalSchool: "Alethea International School, Dehiwela, Sri Lanka.",
    home: "Galkissa, Sri Lanka",
    from: "Colombo, Sri Lanka",
    status: "Single",
    joined: "July 2022",
  });
  const navigate = useNavigate();

  const handleSave = () => {
    alert("Details updated successfully!");
    navigate("/");
  };

  return (
    <div className="edit-page">
      <h2>Edit Details</h2>
      {Object.keys(details).map((key) => (
        <input
          key={key}
          type="text"
          value={details[key]}
          onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
        />
      ))}
      <button className="save-btn" onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditDetailsPage;
