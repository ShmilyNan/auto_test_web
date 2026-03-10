'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';

interface NavigationItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  children?: Array<{
    name: string;
    href: string;
    icon: LucideIcon;
  }>;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navigation: NavigationItem[];
}

export function Sidebar({ isOpen, setIsOpen, navigation }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['系统设置']));

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuName)) {
        newSet.delete(menuName);
      } else {
        newSet.add(menuName);
      }
      return newSet;
    });
  };

  const isSubmenuActive = (item: NavigationItem) => {
    if (!item.children) return false;
    return item.children.some((child) => pathname === child.href);
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-white transition-all duration-300',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b">
        <span
          className={cn(
            'text-xl font-bold text-blue-600',
            isOpen ? 'block' : 'hidden'
          )}
        >
          APITest
        </span>
        <span
          className={cn(
            'text-xl font-bold text-blue-600',
            !isOpen ? 'block' : 'hidden'
          )}
        >
          AT
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          // 有子菜单的情况
          if (item.children && item.children.length > 0) {
            const isExpanded = expandedMenus.has(item.name);
            const isActive = isSubmenuActive(item);

            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  title={isOpen ? undefined : item.name}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn('h-5 w-5 flex-shrink-0')} />
                    <span className={cn(isOpen ? 'block' : 'hidden')}>
                      {item.name}
                    </span>
                  </div>
                  {isOpen && (
                    <span className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </button>

                {/* 子菜单 */}
                {isOpen && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isChildActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          )}
                        >
                          <child.icon className={cn('h-4 w-4 flex-shrink-0')} />
                          <span>{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // 无子菜单的情况
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              title={isOpen ? undefined : item.name}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0')} />
              <span className={cn(isOpen ? 'block' : 'hidden')}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="border-t p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          {isOpen ? (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              <span>收起</span>
            </>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7-7"
              />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
}
