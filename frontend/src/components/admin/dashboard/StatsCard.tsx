'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor,
  iconBgColor,
  loading = false,
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'success';
      case 'decrease':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 hover-lift animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconBgColor} transition-transform duration-200 hover:scale-110`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {loading ? (
            <div className="h-8 skeleton" />
          ) : (
            <div className="text-2xl font-bold animate-slide-in-up">{value}</div>
          )}
          {change && !loading && (
            <Badge variant={getChangeColor()} className="text-xs animate-slide-in-right">
              <span className="mr-1">{getChangeIcon()}</span>
              {change}
            </Badge>
          )}
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80" />
    </Card>
  );
}