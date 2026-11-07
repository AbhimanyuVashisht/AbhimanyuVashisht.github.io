'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import type { BrokenBotApi } from '@/components/BrokenBot'

const BrokenBot = dynamic(() => import('@/components/BrokenBot'), { ssr: false })

export default function NotFoundContent() {
  const router = useRouter()
  const bot = useRef<BrokenBotApi | null>(null)
  const [rebuilding, setRebuilding] = useState(false)
  const onReady = useCallback((api: BrokenBotApi | null) => {
    bot.current = api
  }, [])

  const rebuild = () => {
    const goHome = () => router.push('/')
    if (!bot.current) {
      goHome()
      return
    }
    setRebuilding(true)
    bot.current.rebuild(goHome)
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <BrokenBot onReady={onReady} />
      <p className="mb-2 mt-4 font-montserrat text-sm font-medium tabular-nums text-text-secondary">404</p>
      <h1 className="brick-title mb-4 text-[2.25rem]" id="not-found-heading">
        This page fell apart
      </h1>
      <p className="mb-6 text-[1.05rem] text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" className="btn-brick" onClick={rebuild} disabled={rebuilding} aria-live="polite">
          {rebuilding ? 'Rebuilding…' : 'Rebuild me and go home'}
        </button>
        <Link href="/work" className="btn-outline">
          See my work
        </Link>
      </div>
    </div>
  )
}
