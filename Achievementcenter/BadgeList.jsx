// components/BadgeList.js
import React from 'react';
import Badge from './Badge';
import './BadgeList.css';

const BadgeList = ({ achievedBadges, nextBadges }) => {
  return (
    <div className="badge-list-container">
      <div className="badge-list-header">
        <div className="badge-list-title">
          <span className="badge-icon">🏅</span> Recently Achieved Badges
        </div>
        <button className="view-all-button">
          View All Badges <span className="arrow-icon">→</span>
        </button>
      </div>

      <div className="badge-sections">
        <div className="badge-section">
          <div className="section-header">
            <span className="status-indicator unlocked">✓ Unlocked</span>
          </div>
          <div className="badges-grid">
            {achievedBadges.map((badge) => (
              <Badge key={badge.id} {...badge} achieved={true} />
            ))}
          </div>
        </div>

        <div className="badge-section">
          <div className="section-header">
            <span className="status-indicator locked">🔒 Next to Unlock</span>
          </div>
          <div className="badges-grid">
            {nextBadges.map((badge) => (
              <Badge key={badge.id} {...badge} achieved={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeList;