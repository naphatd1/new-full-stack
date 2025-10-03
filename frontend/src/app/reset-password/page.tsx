'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง');
      router.push('/forgot-password');
      return;
    }
    setToken(tokenParam);
  }, [searchParams, router]);

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

    if (!formData.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่านใหม่';
    } else if (formData.password.length < 8) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'รหัสผ่านต้องประกอบด้วย ตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !token) return;

    setLoading(true);
    try {
      // Simulate API call for reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว');
      router.push('/login');
    } catch {
      toast.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ลิงก์ไม่ถูกต้อง</h2>
          <p className="text-gray-600 mb-4">ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว</p>
          <Link href="/forgot-password">
            <Button>ขอลิงก์ใหม่</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <HomeIcon className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HouseMarket</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          ตั้งรหัสผ่านใหม่
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          กรอกรหัสผ่านใหม่ของคุณ
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Link href="/login" className="text-blue-600 hover:text-blue-700">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <CardTitle>รหัสผ่านใหม่</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="รหัสผ่านใหม่"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="กรอกรหัสผ่านใหม่"
                helperText="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วย ตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ"
                required
              />

              <Input
                label="ยืนยันรหัสผ่าน"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="ยืนยันรหัสผ่านใหม่"
                required
              />

              <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                <p className="font-medium text-yellow-900 mb-1">ข้อกำหนดรหัสผ่าน:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800">
                  <li>ความยาวอย่างน้อย 8 ตัวอักษร</li>
                  <li>มีตัวพิมพ์เล็กและพิมพ์ใหญ่</li>
                  <li>มีตัวเลขอย่างน้อย 1 ตัว</li>
                  <li>มีอักขระพิเศษ (@$!%*?&)</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                จำรหัสผ่านได้แล้ว?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังโหลด...</p>
      </div>
    </div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}