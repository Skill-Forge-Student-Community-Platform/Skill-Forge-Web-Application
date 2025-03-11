import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '/src/contexts/SettingsContext'
import { updateUserName } from '/src/api'

export default function EditName() {
  const testUserId = '67ce9172036a01b787b76c29' 
  const navigate = useNavigate()
  const { settings, fetchSettings } = useSettings()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Fetch settings using the testUserId on component load
    fetchSettings(testUserId);
    
    // Update local state if settings change
    if (settings?.user?.name) {
      setName(settings.user.name)
    }
  }, [fetchSettings, settings?.user?.name, testUserId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name cannot be empty')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      console.log('Updating name to:', name)
      console.log('Using user ID:', testUserId)
      
      // Make the API call to update the name
      const result = await updateUserName(testUserId, { name })
      console.log('Update result:', result)
      
      // Refresh the settings data
      await fetchSettings(testUserId)
      
      // Show success message
      setSuccess(true)
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate(-1)
      }, 1500)
    } catch (error) {
      console.error('Update failed:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update name. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Edit name</h2>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>Name updated successfully!</div>}
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}