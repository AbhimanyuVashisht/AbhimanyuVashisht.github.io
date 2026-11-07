'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BRICK_H, PLATE_H, Tone, createBrickStage } from '@/lib/brickKit'
import { buildRobot } from '@/lib/brickRobot'
import { BRICK_RAIN } from '@/lib/robotEvents'

// Bricks floating around the robot: [x, y, z, width, depth, tone]
const LOOSE: [number, number, number, number, number, Tone][] = [
  [-4.2, 5.6, -1, 2, 2, 'packet'],
  [5.6, 4.4, -2, 2, 1, 'accent'],
  [6.4, -1.2, 2.6, 1, 1, 'accentSoft'],
  [5, 0.2, 1.6, 2, 2, 'neutral'],
  [-2.8, 6.4, -2.5, 1, 2, 'accent'],
  [3.2, 6.8, -1.5, 1, 1, 'packet'],
]

// Narrow-screen framing. The camera sees VIEW_H world units top to bottom at the robot's depth,
// centred on CENTER_Y. The robot spans BOT_SPAN units at scale 1, with the plate's underside BOT_BASE below its origin.
const NAV_H = 64
const MENU_FADE = `linear-gradient(to bottom, transparent ${NAV_H}px, #000 ${NAV_H + 40}px)`
const VIEW_H = 2 * 22 * Math.tan((16 * Math.PI) / 180)
const CENTER_Y = 1.4
const BOT_SPAN = 8.1
const BOT_BASE = 2.5

// Stand the robot just above the hero copy: the band is the hero's top padding minus the navbar
function frameNarrow(wrap: HTMLElement, height: number) {
  const section = wrap.parentElement
  const band = section ? parseFloat(getComputedStyle(section).paddingTop) - NAV_H : 0
  if (band < 160 || height <= 0) return { y: 4.3, scale: 0.5 }
  const pxPerUnit = height / VIEW_H
  const scale = Math.min(0.55, (band * 0.78) / (BOT_SPAN * pxPerUnit))
  const floorPx = NAV_H + band - 16
  return { y: CENTER_Y + (height / 2 - floorPx) / pxPerUnit + BOT_BASE * scale, scale }
}

// Bricks that can fall in a shower, and how many
const RAIN_TONES: Tone[] = ['accent', 'packet', 'accentSoft', 'neutral', 'dark']
const RAIN_SIZES: [number, number][] = [[1, 1], [2, 1], [2, 2], [1, 2]]
const RAIN_COUNT = 26
const RAIN_SETTLE = 4.5
const GRAVITY = 28
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

/** What the page can ask the robot to do */
export type BrickBotApi = {
  wave: () => void
  hop: () => void
  /** Look at a point on screen (client coordinates), or go back to following the pointer */
  lookAt: (point: { x: number; y: number } | null) => void
  rain: () => void
}

type BrickBotProps = {
  onUnavailable?: () => void
  onReady?: (api: BrickBotApi | null) => void
  /** The visitor dragged or tapped the robot for the first time */
  onInteract?: () => void
}

export default function BrickBot({ onUnavailable, onReady, onInteract }: BrickBotProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const stage = createBrickStage(wrap, canvas, { groundY: -2.45 })
    // No WebGL here: let the page show the still picture instead
    if (!stage) {
      onUnavailable?.()
      return
    }
    const { camera, reduceMotion } = stage

    const brick = (parent: THREE.Object3D, w: number, d: number, h: number, tone: Tone, x: number, y: number, z: number, hollow = false) => {
      const group = stage.makeBrick(w, d, h, tone, { hollow })
      group.position.set(x, y, z)
      parent.add(group)
      return group
    }

    const world = new THREE.Group()
    stage.scene.add(world)
    brick(world, 10, 8, PLATE_H, 'plate', 0, -2.4, 0)

    const robot = buildRobot(stage)
    const { bot, head, eyes, arms, bulbMaterial } = robot
    bot.position.y = -2
    world.add(bot)

    const loose = LOOSE.map(([x, y, z, w, d, tone], i) => ({ group: brick(world, w, d, BRICK_H, tone, x, y, z, true), home: y, seed: i * 1.7 }))

    // He watches the cursor; drag turns the scene, a click or tap makes him wave
    const pointer = { x: 0, y: 0 }
    const drag = { active: false, lastX: 0, moved: 0, yaw: 0 }
    let wide = true
    let narrow = { y: 4.3, scale: 0.5 }
    let clock = 0
    let wavedAt = -Infinity
    let hopAt = -Infinity
    let focus: { x: number; y: number } | null = null
    const taps: number[] = []
    let rainAt = -Infinity
    const falling: { group: THREE.Group; velocity: THREE.Vector3; spin: THREE.Vector3; landed: boolean }[] = []

    // A shower of bricks onto the plate, kept clear of the robot's feet. Skipped for reduced motion.
    const rain = () => {
      if (reduceMotion || clock - rainAt < RAIN_SETTLE + 1) return
      rainAt = clock
      wavedAt = clock
      for (let i = 0; i < RAIN_COUNT; i++) {
        const [w, d] = RAIN_SIZES[i % RAIN_SIZES.length]
        let x = 0
        let z = 0
        do {
          x = (Math.random() - 0.5) * (10 - w)
          z = (Math.random() - 0.5) * (8 - d)
        } while (Math.abs(x) < 3 && Math.abs(z) < 1.6)
        const group = brick(world, w, d, BRICK_H, RAIN_TONES[i % RAIN_TONES.length], x, 9 + i * 0.45, z)
        group.rotation.set(Math.random() * 2, Math.random() * 6, Math.random() * 2)
        falling.push({
          group,
          velocity: new THREE.Vector3(0, -2 - Math.random() * 3, 0),
          spin: new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2),
          landed: false,
        })
      }
      stage.wake()
    }
    const noteInteraction = () => {
      onInteract?.()
    }

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      if (!drag.active) return
      const dx = e.clientX - drag.lastX
      drag.lastX = e.clientX
      drag.moved += Math.abs(dx)
      drag.yaw += dx * 0.008
      stage.wake()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      drag.active = true
      drag.lastX = e.clientX
      drag.moved = 0
      canvas.style.cursor = 'grabbing'
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!drag.active) return
      drag.active = false
      canvas.style.cursor = 'grab'
      if (drag.moved < 6 && e.type === 'pointerup') {
        wavedAt = clock
        // Five quick taps make it rain: the phone version of the Konami code
        taps.push(clock)
        while (taps.length && clock - taps[0] > 2) taps.shift()
        if (taps.length >= 5) {
          taps.length = 0
          rain()
        }
      }
      noteInteraction()
      stage.wake()
    }

    // ↑ ↑ ↓ ↓ ← → ← → B A, ignored while typing in a field
    let konami = 0
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      const key = e.key.toLowerCase()
      konami = key === KONAMI[konami] ? konami + 1 : key === KONAMI[0] ? 1 : 0
      if (konami === KONAMI.length) {
        konami = 0
        rain()
      }
    }

    stage.start({
      frame: (time, delta) => {
        clock = time
        world.position.set(wide ? 4 : 0, wide ? 0.5 : narrow.y, 0)
        world.scale.setScalar(wide ? 1 : narrow.scale)
        world.rotation.y += (-0.35 + drag.yaw + pointer.x * 0.12 - world.rotation.y) * 0.1

        const target = focus ?? pointer
        const lookX = target.x - (wide ? 0.4 : 0)
        head.rotation.y += (lookX * 0.75 - head.rotation.y) * 0.1
        head.rotation.x += (target.y * 0.35 - head.rotation.x) * 0.1
        const lid = reduceMotion ? 1 : time % 3.4 > 3.25 ? 0.1 : 1
        eyes.forEach(({ eye, pupil }) => {
          eye.scale.y += (lid - eye.scale.y) * 0.5
          pupil.position.x = lookX * 0.12
          pupil.position.y = -target.y * 0.1
        })

        const waving = time - wavedAt < 1.6 ? Math.sin((time - wavedAt) * 12) * 0.5 - 2.3 : 0
        arms[1].rotation.z += (waving - arms[1].rotation.z) * 0.2
        arms[0].rotation.x = reduceMotion ? 0 : Math.sin(time * 1.4) * 0.12
        const hop = time - hopAt < 0.45 ? Math.sin((Math.PI * (time - hopAt)) / 0.45) * 0.7 : 0
        bot.position.y = -2 + (reduceMotion ? 0 : Math.abs(Math.sin(time * 1.4)) * 0.08 + hop)
        bulbMaterial.emissiveIntensity = reduceMotion ? 0.8 : 0.5 + Math.sin(time * 4) * 0.4

        loose.forEach(({ group, home, seed }) => {
          group.position.y = home + (reduceMotion ? 0 : Math.sin(time * 0.9 + seed) * 0.35)
          group.rotation.set(Math.sin(seed) * 0.4, reduceMotion ? seed : time * 0.3 + seed, 0)
        })

        // Falling bricks: gravity, a damped bounce on the plate, then they settle flat
        if (falling.length) {
          const dt = Math.min(delta, 0.033)
          const age = time - rainAt
          const fade = age > RAIN_SETTLE ? Math.max(0, 1 - (age - RAIN_SETTLE) / 0.6) : 1
          falling.forEach((piece) => {
            const { group, velocity, spin } = piece
            velocity.y -= GRAVITY * dt
            group.position.addScaledVector(velocity, dt)
            if (group.position.y <= -2) {
              group.position.y = -2
              velocity.y = Math.abs(velocity.y) > 2 ? -velocity.y * 0.3 : 0
              spin.multiplyScalar(0.5)
              piece.landed = true
            }
            if (piece.landed) {
              // Lie flat on the studs, keeping only the turn around the vertical axis
              group.rotation.x += (0 - group.rotation.x) * 0.25
              group.rotation.z += (0 - group.rotation.z) * 0.25
              group.rotation.y += spin.y * dt
            } else {
              group.rotation.x += spin.x * dt
              group.rotation.y += spin.y * dt
              group.rotation.z += spin.z * dt
            }
            group.scale.setScalar(fade)
          })
          if (fade === 0) {
            falling.forEach(({ group }) => world.remove(group))
            falling.length = 0
          }
        }
      },
      resize: (_width, height) => {
        wide = camera.aspect > 1.15
        // On narrow screens the floor shadow would fall behind the copy
        stage.ground.visible = wide
        camera.fov = 32
        camera.position.set(0, 2.6, 22)
        camera.lookAt(0, 1.4, 0)
        narrow = frameNarrow(wrap, height)
      },
    })

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(BRICK_RAIN, rain)

    onReady?.({
      wave: () => {
        wavedAt = clock
        stage.wake()
      },
      hop: () => {
        hopAt = clock
        stage.wake()
      },
      lookAt: (point) => {
        focus = point && { x: (point.x / window.innerWidth) * 2 - 1, y: (point.y / window.innerHeight) * 2 - 1 }
        stage.wake()
      },
      rain,
    })

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(BRICK_RAIN, rain)
      onReady?.(null)
      robot.dispose()
      stage.dispose()
    }
    // The callbacks are read once, when the scene is set up
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    // The scene fades out under the menu bar, so floating bricks never sit behind the links
    <div ref={wrapRef} className="absolute inset-0 -z-10" aria-hidden="true" style={{ maskImage: MENU_FADE, WebkitMaskImage: MENU_FADE }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
      />
    </div>
  )
}
