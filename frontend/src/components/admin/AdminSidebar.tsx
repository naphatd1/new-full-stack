'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  AlertTriangle,
  Home,
  MessageSquare,
  Bell,
  TrendingUp,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'แดชบอร์ด',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'จัดการบ้าน',
    href: '/admin/houses',
    icon: Building2,
  },
  {
    title: 'จัดการผู้ใช้',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'ข้อความ',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    title: 'การแจ้งเตือน',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    title: 'รายงาน',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'รายงานปัญหา',
    href: '/admin/issues',
    icon: AlertTriangle,
  },
  {
    title: 'ตั้งค่า',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-border">
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-border bg-card/50">
        <Link href="/admin" className="flex items-center space-x-3 group">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-105 transition-transform">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">Admin Panel</span>
            <p className="text-xs text-muted-foreground">House Marketplace</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-muted-foreground group-hover:text-accent-foreground'
                  )}
                />
                {item.title}
              </div>

              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl" />
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-border p-4 bg-card/30">
        <Link
          href="/"
          className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          <span className="text-sm">กลับสู่เว็บไซต์</span>
        </Link>
      </div>
    </div>
  );
}