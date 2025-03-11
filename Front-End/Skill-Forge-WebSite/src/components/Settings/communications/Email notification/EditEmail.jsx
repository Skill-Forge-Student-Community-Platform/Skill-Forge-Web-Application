import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditEmail() {
  const navigate = useNavigate()
  const [emailSettings, setEmailSettings] = useState({
    newsAndUpdates: true,
    securityAlerts: true,
    accountActivity: true,
    recommendations: false
  })

  const handleChange = (setting) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  // Save the settings to the backend

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Email notifications</h2>
        <p className="section-description">
          Choose what types of emails you'd like to receive
        </p>

        <div className="edit-form">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={emailSettings.newsAndUpdates}
                onChange={() => handleChange('newsAndUpdates')}
                className="checkbox-input"
              />
              News and updates
            </label>
            <div className="setting-description">
              Platform news, updates, and new features
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={emailSettings.securityAlerts}
                onChange={() => handleChange('securityAlerts')}
                className="checkbox-input"
              />
              Security alerts
            </label>
            <div className="setting-description">
              Important notifications about your account security
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={emailSettings.accountActivity}
                onChange={() => handleChange('accountActivity')}
                className="checkbox-input"
              />
              Account activity
            </label>
            <div className="setting-description">
              Sign-in notifications and account changes
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={emailSettings.recommendations}
                onChange={() => handleChange('recommendations')}
                className="checkbox-input"
              />
              Recommendations
            </label>
            <div className="setting-description">
              Personalized recommendations based on your interests
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 