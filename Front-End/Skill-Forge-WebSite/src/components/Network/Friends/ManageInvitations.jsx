import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { X, UserCheck, UserX } from 'lucide-react';
import friendService from "../../../services/friendService";
import "./ManageInvitations.css";

const ManageInvitations = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'received') {
        const response = await friendService.getFriendRequests();
        setReceivedRequests(response);
      } else {
        const response = await friendService.getSentRequests(); // You'll need to implement this endpoint
        setSentRequests(response);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      setProcessingIds(prev => [...prev, userId]);
      await friendService.acceptFriendRequest(userId);
      toast.success("Friend request accepted!");
      setReceivedRequests(receivedRequests.filter(request => request._id !== userId));
    } catch (error) {
      toast.error(error.message || "Failed to accept request");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      setProcessingIds(prev => [...prev, userId]);
      await friendService.rejectFriendRequest(userId);
      toast.success("Friend request declined");
      setReceivedRequests(receivedRequests.filter(request => request._id !== userId));
    } catch (error) {
      toast.error(error.message || "Failed to decline request");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleCancelRequest = async (userId) => {
    try {
      setProcessingIds(prev => [...prev, userId]);
      await friendService.cancelFriendRequest(userId);
      toast.success("Friend request withdrawn");
      setSentRequests(sentRequests.filter(request => request._id !== userId));
    } catch (error) {
      toast.error(error.message || "Failed to withdraw request");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleIgnoreAll = async () => {
    // Implement this feature later
    toast.info("This feature is coming soon");
  };

  const goToProfile = (userId) => {
    window.location.href = `/profile/${userId}`;
  };

  return (
    <div className="invitations-container">
      <div className="invitations-header">
        <h2>Manage Invitations</h2>

        {activeTab === 'received' && receivedRequests.length > 0 && (
          <button
            className="ignore-all-btn"
            onClick={handleIgnoreAll}
          >
            Ignore All
          </button>
        )}
      </div>

      <div className="invitation-tabs">
        <button
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received
        </button>
        <button
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent
        </button>
      </div>

      <div className="invitations-list">
        {loading ? (
          <div className="loading-state">Loading invitations...</div>
        ) : activeTab === 'received' ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map(request => (
              <div key={request._id} className="invitation-card">
                <div className="user-info" onClick={() => goToProfile(request._id)}>
                  <img
                    src={request.profilePicture || "https://via.placeholder.com/50"}
                    alt={request.Username}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h3 className="user-name">{request.Username}</h3>
                    <p className="user-about">{request.bio || (request.role === 'student' ? 'Student' : 'Organizer')}</p>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptRequest(request._id)}
                    disabled={processingIds.includes(request._id)}
                  >
                    <UserCheck size={18} />
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleRejectRequest(request._id)}
                    disabled={processingIds.includes(request._id)}
                  >
                    <X size={18} />
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No received invitations</p>
            </div>
          )
        ) : (
          sentRequests.length > 0 ? (
            sentRequests.map(request => (
              <div key={request._id} className="invitation-card">
                <div className="user-info" onClick={() => goToProfile(request._id)}>
                  <img
                    src={request.profilePicture || "https://via.placeholder.com/50"}
                    alt={request.Username}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h3 className="user-name">{request.Username}</h3>
                    <p className="user-about">{request.bio || (request.role === 'student' ? 'Student' : 'Organizer')}</p>
                  </div>
                </div>

                <button
                  className="withdraw-btn"
                  onClick={() => handleCancelRequest(request._id)}
                  disabled={processingIds.includes(request._id)}
                >
                  <UserX size={18} />
                  Withdraw
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No pending invitations sent</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ManageInvitations;
