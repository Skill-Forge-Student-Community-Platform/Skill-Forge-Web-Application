import React from "react";
import "./ProfileCard.css";

const ProfileCard = () => {
  return (
    <div className="profile-card">
      <img
        src="https://via.placeholder.com/150" // Larger image placeholder or your actual image URL
        alt="Profile"
        className="profile-photo"
      />
      <h3>Alex Thompson</h3>
      <p>Full Stack Developer</p>
      <button className="share-profile">Share Profile</button>
    </div>
  );
};

export default ProfileCard;
