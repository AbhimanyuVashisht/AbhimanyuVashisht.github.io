'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import BodyClass from '@/components/BodyClass'
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '@/components/Icons'

const BrickBot = dynamic(() => import('@/components/BrickBot'), { ssr: false })

export default function HomePage() {
  // The 3D scene is heavy on phones; load it once the page has painted and the browser is idle
  const [showBot, setShowBot] = useState(false)
  useEffect(() => {
    const show = () => setShowBot(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(show, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(show, 1200)
    return () => window.clearTimeout(id)
  }, [])

  const socialLinks = [
    { href: 'https://github.com/AbhimanyuVashisht', Icon: GitHubIcon, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/', Icon: LinkedInIcon, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/iamabhimanyuvashisht/', Icon: InstagramIcon, label: 'Instagram' },
    { href: 'https://twitter.com/abhimanyu_av', Icon: TwitterIcon, label: 'Twitter' },
  ]

  // Sits in the bottom-right corner on wide screens and under the role line on narrow ones
  const tagline = 'font-montserrat text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-text-main'

  return (
    <>
      <BodyClass className="page-hero" />
      <section className="relative isolate flex min-h-svh items-end overflow-hidden pt-[63px] lg:h-screen fade-in" aria-labelledby="hero-heading" style={{ animationDelay: '0.2s' }}>
        {showBot && <BrickBot />}
        {/* The copy lets clicks through to the robot everywhere except its own links */}
        <div className="container pointer-events-none mx-auto px-5 pb-[7vh] lg:px-0">
          <div className="max-w-[640px] [&_a]:pointer-events-auto">
            <p className="mb-2 flex items-center gap-3 font-montserrat text-[1.15rem] font-bold italic text-text-main">
              <Image
                className="h-12 w-12 rounded-full border-2 border-accent object-cover object-[center_15%]"
                src="/plugins/localCss/prof-img2.jpg"
                alt="Abhimanyu Vashisht"
                width={48}
                height={48}
                priority
              />
              Hello, I&apos;m
            </p>
            <h1 className="brick-title mb-4 text-[clamp(2.4rem,7.4vw,6rem)]" id="hero-heading">
              Abhimanyu<br />Vashisht
            </h1>
            <p className="mb-4 font-montserrat text-[clamp(1rem,1.7vw,1.3rem)] font-bold leading-snug text-text-main">
              AI Product Engineer.<br />Lead Software Engineer at BrowserStack.
            </p>
            <p className={`${tagline} mb-4 lg:hidden`}>Engineering Intelligent, Scalable Solutions for Tomorrow</p>

            <div className="mb-5 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={`${link.label} profile`}
                  className="text-text-main no-underline transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.Icon className="h-[1.3rem] w-[1.3rem]" />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/work" className="btn-brick">
                See My Work
              </Link>
              <Link href="/contact" className="btn-outline">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
        <p className={`${tagline} pointer-events-none absolute bottom-[7vh] right-[5vw] m-0 hidden lg:block`}>
          Engineering Intelligent, Scalable Solutions for Tomorrow
        </p>
      </section>
    </>
  )
}
