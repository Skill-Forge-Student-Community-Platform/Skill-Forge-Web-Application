// Configuration for the application

// API URL - Use environment variable or fallback to default
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Socket connection URL - typically same as API but can be different
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Default avatar path
export const DEFAULT_AVATAR = '/assets/default-avatar.png';

// Application settings
export const APP_SETTINGS = {
  maxUploadSize: 5 * 1024 * 1024, // 5MB
  supportedImageFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  pageSize: 10,
  debounceTime: 300 // ms
};
