import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditPassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [requireAllDevices, setRequireAllDevices] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Changing password:', formData)
    navigate(-1)
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Change password</h2>
        <p className="section-description">
          Create a new password that is at least 8 characters long.
        </p>
        
        <div className="password-info">
          <span className="info-icon">🛡️</span>
          <a href="#" className="info-link">What makes a strong password?</a>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="currentPassword">
              Type your current password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              Type your new password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-input"
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Retype your new password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={requireAllDevices}
                onChange={(e) => setRequireAllDevices(e.target.checked)}
                className="checkbox-input"
              />
              Require all devices to sign in with new password
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Password
            </button>
          </div>

          <div className="forgot-password">
            <a href="/settings/security/forgot-password">Forgot Password</a>
          </div>
        </form>
      </div>
    </div>
  )
} 