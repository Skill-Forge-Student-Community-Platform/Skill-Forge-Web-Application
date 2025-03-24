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
        const senderSentRequests = sender.sentRequests ? sender.sentRequests.map(id => id.toString()) : [];

        if (receiverRequests.includes(senderId.toString())) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        if (receiverFriends.includes(senderId.toString())) {
            return res.status(400).json({ message: "Users are already friends" });
        }

        // Check if the request already exists in sentRequests
        if (senderSentRequests.includes(receiverId.toString())) {
            return res.status(400).json({ message: "Friend request already sent" });
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

        // Gather sender data for the socket event
        const senderData = {
            _id: sender._id,
            Username: sender.Username,
            profilePicture: sender.profilePicture || null
        };

        // Emit socket event for real-time notification to specific user
        io.to(`user:${receiverId}`).emit('friend_request_received', {
            notification: newNotification,
            from: senderData
        });

        // Also emit a general notification event
        io.to(`user:${receiverId}`).emit('new_notification', {
            ...newNotification.toObject(),
            from: senderData
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

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists (as string comparison)
        const friendRequestExists = receiver.friendRequests.some(id => id.toString() === senderId);
        if (!friendRequestExists) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        // Add each user to the other's friends array
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);

        // Remove the request from friendRequests and sentRequests
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

        // Also add to following arrays (auto-follow)
        if (!receiver.following.includes(senderId)) {
            receiver.following.push(senderId);
        }
        if (!sender.following.includes(receiverId)) {
            sender.following.push(receiverId);
        }

        // Add to followers arrays
        if (!receiver.followers.includes(senderId)) {
            receiver.followers.push(senderId);
        }
        if (!sender.followers.includes(receiverId)) {
            sender.followers.push(receiverId);
        }

        await Promise.all([
            receiver.save(),
            sender.save()
        ]);

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

        // Gather receiver data for the socket event
        const receiverData = {
            _id: receiver._id,
            Username: receiver.Username,
            profilePicture: receiver.profilePicture || null
        };

        // Emit socket event for real-time update to sender
        io.to(`user:${senderId}`).emit('friend_request_accepted', {
            notification: newNotification,
            from: receiverData
        });

        // Also emit a general notification event
        io.to(`user:${senderId}`).emit('new_notification', {
            ...newNotification.toObject(),
            from: receiverData
        });

        res.status(200).json({
            message: "Friend request accepted",
            friend: {
                _id: sender._id,
                Username: sender.Username,
                profilePicture: sender.profilePicture
            }
        });
    } catch (error) {
        console.error('Error in acceptFriendRequest:', error);
        res.status(500).json({ message: error.message });
    }
};

export const rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const senderId = req.params.userId;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        const friendRequestExists = receiver.friendRequests.some(id => id.toString() === senderId);
        if (!friendRequestExists) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        // Remove the request from friendRequests and sentRequests
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

        await Promise.all([
            receiver.save(),
            sender.save()
        ]);

        // Delete the friend request notification
        await Notification.deleteMany({
            type: 'friend_request',
            from: senderId,
            to: receiverId
        });

        // Emit socket event for real-time update
        io.to(`user:${senderId}`).emit('friend_request_rejected', {
            from: {
                _id: receiver._id,
                Username: receiver.Username
            }
        });

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.error('Error in rejectFriendRequest:', error);
        res.status(500).json({ message: error.message });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.userId;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(friendId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if they are friends
        const areFriends = user.friends.some(id => id.toString() === friendId);
        if (!areFriends) {
            return res.status(400).json({ message: "Users are not friends" });
        }

        // Remove each user from the other's friends array
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await Promise.all([
            user.save(),
            friend.save()
        ]);

        // Emit socket event for real-time update
        io.to(`user:${friendId}`).emit('friend_removed', {
            from: {
                _id: user._id,
                Username: user.Username
            }
        });

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        console.error('Error in removeFriend:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate('friendRequests', 'Username FirstName LastName email profilePicture role');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friendRequests || []);
    } catch (error) {
        console.error('Error in getFriendRequests:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getFriends = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate('friends', 'Username FirstName LastName email profilePicture role');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friends || []);
    } catch (error) {
        console.error('Error in getFriends:', error);
        res.status(500).json({ message: error.message });
    }
};

export const cancelFriendRequest = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.userId;

        // Add ObjectId validation
        if (!mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        const sentRequestExists = sender.sentRequests.some(id => id.toString() === receiverId);
        const friendRequestExists = receiver.friendRequests.some(id => id.toString() === senderId);

        if (!sentRequestExists || !friendRequestExists) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        // Remove from sent requests
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);
        await sender.save();

        // Remove from friend requests
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
        await receiver.save();

        // Delete any related notification
        await Notification.deleteMany({
            type: 'friend_request',
            from: senderId,
            to: receiverId
        });

        // Emit socket event for real-time update
        io.to(`user:${receiverId}`).emit('friend_request_cancelled', {
            from: {
                _id: sender._id,
                Username: sender.Username
            }
        });

        res.status(200).json({ message: "Friend request cancelled successfully" });
    } catch (error) {
        console.error("Error in cancelFriendRequest:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getSentRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get current user with sent requests
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Populate sent requests with user details
        const populatedUser = await User.findById(userId)
            .populate('sentRequests', 'Username FirstName LastName email profilePicture role');

        // Transform data to include both the user info and the request ID
        const sentRequests = (populatedUser.sentRequests || []).map(receiver => ({
            _id: receiver._id,
            Username: receiver.Username,
            FirstName: receiver.FirstName,
            LastName: receiver.LastName,
            email: receiver.email,
            profilePicture: receiver.profilePicture,
            role: receiver.role
        }));

        res.status(200).json(sentRequests);
    } catch (error) {
        console.error("Error in getSentRequests:", error);
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

        // Find suggestions based on different categories

        // 1. Same school/university (for students)
        const sameSchoolUsers = [];
        if (user.role === 'student' && user.profile) {
            try {
                const Student = mongoose.model('Student');
                const studentProfile = await Student.findById(user.profile);

                if (studentProfile && studentProfile.school) {
                    const schoolmates = await User.aggregate([
                        {
                            $match: {
                                _id: { $nin: excludeIds },
                                role: 'student'
                            }
                        },
                        {
                            $lookup: {
                                from: 'students',
                                localField: 'profile',
                                foreignField: '_id',
                                as: 'studentProfile'
                            }
                        },
                        { $unwind: '$studentProfile' },
                        { $match: { 'studentProfile.school': studentProfile.school } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 1,
                                Username: 1,
                                FirstName: 1,
                                LastName: 1,
                                email: 1,
                                role: 1,
                                profilePicture: 1,
                                school: '$studentProfile.school',
                                suggestionType: { $literal: 'school' }
                            }
                        }
                    ]);

                    sameSchoolUsers.push(...schoolmates);
                }
            } catch (error) {
                console.error("Error finding school connections:", error);
                // Continue even if school connections fail
            }
        }

        // 2. Friends of friends (mutual connections)
        let friendsOfFriends = [];
        if (userFriends.length > 0) {
            try {
                const mutualFriends = await User.aggregate([
                    { $match: { _id: { $in: userFriends } } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "friends",
                            foreignField: "_id",
                            as: "friendsOfFriends"
                        }
                    },
                    { $unwind: "$friendsOfFriends" },
                    { $match: { "friendsOfFriends._id": { $nin: excludeIds } } },
                    {
                        $group: {
                            _id: "$friendsOfFriends._id",
                            user: { $first: "$friendsOfFriends" },
                            mutualCount: { $sum: 1 }
                        }
                    },
                    { $sort: { mutualCount: -1 } },
                    { $limit: 5 },
                    {
                        $project: {
                            _id: "$user._id",
                            Username: "$user.Username",
                            FirstName: "$user.FirstName",
                            LastName: "$user.LastName",
                            email: "$user.email",
                            role: "$user.role",
                            profilePicture: "$user.profilePicture",
                            mutualConnections: "$mutualCount",
                            suggestionType: { $literal: "mutual" }
                        }
                    }
                ]);

                friendsOfFriends = mutualFriends;
            } catch (error) {
                console.error("Error finding mutual friends:", error);
                // Continue even if mutual friends fail
            }
        }

        // Create a list of IDs to exclude from random suggestions
        const existingSuggestionIds = [
            ...excludeIds,
            ...sameSchoolUsers.map(u => new mongoose.Types.ObjectId(u._id)),
            ...friendsOfFriends.map(u => new mongoose.Types.ObjectId(u._id))
        ];

        // 3. Random people for diversity - exclude users already included in other categories
        const randomUsers = await User.aggregate([
            { $match: { _id: { $nin: existingSuggestionIds } } },
            { $sample: { size: 5 } },
            {
                $project: {
                    _id: 1,
                    Username: 1,
                    FirstName: 1,
                    LastName: 1,
                    email: 1,
                    role: 1,
                    profilePicture: 1,
                    mutualConnections: { $literal: 0 },
                    suggestionType: { $literal: "discover" }
                }
            }
        ]);

        // Combine results from all categories
        const suggestions = [
            ...sameSchoolUsers,

            ...friendsOfFriends,
            ...randomUsers
        ];

        // Limit to a reasonable number of suggestions and shuffle for variety
        const shuffledSuggestions = suggestions
            .sort(() => 0.5 - Math.random()) // Basic shuffle
            .slice(0, 15); // Limit to 15 suggestions

        res.status(200).json(shuffledSuggestions);
    } catch (error) {
        console.error("Error getting suggested friends:", error);
        res.status(500).json({ message: error.message });
    }
};
