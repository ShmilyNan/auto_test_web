/**
 * 测试计划 API
 * 基于 OpenAPI 文档更新
 */
import { apiClient } from './client';
import type {
  TestPlanResponse,
  TestPlanCreate,
  TestPlanUpdate,
  ExecutionRecordResponse,
  ExecutionDetailResponse,
  ExecutionResultResponse,
} from '@/types/plan';
import type { PaginationParams } from '@/types/common';

// 类型别名，便于使用
export type PlanResponse = TestPlanResponse;

// ==================== 测试计划 ====================

// 获取测试计划列表
export const getTestPlans = async (
  params?: PaginationParams & {
    project_id?: number;
    is_active?: boolean;
  }
): Promise<TestPlanResponse[]> => {
  return apiClient.get<TestPlanResponse[]>('/plans/', params);
};

// 别名，便于使用
export const getPlans = getTestPlans;

// 获取测试计划详情
export const getTestPlan = async (planId: number): Promise<TestPlanResponse> => {
  return apiClient.get<TestPlanResponse>(`/plans/${planId}`);
};

// 创建测试计划
export const createTestPlan = async (data: TestPlanCreate): Promise<TestPlanResponse> => {
  return apiClient.post<TestPlanResponse>('/plans/', data);
};

// 别名
export const createPlan = createTestPlan;

// 更新测试计划
export const updateTestPlan = async (
  planId: number,
  data: TestPlanUpdate
): Promise<TestPlanResponse> => {
  return apiClient.put<TestPlanResponse>(`/plans/${planId}`, data);
};

// 别名
export const updatePlan = updateTestPlan;

// 删除测试计划
export const deleteTestPlan = async (planId: number): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(`/plans/${planId}`);
};

// 别名
export const deletePlan = deleteTestPlan;

// ==================== 执行计划 ====================

// 异步运行测试计划
export const runTestPlan = async (planId: number): Promise<ExecutionResultResponse> => {
  return apiClient.post<ExecutionResultResponse>(`/plans/${planId}/run`);
};

// 同步运行测试计划（等待执行完成）
export const runTestPlanSync = async (planId: number): Promise<ExecutionDetailResponse> => {
  return apiClient.post<ExecutionDetailResponse>(`/plans/${planId}/run-sync`);
};

// 获取计划的执行记录列表
export const getPlanExecutions = async (
  planId: number,
  params?: PaginationParams
): Promise<ExecutionRecordResponse[]> => {
  return apiClient.get<ExecutionRecordResponse[]>(`/plans/${planId}/executions`, params);
};

// ==================== 执行记录 ====================

// 获取执行详情
export const getExecutionDetail = async (
  executionId: number
): Promise<ExecutionDetailResponse> => {
  return apiClient.get<ExecutionDetailResponse>(`/plans/executions/${executionId}`);
};

// 取消执行
export const cancelExecution = async (
  executionId: number
): Promise<{ message: string }> => {
  return apiClient.post<{ message: string }>(`/plans/executions/${executionId}/cancel`);
};

// 重新执行
export const rerunExecution = async (
  executionId: number
): Promise<ExecutionResultResponse> => {
  return apiClient.post<ExecutionResultResponse>(`/plans/executions/${executionId}/rerun`);
};
