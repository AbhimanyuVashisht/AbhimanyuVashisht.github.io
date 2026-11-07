import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import BodyClass from '@/components/BodyClass'
import { EnvelopeIcon, GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/Icons'

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Get in touch with Abhimanyu Vashisht, AI Product Engineer and Lead Software Engineer at BrowserStack, by email, LinkedIn, GitHub or Twitter.',
  path: '/contact/',
})

export default function ContactPage() {
  const contactCards = [
    {
      Icon: EnvelopeIcon,
      label: 'Email',
      value: 'abhimanyu@vashisht.tech',
      href: 'mailto:abhimanyu@vashisht.tech',
      external: false,
      ariaLabel: 'Send an email',
    },
    {
      Icon: LinkedInIcon,
      label: 'LinkedIn',
      value: 'iamabhimanyuvashisht',
      href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/',
      external: true,
      ariaLabel: 'LinkedIn profile (opens in new tab)',
    },
    {
      Icon: GitHubIcon,
      label: 'GitHub',
      value: 'AbhimanyuVashisht',
      href: 'https://github.com/AbhimanyuVashisht',
      external: true,
      ariaLabel: 'GitHub profile (opens in new tab)',
    },
    {
      Icon: TwitterIcon,
      label: 'Twitter',
      value: '@abhimanyu_av',
      href: 'https://twitter.com/abhimanyu_av',
      external: true,
      ariaLabel: 'Twitter profile (opens in new tab)',
    },
  ]

  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="contact" aria-labelledby="contact-heading">
        <div className="container mx-auto">
          <h1 className="brick-title text-[2.25rem] text-center mb-3" id="contact-heading">
            Get in touch
          </h1>
          <p className="text-[1.1rem] text-text-secondary max-w-[520px] mx-auto mb-8 text-center">
            I&apos;m always open to interesting conversations, collaborations, or opportunities. Feel free to reach out
            through any of these channels.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {contactCards.map((card) => (
              <div key={card.href}>
                <a
                  href={card.href}
                  className="group bg-card-bg border border-border-color rounded-xl p-6 text-center transition-colors duration-150 no-underline text-text-main flex flex-col items-center gap-2 h-full hover:bg-bg-accent focus:outline-hidden focus-visible:[outline:var(--focus-outline)] focus-visible:outline-offset-[3px]"
                  aria-label={card.ariaLabel}
                  {...(card.external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <span className="mb-2 block leading-none text-text-secondary transition-colors group-hover:text-text-main">
                    <card.Icon className="w-6 h-6" />
                  </span>
                  <span className="font-montserrat font-medium text-base text-text-main">{card.label}</span>
                  <span className="text-sm text-text-secondary [overflow-wrap:anywhere]">{card.value}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
