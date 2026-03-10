/**
 * 角色管理 API
 */
import { apiClient } from './client';
import type {
  RoleResponse,
  RoleCreate,
  RoleUpdate,
} from '@/types/auth';
import type { PaginatedResponse, PaginationParams } from '@/types/common';

// 获取角色列表
export const getRoles = async (
  params?: PaginationParams
): Promise<PaginatedResponse<RoleResponse>> => {
  const response = await apiClient.get<PaginatedResponse<RoleResponse>>(
    '/api/roles',
    { params }
  );
  return response;
};

// 获取角色详情
export const getRole = async (roleId: number): Promise<RoleResponse> => {
  const response = await apiClient.get<RoleResponse>(`/api/roles/${roleId}`);
  return response;
};

// 创建角色
export const createRole = async (data: RoleCreate): Promise<RoleResponse> => {
  const response = await apiClient.post<RoleResponse>('/api/roles', data);
  return response;
};

// 更新角色
export const updateRole = async (
  roleId: number,
  data: RoleUpdate
): Promise<RoleResponse> => {
  const response = await apiClient.put<RoleResponse>(
    `/api/roles/${roleId}`,
    data
  );
  return response;
};

// 删除角色
export const deleteRole = async (roleId: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/roles/${roleId}`
  );
  return response;
};
