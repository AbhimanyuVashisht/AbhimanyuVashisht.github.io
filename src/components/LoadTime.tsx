'use client'

import { useEffect, useState } from 'react'

// 820ms under a second, 1.2s above it
const duration = (ms: number) => (ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`)

// Only worth showing off when it's fast; slower visits show nothing
const SHOW_UNDER_MS = 2000

type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean }

/**
 * Shows this visit's Largest Contentful Paint, measured in the visitor's own browser: when the
 * main content appeared. It shows only under 2s, and not at all in browsers that don't report
 * it (Safari). The tooltip adds first paint and layout shift.
 * Client-side page changes don't reload the page, so the number stays the first load's.
 */
export default function LoadTime({ className = '' }: { className?: string }) {
  const [text, setText] = useState<{ label: string; detail: string } | null>(null)

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    if (!PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) return
    let lcp = 0
    let cls = 0
    let loaded = false
    const observers: PerformanceObserver[] = []
    const observe = (type: string, onEntry: (entry: PerformanceEntry) => void) => {
      if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(onEntry)
        if (loaded) report()
      })
      observer.observe({ type, buffered: true })
      observers.push(observer)
    }

    // The browser can report a later, larger paint after load, so this re-runs on each one
    const report = () => {
      if (!lcp || lcp >= SHOW_UNDER_MS) {
        setText(null)
        return
      }
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      const detail = [
        'Largest Contentful Paint: when the main content appeared',
        fcp ? `First paint ${duration(fcp)}` : null,
        PerformanceObserver.supportedEntryTypes?.includes('layout-shift') ? `Layout shift ${cls.toFixed(2)}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      setText({ label: `Largest paint in ${duration(lcp)} on your device`, detail })
    }

    observe('largest-contentful-paint', (entry) => {
      lcp = entry.startTime
    })
    observe('layout-shift', (entry) => {
      const shift = entry as LayoutShift
      if (!shift.hadRecentInput) cls += shift.value
    })

    const onLoad = () => {
      loaded = true
      window.setTimeout(report, 0)
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })

    return () => {
      window.removeEventListener('load', onLoad)
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  // The line keeps its space even while empty or hidden, so the page never shifts when it appears
  return (
    <p
      className={`m-0 text-xs tabular-nums text-text-secondary ${text ? '' : 'invisible'} ${className}`}
      title={text?.detail}
      aria-hidden={text ? undefined : true}
    >
      {text ? text.label : ' '}
    </p>
  )
}
