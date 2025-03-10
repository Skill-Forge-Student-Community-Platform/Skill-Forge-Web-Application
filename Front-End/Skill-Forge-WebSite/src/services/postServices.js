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
   */
  uploadMediaFiles: async (files) => {
    try {
      if (!files || files.length === 0) return [];

      // Create a proper form data object with raw files
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      console.log("Uploading files to Cloudinary...", files.length);

      // Make sure we're using the right endpoint - check your backend API
      const uploadUrl = `${BASE_URL}/uploads/media`; // Adjust this endpoint to match your backend
      console.log("Upload URL:", uploadUrl);

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("File upload response:", response.data);
      return response.data.files || [];
    } catch (error) {
      console.error("Error uploading files:", error);
      console.error("Response data:", error.response?.data);
      throw error.response?.data || { message: 'Failed to upload media files' };
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

      // Handle file uploads first if there are any
      let processedPostData = { ...postData };

      if (postData.files && postData.files.length > 0) {
        console.log("Files detected for upload:", postData.files.length);

        // First check if they are actual File objects and not already base64 strings
        const hasRawFiles = postData.files.some(file => file instanceof File ||
                                               (file.name && file.type && file.size));

        if (hasRawFiles) {
          // Upload files to Cloudinary via backend
          const uploadedFiles = await postServices.uploadMediaFiles(postData.files);

          // Format media structure for the post with the Cloudinary URLs
          processedPostData.media = {
            layout: postData.layout || "default",
            files: uploadedFiles.map(file => ({
              url: file.url,
              type: file.resource_type === 'video' ? 'video' : 'image',
              publicId: file.public_id
            }))
          };

          // Remove the raw files from the request
          delete processedPostData.files;
        } else {
          // Files are already in some processed format (maybe base64)
          console.warn("Files are not in raw format. Make sure they're properly handled by the backend.");
        }
      }

      console.log("Final post data for submission:", JSON.stringify(processedPostData, null, 2));

      // Extra validation before sending to server
      if (processedPostData.media && processedPostData.media.files) {
        const invalidFiles = processedPostData.media.files.filter(
          file => !file.url || !(file.type === 'image' || file.type === 'video')
        );

        if (invalidFiles.length > 0) {
          console.error("Invalid file format detected:", invalidFiles);
          throw { message: "Media files are not properly formatted" };
        }
      }

      const response = await axios.post(url, processedPostData);
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
