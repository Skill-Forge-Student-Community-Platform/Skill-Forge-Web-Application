import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditIndustry() {
  const navigate = useNavigate()
  const [industry, setIndustry] = useState('Computer Software')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving industry:', industry)
    navigate(-1)
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Edit industry</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
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