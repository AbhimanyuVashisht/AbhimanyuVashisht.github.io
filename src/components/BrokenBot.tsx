'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { PLATE_H, createBrickStage } from '@/lib/brickKit'
import { buildRobot } from '@/lib/brickRobot'

export type BrokenBotApi = { rebuild: (done: () => void) => void }

type Pose = { position: [number, number, number]; rotation: [number, number, number] }

// Where each part lies once the robot has fallen apart. The plate top is y = 0.
// A part on its side is lifted by half its width so it rests on the plate.
const SCATTERED: Record<string, Pose> = {
  legLeft: { position: [-4, 0.5, -0.6], rotation: [0, 1.2, Math.PI / 2] },
  legRight: { position: [3.7, 0, -1.6], rotation: [0, 0.8, 0] },
  body: { position: [-1.4, 0, -2.4], rotation: [0, -0.3, 0] },
  chest: { position: [-2.6, 0, 2.4], rotation: [0, 0.35, 0] },
  armLeft: { position: [1.9, 0.5, 2.7], rotation: [0, 0.3, Math.PI / 2] },
  armRight: { position: [-0.2, 0.5, -3.3], rotation: [0, -0.5, -Math.PI / 2] },
  // Knocked over onto its cheek, still facing the visitor
  head: { position: [1.7, 1.5, 0.7], rotation: [0, 0.25, 1.45] },
}

// Bottom up, the order a person would rebuild it in
const ORDER = ['legLeft', 'legRight', 'body', 'chest', 'armLeft', 'armRight', 'head'] as const
const STAGGER = 0.16
const DURATION = 0.7
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export default function BrokenBot({ onReady }: { onReady: (api: BrokenBotApi | null) => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const stage = createBrickStage(wrap, canvas, { groundY: -2.45 })
    // Without WebGL the page still works: the button just goes home
    if (!stage) {
      onReady(null)
      return
    }
    const { camera, reduceMotion } = stage

    const world = new THREE.Group()
    stage.scene.add(world)
    const plate = stage.makeBrick(10, 8, PLATE_H, 'plate')
    plate.position.y = -2.4
    world.add(plate)

    const robot = buildRobot(stage)
    robot.bot.position.y = -2
    world.add(robot.bot)

    // Remember the assembled pose, then knock every part loose
    const parts = ORDER.map((name) => {
      const object = robot.parts[name]
      const home = { position: object.position.clone(), quaternion: object.quaternion.clone() }
      const pose = SCATTERED[name]
      object.position.set(...pose.position)
      object.rotation.set(...pose.rotation)
      const fallen = { position: object.position.clone(), quaternion: object.quaternion.clone() }
      return { object, home, fallen }
    })
    // Dazed: pupils drift off to one side
    robot.eyes.forEach(({ pupil }) => pupil.position.set(0.14, 0.1, 0.04))

    const pointer = { x: 0 }
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      stage.wake()
    }

    let rebuildStart: number | null = null
    let finished: (() => void) | null = null
    let clock = 0
    // Narrow screens see less of the plate's width, so the camera stands further back
    let zoom = 1
    const placeCamera = (pull: number) => {
      camera.position.set(0, (7.5 - pull * 1.5) * zoom, (16 + pull * 9) * zoom)
      camera.lookAt(0, -1.6 + pull * 2.6, 0)
    }

    stage.start({
      frame: (time) => {
        clock = time
        world.rotation.y += (-0.3 + pointer.x * 0.1 - world.rotation.y) * 0.08
        robot.bulbMaterial.emissiveIntensity = reduceMotion ? 0.4 : 0.25 + Math.max(0, Math.sin(time * 1.3)) * 0.5

        if (rebuildStart === null) return
        const elapsed = time - rebuildStart
        // Pull the camera back so the whole robot is in shot once he stands up again
        placeCamera(ease(Math.min(1, elapsed / 1.2)))
        parts.forEach(({ object, home, fallen }, i) => {
          const t = Math.min(1, Math.max(0, (elapsed - i * STAGGER) / DURATION))
          const k = ease(t)
          object.position.lerpVectors(fallen.position, home.position, k)
          // Each part hops up and over on its way back
          object.position.y += Math.sin(Math.PI * t) * 1.6
          object.quaternion.slerpQuaternions(fallen.quaternion, home.quaternion, k)
        })
        const built = (ORDER.length - 1) * STAGGER + DURATION
        if (elapsed > built) {
          robot.eyes.forEach(({ pupil }) => pupil.position.set(0, 0, 0.04))
          // A short wave once he is back together, then off to the home page
          const wave = elapsed - built
          robot.arms[1].rotation.z = wave < 0.9 ? Math.sin(wave * 12) * 0.5 - 2.3 : 0
          if (wave > 0.9 && finished) {
            const done = finished
            finished = null
            done()
          }
        }
      },
      resize: () => {
        camera.fov = 26
        zoom = Math.max(1, 1.75 / camera.aspect)
        if (rebuildStart === null) placeCamera(0)
      },
    })

    onReady({
      rebuild: (done) => {
        if (reduceMotion) {
          done()
          return
        }
        finished = done
        rebuildStart = clock
        stage.wake()
      },
    })

    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      onReady(null)
      robot.dispose()
      stage.dispose()
    }
    // onReady is a stable setter from the parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapRef} className="relative h-[clamp(220px,34vh,320px)] w-full" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
      />
    </div>
  )
}
