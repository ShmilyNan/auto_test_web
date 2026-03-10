import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// 响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 列表响应类型
export interface ListResponse<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 错误类型
export interface ApiError {
  code: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 从 localStorage 获取 token
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 返回完整响应对象，在具体调用时通过 response.data 获取数据
        return response;
      },
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const { status, data } = error.response;

          // 401 未授权，跳转登录
          if (status === 401 && typeof window !== 'undefined') {
            // 清除 token
            localStorage.removeItem('token');
            // 跳转登录页
            window.location.href = '/login';
          }

          return Promise.reject({
            code: data?.code || status,
            message: data?.message || '请求失败',
            errors: data?.errors,
          });
        }

        // 网络错误
        return Promise.reject({
          code: 0,
          message: '网络连接失败，请检查网络设置',
        });
      }
    );
  }

  // GET 请求
  async get<T = any>(url: string, params?: any, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params, ...config });
    return response.data;
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

export default apiClient;
