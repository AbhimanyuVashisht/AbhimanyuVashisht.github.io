import type { Metadata } from 'next'
import BodyClass from '@/components/BodyClass'
import NotFoundContent from '@/components/NotFoundContent'

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
          <NotFoundContent />
        </div>
      </section>
    </>
  )
}
