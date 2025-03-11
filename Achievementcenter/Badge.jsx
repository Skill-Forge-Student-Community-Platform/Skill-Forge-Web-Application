// components/Badge.js
import React from 'react';
import './Badge.css';

const Badge = ({ icon, title, description, xp, timeAgo, color, achieved, progress, remaining }) => {
  return (
    <div className={`badge ${achieved ? 'achieved' : 'locked'} ${color || ''}`}>
      <div className="badge-icon">{icon}</div>
      <div className="badge-content">
        <div className="badge-title">{title}</div>
        <div className="badge-description">{description}</div>
        {achieved ? (
          <div className="badge-reward">{xp}</div>
        ) : (
          <div className="badge-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">{remaining}</div>
          </div>
        )}
      </div>
      {achieved && <div className="badge-time">{timeAgo}</div>}
      {!achieved && <div className="lock-icon">🔒</div>}
    </div>
  );
};

export default Badge;