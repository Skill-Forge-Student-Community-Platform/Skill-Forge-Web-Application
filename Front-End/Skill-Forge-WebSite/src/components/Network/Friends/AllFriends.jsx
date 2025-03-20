import React, { useState, useEffect } from "react";
import friendService from "../../../services/friendService";
import { toast } from 'react-hot-toast';
import "./AllFriends.css";
import FriendRequests from "./FriendRequests";

const AllFriends = () => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('friends');

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
            await friendService.acceptFriendRequest(userId);
            toast.success("Friend request accepted!");
            // Remove from requests list
            setRequests(requests.filter(request => request._id !== userId));
            // Reload friends list
            loadFriends();
        } catch (error) {
            toast.error(error.message || "Failed to accept request");
        }
    };

    const handleRejectRequest = async (userId) => {
        try {
            await friendService.rejectFriendRequest(userId);
            toast.success("Friend request rejected");
            // Remove from requests list
            setRequests(requests.filter(request => request._id !== userId));
        } catch (error) {
            toast.error(error.message || "Failed to reject request");
        }
    };

    const handleRemoveFriend = async (userId) => {
        try {
            await friendService.removeFriend(userId);
            toast.success("Friend removed successfully");
            // Remove from friends list
            setFriends(friends.filter(friend => friend._id !== userId));
        } catch (error) {
            toast.error(error.message || "Failed to remove friend");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full mt-6">
            <div className="flex border-b mb-4">
                <button 
                    className={`py-2 px-4 ${activeTab === 'friends' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('friends')}
                >
                    Friends
                </button>
                <button 
                    className={`py-2 px-4 ${activeTab === 'requests' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Friend Requests
                </button>
            </div>
            
            {activeTab === 'friends' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <p className="text-center py-4 col-span-full">Loading friends...</p>
                    ) : friends.length > 0 ? (
                        friends.map((friend) => (
                            <div key={friend._id} className="border dark:border-gray-700 rounded-lg p-4 flex items-center space-x-4">
                                <img 
                                    src={friend.profileImage || "https://via.placeholder.com/50"} 
                                    alt={friend.Username} 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white">{friend.Username}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                                    <button 
                                        className="mt-2 px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                                        onClick={() => handleRemoveFriend(friend._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                            You don't have any friends yet
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requestsLoading ? (
                        <p className="text-center py-4 col-span-full">Loading requests...</p>
                    ) : requests.length > 0 ? (
                        requests.map((request) => (
                            <div key={request._id} className="border dark:border-gray-700 rounded-lg p-4 flex items-center space-x-4">
                                <img 
                                    src={request.profileImage || "https://via.placeholder.com/50"} 
                                    alt={request.Username} 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white">{request.Username}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{request.email}</p>
                                    <div className="flex space-x-2 mt-2">
                                        <button 
                                            className="px-3 py-1 rounded text-sm bg-green-500 text-white hover:bg-green-600"
                                            onClick={() => handleAcceptRequest(request._id)}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            className="px-3 py-1 rounded text-sm bg-gray-500 text-white hover:bg-gray-600"
                                            onClick={() => handleRejectRequest(request._id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                            No pending friend requests
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllFriends;
