'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  EnvelopeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'หน้าแรก', href: '/', icon: HomeIcon },
    { name: 'ค้นหาบ้าน', href: '/search', icon: MagnifyingGlassIcon },
    { name: 'ติดต่อเรา', href: '/contact', icon: EnvelopeIcon },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      sticky top-0 z-50 transition-all duration-300 ease-in-out
      ${isScrolled 
        ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-border/50' 
        : 'bg-background/60 backdrop-blur-md shadow-sm border-b border-border/30'
      }
    `}>
      {/* Gradient overlay for extra style */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo with enhanced styling */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-2 lg:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <HomeIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-xl lg:text-2xl font-extrabold group-hover:scale-105 transition-transform duration-300 logo-enhanced-glow">
                  <span className="logo-house mr-1">House</span>
                  <span className="logo-market">Market</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium -mt-1 hidden sm:block">
                  ตลาดอสังหาริมทรัพย์
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation with enhanced styling */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                    ${isActive 
                      ? 'text-primary bg-primary/10 shadow-md' 
                      : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-sm lg:text-base">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Section with enhanced styling */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            
            {isAuthenticated && (
              <Link href="/houses/create">
                <Button 
                  size="sm" 
                  className="
                    relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white
                    hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl
                    transition-all duration-300 hover:scale-105 group
                  "
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <PlusIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium">ลงขายบ้าน</span>
                  <SparklesIcon className="h-3 w-3 ml-1 opacity-75" />
                </Button>
              </Link>
            )}
            
            <LoginButton />
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`
                relative p-2.5 rounded-xl transition-all duration-300
                ${isMobileMenuOpen 
                  ? 'bg-primary/10 text-primary shadow-md' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                }
              `}
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Bars3Icon className="h-6 w-6 transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute left-4 right-4 top-full mt-2 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-slide-down">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
              
              <div className="relative p-4 space-y-2">
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-border/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    <span className="text-sm font-semibold text-foreground">เมนูหลัก</span>
                  </div>
                  <ThemeToggle />
                </div>
                
                {/* Navigation Items */}
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-md' 
                          : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={`
                        p-2 rounded-lg transition-all duration-300 group-hover:scale-110
                        ${isActive ? 'bg-primary/20' : 'bg-accent/30'}
                      `}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </Link>
                  );
                })}
                
                {/* Sell House Button for Mobile */}
                {isAuthenticated && (
                  <Link
                    href="/houses/create"
                    className="group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <PlusIcon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">ลงขายบ้าน</span>
                    <SparklesIcon className="h-4 w-4 ml-auto opacity-75" />
                  </Link>
                )}
                
                {/* Login Section */}
                <div className="pt-3 border-t border-border/30">
                  <MobileLoginButton onClose={() => setIsMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;