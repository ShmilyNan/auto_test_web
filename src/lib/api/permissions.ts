/**
 * 权限管理 API
 */
import { apiClient } from './client';
import type {
  PermissionResponse,
  PermissionCreate,
} from '@/types/auth';

// 获取所有权限列表
export const getPermissions = async (): Promise<PermissionResponse[]> => {
  const response = await apiClient.get<PermissionResponse[]>('/api/permissions');
  return response;
};

// 创建权限
export const createPermission = async (
  data: PermissionCreate
): Promise<PermissionResponse> => {
  const response = await apiClient.post<PermissionResponse>(
    '/api/permissions',
    data
  );
  return response;
};
