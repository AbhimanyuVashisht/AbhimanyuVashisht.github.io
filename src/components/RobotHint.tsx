'use client'

import { useSyncExternalStore } from 'react'

const SEEN_KEY = 'robot-hint-seen'
const noop = () => () => {}

export function markRobotHintSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage blocked: the hint just shows again next visit
  }
}

const seenBefore = () => {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Tells first-time visitors the robot can be played with. It shows once the 3D scene is ready
 * and goes away for good after the first drag or tap. The line keeps its space while hidden,
 * so the page never shifts when it appears or leaves.
 */
export default function RobotHint({ ready, dismissed, className = '' }: { ready: boolean; dismissed: boolean; className?: string }) {
  const touch = useSyncExternalStore(noop, () => window.matchMedia('(pointer: coarse)').matches, () => false)
  const seen = useSyncExternalStore(noop, seenBefore, () => true)
  const visible = ready && !dismissed && !seen

  return (
    <p
      className={`m-0 flex items-center gap-2 text-xs text-text-secondary transition-opacity duration-300 ${visible ? 'opacity-100' : 'invisible opacity-0'} ${className}`}
      aria-hidden={visible ? undefined : true}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.1L4.6 16.3a1.5 1.5 0 0 1 2.2-2L9 16" />
      </svg>
      {touch ? 'Drag the robot to spin it, tap to make it wave' : 'Drag the robot to spin it, click to make it wave'}
    </p>
  )
}
