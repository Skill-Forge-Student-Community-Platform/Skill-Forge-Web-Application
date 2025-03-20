import { useState, useEffect } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { 
  FaLinkedin, 
  FaGithub, 
  FaTwitter, 
  FaGlobe 
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
        <div className="settings-section">
          <div className="loading-screen">Loading your social links...</div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Social Links">
      <div className="settings-section">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="social-links-form">
          {socialInputs.map((input) => (
            <div key={input.name} className="form-group">
              <label htmlFor={input.name}>{input.label}</label>
              <div className="social-input-group">
                <span className="social-icon">{input.icon}</span>
                <input
                  type="url"
                  id={input.name}
                  name={input.name}
                  value={socialLinks[input.name]}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={input.placeholder}
                />
              </div>
            </div>
          ))}
          
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Links'}
          </button>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default SocialLinksSettings; 