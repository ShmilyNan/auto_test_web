import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '自动化测试平台',
    template: '%s | 自动化测试平台',
  },
  description: '专业的 API 自动化测试平台，支持多种用例导入方式和可视化测试报告',
  authors: [{ name: 'ApiTest Team' }],
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Providers>
          {isDev && <Inspector />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
