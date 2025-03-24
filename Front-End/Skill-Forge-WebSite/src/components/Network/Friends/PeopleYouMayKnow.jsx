import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCheck, Loader, X } from "lucide-react";
import friendService from "../../../services/friendService";
import { toast } from 'react-hot-toast';
import socketService from "../../../services/socket";
import "./PeopleYouMayKnow.css";

const PeopleYouMayKnow = ({ onFriendRequest }) => {
    const [people, setPeople] = useState({
        university: [],
        recent: [],
        field: []
    });
    const [loading, setLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [hiddenUsers, setHiddenUsers] = useState([]); // To track users that are hidden from UI
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

            // Group suggestions by category (in a real app, this would be done on the backend)
            const university = response.filter(p => p.suggestionType === 'school').slice(0, 5);
            const recent = response.filter(p => p.mutualConnections > 0).slice(0, 5);
            const field = response.filter(p => !university.includes(p) && !recent.includes(p)).slice(0, 5);

            setPeople({
                university,
                recent,
                field
            });
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

    const hideUser = (userId, e) => {
        e.stopPropagation();
        setHiddenUsers(prev => [...prev, userId]);
        // In a real app, you might want to store this preference
        toast.success("User hidden from suggestions");
    };

    const renderPersonCard = (person) => {
        // Skip rendering if user is in hiddenUsers
        if (hiddenUsers.includes(person._id)) return null;

        return (
            <div key={person._id} className="person-card">
                <button
                    className="hide-suggestion"
                    onClick={(e) => hideUser(person._id, e)}
                    title="Hide this suggestion"
                >
                    <X size={16} />
                </button>

                <div className="person-info" onClick={() => goToProfile(person._id)}>
                    <img
                        src={person.profilePicture || "https://via.placeholder.com/50"}
                        alt={person.Username}
                        className="person-avatar"
                    />
                    <div className="person-details-container">
                        <h3 className="person-name">
                            {person.FirstName && person.LastName
                                ? `${person.FirstName} ${person.LastName}`
                                : person.Username}
                        </h3>
                        <p className="person-role">
                            {person.role || "Student"}
                            {person.school && ` | ${person.school}`}
                        </p>

                        {person.mutualConnections > 0 && (
                            <p className="mutual-connections">
                                <span className="connection-icon">👥</span>
                                {person.mutualConnections} mutual connection{person.mutualConnections !== 1 ? 's' : ''}
                            </p>
                        )}
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
    };

    const renderSuggestionsSection = (title, peopleList, university = null) => {
        if (!peopleList || peopleList.length === 0) return null;

        return (
            <div className="suggestions-section">
                <div className="section-header">
                    <h3 className="section-title">
                        {university ? `People you may know from ${university}` : title}
                    </h3>
                    <button className="see-all-btn">See all</button>
                </div>
                <div className="suggestions-cards">
                    {peopleList.map(renderPersonCard)}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="suggestions-container">
                <h2 className="main-title">People you may know</h2>
                <div className="loading-spinner">
                    <Loader size={24} className="animate-spin" />
                    <p>Loading suggestions...</p>
                </div>
            </div>
        );
    }

    const hasAnySuggestions =
        people.university.length > 0 ||
        people.recent.length > 0 ||
        people.field.length > 0;

    if (!hasAnySuggestions) {
        return (
            <div className="suggestions-container">
                <h2 className="main-title">People you may know</h2>
                <div className="empty-state">
                    <p>No suggested connections at this time. Check back later!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="suggestions-container">
            <h2 className="main-title">People you may know</h2>

            {renderSuggestionsSection("People you may know from your university", people.university, "Your University")}
            {renderSuggestionsSection("People you may know based on your connections", people.recent)}
            {renderSuggestionsSection("People in similar fields", people.field)}
        </div>
    );
};

export default PeopleYouMayKnow;
