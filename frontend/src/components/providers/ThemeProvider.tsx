'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { initializeTheme, hydrate } from '@/store/slices/themeSlice'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Hydrate theme state after component mounts
    dispatch(hydrate())
    dispatch(initializeTheme())
    setMounted(true)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        // Temporarily disable transitions during system theme change
        document.body.classList.add('theme-changing')
        dispatch(initializeTheme())
        
        // Re-enable transitions after a short delay
        setTimeout(() => {
          document.body.classList.remove('theme-changing')
        }, 50)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [dispatch, theme])

  // Re-initialize when theme changes to system
  useEffect(() => {
    if (mounted && theme === 'system') {
      dispatch(initializeTheme())
    }
  }, [dispatch, theme, mounted])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}