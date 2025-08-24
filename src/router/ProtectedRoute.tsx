import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/auth/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  requiredRole?: "admin" | "employee" | "customer";
}

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  requireAuth = true,
  requiredRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth pages (login/register)
  if (!requireAuth && isAuthenticated) {
    // Get the intended destination from state, or default to home
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // If specific role is required, check user role
  if (requireAuth && requiredRole && user?.role !== requiredRole) {
    // Redirect to home or unauthorized page if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
