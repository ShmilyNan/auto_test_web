/**
 * 权限代码常量
 * 与后端权限代码保持一致
 */

// 用户权限
export const USER = {
  LIST: 'user:list',
  READ: 'user:read',
  CREATE: 'user:create',
  UPDATE: 'user:update',
  DELETE: 'user:delete',
} as const;

// 角色权限
export const ROLE = {
  LIST: 'role:list',
  READ: 'role:read',
  CREATE: 'role:create',
  UPDATE: 'role:update',
  DELETE: 'role:delete',
} as const;

// 权限权限
export const PERMISSION = {
  LIST: 'permission:list',
  READ: 'permission:read',
  ASSIGN: 'permission:assign',
} as const;

// 项目权限
export const PROJECT = {
  LIST: 'project:list',
  READ: 'project:read',
  CREATE: 'project:create',
  UPDATE: 'project:update',
  DELETE: 'project:delete',
} as const;

// 测试用例权限
export const TESTCASE = {
  LIST: 'testcase:list',
  READ: 'testcase:read',
  CREATE: 'testcase:create',
  UPDATE: 'testcase:update',
  DELETE: 'testcase:delete',
  RUN: 'testcase:run',
  IMPORT: 'testcase:import',
  EXPORT: 'testcase:export',
} as const;

// 角色代码
export const ROLE_CODES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  TEST_ENGINEER: 'test_engineer',
  VIEWER: 'viewer',
} as const;

// 导出所有权限代码
export const PERMISSION_CODES = {
  ...USER,
  ...ROLE,
  ...PERMISSION,
  ...PROJECT,
  ...TESTCASE,
} as const;

// 导出类型
export type PermissionCode = typeof PERMISSION_CODES[keyof typeof PERMISSION_CODES];
export type RoleCode = typeof ROLE_CODES[keyof typeof ROLE_CODES];
