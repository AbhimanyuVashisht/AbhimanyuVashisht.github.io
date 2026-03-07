
'use client'

import { useEffect, useRef, useState } from 'react'

export default function ProfileVisual() {
  const [isHovered, setIsHovered] = useState(false)
  const visualRef = useRef<HTMLDivElement | null>(null)
  const outerRef = useRef<HTMLDivElement | null>(null)
  const sheenRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const visual = visualRef.current
    const outer = outerRef.current
    const sheen = sheenRef.current
    if (!visual || !outer || !sheen) return

    const MAX_TILT_X = 10
    const MAX_TILT_Y = 14
    const LERP_SPEED = 0.1

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rafId: number | null = null
    let hovering = false

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      currentX = lerp(currentX, targetX, LERP_SPEED)
      currentY = lerp(currentY, targetY, LERP_SPEED)

      outer.style.transform = `perspective(700px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`

      const settled = Math.abs(currentX - targetX) < 0.02 && Math.abs(currentY - targetY) < 0.02
      if (!settled) {
        rafId = window.requestAnimationFrame(tick)
      } else {
        if (!hovering) outer.style.transform = ''
        rafId = null
      }
    }

    const startTick = () => {
      if (!rafId) rafId = window.requestAnimationFrame(tick)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = outer.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (e.clientX - cx) / (rect.width / 2)
      const ny = (e.clientY - cy) / (rect.height / 2)

      targetY = nx * MAX_TILT_Y
      targetX = -ny * MAX_TILT_X

      sheen.style.setProperty('--sx', `${(((-nx + 1) / 2) * 100).toFixed(1)}%`)
      sheen.style.setProperty('--sy', `${(((-ny + 1) / 2) * 100).toFixed(1)}%`)
      sheen.style.opacity = '1'

      hovering = true
      startTick()
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
      hovering = false
      sheen.style.opacity = '0'
      startTick()
    }

    visual.addEventListener('mousemove', handleMouseMove)
    visual.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      visual.removeEventListener('mousemove', handleMouseMove)
      visual.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={visualRef} className="profile-visual relative w-[290px] h-[290px] mx-auto mb-4 flex items-center justify-center">
      <div
        ref={outerRef}
        className={`profile-ring-outer relative w-64 h-64 rounded-34 p-0.5 bg-border-color transition-all duration-500 ease-in-out flex-shrink-0 cursor-pointer will-change-transform [transform-style:preserve-3d] hover:bg-gradient-to-br hover:from-[#7da6ff] hover:via-[#a78bfa] hover:to-[#f472b6] hover:drop-shadow-[0_8px_32px_rgba(125,166,255,0.28)] ${isHovered ? 'is-hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="profile-ring-inner relative w-full h-full rounded-32 overflow-hidden bg-bg-main">
          <img
            className="profile-img-secondary absolute inset-0 w-full h-full object-cover object-[center_top] block rounded-none z-[1] scale-[1.04]"
            src="/plugins/localCss/prof-img.jpg"
            alt=""
            aria-hidden="true"
          />
          <img
            className="profile-img-primary absolute inset-0 w-full h-full object-cover object-[center_top] block rounded-none z-[2] scale-100 opacity-100 transition-all duration-[550ms] ease-in-out will-change-[opacity,filter,transform]"
            src="/plugins/localCss/prof-img2.jpg"
            alt="Abhimanyu Vashisht"
          />
          <div
            ref={sheenRef}
            className="profile-sheen absolute inset-0 z-10 pointer-events-none rounded-32 opacity-0 transition-opacity duration-300"
            style={
              {
                '--sx': '50%',
                '--sy': '30%',
                background: 'radial-gradient(circle at var(--sx) var(--sy), rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 65%)'
              } as React.CSSProperties
            }
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="absolute -top-9 -right-2 w-[140px] h-[140px] z-[4]">
        <svg
          viewBox="0 0 200 200"
          width="200"
          height="200"
          className="w-full h-full pointer-events-none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <path id="name-circle" d="M 100 50 a 50 50 0 0 1 0 100 a 50 50 0 0 1 0 -100" />
          </defs>
          <text width="400">
            <textPath
              href="#name-circle"
              className="font-inter text-[9px] tracking-[2px] uppercase fill-none stroke-text-secondary [stroke-width:1.5] [stroke-dasharray:400] [stroke-dashoffset:400] animate-draw-logo"
              stroke="#fff"
              fill="none"
              strokeWidth="1.5"
            >
              Building things • since 2015 •
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  )
}
