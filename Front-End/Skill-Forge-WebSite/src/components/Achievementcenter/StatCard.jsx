// components/StatCard.js
import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, title, value, change, subtext, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-header">
          <span className="stat-title">{title}</span>
          <span className={`stat-change ${color}`}>
            <span className="arrow">↑</span> {change}
          </span>
        </div>
        <div className="stat-value">{value}</div>
        <div className="progress-bar">
          <div className={`progress-fill ${color}`}></div>
        </div>
        <div className="stat-subtext">{subtext}</div>
      </div>
    </div>
  );
};

export default StatCard;