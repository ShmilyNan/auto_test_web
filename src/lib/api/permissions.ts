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
  return apiClient.get<PermissionResponse[]>('/permissions/');
};

// 创建权限
export const createPermission = async (
  data: PermissionCreate
): Promise<PermissionResponse> => {
  return apiClient.post<PermissionResponse>('/permissions/', data);
};
