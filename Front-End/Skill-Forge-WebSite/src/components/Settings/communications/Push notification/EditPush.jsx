import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditPush() {
  const navigate = useNavigate()
  const [pushSettings, setPushSettings] = useState({
    messages: true,
    reminders: true,
    updates: true,
    newFeatures: false
  })

  const handleChange = (setting) => {
    setPushSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Push notifications</h2>
        <p className="section-description">
          Choose which notifications you'd like to receive on your device
        </p>

        <div className="edit-form">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pushSettings.messages}
                onChange={() => handleChange('messages')}
                className="checkbox-input"
              />
              Messages
            </label>
            <div className="setting-description">
              Get notified when you receive new messages
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pushSettings.reminders}
                onChange={() => handleChange('reminders')}
                className="checkbox-input"
              />
              Reminders
            </label>
            <div className="setting-description">
              Important reminders about your tasks and deadlines
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pushSettings.updates}
                onChange={() => handleChange('updates')}
                className="checkbox-input"
              />
              Platform updates
            </label>
            <div className="setting-description">
              Stay informed about platform changes and updates
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pushSettings.newFeatures}
                onChange={() => handleChange('newFeatures')}
                className="checkbox-input"
              />
              New features
            </label>
            <div className="setting-description">
              Be the first to know about new features and improvements
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}