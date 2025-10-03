'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, loading: isLoading, user } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (!isAuthenticated) {
        setIsRedirecting(true)
        router.push(redirectTo)
        return
      }

      if (requireAdmin && user?.role !== 'ADMIN') {
        setIsRedirecting(true)
        router.push('/')
        return
      }
    }
  }, [isMounted, isAuthenticated, isLoading, user, requireAdmin, router, redirectTo])

  // Show loading during hydration, initial auth check, or when redirecting
  if (!isMounted || isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {isRedirecting ? 'กำลังเปลี่ยนหน้า...' : 'กำลังตรวจสอบสิทธิ์...'}
          </p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (prevents flash)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">กำลังเปลี่ยนหน้า...</p>
        </div>
      </div>
    )
  }

  // Check admin permission
  if (requireAdmin && user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="text-muted-foreground">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}