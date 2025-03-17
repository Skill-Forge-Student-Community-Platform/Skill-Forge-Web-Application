import React, { useState } from "react";
import "./AllFriends.css";
import FriendRequests from "./FriendRequests";

const AllFriends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [friends, setFriends] = useState([
    { id: 1, name: "Hafizh Abiyy", role: "UX Designer at Papakos", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Darrell Steward", role: "Web Developer Enthusiast", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "Jane Cooper", role: "UI Designer at Papakos", avatar: "https://i.pravatar.cc/40?img=3" },
    { id: 4, name: "Floyd Miles", role: "UX Researcher at Guyon", avatar: "https://i.pravatar.cc/40?img=4" },
    { id: 5, name: "Wade Warren", role: "Frontend Developer", avatar: "https://i.pravatar.cc/40?img=5" },
  ]);

  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const [removedRequests, setRemovedRequests] = useState([]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Function to navigate to profile (Replace with React Router if needed)
  const goToProfile = (id) => {
    alert(`Navigating to ${friends.find((friend) => friend.id === id).name}'s profile...`);
    // Replace with actual routing logic
    window.location.href = `/profile/${id}`;
  };

  // Function to add confirmed friends to "All Friends"
  const addToFriends = (newFriend) => {
    setFriends((prevFriends) => {
      if (!prevFriends.some((friend) => friend.id === newFriend.id)) {
        return [...prevFriends, { ...newFriend, role: "New Friend" }];
      }
      return prevFriends;
    });

    setConfirmedFriends((prevConfirmed) => [...prevConfirmed, newFriend.id]);
  };

  // Function to remove a request when "Delete" is clicked
  const removeFromRequests = (id) => {
    setRemovedRequests((prevRemoved) => [...prevRemoved, id]);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const removeFriend = (id) => {
    setFriends(friends.filter((friend) => friend.id !== id));
    setActiveDropdown(null);
  };

  return (
    <div className="friends-tabs">
      <div className="tabs-header">
        <button className={activeTab === "friends" ? "tab active" : "tab"} onClick={() => setActiveTab("friends")}>
          All Friends
        </button>
        <button className={activeTab === "requests" ? "tab active" : "tab"} onClick={() => setActiveTab("requests")}>
          Friend Requests
        </button>
      </div>
      <div className="tabs-content">
        {activeTab === "requests" ? (
          <FriendRequests 
            addToFriends={addToFriends} 
            confirmedFriends={confirmedFriends} 
            removeFromRequests={removeFromRequests} 
            removedRequests={removedRequests} 
          />
        ) : (
          <div className="friend-list">
            {friends.length === 0 ? (
              <p className="no-friends">No friends yet</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className="friend-card" onClick={() => goToProfile(friend.id)}>
                  <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                  <div className="friend-info">
                    <p className="friend-name">{friend.name}</p>
                    <p className="friend-role">{friend.role}</p>
                  </div>
                  <button className="message-btn">Message</button>
                  <div className="dropdown-container">
                    <button className="more-options" onClick={(e) => {
                      e.stopPropagation(); // Prevent profile navigation when clicking ⋮
                      toggleDropdown(friend.id);
                    }}>⋮</button>
                    {activeDropdown === friend.id && (
                      <div className="dropdown-menu">
                        <button onClick={(e) => {
                          e.stopPropagation(); // Prevent profile navigation when clicking remove
                          removeFriend(friend.id);
                        }} className="remove-btn">Remove Connection</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFriends;
