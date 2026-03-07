export default function Footer() {
  const socialLinks = [
    { href: 'https://github.com/AbhimanyuVashisht', icon: 'fab fa-github', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/', icon: 'fab fa-linkedin', label: 'LinkedIn' },
    { href: 'https://www.instagram.com/iamabhimanyuvashisht/', icon: 'fab fa-instagram', label: 'Instagram' },
    { href: 'https://twitter.com/abhimanyu_av', icon: 'fab fa-twitter', label: 'Twitter' },
  ]

  return (
    <footer className="py-3 fade-in bg-bg-secondary text-text-main min-h-[56px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]" aria-label="Site footer">
      <div className="container text-center">
        <div className="mb-2">
          {socialLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-text-secondary hover:text-accent transition-colors inline-block text-xl ${index < socialLinks.length - 1 ? 'me-2' : ''}`}
              aria-label={`${link.label} profile`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={link.icon} aria-hidden="true" />
            </a>
          ))}
        </div>
        <div>&copy; 2026 Abhimanyu Vashisht. All rights reserved.</div>
      </div>
    </footer>
  )
}
