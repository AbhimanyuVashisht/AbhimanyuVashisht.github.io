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
    <section
      className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 fade-in"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Visual */}
          <div className="flex justify-center md:justify-end order-1 md:order-none">
            <ProfileVisual />
          </div>

          {/* Content */}
          <div className="text-center md:text-left order-2">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-2">
              Lead Software Engineer
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 font-montserrat">
              Abhimanyu<br />Vashisht
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Working on myself · for myself · by myself
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 min-h-[60px]" role="status">
              {typewriterText}
            </p>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start space-x-4 mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={`${link.label} profile`}
                  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-110 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={link.icon} aria-hidden="true" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/about"
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
              >
                About Me
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-lg transition"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
