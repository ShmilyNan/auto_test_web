"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getReports, getReport } from "@/lib/api/reports";
import type { ReportResponse, ReportDetailResponse } from "@/types/report";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(
    null,
  );
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // 获取测试报告列表
  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getReports(),
  });

  const handleViewDetail = async (report: ReportResponse) => {
    setSelectedReport(report);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            完成
          </Badge>
        );
      case "generating":
        return (
          <Badge className="bg-blue-500">
            <Clock className="mr-1 h-3 w-3" />
            生成中
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="secondary">
            <CheckCircle className="mr-1 h-3 w-3" />
            已归档
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">测试报告</h1>
        <p className="mt-1 text-sm text-gray-500">查看测试执行报告和统计数据</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总报告数</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">通过报告</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports?.filter(
                (r) => r.status === "completed" && r.pass_rate >= 0.8,
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">失败报告</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reports?.filter(
                (r) => r.status === "completed" && r.pass_rate < 0.8,
              ).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>报告列表</CardTitle>
          <CardDescription>
            共 {reports?.length || 0} 个测试报告
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : !reports || reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无测试报告数据
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>计划名称</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>用例统计</TableHead>
                  <TableHead>通过率</TableHead>
                  <TableHead>执行时间</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.project_name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <span className="text-green-600">{report.passed}</span>
                      {" / "}
                      <span className="text-red-600">{report.failed}</span>
                      {" / "}
                      <span>{report.total_cases}</span>
                    </TableCell>
                    <TableCell>
                      {(report.pass_rate * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      {report.duration ? `${report.duration}s` : "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleViewDetail(report)}
                      >
                        查看详情
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>测试报告详情</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">报告ID</p>
                  <p className="font-medium">{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">计划名称</p>
                  <p className="font-medium">
                    {selectedReport.project_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">状态</p>
                  <div>{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">执行时长</p>
                  <p className="font-medium">
                    {selectedReport.duration
                      ? `${selectedReport.duration}s`
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedReport.passed}
                  </p>
                  <p className="text-sm text-gray-500">通过用例</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {selectedReport.failed}
                  </p>
                  <p className="text-sm text-gray-500">失败用例</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {selectedReport.skipped}
                  </p>
                  <p className="text-sm text-gray-500">跳过用例</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {(selectedReport.pass_rate * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">通过率</p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                创建时间: {new Date(selectedReport.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
