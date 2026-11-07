'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BRICK_H, PLATE_H, Tone, createBrickStage } from '@/lib/brickKit'
import { buildRobot } from '@/lib/brickRobot'

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

export default function BrickBot({ onUnavailable }: { onUnavailable?: () => void }) {
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
      if (drag.moved < 6 && e.type === 'pointerup') wavedAt = clock
      stage.wake()
    }

    stage.start({
      frame: (time) => {
        clock = time
        world.position.set(wide ? 4 : 0, wide ? 0.5 : narrow.y, 0)
        world.scale.setScalar(wide ? 1 : narrow.scale)
        world.rotation.y += (-0.35 + drag.yaw + pointer.x * 0.12 - world.rotation.y) * 0.1

        const lookX = pointer.x - (wide ? 0.4 : 0)
        head.rotation.y += (lookX * 0.75 - head.rotation.y) * 0.1
        head.rotation.x += (pointer.y * 0.35 - head.rotation.x) * 0.1
        const lid = reduceMotion ? 1 : time % 3.4 > 3.25 ? 0.1 : 1
        eyes.forEach(({ eye, pupil }) => {
          eye.scale.y += (lid - eye.scale.y) * 0.5
          pupil.position.x = lookX * 0.12
          pupil.position.y = -pointer.y * 0.1
        })

        const waving = time - wavedAt < 1.6 ? Math.sin((time - wavedAt) * 12) * 0.5 - 2.3 : 0
        arms[1].rotation.z += (waving - arms[1].rotation.z) * 0.2
        arms[0].rotation.x = reduceMotion ? 0 : Math.sin(time * 1.4) * 0.12
        bot.position.y = -2 + (reduceMotion ? 0 : Math.abs(Math.sin(time * 1.4)) * 0.08)
        bulbMaterial.emissiveIntensity = reduceMotion ? 0.8 : 0.5 + Math.sin(time * 4) * 0.4

        loose.forEach(({ group, home, seed }) => {
          group.position.y = home + (reduceMotion ? 0 : Math.sin(time * 0.9 + seed) * 0.35)
          group.rotation.set(Math.sin(seed) * 0.4, reduceMotion ? seed : time * 0.3 + seed, 0)
        })
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

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      robot.dispose()
      stage.dispose()
    }
    // onUnavailable only matters on the first run
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
