'use client'

import { useSyncExternalStore } from 'react'

export const OPEN_COMMAND_MENU = 'open-command-menu'

const noop = () => () => {}
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

/** Hook for the shortcut label: ⌘K on Apple devices, Ctrl K elsewhere. The server assumes ⌘K */
export function useShortcutLabel() {
  return useSyncExternalStore(noop, () => (isMac() ? '⌘K' : 'Ctrl K'), () => '⌘K')
}

export default function CommandMenuButton() {
  const label = useShortcutLabel()
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
      className="rounded-md border border-border-color px-2 py-1 font-mono text-xs text-text-secondary transition-colors hover:bg-bg-accent hover:text-text-main"
      aria-label={`Open the command menu (${label})`}
      title="Command menu"
    >
      {label}
    </button>
  )
}
