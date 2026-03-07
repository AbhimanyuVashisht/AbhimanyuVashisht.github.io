'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@/components/Icons'

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    const theme = localStorage.getItem('theme') || 'dark'
    setIsDark(theme === 'dark')
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleThemeToggle = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setIsDark(!isDark)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

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
                <button
                  id="theme-toggle"
                  className="rounded-full w-9 h-9 flex items-center justify-center text-text-secondary hover:text-accent transition-colors border border-border-color bg-transparent"
                  onClick={handleThemeToggle}
                  aria-label="Toggle light/dark mode"
                >
                  {isDark ? (
                    <MoonIcon className="w-4 h-4" />
                  ) : (
                    <SunIcon className="w-4 h-4 theme-icon--sun" />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
