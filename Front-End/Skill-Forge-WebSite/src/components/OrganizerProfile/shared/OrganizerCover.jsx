import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaEdit, FaMapMarkerAlt, FaBriefcase, FaCheck, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import ProfileAvatar from '../../Home_page/Home_components/ProfileAvatar';
import './OrganizerCover.css';

const OrganizerCover = ({
  userId,
  isOwnProfile,
  fullName,
  coverImage,
  profileImage,
  organizationDetails,
  followerCount = 0
}) => {
  const navigate = useNavigate();
  const coverFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Default cover image
  const defaultCoverImage = 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

  const handleCoverPhotoClick = () => {
    if (isOwnProfile && coverFileInputRef.current) {
      coverFileInputRef.current.click();
    }
  };

  const handleCoverPhotoChange = async (e) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please select a valid image file (JPEG, PNG, WEBP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError('Image file is too large. Please select an image under 5MB.');
        return;
      }

      try {
        setIsUploading(true);
        setUploadError(null);

        // Create FormData and append file
        const formData = new FormData();
        formData.append('coverImage', file);

        // Send to backend - This would be implemented in your API service
        // await userAPI.uploadCoverImage(formData);

        // For demonstration, just log
        console.log('Uploading cover image:', file.name);
        setTimeout(() => {
          setIsUploading(false);
        }, 1500);

      } catch (error) {
        setUploadError('Failed to upload cover image. Please try again.');
        console.error('Cover image upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMessageClick = () => {
    navigate(`/messages/new?userId=${userId}`);
  };

  return (
    <div className="organizer-cover">
      {/* Cover Photo Section */}
      <div className="organizer-cover-photo">
        <div className="organizer-cover-photo-container">
          <img
            src={coverImage || defaultCoverImage}
            alt="Cover"
            className="organizer-cover-img"
          />

          {isOwnProfile && (
            <div className="organizer-cover-photo-edit" onClick={handleCoverPhotoClick}>
              <input
                type="file"
                ref={coverFileInputRef}
                className="organizer-cover-file-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverPhotoChange}
              />
              <span className="organizer-cover-edit-btn">
                <FaCamera className="organizer-cover-edit-icon" />
                <span className="organizer-cover-edit-text">Change Cover</span>
              </span>
            </div>
          )}

          {isUploading && (
            <div className="organizer-cover-upload-overlay">
              <div className="organizer-cover-spinner"></div>
              <span>Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="organizer-profile-header">
        <div className="organizer-profile-header-content">
          {/* Profile Picture */}
          <div className="organizer-profile-picture">
            <ProfileAvatar
              userId={userId}
              size="large"
              showLevel={false}
              staticImageUrl={profileImage}
              customAltText={`${fullName}'s profile`}
            />
          </div>

          {/* Profile Info */}
          <div className="organizer-profile-info">
            <div className="organizer-profile-name-container">
              <h1 className="organizer-profile-name">{fullName}</h1>
              {organizationDetails?.isVerified && (
                <span className="organizer-verified-badge" title="Verified Organization">
                  <FaCheck />
                </span>
              )}
            </div>

            <div className="organizer-profile-details">
              {organizationDetails?.organizationName && (
                <div className="organizer-detail-item">
                  <FaBriefcase className="organizer-detail-icon" />
                  <span className="organizer-detail-text">{organizationDetails.organizationName}</span>
                </div>
              )}

              {organizationDetails?.industry && (
                <div className="organizer-detail-item">
                  <FaMapMarkerAlt className="organizer-detail-icon" />
                  <span className="organizer-detail-text">{organizationDetails.industry}</span>
                </div>
              )}

              <div className="organizer-detail-item">
                <span className="organizer-follower-count">{followerCount} followers</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="organizer-profile-actions">
            {isOwnProfile ? (
              <button
                className="organizer-profile-edit-btn"
                onClick={() => navigate(`/Organizer/${userId}/settings/profile`)}
              >
                <FaEdit className="organizer-action-icon" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="organizer-action-buttons">
                <button className="organizer-follow-btn">
                  <FaUserPlus className="organizer-action-icon" />
                  <span>Follow</span>
                </button>
                <button className="organizer-message-btn" onClick={handleMessageClick}>
                  <FaEnvelope className="organizer-action-icon" />
                  <span>Message</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="organizer-upload-error">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default OrganizerCover;
