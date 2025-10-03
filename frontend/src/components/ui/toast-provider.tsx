'use client'

import { Toaster } from 'react-hot-toast'
import { useAppSelector } from '@/store/hooks'

export function ToastProvider() {
  const { isDark } = useAppSelector((state) => state.theme)

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? 'hsl(var(--card))' : 'hsl(var(--card))',
          color: isDark ? 'hsl(var(--card-foreground))' : 'hsl(var(--card-foreground))',
          border: `1px solid ${isDark ? 'hsl(var(--border))' : 'hsl(var(--border))'}`,
          borderRadius: '8px',
          boxShadow: isDark 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        success: {
          iconTheme: {
            primary: 'hsl(var(--success))',
            secondary: 'hsl(var(--success-foreground))',
          },
        },
        error: {
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--destructive-foreground))',
          },
        },
        loading: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--primary-foreground))',
          },
        },
      }}
    />
  )
}