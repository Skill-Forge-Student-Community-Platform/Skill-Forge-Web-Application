import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SettingsLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isSubPage = location.pathname.split('/').length > 3

  return (
    <div className="settings-container">
      <div className="settings-main">
        <div className="settings-header">
          {/* Removed image reference that was causing problems */}
        </div>
        <div className="settings-content">
          {isSubPage && (
            <button 
              className="back-button" 
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}