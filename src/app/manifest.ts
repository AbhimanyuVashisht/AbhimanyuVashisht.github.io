import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/seo'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — AI Product Engineer`,
    short_name: SITE_NAME,
    description: 'Portfolio of Abhimanyu Vashisht, AI Product Engineer and Lead Software Engineer at BrowserStack.',
    start_url: '/',
    display: 'browser',
    background_color: '#2340ff',
    theme_color: '#2340ff',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
