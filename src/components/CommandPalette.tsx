'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { OPEN_COMMAND_MENU } from '@/components/CommandMenuButton'
import { BRICK_RAIN } from '@/lib/robotEvents'
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/Icons'
import { effectiveTheme, setThemeMode, storedThemeMode } from '@/lib/theme'

const EMAIL = 'abhimanyu@vashisht.tech'

// Where focus was before the menu opened, so closing it can put focus back. There is only one menu.
let lastFocus: HTMLElement | null = null
const restoreFocus = () => lastFocus?.focus()

type Command = {
  id: string
  group: 'Pages' | 'Actions' | 'Profiles'
  label: string
  // Extra words that should find this command
  keywords?: string
  icon?: ReactNode
  external?: boolean
  run: () => void | 'keep-open'
}

/**
 * A keyboard command menu: ⌘K or Ctrl K anywhere, or the button in the menu bar.
 * Type to filter, arrow keys to move, Enter to run, Esc to close.
 */
export default function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listId = useId()

  const close = useCallback(() => {
    setOpen(false)
    restoreFocus()
  }, [])

  const show = useCallback(() => {
    lastFocus = document.activeElement as HTMLElement | null
    setQuery('')
    setActive(0)
    setCopied(false)
    setOpen(true)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) close()
        else show()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_COMMAND_MENU, show)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_COMMAND_MENU, show)
    }
  }, [open, close, show])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href)
    const openTab = (href: string) => () => {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
    const theme = open ? effectiveTheme(storedThemeMode()) : 'dark'
    const list: Command[] = [
      { id: 'home', group: 'Pages', label: 'Home', run: go('/') },
      { id: 'about', group: 'Pages', label: 'About', keywords: 'bio education', run: go('/about') },
      { id: 'work', group: 'Pages', label: 'Work', keywords: 'projects experience', run: go('/work') },
      { id: 'contact', group: 'Pages', label: 'Contact', keywords: 'reach hire', run: go('/contact') },
      {
        id: 'copy-email',
        group: 'Actions',
        label: copied ? 'Copied to clipboard' : 'Copy email address',
        keywords: `${EMAIL} mail`,
        run: () => {
          navigator.clipboard
            ?.writeText(EMAIL)
            .then(() => {
              setCopied(true)
              window.setTimeout(close, 700)
            })
            .catch(() => {
              // Clipboard blocked: fall back to opening the mail app
              window.location.href = `mailto:${EMAIL}`
            })
          return 'keep-open'
        },
      },
      {
        id: 'send-email',
        group: 'Actions',
        label: 'Send an email',
        keywords: 'mail contact',
        run: () => {
          window.location.href = `mailto:${EMAIL}`
        },
      },
      {
        id: 'theme',
        group: 'Actions',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        keywords: 'theme mode dark light appearance',
        run: () => setThemeMode(theme === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'theme-system',
        group: 'Actions',
        label: 'Use system theme',
        keywords: 'theme mode auto appearance',
        run: () => setThemeMode('system'),
      },
    ]
    // Only on Home, where the robot lives
    if (pathname === '/') {
      list.push({
        id: 'rain',
        group: 'Actions',
        label: 'Make it rain bricks',
        keywords: 'easter egg fun robot konami',
        run: () => {
          window.dispatchEvent(new Event(BRICK_RAIN))
        },
      })
    }
    list.push(
      { id: 'github', group: 'Profiles', label: 'GitHub', icon: <GitHubIcon className="h-4 w-4" />, external: true, run: openTab('https://github.com/AbhimanyuVashisht') },
      { id: 'linkedin', group: 'Profiles', label: 'LinkedIn', icon: <LinkedInIcon className="h-4 w-4" />, external: true, run: openTab('https://www.linkedin.com/in/iamabhimanyuvashisht/') },
      { id: 'x', group: 'Profiles', label: 'X', keywords: 'twitter', icon: <XIcon className="h-4 w-4" />, external: true, run: openTab('https://x.com/abhimanyu_av') },
      { id: 'instagram', group: 'Profiles', label: 'Instagram', icon: <InstagramIcon className="h-4 w-4" />, external: true, run: openTab('https://www.instagram.com/iamabhimanyuvashisht/') },
    )
    return list
  }, [router, pathname, open, copied, close])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.keywords ?? ''} ${c.group}`.toLowerCase().includes(q))
  }, [commands, query])

  const selected = Math.min(active, Math.max(0, results.length - 1))
  // A group label above the first command of each group
  const headed = results.map((command, i) => ({ command, heading: i === 0 || results[i - 1].group !== command.group ? command.group : null }))

  const run = (command: Command | undefined) => {
    if (!command) return
    const result = command.run()
    if (result !== 'keep-open') {
      setOpen(false)
      // A page change moves focus on its own; anything else returns it to where it was
      if (command.group !== 'Pages') restoreFocus()
    }
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((selected + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((selected - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[selected])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Tab') {
      // Keep focus inside the menu while it is open
      e.preventDefault()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border-color bg-bg-secondary shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center gap-3 border-b border-border-color px-4">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Search"
            onKeyDown={onKeyDown}
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[selected] ? `${listId}-${results[selected].id}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full bg-transparent text-[15px] text-text-main outline-none placeholder:text-text-secondary"
          />
        </div>

        <ul id={listId} role="listbox" aria-label="Commands" className="m-0 max-h-[52vh] list-none overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-text-secondary">No matches</li>}
          {headed.map(({ command, heading }, i) => {
            const isActive = i === selected
            return (
              <li key={command.id} role="presentation">
                {heading && <p className="m-0 px-3 pb-1 pt-3 text-xs font-medium text-text-secondary first:pt-1">{heading}</p>}
                <div
                  id={`${listId}-${command.id}`}
                  role="option"
                  aria-selected={isActive}
                  // Focus stays in the search field (aria-activedescendant), so options aren't tab stops
                  tabIndex={-1}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(command)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') run(command)
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive ? 'bg-bg-accent text-text-main' : 'text-text-main'
                  }`}
                >
                  {command.icon && <span className="text-text-secondary">{command.icon}</span>}
                  <span className="flex-1">{command.label}</span>
                  {command.external && <span className="text-text-secondary" aria-label="opens in a new tab">↗</span>}
                  {isActive && !command.external && (
                    <kbd className="rounded border border-border-color px-1.5 font-mono text-[11px] text-text-secondary">↵</kbd>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-border-color px-4 py-2 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-color px-1 font-mono">↑</kbd>
            <kbd className="rounded border border-border-color px-1 font-mono">↓</kbd>
            to move
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-color px-1 font-mono">↵</kbd>
            to select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-color px-1 font-mono">esc</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  )
}
