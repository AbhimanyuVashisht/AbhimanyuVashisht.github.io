export default function Footer() {
  const socialLinks = [
    { href: 'https://github.com/AbhimanyuVashisht', icon: 'fab fa-github', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/iamabhimanyuvashisht/', icon: 'fab fa-linkedin', label: 'LinkedIn' },
    { href: 'https://www.instagram.com/iamabhimanyuvashisht/', icon: 'fab fa-instagram', label: 'Instagram' },
    { href: 'https://twitter.com/abhimanyu_av', icon: 'fab fa-twitter', label: 'Twitter' },
  ]

  return (
    <footer className="py-6 fade-in" aria-label="Site footer">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center space-x-4 mb-3">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-label={`${link.label} profile`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-500 transition"
              >
                <i className={link.icon} aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            &copy; 2026 Abhimanyu Vashisht. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
