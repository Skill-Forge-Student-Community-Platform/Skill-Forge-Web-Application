import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditGender() {
  const navigate = useNavigate()
  const [gender, setGender] = useState('')

  const genderOptions = [
    'Female',
    'Male',
    'Non-binary',
    'Prefer not to say'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving gender:', gender)
    navigate(-1)
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Edit gender</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="form-input"
            >
              <option value="">Select gender</option>
              {genderOptions.map(option => (
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