'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Eye, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'house' | 'user' | 'view' | 'sale';
  title: string;
  subtitle: string;
  time: string;
  avatar?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'secondary';
  };
}

interface RecentActivityProps {
  loading?: boolean;
}

export default function RecentActivity({ loading = false }: RecentActivityProps) {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'house',
      title: 'บ้านเดี่ยว 2 ชั้น หมู่บ้านสวนผึ้ง',
      subtitle: 'ราชบุรี • ฿4,500,000',
      time: '2 นาทีที่แล้ว',
      badge: { text: 'ใหม่', variant: 'success' }
    },
    {
      id: '2',
      type: 'user',
      title: 'สมชาย ใจดี',
      subtitle: 'สมัครสมาชิกใหม่',
      time: '15 นาทีที่แล้ว',
      badge: { text: 'สมาชิกใหม่', variant: 'info' }
    },
    {
      id: '3',
      type: 'sale',
      title: 'คอนโด The Base พาร์ค เวสต์',
      subtitle: 'ขายสำเร็จ • ฿2,800,000',
      time: '1 ชั่วโมงที่แล้ว',
      badge: { text: 'ขายแล้ว', variant: 'success' }
    },
    {
      id: '4',
      type: 'view',
      title: 'ทาวน์เฮ้าส์ 3 ชั้น ใกล้ BTS',
      subtitle: 'มีผู้เข้าชม 25 ครั้ง',
      time: '2 ชั่วโมงที่แล้ว',
      badge: { text: 'ยอดนิยม', variant: 'warning' }
    },
    {
      id: '5',
      type: 'user',
      title: 'สุดา รักดี',
      subtitle: 'อัพเดทโปรไฟล์',
      time: '3 ชั่วโมงที่แล้ว'
    }
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'house':
        return <Building2 className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'sale':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'house':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'user':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'view':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'sale':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          กิจกรรมล่าสุด
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 group hover:bg-accent p-2 rounded-lg transition-colors">
                {activity.type === 'user' ? (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {activity.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    {activity.badge && (
                      <Badge variant={activity.badge.variant} className="text-xs">
                        {activity.badge.text}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}