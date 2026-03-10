/**
 * 通用类型定义
 */

// 分页参数
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// 通用响应模型
export interface ResponseModel {
  message: string;
}

// HTTP 验证错误
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
