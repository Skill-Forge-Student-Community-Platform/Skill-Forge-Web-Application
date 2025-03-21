import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaClock, FaShareAlt, FaBell, FaShieldAlt } from 'react-icons/fa';
import { useAuthStore } from '../../../store/authStore';
import ProfileAvatar from '../../Home_page/Home_components/ProfileAvatar';

const AccountSettings = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-dark"></div>
        <span className="ml-3 text-gray-700 dark:text-gray-300">Loading account information...</span>
      </div>
    );
  }

  const settingsOptions = [
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Update your profile picture and bio',
      icon: <FaUser />
    },
    {
      id: 'name',
      title: 'Change Name',
      description: 'Update your first and last name',
      icon: <FaUser />
    },
    {
      id: 'email',
      title: 'Change Email',
      description: 'Update your email address',
      icon: <FaEnvelope />
    },
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update your password for security',
      icon: <FaLock />
    },
    {
      id: 'last-login',
      title: 'Last Login',
      description: 'View your recent login activity',
      icon: <FaClock />
    },
    {
      id: 'social',
      title: 'Social Links',
      description: 'Connect your social media accounts',
      icon: <FaShareAlt />
    },
    {
      id: 'notifications',
      title: 'Email & Notifications',
      description: 'Manage your notification preferences',
      icon: <FaBell />
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="flex items-center">
          <div className="mr-4 w-16 h-16 flex-shrink-0 overflow-hidden rounded-full">
            {user?._id ? (
              <ProfileAvatar
                userId={user._id}
                size="medium"
                showLevel={false}
                showMembershipTag={false}
                className="w-full h-full"
                staticImageUrl={user?.profileImageUrl || null}
              />
            ) : (
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xl font-bold">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user?.fullName || user?.username || 'User'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{user?.email || 'No email available'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.role || 'Member'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {settingsOptions.map(option => (
          <Link
            key={option.id}
            to={`../${option.id}`}
            className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transform hover:translate-y-[-2px]"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 transition-transform duration-300 ease-in-out transform group-hover:scale-110">
              {option.icon}
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-800 dark:text-white">{option.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <Link
          to="../delete-account"
          className="flex items-start p-4 rounded-lg border border-red-200 dark:border-red-900 transition-all duration-300 hover:shadow-md hover:border-red-500 transform hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 transition-transform duration-300 ease-in-out transform hover:scale-110">
            <FaShieldAlt />
          </div>
          <div className="ml-4">
            <h4 className="font-medium text-red-600 dark:text-red-400">Delete Account</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account and all data</p>          </div>        </Link>      </div>    </div>  );};export default AccountSettings;
