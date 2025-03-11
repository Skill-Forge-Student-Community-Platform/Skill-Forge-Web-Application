import React, { createContext, useState, useEffect, useContext } from 'react';
import EventServices from '../services/EventServices';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await EventServices.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Optional: Set up polling if real-time updates are needed
    const interval = setInterval(fetchEvents, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const addEvent = async (formData) => {
    try {
      const newEvent = await EventServices.addEvent(formData);
      setEvents(prev => [...prev, newEvent]);
      return { success: true, event: newEvent };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await EventServices.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      const updatedEvent = await EventServices.updateEvent(eventId, eventData);
      setEvents(prev => prev.map(event => 
        event._id === eventId ? updatedEvent : event
      ));
      return { success: true, event: updatedEvent };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      loading, 
      error, 
      addEvent, 
      deleteEvent, 
      updateEvent, 
      refreshEvents: fetchEvents 
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
