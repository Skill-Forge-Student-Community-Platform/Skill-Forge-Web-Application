import React from "react";
import { FaFire, FaTrophy, FaBullseye, FaBolt } from "react-icons/fa";
import "./StatsOverview.css";

const StatsOverview = () => {
  return (
    <div className="stats-overview">
      {/* Total XP */}
      <div className="stat-card">
        <FaFire className="stat-icon" style={{ color: "#FF6B00" }} />
        <p>Total XP</p>
        <h3>12,450</h3>
        <p className="stat-change">+2,450</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: "75%", backgroundColor: "#FF6B00" }}></div>
        </div>
      </div>

      {/* Global Rank */}
      <div className="stat-card">
        <FaTrophy className="stat-icon" style={{ color: "#C026D3" }} />
        <p>Global Rank</p>
        <h3>#156</h3>
        <p className="stat-change">Top 1%</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: "90%", backgroundColor: "#C026D3" }}></div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="stat-card">
        <FaBullseye className="stat-icon" style={{ color: "#1E90FF" }} />
        <p>Win Rate</p>
        <h3>76%</h3>
        <p className="stat-change">+12%</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: "76%", backgroundColor: "#1E90FF" }}></div>
        </div>
      </div>

      {/* Streak */}
      <div className="stat-card">
        <FaBolt className="stat-icon" style={{ color: "#FFA500" }} />
        <p>Streak</p>
        <h3>7 Days</h3>
        <p className="stat-change">Personal Best</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: "50%", backgroundColor: "#FFA500" }}></div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
