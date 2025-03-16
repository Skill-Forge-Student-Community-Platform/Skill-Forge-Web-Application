import React, { useState, useEffect } from 'react';
import { MdShare } from 'react-icons/md';
import { FaUniversity, FaBuilding } from 'react-icons/fa';
import { useAuthStore } from '../../../store/authStore';
import ProfileAvatar from './ProfileAvatar';
import useUserProfile from '../../../hooks/useUserProfile.js'; // Add .js extension
import './ProfileOverview.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ProfileOverview = () => {
  // Auth state
  const { user } = useAuthStore();
  const userId = user?._id;

  // Get profile data from our custom hook
  const {
    fullName,
    occupation,
    getOccupation,
    getInstitutionName,
    role,
    isLoading,
    error
  } = useUserProfile(userId);

  // UI states
  const [progressWidth, setProgressWidth] = useState(0);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Default user data for XP system (until implemented)
  const defaultUser = {
    level: 1,
    xp: 25,
    xpToNextLevel: 100,
    membershipType: "pro", // basic, plus, pro
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
    navigator.clipboard.writeText(`${window.location.origin}/profile/${userId || 'demo'}`);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  if (isLoading) {
    return <div className="profile-container loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-container error">Failed to load profile</div>;
  }

  const institutionName = getInstitutionName();
  const userOccupation = getOccupation();

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
            userId={userId}
            size="medium"
            showLevel={true}
            showMembershipTag={true}
          />
        </div>

        {/* Profile Info Section */}
        <div className="profile-info-section">
          {/* Display full name without truncation */}
          <h2 className="profile-Name">{fullName}</h2>

          {/* Display occupation based on role */}
          <p className="profile-profession">{userOccupation}</p>

          {/* Show institution with appropriate icon */}
          {institutionName && (
            <div className="profile-detail">
              {role === 'student' ? (
                <FaUniversity className="profile-detail-icon" />
              ) : (
                <FaBuilding className="profile-detail-icon" />
              )}
              <span>{institutionName}</span>
            </div>
          )}
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
