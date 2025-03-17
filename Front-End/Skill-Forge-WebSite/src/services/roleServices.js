import axios from 'axios';

// Use the environment variable or fall back to localhost
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

/**
 * Role-based API service functions
 */
const roleServices = {
  /**
   * Dashboard data
   */
  fetchDashboardData: async (role, userId) => {
    try {
      console.log(`Fetching dashboard data for ${role} ${userId}`);
      const response = await axios.get(`${BASE_URL}/role/${role}/${userId}/dashboard`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${role} dashboard data:`, error);
      throw error.response?.data || { message: 'Failed to load dashboard data' };
    }
  },

  /**
   * Events
   */
  fetchEvents: async (role, userId, filters = {}) => {
    try {
      console.log(`Fetching events for ${role} ${userId} with filters:`, filters);
      const response = await axios.get(`${BASE_URL}/role/${role}/${userId}/events`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${role} events:`, error);
      throw error.response?.data || { message: 'Failed to load events' };
    }
  },

  createEvent: async (role, userId, eventData) => {
    try {
      console.log(`Creating event for ${role} ${userId}:`, eventData);
      const response = await axios.post(
        `${BASE_URL}/role/${role}/${userId}/events`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating event for ${role}:`, error);
      throw error.response?.data || { message: 'Failed to create event' };
    }
  },

  updateEvent: async (role, userId, eventId, eventData) => {
    try {
      console.log(`Updating event ${eventId} for ${role} ${userId}`);
      const response = await axios.put(
        `${BASE_URL}/role/${role}/${userId}/events/${eventId}`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating event for ${role}:`, error);
      throw error.response?.data || { message: 'Failed to update event' };
    }
  },

  deleteEvent: async (role, userId, eventId) => {
    try {
      console.log(`Deleting event ${eventId} for ${role} ${userId}`);
      const response = await axios.delete(
        `${BASE_URL}/role/${role}/${userId}/events/${eventId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting event for ${role}:`, error);
      throw error.response?.data || { message: 'Failed to delete event' };
    }
  },

  /**
   * Teams
   */
  fetchTeams: async (role, userId) => {
    try {
      console.log(`Fetching teams for ${role} ${userId}`);
      const response = await axios.get(`${BASE_URL}/role/${role}/${userId}/teams`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${role} teams:`, error);
      throw error.response?.data || { message: 'Failed to load teams' };
    }
  },

  createTeam: async (role, userId, teamData) => {
    try {
      console.log(`Creating team for ${role} ${userId}`);
      const response = await axios.post(
        `${BASE_URL}/role/${role}/${userId}/teams`,
        teamData
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating team for ${role}:`, error);
      throw error.response?.data || { message: 'Failed to create team' };
    }
  },

  /**
   * Profile
   */
  fetchRoleProfile: async (role, userId) => {
    try {
      console.log(`Fetching role profile for ${role} ${userId}`);
      const response = await axios.get(`${BASE_URL}/role/${role}/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${role} profile:`, error);
      throw error.response?.data || { message: 'Failed to load profile' };
    }
  },

  /**
   * Fetch complete user profile data (combined from User and role-specific models)
   */
  fetchUserProfileData: async (userId) => {
    try {
      console.log(`Fetching complete profile data for user ${userId}`);

      // Explicitly remove '/auth' from the URL path to avoid conflict with authStore.js settings
      const apiBase = BASE_URL.includes('/auth')
        ? BASE_URL.replace('/auth', '')
        : BASE_URL;

      console.log("Using API base URL:", apiBase);
      const response = await axios.get(`${apiBase}/users/complete-profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching profile data:`, error);
      throw error.response?.data || { message: 'Failed to load profile data' };
    }
  },

  // Organizer-specific: Analytics
  fetchAnalytics: async (userId) => {
    try {
      console.log(`Fetching analytics for organizer ${userId}`);
      const response = await axios.get(`${BASE_URL}/role/organizer/${userId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error.response?.data || { message: 'Failed to load analytics' };
    }
  }
};

export default roleServices;
