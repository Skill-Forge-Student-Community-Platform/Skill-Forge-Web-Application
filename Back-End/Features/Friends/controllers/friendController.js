// ...existing code...

// Modify the acceptFriendRequest controller to add following relationship
export const acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    // Find both users
    const [currentUser, friendUser] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!currentUser || !friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if friend request exists
    const friendRequest = await FriendRequest.findOne({
      sender: friendId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Update friend request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add to friends list for both users if not already friends
    if (!currentUser.friends.includes(friendId)) {
      currentUser.friends.push(friendId);
    }

    if (!friendUser.friends.includes(userId)) {
      friendUser.friends.push(userId);
    }

    // NEW CODE: Make users follow each other automatically
    if (!currentUser.following.includes(friendId)) {
      currentUser.following.push(friendId);
    }

    if (!friendUser.following.includes(userId)) {
      friendUser.following.push(userId);
    }

    if (!currentUser.followers.includes(friendId)) {
      currentUser.followers.push(friendId);
    }

    if (!friendUser.followers.includes(userId)) {
      friendUser.followers.push(userId);
    }

    // Save both users
    await Promise.all([currentUser.save(), friendUser.save()]);

    // Create notification for friend request acceptance
    const newNotification = new Notification({
      from: userId,
      to: friendId,
      type: 'friend_accept'
    });
    await newNotification.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${friendId}`).emit('friendRequestAccepted', {
        userId,
        friendId
      });
    }

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ...existing code...
