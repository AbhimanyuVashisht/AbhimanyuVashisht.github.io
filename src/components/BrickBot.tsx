'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BRICK_H, PLATE_H, Tone, createBrickStage } from '@/lib/brickKit'

// Bricks floating around the robot: [x, y, z, width, depth, tone]
const LOOSE: [number, number, number, number, number, Tone][] = [
  [-4.2, 5.6, -1, 2, 2, 'packet'],
  [5.6, 4.4, -2, 2, 1, 'accent'],
  [6.4, -1.2, 2.6, 1, 1, 'accentSoft'],
  [5, 0.2, 1.6, 2, 2, 'neutral'],
  [-2.8, 6.4, -2.5, 1, 2, 'accent'],
  [3.2, 6.8, -1.5, 1, 1, 'packet'],
]

export default function BrickBot() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const stage = createBrickStage(wrap, canvas, { groundY: -2.45 })
    if (!stage) return
    const { camera, reduceMotion } = stage

    const extras: { dispose: () => void }[] = []
    const glow = (color: string) => {
      const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.2 })
      extras.push(material)
      return material
    }
    const part = <G extends THREE.BufferGeometry>(geometry: G, material: THREE.Material) => {
      extras.push(geometry)
      return new THREE.Mesh(geometry, material)
    }
    const brick = (parent: THREE.Object3D, w: number, d: number, h: number, tone: Tone, x: number, y: number, z: number, hollow = false) => {
      const group = stage.makeBrick(w, d, h, tone, { hollow })
      group.position.set(x, y, z)
      parent.add(group)
      return group
    }

    const world = new THREE.Group()
    stage.scene.add(world)
    brick(world, 10, 8, PLATE_H, 'plate', 0, -2.4, 0)

    const bot = new THREE.Group()
    bot.position.y = -2
    world.add(bot)
    brick(bot, 1, 2, BRICK_H, 'dark', -1, 0, 0)
    brick(bot, 1, 2, BRICK_H, 'dark', 1, 0, 0)
    brick(bot, 4, 2, BRICK_H, 'accent', 0, BRICK_H, 0)
    brick(bot, 4, 2, BRICK_H, 'accent', 0, BRICK_H * 2, 0)

    const ink = stage.materials.dark
    const panel = part(new THREE.BoxGeometry(2, 1, 0.1), ink)
    panel.position.set(0, 2.5, 1.02)
    bot.add(panel)
    const lampGeometry = new THREE.SphereGeometry(0.16, 16, 16)
    extras.push(lampGeometry)
    ;['#7de3ff', '#ff4338', '#ffd60a'].forEach((color, i) => {
      const lamp = new THREE.Mesh(lampGeometry, glow(color))
      lamp.position.set(-0.55 + i * 0.55, 2.5, 1.1)
      bot.add(lamp)
    })

    const arms = [-1, 1].map((side) => {
      const arm = new THREE.Group()
      arm.position.set(side * 2.5, 3.5, 0)
      bot.add(arm)
      brick(arm, 1, 1, PLATE_H, 'packet', 0, -2.2, 0)
      brick(arm, 1, 1, BRICK_H, 'neutral', 0, -1.8, 0)
      brick(arm, 1, 1, PLATE_H, 'neutral', 0, -0.6, 0)
      return arm
    })

    const head = new THREE.Group()
    head.position.y = 3.8
    bot.add(head)
    brick(head, 3, 3, BRICK_H, 'neutral', 0, 0, 0)
    brick(head, 3, 3, BRICK_H, 'neutral', 0, BRICK_H, 0)
    const eyeGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 28)
    const pupilGeometry = new THREE.CylinderGeometry(0.17, 0.17, 0.14, 20)
    const pupilMaterial = glow('#7de3ff')
    extras.push(eyeGeometry, pupilGeometry)
    const eyes = [-0.7, 0.7].map((x) => {
      const eye = new THREE.Group()
      eye.position.set(x, 1.45, 1.5)
      head.add(eye)
      const ball = new THREE.Mesh(eyeGeometry, ink)
      ball.rotation.x = Math.PI / 2
      const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
      pupil.rotation.x = Math.PI / 2
      pupil.position.z = 0.04
      eye.add(ball, pupil)
      return { eye, pupil }
    })
    const mouth = part(new THREE.BoxGeometry(1.1, 0.16, 0.1), ink)
    mouth.position.set(0, 0.62, 1.52)
    const mast = part(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), ink)
    mast.position.y = 3.05
    const bulbMaterial = glow('#ff4338')
    const bulb = part(new THREE.SphereGeometry(0.26, 20, 20), bulbMaterial)
    bulb.position.y = 3.6
    head.add(mouth, mast, bulb)

    const loose = LOOSE.map(([x, y, z, w, d, tone], i) => ({ group: brick(world, w, d, BRICK_H, tone, x, y, z, true), home: y, seed: i * 1.7 }))

    // He watches the cursor; drag turns the scene, a click or tap makes him wave
    const pointer = { x: 0, y: 0 }
    const drag = { active: false, lastX: 0, moved: 0, yaw: 0 }
    let wide = true
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
        world.position.set(wide ? 4 : 0, wide ? 0.9 : 4.3, 0)
        world.scale.setScalar(wide ? 1 : 0.5)
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
      resize: () => {
        wide = camera.aspect > 1.15
        // On narrow screens the floor shadow would fall behind the copy
        stage.ground.visible = wide
        camera.fov = 32
        camera.position.set(0, 2.6, 22)
        camera.lookAt(0, 1.4, 0)
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
      extras.forEach((item) => item.dispose())
      stage.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 -z-10" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
      />
    </div>
  )
}
