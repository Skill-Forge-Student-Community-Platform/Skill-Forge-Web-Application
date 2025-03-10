import axios from 'axios';

// Get base API URL without the /auth part
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";
const BASE_URL = API_URL.replace('/api/auth', '/api');

// Configure axios for credentials if not already in a global config
axios.defaults.withCredentials = true;

// Helper function to extract meaningful error message from validation errors
const extractValidationErrorMessage = (errorString) => {
  if (!errorString) return null;

  // Common validation errors and user-friendly messages
  if (errorString.includes('media.files') && errorString.includes('url')) {
    return "Media files must have valid URLs";
  }
  if (errorString.includes('media.files') && errorString.includes('type')) {
    return "Media files have invalid types. Only image and video are allowed.";
  }

  return "Post validation failed. Please check your post content.";
};

// Debug current URLs
console.log("API Base URL Configuration:", { original: API_URL, modified: BASE_URL });

/**
 * Post-related API service functions
 */
const postServices = {
  /**
   * Fetch user feed posts with pagination
   */
  getFeedPosts: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/feed`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error.response?.data || { message: 'Failed to load feed posts' };
    }
  },

  /**
   * Get posts by specific user
   */
  getUserPosts: async (userId, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/user/${userId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching user posts for ${userId}:`, error);
      throw error.response?.data || { message: 'Failed to load user posts' };
    }
  },

  /**
   * Create a new post
   */
  createPost: async (postData) => {
    try {
      const url = `${BASE_URL}/posts/create`;
      console.log("Creating post at:", url);
      console.log("Post data:", JSON.stringify(postData, null, 2));

      // Extra validation before sending to server
      if (postData.media && postData.media.files) {
        // Check each file has a valid URL and type
        const invalidFiles = postData.media.files.filter(
          file => !file.url || !(file.type === 'image' || file.type === 'video')
        );

        if (invalidFiles.length > 0) {
          console.error("Invalid file format detected:", invalidFiles);
          throw { message: "Media files are not properly formatted" };
        }
      }

      const response = await axios.post(url, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Status:', error.response?.status);

      // Check for validation errors from MongoDB
      if (error.response?.data?.error && error.response.data.error.includes('validation failed')) {
        console.error('Validation error:', error.response.data);
        const errorMsg = extractValidationErrorMessage(error.response.data.error);
        throw { message: errorMsg || "Post validation failed. Check your media files." };
      }

      // Check for specific error conditions
      if (error.response?.status === 401) {
        throw { message: 'Authentication required. Please log in again.' };
      } else if (error.response?.status === 403) {
        throw { message: 'You need to complete your profile before posting.' };
      }

      throw error.response?.data || { message: 'Failed to create post' };
    }
  },

  /**
   * Like or unlike a post
   */
  likePost: async (postId) => {
    try {
      const response = await axios.post(`${BASE_URL}/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      throw error.response?.data || { message: 'Failed to like post' };
    }
  },

  /**
   * Add comment to a post
   */
  addComment: async (postId, text) => {
    try {
      const response = await axios.post(`${BASE_URL}/posts/${postId}/comment`, { text });
      return response.data;
    } catch (error) {
      console.error(`Error commenting on post ${postId}:`, error);
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  },

  /**
   * Delete a post
   */
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
      throw error.response?.data || { message: 'Failed to delete post' };
    }
  },

  /**
   * Share/repost a post
   */
  sharePost: async (postId, text, privacy = "Public") => {
    try {
      const response = await axios.post(`${BASE_URL}/posts/${postId}/share`, {
        text,
        privacy
      });
      return response.data;
    } catch (error) {
      console.error(`Error sharing post ${postId}:`, error);
      throw error.response?.data || { message: 'Failed to share post' };
    }
  }
};

export default postServices;
