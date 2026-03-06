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
    <section className="pt-24 pb-12 px-4 fade-in">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Things I Didn't Break <span className="text-blue-500">(Mostly)</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A selection of things I've built and shipped.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <article
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition hover:shadow-lg"
              tabIndex={0}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-blue-500 uppercase">
                  {project.company}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {project.year}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">{project.title}</h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-semibold"
                  aria-label="View GitHub profile (opens in new tab)"
                >
                  <i className="fab fa-github" />
                  GitHub
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
