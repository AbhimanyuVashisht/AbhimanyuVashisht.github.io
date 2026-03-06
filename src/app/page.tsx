'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProfileVisual from '@/components/ProfileVisual'

export default function HomePage() {
  const [typewriterText, setTypewriterText] = useState('')
  const fullText = 'Engineering Intelligent, Scalable Solutions for Tomorrow'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 40)
    return () => clearInterval(timer)
  }, [])

  const socialLinks = [
    { href: 'https://github.com/AbhimanyuVashisht', icon: 'fab fa-github', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/', icon: 'fab fa-linkedin', label: 'LinkedIn' },
    { href: 'https://www.instagram.com/iamabhimanyuvashisht/', icon: 'fab fa-instagram', label: 'Instagram' },
    { href: 'https://twitter.com/abhimanyu_av', icon: 'fab fa-twitter', label: 'Twitter' },
  ]

  return (
    <>
      <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
      <section className="hero-section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'center',
            minHeight: '100%'
          }}
          className="hero-row">
            {/* Content */}
            <div style={{ textAlign: 'left' }}>
              <p className="hero-eyebrow">Lead Software Engineer</p>
              <h1 className="hero-name">
                Abhimanyu<br />Vashisht
              </h1>
              <p className="hero-motto">Working on myself · for myself · by myself</p>
              <p className="hero-subtitle" role="status" aria-live="polite" aria-atomic="true">
                {typewriterText}
              </p>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-label={`${link.label} profile`}
                    className="hero-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className={link.icon} aria-hidden="true" />
                  </a>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <Link href="/about" className="btn-hero-primary">
                  About Me
                </Link>
                <Link href="/contact" className="btn-hero-outline">
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Profile Visual */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ProfileVisual />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
