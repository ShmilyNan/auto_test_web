/**
 * 认证和用户相关类型定义
 * 基于 OpenAPI 文档更新
 */

// 用户响应
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  role: string;
  is_superuser: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

// 用户创建
export interface UserCreate {
  username: string;
  email: string;
  full_name?: string | null;
  password: string;
}

// 用户更新
export interface UserUpdate {
  email?: string | null;
  full_name?: string | null;
  password?: string | null;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface Token {
  access_token: string;
  token_type: string;
}

// 删除用户响应
export interface DeleteUserResponse {
  success: boolean;
  message: string;
  user_id: number;
  username: string;
  detail: string;
}

// 删除用户错误
export interface DeleteUserError {
  success: boolean;
  message: string;
  error_code: string;
  detail: string;
}

// 权限响应（保留兼容）
export interface PermissionResponse {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  code?: string;
  created_at?: string;
}

// 权限创建（保留兼容）
export interface PermissionCreate {
  name: string;
  resource: string;
  action: string;
  description?: string | null;
  code?: string;
}

// 角色响应（保留兼容）
export interface RoleResponse {
  id: number;
  name: string;
  description: string | null;
  permissions: PermissionResponse[];
  created_at: string;
  updated_at: string | null;
}

// 角色创建（保留兼容）
export interface RoleCreate {
  name: string;
  description?: string;
  permission_ids?: number[];
}

// 角色更新（保留兼容）
export interface RoleUpdate {
  name?: string;
  description?: string;
  permission_ids?: number[];
}
