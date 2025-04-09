// Utility to determine environment and provide appropriate URLs

// Check if we're in production mode
export const isProd = process.env.REACT_APP_ENV === 'production' ||
                     window.location.hostname.includes('render.com') ||
                     window.location.hostname.includes('skill-forge.io');

// Get the appropriate base URL for API calls based on environment
export const getApiBaseUrl = () => {
  return isProd
    ? 'https://server.skill-forge.io/api'
    : 'http://localhost:5000/api';
};

// Get the appropriate base URL for auth API calls
export const getAuthApiUrl = () => {
  return isProd
    ? 'https://server.skill-forge.io/api/auth'
    : 'http://localhost:5000/api/auth';
};

// Get the appropriate Socket.IO server URL
export const getSocketUrl = () => {
  return isProd
    ? 'https://server.skill-forge.io'
    : 'http://localhost:5000';
};

// Get the appropriate client URL (frontend)
export const getClientUrl = () => {
  return isProd
    ? 'https://www.skill-forge.io'
    : 'http://localhost:3000';
};

// Get URL for file uploads/static files
export const getStaticUrl = () => {
  return isProd
    ? 'https://server.skill-forge.io'
    : 'http://localhost:5000';
};
