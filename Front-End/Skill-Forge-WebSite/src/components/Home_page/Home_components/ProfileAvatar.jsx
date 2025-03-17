import React, { useState, useEffect, useMemo } from 'react';
import useUserProfile from '../../../hooks/useUserProfile.js';
// Import default profile image directly
import defaultProfilePicture from '../../../Assets/test-profile-pic.jpg';
import './ProfileAvatar.css';
import imageCache from '../../../utils/imageCache.js';

const ProfileAvatar = ({
  userId,
  size = 'medium', // small, medium, large, tiny, micro (new sizes)
  showLevel = true,
  showMembershipTag = true,
  className = '', // Add custom class support
  staticImageUrl = null, // Allow passing a static image URL instead of using the hook
  customAltText = null, // Custom alt text
  disableBorder = false, // Option to disable the membership border
  onClick = null, // Add onClick handler support
}) => {
  // Always call the hook unconditionally, even if userId is not provided
  const { getProfileImage, fullName, isLoading: profileLoading, error } = useUserProfile(userId);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Use staticImageUrl and customAltText when userId is not provided
  const useStaticImage = !userId && staticImageUrl;

  // Check for direct cache hit first (synchronous) to prevent flickering
  useEffect(() => {
    if (userId) {
      const cachedUrl = imageCache.getCachedImage(userId);
      if (cachedUrl) {
        setImageUrl(cachedUrl);
      }
    } else if (staticImageUrl) {
      setImageUrl(staticImageUrl);
    }
  }, [userId, staticImageUrl]);

  // Then do a full resolution (async) - this might update the URL if needed
  useEffect(() => {
    if (useStaticImage) {
      return;
    }

    if (userId) {
      const loadImage = async () => {
        try {
          // This will check cache including IndexedDB and fallback to network
          const url = await imageCache.getImage(userId);
          if (url) {
            setImageUrl(url);
          } else {
            // If no image is available, fallback to default
            setImageUrl(defaultProfilePicture);
            setImageFailed(true);
          }
        } catch (err) {
          console.error('Failed to load image:', err);
          setImageUrl(defaultProfilePicture);
          setImageFailed(true);
        }
      };

      loadImage();
    }
  }, [userId, useStaticImage]);

  // Reset image state when userId or static URL changes
  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
  }, [userId, staticImageUrl]);

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

  // Determine if we're in a loading state
  const isLoading = (profileLoading && !useStaticImage && !imageUrl) || (!imageLoaded && !imageFailed);

  // Handle image load failure
  const handleImageError = (e) => {
    console.error(`Failed to load image: ${imageUrl}`);
    e.target.classList.add('image-error');
    setImageFailed(true);
    setImageLoaded(true);
    // Fallback to default image
    setImageUrl(defaultProfilePicture);
  };

  return (
    <div
      className={`avatar-container ${getMembershipBorderClass()} ${getSizeClass()} ${isLoading ? 'loading-avatar' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Show a loading skeleton while image is loading */}
      {isLoading && <div className="avatar-skeleton pulse-animation"></div>}

      {/* The actual image - only render when we have a URL */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt}
          className={`avatar-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => {
            console.log(`Image loaded: ${imageUrl}`);
            setImageLoaded(true);
          }}
          onError={handleImageError}
          loading="lazy" // Native lazy loading for performance
        />
      )}

      {/* Level Badge - Conditionally rendered based on size */}
      {showLevel && size !== 'tiny' && size !== 'micro' && (
        <div className="level-badge">{userData.level}</div>
      )}

      {/* Membership Tag */}
      {showMembershipTag && userData.membershipType !== 'basic' && (
        <div className={`membership-tag membership-tag-${userData.membershipType}`}>
          {getMembershipTag()}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
