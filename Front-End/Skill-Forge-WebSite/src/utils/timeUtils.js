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
