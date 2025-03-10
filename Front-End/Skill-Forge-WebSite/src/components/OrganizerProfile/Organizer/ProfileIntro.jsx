import React, { useState } from 'react';
import './ProfileIntro.css';
import OrganizerStatistics from '../Organizer/OrganizerStatistics'; // Import OrganizerStatistics

const ProfileIntro = () => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    bio: "I am famous as Venom 😅❤️🔥",
    education: [
      { id: 1, type: "Studies at", place: "University of Westminster" },
      { id: 2, type: "Studied at", place: "Esoft Metro Campus, Piliyandala" },
      { id: 3, type: "Studied at", place: "St. Sebastian's College, Moratuwa." },
      { id: 4, type: "Studied at", place: "Alethea International School, Dehiwela, Sri Lanka." }
    ],
    location: [
      { id: 1, type: "Lives in", place: "Galkissa, Sri Lanka" },
      { id: 2, type: "From", place: "Colombo, Sri Lanka" }
    ],
    status: "Single",
    joined: "July 2022"
  });

  const [tempProfileInfo, setTempProfileInfo] = useState({ ...profileInfo });

  const handleInputChange = (e, section, id = null) => {
    const { name, value } = e.target;

    if (section === 'bio') {
      setTempProfileInfo({ ...tempProfileInfo, bio: value });
    } else if (section === 'education' || section === 'location') {
      const updatedSection = tempProfileInfo[section].map(item =>
        item.id === id ? { ...item, [name]: value } : item
      );
      setTempProfileInfo({ ...tempProfileInfo, [section]: updatedSection });
    } else if (section === 'status') {
      setTempProfileInfo({ ...tempProfileInfo, status: value });
    }
  };

  const handleSaveChanges = (section) => {
    setProfileInfo({ ...tempProfileInfo });
    if (section === "bio") setIsEditingBio(false);
    if (section === "details") setIsEditingDetails(false);
  };

  const handleCancelEdit = (section) => {
    setTempProfileInfo({ ...profileInfo });
    if (section === "bio") setIsEditingBio(false);
    if (section === "details") setIsEditingDetails(false);
  };

  return (
    <div className="profile-stats-container">
      {/* Profile Intro Section */}
      <div className="profile-intro">
        <div className="intro-container">
          <h2 className="intro-heading">Intro</h2>

          {/* Bio Section */}
          <div className="bio-section">
            {isEditingBio ? (
              <textarea
                className="bio-textarea"
                value={tempProfileInfo.bio}
                onChange={(e) => handleInputChange(e, 'bio')}
                rows={3}
              />
            ) : (
              <p className="bio-text">{profileInfo.bio}</p>
            )}
          </div>

          {/* Edit Bio Buttons */}
          {!isEditingBio && (
            <button className="edit-button" onClick={() => setIsEditingBio(true)}>
              Edit Bio
            </button>
          )}
          {isEditingBio && (
            <div className="edit-buttons-container">
              <button className="edit-button save-button" onClick={() => handleSaveChanges("bio")}>
                Save Changes
              </button>
              <button className="edit-button cancel-button" onClick={() => handleCancelEdit("bio")}>
                Cancel
              </button>
            </div>
          )}

          {/* Information Section */}
          <div className="info-section">
            {isEditingDetails ? (
              <>
                {/* Education Section */}
                {tempProfileInfo.education.map((edu) => (
                  <div className="info-row" key={edu.id}>
                    <input
                      type="text"
                      name="type"
                      value={edu.type}
                      onChange={(e) => handleInputChange(e, 'education', edu.id)}
                      className="edit-input small-input"
                    />
                    <input
                      type="text"
                      name="place"
                      value={edu.place}
                      onChange={(e) => handleInputChange(e, 'education', edu.id)}
                      className="edit-input"
                    />
                  </div>
                ))}

                {/* Location Section */}
                {tempProfileInfo.location.map((loc) => (
                  <div className="info-row" key={loc.id}>
                    <input
                      type="text"
                      name="type"
                      value={loc.type}
                      onChange={(e) => handleInputChange(e, 'location', loc.id)}
                      className="edit-input small-input"
                    />
                    <input
                      type="text"
                      name="place"
                      value={loc.place}
                      onChange={(e) => handleInputChange(e, 'location', loc.id)}
                      className="edit-input"
                    />
                  </div>
                ))}

                {/* Relationship Status */}
                <div className="info-row">
                  <select
                    value={tempProfileInfo.status}
                    onChange={(e) => handleInputChange(e, 'status')}
                    className="edit-input"
                  >
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Married">Married</option>
                    <option value="It's complicated">It's complicated</option>
                    <option value="Separated">Separated</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {profileInfo.education.map((edu) => (
                  <div className="info-row" key={edu.id}>
                    <div className="info-text">
                      <span>{edu.type} </span>
                      <span className="bold-text">{edu.place}</span>
                    </div>
                  </div>
                ))}

                {profileInfo.location.map((loc) => (
                  <div className="info-row" key={loc.id}>
                    <div className="info-text">
                      <span>{loc.type} </span>
                      <span className="bold-text">{loc.place}</span>
                    </div>
                  </div>
                ))}

                <div className="info-row">
                  <div className="info-text">
                    <span>{profileInfo.status}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-text">
                    <span>Joined {profileInfo.joined}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Edit Details Buttons */}
          {!isEditingDetails && (
            <button className="edit-button" onClick={() => setIsEditingDetails(true)}>
              Edit Details
            </button>
          )}
          {isEditingDetails && (
            <div className="edit-buttons-container">
              <button className="edit-button save-button" onClick={() => handleSaveChanges("details")}>
                Save Changes
              </button>
              <button className="edit-button cancel-button" onClick={() => handleCancelEdit("details")}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Organizer Statistics Section */}
      <div className="organizer-stats">
        <OrganizerStatistics />
      </div>
    </div>
  );
};

export default ProfileIntro;
