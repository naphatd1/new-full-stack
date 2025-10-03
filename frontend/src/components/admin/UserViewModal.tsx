'use client';

import React from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface UserViewModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserViewModal({
  user,
  isOpen,
  onClose,
}: UserViewModalProps) {
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

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>รายละเอียดผู้ใช้</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-10 w-10 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username
                }
              </h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.isActive)}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">ข้อมูลพื้นฐาน</h4>
              
              <div>
                <Label className="text-sm text-gray-600">ชื่อผู้ใช้</Label>
                <p className="font-medium">{user.username}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">อีเมล</Label>
                <p className="font-medium">{user.email}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">ชื่อ-นามสกุล</Label>
                <p className="font-medium">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : 'ไม่ได้ระบุ'
                  }
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">บทบาท</Label>
                <div className="mt-1">
                  {getRoleBadge(user.role)}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">สถานะ</Label>
                <div className="mt-1">
                  {getStatusBadge(user.isActive)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">ข้อมูลเพิ่มเติม</h4>
              
              {user.profile && (
                <>
                  {user.profile.phone && (
                    <div>
                      <Label className="text-sm text-gray-600">เบอร์โทรศัพท์</Label>
                      <p className="font-medium">{user.profile.phone}</p>
                    </div>
                  )}

                  {user.profile.bio && (
                    <div>
                      <Label className="text-sm text-gray-600">เกี่ยวกับ</Label>
                      <p className="font-medium">{user.profile.bio}</p>
                    </div>
                  )}

                  {user.profile.address && (
                    <div>
                      <Label className="text-sm text-gray-600">ที่อยู่</Label>
                      <p className="font-medium">{user.profile.address}</p>
                    </div>
                  )}

                  {user.profile.city && (
                    <div>
                      <Label className="text-sm text-gray-600">เมือง</Label>
                      <p className="font-medium">{user.profile.city}</p>
                    </div>
                  )}

                  {user.profile.country && (
                    <div>
                      <Label className="text-sm text-gray-600">ประเทศ</Label>
                      <p className="font-medium">{user.profile.country}</p>
                    </div>
                  )}

                  {user.profile.dateOfBirth && (
                    <div>
                      <Label className="text-sm text-gray-600">วันเกิด</Label>
                      <p className="font-medium">
                        {new Date(user.profile.dateOfBirth).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">ข้อมูลระบบ</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">วันที่สมัครสมาชิก</Label>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">อัปเดตล่าสุด</Label>
                <p className="font-medium">
                  {new Date(user.updatedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}