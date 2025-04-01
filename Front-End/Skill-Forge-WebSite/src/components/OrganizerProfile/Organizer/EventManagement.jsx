import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './EventManagement.css';
import roleServices from '../../../services/roleServices';
import { useAuthStore } from '../../../store/authStore';

// Fallback images for when event data doesn't have images
import defaultBannerImage from '../../../Assets/competition.jpeg';
import defaultActivityImage1 from '../../../Assets/competition1.jpeg';
import defaultActivityImage2 from '../../../Assets/competition2.jpeg';
import defaultActivityImage3 from '../../../Assets/competition3.jpeg';

const defaultActivityImages = [
  defaultActivityImage1,
  defaultActivityImage2,
  defaultActivityImage3
];

const EventManagement = ({ userId }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events for the organizer
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!userId) {
          setIsLoading(false);
          return;
        }

        // Fetch events from the API
        const response = await roleServices.fetchEvents('organizer', userId);

        if (response && response.data && response.data.events) {
          setEvents(response.data.events);

          // Set the first event as active if there are events
          if (response.data.events.length > 0) {
            setActiveEvent(response.data.events[0]);
          }
        } else {
          // If we get an empty response, set empty events array
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');

        // Set sample data to show UI in case of error
        setEvents([
          {
            id: '1',
            title: 'The Global Leadership Summit',
            date: 'Apr 24, 2023 12:00 PM - Nov 20, 2023 1:30 AM',
            image: defaultBannerImage,
            activities: [
              {
                id: '1',
                title: 'Ice Skating Rink Hire & Set up',
                image: defaultActivityImage1,
                badge: 'Popular',
                description: 'We can supply and install a fully functional ice rink at your specified location.',
                details: 'The Ice Skating Rink setup includes professional installation, skilled staff, and on-site support throughout the event.'
              },
              {
                id: '2',
                title: 'Managed Hire operated by Chilled Events',
                image: defaultActivityImage2,
                badge: 'Featured',
                description: 'We can supply and install a fully managed ice rink facility, including on-site personnel.',
                details: 'Our managed hire service includes on-site management, customer engagement, and assistance from trained professionals.'
              }
            ]
          }
        ]);

        if (events.length > 0) {
          setActiveEvent(events[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  // Handle manage event click
  const handleManageEvent = (eventId) => {
    navigate(`/Organizer/${userId}/view-event/${eventId}`);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="event-container">
        <h1 className="page-title">Event Management</h1>
        <div className="loading-container">
          <div className="event-loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && events.length === 0) {
    return (
      <div className="event-container">
        <h1 className="page-title">Event Management</h1>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (events.length === 0) {
    return (
      <div className="event-container">
        <h1 className="page-title">Event Management</h1>
        <div className="empty-state">
          <h2>No Events Found</h2>
          <p>You haven't created any events yet.</p>
          {userId === user?._id && (
            <button
              className="create-event-button"
              onClick={() => navigate(`/Organizer/${userId}/add-events`)}
            >
              Create Your First Event
            </button>
          )}
        </div>
      </div>
    );
  }

  // If we have events but no active event selected
  if (!activeEvent) {
    setActiveEvent(events[0]);
    return null; // Return null to prevent rendering until activeEvent is set
  }

  return (
    <div className="event-container">
      <h1 className="page-title">Ongoing Event</h1>

      <div className="event-header">
        <div className="event-banner">
          <img
            src={activeEvent.image || defaultBannerImage}
            alt={activeEvent.title || "Event banner"}
            className="banner-image"
          />
        </div>

        <div className="event-header-content">
          <div className="event-title-section">
            <h2 className="event-title">{activeEvent.title || "Untitled Event"}</h2>
            <p className="event-date">
              {activeEvent.date || "Date not specified"}
            </p>
          </div>
          <button
            className="manage-event-btn"
            onClick={() => handleManageEvent(activeEvent.id)}
          >
            Manage Event
          </button>
        </div>
      </div>

      {activeEvent.activities && activeEvent.activities.length > 0 ? (
        <>
          <div className="event-features">
            <h2 className="features-title">Event Activities</h2>
            <p className="features-description">
              Explore our range of activities available for your event. Each
              activity comes with professional staff and full setup.
            </p>
          </div>

          <div className="event-activities">
            {activeEvent.activities.map((activity, index) => (
              <div key={activity.id || index} className="activity-card">
                <div className="activity-image-container">
                  <img
                    src={activity.image || defaultActivityImages[index % defaultActivityImages.length]}
                    alt={activity.title || "Activity"}
                    className="activity-image"
                  />
                  {activity.badge && <div className="activity-badge">{activity.badge}</div>}
                </div>
                <h3 className="activity-title">{activity.title || "Activity"}</h3>
                <p className="activity-description">{activity.description || "No description available."}</p>
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
                    <p>{selectedActivity.details || "No additional details available."}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-activities">
          <h3>No Activities Added</h3>

          <p>This event doesn't have any activities yet.</p>
          {userId === user?._id && (
            <button
              className="add-activity-button"
              onClick={() => handleManageEvent(activeEvent.id)}
            >
              Add Activities
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventManagement;
