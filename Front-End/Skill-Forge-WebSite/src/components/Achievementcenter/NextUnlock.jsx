import React from "react";
import { FaRobot, FaCloud, FaDatabase } from "react-icons/fa";
import "./NextUnlock.css";

const NextUnlock = () => {
  const badges = [
    {
      id: 1,
      icon: <FaRobot className="badge-icon" />,
      title: "AI Pioneer",
      description: "Build 3 AI-powered applications",
      progress: 66,
      remaining: "1 more app to unlock",
    },
    {
      id: 2,
      icon: <FaCloud className="badge-icon" />,
      title: "Cloud Expert",
      description: "Deploy 10 applications to cloud platforms",
      progress: 80,
      remaining: "2 more deployments to unlock",
    },
    {
      id: 3,
      icon: <FaDatabase className="badge-icon" />,
      title: "Data Wizard",
      description: "Complete 5 data science projects",
      progress: 60,
      remaining: "2 more projects to unlock",
    },
  ];

  return (
    <div className="next-unlock-container">
      <div className="next-unlock-header">
        <h3>Next to Unlock</h3>
      </div>
      <div className="next-unlock-cards">
        {badges.map((badge) => (
          <div key={badge.id} className="unlock-card">
            <div className="icon-container">{badge.icon}</div>
            <div className="details">
              <p className="badge-title">{badge.title}</p>
              <p className="badge-description">{badge.description}</p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${badge.progress}%` }}
                ></div>
              </div>
              <p className="remaining">{badge.remaining}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextUnlock;
