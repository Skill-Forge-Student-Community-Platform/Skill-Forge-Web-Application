import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

// Configure axios with credentials for auth cookies
const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all notifications for the current user
 */
export const getNotifications = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark a specific notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`${API_URL}/read/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.patch(`${API_URL}/read/all`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`${API_URL}/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Delete all notifications
 */
export const deleteAllNotifications = async () => {
  try {
    const response = await api.delete(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};

/**
 * Format notification message based on type
 */
export const formatNotificationMessage = (notification) => {
  const { type } = notification;

  switch (type) {
    case 'like':
      return 'liked your post';
    case 'comment':
      return 'commented on your post';
    case 'follow':
      return 'started following you';
    case 'friend_request':
      return 'sent you a friend request';
    case 'friend_accept':
      return 'accepted your friend request';
    case 'share':
      return 'shared your post';
    case 'mention':
      return 'mentioned you in a post';
    case 'team_invite':
      return 'invited you to join a team';
    case 'direct_message':
      return 'sent you a message';
    default:
      return 'interacted with your content';
  }
};

/**
 * Get notification actions based on type
 */
export const getNotificationActions = (type) => {
  switch (type) {
    case 'follow':
      return ['View Profile'];
    case 'direct_message':
      return ['Reply'];
    case 'friend_request':
      return ['accept', 'decline'];
    case 'team_invite':
      return ['accept', 'decline'];
    default:
      return null;
  }
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type) => {
  switch (type) {
    case 'like':
      return '👍';
    case 'comment':
      return '💬';
    case 'follow':
      return '👤';
    case 'friend_request':
      return '🤝';
    case 'friend_accept':
      return '✅';
    case 'share':
      return '🔄';
    case 'mention':
      return '@';
    case 'team_invite':
      return '👥';
    case 'direct_message':
      return '✉️';
    default:
      return '🔔';
  }
};
