'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Bell,
  Download
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  href: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'secondary';
  };
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: '1',
      title: 'เพิ่มบ้านใหม่',
      description: 'ลงประกาศขายบ้าน',
      icon: <Plus className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 hover:bg-blue-200',
      href: '/admin/houses/create',
    },
    {
      id: '2',
      title: 'จัดการผู้ใช้',
      description: 'ดูและแก้ไขข้อมูลผู้ใช้',
      icon: <Users className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 hover:bg-green-200',
      href: '/admin/users',
      badge: { text: '5 ใหม่', variant: 'success' }
    },
    {
      id: '3',
      title: 'รายงาน',
      description: 'ดูรายงานและสถิติ',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 hover:bg-purple-200',
      href: '/admin/reports',
    },
    {
      id: '4',
      title: 'ข้อความ',
      description: 'ตอบกลับข้อความลูกค้า',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 hover:bg-orange-200',
      href: '/admin/messages',
      badge: { text: '12', variant: 'warning' }
    },
    {
      id: '5',
      title: 'การแจ้งเตือน',
      description: 'จัดการการแจ้งเตือน',
      icon: <Bell className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100 hover:bg-red-200',
      href: '/admin/notifications',
      badge: { text: '3', variant: 'info' }
    },
    {
      id: '6',
      title: 'ส่งออกข้อมูล',
      description: 'ดาวน์โหลดรายงาน',
      icon: <Download className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      href: '/admin/export',
    },
    {
      id: '7',
      title: 'เอกสาร',
      description: 'จัดการเอกสารและสัญญา',
      icon: <FileText className="h-5 w-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 hover:bg-indigo-200',
      href: '/admin/documents',
    },
    {
      id: '8',
      title: 'ตั้งค่า',
      description: 'ตั้งค่าระบบ',
      icon: <Settings className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      href: '/admin/settings',
    },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>การดำเนินการด่วน</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent group border border-border/50`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
              {action.badge && (
                <Badge 
                  variant={action.badge.variant} 
                  className="absolute -top-1 -right-1 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {action.badge.text}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}