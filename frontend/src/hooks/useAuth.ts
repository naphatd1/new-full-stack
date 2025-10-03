import { useAuthState, useLogin, useRegister, useLogout, useInitializeAuth } from './api/useAuth'
import { RegisterForm } from '@/types'

// Main auth hook that provides the same interface as the old AuthContext
export function useAuth() {
  const { user, isAuthenticated, isLoading, error } = useAuthState()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const initQuery = useInitializeAuth()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password })
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (data: RegisterForm): Promise<boolean> => {
    try {
      // Remove confirmPassword before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...registerData } = data
      await registerMutation.mutateAsync(registerData)
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = () => {
    logoutMutation.mutate()
  }

  return {
    user,
    // Remove initQuery.isLoading to prevent hydration issues
    loading: isLoading || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
    isAuthenticated,
    error: error || loginMutation.error?.message || registerMutation.error?.message || initQuery.error?.message,
    // Separate initialization loading
    initializing: initQuery.isLoading,
  }
}