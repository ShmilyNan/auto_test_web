/**
 * 通用类型定义
 */

// 分页参数
export interface PaginationParams {
  page_num?: number;
  page_size?: number;
}

// 分页响应（后端返回数组，前端自行处理分页）
export interface PaginatedResponse<T> {
  items: T[];
  total?: number;
  page_num?: number;
  page_size?: number;
}

// API 响应包装
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// 错误响应
export interface ErrorResponse {
  detail: string;
  status_code?: number;
}

// 验证错误
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// HTTP 验证错误响应
export interface HTTPValidationError {
  detail: ValidationError[];
}
