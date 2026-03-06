import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 fade-in">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-2">404</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Page Not Found</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              Go Home
            </Link>
            <Link
              href="/work"
              className="px-8 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-lg transition"
            >
              See My Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
