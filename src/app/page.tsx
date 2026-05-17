'use client'

import Link from 'next/link'
import BodyClass from '@/components/BodyClass'
import { useEffect, useState } from 'react'
import ProfileVisual from '@/components/ProfileVisual'
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '@/components/Icons'

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
    { href: 'https://github.com/AbhimanyuVashisht', Icon: GitHubIcon, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/', Icon: LinkedInIcon, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/iamabhimanyuvashisht/', Icon: InstagramIcon, label: 'Instagram' },
    { href: 'https://twitter.com/abhimanyu_av', Icon: TwitterIcon, label: 'Twitter' },
  ]

  return (
    <>
      <BodyClass className="page-hero" />
      <section className="min-h-screen bg-bg-main flex items-center px-0 pt-[63px] pb-8 box-border md:h-screen md:overflow-hidden fade-in" aria-labelledby="hero-heading" style={{ animationDelay: '0.2s' }}>
        <div className="container mx-auto">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center min-h-[60vh]">
            {/* Profile Visual - LEFT SIDE */}
            <div className="lg:col-span-5 text-center mb-5 lg:mb-0">
              <ProfileVisual />
            </div>

            {/* Content - RIGHT SIDE */}
            <div className="lg:col-span-7 text-center lg:text-left">
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
                    <link.Icon className="w-[1.3rem] h-[1.3rem]" />
                  </a>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-3">
                <Link href="/about" className="bg-accent-strong !text-white border-2 border-accent-strong rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-transparent hover:!text-accent hover:border-accent-strong hover:-translate-y-0.5 no-underline inline-block">
                  About Me
                </Link>
                <Link href="/contact" className="bg-transparent !text-text-main border-2 border-border-color rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-accent hover:!text-white hover:border-accent hover:-translate-y-0.5 no-underline inline-block">
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
