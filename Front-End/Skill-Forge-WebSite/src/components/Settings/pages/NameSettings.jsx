import { useState, useEffect } from 'react';
import SettingsLayout from './components/SettingsLayout';
import { FaUser } from 'react-icons/fa';
import { userAPI, settingsAPI } from '../services/api';
import ProfileAvatar from '../../Home_page/Home_components/ProfileAvatar';
import { useAuthStore } from '../../../store/authStore';

const NameSettings = () => {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState({
    fullName: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data from API when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getCurrentUser();
        const user = response.data;

        setUserData({
          fullName: user.fullName || '',
          username: user.username || ''
        });
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call the API to update user data
      await settingsAPI.updateName(userData);
      setSuccess('Name updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update name');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsLayout title="Change Name">
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

        <div className="flex items-start mb-8">
          <div className="mr-4 w-16 h-16 flex-shrink-0">
            {user?.id ? (
              <ProfileAvatar
                userId={user.id}
                size="medium"
                showLevel={false}
                staticImageUrl={user?.profileImageUrl || null}
                className="transition-all duration-300 hover:scale-105"
                customAltText={`${userData.fullName || 'User'}'s profile`}
              />
            ) : (
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xl font-bold">
                {userData.fullName?.charAt(0)?.toUpperCase() || userData.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Update your profile information visible to other users
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Choose a username"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default NameSettings;
