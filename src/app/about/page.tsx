import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Abhimanyu Vashisht',
  description: 'About Abhimanyu Vashisht — Lead Software Engineer, Full-Stack Developer, and AI Enthusiast.',
}

export default function AboutPage() {
  return (
    <section className="pt-24 pb-12 px-4 fade-in">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hey, I'm Abhimanyu.
            </h1>
            <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <p>
                I'm a Lead Software Engineer who genuinely loves building things on the web. 
                JavaScript and Python are my happy place — I've been writing them for over 7 years 
                and I'm still finding new ways they surprise me.
              </p>
              <p>
                By day, I work at <strong className="text-gray-900 dark:text-white">BrowserStack</strong> on 
                growth and pricing infrastructure — thinking about performance, scalability, and reliability, 
                and how software can quietly make a business run better. By night, you'll probably find me 
                tinkering with a side project, digging into an algorithm problem, or exploring whatever 
                corner of AI/ML has caught my attention that week.
              </p>
              <p>
                I believe the best engineers are curious first. I've built art-sharing platforms, 
                real-time chat apps, IoT train systems, and sentiment classifiers — not because I had to, 
                but because I wanted to know if I could.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 my-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <i className="fas fa-graduation-cap text-blue-500" />
                <span>B.Tech (CSE), Jaypee Institute of Information Technology</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <i className="fas fa-brain text-blue-500" />
                <span>Deep Learning Specialization — deeplearning.ai</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <i className="fas fa-users text-blue-500" />
                <span>President, Rotaract Club of Delhi South (2021–22)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link
                href="/work"
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
              >
                See My Work
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-lg transition"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
