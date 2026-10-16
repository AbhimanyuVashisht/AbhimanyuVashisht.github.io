import Link from 'next/link'
import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'

// A missing page shouldn't point search engines at the home page as its canonical copy
export const metadata: Metadata = {
  title: 'Page Not Found — Abhimanyu Vashisht',
  alternates: { canonical: null },
}

export default function NotFound() {
  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="not-found" aria-labelledby="not-found-heading">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
              <p className="font-montserrat text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-accent mb-2">404</p>
              <h1 className="brick-title text-[2.4rem] mb-4" id="not-found-heading">
                Page Not Found
              </h1>
              <p className="text-text-secondary text-[1.05rem] mb-4">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/" className="btn-brick">
                  Go Home
                </Link>
                <Link href="/work" className="btn-outline">
                  See My Work
                </Link>
              </div>
            </div>
          </div>
      </section>
    </>
  )
}
