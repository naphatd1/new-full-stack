'use client'

import { Moon, Sun } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme } from '@/store/slices/themeSlice'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const dispatch = useAppDispatch()
  const { isDark } = useAppSelector((state) => state.theme)

  const toggleTheme = () => {
    // Add a small delay to make the transition feel more responsive
    requestAnimationFrame(() => {
      dispatch(setTheme(isDark ? 'light' : 'dark'))
    })
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-md"
    >
      <div className="relative">
        <Sun 
          className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}