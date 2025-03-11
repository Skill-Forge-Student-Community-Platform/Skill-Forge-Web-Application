import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './OrganizerStatistics.css';

const OrganizerStatistics = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [loading, setLoading] = useState(false);
  
  // Sample data - in a real application, this would come from an API
  const visitorActionsData = [
    { name: 'Registrations', value: 32, color: '#3182ce' },
    { name: 'Profile Views', value: 27, color: '#f6ad55' },
    { name: 'Booth Visits', value: 18, color: '#fc8181' },
    { name: 'Downloads', value: 13, color: '#805ad5' },
    { name: 'Message Sent', value: 10, color: '#4fd1c5' }
  ];
  
  const exhibitorActionsData = [
    { name: 'Booth Updates', value: 32, color: '#3182ce' },
    { name: 'Contact Shares', value: 27, color: '#f6ad55' },
    { name: 'Materials Posted', value: 18, color: '#fc8181' },
    { name: 'Attendee Messages', value: 13, color: '#805ad5' },
    { name: 'Live Sessions', value: 10, color: '#4fd1c5' }
  ];
  
  const activeUsersData = [
    { name: 'Jan', value: 18 },
    { name: 'Feb', value: 14 },
    { name: 'Mar', value: 22 },
    { name: 'Apr', value: 12 },
    { name: 'May', value: 15 },
    { name: 'Jun', value: 20 },
    { name: 'Jul', value: 13 }
  ];
  
  const conversationsData = [
    { name: 'Day 1', opened: 10, closed: 4 },
    { name: 'Day 2', opened: 8, closed: 1 },
    { name: 'Day 3', opened: 12, closed: 2 }
  ];
  
  const weeklyConversationsData = [
    { name: 'Week 1', opened: 10, closed: 4 },
    { name: 'Week 2', opened: 8, closed: 1 },
    { name: 'Week 3', opened: 12, closed: 2 }
  ];
  
  const visitorTotal = visitorActionsData.reduce((sum, item) => sum + item.value, 0);
  const exhibitorTotal = exhibitorActionsData.reduce((sum, item) => sum + item.value, 0);
  
  // Simulate loading data when timeframe changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeframe]);
  
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="header">
          <h1 className="title">Event Statistics Dashboard</h1>
          <div className="timeframe-buttons">
            <button 
              className={`timeframe-button ${timeframe === 'daily' ? 'active' : ''}`}
              onClick={() => handleTimeframeChange('daily')}
            >
              Daily
            </button>
            <button 
              className={`timeframe-button ${timeframe === 'weekly' ? 'active' : ''}`}
              onClick={() => handleTimeframeChange('weekly')}
            >
              Weekly
            </button>
          </div>
        </div>
        
        <div className="filter-section">
          <div className="filter-buttons">
            <button className="filter-button">All Activities</button>
            <button className="filter-button active">Activity</button>
            <button className="filter-button">Registration</button>
            <button className="filter-button">Networking</button>
            <button className="filter-button">Sessions</button>
            <button className="filter-button">Engagement</button>
            <button className="filter-button">Sponsors</button>
            <button className="filter-button">Exhibitors</button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="charts-grid">
            {/* Top 5 visitor actions */}
            <div className="chart-card">
              <h2 className="chart-title">Top 5 visitor actions</h2>
              <div className="pie-chart-container">
                <div className="pie-chart">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={visitorActionsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {visitorActionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="total-value">
                    Total: {visitorTotal}
                  </div>
                </div>
                <div className="chart-legend">
                  {visitorActionsData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div className="legend-color-indicator" style={{ backgroundColor: item.color }}></div>
                      <span className="legend-label">{item.name}</span>
                      <span className="legend-value">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Top 5 exhibitor actions */}
            <div className="chart-card">
              <h2 className="chart-title">Top 5 exhibitor actions</h2>
              <div className="pie-chart-container">
                <div className="pie-chart">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={exhibitorActionsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {exhibitorActionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="total-value">
                    Total: {exhibitorTotal}
                  </div>
                </div>
                <div className="chart-legend">
                  {exhibitorActionsData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div className="legend-color-indicator" style={{ backgroundColor: item.color }}></div>
                      <span className="legend-label">{item.name}</span>
                      <span className="legend-value">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* % of active users */}
            <div className="chart-card">
              <h2 className="chart-title">% of active users</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activeUsersData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Total Conversations */}
            <div className="chart-card">
              <h2 className="chart-title">Total Conversations</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart 
                  data={timeframe === 'daily' ? conversationsData : weeklyConversationsData} 
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="opened" name="Opened" fill="#1a365d" />
                  <Bar dataKey="closed" name="Closed" fill="#f6ad55" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerStatistics;