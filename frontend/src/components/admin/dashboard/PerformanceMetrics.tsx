'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Building2,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetricsProps {
  loading?: boolean;
}

export default function PerformanceMetrics({ loading = false }: PerformanceMetricsProps) {
  const metrics = [
    {
      title: 'เป้าหมายยอดขายเดือนนี้',
      current: 28,
      target: 35,
      percentage: 80,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      unit: 'หลัง'
    },
    {
      title: 'อัตราการเติบโต',
      current: 15.3,
      target: 12,
      percentage: 127,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      unit: '%'
    },
    {
      title: 'ลูกค้าใหม่',
      current: 89,
      target: 100,
      percentage: 89,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      unit: 'คน'
    },
    {
      title: 'บ้านที่ขายได้',
      current: 156,
      target: 200,
      percentage: 78,
      icon: Building2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      unit: 'หลัง'
    }
  ];

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 100) {
      return <Badge variant="success" className="text-xs">เกินเป้า</Badge>;
    } else if (percentage >= 80) {
      return <Badge variant="warning" className="text-xs">ใกล้เป้า</Badge>;
    } else {
      return <Badge variant="secondary" className="text-xs">ต่ำกว่าเป้า</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          ตัวชี้วัดประสิทธิภาพ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
              </div>
            ))
          ) : (
            metrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor} dark:bg-opacity-20`}>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        {metric.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {metric.current}{metric.unit} / {metric.target}{metric.unit}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(metric.percentage)}
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={metric.percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="font-medium">
                      {metric.percentage}%
                    </span>
                    <span>{metric.target}{metric.unit}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}