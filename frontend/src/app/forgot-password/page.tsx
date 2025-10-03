'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call for forgot password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSent(true);
      toast.success('ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว');
    } catch {
      toast.error('เกิดข้อผิดพลาดในการส่งอีเมล');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <HomeIcon className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">HouseMarket</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">อีเมลถูกส่งแล้ว</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">
                  เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยัง
                </p>
                <p className="font-medium text-gray-900 mb-6">{email}</p>
                <p className="text-sm text-gray-500 mb-6">
                  กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน
                  <br />
                  หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์ Spam
                </p>
              </div>

              <div className="space-y-4">
                <Link href="/login">
                  <Button className="w-full">
                    กลับไปหน้าเข้าสู่ระบบ
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-500"
                >
                  ส่งอีเมลอีกครั้ง
                </button>
              </div>
            </CardContent>
          </Card>
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
          ลืมรหัสผ่าน
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Link href="/login" className="text-blue-600 hover:text-blue-700">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <CardTitle>รีเซ็ตรหัสผ่าน</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="อีเมล"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                error={errors.email}
                placeholder="กรอกอีเมลของคุณ"
                required
              />

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">วิธีการรีเซ็ตรหัสผ่าน:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>กรอกอีเมลที่ใช้สมัครสมาชิก</li>
                  <li>ตรวจสอบอีเมลและคลิกลิงก์ที่ได้รับ</li>
                  <li>ตั้งรหัสผ่านใหม่</li>
                </ol>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
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