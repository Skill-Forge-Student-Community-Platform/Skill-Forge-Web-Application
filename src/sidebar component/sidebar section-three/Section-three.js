import React, { useEffect, useState } from "react";
import "./Section-three.css";

const Section3 = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/achievementsData.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const { progress, bestScore } = data;

  return (
    <div className="achievements-container">
      {/* Progress Section */}
      <div className="progress-section">
        <h3 className="section-title">Progress</h3>
        <div className="progress-details">
          <span className="progress-text">{progress.percentage}% Progress</span>
          <span className="progress-text">
            {progress.lessonsDone} of {progress.totalLessons} lessons done
          </span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress.percentage}%` }}
          ></div>
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
          <div className="score-info">
            <p className="score-label">Average score</p>
            <p className="score-value">{bestScore.averageScore}</p>
            <p className="highest-score">
              Highest: {bestScore.highestScore}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section3;