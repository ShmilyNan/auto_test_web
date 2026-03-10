'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock execution data
const executionData = {
  id: 'EXEC-20240307-001',
  project: '用户服务 API',
  startTime: '2024-03-07 10:30:00',
  endTime: '2024-03-07 10:35:30',
  duration: '5分30秒',
  totalCases: 128,
  passed: 115,
  failed: 13,
  passRate: 89.8,
};

const caseResults = [
  { id: 1, name: '用户登录', method: 'POST', status: 'passed', duration: '234ms' },
  { id: 2, name: '用户注册', method: 'POST', status: 'passed', duration: '456ms' },
  { id: 3, name: '获取用户信息', method: 'GET', status: 'failed', duration: '123ms', error: '404 Not Found' },
  { id: 4, name: '更新用户信息', method: 'PUT', status: 'passed', duration: '345ms' },
  { id: 5, name: '删除用户', method: 'DELETE', status: 'passed', duration: '189ms' },
];

const trendData = [
  { name: '执行1', 通过: 110, 失败: 10 },
  { name: '执行2', 通过: 115, 失败: 13 },
  { name: '执行3', 通过: 120, 失败: 8 },
  { name: '执行4', 通过: 125, 失败: 3 },
  { name: '执行5', 通过: 115, 失败: 13 },
];

export default function ReportsPage() {
  const [selectedExecution, setSelectedExecution] = useState(executionData.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">测试报告</h1>
          <p className="mt-1 text-sm text-gray-500">查看和分析测试执行结果</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          导出报告
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总用例数</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executionData.totalCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">通过</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{executionData.passed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">失败</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{executionData.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">通过率</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executionData.passRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="details">用例详情</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>执行信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm text-gray-500">执行 ID</div>
                  <div className="font-medium">{executionData.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">项目</div>
                  <div className="font-medium">{executionData.project}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">执行时长</div>
                  <div className="font-medium">{executionData.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">开始时间</div>
                  <div className="font-medium">{executionData.startTime}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">结束时间</div>
                  <div className="font-medium">{executionData.endTime}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>趋势分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="通过" fill="#22c55e" />
                  <Bar dataKey="失败" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>用例执行详情</CardTitle>
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="选择执行" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">最新执行</SelectItem>
                      <SelectItem value="previous">上次执行</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="搜索用例..." className="w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>用例名称</TableHead>
                    <TableHead>方法</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>耗时</TableHead>
                    <TableHead>错误信息</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.id}</TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={result.status === 'passed' ? 'default' : 'destructive'}
                          className={
                            result.status === 'passed'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : ''
                          }
                        >
                          {result.status === 'passed' ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              通过
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              失败
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.duration}</TableCell>
                      <TableCell className="text-red-600">{result.error || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>执行历史</CardTitle>
              <CardDescription>查看历史执行记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          i % 3 === 0
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {i % 3 === 0 ? (
                          <XCircle className="h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">执行 #{1000 + i}</div>
                        <div className="text-sm text-gray-500">
                          {executionData.project} - {executionData.totalCases} 个用例
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">通过率</div>
                        <div className="font-medium">
                          {i % 3 === 0 ? '89%' : '98%'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">耗时</div>
                        <div className="font-medium">5分{30 - i * 3}秒</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">时间</div>
                        <div className="font-medium">
                          {i === 1 ? '今天' : `${i} 天前`}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
