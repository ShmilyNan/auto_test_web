/**
 * 认证 API
 * 基于 OpenAPI 文档更新
 */
import { apiClient } from './client';
import type {
  UserResponse,
  UserCreate,
  UserUpdate,
  LoginRequest,
  Token,
} from '@/types/auth';

// 用户注册
export const register = async (data: UserCreate): Promise<UserResponse> => {
  return apiClient.post<UserResponse>('/auth/register', data);
};

// 用户登录（JSON格式）
export const login = async (data: LoginRequest): Promise<Token> => {
  return apiClient.post<Token>('/auth/login/json', data);
};

// 用户登录（表单格式）
export const loginForm = async (username: string, password: string): Promise<Token> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  return apiClient.post<Token>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<UserResponse> => {
  return apiClient.get<UserResponse>('/users/me');
};

// 更新用户信息
export const updateUser = async (userId: number, data: UserUpdate): Promise<UserResponse> => {
  return apiClient.put<UserResponse>(`/users/${userId}`, data);
};
