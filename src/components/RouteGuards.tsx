// ============================================================
// ROUTE GUARDS - Protect private & admin routes
// ============================================================

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "./LoadingScreen";
import type { ReactNode } from "react";

/**
 * Requires the user to be authenticated.
 * Redirects to /login if not signed in.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen theme="blush" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * Requires the user to be in the "Admins" Cognito group.
 * Redirects to /app if authenticated but not admin.
 * Redirects to /login if not authenticated.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen theme="blush" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
