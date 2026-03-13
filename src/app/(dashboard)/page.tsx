"use client";

import { TestTube, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/api/reports";
import { exec } from "child_process";
import { title } from "process";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => getDashboardData(),
  });

  const statsData = [
    {
      title: "总用例数",
      value: data?.stats.total_cases ?? 0,
      icon: TestTube,
      change: data?.stats.total_change ?? "-",
    },
    {
      title: "通过用例",
      value: data?.stats.passed_cases ?? 0,
      icon: CheckCircle,
      change: data?.stats.passed_change ?? "-",
    },
    {
      title: "失败用例",
      value: data?.stats.failed_cases ?? 0,
      icon: XCircle,
      change: data?.stats.failed_change ?? "-",
    },
    {
      title: "执行中",
      value: data?.stats.running_cases ?? "-",
      icon: Clock,
      change: data?.stats.running_change ?? "-",
    },
  ];

  const executionTrendData = (data?.execution_trend ?? []).map((item) => ({
    name: item.date,
    执行: item.executed,
    通过: item.passed,
    失败: item.failed,
  }));

  const passRateData = data?.pass_rate_by_project ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500">测试执行概览和数据分析</p>
      </div>

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
              <div className="text-2xl font-bold">
                {isLoading ? "-" : stat.value}
              </div>
              <div className="text-xs text-gray-500">
                较上周 {isLoading ? "-" : stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
                <Line
                  type="monotone"
                  dataKey="执行"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="通过"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="失败"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {passRateData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近执行</CardTitle>
          <CardDescription>最近的测试执行记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(data?.recent_executions ?? []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    {item.project_name} - {item.case_count} 个用例
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${item.status === "failed" ? "text-red-600" : item.status === "running" ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {item.status === "failed"
                      ? "失败"
                      : item.status === "running"
                        ? "执行中"
                        : "通过"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && (data?.recent_executions?.length ?? 0) === 0 && (
              <div className="py-8 text-center text-gray-500">暂无执行记录</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
