import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// Protect routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const currentPath = location.pathname;

  console.log("AuthGuard checking path:", currentPath);
  console.log("User state:", user);

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }

  if (user && !user.isVerified) {
    console.log("User not verified, redirecting to verify email");
    return <Navigate to="/auth/verify-email" replace />;
  }

  // Enhanced profile completion check
  if (user && user.isVerified && !user.profileComplete) {
    console.log('User needs to complete profile setup:', user);

    // Skip redirect if already on a profile setup path to prevent loops
    if (currentPath.startsWith('/profile/setup/')) {
      console.log("Already on profile setup path, allowing access");
      return children;
    }

    // Direct to role selection if no role is set
    if (!user.role) {
      console.log("No role set, redirecting to role selection");
      return <Navigate to="/profile/setup/type" replace />;
    }

    // Otherwise direct to the appropriate form based on role
    const setupPath = `/profile/setup/${user.role}`;
    console.log(`Redirecting to ${user.role} profile setup: ${setupPath}`);
    return <Navigate to={setupPath} replace />;
  }

  // User is authenticated, verified, and has completed their profile
  console.log("User is fully authenticated and profile is complete");
  return children;
};

// Redirect authenticated users away from auth pages
export const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified && user?.profileComplete) {
    // If user has completed profile, redirect to role-specific home
    if (user.role) {
      const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      const targetUrl = `/${role}/${user._id}/home`;
      console.log(`Redirecting authenticated user to ${targetUrl}`);
      return <Navigate to={targetUrl} replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && user?.isVerified && !user?.profileComplete) {
    // If user needs to complete their profile
    if (user.role) {
      const setupUrl = `/profile/setup/${user.role}`;
      console.log(`Redirecting to profile setup: ${setupUrl}`);
      return <Navigate to={setupUrl} replace />;
    } else {
      console.log("Redirecting to role selection");
      return <Navigate to="/profile/setup/type" replace />;
    }
  }

  return children;
};
