import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { can, Permission } from '@/utils/permissions';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  permission: Permission | Permission[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * RoleProtectedRoute Component
 * 
 * Protects routes based on user role permissions.
 * Can check single permission or multiple (requires all).
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  permission,
  fallback,
  redirectTo = '/',
}) => {
  const { user, isAuthenticated } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions
  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasAccess = permissions.every(perm => can(user.role as any, perm));

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;

