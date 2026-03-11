/**
 * 用户管理 API
 */
import { apiClient } from './client';
import type {
  UserListResponse,
  UserResponse,
  UserCreate,
  UserUpdate,
} from '@/types/auth';
import type { PaginatedResponse, PaginationParams } from '@/types/common';

// 获取用户列表（分页）
export const getUsers = async (
  params?: PaginationParams & {
    username?: string;
    email?: string;
    is_active?: boolean;
  }
): Promise<PaginatedResponse<UserListResponse>> => {
  const response = await apiClient.get<PaginatedResponse<UserListResponse>>(
    '/api/users',
    params
  );
  return response;
};

// 获取用户详情
export const getUser = async (userId: number): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>(`/api/users/${userId}`);
  return response;
};

// 创建用户
export const createUser = async (data: UserCreate): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/api/users', data);
  return response;
};

// 更新用户
export const updateUser = async (
  userId: number,
  data: UserUpdate
): Promise<UserResponse> => {
  const response = await apiClient.put<UserResponse>(
    `/api/users/${userId}`,
    data
  );
  return response;
};

// 删除用户
export const deleteUser = async (userId: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/users/${userId}`
  );
  return response;
};

// 重置用户密码
export const resetUserPassword = async (
  userId: number,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>(
    `/api/users/${userId}/reset-password`,
    null,
    { params: { new_password: newPassword } }
  );
  return response;
};
