import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SessionHistory() {
  const navigate = useNavigate()

  const sessions = [
    {
      device: "Windows PC",
      browser: "Chrome",
      location: "New York, United States",
      time: "Active now",
      current: true
    },
    {
      device: "iPhone",
      browser: "Safari",
      location: "Boston, United States",
      time: "2 hours ago",
      current: false
    },
    {
      device: "MacBook",
      browser: "Firefox",
      location: "Miami, United States",
      time: "Yesterday",
      current: false
    }
  ]

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h2 className="section-title">Where you're signed in</h2>
        <p className="section-description">
          See your active sessions and sign out if you don't recognize a device.
        </p>

        <div className="sessions-list">
          {sessions.map((session, index) => (
            <div key={index} className="session-item">
              <div className="session-info">
                <div className="session-device">
                  <strong>{session.device}</strong>
                  {session.current && <span className="current-device">Current device</span>}
                </div>
                <div className="session-details">
                  {session.browser} • {session.location}
                </div>
                <div className="session-time">{session.time}</div>
              </div>
              {!session.current && (
                <button className="btn-secondary">Sign out</button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions sessions-actions">
          <button className="btn-primary" onClick={() => navigate(-1)}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}