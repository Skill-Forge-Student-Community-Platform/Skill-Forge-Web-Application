import axios from 'axios';

// Use the environment variable or fall back to localhost
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const userAPI = {
  /**
   * Get user profile data
   */
  getUserProfile: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/complete-profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error.response?.data || { message: 'Failed to load user profile' };
    }
  },

  /**
   * Get user projects
   */
  getUserProjects: async (userId, limit = undefined) => {
    try {
      const params = limit ? { limit } : {};
      const response = await axios.get(`${BASE_URL}/projects/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw error.response?.data || { message: 'Failed to load user projects' };
    }
  },

  /**
   * Follow/unfollow a user
   */
  followUser: async (userId) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      throw error.response?.data || { message: 'Failed to follow user' };
    }
  },

  /**
   * Get suggested users
   */
  getSuggestedUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/suggested`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      throw error.response?.data || { message: 'Failed to load suggested users' };
    }
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (data) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/update`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  /**
   * Get user's followers
   */
  getUserFollowers: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}/followers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user followers:', error);
      throw error.response?.data || { message: 'Failed to load followers' };
    }
  },

  /**
   * Get users the current user is following
   */
  getUserFollowing: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}/following`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user following:', error);
      throw error.response?.data || { message: 'Failed to load following users' };
    }
  }
};

export default userAPI;
