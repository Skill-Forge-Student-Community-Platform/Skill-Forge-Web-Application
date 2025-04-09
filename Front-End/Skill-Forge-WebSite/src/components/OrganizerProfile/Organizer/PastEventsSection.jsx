import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaUsers, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import './PastEventsSection.css';
import roleServices from '../../../services/roleServices';


const PastEventsSection = ({ userId }) => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample past event images for fallback
  const defaultEventImages = [
    'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  ];

  // Fetch past events data
  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!userId) {
          setIsLoading(false);
          return;
        }

        // This would be an API call to fetch past events
        // For now, using sample data
        setTimeout(() => {
          // Sample past events data
          const samplePastEvents = [
            {
              id: 'past1',
              title: 'Web Development Bootcamp 2022',
              date: 'May 15 - June 30, 2022',
              location: 'Online',
              image: defaultEventImages[0],
              participants: 128,
              rating: 4.8,
              testimonial: "One of the best bootcamps I've attended. The instructors were great!",
              testimonialAuthor: 'Sarah M.'
            },
            {
              id: 'past2',
              title: 'AI Conference 2021',
              date: 'November 10-12, 2021',
              location: 'San Francisco, CA',
              image: defaultEventImages[1],
              participants: 350,
              rating: 4.6,
              testimonial: 'Excellent speakers and great networking opportunities.',
              testimonialAuthor: 'David L.'
            },
            {
              id: 'past3',
              title: 'JavaScript Workshop Series',
              date: 'February 1-28, 2021',
              location: 'Online',
              image: defaultEventImages[2],
              participants: 96,
              rating: 4.7,
              testimonial: 'The hands-on exercises were incredibly valuable. I learned so much!',
              testimonialAuthor: 'Michael R.'
            }
          ];

          setPastEvents(samplePastEvents);
          setIsLoading(false);
        }, 1200);

      } catch (err) {
        console.error('Error fetching past events:', err);
        setError('Failed to load past events. Please try again.');
        setIsLoading(false);
      }
    };

    fetchPastEvents();
  }, [userId]);

  const handleViewDetails = (eventId) => {
    navigate(`/Organizer/${userId}/view-event/${eventId}`);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="organizer-past-events-loading">
        <div className="organizer-past-events-spinner"></div>
        <p>Loading past events...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="organizer-past-events-error">
        <p>{error}</p>
        <button
          className="organizer-past-events-retry"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Render empty state
  if (pastEvents.length === 0) {
    return (
      <div className="organizer-past-events-empty">
        <FaCalendarCheck className="organizer-past-events-icon" />
        <h3>No Past Events</h3>
        <p>When you organize events, they'll appear here after completion</p>
      </div>
    );
  }

  return (
    <div className="organizer-past-events-container">
      <div className="organizer-past-events-grid">
        {pastEvents.map((event) => (
          <div key={event.id} className="organizer-past-event-card">
            <div className="organizer-past-event-image-container">
              <img
                src={event.image}
                alt={event.title}
                className="organizer-past-event-image"
              />
              <div className="organizer-past-event-rating">
                <FaStar className="organizer-past-event-star" />
                <span>{event.rating}</span>
              </div>
            </div>

            <div className="organizer-past-event-content">
              <h3 className="organizer-past-event-title">{event.title}</h3>

              <div className="organizer-past-event-details">
                <div className="organizer-past-event-date">
                  <FaCalendarCheck className="organizer-past-event-icon" />
                  <span>{event.date}</span>
                </div>

                <div className="organizer-past-event-participants">
                  <FaUsers className="organizer-past-event-icon" />
                  <span>{event.participants} participants</span>
                </div>
              </div>

              {event.testimonial && (
                <div className="organizer-past-event-testimonial">
                  <blockquote>"{event.testimonial}"</blockquote>
                  <cite>— {event.testimonialAuthor}</cite>
                </div>
              )}

              <button
                className="organizer-past-event-button"
                onClick={() => handleViewDetails(event.id)}
              >
                <span>View Details</span>
                <FaExternalLinkAlt className="organizer-past-event-link-icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastEventsSection;
