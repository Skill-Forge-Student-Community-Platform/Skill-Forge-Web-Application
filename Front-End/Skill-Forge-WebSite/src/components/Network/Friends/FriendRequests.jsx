import React, { useState } from "react";
import ProfileAvatar from "../../Home_page/Home_components/ProfileAvatar";
import "./FriendRequests.css";

const FriendRequests = ({ addToFriends, confirmedFriends, removeFromRequests, removedRequests }) => {
  const [requests, setRequests] = useState([

  ]);

  // Function to navigate to the user's profile
  const goToProfile = (id) => {
    alert(`Navigating to ${requests.find((user) => user.id === id).name}'s profile...`);
  };

  // Function to confirm request, move user to "All Friends", and remove from "Friend Requests"
  const confirmRequest = (id) => {
    const acceptedUser = requests.find((request) => request.id === id);
    if (acceptedUser) {
      addToFriends(acceptedUser); // ✅ Add user to "All Friends"
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id)); // ✅ Remove from friend requests
    }
  };

  // Function to delete a request
  const deleteRequest = (id) => {
    removeFromRequests(id); // ✅ Track removed requests
    setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id)); // ✅ Remove from UI
  };

  return (
    <div className="friend-requests-container">
      {requests.length === 0 ? (
        <p className="no-friends">No pending friend requests</p>
      ) : (
        requests
          .filter((request) => !confirmedFriends.includes(request.id) && !removedRequests.includes(request.id)) // ✅ Remove confirmed & deleted requests
          .map((request) => (
            <div key={request.id} className="friend-request-card">
              <div className="friend-request-header" onClick={() => goToProfile(request.id)}>
                <ProfileAvatar
                  staticImageUrl={request.avatar}
                  customAltText={request.name}
                  size="small"
                  showLevel={false}
                  showMembershipTag={false}
                  className="request-avatar"
                />
                <div className="request-info">
                  <p className="request-name"><strong>{request.name}</strong> sent you a friend request.</p>
                  <p className="request-time">{request.time} {request.mutualFriends && `· ${request.mutualFriends}`}</p>
                </div>
              </div>
              <div className="request-actions">
                <button className="confirm-btn" onClick={() => confirmRequest(request.id)}>Confirm</button>
                <button className="delete-btn" onClick={() => deleteRequest(request.id)}>Delete</button>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default FriendRequests;
