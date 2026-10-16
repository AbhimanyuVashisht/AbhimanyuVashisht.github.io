import type { Metadata } from 'next'

export const SITE_URL = 'https://abhimanyuvashisht.com'
export const SITE_NAME = 'Abhimanyu Vashisht'
const SITE_TITLE = 'Abhimanyu Vashisht — AI Product Engineer'

const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Abhimanyu Vashisht, AI Product Engineer and Lead Software Engineer at BrowserStack, next to a robot built from toy bricks',
}

export const PROFILES = {
  github: 'https://github.com/AbhimanyuVashisht',
  linkedin: 'https://www.linkedin.com/in/iamabhimanyuvashisht/',
  twitter: 'https://twitter.com/abhimanyu_av',
  instagram: 'https://www.instagram.com/iamabhimanyuvashisht/',
}

/** Title, description, canonical URL and social-preview tags for one page. `path` keeps the trailing slash the export uses. */
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_TITLE
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@abhimanyu_av',
      creator: '@abhimanyu_av',
      title: fullTitle,
      description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  }
}

// Structured data that tells search engines who the site is about
export const personSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/plugins/localCss/prof-img2.jpg`,
      jobTitle: 'AI Product Engineer',
      worksFor: { '@type': 'Organization', name: 'BrowserStack', url: 'https://www.browserstack.com' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Jaypee Institute of Information Technology' },
      knowsAbout: ['AI product engineering', 'Web performance', 'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Machine learning'],
      sameAs: Object.values(PROFILES),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
}
