import axios from 'axios';
import { getApiBaseUrl } from '../utils/environment';

const BASE_URL = getApiBaseUrl();

// Helper function to get auth headers
const getAuthHeaders = () => ({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const friendService = {
  getSuggestedFriends: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/friends/suggested`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error getting suggested friends:', error);
      throw error.response?.data || { message: 'Failed to get suggested friends' };
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
      throw error.response?.data || { message: 'Failed to get friends list' };
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
  },

  // Following and follower functions
  getFollowing: async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/${userId}/following`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get following users' };
    }
  },

  getFollowers: async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/${userId}/followers`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get followers' };
    }
  },

  followUser: async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/follow/${userId}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to follow user' };
    }
  },

  unfollowUser: async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/unfollow/${userId}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to unfollow user' };
    }
  }
};

export default friendService;
