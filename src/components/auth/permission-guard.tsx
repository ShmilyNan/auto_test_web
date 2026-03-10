'use client';

import { ReactNode } from 'react';
import { useUserStore } from '@/store/user';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 权限守卫组件
 * 根据用户权限控制子组件显示
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const hasPermission = useUserStore((state) => state.hasPermission(permission));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface HasAnyPermissionProps {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 拥有任意权限则显示
 */
export function HasAnyPermission({
  permissions,
  children,
  fallback = null,
}: HasAnyPermissionProps) {
  const { user } = useUserStore();
  if (!user) {
    return <>{fallback}</>;
  }

  // 超级管理员拥有所有权限
  if (user.is_superuser) {
    return <>{children}</>;
  }

  const hasAny = permissions.some((permission) =>
    user.roles.some((role) =>
      role.permissions.some((p) => p.code === permission)
    )
  );

  if (!hasAny) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface HasAllPermissionsProps {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 拥有所有权限则显示
 */
export function HasAllPermissions({
  permissions,
  children,
  fallback = null,
}: HasAllPermissionsProps) {
  const { user } = useUserStore();

  if (!user) {
    return <>{fallback}</>;
  }

  // 超级管理员拥有所有权限
  if (user.is_superuser) {
    return <>{children}</>;
  }

  const hasAll = permissions.every((permission) =>
    user.roles.some((role) =>
      role.permissions.some((p) => p.code === permission)
    )
  );

  if (!hasAll) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 角色守卫组件
 * 根据用户角色控制子组件显示
 */
export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const hasRole = useUserStore((state) => state.hasRole(role));

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface IsSuperuserProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 超级管理员守卫组件
 */
export function IsSuperuser({ children, fallback = null }: IsSuperuserProps) {
  const { user } = useUserStore();

  if (!user?.is_superuser) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}