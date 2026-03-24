/**
 * 用户管理 API
 * 基于 OpenAPI 文档更新
 */
import { apiClient } from './client';
import type {
  UserResponse,
  UserUpdate,
  DeleteUserResponse,
  DeleteUserError,
} from '@/types/auth';
import type { PaginationParams } from '@/types/common';

// 获取用户列表
export const getUsers = async (
  params?: PaginationParams
): Promise<UserResponse[]> => {
  return apiClient.get<UserResponse[]>('/users/', params);
};

// 获取用户详情
export const getUser = async (userId: number): Promise<UserResponse> => {
  return apiClient.get<UserResponse>(`/users/${userId}`);
};

// 更新用户
export const updateUserInfo = async (
  userId: number,
  data: UserUpdate
): Promise<UserResponse> => {
  return apiClient.put<UserResponse>(`/users/${userId}`, data);
};

// 删除用户
export const deleteUser = async (
  userId: number
): Promise<DeleteUserResponse> => {
  return apiClient.delete<DeleteUserResponse>(`/users/${userId}`);
};
