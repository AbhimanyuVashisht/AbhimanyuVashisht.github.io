"use client"

import { useEffect } from 'react'

type BodyClassProps = {
  className: 'page-hero' | 'page-fill'
}

/**
 * Picks the page layout. The hidden marker is in the server-rendered HTML, so the CSS in
 * globals.css (body:has([data-page-layout])) lays the page out correctly from the first paint.
 * The body class is still added for scripts that check it.
 */
export default function BodyClass({ className }: BodyClassProps) {
  useEffect(() => {
    document.body.classList.add(className)
    return () => {
      document.body.classList.remove(className)
    }
  }, [className])

  return <span hidden data-page-layout={className} />
}
