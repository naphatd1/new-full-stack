'use client'

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logoutUser } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TestAuthPage() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">ทดสอบ Authentication</h1>
        
        {isLoading ? (
          <div className="text-center">
            <p>กำลังตรวจสอบ...</p>
          </div>
        ) : isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ เข้าสู่ระบบแล้ว
              </h2>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <p><strong>ชื่อ:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>อีเมล:</strong> {user.email}</p>
                <p><strong>ชื่อผู้ใช้:</strong> {user.username}</p>
                <p><strong>บทบาท:</strong> {user.role}</p>
                <p><strong>สถานะ:</strong> {user.isActive ? 'ใช้งานได้' : 'ถูกระงับ'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => console.log('Full user object:', user)} 
                variant="secondary" 
                className="w-full"
              >
                Debug: ดู User Object ใน Console
              </Button>
              
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                ออกจากระบบ
              </Button>
              
              {user.role === 'ADMIN' ? (
                <Button asChild className="w-full">
                  <Link href="/admin">เข้าสู่หน้า Admin</Link>
                </Button>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    ⚠️ คุณไม่ใช่ Admin (Role: {user.role})
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    ต้องการเข้าหน้า Admin ให้ติดต่อผู้ดูแลระบบ
                  </p>
                </div>
              )}
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/">กลับหน้าหลัก</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                ❌ ยังไม่ได้เข้าสู่ระบบ
              </h2>
              <p className="text-sm text-red-700 dark:text-red-300">
                กรุณาเข้าสู่ระบบเพื่อดูข้อมูล
              </p>
            </div>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">สมัครสมาชิก</Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">กลับหน้าหลัก</Link>
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold mb-2">ลิงก์ทดสอบ:</h3>
          <div className="space-y-1 text-xs">
            <Link href="/login-simple" className="block text-blue-600 hover:underline">
              หน้า Login แบบง่าย
            </Link>
            <Link href="/register-simple" className="block text-blue-600 hover:underline">
              หน้า Register แบบง่าย
            </Link>
            <Link href="/admin" className="block text-blue-600 hover:underline">
              หน้า Admin (ต้อง login และเป็น ADMIN)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}