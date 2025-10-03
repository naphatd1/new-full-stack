'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface ReportData {
  period: string;
  houses: number;
  users: number;
  revenue: number;
  views: number;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReportData([
        { period: 'มกราคม 2024', houses: 45, users: 234, revenue: 1250000, views: 12500 },
        { period: 'กุมภาพันธ์ 2024', houses: 52, users: 189, revenue: 1450000, views: 15600 },
        { period: 'มีนาคม 2024', houses: 38, users: 267, revenue: 980000, views: 11200 },
        { period: 'เมษายน 2024', houses: 61, users: 298, revenue: 1680000, views: 18900 },
        { period: 'พฤษภาคม 2024', houses: 47, users: 245, revenue: 1320000, views: 14700 },
        { period: 'มิถุนายน 2024', houses: 55, users: 312, revenue: 1590000, views: 17800 },
      ]);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const currentMonth = reportData[reportData.length - 1];
  const previousMonth = reportData[reportData.length - 2];

  const growthData = currentMonth && previousMonth ? {
    houses: calculateGrowth(currentMonth.houses, previousMonth.houses),
    users: calculateGrowth(currentMonth.users, previousMonth.users),
    revenue: calculateGrowth(currentMonth.revenue, previousMonth.revenue),
    views: calculateGrowth(currentMonth.views, previousMonth.views),
  } : null;

  const GrowthIndicator = ({ value }: { value: number }) => {
    const isPositive = value > 0;
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{value.toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">รายงาน</h1>
              <p className="mt-2 text-gray-600">
                รายงานสถิติและข้อมูลการใช้งานระบบ
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">รายวัน</option>
                <option value="weekly">รายสัปดาห์</option>
                <option value="monthly">รายเดือน</option>
                <option value="yearly">รายปี</option>
              </select>
              <Button className="flex items-center space-x-2">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>ส่งออกรายงาน</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                บ้านใหม่เดือนนี้
              </CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  currentMonth?.houses.toLocaleString()
                )}
              </div>
              {!loading && growthData && (
                <GrowthIndicator value={growthData.houses} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                ผู้ใช้ใหม่เดือนนี้
              </CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  currentMonth?.users.toLocaleString()
                )}
              </div>
              {!loading && growthData && (
                <GrowthIndicator value={growthData.users} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                รายได้เดือนนี้
              </CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  `฿${currentMonth?.revenue.toLocaleString()}`
                )}
              </div>
              {!loading && growthData && (
                <GrowthIndicator value={growthData.revenue} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                การเข้าชมเดือนนี้
              </CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  currentMonth?.views.toLocaleString()
                )}
              </div>
              {!loading && growthData && (
                <GrowthIndicator value={growthData.views} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>จำนวนบ้านที่ลงขายรายเดือน</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="h-64 flex items-end justify-between space-x-2">
                  {reportData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-blue-500 rounded-t w-full"
                        style={{
                          height: `${(data.houses / Math.max(...reportData.map(d => d.houses))) * 200}px`,
                          minHeight: '20px'
                        }}
                      />
                      <div className="text-xs text-gray-600 mt-2 text-center">
                        {data.period.split(' ')[0]}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {data.houses}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>รายได้รายเดือน</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="h-64 flex items-end justify-between space-x-2">
                  {reportData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-green-500 rounded-t w-full"
                        style={{
                          height: `${(data.revenue / Math.max(...reportData.map(d => d.revenue))) * 200}px`,
                          minHeight: '20px'
                        }}
                      />
                      <div className="text-xs text-gray-600 mt-2 text-center">
                        {data.period.split(' ')[0]}
                      </div>
                      <div className="text-xs font-medium text-gray-900">
                        ฿{(data.revenue / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลรายละเอียด</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ช่วงเวลา</th>
                      <th className="text-right py-3 px-4">บ้านใหม่</th>
                      <th className="text-right py-3 px-4">ผู้ใช้ใหม่</th>
                      <th className="text-right py-3 px-4">รายได้</th>
                      <th className="text-right py-3 px-4">การเข้าชม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((data, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{data.period}</td>
                        <td className="py-3 px-4 text-right">{data.houses.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{data.users.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">฿{data.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{data.views.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}