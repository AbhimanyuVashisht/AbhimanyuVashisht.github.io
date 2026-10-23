import type { Metadata } from 'next'
import { Bungee, Inter, Montserrat } from 'next/font/google'
import '@/styles/globals.css'
import { ReduxProvider } from '@/store/ReduxProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ThemeInitializer from '@/components/ThemeInitializer'
import { SITE_URL, pageMetadata, personSchema } from '@/lib/seo'

// Fonts are self-hosted by next/font, so no render-blocking request to Google Fonts
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-face-inter' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-face-montserrat' })
const bungee = Bungee({ subsets: ['latin'], weight: '400', variable: '--font-face-bungee' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    description:
      'Abhimanyu Vashisht is an AI Product Engineer and Lead Software Engineer at BrowserStack, building fast, scalable web products since 2015.',
    path: '/',
  }),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${bungee.variable}`} suppressHydrationWarning>
      <body className={inter.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <ThemeInitializer />
        <ReduxProvider>
          <a href="#main-content" className="skip-nav">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  )
}
