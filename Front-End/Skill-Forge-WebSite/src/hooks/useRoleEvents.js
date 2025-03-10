import { useState, useEffect } from 'react';
import roleServices from '../services/roleServices';

import { useAuthStore } from '../store/authStore';

/**
 * Custom hook for fetching and managing role-specific events
 *
 * @param {string} userId - The user ID
 * @param {object} initialFilters - Initial filter settings
 * @returns {Object} - Events data, state and methods
 */
const useRoleEvents = (userId, initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !user.role || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch events based on role and filters
        const data = await roleServices.fetchEvents(user.role, userId, filters);
        console.log(`Events fetched for ${user.role}:`, data);

        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user, userId, filters]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Create a new event
  const createEvent = async (eventData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await roleServices.createEvent(user.role, userId, eventData);

      // Add the new event to the list
      setEvents(prev => [result.event, ...prev]);

      return result;
    } catch (err) {
      setError(err.message || 'Failed to create event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (eventId, eventData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await roleServices.updateEvent(user.role, userId, eventId, eventData);

      // Update the event in the list
      setEvents(prev =>
        prev.map(event => event.id === eventId ? result.event : event)
      );

      return result;
    } catch (err) {
      setError(err.message || 'Failed to update event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId) => {
    try {
      setIsLoading(true);
      setError(null);

      await roleServices.deleteEvent(user.role, userId, eventId);

      // Remove the event from the list
      setEvents(prev => prev.filter(event => event.id !== eventId));

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch function to manually trigger data refresh
  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await roleServices.fetchEvents(user.role, userId, filters);
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || 'Failed to reload events');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    events,
    isLoading,
    error,
    filters,
    updateFilters,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch
  };
};

export default useRoleEvents;
