import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import BodyClass from '@/components/BodyClass'
import { AcademicCapIcon, CpuChipIcon, UsersIcon } from '@/components/Icons'

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'About Abhimanyu Vashisht: AI Product Engineer and Lead Software Engineer at BrowserStack, working on growth, pricing and performance, and exploring AI and ML.',
  path: '/about/',
})

export default function AboutPage() {
  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="about" aria-labelledby="about-heading">
        <div className="container mx-auto">
          <div className="max-w-[640px] mx-auto">
              <h1 className="brick-title text-[2.25rem] mb-6" id="about-heading">
                Hey, I&apos;m Abhimanyu
              </h1>
              <p className="mb-4 text-[1.05rem] text-text-secondary">
                I&apos;m a Lead Software Engineer who genuinely loves building things on the web. JavaScript and Python are my
                happy place — I&apos;ve been writing them since 2015 and I&apos;m still finding new ways they surprise me.
              </p>
              <p className="mb-4 text-[1.05rem] text-text-secondary">
                By day, I work at <b className="font-semibold text-text-main">BrowserStack</b>{' '}
                on growth and pricing
                infrastructure — thinking about performance, scalability, and reliability, and how software can quietly
                make a business run better. By night, you&apos;ll probably find me tinkering with a side project, digging into
                an algorithm problem, or exploring whatever corner of AI/ML has caught my attention that week.
              </p>
              <p className="mb-6 text-[1.05rem] text-text-secondary">
                I believe the best engineers are curious first. I&apos;ve built art-sharing platforms, real-time chat apps,
                IoT train systems, and sentiment classifiers — not because I had to, but because I wanted to know if I
                could.
              </p>
              <ul className="flex flex-col gap-2 mb-8 p-0 list-none">
                <li className="flex items-center gap-2 text-sm text-text-main">
                  <AcademicCapIcon className="w-4 h-4 shrink-0 text-text-secondary" />
                  B.Tech (CSE), Jaypee Institute of Information Technology
                </li>
                <li className="flex items-center gap-2 text-sm text-text-main">
                  <CpuChipIcon className="w-4 h-4 shrink-0 text-text-secondary" />
                  Deep Learning Specialization, deeplearning.ai
                </li>
                <li className="flex items-center gap-2 text-sm text-text-main">
                  <UsersIcon className="w-4 h-4 shrink-0 text-text-secondary" />
                  President, Rotaract Club of Delhi South (2021–22)
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/work" className="btn-brick">
                  See my work
                </Link>
                <Link href="/contact" className="btn-outline">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
      </section>
    </>
  )
}
