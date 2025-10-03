'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme, initializeTheme } from '@/store/slices/themeSlice'

export function useTheme() {
  const dispatch = useAppDispatch()
  const { theme, isDark } = useAppSelector((state) => state.theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    dispatch(initializeTheme())
  }, [dispatch])

  const toggleTheme = () => {
    dispatch(setTheme(isDark ? 'light' : 'dark'))
  }

  const setLightTheme = () => {
    dispatch(setTheme('light'))
  }

  const setDarkTheme = () => {
    dispatch(setTheme('dark'))
  }

  const setSystemTheme = () => {
    dispatch(setTheme('system'))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return {
      theme: 'light',
      isDark: false,
      toggleTheme: () => {},
      setLightTheme: () => {},
      setDarkTheme: () => {},
      setSystemTheme: () => {},
      mounted: false,
    }
  }

  return {
    theme,
    isDark,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    mounted,
  }
}