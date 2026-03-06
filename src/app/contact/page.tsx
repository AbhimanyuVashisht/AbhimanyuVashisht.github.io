import type { Metadata } from 'next'

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
    },
    {
      icon: 'fab fa-linkedin',
      label: 'LinkedIn',
      value: "Let's connect",
      href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/',
      external: true,
    },
    {
      icon: 'fab fa-github',
      label: 'GitHub',
      value: 'See my code',
      href: 'https://github.com/AbhimanyuVashisht',
      external: true,
    },
    {
      icon: 'fab fa-twitter',
      label: 'Twitter',
      value: '@abhimanyu_av',
      href: 'https://twitter.com/abhimanyu_av',
      external: true,
    },
  ]

  return (
    <section className="page-fill">
      <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
            Get In Touch
          </h1>
          <p className="contact-section-intro" style={{ marginBottom: '3rem' }}>
            I'm always open to interesting conversations, collaborations, or opportunities. 
            Feel free to reach out through any of these channels.
          </p>

          <div className="row">
            {contactCards.map((card) => (
              <div key={card.href} className="col-md-6 col-lg-3 mb-4">
                <a
                  href={card.href}
                  className="contact-card"
                  aria-label={card.external ? `${card.label} profile (opens in new tab)` : card.label}
                  {...(card.external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <span className="contact-card-icon">
                    <i className={card.icon} aria-hidden="true" />
                  </span>
                  <div className="contact-card-label">
                    {card.label}
                  </div>
                  <div className="contact-card-value">
                    {card.value}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
