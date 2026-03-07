import Link from 'next/link'
import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'

export const metadata: Metadata = {
  title: 'About — Abhimanyu Vashisht',
  description: 'About Abhimanyu Vashisht — Lead Software Engineer, Full-Stack Developer, and AI Enthusiast.',
}

export default function AboutPage() {
  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="about" aria-labelledby="about-heading">
        <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="font-montserrat font-bold text-[2rem] text-text-main mb-3" id="about-heading" style={{letterSpacing: '0.5px'}}>
                Hey, I'm Abhimanyu.
              </h1>
              <p className="mb-2" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                I'm a Lead Software Engineer who genuinely loves building things on the web. JavaScript and Python are my
                happy place — I've been writing them for over 7 years and I'm still finding new ways they surprise me.
              </p>
              <p className="mb-2" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                By day, I work at <b style={{ color: 'var(--text-main)' }}>BrowserStack</b> on growth and pricing
                infrastructure — thinking about performance, scalability, and reliability, and how software can quietly
                make a business run better. By night, you'll probably find me tinkering with a side project, digging into
                an algorithm problem, or exploring whatever corner of AI/ML has caught my attention that week.
              </p>
              <p className="mb-3" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                I believe the best engineers are curious first. I've built art-sharing platforms, real-time chat apps,
                IoT train systems, and sentiment classifiers — not because I had to, but because I wanted to know if I
                could.
              </p>
              <div className="row g-2 justify-content-center text-start mb-4">
                <div className="col-auto">
                  <span className="d-flex align-items-center gap-2 small text-text-main">
                    <i className="fas fa-graduation-cap text-accent" aria-hidden="true" />
                    B.Tech (CSE), Jaypee Institute of Information Technology
                  </span>
                </div>
                <div className="col-auto">
                  <span className="d-flex align-items-center gap-2 small text-text-main">
                    <i className="fas fa-brain text-accent" aria-hidden="true" />
                    Deep Learning Specialization — deeplearning.ai
                  </span>
                </div>
                <div className="col-auto">
                  <span className="d-flex align-items-center gap-2 small text-text-main">
                    <i className="fas fa-users text-accent" aria-hidden="true" />
                    President, Rotaract Club of Delhi South (2021–22)
                  </span>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link href="/work" className="bg-accent !text-white border-2 border-accent rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-transparent hover:!text-accent hover:-translate-y-0.5 no-underline inline-block">
                  See My Work
                </Link>
                <Link href="/contact" className="bg-transparent !text-text-main border-2 border-border-color rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-accent hover:!text-white hover:border-accent hover:-translate-y-0.5 no-underline inline-block">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
