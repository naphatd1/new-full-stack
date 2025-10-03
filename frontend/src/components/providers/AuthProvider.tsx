'use client'

import { useEffect } from 'react'
import { useInitializeAuth } from '@/hooks/api/useAuth'
import { useActivityTracker } from '@/hooks/useActivityTracker'
import { useAppDispatch } from '@/store/hooks'
import { clearCredentials } from '@/store/slices/authSlice'
import Cookies from 'js-cookie'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  
  // Initialize activity tracker
  useActivityTracker()
  
  // Quick check for token on mount to set initial state faster
  useEffect(() => {
    const token = Cookies.get('token')
    const sessionToken = Cookies.get('sessionToken')
    
    if (!token || !sessionToken) {
      dispatch(clearCredentials())
    }
  }, [dispatch])

  // Initialize auth state on app start
  useInitializeAuth()

  return <>{children}</>
}