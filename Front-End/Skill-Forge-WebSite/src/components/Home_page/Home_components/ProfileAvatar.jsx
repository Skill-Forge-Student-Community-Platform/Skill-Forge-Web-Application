import React from 'react';
import './ProfileAvatar.css';

const ProfileAvatar = ({
  userData,
  size = 'medium', // small, medium, large
  showLevel = true,
  showMembershipTag = true
}) => {
  // Get border class based on membership type
  const getMembershipBorderClass = () => {
    switch(userData.membershipType) {
      case 'pro':
        return 'membership-border-pro';
      case 'plus':
        return 'membership-border-plus';
      default:
        return 'membership-border-basic';
    }
  };

  // Get membership tag text
  const getMembershipTag = () => {
    switch(userData.membershipType) {
      case 'pro':
        return 'PRO';
      case 'plus':
        return 'PLUS';
      default:
        return '';
    }
  };

  return (
    <div className={`avatar-container ${getMembershipBorderClass()} size-${size}`}>
      <img
        src={userData.profileImage}
        alt={`${userData.firstName || 'User'}'s profile`}
        className="avatar-image"
      />

      {/* Level Badge - Conditionally rendered */}
      {showLevel && (
        <div className="level-badge">{userData.level}</div>
      )}

      {/* Membership Tag - Conditionally rendered */}
      {showMembershipTag && userData.membershipType !== 'basic' && (
        <div className={`membership-tag membership-tag-${userData.membershipType}`}>
          {getMembershipTag()}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
