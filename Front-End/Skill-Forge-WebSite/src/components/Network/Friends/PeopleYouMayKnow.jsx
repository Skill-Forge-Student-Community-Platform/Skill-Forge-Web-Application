import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCheck, Loader } from "lucide-react";
import friendService from "../../../services/friendService";
import { toast } from 'react-hot-toast';
import socketService from "../../../services/socket";
import "./PeopleYouMayKnow.css";

const PeopleYouMayKnow = ({ onFriendRequest }) => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadSuggestedPeople();

        // Listen for friend request acceptances to refresh the list
        socketService.socket.on('friend_request_accepted', () => {
            loadSuggestedPeople();
        });

        return () => {
            socketService.socket.off('friend_request_accepted');
        };
    }, []);

    const loadSuggestedPeople = async () => {
        try {
            setLoading(true);
            const response = await friendService.getSuggestedFriends();
            setPeople(response);
        } catch (error) {
            toast.error(error.message || "Failed to load suggestions");
        } finally {
            setLoading(false);
        }
    };

    const handleFriendRequest = async (userId) => {
        try {
            setPendingRequests(prev => [...prev, userId]);
            await friendService.sendFriendRequest(userId);
            toast.success("Friend request sent successfully!");

            // Call the callback to update the pending requests count in parent component
            if (onFriendRequest) {
                onFriendRequest();
            }
        } catch (error) {
            toast.error(error.message || "Failed to send friend request");
            // Remove from pending if it fails
            setPendingRequests(prev => prev.filter(id => id !== userId));
        }
    };

    const goToProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const renderPersonCard = (person) => (
        <div key={person._id} className="person-card">
            <div className="person-info" onClick={() => goToProfile(person._id)}>
                <img
                    src={person.profilePicture || "https://via.placeholder.com/50"}
                    alt={person.Username}
                    className="person-avatar"
                />
                <div>
                    <h3 className="person-name">{person.Username}</h3>
                    <p className="person-details">
                        {person.role}
                        {person.mutualConnections > 0 && (
                            <span className="mutual-connections">
                                • {person.mutualConnections} mutual connection{person.mutualConnections !== 1 ? 's' : ''}
                            </span>
                        )}
                    </p>
                </div>
            </div>
            <button
                className={`request-button ${pendingRequests.includes(person._id) ? 'pending' : ''}`}
                onClick={() => handleFriendRequest(person._id)}
                disabled={pendingRequests.includes(person._id)}
            >
                {pendingRequests.includes(person._id) ? (
                    <>

                        <UserCheck size={16} /> Request Sent
                    </>
                ) : (
                    <>
                        <UserPlus size={16} /> Connect
                    </>
                )}
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="suggestions-container">
                <h2 className="section-title">People you may know</h2>
                <div className="loading-spinner">
                    <Loader size={24} className="animate-spin" />
                    <p>Loading suggestions...</p>
                </div>
            </div>
        );
    }

    if (people.length === 0) {
        return (
            <div className="suggestions-container">
                <h2 className="section-title">People you may know</h2>
                <div className="empty-state">
                    <p>No suggested connections at this time. Check back later!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="suggestions-container">
            <h2 className="section-title">People you may know</h2>
            <div className="suggestions-grid">
                {people.map(person => renderPersonCard(person))}
            </div>
        </div>
    );
};

export default PeopleYouMayKnow;
