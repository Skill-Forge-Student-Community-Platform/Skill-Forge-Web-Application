import axios from 'axios';

// Fix the BASE_URL - hardcode it to ensure proper connection
const BASE_URL = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const friendService = {
  getSuggestedFriends: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/friends/suggested`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error getting suggested friends:', error);
      throw error.response?.data || { message: 'Failed to load suggestions' };
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/friends/send-request/${userId}`, 
        {}, 
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error.response?.data || { message: 'Failed to send friend request' };
    }
  },

  getFriendRequests: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/friends/requests`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get friend requests' };
    }
  },

  acceptFriendRequest: async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/friends/accept-request/${userId}`, 
        {}, 
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to accept friend request' };
    }
  },

  rejectFriendRequest: async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/friends/reject-request/${userId}`, 
        {}, 
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject friend request' };
    }
  },

  getFriends: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/friends/friends`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get friends' };
    }
  },

  removeFriend: async (userId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/friends/remove/${userId}`, 
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove friend' };
    }
  }
};

export default friendService;
