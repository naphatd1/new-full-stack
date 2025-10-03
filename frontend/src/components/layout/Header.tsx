'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LoginButton } from '@/components/auth/LoginButton';
import { MobileLoginButton } from '@/components/auth/MobileLoginButton';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  PlusIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'หน้าแรก', href: '/', icon: HomeIcon },
    { name: 'ค้นหาบ้าน', href: '/search', icon: MagnifyingGlassIcon },
    { name: 'ติดต่อเรา', href: '/contact', icon: EnvelopeIcon },
  ];

  return (
    <header className="bg-header shadow-sm border-b border-border backdrop-blur-md bg-opacity-95 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
              <HomeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">HouseMarket</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link flex items-center space-x-1 text-muted-foreground px-2 xl:px-3 py-2 text-sm xl:text-base font-medium"
              >
                <item.icon className="h-4 w-4 xl:h-5 xl:w-5" />
                <span className="hidden xl:inline">{item.name}</span>
                <span className="xl:hidden">{item.name.split(' ')[0]}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <ThemeToggle />
            {isAuthenticated && (
              <Link href="/houses/create">
                <Button 
                  size="sm" 
                  className="btn-sell-house flex items-center space-x-1 text-xs xl:text-sm shadow-md hover:shadow-lg"
                >
                  <PlusIcon className="h-3 w-3 xl:h-4 xl:w-4" />
                  <span className="hidden xl:inline">ลงขายบ้าน</span>
                  <span className="xl:hidden">ลงขาย</span>
                </Button>
              </Link>
            )}
            <LoginButton />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-accent transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-3 sm:py-4 animate-slide-in-up bg-card/95 backdrop-blur-md">
            <div className="flex flex-col space-y-3 sm:space-y-4 px-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">เมนู</span>
                <ThemeToggle />
              </div>
              
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 px-3 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-base">{item.name}</span>
                </Link>
              ))}
              
              {isAuthenticated && (
                <Link
                  href="/houses/create"
                  className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 px-3 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PlusIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-base">ลงขายบ้าน</span>
                </Link>
              )}
              
              <div className="pt-2 border-t border-border">
                <MobileLoginButton onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;