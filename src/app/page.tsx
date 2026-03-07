'use client'

import Link from 'next/link'
import BodyClass from '@/components/BodyClass'
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
      <BodyClass className="page-hero" />
      <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
      <section className="min-h-screen bg-bg-main flex items-center px-0 pt-[63px] pb-8 box-border md:h-screen md:overflow-hidden fade-in" aria-labelledby="hero-heading" style={{ animationDelay: '0.2s' }}>
        <div className="container">
          <div className="row align-items-center min-h-[60vh] max-md:!grid max-md:!grid-cols-1 max-md:!gap-6">
            {/* Profile Visual - LEFT SIDE */}
            <div className="col-lg-5 col-md-5 text-center mb-5 mb-md-0">
              <ProfileVisual />
            </div>

            {/* Content - RIGHT SIDE */}
            <div className="col-lg-7 col-md-7 text-center text-md-start">
              <p className="font-montserrat text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-accent mb-3">Lead Software Engineer</p>
              <h1 className="font-montserrat text-[3.8rem] md:text-[2.8rem] max-md:text-[2.1rem] font-extrabold leading-tight tracking-tight text-text-main mb-2" id="hero-heading">
                Abhimanyu<br />Vashisht
              </h1>
              <p className="text-[0.75rem] font-semibold tracking-[0.18em] uppercase text-text-secondary mb-4">Working on myself &middot; for myself &middot; by myself</p>
              <p className="text-base text-accent font-medium min-h-[1.6em] mb-0 mt-4">
                <span role="status" aria-live="polite" aria-atomic="false">
                  {typewriterText}
                </span>
              </p>

              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start mt-2 mb-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-label={`${link.label} profile`}
                    className="text-text-secondary text-[1.3rem] transition-all duration-200 hover:text-accent hover:-translate-y-0.5 no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className={link.icon} aria-hidden="true" />
                  </a>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-9">
                <Link href="/about" className="bg-accent text-white border-2 border-accent rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-transparent hover:text-accent hover:-translate-y-0.5 no-underline inline-block me-3">
                  About Me
                </Link>
                <Link href="/contact" className="bg-transparent text-text-main border-2 border-border-color rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-0.5 no-underline inline-block">
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
