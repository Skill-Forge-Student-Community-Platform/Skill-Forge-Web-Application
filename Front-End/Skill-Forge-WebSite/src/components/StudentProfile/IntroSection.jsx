import React, { useState } from "react";
import "./IntroSection.css";

const IntroSection = () => {
  // State for Edit Mode
  const [isEditing, setIsEditing] = useState(false);

  // State to store user details
  const [details, setDetails] = useState({
    bio: "I am famous as Venom 🕷️🔥",
    university: "University of Westminster",
    esoft: "Esoft Metro Campus, Piliyandala",
    school: "St. Sebastian's College, Moratuwa",
    otherSchool: "Alethea International School, Dehiwela, Sri Lanka",
    location: "Galkissa, Sri Lanka",
    from: "Colombo, Sri Lanka",
    status: "Single",
    joined: "July 2022",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="intro-section">
      <h2 className="section-title">🎭 Intro</h2>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="edit-mode">
          <textarea
            name="bio"
            value={details.bio}
            onChange={handleChange}
            className="edit-input"
          />
          <input name="university" value={details.university} onChange={handleChange} className="edit-input" />
          <input name="esoft" value={details.esoft} onChange={handleChange} className="edit-input" />
          <input name="school" value={details.school} onChange={handleChange} className="edit-input" />
          <input name="otherSchool" value={details.otherSchool} onChange={handleChange} className="edit-input" />
          <input name="location" value={details.location} onChange={handleChange} className="edit-input" />
          <input name="from" value={details.from} onChange={handleChange} className="edit-input" />
          <input name="status" value={details.status} onChange={handleChange} className="edit-input" />
          <input name="joined" value={details.joined} onChange={handleChange} className="edit-input" />

          <button onClick={() => setIsEditing(false)} className="save-btn">💾 Save</button>
        </div>
      ) : (
        <div className="intro-details">
          <p className="bio-text">💬 {details.bio}</p>
          <p>🎓 Studies at <strong>{details.university}</strong></p>
          <p>📖 Studied at {details.esoft}</p>
          <p>🏫 Studied at <strong>{details.school}</strong></p>
          <p>🏫 Studied at {details.otherSchool}</p>
          <p>🏠 Lives in <strong>{details.location}</strong></p>
          <p>📍 From <strong>{details.from}</strong></p>
          <p>💖 {details.status}</p>
          <p>⏳ Joined {details.joined}</p>

          <button onClick={() => setIsEditing(true)} className="edit-btn">✏️ Edit Details</button>
        </div>
      )}
    </div>
  );
};

export default IntroSection;
