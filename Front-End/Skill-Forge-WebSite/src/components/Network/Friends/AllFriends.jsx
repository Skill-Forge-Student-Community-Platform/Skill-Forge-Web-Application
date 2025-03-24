import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserMinus, MessageSquare, MoreHorizontal, Search, UserCheck, X } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import friendService from "../../../services/friendService";
import { toast } from 'react-hot-toast';
import "./AllFriends.css";

const AllFriends = ({ activeTab: initialTab = 'friends' }) => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchTerm, setSearchTerm] = useState("");
    const [processingUsers, setProcessingUsers] = useState(new Set());
    const [openDropdowns, setOpenDropdowns] = useState({});
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'friends') {
            loadFriends();
        } else {
            loadFriendRequests();
        }
    }, [activeTab]);

    const loadFriends = async () => {
        try {
            setLoading(true);
            const response = await friendService.getFriends();
            setFriends(response);
        } catch (error) {
            toast.error(error.message || "Failed to load friends");
        } finally {
            setLoading(false);
        }
    };

    const loadFriendRequests = async () => {
        try {
            setRequestsLoading(true);
            const response = await friendService.getFriendRequests();
            setRequests(response);
        } catch (error) {
            toast.error(error.message || "Failed to load friend requests");
        } finally {
            setRequestsLoading(false);
        }
    };

    const handleAcceptRequest = async (userId) => {
        try {
            setProcessingUsers(prev => new Set(prev).add(userId));
            await friendService.acceptFriendRequest(userId);
            toast.success("Friend request accepted!");
            // Remove from requests list
            setRequests(requests.filter(request => request._id !== userId));
            // Reload friends list
            loadFriends();
        } catch (error) {
            toast.error(error.message || "Failed to accept request");
        } finally {
            setProcessingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleRejectRequest = async (userId) => {
        try {
            setProcessingUsers(prev => new Set(prev).add(userId));
            await friendService.rejectFriendRequest(userId);
            toast.success("Friend request rejected");
            // Remove from requests list
            setRequests(requests.filter(request => request._id !== userId));
        } catch (error) {
            toast.error(error.message || "Failed to reject request");
        } finally {
            setProcessingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleRemoveFriend = async (userId) => {
        try {
            setProcessingUsers(prev => new Set(prev).add(userId));
            await friendService.removeFriend(userId);
            toast.success("Friend removed successfully");
            // Remove from friends list
            setFriends(friends.filter(friend => friend._id !== userId));
            // Close dropdown
            toggleDropdown(userId);
        } catch (error) {
            toast.error(error.message || "Failed to remove friend");
        } finally {
            setProcessingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const toggleDropdown = (userId) => {
        setOpenDropdowns(prev => {
            const newDropdowns = { ...prev };
            // Close all other dropdowns
            Object.keys(newDropdowns).forEach(key => {
                if (key !== userId) newDropdowns[key] = false;
            });
            // Toggle the current dropdown
            newDropdowns[userId] = !prev[userId];
            return newDropdowns;
        });
    };

    const handleClickOutside = (e, userId) => {
        if (openDropdowns[userId] && !e.currentTarget.contains(e.target)) {
            toggleDropdown(userId);
        }
    };

    const goToProfile = (userId) => {
        const rolePath = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        navigate(`/${rolePath}/${user._id}/profile/${userId}`);
    };

    const goToMessages = (userId) => {
        navigate(`/messages/${userId}`);
        toast.success("Messaging feature coming soon!");
    };

    const filteredFriends = searchTerm
        ? friends.filter(friend =>
            friend.Username?.toLowerCase().includes(searchTerm) ||
            friend.email?.toLowerCase().includes(searchTerm))
        : friends;

    const filteredRequests = searchTerm
        ? requests.filter(request =>
            request.Username?.toLowerCase().includes(searchTerm) ||
            request.email?.toLowerCase().includes(searchTerm))
        : requests;

    return (
        <div className="friends-container bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="friends-tabs">
                <button
                    className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
                    onClick={() => setActiveTab('friends')}
                >
                    Friends
                </button>
                <button
                    className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Friend Requests
                    {requests.length > 0 && <span className="request-count">{requests.length}</span>}
                </button>
            </div>

            <div className="friends-search-container">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'friends' ? 'friends' : 'requests'}`}
                        className="friends-search-input"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="search-icon" size={16} />
                </div>
            </div>

            <div className="tabs-content">

                {activeTab === 'friends' ? (
                    <div className="friend-list">
                        {loading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        ) : filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <div key={friend._id} className="friend-card">
                                    <div className="friend-left" onClick={() => goToProfile(friend._id)}>
                                        <img
                                            src={friend.profileImage || "https://via.placeholder.com/50"}
                                            alt={friend.Username}
                                            className="friend-avatar"
                                        />
                                        <div className="friend-info">
                                            <h3 className="friend-name">{friend.Username}</h3>
                                            <p className="friend-role">{friend.email}</p>
                                        </div>
                                    </div>

                                    <div className="friend-actions">
                                        <button
                                            className="message-btn"
                                            onClick={() => goToMessages(friend._id)}
                                        >
                                            <MessageSquare size={16} />
                                            <span>Message</span>
                                        </button>

                                        <div className="dropdown-container" onClick={(e) => handleClickOutside(e, friend._id)}>
                                            <button
                                                className="more-options"
                                                onClick={() => toggleDropdown(friend._id)}
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {openDropdowns[friend._id] && (
                                                <div className="dropdown-menu">
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() => handleRemoveFriend(friend._id)}
                                                        disabled={processingUsers.has(friend._id)}
                                                    >
                                                        {processingUsers.has(friend._id) ? (
                                                            <span className="flex items-center justify-center">
                                                                <div className="spinner-sm mr-2"></div>
                                                                Removing...
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <UserMinus size={16} className="action-icon" />
                                                                <span>Remove Friend</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">👥</div>
                                <p>You don't have any friends yet</p>
                                <button
                                    className="find-friends-btn"
                                    onClick={() => navigate('/network')}
                                >
                                    Find Friends
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="request-list">
                        {requestsLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => (
                                <div key={request._id} className="friend-request-item">
                                    <div className="request-content" onClick={() => goToProfile(request._id)}>
                                        <img
                                            src={request.profileImage || "https://via.placeholder.com/50"}
                                            alt={request.Username}
                                            className="request-avatar"
                                        />
                                        <div className="request-info">
                                            <h3 className="request-name">{request.Username}</h3>
                                            <p className="request-email">{request.email}</p>
                                        </div>
                                    </div>

                                    <div className="request-actions">
                                        <button
                                            className="accept-button"
                                            onClick={() => handleAcceptRequest(request._id)}
                                            disabled={processingUsers.has(request._id)}
                                        >
                                            {processingUsers.has(request._id) ? (
                                                <div className="spinner-sm"></div>
                                            ) : (
                                                <>
                                                    <UserCheck size={16} />
                                                    <span>Accept</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            className="reject-button"
                                            onClick={() => handleRejectRequest(request._id)}
                                            disabled={processingUsers.has(request._id)}
                                        >
                                            {processingUsers.has(request._id) ? (
                                                <div className="spinner-sm"></div>
                                            ) : (
                                                <>
                                                    <X size={16} />
                                                    <span>Reject</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📩</div>
                                <p>No pending friend requests</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllFriends;
