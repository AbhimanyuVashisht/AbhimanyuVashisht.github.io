'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      const navbar = document.querySelector('.navbar-themed')
      if (navbar) {
        if (isScrolled || pathname !== '/') {
          navbar.classList.add('navbar-scrolled')
          navbar.classList.remove('navbar-transparent')
        } else {
          navbar.classList.add('navbar-transparent')
          navbar.classList.remove('navbar-scrolled')
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolled, pathname])

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark'
    setIsDark(theme === 'dark')
  }, [])

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

  return (
    <nav className={`navbar navbar-themed ${pathname === '/' && !isScrolled ? 'navbar-transparent' : 'navbar-scrolled'}`}>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between" style={{ height: '64px' }}>
          <Link href="/" className="navbar-brand" style={{ fontWeight: 700, fontSize: '1.2rem' }}>
            A V
          </Link>

          {/* Desktop Menu */}
          <div className="d-none d-md-flex align-items-center" style={{ gap: '2rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleThemeToggle}
              className="btn btn-link p-0"
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--border-color)',
                borderRadius: '50%',
              }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <i className="fas fa-sun" style={{ color: '#f7c948' }} />
              ) : (
                <i className="fas fa-moon" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="d-md-none btn btn-link p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} fa-lg`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="d-md-none py-3" style={{ borderTop: '1px solid var(--border-color)' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link d-block ${pathname === link.href ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
