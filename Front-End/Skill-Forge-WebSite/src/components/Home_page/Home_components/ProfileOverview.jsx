import React, { useState, useEffect } from 'react';
import { MdShare } from 'react-icons/md';
import { FaUniversity } from 'react-icons/fa';
import { useAuthStore } from '../../../store/authStore';
import ProfileAvatar from './ProfileAvatar';
import './ProfileOverview.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ProfileOverview = () => {
  // Auth state
  const { user } = useAuthStore();

  // UI states
  const [progressWidth, setProgressWidth] = useState(0);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Default user data
  const defaultUser = {
    firstName: "John",
    lastName: "Doe",
    level: 1,
    xp: 25,
    xpToNextLevel: 100,
    membershipType: "pro", // basic, plus, pro
    profileImage: "https://via.placeholder.com/150",
    university: "University of Technology",
    profession: "Software Engineering Student"
  };

  // User data state
  const [userData, setUserData] = useState(defaultUser);

  // Fetch user data
  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      // If we have a real user, we would fetch their data here
      // For now, just animate the progress bar with default data
      setProgressWidth(0);
      setTimeout(() => {
        setProgressWidth((userData.xp / userData.xpToNextLevel) * 100);
        setAnimateProgress(true);
      }, 300);
    }, 500);
  }, [userData.xp, userData.xpToNextLevel]);

  // Handle profile sharing
  const handleShareProfile = () => {
    setShowShareTooltip(true);
    // Copy profile url to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/profile/${userData.id || 'demo'}`);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        {/* Remove border animation elements */}

        {/* Share Button */}
        <div className="profile-header-actions">
          <button className="share-button" onClick={handleShareProfile} title="Share profile">
            <MdShare className="share-button-icon" size={18} />
            {showShareTooltip && (
              <span className="share-tooltip">Link copied!</span>
            )}
          </button>
        </div>

        {/* Profile Avatar Section */}
        <div className="profile-avatar-section">
          {/* Using the ProfileAvatar component */}
          <ProfileAvatar
            userData={userData}
            size="medium"
            showLevel={true}
            showMembershipTag={true}
          />
        </div>

        {/* Profile Info Section */}
        <div className="profile-info-section">
          <h2 className="profile-name">{userData.firstName} {userData.lastName}</h2>
          <p className="profile-profession">{userData.profession}</p>
          <div className="profile-detail">
            <FaUniversity className="profile-detail-icon" />
            <span>{userData.university}</span>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="level-progress-section">
          <div className="level-info">
            <span>Level {userData.level}</span>
            <span>{userData.xp}/{userData.xpToNextLevel} XP</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${animateProgress ? 'animate' : ''}`}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
