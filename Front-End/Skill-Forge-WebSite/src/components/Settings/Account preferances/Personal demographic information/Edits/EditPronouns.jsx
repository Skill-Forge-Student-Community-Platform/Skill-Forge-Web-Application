import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditPronouns() {
  const navigate = useNavigate()
  const [pronouns, setPronouns] = useState('')

  const pronounOptions = [
    'She/Her',
    'He/Him',
    'They/Them',
    'Prefer not to say'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving pronouns:', pronouns)
    navigate(-1)
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Edit pronouns</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <select
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className="form-input"
            >
              <option value="">Select pronouns</option>
              {pronounOptions.map(option => (
                <option key={option} value={option}>{option}</option>
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