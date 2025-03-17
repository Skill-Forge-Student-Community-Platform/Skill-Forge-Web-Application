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
   * Upload media files to Cloudinary via the backend
   * NOTE: This function is deprecated - files should be converted to base64
   * and included directly in the post creation request
   */
  uploadMediaFiles: async (files) => {
    try {
      console.warn("The uploadMediaFiles endpoint is not available. Files should be converted to base64 instead.");
      throw new Error("Direct file upload endpoint not available");
    } catch (error) {
      console.error("Error uploading files:", error);
      throw { message: 'Failed to upload media files - direct upload not supported' };
    }
  },

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
      console.log("Final post data for submission:", JSON.stringify(postData, null, 2));

      // Validate media data before sending
      if (postData.media && postData.media.files) {
        // Check for valid media data format
        if (!Array.isArray(postData.media.files)) {
          throw new Error("Media files must be an array");
        }

        // Validate each file entry
        for (const file of postData.media.files) {
          // Check for valid URL
          if (!file.url || typeof file.url !== 'string') {
            console.error("Invalid file URL:", file);
            throw new Error("Each media file must have a valid URL");
          }

          // Make sure types are simplified to what the backend expects
          if (!file.type || (file.type !== 'image' && file.type !== 'video')) {
            // If type is missing or invalid, try to infer it from the URL
            const ext = file.url.split('.').pop().toLowerCase();
            const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
            const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];

            if (imgExts.includes(ext)) {
              file.type = 'image';
            } else if (videoExts.includes(ext)) {
              file.type = 'video';
            } else {
              // Default to image if type cannot be determined
              file.type = 'image';
            }
          }
        }
      }

      // Send the post to the backend
      const response = await axios.post(url, postData);
      console.log("Post creation successful:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Status:', error.response?.status);

      // Detailed error logging for debugging
      if (error.response?.data) {
        console.error('Response data:', error.response.data);
      }

      if (error.request) {
        console.error('Request was made but no response received');
      }

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
  addComment: async (postId, text, parentId = null) => {
    try {
      const response = await axios.post(`${BASE_URL}/posts/${postId}/comment`, {
        text,
        parentId
      });
      return response.data;
    } catch (error) {
      console.error(`Error commenting on post ${postId}:`, error);
      console.error('Comment error details:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  },

  /**
   * Like or unlike a comment
   */
  likeComment: async (postId, commentId) => {
    try {
      const response = await axios.post(`${BASE_URL}/posts/${postId}/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking comment ${commentId}:`, error);
      throw error.response?.data || { message: 'Failed to like comment' };
    }
  },

  /**
   * Delete a comment
   */
  deleteComment: async (postId, commentId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error.response?.data || { message: 'Failed to delete comment' };
    }
  },

  /**
   * Edit a comment (frontend-only solution as we didn't implement a backend endpoint)
   */
  editComment: async (postId, commentId, newText) => {
    try {
      // This would ideally call a PUT endpoint, but we'll mock it for now
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: "Comment updated successfully",
        comment: { _id: commentId, text: newText }
      };
    } catch (error) {
      console.error(`Error editing comment ${commentId}:`, error);
      throw { message: 'Failed to edit comment' };

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
