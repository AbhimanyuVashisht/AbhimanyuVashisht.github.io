import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'

export const metadata: Metadata = {
  title: 'Contact — Abhimanyu Vashisht',
  description: 'Get in touch with Abhimanyu Vashisht — Lead Software Engineer.',
}

export default function ContactPage() {
  const contactCards = [
    {
      icon: 'fas fa-envelope',
      label: 'Email',
      value: 'Drop me a line',
      href: 'mailto:iamabhimanyuvashisht@gmail.com',
      external: false,
      ariaLabel: 'Send an email',
    },
    {
      icon: 'fab fa-linkedin',
      label: 'LinkedIn',
      value: "Let's connect",
      href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/',
      external: true,
      ariaLabel: 'LinkedIn profile (opens in new tab)',
    },
    {
      icon: 'fab fa-github',
      label: 'GitHub',
      value: 'See my code',
      href: 'https://github.com/AbhimanyuVashisht',
      external: true,
      ariaLabel: 'GitHub profile (opens in new tab)',
    },
    {
      icon: 'fab fa-twitter',
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
        <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
        <div className="container">
          <h2 className="font-montserrat font-bold text-[2rem] text-text-main text-center mb-3" id="contact-heading" style={{letterSpacing: '0.5px'}}>
            Get In Touch
          </h2>
          <p className="text-[1.1rem] text-text-secondary max-w-[520px] mx-auto mb-12 text-center">
            I'm always open to interesting conversations, collaborations, or opportunities. Feel free to reach out
            through any of these channels.
          </p>
          <div className="row g-4 justify-content-center mb-5">
            {contactCards.map((card) => (
              <div key={card.href} className="col-6 col-md-3">
                <a
                  href={card.href}
                  className="bg-card-bg border border-border-color rounded-[20px] p-8 text-center transition-all duration-200 no-underline text-text-main flex flex-col items-center gap-3 h-100 hover:-translate-y-1.5 hover:shadow-card hover:border-accent focus:outline-none focus-visible:outline-[var(--focus-outline)] focus-visible:outline-offset-[3px]"
                  aria-label={card.ariaLabel}
                  {...(card.external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <span className="text-[2rem] text-accent block leading-none">
                    <i className={card.icon} aria-hidden="true" />
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
