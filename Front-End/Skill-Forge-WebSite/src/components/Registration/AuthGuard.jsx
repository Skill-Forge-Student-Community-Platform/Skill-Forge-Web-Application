import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// Protect routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  return children;
};

// Redirect authenticated users away from auth pages
export const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};
