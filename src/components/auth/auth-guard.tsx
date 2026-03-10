'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 认证守卫组件
 * 未登录时自动跳转到登录页
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { token, user } = useUserStore();
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

  useEffect(() => {
    // 检查 localStorage 是否已初始化（Zustand persist 会写入 user-storage）
    const checkStorage = () => {
      if (typeof window !== 'undefined') {
        const hasStorage = localStorage.getItem('user-storage') !== null;
        console.log('AuthGuard: localStorage has user-storage:', hasStorage);
        setHasCheckedStorage(true);
      }
    };

    checkStorage();

    // 如果还没有，使用短延时再次检查（处理异步初始化）
    const timer = setTimeout(checkStorage, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('AuthGuard - hasCheckedStorage:', hasCheckedStorage, 'token:', !!token, 'user:', !!user);

    // 只有在检查完存储后且没有 token 时才跳转
    if (hasCheckedStorage && !token && typeof window !== 'undefined') {
      // 当前不是登录页才跳转
      const isLoginPage = window.location.pathname.includes('/login')
      if (!isLoginPage) {
        console.log('AuthGuard: 无 token，跳转到登录页')
        // router.push('/login');
        window.location.href = '/login'
      }
    }
  }, [token, hasCheckedStorage]);

  // 未检查存储时返回空（避免闪烁）
  if (!hasCheckedStorage) {
    console.log('AuthGuard: 等待检查存储');
    return null;
  }

  // 未登录时不渲染子组件（返回空或加载状态）
  if (!token || !user) {
    console.log('AuthGuard: 未登录，返回 null');
    return null;
  }

  console.log('AuthGuard: 未登录，渲染子组件');
  return <>{children}</>;
}