'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';
import { ApiError } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import { ArrowLeftIcon, KeyIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'กรุณากรอกรหัสผ่านปัจจุบัน';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'กรุณากรอกรหัสผ่านใหม่';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.newPassword)) {
      newErrors.newPassword = 'รหัสผ่านต้องประกอบด้วย ตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านปัจจุบัน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
        router.push('/profile');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน';
      toast.error(errorMessage);
      
      if (apiError.response?.status === 400) {
        setErrors({ currentPassword: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            กลับไปโปรไฟล์
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <KeyIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">เปลี่ยนรหัสผ่าน</h1>
              <p className="text-gray-600">อัพเดทรหัสผ่านของคุณเพื่อความปลอดภัย</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รหัสผ่านใหม่</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="รหัสผ่านปัจจุบัน"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                placeholder="กรอกรหัสผ่านปัจจุบัน"
                required
              />

              <Input
                label="รหัสผ่านใหม่"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                placeholder="กรอกรหัสผ่านใหม่"
                helperText="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วย ตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ"
                required
              />

              <Input
                label="ยืนยันรหัสผ่านใหม่"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="ยืนยันรหัสผ่านใหม่"
                required
              />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">ข้อกำหนดรหัสผ่าน:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span>ความยาวอย่างน้อย 8 ตัวอักษร</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span>มีตัวพิมพ์เล็กและพิมพ์ใหญ่</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${/\d/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span>มีตัวเลขอย่างน้อย 1 ตัว</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${/[@$!%*?&]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span>มีอักขระพิเศษ (@$!%*?&)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">เพื่อความปลอดภัย:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• ไม่ควรใช้รหัสผ่านเดิมที่เคยใช้</li>
                  <li>• ไม่ควรใช้ข้อมูลส่วนตัว เช่น ชื่อ วันเกิด</li>
                  <li>• ควรเปลี่ยนรหัสผ่านเป็นประจำ</li>
                  <li>• ไม่ควรแชร์รหัสผ่านกับผู้อื่น</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/profile">
                  <Button variant="outline" type="button">
                    ยกเลิก
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}