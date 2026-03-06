import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { ReduxProvider } from '@/store/ReduxProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', weight: ['600', '700'] })

export const metadata: Metadata = {
  title: 'Abhimanyu Vashisht',
  description: 'Lead Software Engineer, Full-Stack Developer, and AI Enthusiast. Portfolio, projects, and contact.',
  icons: {
    icon: [
      { url: '/plugins/localCss/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/plugins/localCss/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/plugins/localCss/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/plugins/localCss/icons/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/plugins/localCss/icons/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/plugins/localCss/icons/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/plugins/localCss/icons/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/plugins/localCss/icons/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/plugins/localCss/icons/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/plugins/localCss/icons/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/plugins/localCss/icons/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/plugins/localCss/icons/apple-icon-180x180.png', sizes: '180x180' },
    ],
  },
  manifest: '/plugins/localCss/icons/manifest.json',
  openGraph: {
    title: 'Abhimanyu Vashisht Portfolio',
    description: 'Lead Software Engineer, Full-Stack Developer, and AI Enthusiast.',
    images: 'https://abhimanyuvashisht.github.io/plugins/localCss/prof-img2.jpg',
    type: 'website',
    url: 'https://abhimanyuvashisht.com/',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <a href="#main-content" className="skip-nav sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-500 text-white px-4 py-2 z-50">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  )
}
