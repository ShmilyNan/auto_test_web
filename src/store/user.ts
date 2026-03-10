/**
 * 用户状态管理
 * 使用 Zustand 管理用户认证状态
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth';
import { authApi } from '@/lib/api';

interface UserState extends AuthState {
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token, isAuthenticated: !!token });
        // 同时保存到 localStorage 供 axios 拦截器使用
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },

      login: async (username, password) => {
        try {
          const response = await authApi.login({ username, password });
          console.log('登录响应:', response);

          // 保存 token
          // get().setToken(response.access_token);
          localStorage.setItem('token', response.access_token);

          // 保存用户信息
          set({
            token: response.access_token,
            user: response.user,
            isAuthenticated: true,
          });

          // 保存到 localStorage（可选，供快速判断）
          if (typeof window !== 'undefined') {
            const permissions = response.user.roles.flatMap((role: any) =>
              role.permissions.map((p: any) => p.name)
            );
            localStorage.setItem('user_permissions', JSON.stringify(permissions));
            localStorage.setItem('user_roles', JSON.stringify(response.user.roles.map((r: any) => r.name)));
          }
          console.log('登录状态已保存');
        } catch (error) {
          console.error('登录失败:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('登出请求失败:', error);
        } finally {
          // 清除状态
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });

          // 清除 localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user_permissions');
            localStorage.removeItem('user_roles');
          }
        }
      },

      fetchUser: async () => {
        try {
          const response = await authApi.getCurrentUser();
          set({
            user: response,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('获取用户信息失败:', error);
          // Token 可能已过期
          await get().logout();
          throw error;
        }
      },

      hasPermission: (permission: string) => {
        const { user } = get();

        if (!user) return false;

        // 超级管理员拥有所有权限
        if (user.is_superuser) return true;

        // 检查用户的所有角色是否包含该权限
        return user.roles.some((role: any) =>
          role.permissions.some((p: any) => p.name === permission)
        );
      },

      hasRole: (roleName: string) => {
        const { user } = get();

        if (!user) return false;

        return user.roles.some((role: any) => role.name === roleName);
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          console.log('onRehydrateStorage: state =', state);
          if (state) {
            state._hasHydrated = true;
            console.log('onRehydrateStorage: _hasHydrated set to true');
          }
        };
      },
    }
  )
);
