import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, Clock, ArrowRight, UserPlus, UserCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";
import "./Notification.css";

// Import services
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  formatNotificationMessage,
  getNotificationActions,
  getNotificationIcon
} from "../../../services/notificationServices";

import socketService from "../../../services/socket";
import friendService from "../../../services/friendService";

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState({});
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Notification animation timing
  const notificationEntryDelay = 100; // Milliseconds between each notification animation

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch of notifications
    fetchNotifications();

    // Connect socket service
    socketService.connectSocket();

    // Set up socket listener for real-time notifications
    socketService.subscribeToNotifications((notification) => {
      // Add new notification to state
      setNotifications(prev => [notification, ...prev]);

      // Show toast notification if dropdown is closed
      if (!showNotifications) {
        toast(`New notification: ${formatNotificationMessage(notification)}`, {
          icon: getNotificationIcon(notification.type)
        });
      }
    });

    // Set up polling for notifications (every 30 seconds)
    const pollInterval = setInterval(() => {
      if (!showNotifications) { // Only poll when dropdown is closed
        fetchNotifications();
      }
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      socketService.unsubscribeFromNotifications();
    };
  }, [fetchNotifications, showNotifications]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add keyboard navigation for dropdown
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showNotifications) {
        setShowNotifications(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showNotifications]);

  const handleIconClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Refresh notifications when opening the dropdown
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    if (e) e.stopPropagation();

    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification removed");
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to remove notification");
    }
  };

  const handleAcceptFriendRequest = async (notification, e) => {
    e.stopPropagation();
    const userId = notification.from?._id;

    if (!userId) {
      toast.error("Invalid user information");
      return;
    }

    // Set processing state
    setProcessingAction(prev => ({ ...prev, [notification._id]: 'accepting' }));

    try {
      await friendService.acceptFriendRequest(userId);

      // Update notification in state to show accepted
      setNotifications(prev => prev.map(n =>
        n._id === notification._id
          ? { ...n, status: 'accepted', read: true }
          : n
      ));

      toast.success(`Friend request from ${notification.from?.Username || 'user'} accepted`);

      // Mark notification as read
      await handleMarkAsRead(notification._id);

      // After a delay, remove it from the list
      setTimeout(() => {
        handleDeleteNotification(notification._id);
      }, 3000);

    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error(error.message || "Failed to accept friend request");
    } finally {
      // Clear processing state
      setProcessingAction(prev => {
        const newState = { ...prev };
        delete newState[notification._id];
        return newState;
      });
    }
  };

  const handleRejectFriendRequest = async (notification, e) => {
    e.stopPropagation();
    const userId = notification.from?._id;

    if (!userId) {
      toast.error("Invalid user information");
      return;
    }

    // Set processing state
    setProcessingAction(prev => ({ ...prev, [notification._id]: 'rejecting' }));

    try {
      await friendService.rejectFriendRequest(userId);

      // Update notification in state to show rejected
      setNotifications(prev => prev.map(n =>
        n._id === notification._id
          ? { ...n, status: 'rejected', read: true }
          : n
      ));

      toast.success(`Friend request from ${notification.from?.Username || 'user'} declined`);

      // Mark notification as read
      await handleMarkAsRead(notification._id);

      // After a delay, remove it from the list
      setTimeout(() => {
        handleDeleteNotification(notification._id);
      }, 3000);

    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error(error.message || "Failed to decline friend request");
    } finally {
      // Clear processing state
      setProcessingAction(prev => {
        const newState = { ...prev };
        delete newState[notification._id];
        return newState;
      });
    }
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification._id);

    // If notification has a status of accepted or rejected, don't navigate
    if (notification.status === 'accepted' || notification.status === 'rejected') {
      return;
    }

    // Navigate based on notification type
    switch(notification.type) {
      case 'post':
      case 'like':
      case 'comment':
      case 'share':
        if (notification.post) {
          navigate(`/post/${notification.post}`);
        }
        break;
      case 'follow':
      case 'friend_request':
      case 'friend_accept':
        if (notification.from) {
          if (user && user.role) {
            const rolePath = user.role.charAt(0).toUpperCase() + user.role.slice(1);
            navigate(`/${rolePath}/${user._id}/profile/${notification.from._id}`);
          } else {
            navigate(`/profile/${notification.from._id}`);
          }
        }
        break;
      case 'team_invite':
        if (notification.team) {
          navigate(`/teams/${notification.team}`);
        }
        break;
      case 'direct_message':
        navigate(`/messages/${notification.from?._id}`);
        break;
      default:
        // Navigate to the proper path based on user's role
        if (user) {
          const rolePath = user.role.charAt(0).toUpperCase() + user.role.slice(1);
          navigate(`/${rolePath}/${user._id}/notifications`);
        } else {
          // Fallback to a generic path if user data isn't available
          navigate('/notifications');
        }
    }

    // Close the dropdown after navigating
    setShowNotifications(false);
  };

  const handleViewAllClick = () => {
    setShowNotifications(false); // Close the dropdown

    // Navigate to the proper path based on user's role
    if (user) {
      const rolePath = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      navigate(`/${rolePath}/${user._id}/notifications`);
    } else {
      // Fallback to a generic path if user data isn't available
      navigate('/notifications');
    }
  };


  const timeAgo = (timestamp) => {
    const now = new Date().getTime();
    const date = new Date(timestamp).getTime();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // Update the renderNotificationList function for better empty state display
  const renderNotificationList = () => {
    if (loading) {
      return <div className="notification-item loading">Loading notifications...</div>;
    }

    if (error) {
      return <div className="notification-item error">{error}</div>;
    }

    if (!notifications || notifications.length === 0) {
      return (
        <div className="notification-item empty">
          <div className="empty-state">
            <Bell size={32} strokeWidth={1.5} />
            <p>No notifications yet</p>
          </div>
        </div>
      );
    }

    return notifications.map((notification, index) => (
      <div
        className={`notification-item ${notification.read ? "read" : "unread"} ${notification.status || ''}`}
        key={notification._id}
        onClick={() => handleNotificationClick(notification)}
        style={{
          animationDelay: `${index * notificationEntryDelay}ms`,
          opacity: 1 // Start visible for non-JS environments
        }}
      >
        {!notification.read && <span className="blue-circle"></span>}
        <img
          src={notification.from?.profilePicture || "https://i.pravatar.cc/100"}
          alt={notification.from?.Username || "User"}
          className="avatar"
        />
        <div className="notification-content">
          <div className="notification-header">
            <p>
              <strong>{notification.from?.Username || "User"}</strong>{" "}
              {formatNotificationMessage(notification)}
            </p>
            <button
              className="delete-notification"
              onClick={(e) => handleDeleteNotification(notification._id, e)}
              aria-label="Delete notification"
            >
              <X size={14} />
            </button>
          </div>
          <span className="time">
            <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {timeAgo(notification.createdAt)}
          </span>

          {notification.type === 'friend_request' && !notification.status && (
            <div className="notification-buttons">
              <button
                className="accept-btn"
                onClick={(e) => handleAcceptFriendRequest(notification, e)}
                disabled={!!processingAction[notification._id]}
              >
                {processingAction[notification._id] === 'accepting' ?
                  'Accepting...' :
                  <><UserCheck size={14} style={{ marginRight: '4px' }} /> Accept</>
                }
              </button>
              <button
                className="decline-btn"
                onClick={(e) => handleRejectFriendRequest(notification, e)}
                disabled={!!processingAction[notification._id]}
              >
                {processingAction[notification._id] === 'rejecting' ?
                  'Declining...' :
                  <><X size={14} style={{ marginRight: '4px' }} /> Decline</>
                }
              </button>
            </div>
          )}

          {notification.status === 'accepted' && (
            <div className="notification-status accepted">
              <UserCheck size={14} /> Friend request accepted
            </div>
          )}

          {notification.status === 'rejected' && (
            <div className="notification-status rejected">
              <X size={14} /> Friend request declined
            </div>
          )}

          {notification.type === 'team_invite' && !notification.status && (
            <div className="notification-buttons">
              <button
                className="accept-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle team invitation accept
                  toast.info("Team invite acceptance feature coming soon");
                }}
              >
                Accept
              </button>
              <button
                className="decline-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle team invitation decline
                  toast.info("Team invite decline feature coming soon");
                }}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="notification-bar" ref={dropdownRef}>
      <button className="notification-icon notification-button" onClick={handleIconClick} aria-label="Notifications">
        <Bell size={20} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="notification-badge notification-indicator">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h4>Notifications</h4>
            <button
              className="mark-read"
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(n => !n.read)}
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          </div>

          <div className="notifications-list">
            {renderNotificationList()}
          </div>

          <button
            className="view-all"
            onClick={handleViewAllClick}
          >
            <span>View all notifications</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
