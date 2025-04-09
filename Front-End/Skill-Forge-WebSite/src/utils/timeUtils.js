export const formatPostTime = (timestamp) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diff = now - postDate;
  const hours = diff / (1000 * 60 * 60);

  if (hours < 24) {
    // Within 24 hours
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 1) {
        const seconds = Math.floor(diff / 1000);
        return `${seconds} seconds ago`;
      }
      return `${minutes} minutes ago`;
    }
    return `${Math.floor(hours)} hours ago`;
  } else {
    // After 24 hours
    return postDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }
};

/**
 * Format a date in the style "March 27 at 6:16 PM"
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Formatted date string
 */
export const formatFullPostDate = (dateString) => {
  const date = new Date(dateString);

  // Return if invalid date
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  // Format as "Month Day at Hour:Minute AM/PM"
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
