import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  clearError,
  setCredentials,
  clearCredentials
} from '@/store/slices/authSlice'
import { authApi } from '@/lib/api'
import { LoginForm, RegisterApiData } from '@/types'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

// Auth state selector
export const useAuthState = () => {
  return useAppSelector((state) => state.auth)
}

// Login mutation
export const useLogin = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginForm) => {
      const response = await authApi.login(credentials)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Login failed')
    },
    onSuccess: (data) => {
      // Store token in session cookies (จะหายเมื่อปิด browser)
      Cookies.set('token', data.token, { sameSite: 'strict' })
      
      // Update Redux state
      dispatch(setCredentials({ 
        user: data.user, 
        token: data.token
      }))
      
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      
      toast.success('เข้าสู่ระบบสำเร็จ')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'เข้าสู่ระบบไม่สำเร็จ')
    },
  })
}

// Register mutation
export const useRegister = () => {
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (userData: RegisterApiData) => {
      const response = await authApi.register(userData)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Registration failed')
    },
    onSuccess: (data) => {
      // Store token in session cookies (จะหายเมื่อปิด browser)
      Cookies.set('token', data.token, { sameSite: 'strict' })
      
      // Update Redux state
      dispatch(setCredentials({ 
        user: data.user, 
        token: data.token
      }))
      
      toast.success('สมัครสมาชิกสำเร็จ')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'สมัครสมาชิกไม่สำเร็จ')
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await authApi.logout()
    },
    onSuccess: () => {
      // Remove tokens from cookies
      Cookies.remove('token')
      
      // Clear Redux state
      dispatch(clearCredentials())
      
      // Clear all queries
      queryClient.clear()
      
      toast.success('ออกจากระบบสำเร็จ')
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      Cookies.remove('token')
      dispatch(clearCredentials())
      queryClient.clear()
      toast.success('ออกจากระบบสำเร็จ')
    },
  })
}

// Profile query
export const useProfile = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to fetch profile')
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await authApi.changePassword(data)
      if (response.success) {
        return response
      }
      throw new Error('Failed to change password')
    },
    onSuccess: () => {
      toast.success('รหัสผ่านถูกเปลี่ยนแล้ว')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
    },
  })
}

// Initialize auth on app start
export const useInitializeAuth = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  return useQuery({
    queryKey: ['auth', 'initialize'],
    queryFn: async () => {
      const token = Cookies.get('token')
      
      if (!token) {
        dispatch(clearCredentials())
        return null
      }

      try {
        const response = await authApi.getProfile()
        if (response.success && response.data) {
          dispatch(setCredentials({ 
            user: response.data, 
            token
          }))
          return response.data
        }
        throw new Error('Invalid token')
      } catch (error) {
        Cookies.remove('token')
        dispatch(clearCredentials())
        throw error
      }
    },
    enabled: !isAuthenticated && !user,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity, // Keep in cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

// Clear auth error
export const useClearAuthError = () => {
  const dispatch = useAppDispatch()
  
  return () => {
    dispatch(clearError())
  }
}