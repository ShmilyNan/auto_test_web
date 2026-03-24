"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStats } from "@/lib/api/stats";
import {
  FolderOpen,
  FileCode,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  // 获取统计数据
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const statCards = [
    {
      title: "项目总数",
      value: stats?.projects_count || 0,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "测试用例",
      value: stats?.test_cases_count || 0,
      icon: FileCode,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "测试计划",
      value: stats?.plans_count || 0,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "测试报告",
      value: stats?.reports_count || 0,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500">API自动化测试平台概览</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pass Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              通过率统计
            </CardTitle>
            <CardDescription>最近测试执行的通过率</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">加载中...</div>
            ) : stats?.pass_rate !== undefined ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {(stats.pass_rate * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.pass_rate * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">暂无数据</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              最近报告
            </CardTitle>
            <CardDescription>最近执行的测试报告</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">加载中...</div>
            ) : stats?.recent_reports && stats.recent_reports.length > 0 ? (
              <div className="space-y-2">
                {stats.recent_reports.map((report: any) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {report.status === "passed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {report.plan_name || `报告 #${report.id}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="text-green-600">
                          {report.passed_cases}
                        </span>
                        {" / "}
                        <span className="text-red-600">
                          {report.failed_cases}
                        </span>
                        {" / "}
                        <span>{report.total_cases}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">暂无测试报告</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速开始</CardTitle>
          <CardDescription>常用功能入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/projects"
              className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FolderOpen className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">管理项目</span>
            </a>
            <a
              href="/test-cases"
              className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FileCode className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">测试用例</span>
            </a>
            <a
              href="/plans"
              className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Calendar className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">测试计划</span>
            </a>
            <a
              href="/reports"
              className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">测试报告</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
