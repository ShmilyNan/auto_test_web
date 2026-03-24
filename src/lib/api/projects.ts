/**
 * 项目管理 API
 * 基于 OpenAPI 文档更新
 */
import { apiClient } from './client';
import type {
  ProjectResponse,
  ProjectCreate,
  ProjectUpdate,
  ProjectMemberResponse,
  ProjectMemberCreate,
  DeleteProjectResponse,
  DeleteProjectError,
} from '@/types/project';
import type { PaginationParams } from '@/types/common';

// 获取项目列表
export const getProjects = async (
  params?: PaginationParams
): Promise<ProjectResponse[]> => {
  return apiClient.get<ProjectResponse[]>('/projects/', params);
};

// 获取我的项目
export const getMyProjects = async (): Promise<ProjectResponse[]> => {
  return apiClient.get<ProjectResponse[]>('/projects/my');
};

// 获取项目详情
export const getProject = async (projectId: number): Promise<ProjectResponse> => {
  return apiClient.get<ProjectResponse>(`/projects/${projectId}`);
};

// 创建项目
export const createProject = async (data: ProjectCreate): Promise<ProjectResponse> => {
  return apiClient.post<ProjectResponse>('/projects/', data);
};

// 更新项目
export const updateProject = async (
  projectId: number,
  data: ProjectUpdate
): Promise<ProjectResponse> => {
  return apiClient.put<ProjectResponse>(`/projects/${projectId}`, data);
};

// 删除项目
export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  return apiClient.delete<DeleteProjectResponse>(`/projects/${projectId}`);
};

// 获取项目成员列表
export const getProjectMembers = async (
  projectId: number
): Promise<ProjectMemberResponse[]> => {
  return apiClient.get<ProjectMemberResponse[]>(`/projects/${projectId}/members`);
};

// 添加项目成员
export const addProjectMember = async (
  projectId: number,
  data: ProjectMemberCreate
): Promise<ProjectMemberResponse> => {
  return apiClient.post<ProjectMemberResponse>(
    `/projects/${projectId}/members`,
    data
  );
};

// 移除项目成员
export const removeProjectMember = async (
  projectId: number,
  userId: number
): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(
    `/projects/${projectId}/members/${userId}`
  );
};

// 更新项目成员角色
export const updateMemberRole = async (
  projectId: number,
  userId: number,
  role: string
): Promise<ProjectMemberResponse> => {
  return apiClient.put<ProjectMemberResponse>(
    `/projects/${projectId}/members/${userId}/role`,
    { role }
  );
};
