import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { getSocketUrl } from '../utils/environment';

// Create socket instance with authentication
const socket = io(getSocketUrl(), {
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

// Connection management
const connectSocket = () => {
  const { user } = useAuthStore.getState();

  if (user && !socket.connected) {
    socket.auth = { userId: user._id };
    socket.connect();

    console.log('Socket connecting for user:', user._id);

    // Handle connection events
    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join', { userId: user._id });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Socket reconnection attempt: ${attempt}`);
    });
  }
};

// Disconnect socket
const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected');
  }
};

// Listen for new notifications
const subscribeToNotifications = (callback) => {
  socket.on('new_notification', (notification) => {
    console.log('New notification received:', notification);
    callback(notification);
  });
};

// Listen for friend request notifications
const subscribeToFriendRequests = (callbacks) => {
  // New friend request received
  socket.on('friend_request_received', (data) => {
    console.log('Friend request received socket event:', data);
    if (callbacks.onRequestReceived) {
      callbacks.onRequestReceived(data);
    }
  });

  // Friend request accepted
  socket.on('friend_request_accepted', (data) => {
    console.log('Friend request accepted socket event:', data);
    if (callbacks.onRequestAccepted) {
      callbacks.onRequestAccepted(data);
    }
  });

  // Friend request rejected
  socket.on('friend_request_rejected', (data) => {
    console.log('Friend request rejected socket event:', data);
    if (callbacks.onRequestRejected) {
      callbacks.onRequestRejected(data);
    }
  });

  // Friend request cancelled
  socket.on('friend_request_cancelled', (data) => {
    console.log('Friend request cancelled socket event:', data);
    if (callbacks.onRequestCancelled) {
      callbacks.onRequestCancelled(data);
    }
  });

  // Friend removed
  socket.on('friend_removed', (data) => {
    console.log('Friend removed socket event:', data);
    if (callbacks.onFriendRemoved) {
      callbacks.onFriendRemoved(data);
    }
  });
};

// Cleanup notification listeners
const unsubscribeFromNotifications = () => {
  socket.off('new_notification');
};

// Cleanup friend request listeners
const unsubscribeFromFriendRequests = () => {
  socket.off('friend_request_received');
  socket.off('friend_request_accepted');
  socket.off('friend_request_rejected');
  socket.off('friend_request_cancelled');
  socket.off('friend_removed');
};

// Subscribe to typing indicators for messaging
const subscribeToTyping = (conversationId, callback) => {
  socket.on(`typing:${conversationId}`, (data) => {
    callback(data);
  });
};

// Emit typing event
const emitTyping = (conversationId, isTyping) => {
  socket.emit('typing', { conversationId, isTyping });
};

// Get connection status
const isConnected = () => socket.connected;

// Assign to a variable before exporting (to fix ESLint warning)
const socketService = {
  socket,
  connectSocket,
  disconnectSocket,
  subscribeToNotifications,
  unsubscribeFromNotifications,
  subscribeToFriendRequests,
  unsubscribeFromFriendRequests,
  subscribeToTyping,
  emitTyping,
  isConnected
};

export default socketService;
