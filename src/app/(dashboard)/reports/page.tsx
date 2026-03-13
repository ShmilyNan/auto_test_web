"use client";

import { useMemo, useState } from "react";
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getReport, getReports } from "@/lib/api/reports";

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["reports", page],
    queryFn: () =>
      getReports({
        page,
        page_size: 10,
      }),
  });

  const { data: reportDetail, isFetching: isDetailLoading } = useQuery({
    queryKey: ["report-detail", selectedReportId],
    queryFn: () => getReport(selectedReportId as number),
    enabled: selectedReportId !== null,
  });

  const summary = useMemo(() => {
    const items = reportsData?.items ?? [];
    const total = items.reduce((acc, cur) => acc + cur.total_test_cases, 0);
    const passed = items.reduce((acc, cur) => acc + cur.passed, 0);
    const failed = items.reduce((acc, cur) => acc + cur.failed, 0);
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : "0.00";
    return { total, passed, failed, passRate };
  }, [reportsData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">测试报告</h1>
        <p className="mt-1 text-sm text-gray-500">测试报告列表与详情查看</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总用例数</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">通过</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.passed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">失败</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary.failed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">通过率</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.passRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>测试报告列表</CardTitle>
          <CardDescription>共 {reportsData?.total ?? 0} 条报告</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">加载中...</div>
          ) : (reportsData?.items.length ?? 0) === 0 ? (
            <div className="py-12 text-center text-gray-500">暂无测试报告</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>项目</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>总用例</TableHead>
                  <TableHead>通过</TableHead>
                  <TableHead>失败</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsData?.items.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>{report.project_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === "completed"
                            ? "default"
                            : report.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          report.status === "completed"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : ""
                        }
                      >
                        {report.status === "completed"
                          ? "已完成"
                          : report.status === "failed"
                            ? "失败"
                            : "运行中"}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.total_test_cases}</TableCell>
                    <TableCell>{report.passed}</TableCell>
                    <TableCell>{report.failed}</TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReportId(report.id)}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {reportsData && reportsData.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {reportsData.total} 条记录，第 {reportsData.page} /{" "}
            {reportsData.pages} 页
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(reportsData.pages, p + 1))}
              disabled={page === reportsData.pages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={selectedReportId !== null}
        onOpenChange={(open) => !open && setSelectedReportId(null)}
      >
        <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              报告详情 {selectedReportId ? `#${selectedReportId}` : ""}
            </DialogTitle>
          </DialogHeader>

          {isDetailLoading || !reportDetail ? (
            <div className="py-12 text-center text-gray-500">加载详情中...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    总用例：{reportDetail.total_test_cases}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-green-600">
                    通过：{reportDetail.passed}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-red-600">
                    失败：{reportDetail.failed}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    耗时：{reportDetail.total_duration} ms
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>用例执行结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用例ID</TableHead>
                        <TableHead>用例名称</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>耗时(ms)</TableHead>
                        <TableHead>步骤数</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportDetail.test_case_results.map((result) => (
                        <TableRow key={result.test_case_id}>
                          <TableCell>{result.test_case_id}</TableCell>
                          <TableCell>{result.test_case_name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                result.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                result.status === "success"
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : ""
                              }
                            >
                              {result.status === "success"
                                ? "通过"
                                : result.status === "failed"
                                  ? "失败"
                                  : "跳过"}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.duration}</TableCell>
                          <TableCell>{result.steps.length}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
