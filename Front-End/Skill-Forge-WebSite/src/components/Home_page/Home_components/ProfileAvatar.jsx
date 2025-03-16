import React, { useState, useEffect } from 'react';
import useUserProfile from '../../../hooks/useUserProfile.js';
import defaultProfilePicture from '../../../Assets/test-profile-pic.jpg';
import './ProfileAvatar.css';

const ProfileAvatar = ({
  userId,
  size = 'medium', // small, medium, large, tiny, micro (new sizes)
  showLevel = true,
  showMembershipTag = true,
  className = '', // Add custom class support
  staticImageUrl = null, // Allow passing a static image URL instead of using the hook
  customAltText = null, // Custom alt text
  disableBorder = false, // Option to disable the membership border
}) => {
  // Always call the hook unconditionally, even if userId is not provided
  const { getProfileImage, fullName, isLoading, error } = useUserProfile(userId);

  // Use staticImageUrl and customAltText when userId is not provided
  const useStaticImage = !userId && staticImageUrl;

  // Get image source based on whether we're using a static image or the hook result
  const getImageSrc = () => {
    if (useStaticImage) return staticImageUrl;
    return getProfileImage();
  };

  // Get alt text based on props or hook result
  const imageAlt = customAltText || (fullName ? `${fullName}'s profile` : "Profile");

  // Use hardcoded userData for level and membership until we implement those features
  const userData = {
    level: 1,
    membershipType: 'pro' // This will be dynamic in the future
  };

  // Get border class based on membership type
  const getMembershipBorderClass = () => {
    if (disableBorder) return '';

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

  // Enhance the size determination
  const getSizeClass = () => {
    // If a custom classname is provided for a specific context, make sure
    // we honor the requested size rather than hardcoding it
    if (className.includes('post-author-avatar')) {
      return 'size-tiny';
    } else if (className.includes('comment-avatar')) {
      return 'size-micro';
    } else if (className.includes('post-modal-avatar')) {
      return 'size-small';
    } else if (className.includes('profile-dropdown-avatar')) {
      return 'size-tiny';
    }
    return `size-${size}`;
  };

  // Show a simple loading state while image is being fetched
  if (isLoading && !useStaticImage) {
    return <div className={`avatar-container ${getMembershipBorderClass()} ${getSizeClass()} loading-avatar ${className}`}></div>;
  }

  // Handle error case gracefully
  if (error && !useStaticImage) {
    return (
      <div className={`avatar-container ${getMembershipBorderClass()} ${getSizeClass()} ${className}`}>
        <img
          src={defaultProfilePicture}
          alt="Profile"
          className="avatar-image error-image"
        />
        {showLevel && size !== 'tiny' && size !== 'micro' && (
          <div className="level-badge">{userData.level}</div>
        )}
        {/* Show membership tag even on error for consistency */}
        {showMembershipTag && userData.membershipType !== 'basic' && (
          <div className={`membership-tag membership-tag-${userData.membershipType}`}>
            {getMembershipTag()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`avatar-container ${getMembershipBorderClass()} ${getSizeClass()} ${className}`}>
      <img
        src={getImageSrc()}
        alt={imageAlt}
        className="avatar-image"
        onError={(e) => {
          e.target.classList.add('image-error');
        }}
      />

      {/* Level Badge - Conditionally rendered based on size */}
      {showLevel && size !== 'tiny' && size !== 'micro' && (
        <div className="level-badge">{userData.level}</div>
      )}

      {/* Membership Tag - Remove size condition to ensure it's visible */}
      {showMembershipTag && userData.membershipType !== 'basic' && (
        <div className={`membership-tag membership-tag-${userData.membershipType}`}>
          {getMembershipTag()}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
