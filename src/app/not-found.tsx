import Link from 'next/link'
import BodyClass from '@/components/BodyClass'

export default function NotFound() {
  return (
    <>
      <BodyClass className="page-fill" />
      <section className="fade-in" id="not-found" aria-labelledby="not-found-heading">
        <style>{`body { --bs-body-bg: var(--bg-main); }`}</style>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center">
              <p className="font-montserrat text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-accent mb-2">404</p>
              <h1 className="font-montserrat font-bold text-[2rem] text-text-main mb-3" id="not-found-heading" style={{letterSpacing: '0.5px'}}>
                Page Not Found
              </h1>
              <p className="text-text-secondary text-[1.05rem] mb-4">
                The page you're looking for doesn't exist or may have been moved.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link href="/" className="bg-accent !text-white border-2 border-accent rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-transparent hover:!text-accent hover:-translate-y-0.5 no-underline inline-block">
                  Go Home
                </Link>
                <Link href="/work" className="bg-transparent !text-text-main border-2 border-border-color rounded-full px-8 py-2.5 font-semibold font-montserrat tracking-wide transition-all duration-200 hover:bg-accent hover:!text-white hover:border-accent hover:-translate-y-0.5 no-underline inline-block">
                  See My Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
