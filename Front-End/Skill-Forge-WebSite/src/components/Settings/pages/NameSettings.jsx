import { useState, useEffect } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { userAPI, settingsAPI } from '../services/api';

const NameSettings = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
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
          firstName: user.firstName || '',
          lastName: user.lastName || '',
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
      <div className="settings-section">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a username"
            />
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default NameSettings; 