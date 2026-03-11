/**
 * 项目管理 API
 */
import { apiClient } from './client';
import type {
  ProjectResponse,
  ProjectCreate,
  ProjectUpdate,
  ProjectListResponse,
  ProjectStatsResponse,
} from '@/types/project';
import type { PaginatedResponse, PaginationParams } from '@/types/common';

// 获取项目列表（分页）
export const getProjects = async (
  params?: PaginationParams & {
    name?: string;
    is_active?: boolean;
  }
): Promise<PaginatedResponse<ProjectListResponse>> => {
  const response = await apiClient.get<PaginatedResponse<ProjectListResponse>>(
    '/api/projects',
    params
  );
  return response;
};

// 获取项目详情
export const getProject = async (projectId: number): Promise<ProjectResponse> => {
  const response = await apiClient.get<ProjectResponse>(
    `/api/projects/${projectId}`
  );
  return response;
};

// 创建项目
export const createProject = async (
  data: ProjectCreate
): Promise<ProjectResponse> => {
  const response = await apiClient.post<ProjectResponse>('/api/projects', data);
  return response;
};

// 更新项目
export const updateProject = async (
  projectId: number,
  data: ProjectUpdate
): Promise<ProjectResponse> => {
  const response = await apiClient.put<ProjectResponse>(
    `/api/projects/${projectId}`,
    data
  );
  return response;
};

// 删除/归档项目
export const deleteProject = async (
  projectId: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/projects/${projectId}`
  );
  return response;
};

// 获取项目统计
export const getProjectStats = async (): Promise<ProjectStatsResponse[]> => {
  const response = await apiClient.get<ProjectStatsResponse[]>(
    '/api/projects/stats'
  );
  return response;
};
