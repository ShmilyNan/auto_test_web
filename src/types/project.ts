/**
 * 项目相关类型定义
 * 基于 OpenAPI 文档更新
 */

// 项目响应
export interface ProjectResponse {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

// 项目创建
export interface ProjectCreate {
  name: string;
  description?: string | null;
}

// 项目更新
export interface ProjectUpdate {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

// 项目成员响应
export interface ProjectMemberResponse {
  id: number;
  project_id: number;
  user_id: number;
  role: string;
  joined_at: string;
}

// 项目成员创建
export interface ProjectMemberCreate {
  user_id: number;
  role?: string;
}

// 删除项目响应
export interface DeleteProjectResponse {
  success: boolean;
  message: string;
  project_id: number;
  project_name: string;
  detail: string;
}

// 删除项目错误
export interface DeleteProjectError {
  success: boolean;
  message: string;
  error_code: string;
  detail: string;
}
