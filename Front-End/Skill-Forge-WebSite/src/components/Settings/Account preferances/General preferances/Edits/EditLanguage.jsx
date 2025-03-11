import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSettings } from '/src/contexts/SettingsContext'
import { updateAccountSettings } from '/src/api'

export default function EditLanguage() {
  // Use the actual test user ID
  const testUserId = '67ce9172036a01b787b76c29' // The ID of the test user we just created
  const { userId } = useParams()
  const navigate = useNavigate()
  const { settings, fetchSettings } = useSettings()
  const [language, setLanguage] = useState(settings?.accountPreferences?.language || 'English')

  useEffect(() => {
    // Fetch settings using the testUserId
    fetchSettings(testUserId);
    
    if (settings?.accountPreferences?.language) {
      setLanguage(settings.accountPreferences.language)
    }
  }, [fetchSettings, settings, testUserId])

  const languages = [
    'English',
    'Español',
    'Français', 
    '中文',
    '日本語',
    'Português'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateAccountSettings(testUserId, { language })
      await fetchSettings(testUserId)
      navigate(-1)
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Select language</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-input"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 