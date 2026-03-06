import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — Abhimanyu Vashisht',
  description: 'Work and projects by Abhimanyu Vashisht — Lead Software Engineer at BrowserStack.',
}

export default function WorkPage() {
  const projects = [
    {
      company: 'BrowserStack',
      year: '2022 – present',
      title: 'Pricing & Growth Platform',
      description:
        'Improved PSI metrics for the pricing page, boosting purchase conversion. Engineered revenue growth initiatives through scalable pricing components. Streamlined the product release pipeline and enhanced Pro feature workflows.',
      tags: ['React', 'Ruby on Rails', 'Node.js', 'Karpenter', 'AWS'],
    },
    {
      company: 'Wingify · VWO',
      year: '2019 – 2022',
      title: 'VWO Core Platform',
      description:
        "Built the industry's 1st A/B testing capability inside Shadow DOM. Reduced customer issues by 80%. Redesigned the event-driven JS library architecture, cutting main-thread blocking by 96%. Improved Core JS library performance by 50%.",
      tags: ['JavaScript', 'TypeScript', 'Event-driven', 'Web Vitals'],
    },
    {
      company: 'Xane AI',
      year: '2018 – 2019',
      title: 'Xane HR & CX Platform',
      description:
        'Developed AI-centric HR & CX products including Analytics Dashboards and Conversational Bot UIs. Built microservices for deep learning chatbot models and designed the full-stack product architecture.',
      tags: ['Python', 'React', 'Keras', 'TensorFlow', 'NLP'],
    },
    {
      company: 'Personal',
      year: '2015 – present',
      title: 'Open Source & Side Projects',
      description:
        'Exploring Rust systems programming, distributed systems, and cloud-native tooling. Passionate about algorithms, data structures, and developer experience — actively contributing to open source since 2015.',
      tags: ['Rust', 'Node.js', 'TypeScript', 'Docker', 'AWS'],
      link: 'https://github.com/AbhimanyuVashisht',
    },
  ]

  return (
    <section className="page-fill">
      <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-heading" style={{ fontSize: '2.5rem' }}>
            Things I Didn't Break <span style={{ color: 'var(--accent)' }}>(Mostly)</span>
          </h1>
          <p className="contact-section-intro">
            A selection of things I've built and shipped.
          </p>
        </div>

        <div className="row" style={{ marginBottom: '2rem' }}>
          {projects.map((project, index) => (
            <div key={index} className="col-lg-6 col-md-6 mb-4">
              <article className="project-card" tabIndex={0}>
                <div className="project-card-header">
                  <span className="project-company">{project.company}</span>
                  <span className="project-year">{project.year}</span>
                </div>

                <h3 className="project-title">{project.title}</h3>

                <p className="project-desc">
                  {project.description}
                </p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                    aria-label="View GitHub profile (opens in new tab)"
                  >
                    <i className="fab fa-github" /> GitHub
                  </a>
                )}
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
