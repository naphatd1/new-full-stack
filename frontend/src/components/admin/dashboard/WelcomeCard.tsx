'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Building2,
  ArrowRight
} from 'lucide-react';

interface WelcomeCardProps {
  loading?: boolean;
}

export default function WelcomeCard({ loading = false }: WelcomeCardProps) {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'สวัสดีตอนเช้า';
    if (currentHour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  const quickStats = [
    { label: 'ยอดขายวันนี้', value: '12 หลัง', icon: Building2, color: 'text-blue-600' },
    { label: 'ลูกค้าใหม่', value: '+8 คน', icon: Users, color: 'text-green-600' },
    { label: 'เติบโต', value: '+15.3%', icon: TrendingUp, color: 'text-purple-600' }
  ];

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-200/30 to-blue-200/30 dark:from-green-500/20 dark:to-blue-500/20 rounded-full translate-y-12 -translate-x-12" />
      
      <CardContent className="p-6 relative">
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  {getGreeting()}!
                </h2>
                <p className="text-muted-foreground mt-1">
                  ยินดีต้อนรับสู่ระบบจัดการ House Marketplace
                </p>
              </div>
              <Badge variant="success" className="hidden sm:flex">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                ระบบพร้อมใช้งาน
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-lg font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                อัพเดทล่าสุด: {new Date().toLocaleString('th-TH')}
              </p>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium group">
                ดูรายละเอียด
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}