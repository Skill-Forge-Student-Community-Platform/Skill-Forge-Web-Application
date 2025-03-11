// BadgeList.jsx (Recently Achieved Badges)
import React from "react";
import "./BadgeList.css";

const BadgeList = () => {
  return (
    <div className="badge-list">
      <h3>Recently Achieved Badges</h3>
      <ul>
        <li>React Master - Complete 5 React projects</li>
        <li>Team Player - Collaborate with 10 developers</li>
        <li>Problem Solver - Solve 50 algorithmic challenges</li>
      </ul>
    </div>
  );
};

export default BadgeList;