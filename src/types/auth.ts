/**
 * 认证相关类型定义
 */

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// Token 响应
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user: UserResponse;
}

// 用户响应
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  roles: RoleResponse[];
  created_at: string;
  updated_at: string;
}

// 用户列表响应（简化版）
export interface UserListResponse {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

// 用户类型（用于 store）
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  roles: RoleResponse[];
}

// 认证状态（用于 store）
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

// 修改密码请求
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

// 创建用户
export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role_ids?: number[];
}

// 更新用户
export interface UserUpdate {
  email?: string;
  full_name?: string;
  password?: string;
  is_active?: boolean;
  role_ids?: number[];
}

// 角色响应
export interface RoleResponse {
  id: number;
  name: string;
  code?: string;
  description: string | null;
  is_active?: boolean;
  permissions: PermissionResponse[];
  created_at: string;
  updated_at: string;
}

// 角色创建/更新
export interface RoleCreate {
  name: string;
  description?: string;
  permission_ids?: number[];
}

export interface RoleUpdate {
  name?: string;
  description?: string;
  permission_ids?: number[];
}

// 权限响应
export interface PermissionResponse {
  id: number;
  name: string;
  code: string,
  description: string | null;
  resource: string;
  action: string;
  created_at: string;
}

// 权限创建
export interface PermissionCreate {
  name: string;
  description?: string;
  resource: string;
  action: string;
}
