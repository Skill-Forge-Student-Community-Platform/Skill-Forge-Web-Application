import React from "react";
import "./AchievementsBar.css"; // Import the CSS file for styling

const AchievementsBar = () => {
  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <span className="achievements-title">Achievements</span>
        <button className="more-options">...</button>
      </div>
      <div className="achievements-cards">
        <div className="achievement-card">
          <span className="achievement-icon">🌟</span>
          <div className="achievement-info">
            <p className="achievement-title">70%+ Progress</p>
            <p className="achievement-subtitle">6 of 9 sessions done</p>
          </div>
        </div>
        <div className="achievement-card">
          <span className="achievement-icon">📶</span>
          <div className="achievement-info">
            <p className="achievement-title">Best Score</p>
            <p className="achievement-subtitle">Average score 9.2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsBar;