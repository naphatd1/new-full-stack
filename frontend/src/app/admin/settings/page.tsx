'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ColorCustomizer from '@/components/admin/ColorCustomizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { settingsApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'HouseMarket',
    siteDescription: 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ออนไลน์',
    allowRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,pdf',
    commissionRate: 3,
    currency: 'THB',
    timezone: 'Asia/Bangkok',
    language: 'th',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // โหลดการตั้งค่าจากฐานข้อมูล
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsApi.getSettings();
        if (response.success && response.data) {
          const data = response.data as Record<string, unknown>;
          setSettings({
            siteName: (data.siteName as string) || 'HouseMarket',
            siteDescription: (data.siteDescription as string) || 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ออนไลน์',
            allowRegistration: (data.allowRegistration as boolean) ?? true,
            requireEmailVerification: (data.requireEmailVerification as boolean) ?? true,
            enableNotifications: (data.enableNotifications as boolean) ?? true,
            maintenanceMode: (data.maintenanceMode as boolean) ?? false,
            maxFileSize: (data.maxFileSize as number) || 10,
            allowedFileTypes: (data.allowedFileTypes as string) || 'jpg,jpeg,png,pdf',
            commissionRate: parseFloat((data.commissionRate as string) || '3') || 3,
            currency: (data.currency as string) || 'THB',
            timezone: (data.timezone as string) || 'Asia/Bangkok',
            language: (data.language as string) || 'th',
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('ไม่สามารถโหลดการตั้งค่าได้');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsApi.updateSettings(settings);
      if (response.success) {
        toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว');
      } else {
        toast.error(response.message || 'เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (error: unknown) {
      console.error('Error saving settings:', error);
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
          <p className="mt-2 text-gray-600">
            จัดการการตั้งค่าทั่วไปของระบบ
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">กำลังโหลดการตั้งค่า...</span>
          </div>
        ) : (
          <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CogIcon className="h-5 w-5 text-gray-600" />
                <CardTitle>การตั้งค่าทั่วไป</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อเว็บไซต์
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ภาษา
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="th">ไทย</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบายเว็บไซต์
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สกุลเงิน
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="THB">บาทไทย (THB)</option>
                    <option value="USD">ดอลลาร์สหรัฐ (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เขตเวลา
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Asia/Bangkok">เอเชีย/กรุงเทพฯ</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                <CardTitle>การตั้งค่าผู้ใช้</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">อนุญาตให้สมัครสมาชิก</h4>
                  <p className="text-sm text-gray-500">ผู้ใช้สามารถสมัครสมาชิกใหม่ได้</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">ต้องยืนยันอีเมล</h4>
                  <p className="text-sm text-gray-500">ผู้ใช้ต้องยืนยันอีเมลก่อนใช้งาน</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                <CardTitle>การตั้งค่าไฟล์</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ขนาดไฟล์สูงสุด (MB)
                  </label>
                  <input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทไฟล์ที่อนุญาต
                  </label>
                  <input
                    type="text"
                    value={settings.allowedFileTypes}
                    onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                    placeholder="jpg,jpeg,png,pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-600" />
                <CardTitle>การตั้งค่าธุรกิจ</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อัตราค่าคอมมิชชั่น (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <CardTitle>การตั้งค่าการแจ้งเตือน</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">เปิดใช้งานการแจ้งเตือน</h4>
                  <p className="text-sm text-gray-500">ส่งการแจ้งเตือนให้ผู้ใช้</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">โหมดบำรุงรักษา</h4>
                  <p className="text-sm text-gray-500">ปิดเว็บไซต์ชั่วคราวเพื่อบำรุงรักษา</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Color Customizer */}
          <ColorCustomizer />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              className="px-8"
              disabled={saving || loading}
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}