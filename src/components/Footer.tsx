'use client'

import { usePathname } from 'next/navigation'
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '@/components/Icons'

export default function Footer() {
  const pathname = usePathname()

  // Hide footer on homepage
  if (pathname === '/') {
    return null
  }

  const socialLinks = [
    { href: 'https://github.com/AbhimanyuVashisht', Icon: GitHubIcon, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/', Icon: LinkedInIcon, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/iamabhimanyuvashisht/', Icon: InstagramIcon, label: 'Instagram' },
    { href: 'https://twitter.com/abhimanyu_av', Icon: TwitterIcon, label: 'Twitter' },
  ]

  return (
    <footer className="py-4 fade-in bg-bg-secondary text-text-main border-t border-border-color" aria-label="Site footer">
      <div className="container mx-auto text-center">
        <div className="mb-2 flex justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-main transition-colors inline-block"
              aria-label={`${link.label} profile`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <link.Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <div className="text-sm text-text-secondary">&copy; 2026 Abhimanyu Vashisht</div>
      </div>
    </footer>
  )
}
