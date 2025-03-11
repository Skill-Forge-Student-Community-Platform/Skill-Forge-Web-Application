import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditAge() {
  const navigate = useNavigate()
  const [age, setAge] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving age:', age)
    navigate(-1)
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Edit age</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-input"
              min="13"
              max="120"
              placeholder="Enter your age"
            />
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