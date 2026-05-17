import Link from 'next/link'
import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'
import { AcademicCapIcon, CpuChipIcon, UsersIcon } from '@/components/Icons'

export const metadata: Metadata = {
  title: 'About — Abhimanyu Vashisht',
  description: 'About Abhimanyu Vashisht — Lead Software Engineer, Full-Stack Developer, and AI Enthusiast.',
}

export default function AboutPage() {
  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="about" aria-labelledby="about-heading">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-montserrat font-bold text-[2rem] text-text-main mb-3" id="about-heading" style={{letterSpacing: '0.5px'}}>
                Hey, I&apos;m Abhimanyu.
              </h1>
              <p className="mb-2" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                I&apos;m a Lead Software Engineer who genuinely loves building things on the web. JavaScript and Python are my
                happy place — I&apos;ve been writing them for over 7 years and I&apos;m still finding new ways they surprise me.
              </p>
              <p className="mb-2" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                By day, I work at <b style={{ color: 'var(--text-main)' }}>BrowserStack</b> on growth and pricing
                infrastructure — thinking about performance, scalability, and reliability, and how software can quietly
                make a business run better. By night, you&apos;ll probably find me tinkering with a side project, digging into
                an algorithm problem, or exploring whatever corner of AI/ML has caught my attention that week.
              </p>
              <p className="mb-3" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                I believe the best engineers are curious first. I&apos;ve built art-sharing platforms, real-time chat apps,
                IoT train systems, and sentiment classifiers — not because I had to, but because I wanted to know if I
                could.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-left mb-4">
                <div>
                  <span className="flex items-center gap-2 text-sm text-text-main">
                    <AcademicCapIcon className="w-4 h-4 text-accent" />
                    B.Tech (CSE), Jaypee Institute of Information Technology
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-2 text-sm text-text-main">
                    <CpuChipIcon className="w-4 h-4 text-accent" />
                    Deep Learning Specialization — deeplearning.ai
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-2 text-sm text-text-main">
                    <UsersIcon className="w-4 h-4 text-accent" />
                    President, Rotaract Club of Delhi South (2021–22)
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/work" className="bg-accent !text-white border-2 border-accent rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-transparent hover:!text-accent hover:-translate-y-0.5 no-underline inline-block">
                  See My Work
                </Link>
                <Link href="/contact" className="bg-transparent !text-text-main border-2 border-border-color rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-accent hover:!text-white hover:border-accent hover:-translate-y-0.5 no-underline inline-block">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
      </section>
    </>
  )
}
