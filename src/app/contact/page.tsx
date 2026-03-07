import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'
import { EnvelopeIcon, GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/Icons'

export const metadata: Metadata = {
  title: 'Contact — Abhimanyu Vashisht',
  description: 'Get in touch with Abhimanyu Vashisht — Lead Software Engineer.',
}

export default function ContactPage() {
  const contactCards = [
    {
      Icon: EnvelopeIcon,
      label: 'Email',
      value: 'Drop me a line',
      href: 'mailto:iamabhimanyuvashisht@gmail.com',
      external: false,
      ariaLabel: 'Send an email',
    },
    {
      Icon: LinkedInIcon,
      label: 'LinkedIn',
      value: "Let's connect",
      href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/',
      external: true,
      ariaLabel: 'LinkedIn profile (opens in new tab)',
    },
    {
      Icon: GitHubIcon,
      label: 'GitHub',
      value: 'See my code',
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
          <h2 className="font-montserrat font-bold text-[2rem] text-text-main text-center mb-3" id="contact-heading" style={{letterSpacing: '0.5px'}}>
            Get In Touch
          </h2>
          <p className="text-[1.1rem] text-text-secondary max-w-[520px] mx-auto mb-12 text-center">
            I'm always open to interesting conversations, collaborations, or opportunities. Feel free to reach out
            through any of these channels.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {contactCards.map((card) => (
              <div key={card.href}>
                <a
                  href={card.href}
                  className="bg-card-bg border border-border-color rounded-[20px] p-8 text-center transition-all duration-200 no-underline text-text-main flex flex-col items-center gap-3 h-full hover:-translate-y-1.5 hover:shadow-card hover:border-accent focus:outline-none focus-visible:outline-[var(--focus-outline)] focus-visible:outline-offset-[3px]"
                  aria-label={card.ariaLabel}
                  {...(card.external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <span className="text-accent block leading-none">
                    <card.Icon className="w-8 h-8" />
                  </span>
                  <span className="font-montserrat font-bold text-base text-text-main">{card.label}</span>
                  <span className="text-[0.88rem] text-text-secondary">{card.value}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
