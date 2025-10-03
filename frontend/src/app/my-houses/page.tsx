"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMyHouses, useDeleteHouse } from "@/hooks/api/useHouses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  HomeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";

export default function MyHousesPage() {
  const { isAuthenticated } = useAuth();
  const { data: houses = [], isLoading: loading } = useMyHouses();
  const deleteHouseMutation = useDeleteHouse();

  React.useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
  }, [isAuthenticated]);

  const handleDelete = async (houseId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบประกาศนี้?")) {
      return;
    }

    deleteHouseMutation.mutate(houseId);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">บ้านของฉัน</h1>
            <p className="text-gray-600 mt-2">
              จัดการประกาศขายบ้านของคุณ ({houses.length} รายการ)
            </p>
          </div>
          <Link href="/houses/create">
            <Button className="btn-sell-house flex items-center space-x-2 shadow-md hover:shadow-lg">
              <PlusIcon className="h-5 w-5" />
              <span>ลงขายบ้านใหม่</span>
            </Button>
          </Link>
        </div>

        {houses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ยังไม่มีประกาศขายบ้าน
              </h3>
              <p className="text-gray-600 mb-6">
                เริ่มต้นลงประกาศขายบ้านของคุณเพื่อเข้าถึงผู้ซื้อที่มีศักยภาพ
              </p>
              <Link href="/houses/create">
                <Button className="btn-sell-house flex items-center space-x-2 shadow-md hover:shadow-lg">
                  <PlusIcon className="h-5 w-5" />
                  <span>ลงขายบ้านแรก</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {houses.length}
                  </div>
                  <div className="text-sm text-gray-600">ประกาศทั้งหมด</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {houses.filter((h) => h.status === "AVAILABLE").length}
                  </div>
                  <div className="text-sm text-gray-600">พร้อมขาย</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {houses.filter((h) => h.status === "PENDING").length}
                  </div>
                  <div className="text-sm text-gray-600">รอการตัดสินใจ</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {houses.filter((h) => h.status === "SOLD").length}
                  </div>
                  <div className="text-sm text-gray-600">ขายแล้ว</div>
                </CardContent>
              </Card>
            </div>

            {/* Houses List */}
            <div className="space-y-4">
              {houses.map((house) => (
                <Card key={house.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {house.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              house.status
                            )}`}
                          >
                            {getStatusLabel(house.status)}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                          {formatPrice(house.price)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {house.address}, {house.city}, {house.province}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{house.bedrooms} ห้องนอน</span>
                          <span>{house.bathrooms} ห้องน้ำ</span>
                          <span>{house.area} ตร.ม.</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link href={`/houses/${house.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span>ดู</span>
                          </Button>
                        </Link>
                        <Link href={`/houses/${house.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span>แก้ไข</span>
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(house.id)}
                          disabled={deleteHouseMutation.isPending}
                          className="flex items-center space-x-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>
                            {deleteHouseMutation.isPending ? "กำลังลบ..." : "ลบ"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
