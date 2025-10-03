'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LoginButton() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/login">เข้าสู่ระบบ</Link>
        </Button>
        <Button asChild>
          <Link href="/register">สมัครสมาชิก</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Profile Info */}
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            ผู้ดูแลระบบ
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>โปรไฟล์</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>ตั้งค่า</span>
              </Link>
            </DropdownMenuItem>
            {user.role === 'ADMIN' && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>จัดการระบบ</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}