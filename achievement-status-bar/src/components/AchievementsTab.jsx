import React from "react";
import "./AchievementsTab.css";

const AchievementsTab = () => {
  return (
    <div className="achievements-container">
      {/* Progress Section */}
      <div className="progress-section">
        <h3 className="section-title">Progress</h3>
        <div className="progress-details">
          <span className="progress-text">70% Progress</span>
          <span className="progress-text">6 of 8 lessons done</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: "70%" }}></div>
        </div>
      </div>

      {/* Best Score Section */}


      <div className="best-score-section">
        <h3 className="section-title">Best Score</h3>
        <div className="score-details">
          <div className="score-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="icon-svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="score-text">Average score</p>
            <p className="score-value">72</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsTab;
