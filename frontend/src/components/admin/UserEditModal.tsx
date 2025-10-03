'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: { firstName?: string; lastName?: string; role?: string }) => Promise<void>;
}

export default function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
}: UserEditModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'USER',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'USER',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setSaving(false);
    }
  };

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>แก้ไขข้อมูลผู้ใช้</span>
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
          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div>
                <Label className="text-sm text-gray-600">อีเมล</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ชื่อผู้ใช้</Label>
                <p className="font-medium">{user.username}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <Label className="text-sm text-gray-600">สถานะปัจจุบัน</Label>
                  <div className="mt-1">
                    {getStatusBadge(user.isActive)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">บทบาทปัจจุบัน</Label>
                  <div className="mt-1">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">ชื่อ</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="ชื่อ"
                />
              </div>
              <div>
                <Label htmlFor="lastName">นามสกุล</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="นามสกุล"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role">บทบาท</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกบทบาท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">ผู้ใช้ทั่วไป</SelectItem>
                  <SelectItem value="AGENT">นายหน้า</SelectItem>
                  <SelectItem value="MODERATOR">ผู้ดูแล</SelectItem>
                  <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">วันที่สมัคร</Label>
                <p>{new Date(user.createdAt).toLocaleDateString('th-TH')}</p>
              </div>
              <div>
                <Label className="text-gray-600">อัปเดตล่าสุด</Label>
                <p>{new Date(user.updatedAt).toLocaleDateString('th-TH')}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}