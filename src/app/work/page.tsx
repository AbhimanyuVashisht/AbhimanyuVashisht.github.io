import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'

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
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="projects" aria-labelledby="projects-heading">
        <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
        <div className="container">
          <h2 className="font-montserrat font-bold text-[2rem] text-text-main text-center mb-1" id="projects-heading" style={{letterSpacing: '0.5px'}}>
            Things I Didn't Break <span style={{ color: 'var(--accent)' }}>(Mostly)</span>
          </h2>
          <p className="text-text-secondary text-[1.05rem] text-center mb-4">
            A selection of things I've built and shipped.
          </p>
          <div className="row g-4">
            {projects.map((project, index) => {
              const titleId = `proj-${index + 1}-title`
              return (
                <div key={project.title} className="col-md-6 col-lg-3">
                  <article className="bg-card-bg border border-border-color rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-card hover:border-accent h-100" tabIndex={0} aria-labelledby={titleId}>
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="font-montserrat text-[0.78rem] font-bold uppercase tracking-wider text-accent">{project.company}</span>
                      <span className="text-[0.78rem] text-text-secondary">{project.year}</span>
                    </div>
                    <h3 className="font-montserrat text-[1.05rem] font-bold text-text-main m-0 leading-snug" id={titleId}>
                      {project.title}
                    </h3>
                    <p className="text-[0.9rem] text-text-secondary leading-relaxed flex-grow m-0">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[0.72rem] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-accent-bg text-accent border border-border-color">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-[0.85rem] font-semibold text-accent no-underline mt-2 inline-block hover:text-text-main hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View GitHub profile (opens in new tab)"
                      >
                        <i className="fab fa-github me-1" aria-hidden="true" />GitHub
                      </a>
                    )}
                  </article>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
