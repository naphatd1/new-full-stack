"use client";

import React, { useState } from "react";
import { HouseSearchFilters, HouseType } from "@/types";
import { Button } from "../../components/ui/button"
import Input from "@/components/ui/Input";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { getHouseTypeLabel } from "@/lib/utils";

interface SearchFiltersProps {
  onSearch: (filters: HouseSearchFilters) => void;
  loading?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState<HouseSearchFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const houseTypes: HouseType[] = [
    "DETACHED_HOUSE",
    "TOWNHOUSE",
    "CONDO",
    "APARTMENT",
    "COMMERCIAL",
    "LAND",
  ];

  const provinces = [
    "กรุงเทพมหานคร",
    "นนทบุรี",
    "ปทุมธานี",
    "สมุทรปราการ",
    "เชียงใหม่",
    "ภูเก็ต",
    "ชลบุรี",
    "ระยอง",
  ];

  const handleInputChange = (field: keyof HouseSearchFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {/* City */}
        <Input
          placeholder="เมือง/อำเภอ"
          value={filters.city || ""}
          onChange={(e) => handleInputChange("city", e.target.value)}
        />

        {/* Province */}
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          value={filters.province || ""}
          onChange={(e) => handleInputChange("province", e.target.value)}
        >
          <option value="">เลือกจังหวัด</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>

        {/* House Type */}
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          value={filters.houseType || ""}
          onChange={(e) =>
            handleInputChange("houseType", e.target.value as HouseType)
          }
        >
          <option value="">ประเภทบ้าน</option>
          {houseTypes.map((type) => (
            <option key={type} value={type}>
              {getHouseTypeLabel(type)}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex space-x-2">
            <Input
              placeholder="ราคาต่ำสุด"
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handleInputChange("minPrice", parseInt(e.target.value))
              }
            />
            <Input
              placeholder="ราคาสูงสุด"
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handleInputChange("maxPrice", parseInt(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 pt-4 border-t border-border animate-slide-down">
          {/* Bedrooms */}
          <div className="flex space-x-2">
            <Input
              placeholder="ห้องนอนต่ำสุด"
              type="number"
              value={filters.minBedrooms || ""}
              onChange={(e) =>
                handleInputChange("minBedrooms", parseInt(e.target.value))
              }
            />
            <Input
              placeholder="ห้องนอนสูงสุด"
              type="number"
              value={filters.maxBedrooms || ""}
              onChange={(e) =>
                handleInputChange("maxBedrooms", parseInt(e.target.value))
              }
            />
          </div>

          {/* Bathrooms */}
          <div className="flex space-x-2">
            <Input
              placeholder="ห้องน้ำต่ำสุด"
              type="number"
              value={filters.minBathrooms || ""}
              onChange={(e) =>
                handleInputChange("minBathrooms", parseInt(e.target.value))
              }
            />
            <Input
              placeholder="ห้องน้ำสูงสุด"
              type="number"
              value={filters.maxBathrooms || ""}
              onChange={(e) =>
                handleInputChange("maxBathrooms", parseInt(e.target.value))
              }
            />
          </div>

          {/* Area */}
          <div className="flex space-x-2">
            <Input
              placeholder="พื้นที่ต่ำสุด (ตร.ม.)"
              type="number"
              value={filters.minArea || ""}
              onChange={(e) =>
                handleInputChange("minArea", parseInt(e.target.value))
              }
            />
            <Input
              placeholder="พื้นที่สูงสุด (ตร.ม.)"
              type="number"
              value={filters.maxArea || ""}
              onChange={(e) =>
                handleInputChange("maxArea", parseInt(e.target.value))
              }
            />
          </div>

          {/* Status */}
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            value={filters.status || ""}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            <option value="">สถานะทั้งหมด</option>
            <option value="AVAILABLE">พร้อมขาย</option>
            <option value="PENDING">รอการตัดสินใจ</option>
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors text-sm sm:text-base"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          <span>{showAdvanced ? "ซ่อน" : "แสดง"}ตัวกรองขั้นสูง</span>
        </button>

        <div className="flex space-x-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleReset} 
            disabled={loading}
            className="flex-1 sm:flex-none text-sm"
          >
            ล้างตัวกรอง
          </Button>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="btn-search flex items-center space-x-1 flex-1 sm:flex-none text-sm"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>{loading ? "กำลังค้นหา..." : "ค้นหา"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
