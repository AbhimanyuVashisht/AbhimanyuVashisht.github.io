'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleTheme } from '@/store/themeSlice'

export default function Navbar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.theme.isDark)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDark])

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' },
  ]

  const isHome = pathname === '/'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 fade-in ${
        isScrolled || !isHome
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
      style={{ animationDelay: '0.1s' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl hover:opacity-80 transition">
            A V
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-blue-500 ${
                  pathname === link.href ? 'text-blue-500 font-semibold' : ''
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleThemeToggle}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <i className="fas fa-sun text-yellow-400" />
              ) : (
                <i className="fas fa-moon text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 transition hover:text-blue-500 ${
                  pathname === link.href ? 'text-blue-500 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleThemeToggle}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <i className="fas fa-sun text-yellow-400" />
              ) : (
                <i className="fas fa-moon text-gray-700" />
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
