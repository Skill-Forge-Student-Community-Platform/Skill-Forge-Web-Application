import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import PeopleYouMayKnow from "./Friends/PeopleYouMayKnow";
import AllFriends from "./Friends/AllFriends";
import FollowingFollowers from "./Friends/FollowingFollowers";
import NetworkSidebar from "./NetworkSidebar";
import PendingInvitations from "./Friends/PendingInvitations";
import { useAuthStore } from "../../store/authStore";
import friendService from "../../services/friendService";
import socketService from "../../services/socket";
import "./Friendspage.css";

const Friendspage = () => {
  const [connectionCount, setConnectionCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to socket for real-time updates
    socketService.connectSocket();

    // Initial data fetch
    fetchNetworkData();

    // Set up socket listeners for real-time updates
    socketService.subscribeToFriendRequests({
      onRequestReceived: () => {
        console.log("Friend request received event");
        fetchPendingRequestsCount();
      },
      onRequestAccepted: () => {
        console.log("Friend request accepted event");
        fetchFriendsCount();
        fetchPendingRequestsCount();
      },
      onRequestRejected: () => {
        console.log("Friend request rejected event");
        fetchPendingRequestsCount();
      },
      onFriendRemoved: () => {
        console.log("Friend removed event");
        fetchFriendsCount();
      }
    });

    // Clean up listeners on unmount
    return () => {
      socketService.unsubscribeFromFriendRequests();
    };
  }, [user]);

  const fetchNetworkData = async () => {
    fetchFriendsCount();
    fetchPendingRequestsCount();
  };

  const fetchFriendsCount = async () => {
    try {
      const friends = await friendService.getFriends();
      setConnectionCount(friends.length);
    } catch (error) {
      console.error("Error fetching friends count:", error);
    }
  };

  const fetchPendingRequestsCount = async () => {
    try {
      const requests = await friendService.getFriendRequests();
      setPendingRequestCount(requests.length);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  // Component to show when no specific route is matched - DEFAULT PAGE
  const DefaultNetworkPage = () => (
    <div className="w-full flex flex-col gap-6">
      {/* PendingInvitations always visible at the top */}
      <PendingInvitations
        onAcceptRequest={() => {
          fetchFriendsCount();
          fetchPendingRequestsCount();
        }}
        onRejectRequest={() => fetchPendingRequestsCount()}
      />

      {/* People You May Know below */}
      <PeopleYouMayKnow onFriendRequest={fetchPendingRequestsCount} />
    </div>
  );

  // Base path construction for consistent routing
  const getBasePath = () => {
    if (!user?._id || !user?.role) return "/network";
    const formattedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    return `/${formattedRole}/${user._id}/network`;
  };

  return (
    <div className="network-layout">
      {/* Left sidebar */}
      <div className="network-sidebar-container">
        <NetworkSidebar
          connectionCount={connectionCount}
          pendingCount={pendingRequestCount}
          currentPath={location.pathname}
          userId={user?._id}
          roleType={user?.role}
        />
      </div>

      {/* Main content area */}
      <div className="network-content">
        <Routes>
          {/* Default route (Home) */}
          <Route path="/" element={<DefaultNetworkPage />} />

          {/* Connection management routes */}
          <Route path="/connections" element={<AllFriends activeTab="friends" />} />
          <Route path="/requests" element={<AllFriends activeTab="requests" />} />
          <Route path="/following" element={<FollowingFollowers />} />

          {/* Coming soon features */}
          <Route path="/groups" element={
            <div className="coming-soon-container">
              <h3 className="coming-soon-title">Groups Feature</h3>
              <p className="coming-soon-description">
                Group functionality is coming soon. Stay tuned for updates!
              </p>
            </div>
          } />
          <Route path="/events" element={
            <div className="coming-soon-container">
              <h3 className="coming-soon-title">Network Events</h3>
              <p className="coming-soon-description">
                Network events feature is under development. Check back soon!
              </p>
            </div>
          } />

          {/* Redirect all other paths to network home */}

          <Route path="*" element={<Navigate to={getBasePath()} replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Friendspage;
