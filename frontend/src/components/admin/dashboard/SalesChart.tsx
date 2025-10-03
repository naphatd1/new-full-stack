'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface SalesChartProps {
  loading?: boolean;
}

export default function SalesChart({ loading = false }: SalesChartProps) {
  const salesData = [
    { month: 'ม.ค.', sales: 12, revenue: 45000000 },
    { month: 'ก.พ.', sales: 19, revenue: 67000000 },
    { month: 'มี.ค.', sales: 15, revenue: 52000000 },
    { month: 'เม.ย.', sales: 25, revenue: 89000000 },
    { month: 'พ.ค.', sales: 22, revenue: 78000000 },
    { month: 'มิ.ย.', sales: 30, revenue: 105000000 },
    { month: 'ก.ค.', sales: 28, revenue: 98000000 },
    { month: 'ส.ค.', sales: 35, revenue: 125000000 },
    { month: 'ก.ย.', sales: 32, revenue: 115000000 },
  ];

  const formatRevenue = (value: number) => {
    return `฿${(value / 1000000).toFixed(0)}M`;
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      dataKey: string;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{`เดือน: ${label}`}</p>
          <p className="text-blue-600">
            {`ยอดขาย: ${payload[0].value} หลัง`}
          </p>
          <p className="text-green-600">
            {`รายได้: ${formatRevenue(payload[1]?.value || 0)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ยอดขายรายเดือน</CardTitle>
          <div className="flex gap-2">
            <Badge variant="info" className="text-xs">
              ปี 2567
            </Badge>
            <Badge variant="success" className="text-xs">
              +15.3%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 bg-gray-200 rounded animate-pulse" />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="sales"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  className="fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  className="fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatRevenue}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="sales"
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}