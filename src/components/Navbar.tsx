'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const rebind = (window as typeof window & { rebindNavbarScroll?: () => void }).rebindNavbarScroll
    if (typeof rebind === 'function') {
      rebind()
    }
  }, [pathname])

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

  const navbarClass = `navbar navbar-expand-lg fade-in fixed-top transition-all duration-300 ease-in-out ${pathname === '/' && !isScrolled ? 'bg-transparent shadow-none' : 'bg-bg-secondary shadow-navbar border-b border-border-color'}`

  return (
    <nav className={navbarClass} aria-label="Primary navigation" style={{ animationDelay: '0.1s', paddingTop: '0.35rem', paddingBottom: '0.35rem' }}>
      <div className="container">
        <Link className="navbar-brand font-montserrat font-bold text-text-main hover:text-accent transition-colors" href="/" aria-label="Abhimanyu Vashisht - Home">
          A V
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navLinks.map((link) => (
              <li key={link.href} className="nav-item">
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? '!text-accent font-semibold' : '!text-text-main hover:!text-accent'} transition-colors`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item d-flex align-items-center ms-2">
              <button
                id="theme-toggle"
                className="btn btn-sm rounded-full w-9 h-9 flex items-center justify-center !text-text-secondary hover:!text-accent transition-colors border-0"
                onClick={handleThemeToggle}
                aria-label="Toggle light/dark mode"
              >
                <span id="theme-icon" className={`fa ${isDark ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
