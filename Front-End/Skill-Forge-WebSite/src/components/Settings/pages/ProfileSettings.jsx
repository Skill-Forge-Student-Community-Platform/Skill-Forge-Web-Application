import { useState, useEffect, useRef } from 'react';
import SettingsLayout from './components/SettingsLayout';
import { FaCamera, FaGraduationCap, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import { userAPI, settingsAPI } from '../services/api';
import ProfileAvatar from '../../Home_page/Home_components/ProfileAvatar';
import { useAuthStore } from '../../../store/authStore';
import useUserProfile from '../../../hooks/useUserProfile';

const ProfileSettings = () => {
  const { user } = useAuthStore();
  const userId = user?._id;
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Use the hook to get user profile data
  const {
    role,
    fullName,
    getOccupation,
    getInstitutionName,
    getEducationDetails,
    getOrganizationDetails,
    isLoading: profileLoading
  } = useUserProfile(userId);

  // Fetch profile image URL when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getCurrentUser();
        const userData = response.data;
        setProfileImageUrl(userData.profileImageUrl || '');
      } catch (err) {
        setError('Failed to load profile image');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image file is too large. Please select an image under 5MB.');
      return;
    }

    try {
      setUploadLoading(true);
      setError('');

      // Create FormData object to send file to server
      const formData = new FormData();
      formData.append('profileImage', file);

      // Upload profile image
      const response = await settingsAPI.uploadProfileImage(formData);

      // Update local state with new image URL
      setProfileImageUrl(response.data.imageUrl);
      setSuccess('Profile image uploaded successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile image');
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  // Render role-specific information sections
  const renderRoleSpecificInfo = () => {
    if (profileLoading) {
      return (
        <div className="animate-pulse mt-6 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      );
    }

    if (role === 'student') {
      const education = getEducationDetails() || {};
      return (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="flex items-center text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
            <FaGraduationCap className="mr-2" /> Student Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Institution</p>
              <p className="text-base text-gray-900 dark:text-white">{getInstitutionName() || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Field of Study</p>
              <p className="text-base text-gray-900 dark:text-white">{education.fieldOfStudy || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Year of Study</p>
              <p className="text-base text-gray-900 dark:text-white">{education.yearOfStudy || 'Not specified'}</p>
            </div>
          </div>
          <div className="mt-4 flex items-start">
            <FaInfoCircle className="text-blue-500 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              To update your student details, please visit the Education section in your profile.
            </p>
          </div>
        </div>
      );
    } else if (role === 'organizer') {
      const organization = getOrganizationDetails() || {};
      return (
        <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="flex items-center text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
            <FaBuilding className="mr-2" /> Organization Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</p>
              <p className="text-base text-gray-900 dark:text-white">{getInstitutionName() || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</p>
              <p className="text-base text-gray-900 dark:text-white">{getOccupation() || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Type</p>
              <p className="text-base text-gray-900 dark:text-white">{organization.organizerType || 'Not specified'}</p>
            </div>
          </div>
          <div className="mt-4 flex items-start">
            <FaInfoCircle className="text-purple-500 dark:text-purple-400 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-purple-700 dark:text-purple-300">
              To update your organization details, please visit the Organization section in your profile.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <SettingsLayout title="Profile Settings">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900 dark:bg-opacity-20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
            {success}
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
          <h3 className="settings-user-name text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {fullName || user?.fullName || user?.Username || 'User Profile'}
          </h3>

          <div className="relative group mb-6">
            <div className={`w-32 h-32 mx-auto ${uploadLoading ? 'opacity-50' : ''}`}>
              {userId ? (
                <ProfileAvatar
                  userId={userId}
                  size="large"
                  showLevel={false}
                  staticImageUrl={profileImageUrl || user?.profileImageUrl}
                  className="cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={handleImageClick}
                  customAltText={`${fullName || user?.fullName || 'User'}'s profile`}
                />
              ) : (
                <div className="flex items-center justify-center h-32 w-32 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl font-bold cursor-pointer" onClick={handleImageClick}>
                  {fullName?.charAt(0)?.toUpperCase() || user?.Username?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}

              <div
                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={handleImageClick}
              >
                <FaCamera className="text-white text-xl" />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />

              {uploadLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-6">

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Max size: 5MB (JPEG, PNG, GIF, WEBP)
            </p>
          </div>
        </div>

        {/* Role-specific information */}
        {renderRoleSpecificInfo()}
      </div>
    </SettingsLayout>
  );
};

export default ProfileSettings;
