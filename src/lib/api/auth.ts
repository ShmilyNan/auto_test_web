/**
 * 认证 API
 */
import { apiClient } from './client';
import type {
  LoginRequest,
  TokenResponse,
  UserResponse,
  ChangePasswordRequest,
} from '@/types/auth';
import type { ResponseModel } from '@/types/common';

// 用户登录
export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/api/auth/login', data);
  return response;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/api/auth/me');
  return response;
};

// 修改密码
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ResponseModel> => {
  const response = await apiClient.put<ResponseModel>(
    '/api/auth/change-password',
    data
  );
  return response;
};

// 用户登出
export const logout = async (): Promise<ResponseModel> => {
  const response = await apiClient.post<ResponseModel>('/api/auth/logout');
  return response;
};
