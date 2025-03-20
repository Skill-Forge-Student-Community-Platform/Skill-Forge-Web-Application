import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayout from '../components/SettingsLayout';
import { FaExclamationTriangle, FaTrash, FaLock } from 'react-icons/fa';
import { settingsAPI } from '../services/api';

const DeleteAccountSettings = () => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the API to delete the account
      await settingsAPI.deleteAccount({ password });
      
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show success step
      setLoading(false);
      setStep(3);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
      console.error('Error deleting account:', err);
    }
  };

  const handleReturnHome = () => {
    navigate('/login');
  };

  return (
    <SettingsLayout title="Delete Account">
      <div className="settings-section">
        {step === 1 && (
          <div className="delete-account-step">
            <div className="warning-box">
              <div className="warning-header">
                <FaExclamationTriangle className="warning-icon" />
                <div>
                  <h4 className="warning-title">This action cannot be undone</h4>
                  <p className="warning-text">
                    Deleting your account will permanently remove all your data, including:
                  </p>
                </div>
              </div>
              
              <ul className="warning-list">
                <li>All your personal information</li>
                <li>Your activity history and preferences</li>
                <li>All files and documents you've uploaded</li>
                <li>Access to any premium features you've purchased</li>
              </ul>
              
              <p className="warning-text">
                Make sure you have backed up any important data before proceeding.
                Once your account is deleted, we cannot recover any information.
              </p>
            </div>
            
            <div className="delete-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="delete-button"
                onClick={handleNextStep}
              >
                Continue to Verification
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="delete-account-step">
            <h3 className="verification-title">
              <FaLock className="verification-icon" /> Verify Your Identity
            </h3>
            
            <p className="verification-text">
              For security purposes, please enter your password and confirm your decision
              by typing "DELETE" in the confirmation field.
            </p>
            
            <form onSubmit={handleDeleteAccount} className="verification-form">
              <div className="form-group">
                <label htmlFor="password">Your Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmText">Type "DELETE" to confirm</label>
                <input
                  type="text"
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="form-input"
                  placeholder="DELETE"
                  required
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="delete-actions">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={handlePreviousStep}
                >
                  Go Back
                </button>
                <button 
                  type="submit" 
                  className="delete-confirm-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Permanently Delete Account'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {step === 3 && (
          <div className="delete-account-step">
            <div className="success-message">
              <FaTrash className="success-icon" />
              <h3 className="success-title">Account Deletion Successful</h3>
              <p className="success-text">
                Your account has been permanently deleted. All your data has been removed
                from our systems.
              </p>
              <p className="success-text">
                Thank you for using our service. We're sorry to see you go.
              </p>
              <button 
                type="button" 
                className="logout-button"
                onClick={handleReturnHome}
              >
                Return to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
};

export default DeleteAccountSettings; 