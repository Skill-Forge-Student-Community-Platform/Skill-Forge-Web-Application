import React, { useState, useEffect } from "react";
import friendService from "../../../services/friendService";
import { toast } from 'react-hot-toast'; // Changed to react-hot-toast
import "./PeopleYouMayKnow.css";

const PeopleYouMayKnow = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        loadSuggestedPeople();
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
            await friendService.sendFriendRequest(userId);
            setPendingRequests([...pendingRequests, userId]);
            toast.success("Friend request sent successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to send friend request");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">People you may know</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {people.length > 0 ? (
                    people.map((person) => (
                        <div key={person._id} className="border dark:border-gray-700 rounded-lg p-4 flex items-center space-x-4">
                            <img 
                                src={person.profileImage || "https://via.placeholder.com/50"} 
                                alt={person.Username} 
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">{person.Username}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{person.email}</p>
                                <button 
                                    className={`mt-2 px-3 py-1 rounded text-sm ${
                                        pendingRequests.includes(person._id) 
                                            ? "bg-gray-200 text-gray-600 cursor-not-allowed" 
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                    onClick={() => handleFriendRequest(person._id)}
                                    disabled={pendingRequests.includes(person._id)}
                                >
                                    {pendingRequests.includes(person._id) ? "Request Sent" : "Add Friend"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                        No suggested connections at this time
                    </p>
                )}
            </div>
        </div>
    );
};

export default PeopleYouMayKnow;
