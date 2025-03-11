import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Who triggered the notification
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Who receives the notification
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Type of notification
  type: {
    type: String,
    required: true,
    enum: [
      'follow',           // When someone follows you
      'like',             // When someone likes your post
      'comment',          // When someone comments on your post
      'mention',          // When someone mentions you in a post/comment
      'team_invite',      // Team invite notifications
      'event_updates',    // Updates about events (announcements, registration deadlines)
      'workshop_updates', // Updates to workshops you're enrolled in
      'direct_message',   // New direct message notification
      'group_message',    // New group message notification
      'portfolio_view'    // When someone views your portfolio
    ]
  },

  // Optional reference to related content
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },

  // Reference to workshop if notification is related to workshop
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop'
  },

  // Reference to event if notification is related to event
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },

  // Reference to team if notification is related to team
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },

  // Optional message content for custom notifications
  message: {
    type: String
  },

  // Has the notification been read?
  read: {
    type: Boolean,
    default: false
  },

  // Additional data that might be needed (stored as JSON)
  metadata: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

// Create indexes for faster queries
notificationSchema.index({ to: 1, createdAt: -1 }); // For fetching user's notifications
notificationSchema.index({ to: 1, read: 1 }); // For counting unread notifications
notificationSchema.index({ type: 1, to: 1 }); // For filtering notifications by type

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
