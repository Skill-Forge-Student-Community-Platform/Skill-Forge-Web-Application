import { useState, useEffect } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { FaClock } from 'react-icons/fa';
import { settingsAPI } from '../services/api';

const LastLoginSettings = () => {
  const [lastLogin, setLastLogin] = useState({
    timestamp: new Date().toISOString(),
    device: 'Unknown',
    location: 'Unknown'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLastLogin = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getLastLogin();
        setLastLogin(response.data);
      } catch (err) {
        console.error('Error fetching last login data:', err);
        setError('Failed to load last login information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLastLogin();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <SettingsLayout title="Last Login">
        <div className="settings-section">
          <div className="loading-screen">Loading last login information...</div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Last Login">
      <div className="settings-section">
        {error && <div className="error-message">{error}</div>}
        
        <div className="last-login-card">
          <div className="last-login-header">
            <FaClock className="last-login-icon" />
            <h3 className="last-login-title">Last Login Activity</h3>
          </div>
          
          <div className="last-login-details">
            <div className="detail-group">
              <label>Time</label>
              <p>{formatDate(lastLogin.timestamp)}</p>
            </div>
            
            <div className="detail-group">
              <label>Device</label>
              <p>{lastLogin.device}</p>
            </div>
            
            <div className="detail-group">
              <label>Location</label>
              <p>{lastLogin.location}</p>
            </div>
          </div>

          <div className="login-security-note">
            <p>
              If you notice any suspicious activity, please change your password immediately 
              and contact our support team.
            </p>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default LastLoginSettings; 