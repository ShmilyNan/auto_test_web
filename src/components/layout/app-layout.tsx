'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  TestTube,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Users,
  Shield,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sidebar } from '@/components/layout/sidebar';
import { useUserStore } from '@/store/user';

const navigation = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '项目管理', href: '/projects', icon: FolderKanban },
  { name: '测试用例', href: '/test-cases', icon: TestTube },
  { name: '测试报告', href: '/reports', icon: BarChart3 },
  {
    name: '系统设置',
    icon: Settings,
    children: [
      { name: '用户管理', href: '/users', icon: Users },
      { name: '角色管理', href: '/roles', icon: Shield },
      { name: '权限管理', href: '/permissions', icon: Key },
    ],
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // 获取用户名首字母作为头像
  const userInitial = user?.full_name
    ? user.full_name.charAt(0).toUpperCase()
    : user?.username?.charAt(0).toUpperCase() || 'U';

  // 获取用户角色名称
  const roleNames = user?.roles.map(r => r.name).join(', ') || '用户';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} navigation={navigation} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">自动化测试平台</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="搜索..."
                  className="w-64 pl-9"
                />
              </div>
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.full_name || user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <User className="h-3 w-3" />
                      {roleNames}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  账号设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
