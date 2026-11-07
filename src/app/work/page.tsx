import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import BodyClass from '@/components/BodyClass'
import { GitHubIcon } from '@/components/Icons'
import { experience } from '@/data/experience'

export const metadata: Metadata = pageMetadata({
  title: 'Work',
  description:
    'Selected work by Abhimanyu Vashisht: pricing and growth at BrowserStack, the VWO core platform with 96% less main-thread blocking, and AI chatbot services at Xane AI.',
  path: '/work/',
})

export default function WorkPage() {
  const projects = experience

  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="projects" aria-labelledby="projects-heading">
        <div className="container mx-auto">
          <h1 className="brick-title text-[2.2rem] text-center mb-3" id="projects-heading">
            Things I Didn&apos;t Break <span className="text-text-main">(Mostly)</span>
          </h1>
          <p className="text-text-secondary text-[1.05rem] text-center mb-8">
            A selection of things I&apos;ve built and shipped
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((project, index) => {
              const titleId = `proj-${index + 1}-title`
              return (
                <div key={project.title}>
                  <article
                    className="brick-card bg-card-bg border border-border-color rounded-2xl p-6 flex flex-col gap-3 h-full animate-brick-drop"
                    style={{ animationDelay: `${index * 120}ms` }}
                    aria-labelledby={titleId}
                  >
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="font-montserrat text-sm font-semibold text-text-main">{project.company}</span>
                      <span className="text-sm tabular-nums text-text-secondary">{project.year}</span>
                    </div>
                    <p className="font-display text-[1.35rem] leading-tight text-accent m-0">{project.highlight}</p>
                    <h2 className="font-montserrat text-[1.05rem] font-semibold text-text-main m-0 leading-snug" id={titleId}>
                      {project.title}
                    </h2>
                    <p className="text-[0.9rem] text-text-secondary leading-relaxed grow m-0">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded-md text-text-secondary border border-border-color">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-sm font-medium text-text-main no-underline mt-2 inline-flex items-center gap-1 transition-colors hover:text-accent hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View GitHub profile (opens in new tab)"
                      >
                        <GitHubIcon className="w-4 h-4" />GitHub
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
