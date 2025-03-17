// components/ProfileCard.js
import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <div className="profile-avatar">
        <img src={user.avatar} alt={user.name} />
        <div className="profile-badge">👑</div>
      </div>
      <div className="profile-info">
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-title">{user.title}</p>
        {user.isPro && <div className="pro-badge">Pro Member</div>}
      </div>
      <button className="share-button">
        <span className="share-icon">🔗</span> Share Profile
      </button>
    </div>
  );
};

export default ProfileCard;