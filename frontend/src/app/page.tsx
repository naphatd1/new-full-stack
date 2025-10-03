"use client";

import React from "react";
import Link from "next/link";
import { HouseSearchFilters } from "@/types";
import { useFeaturedHouses } from "@/hooks/api/useHouses";
import HouseCard from "@/components/houses/HouseCard";
import SearchFilters from "@/components/houses/SearchFilters";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ApiErrorFallback, NetworkStatus } from "@/components/ui/api-error-fallback";
import { Button } from "../components/ui/button";
import {
  MagnifyingGlassIcon,
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const { data: featuredHouses = [], isLoading: loading, error, refetch } = useFeaturedHouses();

  const handleSearch = (filters: HouseSearchFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div>
      <NetworkStatus />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground gradient-section">
        <div className="absolute inset-0 bg-background/10 dark:bg-background/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in hero-text leading-tight">
              ค้นหาบ้านในฝันของคุณ
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-foreground/90 animate-slide-up hero-text max-w-4xl mx-auto leading-relaxed">
              แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ออนไลน์ที่ใหญ่ที่สุดในประเทศไทย
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center animate-slide-up max-w-md xs:max-w-none mx-auto">
              <Link href="/search">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>เริ่มค้นหาบ้าน</span>
                </Button>
              </Link>
              <Link href="/houses/create">
                <Button
                  size="lg"
                  className="btn-sell-house flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>ลงขายบ้าน</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              ค้นหาบ้านที่ใช่สำหรับคุณ
            </h2>
            <p className="text-muted-foreground animate-slide-up text-sm sm:text-base">
              ใช้ตัวกรองเพื่อค้นหาบ้านที่ตรงกับความต้องการของคุณ
            </p>
          </div>
          <div className="animate-slide-up">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Featured Houses */}
      <section className="py-10 sm:py-12 lg:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="animate-fade-in text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                บ้านแนะนำ
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">บ้านที่น่าสนใจและได้รับความนิยม</p>
            </div>
            <Link href="/search" className="animate-slide-left">
              <Button variant="outline" className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200">
                <span>ดูทั้งหมด</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="py-12">
              <ApiErrorFallback 
                error={error as Error}
                onRetry={() => refetch()}
                title="ไม่สามารถโหลดบ้านแนะนำได้"
                showRetry={true}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredHouses.map((house, index) => (
                <div
                  key={house.id}
                  className="animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <HouseCard house={house} />
                </div>
              ))}
            </div>
          )}

          {!loading && featuredHouses.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <HomeIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                ยังไม่มีบ้านแนะนำ
              </h3>
              <p className="text-muted-foreground mb-4">
                ขณะนี้ยังไม่มีประกาศขายบ้าน เป็นคนแรกที่ลงประกาศกันเลย!
              </p>
              <Link href="/houses/create">
                <Button className="btn-sell-house flex items-center space-x-2 shadow-md hover:shadow-lg">
                  <PlusIcon className="h-5 w-5" />
                  <span>ลงขายบ้านแรก</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              ทำไมต้องเลือก HouseMarket
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              เราให้บริการที่ครบครันและน่าเชื่อถือเพื่อให้คุณได้พบกับบ้านในฝันของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center animate-slide-up hover-lift" style={{ animationDelay: '0.1s' }}>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                <MagnifyingGlassIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                ค้นหาง่าย
              </h3>
              <p className="text-muted-foreground">
                ระบบค้นหาที่ทันสมัยและตัวกรองที่หลากหลาย
                ช่วยให้คุณหาบ้านที่ใช่ได้อย่างรวดเร็ว
              </p>
            </div>

            <div className="text-center animate-slide-up hover-lift" style={{ animationDelay: '0.2s' }}>
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-success/20 hover:scale-110">
                <ShieldCheckIcon className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                ปลอดภัยเชื่อถือได้
              </h3>
              <p className="text-muted-foreground">
                ข้อมูลทุกรายการผ่านการตรวจสอบ และระบบรักษาความปลอดภัยระดับสูง
              </p>
            </div>

            <div className="text-center animate-slide-up hover-lift" style={{ animationDelay: '0.3s' }}>
              <div className="bg-info/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-info/20 hover:scale-110">
                <UserGroupIcon className="h-8 w-8 text-info" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                ชุมชนใหญ่
              </h3>
              <p className="text-muted-foreground">
                เข้าร่วมกับผู้ซื้อและผู้ขายหลายพันคนที่ไว้วางใจในบริการของเรา
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-primary gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3 sm:mb-4 animate-fade-in">
            พร้อมที่จะเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-primary-foreground/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto animate-slide-up leading-relaxed">
            เข้าร่วมกับเราวันนี้และค้นพบโอกาสใหม่ๆ ในการซื้อขายอสังหาริมทรัพย์
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center animate-slide-up max-w-md xs:max-w-none mx-auto">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                สมัครสมาชิกฟรี
              </Button>
            </Link>
            <Link href="/search">
              <Button
                size="lg"
                className="btn-hero-outline transition-all duration-300 hover:scale-105 shadow-lg"
              >
                เริ่มค้นหาเลย
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
