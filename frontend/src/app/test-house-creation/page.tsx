'use client'

import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TestHouseCreationPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [testResult, setTestResult] = useState('')

  const testAPI = async () => {
    try {
      setTestResult('กำลังทดสอบ API...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/houses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTestResult(`✅ API ทำงานได้! พบบ้าน ${data.data?.length || 0} หลัง`)
      } else {
        setTestResult(`❌ API Error: ${response.status}`)
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">ทดสอบระบบเพิ่มบ้าน</h1>
        
        <div className="space-y-6">
          {/* Authentication Status */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">สถานะการเข้าสู่ระบบ</h2>
            {isAuthenticated && user ? (
              <div className="text-green-600 dark:text-green-400">
                ✅ เข้าสู่ระบบแล้ว: {user.firstName} {user.lastName} ({user.role})
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">
                ❌ ยังไม่ได้เข้าสู่ระบบ
              </div>
            )}
          </div>

          {/* API Test */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">ทดสอบ API</h2>
            <Button onClick={testAPI} className="mb-2">
              ทดสอบ Houses API
            </Button>
            {testResult && (
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                {testResult}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">ลิงก์ทดสอบ</h2>
            
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login">เข้าสู่ระบบ</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/register">สมัครสมาชิก</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {user?.role === 'ADMIN' && (
                  <>
                    <Button asChild className="w-full">
                      <Link href="/admin/houses/create">เพิ่มบ้านใหม่ (Admin)</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/houses">จัดการบ้าน (Admin)</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin">หน้า Admin</Link>
                    </Button>
                  </>
                )}
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">หน้าหลัก (ดูบ้านแนะนำ)</Link>
                </Button>
                
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/test-auth">ทดสอบ Authentication</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              วิธีทดสอบระบบ:
            </h3>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>เข้าสู่ระบบด้วยบัญชี Admin</li>
              <li>ไปที่หน้า &quot;เพิ่มบ้านใหม่&quot;</li>
              <li>กรอกข้อมูลและอัพโหลดรูปภาพ</li>
              <li>กด Submit</li>
              <li>ระบบจะ redirect ไปหน้าหลัก</li>
              <li>ตรวจสอบว่าบ้านใหม่ปรากฏในส่วน &quot;บ้านแนะนำ&quot;</li>
            </ol>
          </div>

          {/* Create Admin User */}
          {isAuthenticated && user?.role !== 'ADMIN' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ คุณไม่ใช่ Admin
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                หากต้องการทดสอบการเพิ่มบ้าน ให้รัน SQL command นี้ใน database:
              </p>
              <code className="block bg-yellow-100 dark:bg-yellow-800 p-2 rounded text-xs">
                UPDATE users SET role = &apos;ADMIN&apos; WHERE email = &apos;{user?.email}&apos;;
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}