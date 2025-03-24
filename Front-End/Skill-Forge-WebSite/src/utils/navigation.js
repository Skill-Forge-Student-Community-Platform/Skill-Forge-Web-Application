import { useAuthStore } from '../store/authStore';

// Creates a properly formatted path maintaining the role/userId structure
export const createAppPath = (path, user = null) => {
  // If no user is provided, get from auth store
  const storeUser = useAuthStore.getState().user;
  const currentUser = user || storeUser;

  if (!currentUser) {
    console.warn('No user available for path creation');
    return path; // Fallback to the provided path
  }

  // Format the role for URL (capitalize first letter)
  const roleForUrl = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);

  // If path starts with "/", remove it to avoid double slashes
  const formattedPath = path.startsWith('/') ? path.substring(1) : path;

  // Return the properly formatted path
  return `/${roleForUrl}/${currentUser._id}/${formattedPath}`;
};
