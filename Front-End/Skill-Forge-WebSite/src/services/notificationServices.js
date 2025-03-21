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
 * Delete a specific notification
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
  const { type, message } = notification;

  // If there's already a custom message, use it
  if (message) return message;

  // Username of the person who triggered the notification
  const username = notification.from?.Username || 'Someone';

  switch (type) {
    case 'follow':
      return `started following you`;
    case 'like':
      return `liked your post`;
    case 'comment':
      return `commented on your post`;
    case 'mention':
      return `mentioned you in a post`;
    case 'team_invite':
      return `invited you to join their team`;
    case 'event_updates':
      return `There's an update on an event you're following`;
    case 'workshop_updates':
      return `There's an update on a workshop you're enrolled in`;
    case 'direct_message':
      return `sent you a message`;
    case 'group_message':
      return `sent a message in a group you're part of`;
    case 'portfolio_view':
      return `viewed your portfolio`;
    default:
      return `interacted with your content`;
  }
};

/**
 * Determine if a notification type should show action buttons
 */
export const getNotificationActions = (type) => {
  switch (type) {
    case 'follow':
      return ['View Profile'];
    case 'team_invite':
      return ['Accept', 'Decline'];
    case 'direct_message':
      return ['Reply'];
    default:
      return null;
  }
};

/**
 * Get notification icon based on type
 * This is useful if you want to show different icons for different notification types
 */
export const getNotificationIcon = (type) => {
  switch (type) {
    case 'follow':
      return 'user-plus';
    case 'like':
      return 'heart';
    case 'comment':
      return 'message-square';
    case 'mention':
      return 'at-sign';
    case 'team_invite':
      return 'users';
    case 'event_updates':
      return 'calendar';
    case 'workshop_updates':
      return 'book-open';
    case 'direct_message':
      return 'mail';
    case 'group_message':
      return 'message-circle';
    case 'portfolio_view':
      return 'eye';

    default:
      return 'bell';
  }
};

/**
 * Mock function for testing: generate random notifications
 * In production, you'd remove this function
 */
export const generateMockNotifications = (count = 10) => {
  const types = [
    'follow', 'like', 'comment', 'mention', 'team_invite',
    'event_updates', 'workshop_updates', 'direct_message',
    'group_message', 'portfolio_view'
  ];

  const usernames = [
    'John Smith', 'Sophia Rodriguez', 'Ahmed Khan',
    'Emma Wilson', 'David Lee', 'Jane Doe'
  ];

  const notifications = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    const hours = Math.floor(Math.random() * 72); // Random time within last 72 hours

    notifications.push({
      _id: `mock-${i}`,
      from: {
        _id: `user-${i}`,
        Username: username,
        profilePicture: `https://i.pravatar.cc/150?img=${i + 10}`
      },
      to: 'current-user',
      type,
      createdAt: new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),
      read: Math.random() > 0.5, // Random read status
      post: type === 'like' || type === 'comment' ? `post-${i}` : undefined,
      team: type === 'team_invite' ? `team-${i}` : undefined
    });
  }

  return {
    success: true,
    notifications: notifications.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt))
  };
};
