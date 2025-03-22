import mongoose from 'mongoose';
import { User } from '../../User-Authentication/models/User.js';
import Notification from '../../Notifications/models/Notification.js';
import { io } from '../../../index.js'; // Import the socket.io instance

export const sendFriendRequest = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.userId;

        // Add ObjectId validation
        if (!mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        console.log('Processing request:', { senderId, receiverId }); // Debug log

        if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot send friend request to yourself" });
        }

        const [receiver, sender] = await Promise.all([
            User.findById(receiverId),
            User.findById(senderId)
        ]);

        console.log('Found users:', {
            receiver: receiver?._id,
            sender: sender?._id
        }); // Debug log

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Convert ObjectIds to strings for comparison
        const receiverRequests = receiver.friendRequests.map(id => id.toString());
        const receiverFriends = receiver.friends ? receiver.friends.map(id => id.toString()) : [];

        if (receiverRequests.includes(senderId.toString())) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        if (receiverFriends.includes(senderId.toString())) {
            return res.status(400).json({ message: "Users are already friends" });
        }

        receiver.friendRequests.push(senderId);
        sender.sentRequests.push(receiverId);

        await Promise.all([receiver.save(), sender.save()]);

        // Create notification for the friend request
        const newNotification = new Notification({
            type: 'friend_request',
            from: senderId,
            to: receiverId,
            message: `sent you a friend request`,
            read: false,
            createdAt: new Date()
        });

        await newNotification.save();

        // Emit socket event for real-time notification
        io.to(`user:${receiverId}`).emit('friend_request_received', {
            notification: newNotification,
            from: {
                _id: sender._id,
                Username: sender.Username,
                profilePicture: sender.profilePicture
            }
        });

        res.status(200).json({
            message: "Friend request sent successfully",
            receiverId: receiver._id,
            senderId: sender._id
        });
    } catch (error) {
        console.error('Error in sendFriendRequest:', error);
        res.status(500).json({ message: error.message });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const senderId = req.params.userId;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        // Add each user to the other's friends array
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);

        // Remove the request from friendRequests and sentRequests
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

        await receiver.save();
        await sender.save();

        // Create notification for request acceptance
        const newNotification = new Notification({
            type: 'friend_accept',
            from: receiverId,
            to: senderId,
            message: `accepted your friend request`,
            read: false,
            createdAt: new Date()
        });

        await newNotification.save();

        // Emit socket event for real-time update to sender
        io.to(`user:${senderId}`).emit('friend_request_accepted', {
            notification: newNotification,
            from: {
                _id: receiver._id,
                Username: receiver.Username,
                profilePicture: receiver.profilePicture
            }
        });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const senderId = req.params.userId;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the request from friendRequests and sentRequests
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

        await receiver.save();
        await sender.save();

        // Emit socket event for real-time update
        io.to(`user:${senderId}`).emit('friend_request_rejected', {
            from: {
                _id: receiver._id,
                Username: receiver.Username
            }
        });

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.userId;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove each user from the other's friends array
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        // Emit socket event for real-time update
        io.to(`user:${friendId}`).emit('friend_removed', {
            from: {
                _id: user._id,
                Username: user.Username
            }
        });

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friendRequests', 'name email profileImage');
        res.status(200).json(user.friendRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends', 'name email profileImage');
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSuggestedFriends = async (req, res) => {
    try {
        const userId = req.user.id;

        // Convert userId to ObjectId for queries
        const userIdObj = new mongoose.Types.ObjectId(userId);

        // Get current user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get user's friends, sent requests, and received requests for filtering
        const userFriends = user.friends.map(id => new mongoose.Types.ObjectId(id));
        const sentRequests = user.sentRequests.map(id => new mongoose.Types.ObjectId(id));
        const friendRequests = user.friendRequests.map(id => new mongoose.Types.ObjectId(id));

        // Combine all IDs to exclude from suggestions
        const excludeIds = [userIdObj, ...userFriends, ...sentRequests, ...friendRequests];

        // Find friends of friends first (higher relevance)
        let friendsOfFriendsPipeline = [];

        // Only run this stage if user has friends
        if (userFriends.length > 0) {
            friendsOfFriendsPipeline = [
                // Match user's friends
                { $match: { _id: { $in: userFriends } } },

                // Lookup their friends
                { $lookup: {
                    from: "users",
                    localField: "friends",
                    foreignField: "_id",
                    as: "friendsOfFriends"
                }},

                // Unwind the friendsOfFriends array
                { $unwind: "$friendsOfFriends" },

                // Filter out the user and existing connections
                { $match: { "friendsOfFriends._id": { $nin: excludeIds } } },

                // Group by the friend of friend, counting mutual connections
                { $group: {
                    _id: "$friendsOfFriends._id",
                    user: { $first: "$friendsOfFriends" },
                    mutualCount: { $sum: 1 }
                }},

                // Sort by number of mutual connections (most relevant first)
                { $sort: { mutualCount: -1 } },

                // Limit to first 10
                { $limit: 10 },

                // Project only needed fields
                { $project: {
                    _id: "$user._id",
                    Username: "$user.Username",
                    FirstName: "$user.FirstName",
                    LastName: "$user.LastName",
                    email: "$user.email",
                    role: "$user.role",
                    profilePicture: "$user.profilePicture",
                    mutualConnections: "$mutualCount"
                }}
            ];
        }

        // Find random users for diversity
        const randomUsersPipeline = [
            // Match users that aren't in our exclusion list
            { $match: { _id: { $nin: excludeIds } } },

            // Get a random sample
            { $sample: { size: 10 } },

            // Project only needed fields
            { $project: {
                _id: 1,
                Username: 1,
                FirstName: 1,
                LastName: 1,
                email: 1,
                role: 1,
                profilePicture: 1,
                mutualConnections: { $literal: 0 }
            }}
        ];

        // Execute both pipelines
        const friendsOfFriends = userFriends.length > 0
            ? await User.aggregate(friendsOfFriendsPipeline)
            : [];

        const randomUsers = await User.aggregate(randomUsersPipeline);

        // Combine and limit results, giving priority to friends of friends
        const combinedResults = [...friendsOfFriends, ...randomUsers].slice(0, 15);

        // Return the suggested users
        res.status(200).json(combinedResults);
    } catch (error) {
        console.error("Error getting suggested friends:", error);
        res.status(500).json({ message: error.message });
    }
};
