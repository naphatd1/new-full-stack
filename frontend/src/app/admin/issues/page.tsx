'use client';

import React, { useEffect, useState } from 'react';
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
  ExclamationTriangleIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Issue {
  id: number;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'complaint' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reporter: string;
  reporterEmail: string;
  createdAt: string;
  updatedAt: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIssues([
        {
          id: 1,
          title: 'ไม่สามารถอัปโหลดรูปภาพได้',
          description: 'เมื่อพยายามอัปโหลดรูปภาพบ้าน ระบบแสดงข้อผิดพลาด',
          type: 'bug',
          priority: 'high',
          status: 'open',
          reporter: 'สมชาย ใจดี',
          reporterEmail: 'somchai@email.com',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
        },
        {
          id: 2,
          title: 'ขอเพิ่มฟีเจอร์ค้นหาด้วยแผนที่',
          description: 'อยากให้มีการค้นหาบ้านผ่านแผนที่ Google Maps',
          type: 'feature',
          priority: 'medium',
          status: 'in-progress',
          reporter: 'สุดา รักดี',
          reporterEmail: 'suda@email.com',
          createdAt: '2024-01-19',
          updatedAt: '2024-01-20',
        },
        {
          id: 3,
          title: 'ข้อมูลบ้านไม่ถูกต้อง',
          description: 'พบข้อมูลบ้านที่ไม่ตรงกับความเป็นจริง ID: 123',
          type: 'complaint',
          priority: 'medium',
          status: 'resolved',
          reporter: 'วิชัย สุขใส',
          reporterEmail: 'wichai@email.com',
          createdAt: '2024-01-18',
          updatedAt: '2024-01-19',
        },
        {
          id: 4,
          title: 'หน้าเว็บโหลดช้า',
          description: 'หน้าค้นหาบ้านโหลดช้ามาก โดยเฉพาะในช่วงเย็น',
          type: 'bug',
          priority: 'high',
          status: 'open',
          reporter: 'มาลี ใสใจ',
          reporterEmail: 'malee@email.com',
          createdAt: '2024-01-17',
          updatedAt: '2024-01-18',
        },
        {
          id: 5,
          title: 'ขอปรับปรุง UI หน้าโปรไฟล์',
          description: 'หน้าโปรไฟล์ผู้ใช้ควรมีการจัดวางที่ดีกว่านี้',
          type: 'feature',
          priority: 'low',
          status: 'closed',
          reporter: 'ประยุทธ์ ดีใจ',
          reporterEmail: 'prayuth@email.com',
          createdAt: '2024-01-16',
          updatedAt: '2024-01-17',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeBadge = (type: Issue['type']) => {
    const typeConfig = {
      bug: { label: 'บั๊ก', variant: 'destructive' as const },
      feature: { label: 'ฟีเจอร์ใหม่', variant: 'default' as const },
      complaint: { label: 'ร้องเรียน', variant: 'secondary' as const },
      other: { label: 'อื่นๆ', variant: 'outline' as const },
    };
    
    const config = typeConfig[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: Issue['priority']) => {
    const priorityConfig = {
      low: { 
        label: 'ต่ำ', 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200 dark:border dark:border-gray-600' 
      },
      medium: { 
        label: 'ปานกลาง', 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border dark:border-yellow-700' 
      },
      high: { 
        label: 'สูง', 
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200 dark:border dark:border-orange-700' 
      },
      critical: { 
        label: 'วิกฤต', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 dark:border dark:border-red-700' 
      },
    };
    
    const config = priorityConfig[priority];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: Issue['status']) => {
    const statusConfig = {
      open: { label: 'เปิด', variant: 'destructive' as const },
      'in-progress': { label: 'กำลังดำเนินการ', variant: 'default' as const },
      resolved: { label: 'แก้ไขแล้ว', variant: 'secondary' as const },
      closed: { label: 'ปิด', variant: 'outline' as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (issueId: number, newStatus: Issue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : issue
    ));
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">รายงานปัญหา</h1>
              <p className="mt-2 text-muted-foreground">
                จัดการรายงานปัญหาและข้อเสนอแนะจากผู้ใช้
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ปัญหาทั้งหมด
              </CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {issues.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                เปิดอยู่
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {issues.filter(i => i.status === 'open').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                กำลังดำเนินการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {issues.filter(i => i.status === 'in-progress').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                แก้ไขแล้ว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {issues.filter(i => i.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>รายการปัญหาทั้งหมด</CardTitle>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="open">เปิด</option>
                  <option value="in-progress">กำลังดำเนินการ</option>
                  <option value="resolved">แก้ไขแล้ว</option>
                  <option value="closed">ปิด</option>
                </select>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ค้นหาปัญหา..."
                    className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
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
                  <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>หัวข้อ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>ความสำคัญ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>ผู้รายงาน</TableHead>
                    <TableHead>วันที่รายงาน</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-foreground max-w-xs truncate">
                            {issue.title}
                          </div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate mt-1">
                            {issue.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(issue.type)}</TableCell>
                      <TableCell>{getPriorityBadge(issue.priority)}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-foreground">{issue.reporter}</div>
                          <div className="text-sm text-muted-foreground mt-1">{issue.reporterEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {new Date(issue.createdAt).toLocaleDateString('th-TH')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          {issue.status === 'open' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(issue.id, 'in-progress')}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          )}
                          {issue.status === 'in-progress' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(issue.id, 'resolved')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(issue.id, 'closed')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && filteredIssues.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchTerm || filterStatus !== 'all' ? 'ไม่พบปัญหาที่ค้นหา' : 'ยังไม่มีรายงานปัญหา'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}