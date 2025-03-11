import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSettingsMutation } from '/src/hooks/useSettingsMutation'
import { updateAccountSettings } from '/src/api'
import { useSettings } from '/src/contexts/SettingsContext'

export default function EditAutoplay() {
  // Use the actual test user ID
  const testUserId = '67ce9172036a01b787b76c29' // The ID of the test user we just created
  const { userId } = useParams() // The ID of the user whose settings we are editing
  const navigate = useNavigate()
  const { settings } = useSettings()
  const { mutate, loading } = useSettingsMutation(updateAccountSettings)
  const [autoplay, setAutoplay] = useState(settings?.accountPreferences?.autoplay || false)

  const handleChange = async (e) => {
    const newValue = e.target.checked
    setAutoplay(newValue)
    await mutate(testUserId, { autoplay: newValue })
    navigate(-1)
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Autoplay videos</h2>
        <div className="edit-form">
          <div className="form-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={handleChange}
                className="toggle-input"
              />
              <span className="toggle-text">
                {autoplay ? 'On' : 'Off'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
} 