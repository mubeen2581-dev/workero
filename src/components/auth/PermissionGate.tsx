import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { can, Permission } from '@/utils/permissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permission: Permission | Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * PermissionGate Component
 * 
 * Conditionally renders children based on user permissions.
 * Use this to show/hide UI elements based on role.
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  requireAll = true,
  fallback = null,
}) => {
  const { user } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  const userRole = user.role as any;

  let hasAccess = false;
  if (requireAll) {
    hasAccess = permissions.every(perm => can(userRole, perm));
  } else {
    hasAccess = permissions.some(perm => can(userRole, perm));
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;

