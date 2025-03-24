import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import friendService from '../../../services/friendService';
import { User, Check, X, ChevronRight } from 'lucide-react';
import './PendingInvitations.css';

const PendingInvitations = ({ onAcceptRequest, onRejectRequest }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await friendService.getFriendRequests();
      setRequests(response);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    setProcessingIds(prev => ({ ...prev, [userId]: 'accepting' }));
    try {
      await friendService.acceptFriendRequest(userId);
      toast.success('Friend request accepted!');

      // Remove from requests list
      setRequests(prev => prev.filter(req => req._id !== userId));

      // Call parent callback if provided
      if (onAcceptRequest) onAcceptRequest();
    } catch (error) {
      toast.error(error.message || 'Failed to accept request');
    } finally {
      setProcessingIds(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const handleReject = async (userId) => {
    setProcessingIds(prev => ({ ...prev, [userId]: 'rejecting' }));
    try {
      await friendService.rejectFriendRequest(userId);
      toast.success('Friend request declined');

      // Remove from requests list
      setRequests(prev => prev.filter(req => req._id !== userId));

      // Call parent callback if provided
      if (onRejectRequest) onRejectRequest();
    } catch (error) {
      toast.error(error.message || 'Failed to decline request');
    } finally {
      setProcessingIds(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const goToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const goToManageInvitations = () => {
    navigate('/network/requests');
  };

  if (loading) {
    return (
      <div className="pending-invitations-container">
        <div className="skeleton-loading">
          <div className="skeleton-header"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="pending-invitations-container">
        <div className="invitations-header">
          <h2>Pending Invitations</h2>
        </div>
        <div className="no-invitations">
          No pending friend requests at this time.
        </div>
      </div>
    );
  }

  return (
    <div className="pending-invitations-container">
      <div className="invitations-header">
        <h2>Pending Invitations ({requests.length})</h2>
        <button

          className="manage-invitations-btn"
          onClick={goToManageInvitations}
        >
          Manage <ChevronRight size={16} />
        </button>
      </div>

      <div className="invitations-list">
        {requests.slice(0, 3).map(request => (
          <div key={request._id} className="invitation-card">
            <div className="invitation-profile" onClick={() => goToProfile(request._id)}>
              {request.profilePicture ? (
                <img
                  src={request.profilePicture}
                  alt={request.Username}
                  className="invitation-avatar"
                />
              ) : (
                <div className="default-avatar">
                  <User size={24} />
                </div>
              )}

              <div className="invitation-details">
                <h3 className="invitation-name">{request.Username}</h3>
                <p className="invitation-info">{request.role}</p>
              </div>
            </div>

            <div className="invitation-actions">
              <button
                className="accept-btn"
                onClick={() => handleAccept(request._id)}
                disabled={processingIds[request._id]}
              >
                {processingIds[request._id] === 'accepting' ? (
                  <span className="processing-text">Accepting...</span>
                ) : (
                  <>
                    <Check size={16} /> Accept
                  </>
                )}
              </button>

              <button
                className="decline-btn"
                onClick={() => handleReject(request._id)}
                disabled={processingIds[request._id]}
              >
                {processingIds[request._id] === 'rejecting' ? (
                  <span className="processing-text">Declining...</span>
                ) : (
                  <>
                    <X size={16} /> Decline
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {requests.length > 3 && (
          <button
            className="view-more-btn"
            onClick={goToManageInvitations}
          >
            View all {requests.length} invitations
          </button>
        )}
      </div>
    </div>
  );
};

export default PendingInvitations;
