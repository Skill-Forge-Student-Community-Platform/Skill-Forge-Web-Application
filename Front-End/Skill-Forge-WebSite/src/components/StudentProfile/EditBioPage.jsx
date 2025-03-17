import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditPage.css";

const EditBioPage = () => {
  const [bio, setBio] = useState("I am famous as venom 🦁❤️🤘");
  const navigate = useNavigate();

  const handleSave = () => {
    alert("Bio updated successfully!");
    navigate("/");
  };

  return (
    <div className="edit-page">
      <h2>Edit Bio</h2>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      <button className="save-btn" onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditBioPage;
