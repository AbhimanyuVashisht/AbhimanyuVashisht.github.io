'use client'

import { useEffect, useState } from 'react'

// 820ms under a second, 1.2s above it
const duration = (ms: number) => (ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`)

type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean }

/**
 * Shows how long this visit's first page took to load, measured in the visitor's own browser.
 * The tooltip adds first paint, largest paint and layout shift where the browser reports them.
 * Client-side page changes don't reload the page, so the number stays the first load's.
 */
export default function LoadTime({ className = '' }: { className?: string }) {
  const [text, setText] = useState<{ label: string; detail: string } | null>(null)

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    let lcp = 0
    let cls = 0
    const observers: PerformanceObserver[] = []
    const observe = (type: string, onEntry: (entry: PerformanceEntry) => void) => {
      if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return
      const observer = new PerformanceObserver((list) => list.getEntries().forEach(onEntry))
      observer.observe({ type, buffered: true })
      observers.push(observer)
    }
    observe('largest-contentful-paint', (entry) => {
      lcp = entry.startTime
    })
    observe('layout-shift', (entry) => {
      const shift = entry as LayoutShift
      if (!shift.hadRecentInput) cls += shift.value
    })

    const report = () => {
      const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (!nav || nav.loadEventEnd <= 0) return
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      const detail = [
        fcp ? `First paint ${duration(fcp)}` : null,
        lcp ? `Largest paint ${duration(lcp)}` : null,
        PerformanceObserver.supportedEntryTypes?.includes('layout-shift') ? `Layout shift ${cls.toFixed(2)}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      setText({ label: `Loaded in ${duration(nav.loadEventEnd)} on your device`, detail })
    }

    // loadEventEnd is only filled in after the load handler has finished
    const onLoad = () => window.setTimeout(report, 0)
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })

    return () => {
      window.removeEventListener('load', onLoad)
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  if (!text) return null
  return (
    <p className={`m-0 text-xs tabular-nums text-text-secondary ${className}`} title={text.detail || undefined}>
      {text.label}
    </p>
  )
}
