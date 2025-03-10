import axios from "axios";

const API_URL = "http://localhost:5000";

// Helper function to handle image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return `${API_URL}/uploads/default.jpg`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}/${imagePath}`;
};

export const EventServices = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/Details`);
      // Process the image URLs before returning
      const events = response.data.map(event => ({
        ...event,
        imageUrl: getImageUrl(event.image)
      }));
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Get events for a specific user (organizer)
  getUserEvents: async (userId) => {
    try {
      // Either filter client-side or create a specific endpoint
      const response = await axios.get(`${API_URL}/Details?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user events:", error);
      throw error;
    }
  },

  // Add a new event - simplified to work without file upload if necessary
  addEvent: async (eventData) => {
    try {
      console.log("Adding event with data:", eventData);
      
      // Check if we have actual file upload capability
      const hasFileData = eventData.get('image') instanceof File;
      
      let response;
      if (hasFileData) {
        // Try with multipart/form-data
        response = await axios.post(`${API_URL}/Details`, eventData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Fall back to JSON if no actual file is being uploaded
        const formDataObject = {};
        for (let [key, value] of eventData.entries()) {
          formDataObject[key] = value;
        }
        response = await axios.post(`${API_URL}/Details`, formDataObject);
      }
      
      return response.data.event;
    } catch (error) {
      console.error("Error adding event:", error);
      console.error("Response:", error.response?.data);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    try {
      await axios.delete(`${API_URL}/Details/${eventId}`);
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Update an event
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await axios.put(`${API_URL}/Details/${eventId}`, eventData);
      return response.data.event;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },
  
  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const response = await axios.get(`${API_URL}/Details/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${eventId}:`, error);
      throw error;
    }
  },
};

export default EventServices;
