import React, { useState, useRef } from 'react';
// Removed CSS import as we're using Tailwind directly

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

const Studentcover = () => {
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
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-gray-100">
      {/* Cover Photo */}
      <div className="relative w-full h-64 bg-gray-300 overflow-hidden rounded-b-lg">
        <img
          src={coverPhoto || "https://place-hold.it/1200x400"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute bottom-3 right-3 bg-white rounded-md p-2 flex items-center gap-1 shadow-sm cursor-pointer hover:bg-gray-100"
          onClick={() => coverPhotoInput.current.click()}
        >
          <CameraIcon />
          <span className="text-sm font-medium">Edit cover photo</span>
          <input
            ref={coverPhotoInput}
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row p-0 px-4 relative">
        {/* Profile Picture */}
        <div className="relative -mt-16 md:-mt-20 z-10">
          <div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative cursor-pointer"
            onClick={() => profilePhotoInput.current.click()}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <CameraIcon />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-200 hover:opacity-100">
              <CameraIcon />
              <span className="mt-1">Update</span>
            </div>
            <input
              ref={profilePhotoInput}
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row justify-between w-full mt-2 md:mt-6 md:ml-4">
          <div className="user-details">
            {isEditingProfile ? (
              <div className="bg-white p-4 rounded-lg shadow-sm mt-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded text-base"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
                    onClick={saveProfileChanges}
                  >
                    <SaveIcon className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded bg-gray-200 text-gray-600 font-medium hover:bg-gray-300"
                    onClick={cancelProfileEditing}
                  >
                    <CloseIcon className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold leading-9">{profileData.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{profileData.friendCount} friends</p>

                {/* Friend Avatars */}
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full bg-gray-300 border-2 border-white ${index > 0 ? '-ml-2' : ''}`}
                    ></div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white -ml-2 flex items-center justify-center text-white text-xs">
                    +
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {!isEditingProfile && (
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-200 w-44 h-12 hover:bg-gray-300"
                onClick={startEditingProfile}
              >
                <EditIcon className="w-4 h-4" />
                <span>Edit profile</span>
              </button>
              <button className="flex items-center justify-center rounded-md bg-gray-200 w-12 h-12 hover:bg-gray-300">
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Studentcover;
