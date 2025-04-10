import React, { useState, useEffect } from 'react';
import useThemeToggle from '../../hooks/useThemeToggle';
import './QuickStats.css';

const QuickStats = ({ userId }) => {
  const { isDarkMode } = useThemeToggle();
  // Placeholder data (in a real app, this would come from an API)
  const [stats, setStats] = useState({
    badgesEarned: 0,
    eventsAttended: 0,
    xpEarned: 0,
    overallProgress: 0
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        badgesEarned: 8,
        eventsAttended: 12,
        xpEarned: 1250,
        overallProgress: 65
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  return (
    <div className={`quick-stats ${isDarkMode ? 'dark' : 'light'}`}>
      <h3 className="stats-header">
        <span className="stats-icon">📊</span>
        Achievement Stats
      </h3>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{stats.badgesEarned}</div>
          <div className="stat-label">Badges Earned</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.eventsAttended}</div>
          <div className="stat-label">Events Attended</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{stats.xpEarned.toLocaleString()}</div>
          <div className="stat-label">XP Earned</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{stats.overallProgress}%</div>
          <div className="stat-label">Overall Progress</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stats.overallProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="activity-summary">
        <h4>Activity Summary</h4>
        <div className="activity-item">
          <span className="activity-day">Today</span>
          <span className="activity-value">+50 XP</span>
        </div>
        <div className="activity-item">
          <span className="activity-day">This Week</span>
          <span className="activity-value">+320 XP</span>
        </div>
        <div className="activity-item">
          <span className="activity-day">This Month</span>
          <span className="activity-value">+875 XP</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
