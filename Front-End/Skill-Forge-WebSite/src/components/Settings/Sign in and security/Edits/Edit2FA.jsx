import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Edit2FA() {
  const navigate = useNavigate()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showMethodPopup, setShowMethodPopup] = useState(false)

  const handleToggle = (e) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setShowMethodPopup(true)
    } else {
      setTwoFactorEnabled(false)
    }
  }

  const handleMethodSelect = (method) => {
    setTwoFactorEnabled(true)
    setShowMethodPopup(false)
    console.log('Selected 2FA method:', method)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving 2FA settings:', twoFactorEnabled)
    navigate(-1)
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Two-step verification</h2>
        <p className="section-description">
          Add an extra layer of security to your account by requiring a verification code in addition to your password.
        </p>
        
        <div className="password-info">
          <span className="info-icon">🔒</span>
          <a href="#" className="info-link">Learn more about two-step verification</a>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleToggle}
                className="checkbox-input"
              />
              Enable two-step verification
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>

        {showMethodPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3 className="popup-title">Choose verification method</h3>
              <p className="popup-description">
                How would you like to receive verification codes?
              </p>
              <div className="popup-options">
                <button 
                  className="btn-secondary method-button"
                  onClick={() => handleMethodSelect('mobile')}
                >
                  <span className="method-icon">📱</span>
                  <div className="method-info">
                    <div className="method-title">Mobile app</div>
                    <div className="method-description">
                      Use an authenticator app on your phone
                    </div>
                  </div>
                </button>
                <button 
                  className="btn-secondary method-button"
                  onClick={() => handleMethodSelect('email')}
                >
                  <span className="method-icon">✉️</span>
                  <div className="method-info">
                    <div className="method-title">Email</div>
                    <div className="method-description">
                      Receive codes via email
                    </div>
                  </div>
                </button>
              </div>
              <button 
                className="btn-secondary cancel-button"
                onClick={() => setShowMethodPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 