'use client'

import { useEffect } from 'react'

export default function ThemeInitializer() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const storedTheme = localStorage.getItem('theme')
      const effectiveTheme = !storedTheme || storedTheme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : storedTheme
      document.documentElement.setAttribute('data-theme', effectiveTheme)
    }

    const handleSystemThemeChange = () => {
      const storedTheme = localStorage.getItem('theme')
      if (!storedTheme || storedTheme === 'system') {
        applyTheme()
      }
    }

    applyTheme()
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  return null
}
