
'use client'

import { useEffect } from 'react'

export default function ProfileVisual() {
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 10
    const interval = window.setInterval(() => {
      const init = (window as typeof window & { initProfileTilt?: () => void }).initProfileTilt
      if (typeof init === 'function') {
        init()
        window.clearInterval(interval)
      } else if (attempts >= maxAttempts) {
        window.clearInterval(interval)
      }
      attempts += 1
    }, 200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="relative w-[290px] h-[290px] mx-auto mb-4 flex items-center justify-center">
      <div className="relative w-64 h-64 rounded-34 p-0.5 bg-border-color transition-all duration-500 ease-in-out flex-shrink-0 cursor-pointer will-change-transform [transform-style:preserve-3d] hover:bg-gradient-to-br hover:from-[#7da6ff] hover:via-[#a78bfa] hover:to-[#f472b6] hover:drop-shadow-[0_8px_32px_rgba(125,166,255,0.28)] group">
        <div className="relative w-full h-full rounded-32 overflow-hidden bg-bg-main">
          <img
            className="absolute inset-0 w-full h-full object-cover object-[center_top] block rounded-none z-[1] scale-[1.04]"
            src="/plugins/localCss/prof-secondary.png"
            alt=""
            aria-hidden="true"
          />
          <img
            className="absolute inset-0 w-full h-full object-cover object-[center_top] block rounded-none z-[2] scale-100 opacity-100 transition-all duration-[550ms] ease-in-out will-change-[opacity,filter,transform] group-hover:opacity-0 group-hover:scale-[1.04]"
            src="/plugins/localCss/prof-img2.jpg"
            alt="Abhimanyu Vashisht"
          />
          <div 
            className="absolute inset-0 z-10 pointer-events-none rounded-32 opacity-0 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 65%)'
            }}
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
