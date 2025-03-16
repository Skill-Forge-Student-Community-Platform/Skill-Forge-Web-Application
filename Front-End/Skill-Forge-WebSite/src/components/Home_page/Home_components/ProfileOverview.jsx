import React, { useState, useEffect } from 'react';
import { MdShare } from 'react-icons/md';
import { FaUniversity, FaBuilding } from 'react-icons/fa';
import { useAuthStore } from '../../../store/authStore';
import ProfileAvatar from './ProfileAvatar';
import useUserProfile from '../../../hooks/useUserProfile.js';
import './ProfileOverview.css';
// Import the image cache utility
import imageCache from '../../../utils/imageCache';
// Import for session storage
import sessionProfileCache from '../../../utils/sessionProfileCache';

const ProfileOverview = () => {
  // Auth state
  const { user } = useAuthStore();
  const userId = user?._id;

  // Get profile data from our custom hook
  const {
    fullName,
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
  const [localLoading, setLocalLoading] = useState(true);

  // Default user data for XP system (until implemented)
  const defaultUser = {
    level: 1,
    xp: 25,
    xpToNextLevel: 100,
    membershipType: "pro", // basic, plus, pro
  };

  // User data state
  const [userData, setUserData] = useState(defaultUser);

  // Add these states for immediate text rendering
  const [displayName, setDisplayName] = useState('');
  const [displayOccupation, setDisplayOccupation] = useState('');
  const [displayInstitution, setDisplayInstitution] = useState('');
  const [displayRole, setDisplayRole] = useState('');

  // Add this effect at the beginning - before anything else loads
  // This ensures text data is displayed immediately
  useEffect(() => {
    if (!userId) return;

    // First try to get the ultra-fast text fields cache
    const textFields = sessionProfileCache.getTextFields(userId);
    if (textFields) {
      setDisplayName(textFields.fullName || '');
      setDisplayOccupation(textFields.occupation || '');
      setDisplayInstitution(textFields.institution || '');
      setDisplayRole(textFields.role || '');
      setLocalLoading(false);
    }

    // Then check the full profile cache as backup
    const cachedData = sessionProfileCache.getProfileData(userId);
    if (cachedData && !textFields) {
      // If we have cached data but not text fields, extract what we need
      setDisplayName(cachedData.fullName || '');

      // Use pre-computed fields if available, otherwise compute them here
      if (cachedData.occupation) {
        setDisplayOccupation(cachedData.occupation);
      } else if (cachedData.role === 'student') {
        setDisplayOccupation(`${cachedData.fieldOfStudy || ''} ${cachedData.fieldOfStudy ? 'Student' : 'Student'}`);
      } else if (cachedData.role === 'organizer') {
        setDisplayOccupation(cachedData.position || cachedData.organizerType || 'Organizer');
      }

      if (cachedData.institution) {
        setDisplayInstitution(cachedData.institution);
      } else if (cachedData.role === 'student') {
        setDisplayInstitution(cachedData.school || '');
      } else if (cachedData.role === 'organizer') {
        setDisplayInstitution(cachedData.organizationName || '');
      }

      setDisplayRole(cachedData.role || '');
      setLocalLoading(false);
    }
  }, [userId]);

  // Use the hook values when they become available
  useEffect(() => {
    if (!isLoading && fullName) {
      setDisplayName(fullName);
    }

    if (!isLoading && getOccupation) {
      const occupation = getOccupation();
      if (occupation) {
        setDisplayOccupation(occupation);
      }
    }

    if (!isLoading && getInstitutionName) {
      const institution = getInstitutionName();
      if (institution) {
        setDisplayInstitution(institution);
      }
    }

    if (!isLoading && role) {
      setDisplayRole(role);
    }
  }, [isLoading, fullName, getOccupation, getInstitutionName, role]);

  // Try to get cached data immediately
  useEffect(() => {
    // Try to get data from session storage first
    const cachedData = sessionProfileCache.getProfileData(userId);

    if (cachedData) {
      // If we have cached data, use it immediately and set loading to false
      setLocalLoading(false);

      // If cachedData has role-specific fields already flattened, we can use them directly
      if (cachedData.role === 'student') {
        // These fields could be directly in cachedData from session storage
        const fieldOfStudy = cachedData.fieldOfStudy || '';
        const school = cachedData.school || '';

        // You could store these values in local state if needed
        // setOccupation(`${fieldOfStudy} Student`);
        // setInstitution(school);
      }

      // Set animation with a small delay to make it visible
      setTimeout(() => {
        setProgressWidth((cachedData.xp / cachedData.xpToNextLevel) * 100);
        setAnimateProgress(true);
      }, 300);
    }
  }, [userId]);

  // Fetch user data and manage progress animation
  useEffect(() => {
    // Don't fetch if we don't have a userId
    if (!userId) return;

    // If the main profile data is still loading, wait for it
    if (isLoading) return;

    // Simulate fetching user data (this would be a real API call in production)
    const fetchData = async () => {
      try {
        // Here you would fetch actual XP and level data
        // For now, use the default or cached data

        // Store fetched data in session storage
        const newData = {
          ...defaultUser,
          // Add any other fields from the real API response
        };

        // Cache the data to session storage
        sessionProfileCache.storeProfileData(userId, newData);

        // Update local state
        setUserData(newData);

        // Prefetch profile images for better performance on future loads
        if (userId) {
          imageCache.getImage(userId, false).catch(() => {});
        }

        // Set animation after a small delay
        setTimeout(() => {
          setProgressWidth((newData.xp / newData.xpToNextLevel) * 100);
          setAnimateProgress(true);
          setLocalLoading(false);
        }, 300);
      } catch (error) {
        console.error("Error loading profile data:", error);
        setLocalLoading(false);
      }
    };

    fetchData();
  }, [userId, isLoading, defaultUser.xp, defaultUser.xpToNextLevel]);

  // Handle profile sharing
  const handleShareProfile = () => {
    setShowShareTooltip(true);
    // Copy profile url to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/profile/${userId || 'demo'}`);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  // Skeleton loading component
  const renderSkeleton = () => (
    <div className="profile-container">
      <div className="profile-card skeleton">
        <div className="profile-header-actions">
          <div className="skeleton-share-button"></div>
        </div>

        <div className="profile-avatar-section">
          <div className="skeleton-avatar"></div>
        </div>

        <div className="profile-info-section">
          <div className="skeleton-name"></div>
          <div className="skeleton-profession"></div>
          <div className="skeleton-detail"></div>
        </div>

        <div className="level-progress-section">
          <div className="level-info">
            <div className="skeleton-level"></div>
            <div className="skeleton-xp"></div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill skeleton-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Replace the conditional rendering for isLoading with a more nuanced approach
  const shouldShowSkeleton = isLoading && localLoading;

  // We can also prepare the occupation and institution data early
  const userOccupation = getOccupation(); // This now works faster with cached data
  const institutionName = getInstitutionName(); // This now works faster with cached data

  // Only show skeleton loader if both hook data and local data are loading
  if (shouldShowSkeleton) {
    return renderSkeleton();
  }

  if (error) {
    return (
      <div className="profile-container error">
        <div className="error-message">
          <span>Failed to load profile</span>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
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
          <ProfileAvatar
            userId={userId}
            size="medium"
            showLevel={true}
            showMembershipTag={true}
          />
        </div>

        {/* Profile Info Section - Use the immediate display states */}
        <div className="profile-info-section">
          <h2 className="profile-Name">{displayName || (isLoading ? "Loading..." : "User")}</h2>

          {displayOccupation && (
            <p className="profile-profession">{displayOccupation}</p>
          )}

          {displayInstitution && (
            <div className="profile-detail">
              {displayRole === 'student' ? (
                <FaUniversity className="profile-detail-icon" />
              ) : (
                <FaBuilding className="profile-detail-icon" />
              )}
              <span>{displayInstitution}</span>
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
