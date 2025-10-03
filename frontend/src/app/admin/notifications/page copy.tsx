"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: "บ้านใหม่ถูกลงประกาศ",
    message: "มีบ้านใหม่ถูกลงประกาศในระบบ: บ้านเดี่ยว 2 ชั้น ย่านสุขุมวิท",
    type: "info",
    isRead: false,
    createdAt: "2024-01-15T10:30:00Z",
    user: "นาย สมชาย ใจดี"
  },
  {
    id: 2,
    title: "รายงานการขายประจำเดือน",
    message: "รายงานการขายประจำเดือนมกราคม 2024 พร้อมแล้ว",
    type: "success",
    isRead: true,
    createdAt: "2024-01-14T15:45:00Z",
    user: "ระบบ"
  },
  {
    id: 3,
    title: "แจ้งเตือนการชำระเงิน",
    message: "มีการชำระเงินค้างชำระสำหรับประกาศ ID: 12345",
    type: "warning",
    isRead: false,
    createdAt: "2024-01-13T09:15:00Z",
    user: "นางสาว สุดา รักดี"
  },
  {
    id: 4,
    title: "ข้อผิดพลาดระบบ",
    message: "เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ กรุณาตรวจสอบ",
    type: "error",
    isRead: false,
    createdAt: "2024-01-12T14:20:00Z",
    user: "ระบบ"
  },
  {
    id: 5,
    title: "ผู้ใช้ใหม่สมัครสมาชิก",
    message: "มีผู้ใช้ใหม่สมัครสมาชิก: john.doe@example.com",
    type: "info",
    isRead: true,
    createdAt: "2024-01-11T11:30:00Z",
    user: "ระบบ"
  }
];

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XMarkIcon className="h-6 w-6 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'warning':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'error':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    toast.success("ทำเครื่องหมายว่าอ่านแล้ว");
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast.success("ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว");
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success("ลบการแจ้งเตือนแล้ว");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            กลับหน้า Admin
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              การแจ้งเตือน
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              จัดการและติดตามการแจ้งเตือนทั้งหมดในระบบ
            </p>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
              <CardContent className="p-6 text-center">
                <BellIcon className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{notifications.length}</div>
                <div className="text-sm opacity-90">การแจ้งเตือนทั้งหมด</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
              <CardContent className="p-6 text-center">
                <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm opacity-90">ยังไม่ได้อ่าน</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-6 text-center">
                <CheckIcon className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
                <div className="text-sm opacity-90">อ่านแล้ว</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter and Actions */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className="transition-all duration-200"
                >
                  ทั้งหมด ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  onClick={() => setFilter('unread')}
                  className="transition-all duration-200"
                >
                  ยังไม่ได้อ่าน ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'read' ? 'default' : 'outline'}
                  onClick={() => setFilter('read')}
                  className="transition-all duration-200"
                >
                  อ่านแล้ว ({notifications.length - unreadCount})
                </Button>
              </div>
              <Button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-200"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  ไม่มีการแจ้งเตือน
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' && 'ไม่มีการแจ้งเตือนที่ยังไม่ได้อ่าน'}
                  {filter === 'read' && 'ไม่มีการแจ้งเตือนที่อ่านแล้ว'}
                  {filter === 'all' && 'ไม่มีการแจ้งเตือนในระบบ'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`shadow-xl border-2 bg-gradient-to-r ${getNotificationBgColor(notification.type)} hover:shadow-2xl transition-all duration-300 ${
                  !notification.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              ใหม่
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {notification.message}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>👤 {notification.user}</span>
                          <span>🕒 {formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                          className="hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                        className="hover:bg-red-50 hover:border-red-300 text-red-600 transition-all duration-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <p className="text-gray-600 text-sm">
            💡 <strong>เคล็ดลับ:</strong> คลิกที่ปุ่ม ✓ เพื่อทำเครื่องหมายว่าอ่านแล้ว หรือปุ่ม ✗ เพื่อลบการแจ้งเตือน
          </p>
        </div>
      </div>
    </div>
  );
}