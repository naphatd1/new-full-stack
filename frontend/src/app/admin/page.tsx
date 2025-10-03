'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import SalesChart from '@/components/admin/dashboard/SalesChart';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import PerformanceMetrics from '@/components/admin/dashboard/PerformanceMetrics';
import LiveStats from '@/components/admin/dashboard/LiveStats';
import WelcomeCard from '@/components/admin/dashboard/WelcomeCard';
import {
  Building2,
  Users,
  Eye,
  DollarSign,
} from 'lucide-react';

interface DashboardStats {
  totalHouses: number;
  totalUsers: number;
  totalViews: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHouses: 0,
    totalUsers: 0,
    totalViews: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalHouses: 156,
        totalUsers: 1234,
        totalViews: 45678,
        totalRevenue: 2500000,
      });
      setLoading(false);
    }, 1500);
  }, []);

  const statCards = [
    {
      title: 'จำนวนบ้านทั้งหมด',
      value: stats.totalHouses.toLocaleString(),
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: Building2,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'จำนวนผู้ใช้',
      value: stats.totalUsers.toLocaleString(),
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'จำนวนการเข้าชม',
      value: stats.totalViews.toLocaleString(),
      change: '+23.1%',
      changeType: 'increase' as const,
      icon: Eye,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
    {
      title: 'รายได้รวม',
      value: `฿${stats.totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: DollarSign,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
  ];



  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <WelcomeCard loading={loading} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((card, index) => (
              <StatsCard
                key={index}
                title={card.title}
                value={card.value}
                change={card.change}
                changeType={card.changeType}
                icon={card.icon}
                iconColor={card.iconColor}
                iconBgColor={card.iconBgColor}
                loading={loading}
              />
            ))}
          </div>

          {/* Charts and Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <SalesChart loading={loading} />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <LiveStats loading={loading} />
            </div>
          </div>

          {/* Performance and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity loading={loading} />
            </div>
            <div>
              <PerformanceMetrics loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}