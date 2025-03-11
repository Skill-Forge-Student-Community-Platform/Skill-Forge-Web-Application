import React, { useState } from 'react';
import './EventManagement.css';
import bannerImage from '../../../Assets/competition.jpeg';
import activityImage from '../../../Assets/competition1.jpeg';
import activityImage1 from '../../../Assets/competition2.jpeg';
import activityImage2 from '../../../Assets/competition3.jpeg';

const eventActivities = [
  {
    id: 1,
    title: "Ice Skating Rink Hire & Set up",
    image: activityImage,
    badge: "Popular",
    description:
      "We can supply and install a fully functional ice rink at your specified location. Professional, skilled staff members at your choice. On-site support for the duration of the hire.",
    details:
      "The Ice Skating Rink setup includes professional installation, skilled staff, and on-site support throughout the event. Safety measures and customer engagement strategies are ensured."
  },
  {
    id: 2,
    title: "Managed Hire operated by Chilled Events",
    image: activityImage1,
    badge: "Featured",
    description:
      "We can supply and install a fully managed ice rink facility, including on-site personnel and trained staff required to enhance the overall experience.",
    details:
      "Our managed hire service includes on-site management, customer engagement, and assistance from trained professionals. The setup ensures smooth operations and an immersive experience."
  },
  {
    id: 3,
    title: "Toboggan Ice Slope Hire",
    image: activityImage2,
    badge: "New",
    description:
      "We can supply a real ice toboggan slide which will provide an alternative entertainment or side attraction through the duration of your ice rink.",
    details:
      "Our toboggan ice slope offers a thrilling ride experience, fully supervised by trained professionals. It is suitable for all ages and can be customized for different event settings."
  },
];

const EventManagement = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  return (
    <div className="event-container">
      <h1 className="page-title">Ongoing Event</h1>

      <div className="event-header">
        <div className="event-banner">
          <img
            src={bannerImage}
            alt="Event participants around a table with laptops and drinks"
            className="banner-image"
          />
        </div>

        <div className="event-header-content">
          <div className="event-title-section">
            <h2 className="event-title">The Global Leadership Summit</h2>
            <p className="event-date">
              Apr 24, 2023 12:00 PM - Nov 20, 2023 1:30 AM
            </p>
          </div>
          <button className="manage-event-btn">Manage Event</button>
        </div>
      </div>

      <div className="event-features">
        <h2 className="features-title">Event Activities</h2>
        <p className="features-description">
          Explore our range of activities available for your event. Each
          activity comes with professional staff and full setup.
        </p>
      </div>

      <div className="event-activities">
        {eventActivities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <div className="activity-image-container">
              <img
                src={activity.image}
                alt={activity.title}
                className="activity-image"
              />
              <div className="activity-badge">{activity.badge}</div>
            </div>
            <h3 className="activity-title">{activity.title}</h3>
            <p className="activity-description">{activity.description}</p>
            <button
              className="activity-btn"
              onClick={() =>
                setSelectedActivity(
                  selectedActivity?.id === activity.id ? null : activity
                )
              }
            >
              {selectedActivity?.id === activity.id ? "Hide Details" : "View Details"}
            </button>

            {selectedActivity?.id === activity.id && (
              <div className="activity-details">
                <p>{selectedActivity.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventManagement;
