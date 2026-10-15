import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'
import { GitHubIcon } from '@/components/Icons'
import { experience } from '@/data/experience'

export const metadata: Metadata = {
  title: 'Work — Abhimanyu Vashisht',
  description: 'Work and projects by Abhimanyu Vashisht — Lead Software Engineer at BrowserStack.',
}

export default function WorkPage() {
  const projects = experience

  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="projects" aria-labelledby="projects-heading">
        <div className="container mx-auto">
          <h2 className="brick-title text-[2.2rem] text-center mb-3" id="projects-heading">
            Things I Didn&apos;t Break <span className="text-text-main">(Mostly)</span>
          </h2>
          <p className="text-text-secondary text-[1.05rem] text-center mb-8">
            A selection of things I&apos;ve built and shipped.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((project, index) => {
              const titleId = `proj-${index + 1}-title`
              return (
                <div key={project.title}>
                  <article
                    className="brick-card bg-card-bg border border-border-color rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-card hover:border-accent h-full animate-brick-drop"
                    style={{ animationDelay: `${index * 120}ms` }}
                    tabIndex={0}
                    aria-labelledby={titleId}
                  >
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="font-montserrat text-[0.78rem] font-bold uppercase tracking-wider text-accent">{project.company}</span>
                      <span className="text-[0.78rem] text-text-secondary">{project.year}</span>
                    </div>
                    <p className="font-display text-[1.35rem] leading-tight text-accent m-0">{project.highlight}</p>
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
                        <GitHubIcon className="w-4 h-4 mr-1 inline-block" />GitHub
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
