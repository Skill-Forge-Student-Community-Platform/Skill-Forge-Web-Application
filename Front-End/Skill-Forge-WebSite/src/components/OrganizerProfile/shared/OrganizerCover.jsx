import React, { useState, useRef } from 'react';
import './OrganizerCover.css';

// Simple icon components
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const OrganizerCover = () => {
  // References for file inputs
  const coverPhotoInput = useRef(null);
  const profilePhotoInput = useRef(null);
  
  // State for images
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    name: "Nisal Gamage",
    friendCount: 389
  });
  
  // State for editing mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: profileData.name
  });
  
  // Handle cover photo change
  const handleCoverPhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCoverPhoto(imageUrl);
    }
  };
  
  // Handle profile photo change
  const handleProfilePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
    }
  };
  
  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Start editing profile
  const startEditingProfile = () => {
    setEditFormData({
      name: profileData.name
    });
    setIsEditingProfile(true);
  };
  
  // Save profile changes
  const saveProfileChanges = () => {
    setProfileData({
      ...profileData,
      name: editFormData.name
    });
    setIsEditingProfile(false);
  };
  
  // Cancel profile editing
  const cancelProfileEditing = () => {
    setIsEditingProfile(false);
  };

  return (
    <div className="oraganizer-profile">
      {/* Cover Photo */}
      <div className="cover-photo">
        <img 
          src={coverPhoto || "https://place-hold.it/1200x400"} 
          alt="Cover" 
          className="cover-image"
        />
        <div className="edit-cover-button" onClick={() => coverPhotoInput.current.click()}>
          <CameraIcon />
          <span>Edit cover photo</span>
          <input 
            ref={coverPhotoInput}
            type="file" 
            accept="image/*"
            onChange={handleCoverPhotoChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="profile-section">
        {/* Profile Picture */}
        <div className="profile-picture-container">
          <div 
            className="profile-picture" 
            onClick={() => profilePhotoInput.current.click()}
          >
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <CameraIcon />
              </div>
            )}
            <div className="profile-photo-overlay">
              <CameraIcon />
              <span>Update</span>
            </div>
            <input 
              ref={profilePhotoInput}
              type="file" 
              accept="image/*"
              onChange={handleProfilePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="profile-info">
          <div className="user-details">
            {isEditingProfile ? (
              <div className="edit-profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="edit-actions">
                  <button className="save-button" onClick={saveProfileChanges}>
                    <SaveIcon />
                    <span>Save</span>
                  </button>
                  <button className="cancel-button" onClick={cancelProfileEditing}>
                    <CloseIcon />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="user-name">{profileData.name}</h1>
                <p className="friend-count">{profileData.friendCount} friends</p>
                
                {/* Friend Avatars */}
                <div className="friend-avatars">
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <div 
                      key={index} 
                      className="friend-avatar"
                    ></div>
                  ))}
                  <div className="friend-avatar more-friends">
                    +
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          {!isEditingProfile && (
            <div className="action-buttons">
              <button className="edit-profile-button" onClick={startEditingProfile}>
                <EditIcon />
                <span>Edit profile</span>
              </button>
              <button className="more-options-button">
                <ChevronDownIcon />
              </button>
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
};

export default OrganizerCover;