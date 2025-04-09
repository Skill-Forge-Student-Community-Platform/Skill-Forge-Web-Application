import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './OrganizerStatistics.css';

const OrganizerStatistics = ({ userId }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Enhanced sample data
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
    { name: 'Jan', value: 78 },
    { name: 'Feb', value: 65 },
    { name: 'Mar', value: 92 },
    { name: 'Apr', value: 84 },
    { name: 'May', value: 76 },
    { name: 'Jun', value: 95 },
    { name: 'Jul', value: 105 }
  ];

  const weeklyActiveUsersData = [
    { name: 'Week 1', value: 45 },
    { name: 'Week 2', value: 52 },
    { name: 'Week 3', value: 49 },
    { name: 'Week 4', value: 65 },
    { name: 'Week 5', value: 59 },
    { name: 'Week 6', value: 72 }
  ];

  const dailyActiveUsersData = [
    { name: 'Mon', value: 28 },
    { name: 'Tue', value: 32 },
    { name: 'Wed', value: 36 },
    { name: 'Thu', value: 30 },
    { name: 'Fri', value: 42 },
    { name: 'Sat', value: 25 },
    { name: 'Sun', value: 22 }
  ];

  const conversationsData = [
    { name: 'Day 1', opened: 24, closed: 12 },
    { name: 'Day 2', opened: 18, closed: 10 },
    { name: 'Day 3', opened: 22, closed: 14 },
    { name: 'Day 4', opened: 28, closed: 16 },
    { name: 'Day 5', opened: 20, closed: 18 }
  ];

  const weeklyConversationsData = [
    { name: 'Week 1', opened: 65, closed: 42 },
    { name: 'Week 2', opened: 72, closed: 48 },
    { name: 'Week 3', opened: 58, closed: 40 },
    { name: 'Week 4', opened: 80, closed: 55 }
  ];

  const monthlyConversationsData = [
    { name: 'Jan', opened: 180, closed: 142 },
    { name: 'Feb', opened: 165, closed: 138 },
    { name: 'Mar', opened: 210, closed: 175 },
    { name: 'Apr', opened: 195, closed: 160 },
    { name: 'May', opened: 225, closed: 190 }
  ];

  // Calculate totals for pie charts
  const visitorTotal = visitorActionsData.reduce((sum, item) => sum + item.value, 0);
  const exhibitorTotal = exhibitorActionsData.reduce((sum, item) => sum + item.value, 0);

  // Get active users data based on selected timeframe
  const getActiveUsersData = () => {
    if (timeframe === 'daily') return dailyActiveUsersData;
    if (timeframe === 'weekly') return weeklyActiveUsersData;
    return activeUsersData; // monthly
  };

  // Get conversations data based on selected timeframe
  const getConversationsData = () => {
    if (timeframe === 'daily') return conversationsData;
    if (timeframe === 'weekly') return weeklyConversationsData;
    return monthlyConversationsData;
  };

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

  // Navigation functions for carousel
  const goToPreviousSlide = () => {
    setCurrentSlide(prev => prev === 0 ? 3 : prev - 1); // Assuming 4 charts (0-3)
  };

  const goToNextSlide = () => {
    setCurrentSlide(prev => prev === 3 ? 0 : prev + 1); // Assuming 4 charts (0-3)
  };

  // Create an array of chart components for carousel
  const chartComponents = [
    // Chart 1: Visitor actions
    <div key="visitor-actions" className="organizer-chart-card">
      <h2 className="organizer-chart-title">Top 5 visitor actions</h2>
      <div className="organizer-pie-chart-container">
        <div className="organizer-pie-chart">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={visitorActionsData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                paddingAngle={2}
              >
                {visitorActionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="organizer-total-value">
            Total: {visitorTotal}
          </div>
        </div>
        <div className="organizer-chart-legend">
          {visitorActionsData.map((item, index) => (
            <div key={index} className="organizer-legend-item">
              <div className="organizer-legend-color-indicator" style={{ backgroundColor: item.color }}></div>
              <span className="organizer-legend-label">{item.name}</span>
              <span className="organizer-legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Chart 2: Exhibitor actions
    <div key="exhibitor-actions" className="organizer-chart-card">
      <h2 className="organizer-chart-title">Top 5 exhibitor actions</h2>
      <div className="organizer-pie-chart-container">
        <div className="organizer-pie-chart">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={exhibitorActionsData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                paddingAngle={2}
              >
                {exhibitorActionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="organizer-total-value">
            Total: {exhibitorTotal}
          </div>
        </div>
        <div className="organizer-chart-legend">
          {exhibitorActionsData.map((item, index) => (
            <div key={index} className="organizer-legend-item">
              <div className="organizer-legend-color-indicator" style={{ backgroundColor: item.color }}></div>
              <span className="organizer-legend-label">{item.name}</span>
              <span className="organizer-legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Chart 3: Active users
    <div key="active-users" className="organizer-chart-card">
      <h2 className="organizer-chart-title">% of active users</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getActiveUsersData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" name="Active Users" fill="#3182ce" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>,

    // Chart 4: Conversations
    <div key="conversations" className="organizer-chart-card">
      <h2 className="organizer-chart-title">Total Conversations</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={getConversationsData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="opened" name="Opened" fill="#1a365d" radius={[4, 0, 0, 4]} />
          <Bar dataKey="closed" name="Closed" fill="#f6ad55" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  ];

  return (
    <div className="organizer-dashboard-container">
      <div className="organizer-dashboard-content">
        <div className="organizer-header">
          <h1 className="organizer-title">Event Statistics Dashboard</h1>
          <div className="organizer-timeframe-buttons">
            <button
              className={`organizer-timeframe-button ${timeframe === 'daily' ? 'active' : ''}`}
              onClick={() => handleTimeframeChange('daily')}
            >
              Daily
            </button>
            <button
              className={`organizer-timeframe-button ${timeframe === 'weekly' ? 'active' : ''}`}
              onClick={() => handleTimeframeChange('weekly')}
            >
              Weekly
            </button>
            <button
              className={`organizer-timeframe-button ${timeframe === 'monthly' ? 'active' : ''}`}
              onClick={() => handleTimeframeChange('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="organizer-filter-section">
          <div className="organizer-filter-buttons">
            <button className="organizer-filter-button active">All Activities</button>
            <button className="organizer-filter-button">Registration</button>
            <button className="organizer-filter-button">Networking</button>
            <button className="organizer-filter-button">Sessions</button>
            <button className="organizer-filter-button">Engagement</button>
          </div>
        </div>

        {loading ? (
          <div className="organizer-loading-container">
            <div className="organizer-loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="organizer-error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="organizer-retry-button">
              Retry
            </button>
          </div>
        ) : (
          <div className="organizer-charts-carousel">
            <div className="organizer-chart-slider-controls">
              <button
                className="organizer-chart-nav-button prev"
                onClick={goToPreviousSlide}
                aria-label="Previous chart"
              >
                <FaChevronLeft />
              </button>
              <button
                className="organizer-chart-nav-button next"
                onClick={goToNextSlide}
                aria-label="Next chart"
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="organizer-chart-slides">
              {chartComponents[currentSlide]}
            </div>

            <div className="organizer-chart-indicators">
              {chartComponents.map((_, index) => (
                <button
                  key={index}
                  className={`organizer-chart-indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to chart ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerStatistics;
