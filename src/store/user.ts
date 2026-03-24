/**
 * 用户状态管理
 * 使用 Zustand 管理用户认证状态
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '@/types/auth';
import { login as loginApi, getCurrentUser } from '@/lib/api/auth';

interface UserState {
  token: string | null;
  user: UserResponse | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: UserResponse | null) => void;
  setToken: (token: string) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  isAdmin: () => boolean;
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
          const response = await loginApi({ username, password });
          console.log('登录响应:', response);

          // 保存 token
          localStorage.setItem('token', response.access_token);

          // 获取用户信息
          const userInfo = await getCurrentUser();
          console.log('用户信息:', userInfo);

          // 保存状态
          set({
            token: response.access_token,
            user: userInfo,
            isAuthenticated: true,
          });

          console.log('登录状态已保存');
        } catch (error) {
          console.error('登录失败:', error);
          throw error;
        }
      },

      logout: () => {
        // 清除状态
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });

        // 清除 localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },

      fetchUser: async () => {
        try {
          const userInfo = await getCurrentUser();
          set({
            user: userInfo,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('获取用户信息失败:', error);
          // Token 可能已过期
          get().logout();
          throw error;
        }
      },

      hasRole: (roleName: string) => {
        const { user } = get();
        if (!user) return false;
        return user.role === roleName || user.is_superuser;
      },

      isAdmin: () => {
        const { user } = get();
        if (!user) return false;
        return user.is_superuser || user.role === 'admin';
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
