import axios from 'axios';

// Create a base API instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API for token verification
export const authAPI = {
  verifyToken: () => {
    return apiClient.get('/auth/verify-token');
  },
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  }
};

// User API for fetching current user
export const userAPI = {
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  }
};

// Settings API service
export const settingsAPI = {
  // Profile information
  updateName: (data) => {
    return apiClient.put('/settings/name', data);
  },
  
  // Email settings
  updateEmail: (data) => {
    return apiClient.put('/settings/email', data);
  },
  
  // Password settings
  updatePassword: (data) => {
    return apiClient.put('/settings/password', data);
  },
  
  // Social links
  updateSocialLinks: (data) => {
    return apiClient.put('/settings/social-links', data);
  },
  
  // Notification settings
  getNotificationSettings: () => {
    return apiClient.get('/settings/notifications');
  },
  updateNotificationSettings: (data) => {
    return apiClient.put('/settings/notifications', data);
  },
  
  // Login history
  getLoginHistory: () => {
    return apiClient.get('/settings/last-login');
  },
  
  // Account deletion
  deleteAccount: (data) => {
    return apiClient.delete('/settings/account', { data });
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  settings: settingsAPI
};
