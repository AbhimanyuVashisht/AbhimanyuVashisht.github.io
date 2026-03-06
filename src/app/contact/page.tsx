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
    <section className="pt-24 pb-12 px-4 fade-in">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            I'm always open to interesting conversations, collaborations, or opportunities. 
            Feel free to reach out through any of these channels.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {contactCards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition hover:shadow-lg text-center group"
                aria-label={card.external ? `${card.label} profile (opens in new tab)` : card.label}
                {...(card.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <div className="text-4xl text-blue-500 mb-3 group-hover:scale-110 transition">
                  <i className={card.icon} aria-hidden="true" />
                </div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {card.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {card.value}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
