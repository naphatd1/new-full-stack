'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import Input from '@/components/ui/Input';
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  ChatBubbleLeftRightIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,

  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  adminResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
  recentMessages: number;
}

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10,
    dateFrom: '',
    dateTo: ''
  });
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const statusLabels = {
    UNREAD: 'ยังไม่ได้อ่าน',
    READ: 'อ่านแล้ว',
    REPLIED: 'ตอบกลับแล้ว',
    ARCHIVED: 'เก็บถาวร'
  };

  const statusColors = {
    UNREAD: 'bg-red-100 text-red-800',
    READ: 'bg-blue-100 text-blue-800',
    REPLIED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-gray-100 text-gray-800'
  };

  const subjectLabels = {
    buy: 'สอบถามการซื้อบ้าน',
    sell: 'สอบถามการขายบ้าน',
    support: 'ปัญหาการใช้งาน',
    partnership: 'ความร่วมมือทางธุรกิจ',
    other: 'อื่นๆ'
  };

  const fetchMessages = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    } catch (error) {
      console.error('Fetch messages error:', error);
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(msg => msg.id));
    }
  }, [selectedMessages.length, messages]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + R: Refresh
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        fetchMessages();
        fetchStats();
        toast.success('รีเฟรชข้อมูลเรียบร้อยแล้ว');
      }
      
      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && messages.length > 0) {
        e.preventDefault();
        handleSelectAll();
      }
      
      // Escape: Clear selection
      if (e.key === 'Escape') {
        setSelectedMessages([]);
        setShowResponseModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [messages.length, selectedMessages.length, fetchMessages, fetchStats, handleSelectAll]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchMessages();
      fetchStats();
    }
  }, [user, filters, fetchMessages, fetchStats]);

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    setActionLoading(messageId);
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('อัพเดทสถานะเรียบร้อยแล้ว');
        // Update local state immediately for better UX
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: newStatus as ContactMessage['status'] } : msg
        ));
        fetchStats();
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาดในการอัพเดทสถานะ');
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedMessage || !adminResponse.trim()) {
      toast.error('กรุณากรอกข้อความตอบกลับ');
      return;
    }

    setActionLoading('response');
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${selectedMessage.id}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminResponse })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('บันทึกการตอบกลับเรียบร้อยแล้ว');
        setShowResponseModal(false);
        setAdminResponse('');
        setSelectedMessage(null);
        // Update local state
        setMessages(prev => prev.map(msg => 
          msg.id === selectedMessage.id 
            ? { ...msg, status: 'REPLIED' as ContactMessage['status'], adminResponse, respondedAt: new Date().toISOString() }
            : msg
        ));
        fetchStats();
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาดในการบันทึกการตอบกลับ');
      }
    } catch (error) {
      console.error('Add response error:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกการตอบกลับ');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteMessage = async (messageId: string, messageName: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบข้อความจาก "${messageName}"?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
      return;
    }

    setActionLoading(messageId);
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('ลบข้อความเรียบร้อยแล้ว');
        // Remove from local state immediately
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        fetchStats();
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาดในการลบข้อความ');
      }
    } catch (error) {
      console.error('Delete message error:', error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อความ');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedMessages.length === 0) {
      toast.error('กรุณาเลือกข้อความที่ต้องการอัพเดท');
      return;
    }

    setActionLoading('bulk');
    try {
      const token = Cookies.get('token');
      const promises = selectedMessages.map(messageId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${messageId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        })
      );

      await Promise.all(promises);
      toast.success(`อัพเดทสถานะ ${selectedMessages.length} รายการเรียบร้อยแล้ว`);
      setSelectedMessages([]);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Bulk update error:', error);
      toast.error('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) {
      toast.error('กรุณาเลือกข้อความที่ต้องการลบ');
      return;
    }

    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบข้อความ ${selectedMessages.length} รายการ?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
      return;
    }

    setActionLoading('bulk');
    try {
      const token = Cookies.get('token');
      const promises = selectedMessages.map(messageId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      await Promise.all(promises);
      toast.success(`ลบข้อความ ${selectedMessages.length} รายการเรียบร้อยแล้ว`);
      setSelectedMessages([]);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อความ');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    if (messages.length === 0) {
      toast.error('ไม่มีข้อมูลสำหรับ export');
      return;
    }

    const csvData = messages.map(message => ({
      'วันที่': formatDate(message.createdAt),
      'ชื่อ': message.name,
      'อีเมล': message.email,
      'โทรศัพท์': message.phone || '',
      'หัวข้อ': subjectLabels[message.subject as keyof typeof subjectLabels] || message.subject,
      'ข้อความ': message.message,
      'สถานะ': statusLabels[message.status],
      'การตอบกลับ': message.adminResponse || '',
      'วันที่ตอบกลับ': message.respondedAt ? formatDate(message.respondedAt) : ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact-messages-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export ข้อมูลเรียบร้อยแล้ว');
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-semibold text-foreground mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
            <p className="text-muted-foreground">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  กลับหน้า Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">จัดการข้อความติดต่อ</h1>
                <p className="text-muted-foreground mt-2">ดูและจัดการข้อความจากลูกค้า</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                fetchMessages();
                fetchStats();
                toast.success('รีเฟรชข้อมูลเรียบร้อยแล้ว');
              }}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              ) : (
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              รีเฟรช
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-8 w-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">ยังไม่อ่าน</p>
                    <p className="text-2xl font-bold text-foreground">{stats.unread}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <EnvelopeOpenIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">อ่านแล้ว</p>
                    <p className="text-2xl font-bold text-foreground">{stats.read}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">ตอบแล้ว</p>
                    <p className="text-2xl font-bold text-foreground">{stats.replied}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ArchiveBoxIcon className="h-8 w-8 text-gray-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">เก็บถาวร</p>
                    <p className="text-2xl font-bold text-foreground">{stats.archived}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">30 วันล่าสุด</p>
                    <p className="text-2xl font-bold text-foreground">{stats.recentMessages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  สถานะ
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="UNREAD">ยังไม่ได้อ่าน</option>
                  <option value="READ">อ่านแล้ว</option>
                  <option value="REPLIED">ตอบกลับแล้ว</option>
                  <option value="ARCHIVED">เก็บถาวร</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  ค้นหา
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="ค้นหาชื่อ, อีเมล, หัวข้อ..."
                    className="w-full pl-10 rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  วันที่เริ่มต้น
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value, page: 1 }))}
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value, page: 1 }))}
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  จำนวนต่อหน้า
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                  className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo) && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      status: 'all',
                      search: '',
                      page: 1,
                      limit: 10,
                      dateFrom: '',
                      dateTo: ''
                    });
                    setSearchInput('');
                  }}
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  ล้างตัวกรอง
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-foreground">
                    เลือกแล้ว {selectedMessages.length} รายการ
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMessages([])}
                  >
                    ยกเลิกการเลือก
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkStatusChange(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    disabled={actionLoading === 'bulk'}
                    className="text-xs rounded border border-input bg-background px-2 py-1 disabled:opacity-50"
                  >
                    <option value="">เปลี่ยนสถานะ</option>
                    <option value="UNREAD">ยังไม่อ่าน</option>
                    <option value="read">อ่านแล้ว</option>
                    <option value="REPLIED">ตอบแล้ว</option>
                    <option value="ARCHIVED">เก็บถาวร</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={actionLoading === 'bulk'}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {actionLoading === 'bulk' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <>
                        <TrashIcon className="h-4 w-4 mr-1" />
                        ลบที่เลือก
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ข้อความติดต่อ ({pagination.total} รายการ)</CardTitle>
              <div className="flex items-center space-x-4">
                {messages.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCSV}
                      className="text-green-600 hover:text-green-700"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export CSV
                    </Button>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMessages.length === messages.length && messages.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-input"
                      />
                      <label className="text-sm text-muted-foreground">เลือกทั้งหมด</label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">กำลังโหลด...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <EnvelopeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">ไม่พบข้อความ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-lg p-4 hover:bg-muted/30 transition-colors ${
                      message.status === 'UNREAD' ? 'border-red-200 bg-red-50/30' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={() => handleSelectMessage(message.id)}
                          className="mt-1 rounded border-input"
                        />
                        <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-foreground">{message.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[message.status]}`}>
                            {statusLabels[message.status]}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">อีเมล: {message.email}</p>
                            {message.phone && (
                              <p className="text-sm text-muted-foreground">โทร: {message.phone}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              หัวข้อ: {subjectLabels[message.subject as keyof typeof subjectLabels] || message.subject}
                            </p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-foreground line-clamp-2">{message.message}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>ความยาว: {message.message.length} ตัวอักษร</span>
                            <span>อัพเดทล่าสุด: {formatDate(message.updatedAt)}</span>
                          </div>
                        </div>

                        {message.adminResponse && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-green-800 mb-1">การตอบกลับ:</p>
                            <p className="text-sm text-green-700">{message.adminResponse}</p>
                            {message.respondedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                ตอบกลับเมื่อ: {formatDate(message.respondedAt)}
                              </p>
                            )}
                          </div>
                        )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {message.status === 'UNREAD' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(message.id, 'READ')}
                            disabled={actionLoading === message.id}
                            title="ทำเครื่องหมายว่าอ่านแล้ว"
                            className="mr-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setAdminResponse(message.adminResponse || '');
                            setShowResponseModal(true);
                          }}
                          disabled={actionLoading === message.id}
                          title="ตอบกลับ"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </Button>

                        <select
                          value={message.status}
                          onChange={(e) => handleStatusChange(message.id, e.target.value)}
                          disabled={actionLoading === message.id}
                          className="text-xs rounded border border-input bg-background px-2 py-1 disabled:opacity-50"
                        >
                          <option value="UNREAD">ยังไม่อ่าน</option>
                          <option value="READ">อ่านแล้ว</option>
                          <option value="REPLIED">ตอบแล้ว</option>
                          <option value="ARCHIVED">เก็บถาวร</option>
                        </select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMessage(message.id, message.name)}
                          disabled={actionLoading === message.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          title="ลบข้อความ"
                        >
                          {actionLoading === message.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  หน้า {filters.page} จาก {pagination.totalPages} ({pagination.total} รายการ)
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrev}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    ก่อนหน้า
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNext}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Modal */}
        {showResponseModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">ตอบกลับข้อความ</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowResponseModal(false);
                      setAdminResponse('');
                      setSelectedMessage(null);
                    }}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-foreground mb-2">ข้อความต้นฉบับ</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    จาก: {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    หัวข้อ: {subjectLabels[selectedMessage.subject as keyof typeof subjectLabels] || selectedMessage.subject}
                  </p>
                  <p className="text-sm text-foreground">{selectedMessage.message}</p>
                </div>

                {selectedMessage.adminResponse && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-green-800 mb-2">การตอบกลับก่อนหน้า</h3>
                    <p className="text-sm text-green-700">{selectedMessage.adminResponse}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ข้อความตอบกลับ
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
                    placeholder="กรอกข้อความตอบกลับ..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResponseModal(false);
                      setAdminResponse('');
                      setSelectedMessage(null);
                    }}
                  >
                    ยกเลิก
                  </Button>
                  <Button 
                    onClick={handleAddResponse}
                    disabled={actionLoading === 'response'}
                  >
                    {actionLoading === 'response' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        บันทึกการตอบกลับ
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}