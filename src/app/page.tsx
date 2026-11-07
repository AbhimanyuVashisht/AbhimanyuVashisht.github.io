'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import BodyClass from '@/components/BodyClass'
import LoadTime from '@/components/LoadTime'
import RobotPoster from '@/components/RobotPoster'
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/Icons'

const BrickBot = dynamic(() => import('@/components/BrickBot'), { ssr: false })

export default function HomePage() {
  // The 3D scene is heavy on phones; load it once the page has painted and the browser is idle.
  // Where it would cost more than it gives, or WebGL is missing, show a still picture instead.
  const [robot, setRobot] = useState<'waiting' | '3d' | 'still'>('waiting')
  useEffect(() => {
    if (prefersLightStart()) {
      const id = window.setTimeout(() => setRobot('still'), 0)
      return () => window.clearTimeout(id)
    }
    const show = () => setRobot('3d')
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
    { href: 'https://x.com/abhimanyu_av', Icon: XIcon, label: 'X' },
  ]

  // Sits in the bottom-right corner on wide screens and under the role line on narrow ones
  const tagline = 'font-montserrat text-sm font-medium text-text-secondary'

  return (
    <>
      <BodyClass className="page-hero" />
      <section className="relative isolate flex overflow-hidden pt-[calc(4rem+clamp(220px,40svh,340px))] lg:h-screen lg:min-h-svh lg:items-end lg:pt-16 fade-in" aria-labelledby="hero-heading" style={{ animationDelay: '0.2s' }}>
        {robot === '3d' && <BrickBot onUnavailable={() => setRobot('still')} />}
        {robot === 'still' && <RobotPoster />}
        {/* On phones the robot gets the band above the copy (the section's top padding); on desktop it stands beside it.
            The copy lets clicks through to the robot everywhere except its own links */}
        <div className="container pointer-events-none mx-auto pb-10 lg:pb-[7vh]">
          <div className="max-w-[640px] [&_a]:pointer-events-auto">
            <p className="mb-2 flex items-center gap-3 font-montserrat text-lg font-medium text-text-secondary">
              <Image
                className="h-12 w-12 rounded-full border border-border-color object-cover object-[center_15%]"
                src="/plugins/localCss/prof-img2.jpg"
                alt="Abhimanyu Vashisht"
                width={48}
                height={48}
                priority
              />
              Hello, I&apos;m
            </p>
            <h1 className="name-title mb-4 text-[clamp(2.4rem,7vw,5.5rem)]" id="hero-heading">
              Abhimanyu<br />Vashisht
            </h1>
            <p className="mb-4 font-montserrat text-[clamp(1rem,1.7vw,1.3rem)] font-medium leading-snug text-text-main">
              AI Product Engineer<br />Lead Software Engineer at BrowserStack
            </p>
            <p className={`${tagline} mb-4 lg:hidden`}>Engineering Intelligent, Scalable Solutions for Tomorrow</p>

            <div className="mb-5 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={`${link.label} profile`}
                  className="text-text-main no-underline transition-colors duration-200 hover:text-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/work" className="btn-brick">
                See my work
              </Link>
              <Link href="/contact" className="btn-outline">
                Get in touch
              </Link>
            </div>
            <LoadTime className="mt-6 lg:hidden" />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-[7vh] right-[5vw] hidden flex-col items-end gap-1 lg:flex">
          <p className={`${tagline} m-0`}>Engineering Intelligent, Scalable Solutions for Tomorrow</p>
          <LoadTime />
        </div>
      </section>
    </>
  )
}

// Data Saver, a 2G connection, or a device with little memory or few cores: skip the 3D scene
function prefersLightStart() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }
  if (nav.connection?.saveData) return true
  if (nav.connection?.effectiveType?.endsWith('2g')) return true
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return true
  return nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2
}
