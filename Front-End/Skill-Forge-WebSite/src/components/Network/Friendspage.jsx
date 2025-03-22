import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PeopleYouMayKnow from "./Friends/PeopleYouMayKnow";
import AllFriends from "./Friends/AllFriends";
import FollowingFollowers from "./Friends/FollowingFollowers";
import NetworkSidebar from "./NetworkSidebar";
import { useAuthStore } from "../../store/authStore";
import friendService from "../../services/friendService";
import socketService from "../../services/socket";
import "./Friendspage.css";

const Friendspage = () => {
  const [connectionCount, setConnectionCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const { user } = useAuthStore();
  const location = useLocation();

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

  // Component to show when no specific route is matched
  const DefaultNetworkPage = () => (
    <div className="w-full flex flex-col gap-5">
      <PeopleYouMayKnow onFriendRequest={fetchPendingRequestsCount} />
      <AllFriends
        onAcceptRequest={() => {
          fetchFriendsCount();
          fetchPendingRequestsCount();
        }}
        onRejectRequest={fetchPendingRequestsCount}
        onRemoveFriend={fetchFriendsCount}
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-5">
      {/* Left sidebar */}
      <div className="w-full md:w-[260px] shrink-0 md:mr-5 mb-4 md:mb-0">
        <NetworkSidebar
          connectionCount={connectionCount}
          pendingCount={pendingRequestCount}
          currentPath={location.pathname}
          userId={user?._id}
          roleType={user?.role}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DefaultNetworkPage />} />
          <Route path="/connections" element={<AllFriends activeTab="friends" />} />
          <Route path="/requests" element={<AllFriends activeTab="requests" />} />
          <Route path="/following" element={<FollowingFollowers />} />
          <Route path="/groups" element={
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Groups Feature</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Group functionality is coming soon. Stay tuned for updates!
              </p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/network" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Friendspage;
