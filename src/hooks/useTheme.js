import { useEffect, useState } from 'react'

const THEME_KEY = 'cbm-theme'

export const useTheme = () => {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextTheme = stored || (prefersDark ? 'dark' : 'light')
    setThemeState(nextTheme)
    document.documentElement.dataset.theme = nextTheme
  }, [])

  const setTheme = (value) => {
    setThemeState(value)
    document.documentElement.dataset.theme = value
    window.localStorage.setItem(THEME_KEY, value)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}
