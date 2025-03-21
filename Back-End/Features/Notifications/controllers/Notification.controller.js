import Notification from "../models/Notification.js";

/**
 * Get user's notifications
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate("from", "Username profilePicture")
      .populate("post", "text")
      .limit(50); // Limit to 50 most recent notifications

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error("Error in getNotifications controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
      error: error.message
    });
  }
};

/**
 * Delete all notifications for a user
 * @route DELETE /api/notifications
 * @access Private
 */

export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteAllNotifications controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting notifications",
      error: error.message
    });
  }
};

/**
 * Delete a specific notification
 * @route DELETE /api/notifications/:notificationId
 * @access Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // Check if the notification belongs to the user
    if (notification.to.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification"
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteNotification controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting notification",
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 * @route PATCH /api/notifications/read/all
 * @access Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { to: userId },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Error in markAllAsRead controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating notifications",
      error: error.message
    });
  }
};

/**
 * Mark specific notification as read
 * @route PATCH /api/notifications/read/:notificationId
 * @access Private
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // Check if the notification belongs to the user
    if (notification.to.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this notification"
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Error in markAsRead controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating notification",
      error: error.message
    });
  }
};
