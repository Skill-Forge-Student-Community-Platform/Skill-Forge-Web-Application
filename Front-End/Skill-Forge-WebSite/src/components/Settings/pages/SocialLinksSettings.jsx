import { useState, useEffect } from 'react';
import SettingsLayout from './components/SettingsLayout';
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaShareAlt
} from 'react-icons/fa';
import { settingsAPI, userAPI } from '../services/api';

const SocialLinksSettings = () => {
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    twitter: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user's social links when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setInitialLoading(true);
        const response = await userAPI.getCurrentUser();
        if (response.data && response.data.socialLinks) {
          setSocialLinks(response.data.socialLinks);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your social links. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Call API to update social links
      await settingsAPI.updateSocialLinks({ socialLinks });
      setSuccess('Social links updated successfully!');
    } catch (err) {
      console.error('Error updating social links:', err);
      setError(err.response?.data?.message || 'Failed to update social links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socialInputs = [
    {
      name: 'linkedin',
      label: 'LinkedIn Profile',
      icon: <FaLinkedin />,
      placeholder: 'https://linkedin.com/in/username'
    },
    {
      name: 'github',
      label: 'GitHub Profile',
      icon: <FaGithub />,
      placeholder: 'https://github.com/username'
    },
    {
      name: 'twitter',
      label: 'Twitter Profile',
      icon: <FaTwitter />,
      placeholder: 'https://twitter.com/username'
    },
    {
      name: 'website',
      label: 'Personal Website',
      icon: <FaGlobe />,
      placeholder: 'https://www.example.com'
    }
  ];

  if (initialLoading) {
    return (
      <SettingsLayout title="Social Links">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-700 dark:text-gray-300">Loading your social links...</span>
          </div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Social Links">
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

        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mr-3 transition-transform duration-300 ease-in-out transform hover:scale-110">
            <FaShareAlt className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Connect Your Social Profiles</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {socialInputs.map((input) => (
            <div key={input.name} className="group">
              <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {input.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                  {input.icon}
                </div>
                <input
                  type="url"
                  id={input.name}
                  name={input.name}
                  value={socialLinks[input.name]}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-300"
                  placeholder={input.placeholder}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Links'}
            </button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default SocialLinksSettings;
