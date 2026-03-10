'use client';

import { TestTube, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const statsData = [
  {
    title: '总用例数',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: TestTube,
  },
  {
    title: '通过用例',
    value: '1,089',
    change: '+8%',
    trend: 'up',
    icon: CheckCircle,
  },
  {
    title: '失败用例',
    value: '145',
    change: '-3%',
    trend: 'down',
    icon: XCircle,
  },
  {
    title: '执行中',
    value: '15',
    change: '+2',
    trend: 'up',
    icon: Clock,
  },
];

const executionTrendData = [
  { name: '周一', 执行: 120, 通过: 110, 失败: 10 },
  { name: '周二', 执行: 150, 通过: 135, 失败: 15 },
  { name: '周三', 执行: 180, 通过: 165, 失败: 15 },
  { name: '周四', 执行: 200, 通过: 185, 失败: 15 },
  { name: '周五', 执行: 220, 通过: 200, 失败: 20 },
  { name: '周六', 执行: 100, 通过: 95, 失败: 5 },
  { name: '周日', 执行: 80, 通过: 78, 失败: 2 },
];

const passRateData = [
  { name: '项目 A', value: 92 },
  { name: '项目 B', value: 88 },
  { name: '项目 C', value: 95 },
  { name: '项目 D', value: 85 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500">测试执行概览和数据分析</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-600" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-green-600'}>
                  {stat.change}
                </span>
                <span className="text-gray-500">较上周</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Execution Trend */}
        <Card>
          <CardHeader>
            <CardTitle>执行趋势</CardTitle>
            <CardDescription>最近7天的测试执行情况</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={executionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="执行" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="通过" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="失败" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pass Rate by Project */}
        <Card>
          <CardHeader>
            <CardTitle>项目通过率</CardTitle>
            <CardDescription>各项目的测试通过率统计</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={passRateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {passRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>最近执行</CardTitle>
          <CardDescription>最近的测试执行记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      i % 3 === 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {i % 3 === 0 ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">测试执行 #{1000 + i}</div>
                    <div className="text-sm text-gray-500">项目 A - {50 - i * 5} 个用例</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      i % 3 === 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {i % 3 === 0 ? '失败' : '通过'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {i === 1 ? '5 分钟前' : `${i * 10} 分钟前`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
