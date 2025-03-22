import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsBell, BsTrash, BsCheckAll, BsPersonPlus, BsPersonCheck } from 'react-icons/bs';
import {
  getNotifications,
  markAllAsRead,
  deleteAllNotifications,
  deleteNotification,
  markAsRead,
  formatNotificationMessage,
  getNotificationActions
} from '../../services/notificationServices';
import ProfileOverview from '../Home_page/Home_components/ProfileOverview';
import Trending_Data from '../Home_page/Home_components/Trending_Data';
import { useAuthStore } from '../../store/authStore';
import ProfileAvatar from '../Home_page/Home_components/ProfileAvatar';
import './NotificationPage.css';

export default function NotificationPage({ userId }) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestedConnections, setSuggestedConnections] = useState([
    { _id: 'u1', Username: 'Alex Johnson', profilePicture: 'https://i.pravatar.cc/150?img=11', role: 'Student' },
    { _id: 'u2', Username: 'Maya Peterson', profilePicture: 'https://i.pravatar.cc/150?img=5', role: 'Organizer' },
    { _id: 'u3', Username: 'David Wilson', profilePicture: 'https://i.pravatar.cc/150?img=15', role: 'Student' },
    { _id: 'u4', Username: 'Sophia Chen', profilePicture: 'https://i.pravatar.cc/150?img=25', role: 'Student' }
  ]);

  const [activityStats, setActivityStats] = useState({
    today: 5,
    week: 23,
    month: 86,
    unread: 12
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    // In a real implementation, we'd also fetch suggested connections here
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
        setActivityStats(prev => ({
          ...prev,
          unread: response.notifications.filter(n => !n.read).length
        }));
      }
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(notif => ({...notif, read: true})));
      setActivityStats(prev => ({...prev, unread: 0}));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      try {
        await deleteAllNotifications();
        setNotifications([]);
        setActivityStats(prev => ({...prev, unread: 0}));
      } catch (err) {
        console.error("Error deleting all notifications:", err);
      }
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const notif = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      if (notif && !notif.read) {
        setActivityStats(prev => ({...prev, unread: prev.unread - 1}));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      const wasUnread = notifications.find(n => n._id === id && !n.read);
      setNotifications(prev => prev.map(notif =>
        notif._id === id ? {...notif, read: true} : notif
      ));
      if (wasUnread) {
        setActivityStats(prev => ({...prev, unread: prev.unread - 1}));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    // Navigation logic based on notification type
    switch(notification.type) {
      case 'post':
      case 'like':
      case 'comment':
        if (notification.post) {
          navigate(`/post/${notification.post}`);
        }
        break;
      case 'follow':
        if (notification.from) {
          navigate(`/profile/${notification.from._id}`);
        }
        break;
      case 'team_invite':
        if (notification.team) {
          navigate(`/teams/${notification.team}`);
        }
        break;
      default:
        // Do nothing, just mark as read
        break;
    }
  };

  const handleConnectWithUser = (userId, e) => {
    e.preventDefault();
    // This would call an API to connect with the user
    console.log(`Connect with user: ${userId}`);
    // For demo, let's just update the UI
    setSuggestedConnections(prev =>
      prev.map(u => u._id === userId ? {...u, isConnected: true} : u)
    );
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);

    // Format date for today's notifications
    if (now.toDateString() === date.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Format date for recent notifications (within last 7 days)
    const dayDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (dayDiff < 7) {
      return `${dayDiff === 0 ? 'Today' : dayDiff === 1 ? 'Yesterday' : date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Format date for older notifications
    return date.toLocaleDateString();
  };

  const groupNotificationsByDate = (notifs) => {
    const groups = {};

    notifs.forEach(notification => {
      const date = new Date(notification.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return groups;
  };

  const notificationGroups = groupNotificationsByDate(notifications);

  return (
    <div className="flex justify-center w-full bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-[1128px] xl:max-w-[1128px] lg:max-w-[990px] px-4">
        {/* Three column layout with responsive visibility - changed to row at md breakpoint */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Profile Overview - visible on medium screens and larger */}
          <div className="w-full hidden md:block md:w-[240px] lg:w-[260px] xl:w-[260px] shrink-0 sidebar-margin">
            <div className="sticky top-0">
              <ProfileOverview user={user} />
            </div>
          </div>

          {/* Middle column - Notifications - always visible, smaller on medium screens */}
          <main className="w-full sm:max-w-[600px] md:w-[calc(100%-230px)] lg:w-[520px] xl:w-[540px] shrink-0 overflow-y-auto mx-auto md:mx-0">
            <div className="mb-4 bg-white rounded-lg shadow-sm">
              <div className="notifications-page">
                <div className="notifications-page-header">
                  <div className="notifications-title">
                    <BsBell className="bell-icon" />
                    <h1>Notifications</h1>
                  </div>

                  <div className="notifications-actions">
                    <button onClick={handleMarkAllAsRead} disabled={notifications.every(n => n.read)}>
                      <BsCheckAll /> Mark all as read
                    </button>
                    <button onClick={handleDeleteAll} disabled={notifications.length === 0}>
                      <BsTrash /> Delete all
                    </button>
                  </div>
                </div>

                {loading && <div className="notifications-loading">Loading notifications...</div>}

                {error && <div className="notifications-error">{error}</div>}

                {!loading && !error && notifications.length === 0 && (
                  <div className="no-notifications">
                    <BsBell className="empty-bell" />
                    <h2>No notifications</h2>
                    <p>You're all caught up! Check back later for new notifications.</p>
                  </div>
                )}

                {!loading && !error && Object.keys(notificationGroups).map(date => (
                  <div key={date} className="notification-group">
                    <div className="date-header">{new Date(date).toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}</div>

                    {notificationGroups[date].map(notification => (
                      <div
                        key={notification._id}
                        className={`notification-item ${notification.read ? "read" : "unread"}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="notification-avatar">
                          <ProfileAvatar
                            userId={notification.from?._id}
                            staticImageUrl={notification.from?.profilePicture || "https://i.pravatar.cc/50"}
                            customAltText={notification.from?.Username || "User"}
                            size="medium"
                            showLevel={false}
                          />
                          {!notification.read && <span className="unread-indicator"></span>}
                        </div>

                        <div className="notification-content">
                          <div className="notification-text">
                            <p>{formatNotificationMessage(notification)}</p>
                            <span className="time">{timeAgo(notification.createdAt)}</span>
                          </div>

                          {getNotificationActions(notification.type) && (
                            <div className="notification-buttons">
                              {notification.type === 'team_invite' && (
                                <>
                                  <button className="accept-btn">Accept</button>
                                  <button className="decline-btn">Decline</button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          className="delete-notification"
                          onClick={(e) => handleDeleteNotification(notification._id, e)}
                          aria-label="Delete notification"
                        >
                          <BsTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Right column - Activity Summary and People You May Know - only visible on large screens and up */}
          <div className="hidden lg:block w-full lg:w-[300px] xl:w-[300px] shrink-0">
            <div className="sticky top-0">
              {/* Activity statistics card */}
              <div className="sidebar-card mb-4">
                <h3>Activity Summary</h3>
                <div className="activity-stats">
                  <div className="stat-item">
                    <span className="stat-label">Today</span>
                    <span className="stat-value">{activityStats.today}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">This Week</span>
                    <span className="stat-value">{activityStats.week}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">This Month</span>
                    <span className="stat-value">{activityStats.month}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Unread</span>
                    <span className="stat-value highlight">{activityStats.unread}</span>
                  </div>
                </div>
              </div>

              {/* People you may know card */}
              <div className="sidebar-card mb-4">
                <h3>People You May Know</h3>
                <div className="connection-suggestions">
                  {suggestedConnections.map(user => (
                    <div key={user._id} className="suggested-user">
                      <ProfileAvatar
                        userId={user._id}
                        staticImageUrl={user.profilePicture}
                        customAltText={user.Username}
                        size="small"
                        showLevel={false}
                      />
                      <div className="user-profile-info">
                        <span className="username">{user.Username}</span>
                        <span className="role">{user.role}</span>
                      </div>
                      <button
                        className="connect-btn"
                        onClick={(e) => handleConnectWithUser(user._id, e)}
                        disabled={user.isConnected}
                      >
                        {user.isConnected ? <BsPersonCheck /> : <BsPersonPlus />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending data component from Home */}
              <Trending_Data />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
