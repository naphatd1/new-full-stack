'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { House } from '@/types';
import { housesApi } from '@/lib/api';
import { getHouseTypeLabel, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function HousesManagement() {
  const router = useRouter();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchHouses = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // For admin, we want to get all houses including owner information
      const response = await housesApi.getHouses();
      
      if (response.success && response.data) {
        setHouses(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch houses:', error);
      toast.error('ไม่สามารถโหลดข้อมูลบ้านได้');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleRefresh = () => {
    fetchHouses(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      AVAILABLE: { label: 'เปิดขาย', variant: 'default' as const },
      PENDING: { label: 'รอตรวจสอบ', variant: 'secondary' as const },
      SOLD: { label: 'ขายแล้ว', variant: 'destructive' as const },
      INACTIVE: { label: 'ปิดขาย', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.AVAILABLE;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleView = (houseId: string) => {
    router.push(`/houses/${houseId}`);
  };

  const handleEdit = (houseId: string) => {
    router.push(`/admin/houses/${houseId}/edit`);
  };

  const handleDelete = async (houseId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบบ้านนี้?')) {
      return;
    }

    try {
      setDeleting(houseId);
      await housesApi.deleteHouse(houseId);
      toast.success('ลบบ้านสำเร็จ');
      // Refresh the list
      fetchHouses(true);
    } catch (error) {
      console.error('Failed to delete house:', error);
      toast.error('ไม่สามารถลบบ้านได้');
    } finally {
      setDeleting(null);
    }
  };

  const filteredHouses = houses.filter(house =>
    house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (house.owner?.firstName + ' ' + house.owner?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">จัดการบ้าน</h1>
              <p className="mt-2 text-gray-600">
                จัดการประกาศขายบ้านทั้งหมดในระบบ
              </p>
            </div>
            <Button className="flex items-center space-x-2" asChild>
              <Link href="/admin/houses/create">
                <PlusIcon className="h-5 w-5" />
                <span>เพิ่มบ้านใหม่</span>
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>รายการบ้านทั้งหมด</CardTitle>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'รีเฟรช...' : 'รีเฟรช'}</span>
                </Button>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาบ้าน..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อบ้าน</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead>ที่อยู่</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>เจ้าของ</TableHead>
                    <TableHead>การเข้าชม</TableHead>
                    <TableHead>วันที่สร้าง</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHouses.map((house) => (
                    <TableRow key={house.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs truncate">
                          {house.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(house.price)}
                      </TableCell>
                      <TableCell>
                        {house.city}, {house.province}
                      </TableCell>
                      <TableCell>{getHouseTypeLabel(house.houseType)}</TableCell>
                      <TableCell>{getStatusBadge(house.status)}</TableCell>
                      <TableCell>
                        {house.owner ? `${house.owner.firstName} ${house.owner.lastName}` : 'ไม่ระบุ'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                          <span>{house.viewCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(house.createdAt).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleView(house.id)}
                            title="ดูรายละเอียด"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(house.id)}
                            title="แก้ไข"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(house.id)}
                            disabled={deleting === house.id}
                            title="ลบ"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && filteredHouses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm ? 'ไม่พบบ้านที่ค้นหา' : 'ยังไม่มีบ้านในระบบ'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}