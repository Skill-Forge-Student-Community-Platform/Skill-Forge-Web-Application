import React, { useState, useEffect } from "react";
import { BsBell } from "react-icons/bs";  // Replace bootstrap icons with React icons
import "./Notification.css";

const Notification = () => {
  console.log('Notification component rendering');

  useEffect(() => {
    console.log('Notification component mounted');
    return () => {
      console.log('Notification component unmounted');
    };
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=1",
      name: "Sara Johnson",
      action: "mentioned you in a comment in a thread",
      thread: "Project List",
      time: new Date().getTime() - 200000, // Initial time (200 seconds ago)
      isRead: false,
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/40?img=2",
      name: "Nick Jonas",
      action: "created a new goal in",
      thread: "design and development",
      time: new Date().getTime() - 600000, // Initial time (600 seconds ago)
      isRead: false,
    },
    {
      id: 3,
      avatar: "https://i.pravatar.cc/40?img=3",
      name: "Matt Hardy",
      action: "requested to upgrade plan",
      buttons: ["Accept", "Decline"],
      time: new Date().getTime() - 700000, // Initial time (700 seconds ago)
      isRead: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: notifications.length + 1,
        avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 50) + 1}`,
        name: "Random User",
        action: "sent you a message",
        thread: null,
        time: new Date().getTime(),
        isRead: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }, 100000);
    return () => clearInterval(interval);
  }, [notifications]);

  const timeAgo = (timestamp) => {
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour ago`;
    return `${diffInDays} day ago`;
  };

  const handleIconClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleAccept = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleDecline = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    if (notification.thread) {
      console.log(`Navigating to thread: ${notification.thread}`);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="notification-bar">
      <button className="notification-icon" onClick={handleIconClick}>
        <BsBell />  {/* Replace bootstrap icon with React icon */}
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h4>Notifications</h4>
            <button className="mark-read" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          </div>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                className={`notification-item ${
                  notification.isRead ? "read" : "unread"
                }`}
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
              >
                {!notification.isRead && <span className="blue-circle"></span>}
                <img
                  src={notification.avatar}
                  alt={notification.name}
                  className="avatar"
                />
                <div className="notification-content">
                  <p>
                    <strong>{notification.name}</strong> {notification.action}{" "}
                    {notification.thread && <a href="#">{notification.thread}</a>}
                  </p>
                  <span className="time">{timeAgo(notification.time)}</span>
                  {notification.buttons && (
                    <div className="notification-buttons">
                      <button
                        className="accept-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(notification.id);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="decline-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecline(notification.id);
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="view-all">View all notifications</button>
        </div>
      )}
    </div>
  );
};

export default Notification;
