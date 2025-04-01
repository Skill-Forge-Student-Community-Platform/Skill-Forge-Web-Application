// components/ProfileCard.js
import React from 'react';
import './ProfileCard.css';
import { FaShareAlt } from 'react-icons/fa';
import ProfileAvatar from '../Home_page/Home_components/ProfileAvatar';

const ProfileCard = ({ user }) => {
  return (
    <div className="achievements-profile-card">
      <div className="achievements-profile-avatar-container">
        <ProfileAvatar
          userId={user.id}
          staticImageUrl={user.avatar}  // Fallback to the avatar URL if userId doesn't fetch an image
          size="large"
          showLevel={false}  // Don't show level since we have our own badge
          className="achievements-profile-avatar-component"
        />
        <div className="achievements-profile-badge">👑</div>
      </div>
      <div className="achievements-profile-info">
        <h2 className="achievements-profile-name">{user.name}</h2>
        <p className="achievements-profile-title">{user.title}</p>
        {user.isPro && <div className="achievements-pro-badge">Premium</div>}
      </div>
      <button className="achievements-share-button">
        <FaShareAlt className="achievements-share-icon" /> Share Profile
      </button>
    </div>
  );
};

export default ProfileCard;
