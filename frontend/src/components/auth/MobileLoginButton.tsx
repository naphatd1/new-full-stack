'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { UserIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface MobileLoginButtonProps {
  onClose: () => void
}

export function MobileLoginButton({ onClose }: MobileLoginButtonProps) {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    onClose()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col space-y-2">
        <Link href="/login" onClick={onClose}>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            เข้าสู่ระบบ
          </Button>
        </Link>
        <Link href="/register" onClick={onClose}>
          <Button size="sm" className="w-full">สมัครสมาชิก</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border-t border-border pt-4 mt-4">
      {/* Profile Info */}
      <div className="flex items-center space-x-3 mb-4 p-2 bg-muted/30 rounded-lg">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            ผู้ดูแลระบบ
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <Link
          href="/profile"
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-accent"
          onClick={onClose}
        >
          <UserIcon className="h-5 w-5" />
          <span>โปรไฟล์</span>
        </Link>
        <Link
          href="/my-houses"
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-accent"
          onClick={onClose}
        >
          <UserIcon className="h-5 w-5" />
          <span>บ้านของฉัน</span>
        </Link>
        {user.role === 'ADMIN' && (
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-accent"
            onClick={onClose}
          >
            <UserIcon className="h-5 w-5" />
            <span>จัดการระบบ</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 w-full text-left"
        >
          <UserIcon className="h-5 w-5" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  )
}