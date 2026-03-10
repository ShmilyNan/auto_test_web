/**
 * RBAC 权限系统
 * 基于实际后端实现的权限系统
 */

import { PERMISSION_CODES, PermissionCode, RoleCode } from '@/lib/constants/permissions';

/**
 * 角色枚举（与后端保持一致）
 */
export enum Role {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  TEST_ENGINEER = 'test_engineer',
  VIEWER = 'viewer',
}

/**
 * 权限检查函数
 */
export function hasPermission(userPermissions: PermissionCode[], permission: PermissionCode): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(userPermissions: PermissionCode[], permissions: PermissionCode[]): boolean {
  return permissions.some((permission) => userPermissions.includes(permission));
}

export function hasAllPermissions(userPermissions: PermissionCode[], permissions: PermissionCode[]): boolean {
  return permissions.every((permission) => userPermissions.includes(permission));
}

/**
 * 从用户对象中提取所有权限代码
 */
export function extractUserPermissions(user: {
  roles: Array<{ code: string; permissions: Array<{ code: string }> }>;
  is_superuser: boolean;
}): PermissionCode[] {
  // 超级管理员拥有所有权限
  if (user.is_superuser) {
    return Object.values(PERMISSION_CODES) as PermissionCode[];
  }

  // 从角色中提取权限
  return user.roles.flatMap(role =>
    role.permissions.map(permission => permission.code as PermissionCode)
  );
}

/**
 * 检查用户是否拥有指定角色
 */
export function hasRole(userRoles: Array<{ code: string }>, roleCode: RoleCode): boolean {
  return userRoles.some(role => role.code === roleCode);
}
