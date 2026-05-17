'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@/components/Icons'

type ThemeMode = 'system' | 'dark' | 'light'

export default function Navbar() {
  const LONG_PRESS_MS = 550
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')
  const [isDarkEffective, setIsDarkEffective] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const longPressTimerRef = useRef<number | null>(null)
  const longPressTriggeredRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const forceOpaque = document.body.classList.contains('page-fill')
      setIsScrolled(forceOpaque || window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const syncThemeState = () => {
      const storedTheme = localStorage.getItem('theme') as ThemeMode | null
      const mode: ThemeMode = !storedTheme || storedTheme === 'system' ? 'system' : storedTheme
      const effectiveTheme = mode === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : mode

      setThemeMode(mode)
      setIsDarkEffective(effectiveTheme === 'dark')
    }

    const handleSystemThemeChange = () => {
      const storedTheme = localStorage.getItem('theme')
      if (!storedTheme || storedTheme === 'system') {
        syncThemeState()
      }
    }

    syncThemeState()
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  const handleThemeToggle = () => {
    const nextMode: ThemeMode = isDarkEffective ? 'light' : 'dark'
    const nextTheme = nextMode

    setThemeMode(nextMode)
    setIsDarkEffective(nextTheme === 'dark')
    localStorage.setItem('theme', nextMode)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  const setSystemThemeMode = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const nextTheme = mediaQuery.matches ? 'dark' : 'light'

    setThemeMode('system')
    setIsDarkEffective(nextTheme === 'dark')
    localStorage.setItem('theme', 'system')
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  const handleThemePressStart = () => {
    longPressTriggeredRef.current = false
    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true
      setSystemThemeMode()
    }, LONG_PRESS_MS)
  }

  const clearThemePressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleThemePressEnd = () => {
    clearThemePressTimer()
  }

  const handleThemeClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false
      return
    }

    handleThemeToggle()
  }

  const themeToggleLabel = `Theme mode: ${themeMode}. Click to toggle dark/light. Long press to use system theme.`

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' },
  ]

  const navbarClass = `fade-in fixed top-0 left-0 right-0 z-[1030] transition-all duration-300 ease-in-out ${pathname === '/' && !isScrolled ? 'bg-transparent shadow-none' : 'bg-bg-secondary shadow-navbar border-b border-border-color'}`

  return (
    <nav className={navbarClass} aria-label="Primary navigation" style={{ animationDelay: '0.1s' }}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link className="font-montserrat font-bold text-text-main hover:text-accent transition-colors flex-shrink-0" href="/">
            <span aria-hidden="true">A V</span>
            <span className="sr-only">Abhimanyu Vashisht - Home</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border-color text-text-main hover:text-accent hover:border-accent transition-colors flex-shrink-0"
            aria-controls="navbar-menu"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
            </span>
          </button>

          {/* Desktop Menu & Theme (always visible on desktop, toggled on mobile) */}
          <div className={`${isMenuOpen ? 'absolute top-full left-0 right-0 bg-bg-secondary border-b border-border-color md:static md:border-0 md:bg-transparent' : 'hidden md:block'}`}>
            <ul id="navbar-menu" className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 md:ml-auto py-3 md:py-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${pathname === link.href ? 'text-accent font-semibold' : 'text-text-main hover:text-accent'} transition-colors block py-1`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center">
                <div className="relative group">
                  <button
                    id="theme-toggle"
                    className="rounded-full w-9 h-9 flex items-center justify-center text-text-secondary hover:text-accent transition-colors border border-border-color bg-transparent"
                    onClick={handleThemeClick}
                    onMouseDown={handleThemePressStart}
                    onMouseUp={handleThemePressEnd}
                    onMouseLeave={handleThemePressEnd}
                    onTouchStart={handleThemePressStart}
                    onTouchEnd={handleThemePressEnd}
                    onTouchCancel={handleThemePressEnd}
                    aria-label={themeToggleLabel}
                    title={themeToggleLabel}
                    aria-describedby="theme-toggle-hint"
                  >
                    {themeMode === 'system' ? (
                      <ComputerDesktopIcon className="w-4 h-4" />
                    ) : isDarkEffective ? (
                      <MoonIcon className="w-4 h-4" />
                    ) : (
                      <SunIcon className="w-4 h-4 theme-icon--sun" />
                    )}
                  </button>
                  <span
                    id="theme-toggle-hint"
                    className="pointer-events-none hidden md:block absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded border border-border-color bg-bg-secondary px-2 py-1 text-[11px] text-text-secondary opacity-0 shadow-navbar transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    Long press for system
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
