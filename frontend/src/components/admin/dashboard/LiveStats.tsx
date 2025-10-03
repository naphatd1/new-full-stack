'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Users, 
  Eye, 
  MessageSquare,
  Wifi,
  WifiOff
} from 'lucide-react';

interface LiveStatsProps {
  loading?: boolean;
}

export default function LiveStats({ loading = false }: LiveStatsProps) {
  const [isOnline] = useState(true);
  const [liveData, setLiveData] = useState({
    activeUsers: 23,
    currentViews: 156,
    newMessages: 5,
    serverLoad: 45
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        currentViews: prev.currentViews + Math.floor(Math.random() * 10) - 5,
        newMessages: prev.newMessages + Math.floor(Math.random() * 2),
        serverLoad: Math.max(20, Math.min(80, prev.serverLoad + Math.floor(Math.random() * 10) - 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'ผู้ใช้ออนไลน์',
      value: liveData.activeUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      pulse: true
    },
    {
      title: 'กำลังดูขณะนี้',
      value: liveData.currentViews,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      pulse: true
    },
    {
      title: 'ข้อความใหม่',
      value: liveData.newMessages,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      pulse: liveData.newMessages > 0
    },
    {
      title: 'โหลดเซิร์ฟเวอร์',
      value: `${liveData.serverLoad}%`,
      icon: Activity,
      color: liveData.serverLoad > 70 ? 'text-red-600' : 'text-green-600',
      bgColor: liveData.serverLoad > 70 ? 'bg-red-100' : 'bg-green-100',
      pulse: liveData.serverLoad > 70
    }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            สถิติแบบเรียลไทม์
          </CardTitle>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <Badge variant={isOnline ? "success" : "destructive"} className="text-xs">
              <div className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {isOnline ? 'เชื่อมต่อแล้ว' : 'ขาดการเชื่อมต่อ'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg transition-all duration-200 bg-accent/50 border border-border/50 ${stat.pulse ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.title}
                </p>
              </div>
            ))
          )}
        </div>
        
        {!loading && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>อัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH')}</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                อัพเดทอัตโนมัติ
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}