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
      <section className="hero-section fade-in" aria-labelledby="hero-heading" style={{ animationDelay: '0.2s' }}>
        <div className="container">
          <div className="row align-items-center hero-row">
            {/* Profile Visual - LEFT SIDE */}
            <div className="col-lg-5 col-md-5 text-center mb-5 mb-md-0">
              <ProfileVisual />
            </div>

            {/* Content - RIGHT SIDE */}
            <div className="col-lg-7 col-md-7 text-center text-md-start">
              <p className="hero-eyebrow">Lead Software Engineer</p>
              <h1 className="hero-name" id="hero-heading">
                Abhimanyu<br />Vashisht
              </h1>
              <p className="hero-motto">Working on myself &middot; for myself &middot; by myself</p>
              <p className="hero-subtitle mb-4">
                <span role="status" aria-live="polite" aria-atomic="false">
                  {typewriterText}
                </span>
              </p>

              {/* Social Links */}
              <div className="hero-socials mb-4">
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
              <div className="hero-cta">
                <Link href="/about" className="btn btn-hero-primary me-3">
                  About Me
                </Link>
                <Link href="/contact" className="btn btn-hero-outline">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
