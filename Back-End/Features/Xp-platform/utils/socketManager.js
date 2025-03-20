/**
 * Socket.IO Manager Utility
 * Provides functions to easily emit events through Socket.IO from anywhere in the app
 */

/**
 * Emit an event to all connected clients
 * @param {object} io - Socket.IO instance
 * @param {string} event - Event name
 * @param {object} data - Data to send
 */
const emitToAll = (io, event, data) => {
  if (!io) return;
  io.emit(event, data);
};

/**
 * Emit an event to a specific room
 * @param {object} io - Socket.IO instance
 * @param {string} room - Room name
 * @param {string} event - Event name
 * @param {object} data - Data to send
 */
const emitToRoom = (io, room, event, data) => {
  if (!io) return;
  io.to(room).emit(event, data);
};

/**
 * Emit an activity update to a user's activity feed
 * @param {object} io - Socket.IO instance
 * @param {string} userId - User ID
 * @param {object} activity - Activity data
 */
const emitActivityUpdate = (io, userId, activity) => {
  emitToRoom(io, `activity_${userId}`, 'activityUpdate', { activity });
};

/**
 * Emit a leaderboard update
 * @param {object} io - Socket.IO instance
 * @param {object} data - Leaderboard update data
 */
const emitLeaderboardUpdate = (io, data) => {
  emitToRoom(io, 'leaderboard', 'leaderboardUpdate', data);
};

module.exports = {
  emitToAll,
  emitToRoom,
  emitActivityUpdate,
  emitLeaderboardUpdate
};
