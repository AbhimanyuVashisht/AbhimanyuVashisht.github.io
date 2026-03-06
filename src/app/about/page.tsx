import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Abhimanyu Vashisht',
  description: 'About Abhimanyu Vashisht — Lead Software Engineer, Full-Stack Developer, and AI Enthusiast.',
}

export default function AboutPage() {
  return (
    <section className="page-fill">
      <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
            Hey, I'm Abhimanyu.
          </h1>
          <div style={{ lineHeight: '1.7', marginBottom: '2rem' }}>
            <p style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
              I'm a Lead Software Engineer who genuinely loves building things on the web. 
              JavaScript and Python are my happy place — I've been writing them for over 7 years 
              and I'm still finding new ways they surprise me.
            </p>
            <p style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
              By day, I work at <strong style={{ fontWeight: 700, color: 'var(--text-main)' }}>BrowserStack</strong> on 
              growth and pricing infrastructure — thinking about performance, scalability, and reliability, 
              and how software can quietly make a business run better. By night, you'll probably find me 
              tinkering with a side project, digging into an algorithm problem, or exploring whatever 
              corner of AI/ML has caught my attention that week.
            </p>
            <p style={{ fontSize: '1.05rem' }}>
              I believe the best engineers are curious first. I've built art-sharing platforms, 
              real-time chat apps, IoT train systems, and sentiment classifiers — not because I had to, 
              but because I wanted to know if I could.
            </p>
          </div>

          <div className="row" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
            <div className="col-auto" style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent-bg)',
                borderRadius: '9999px',
                fontSize: '0.9rem'
              }}>
                <i className="fas fa-graduation-cap" style={{ color: 'var(--accent)' }} />
                <span>B.Tech (CSE), Jaypee Institute of Information Technology</span>
              </div>
            </div>
            <div className="col-auto" style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent-bg)',
                borderRadius: '9999px',
                fontSize: '0.9rem'
              }}>
                <i className="fas fa-brain" style={{ color: 'var(--accent)' }} />
                <span>Deep Learning Specialization — deeplearning.ai</span>
              </div>
            </div>
            <div className="col-auto" style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent-bg)',
                borderRadius: '9999px',
                fontSize: '0.9rem'
              }}>
                <i className="fas fa-users" style={{ color: 'var(--accent)' }} />
                <span>President, Rotaract Club of Delhi South (2021–22)</span>
              </div>
            </div>
          </div>

          <div className="hero-cta d-flex flex-wrap gap-3 justify-content-center">
            <Link href="/work" className="btn-hero-primary">
              See My Work
            </Link>
            <Link href="/contact" className="btn-hero-outline">
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
