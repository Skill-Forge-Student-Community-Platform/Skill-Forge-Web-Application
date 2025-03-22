import mongoose from 'mongoose';
import { User } from '../../User-Authentication/models/User.js';

export const sendFriendRequest = async (req, res) => {
    try {
        // Fix how we get userId from token to match the middleware
        const senderId = req.user.id || req.user._id;
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

// Apply the same fix to other functions
export const acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id || req.user._id;
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

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id || req.user._id;
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

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
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

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        // Use correct field names for the User model
        const user = await User.findById(userId).populate('friendRequests', 'Username email coverImg');
        res.status(200).json(user.friendRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFriends = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        // Use correct field names for the User model
        const user = await User.findById(userId).populate('friends', 'Username email coverImg');
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSuggestedFriends = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Initialize arrays to empty if they don't exist
        const friends = user.friends || [];
        const friendRequests = user.friendRequests || [];
        const sentRequests = user.sentRequests || [];
        
        const allUsers = await User.find({
            _id: { 
                $nin: [
                    userId,
                    ...friends,
                    ...friendRequests,
                    ...sentRequests
                ]
            }
        }).select('Username email coverImg');
        
        res.status(200).json(allUsers);
    } catch (error) {
        console.error('Error in getSuggestedFriends:', error);
        res.status(500).json({ message: error.message });
    }
};
