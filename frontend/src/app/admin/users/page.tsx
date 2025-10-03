'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import UserEditModal from '@/components/admin/UserEditModal';
import UserViewModal from '@/components/admin/UserViewModal';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { usersApi } from '@/lib/api';
import { User } from '@/types';
import { toast } from 'react-hot-toast';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await usersApi.getAllUsers({
        page,
        limit: 10,
        search: search || undefined,
      });

      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: 'ผู้ดูแลระบบ', variant: 'destructive' as const },
      MODERATOR: { label: 'ผู้ดูแล', variant: 'default' as const },
      AGENT: { label: 'นายหน้า', variant: 'default' as const },
      USER: { label: 'ผู้ใช้ทั่วไป', variant: 'secondary' as const },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'ใช้งานได้' : 'ไม่ได้ใช้งาน'}
      </Badge>
    );
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    setActionLoading(user.id);
    try {
      const response = await usersApi.toggleUserStatus(user.id);
      if (response.success && response.data) {
        toast.success(`${response.data.isActive ? 'เปิดใช้งาน' : 'ระงับ'}บัญชีผู้ใช้สำเร็จ`);
        fetchUsers(currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('ไม่สามารถเปลี่ยนสถานะผู้ใช้ได้');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setActionLoading(userToDelete.id);
    try {
      const response = await usersApi.deleteUser(userToDelete.id);
      if (response.success) {
        toast.success('ลบผู้ใช้สำเร็จ');
        fetchUsers(currentPage, searchTerm);
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('ไม่สามารถลบผู้ใช้ได้');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveUser = async (userId: string, data: { firstName?: string; lastName?: string; role?: string }) => {
    try {
      const response = await usersApi.updateUser(userId, data);
      if (response.success && response.data) {
        toast.success('อัปเดตข้อมูลผู้ใช้สำเร็จ');
        fetchUsers(currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้');
      throw error;
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h1>
              <p className="mt-2 text-gray-600">
                จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงระบบ
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>เพิ่มผู้ใช้ใหม่</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                ผู้ใช้ทั้งหมด
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {totalUsers.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                ผู้ใช้ที่ใช้งานอยู่
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                นายหน้า
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'AGENT').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>รายการผู้ใช้ทั้งหมด</CardTitle>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาผู้ใช้..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                    <TableHead>ผู้ใช้</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>บทบาท</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จำนวนบ้าน</TableHead>
                    <TableHead>วันที่สมัคร</TableHead>
                    <TableHead>เข้าสู่ระบบล่าสุด</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <Image
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <UserCircleIcon className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.username
                              }
                            </div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(user.isActive)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                            disabled={actionLoading === user.id}
                            className={`text-xs px-2 py-1 h-6 transition-all duration-200 ${
                              user.isActive 
                                ? 'text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300' 
                                : 'text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300'
                            }`}
                          >
                            {actionLoading === user.id ? '...' : (user.isActive ? 'ระงับ' : 'เปิดใช้')}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell>
                        {new Date(user.updatedAt).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewUser(user)}
                            title="ดูรายละเอียด"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            title="แก้ไข"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-all duration-200"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user)}
                            disabled={actionLoading === user.id}
                            title="ลบ"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 disabled:opacity-50"
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

            {!loading && users.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ยังไม่มีผู้ใช้ในระบบ'}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  แสดง {users.length} จาก {totalUsers} รายการ
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    ก่อนหน้า
                  </Button>
                  <span className="text-sm">
                    หน้า {currentPage} จาก {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <UserViewModal
        user={selectedUser}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <span>ยืนยันการลบผู้ใช้</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ <strong>{userToDelete?.username}</strong>?
              <br />
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading === userToDelete?.id}
            >
              {actionLoading === userToDelete?.id ? 'กำลังลบ...' : 'ลบ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}