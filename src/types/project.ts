/**
 * 项目相关类型定义
 */

// 项目响应
export interface ProjectResponse {
  id: number;
  name: string;
  description: string | null;
  base_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by_id: number;
}

// 项目列表响应（简化版）
export interface ProjectListResponse {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// 项目创建
export interface ProjectCreate {
  name: string;
  description?: string;
  base_url?: string;
}

// 项目更新
export interface ProjectUpdate {
  name?: string;
  description?: string;
  base_url?: string;
  is_active?: boolean;
}

// 项目统计
export interface ProjectStatsResponse {
  project_id: number;
  project_name: string;
  total_test_cases: number;
  total_executions: number;
  success_rate: number;
  avg_duration: number;
}
