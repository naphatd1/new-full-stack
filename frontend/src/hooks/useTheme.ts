import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme, type Theme } from '@/store/slices/themeSlice'

export function useTheme() {
  const dispatch = useAppDispatch()
  const { theme, isDark } = useAppSelector((state) => state.theme)

  const changeTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme))
  }

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    dispatch(setTheme(newTheme))
  }

  return {
    theme,
    isDark,
    changeTheme,
    toggleTheme,
    isLight: !isDark,
    isSystem: theme === 'system',
  }
}