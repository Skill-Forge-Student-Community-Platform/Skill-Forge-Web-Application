// In a new file RegisteredEvents.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisteredEvents = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/registered-events-by-user/${userId}`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegisteredEvents();
  }, [userId]);
  
  if (loading) return <div>Loading registered events...</div>;

  const navigateToEventDetails = (eventId) => {
    navigate(`../explore-event/${eventId}`);
    
  };
  
   

  
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Registered Events</h2>
        
        {events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p>You haven't registered for any events yet.</p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Explore Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {events.map(event => (
  <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
    {/* Event image if available */}
    {event.image && (
      <img 
        src={`http://localhost:5000/${event.image}`} 
        alt={event.title} 
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-6">
      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
      <p className="text-gray-600 mb-4">{new Date(event.date).toLocaleDateString()}</p>
      
      {/* Navigation button */}
      <button 
        onClick={() => navigateToEventDetails(event._id)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
      >
        View Event Details
      </button>
    </div>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredEvents;