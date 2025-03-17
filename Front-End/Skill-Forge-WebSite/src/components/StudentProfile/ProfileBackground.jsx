import React from "react";
import "./ProfileBackground.css";

const ProfileBackground = () => {
  return (
    <div className="profile-background">
      {/* Cover Photo */}
      <div className="cover-photo">
        <p className="cover-photo-text">Cover Photo</p>
      </div>

      {/* Profile Info Section */}
      <div className="profile-info">
        <div className="profile-picture">
          <p>Profile Picture</p>
        </div>
        <div className="profile-details">
          <h2>Lakshan Fernando</h2>
          <p>389 friends</p>
          <button className="edit-profile-btn">✏ Edit profile</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBackground;
