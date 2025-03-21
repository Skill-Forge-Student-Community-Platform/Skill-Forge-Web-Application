import React from 'react';
import './StatsCard.css'; // You'll need to create this CSS file

const StatsCard = () => {
  const stats = [
    {
      icon: "🏆",
      value: "8.7M",
      label: "Total Users",
      change: "+12% vs last month"
    },
    {
      icon: "📈",
      value: "$4.2M",
      label: "Revenue",
      change: "+8.5% vs last month"
    },
    {
      icon: "👥",
      value: "24.1K",
      label: "Daily Active Users",
      change: "+5.3% vs last month"
    },
    {
      icon: "⏱️",
      value: "18.3",
      label: "Avg. Session (min)",
      change: "+2.1% vs last month"
    }
  ];

  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-icon">🏅</span>
        <h3 className="stats-title">Quick Stats</h3>
      </div>
      <div className="stats-list">
        {stats.map((stat, index) => (
          <div key={index} className="quick-stat">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-details">
              <div className="stat-label">{stat.label}</div>
              {stat.change && <div className="stat-change">{stat.change}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;