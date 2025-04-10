// components/Badge.js
import React from 'react';
import useThemeToggle from '../../hooks/useThemeToggle';
import './Badge.css';

const Badge = ({ icon, title, description, xp, timeAgo, color, achieved, progress, remaining }) => {
  const { isDarkMode } = useThemeToggle();

  return (
    <div className={`badge ${achieved ? 'achieved' : 'locked'} ${color || ''} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="badge-icon-container">
        <div className="badge-icon">{icon}</div>
      </div>
      <div className="badge-content">
        <div className="badge-header">
          <div className="badge-title">{title}</div>
          {achieved && <div className="badge-time">{timeAgo}</div>}
        </div>
        <div className="badge-description">{description}</div>

        {achieved ? (
          <div className="badge-reward">
            <span className="xp-icon">⚡</span> {xp}
          </div>
        ) : (
          <div className="badge-progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">{remaining}</div>
          </div>
        )}
      </div>
      {!achieved && <div className="lock-icon">🔒</div>}
    </div>
  );
};

export default Badge;
