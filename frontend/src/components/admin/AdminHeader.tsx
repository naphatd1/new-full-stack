'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/themeSlice';
import { useMounted } from '@/hooks/use-mounted';
import {
  Bell,
  Menu,
  Search,
  Settings,
  LogOut,
  Moon,
  Sun,
  MessageSquare,
} from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.theme);
  const { user, logout } = useAuth();
  const mounted = useMounted();

  const toggleTheme = () => {
    dispatch(setTheme(isDark ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-header/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-30">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent flex-shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden sm:block lg:block min-w-0">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden lg:block">ยินดีต้อนรับสู่ระบบจัดการ</p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:flex flex-1 max-w-sm xl:max-w-md mx-4 xl:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background/50 text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent rounded-lg h-8 w-8 sm:h-10 sm:w-10"
          >
            {mounted ? (
              isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Messages - Hidden on mobile */}
          <Button variant="ghost" size="icon" className="relative hover:bg-accent rounded-lg h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex">
            <MessageSquare className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600">
              12
            </Badge>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-accent rounded-lg h-8 w-8 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
              3
            </Badge>
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-border">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-medium">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="hidden xl:flex items-center space-x-1 ml-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent text-red-600"
                onClick={handleLogout}
                title="ออกจากระบบ"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}