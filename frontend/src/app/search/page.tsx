'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { House, HouseSearchFilters } from '@/types';
import { housesApi } from '@/lib/api';
import HouseCard from '@/components/houses/HouseCard';
import SearchFilters from '@/components/houses/SearchFilters';
import { Button } from "../../components/ui/button";
import { HomeIcon, AdjustmentsHorizontalIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function SearchContent() {
  const searchParams = useSearchParams();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<HouseSearchFilters>({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);

  const ITEMS_PER_PAGE = 12;

  const fetchHouses = useCallback(async (searchFilters: HouseSearchFilters, page = 1, forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) {
      setRefreshing(true);
    }
    
    try {
      // Add timestamp to bypass cache when refreshing
      const queryParams = {
        ...searchFilters,
        page,
        limit: ITEMS_PER_PAGE,
        sortBy,
        sortOrder,
        ...(forceRefresh && { _t: Date.now() })
      };
      
      const response = await housesApi.getHouses(queryParams);

      if (response.success && response.data) {
        setHouses(response.data.data);
        setPagination(response.data.pagination);
      } else {
        // Reset to empty state if no data
        setHouses([]);
        setPagination({
          page: 1,
          limit: ITEMS_PER_PAGE,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch houses:', error);
      // Reset to empty state on error
      setHouses([]);
      setPagination({
        page: 1,
        limit: ITEMS_PER_PAGE,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    // Parse URL parameters
    const urlFilters: HouseSearchFilters = {};
    searchParams.forEach((value, key) => {
      if (value) {
        if (key.includes('Price') || key.includes('Bedrooms') || key.includes('Bathrooms') || key.includes('Area')) {
          (urlFilters as Record<string, string | number>)[key] = parseInt(value);
        } else {
          (urlFilters as Record<string, string | number>)[key] = value;
        }
      }
    });
    setFilters(urlFilters);
    
    // Fetch houses with the parsed filters
    const loadHouses = async () => {
      setLoading(true);
      try {
        const response = await housesApi.getHouses({
          ...urlFilters,
          page: 1,
          limit: ITEMS_PER_PAGE,
          sortBy,
          sortOrder,
        });

        if (response.success && response.data) {
          setHouses(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setHouses([]);
          setPagination({
            page: 1,
            limit: ITEMS_PER_PAGE,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch houses:', error);
        setHouses([]);
        setPagination({
          page: 1,
          limit: ITEMS_PER_PAGE,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadHouses();
  }, [searchParams, sortBy, sortOrder]);

  const handleSearch = (newFilters: HouseSearchFilters) => {
    setFilters(newFilters);
    fetchHouses(newFilters, 1);
  };

  const handlePageChange = (page: number) => {
    fetchHouses(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    fetchHouses(filters, 1);
  };

  const handleRefresh = () => {
    fetchHouses(filters, pagination?.page || 1, true);
  };

  const sortOptions = [
    { value: 'createdAt-desc', label: 'ใหม่ล่าสุด' },
    { value: 'createdAt-asc', label: 'เก่าที่สุด' },
    { value: 'price-asc', label: 'ราคาต่ำสุด' },
    { value: 'price-desc', label: 'ราคาสูงสุด' },
    { value: 'area-desc', label: 'พื้นที่ใหญ่สุด' },
    { value: 'area-asc', label: 'พื้นที่เล็กสุด' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">ค้นหาบ้าน</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                พบ {(pagination?.total || 0).toLocaleString()} รายการ
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
            >
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'กำลังรีเฟรช...' : 'รีเฟรช'}</span>
            </Button>
          </div>
        </div>

        {/* Search Filters */}
        <div className="mb-6 sm:mb-8 animate-slide-up">
          <SearchFilters onSearch={handleSearch} loading={loading} />
        </div>

        {/* Sort and Results */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar - Filters Summary */}
          <div className="lg:w-1/4">
            <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 sticky top-4 animate-slide-right">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-primary" />
                ตัวกรองที่ใช้
              </h3>
              
              {Object.keys(filters).length === 0 ? (
                <p className="text-muted-foreground text-sm">ไม่มีตัวกรอง</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-medium text-card-foreground">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 animate-slide-left gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground whitespace-nowrap">เรียงตาม:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    handleSortChange(newSortBy, newSortOrder as 'asc' | 'desc');
                  }}
                  className="text-sm border border-input bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-colors flex-1 sm:flex-none min-w-0"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-card rounded-lg shadow-sm border border-border overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="h-40 sm:h-48 bg-muted animate-pulse"></div>
                    <div className="p-3 sm:p-4">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : houses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {houses.map((house, index) => (
                    <div
                      key={house.id}
                      className="animate-scale-in hover-lift"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <HouseCard house={house} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {(pagination?.totalPages || 0) > 1 && (
                  <div className="flex items-center justify-center space-x-2 animate-fade-in">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                      disabled={!pagination?.hasPrev}
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      ก่อนหน้า
                    </Button>
                    
                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, pagination?.totalPages || 0))].map((_, i) => {
                        const page = i + 1;
                        const isActive = page === (pagination?.page || 1);
                        return (
                          <Button
                            key={page}
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                      disabled={!pagination?.hasNext}
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      ถัดไป
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <HomeIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">ไม่พบบ้านที่ตรงกับเงื่อนไข</h3>
                <p className="text-muted-foreground mb-4">ลองปรับเปลี่ยนตัวกรองการค้นหา</p>
                <Button 
                  onClick={() => handleSearch({})}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  ล้างตัวกรองทั้งหมด
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">กำลังโหลด...</p>
      </div>
    </div>}>
      <SearchContent />
    </Suspense>
  );
}