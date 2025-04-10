import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaEdit, FaMapMarkerAlt, FaGraduationCap, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import ProfileAvatar from '../../Home_page/Home_components/ProfileAvatar';

const Studentcover = ({ userId, isOwner = false, profileData = {} }) => {
  const navigate = useNavigate();
  const coverPhotoInput = useRef(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Default cover image
  const defaultCoverImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

  const handleCoverPhotoClick = () => {
    if (isOwner && coverPhotoInput.current) {
      coverPhotoInput.current.click();
    }
  };

  const handleCoverPhotoChange = async (e) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      // Validate file
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

        // Create a URL for the image
        const imageUrl = URL.createObjectURL(file);
        setCoverPhoto(imageUrl);

        // In a real app, you would upload to server here
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

  const handleConnect = () => {
    alert('Connection request sent!');
  };

  const handleMessage = () => {
    navigate(`/messages/new?userId=${userId}`);
  };

  return (
    <div className="student-cover">
      {/* Cover Photo Section */}
      <div className="relative w-full h-64 bg-gradient-to-r from-blue-400 to-indigo-500 overflow-hidden">
        {(coverPhoto || profileData.coverImage) && (
          <img
            src={coverPhoto || profileData.coverImage || defaultCoverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}

        {isOwner && (
          <div
            className="absolute bottom-3 right-3 bg-white rounded-md p-2 flex items-center gap-1 shadow-sm cursor-pointer hover:bg-gray-100"
            onClick={handleCoverPhotoClick}
          >
            <FaCamera className="text-gray-600" />
            <span className="text-sm font-medium">Change Cover</span>
            <input
              ref={coverPhotoInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverPhotoChange}
              className="hidden"
            />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-white rounded-full border-t-transparent"></div>
            <span className="text-white ml-2">Uploading...</span>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center">
          {/* Profile Picture */}
          <div className="relative -mt-16 md:-mt-20 z-10 mx-auto md:mx-0">
            <ProfileAvatar
              userId={userId}
              size="large"
              showLevel={false}
              staticImageUrl={profileData.profileImage}
              customAltText={`${profileData.name || 'Student'}'s profile`}
            />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row justify-between w-full mt-4 md:mt-0 md:ml-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {profileData.name || 'Student'}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1 text-gray-600">
                <div className="flex items-center justify-center md:justify-start">
                  <FaGraduationCap className="text-blue-500 mr-1" />
                  <span className="text-sm">Student</span>
                </div>

                {profileData.location && (
                  <div className="flex items-center justify-center md:justify-start">
                    <FaMapMarkerAlt className="text-red-500 mr-1" />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                )}

                <div className="flex items-center justify-center md:justify-start mt-1 md:mt-0">
                  <span className="text-sm font-medium">
                    {profileData.friendCount || 0} connections
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center md:justify-end gap-2 mt-4 md:mt-0">
              {isOwner ? (
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  onClick={() => navigate('/profile/edit')}
                >
                  <FaEdit className="text-sm" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    onClick={handleConnect}
                  >
                    <FaUserPlus className="text-sm" />
                    <span>Connect</span>
                  </button>

                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={handleMessage}
                  >
                    <FaEnvelope className="text-sm" />
                    <span>Message</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-100 text-red-700 p-2 text-center">
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="ml-2 text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default Studentcover;
