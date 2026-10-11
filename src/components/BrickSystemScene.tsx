'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

type Tone = 'plate' | 'neutral' | 'dark' | 'accent' | 'accentSoft' | 'wire' | 'packet'

const PALETTES: Record<'light' | 'dark', Record<Tone, string>> = {
  light: {
    plate: '#e8eef9',
    neutral: '#ffffff',
    dark: '#334155',
    accent: '#2563eb',
    accentSoft: '#93b4f8',
    wire: '#c3d1ec',
    packet: '#f5b83d',
  },
  dark: {
    plate: '#1c2947',
    neutral: '#3a4b78',
    dark: '#64748b',
    accent: '#3b5eea',
    accentSoft: '#7da6ff',
    wire: '#2a3a61',
    packet: '#f5b83d',
  },
}

// Sizes in stud units: a brick is 1.2 tall, a plate 0.4
const BOARD_W = 14
const BOARD_D = 10
const PLATE_H = 0.4
const BRICK_H = 1.2
const STUD_R = 0.3
const STUD_H = 0.2
const PACKET_COUNT = 7
const BUILD_DONE = 3.6
// Below this viewport width the model is too small for its labels not to collide
const LABEL_MIN_VIEWPORT = 1280

type Piece = [height: number, tone: Tone]
type Component = {
  id: string
  label?: string
  // How far above the top brick the label floats; staggered so neighbours don't overlap
  lift?: number
  x: number
  z: number
  w: number
  d: number
  round?: boolean
  pieces: Piece[]
}

// x/z are the min corner on the board; requests flow left to right
const COMPONENTS: Component[] = [
  { id: 'client', label: 'Client', lift: 0.7, x: 1, z: 4, w: 2, d: 2, pieces: [[BRICK_H, 'dark'], [PLATE_H, 'accentSoft']] },
  { id: 'gateway', label: 'Gateway', lift: 1.7, x: 4, z: 3, w: 2, d: 4, pieces: [[BRICK_H, 'accent'], [BRICK_H, 'accent'], [PLATE_H, 'neutral']] },
  { id: 'svcA', x: 7, z: 0, w: 2, d: 2, pieces: [[BRICK_H, 'neutral'], [BRICK_H, 'neutral'], [BRICK_H, 'neutral'], [PLATE_H, 'accentSoft']] },
  { id: 'svcB', label: 'Services', x: 7, z: 4, w: 2, d: 2, pieces: [[BRICK_H, 'neutral'], [BRICK_H, 'neutral'], [PLATE_H, 'accentSoft']] },
  { id: 'svcC', x: 7, z: 8, w: 2, d: 2, pieces: [[BRICK_H, 'neutral'], [BRICK_H, 'neutral'], [PLATE_H, 'accent']] },
  { id: 'cache', label: 'Cache', x: 11, z: 0, w: 2, d: 2, pieces: [[BRICK_H, 'accentSoft'], [BRICK_H, 'accentSoft'], [PLATE_H, 'neutral']] },
  { id: 'database', label: 'Database', x: 11, z: 4, w: 2, d: 2, round: true, pieces: [[BRICK_H, 'dark'], [BRICK_H, 'neutral'], [BRICK_H, 'dark']] },
  { id: 'queue', label: 'Queue', x: 11, z: 8, w: 2, d: 2, pieces: [[PLATE_H, 'dark'], [PLATE_H, 'neutral'], [PLATE_H, 'accent'], [PLATE_H, 'neutral']] },
]

const LABELLED = COMPONENTS.filter((component) => component.label)

// Smooth tiles the packets travel along: [x, z, width, depth]
const WIRES: [number, number, number, number][] = [
  [3, 4, 1, 2],
  [6, 0, 1, 10],
  [9, 0, 1, 10],
  [10, 0, 1, 2],
  [10, 4, 1, 2],
  [10, 8, 1, 2],
]

// The third service is added and removed on a loop to show the system scaling
const SCALE_PERIOD = 16
const SCALE_IN = 2
const SCALE_OUT = 11

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

const currentTheme = (): 'light' | 'dark' => {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function BrickSystemScene() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x8fa0c4, 1.5)
    const sun = new THREE.DirectionalLight(0xffffff, 2.2)
    sun.position.set(-8, 22, 12)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.left = -12
    sun.shadow.camera.right = 12
    sun.shadow.camera.top = 12
    sun.shadow.camera.bottom = -12
    sun.shadow.camera.far = 60
    sun.shadow.bias = -0.0005
    scene.add(hemi, sun)

    const disposables: { dispose: () => void }[] = []
    const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.12 })
    disposables.push(shadowMaterial)

    const materials = {} as Record<Tone, THREE.MeshStandardMaterial>
    const applyTheme = () => {
      const theme = currentTheme()
      ;(Object.keys(PALETTES[theme]) as Tone[]).forEach((tone) => {
        if (!materials[tone]) {
          materials[tone] = new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.02 })
          disposables.push(materials[tone])
        }
        materials[tone].color.set(PALETTES[theme][tone])
      })
      materials.packet.emissive.set(PALETTES[theme].packet)
      materials.packet.emissiveIntensity = 0.45
      hemi.intensity = theme === 'light' ? 1.5 : 1.1
      shadowMaterial.opacity = theme === 'light' ? 0.12 : 0.35
    }
    applyTheme()

    const studGeometry = new THREE.CylinderGeometry(STUD_R, STUD_R, STUD_H, 20)
    disposables.push(studGeometry)
    const bodyGeometries = new Map<string, THREE.BufferGeometry>()
    const bodyGeometry = (w: number, h: number, d: number, round: boolean) => {
      const key = `${w}:${h}:${d}:${round}`
      let geometry = bodyGeometries.get(key)
      if (!geometry) {
        geometry = round
          ? new THREE.CylinderGeometry(w / 2 - 0.04, w / 2 - 0.04, h, 40)
          : new RoundedBoxGeometry(w - 0.04, h, d - 0.04, 3, 0.06)
        bodyGeometries.set(key, geometry)
        disposables.push(geometry)
      }
      return geometry
    }

    // A brick with its origin at the centre of its base
    const makeBrick = (w: number, d: number, h: number, tone: Tone, options: { round?: boolean; studs?: boolean } = {}) => {
      const brick = new THREE.Group()
      const body = new THREE.Mesh(bodyGeometry(w, h, d, !!options.round), materials[tone])
      body.position.y = h / 2
      body.castShadow = true
      body.receiveShadow = true
      brick.add(body)

      if (options.studs !== false) {
        const studs = new THREE.InstancedMesh(studGeometry, materials[tone], w * d)
        const matrix = new THREE.Matrix4()
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < d; j++) {
            matrix.setPosition(i - w / 2 + 0.5, h + STUD_H / 2, j - d / 2 + 0.5)
            studs.setMatrixAt(i * d + j, matrix)
          }
        }
        studs.castShadow = true
        disposables.push(studs)
        brick.add(studs)
      }
      return brick
    }

    // Board coordinates run 0..BOARD_W / 0..BOARD_D; the model is centred on the origin
    const model = new THREE.Group()
    const board = new THREE.Group()
    board.position.set(-BOARD_W / 2, -2, -BOARD_D / 2)
    model.add(board)

    const base = makeBrick(BOARD_W, BOARD_D, PLATE_H, 'plate')
    base.position.set(BOARD_W / 2, 0, BOARD_D / 2)
    board.add(base)

    type Drop = { brick: THREE.Group; restY: number; delay: number }
    const drops: Drop[] = []
    const scalingDrops: Drop[] = []

    WIRES.forEach(([x, z, w, d], i) => {
      const tile = makeBrick(w, d, PLATE_H, 'wire', { studs: false })
      tile.position.set(x + w / 2, PLATE_H, z + d / 2)
      board.add(tile)
      drops.push({ brick: tile, restY: PLATE_H, delay: 0.2 + i * 0.08 })
    })

    const anchors: THREE.Vector3[] = []
    COMPONENTS.forEach((component, componentIndex) => {
      let y = PLATE_H
      component.pieces.forEach(([h, tone], level) => {
        const brick = makeBrick(component.w, component.d, h, tone, { round: component.round })
        brick.position.set(component.x + component.w / 2, y, component.z + component.d / 2)
        board.add(brick)
        const drop = { brick, restY: y, delay: 0.8 + componentIndex * 0.3 + level * 0.14 }
        if (component.id === 'svcC') scalingDrops.push({ ...drop, delay: level * 0.15 })
        else drops.push(drop)
        y += h
      })
      if (component.label) {
        anchors.push(new THREE.Vector3(component.x + component.w / 2, y + (component.lift ?? 1.1), component.z + component.d / 2))
      }
    })

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), shadowMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -2.6
    ground.receiveShadow = true
    disposables.push(ground.geometry)
    scene.add(model, ground)

    // Packets: client -> gateway -> a service -> cache, database or queue
    const packetGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 20)
    disposables.push(packetGeometry)
    const packetY = PLATE_H * 2 + 0.15
    const serviceRows = [1, 5, 9]
    const targetRows = [1, 5, 5, 9]
    let scaledOut = reduceMotion

    type Packet = { mesh: THREE.Mesh; points: THREE.Vector3[]; total: number; travelled: number; speed: number; wait: number }
    const route = (packet: Packet) => {
      const services = scaledOut ? serviceRows : serviceRows.slice(0, 2)
      const zs = services[Math.floor(Math.random() * services.length)]
      const zt = targetRows[Math.floor(Math.random() * targetRows.length)]
      packet.points = [
        [2, 5], [6.5, 5], [6.5, zs], [9.5, zs], [9.5, zt], [12, zt],
      ].map(([x, z]) => new THREE.Vector3(x, packetY, z))
      packet.total = packet.points.reduce((sum, point, i) => (i ? sum + point.distanceTo(packet.points[i - 1]) : 0), 0)
      packet.travelled = 0
      packet.speed = 3 + Math.random() * 1.5
    }
    const place = (packet: Packet) => {
      let remaining = packet.travelled
      for (let i = 1; i < packet.points.length; i++) {
        const length = packet.points[i].distanceTo(packet.points[i - 1])
        if (remaining <= length || i === packet.points.length - 1) {
          packet.mesh.position.lerpVectors(packet.points[i - 1], packet.points[i], length ? clamp01(remaining / length) : 0)
          break
        }
        remaining -= length
      }
      const edge = Math.min(packet.travelled, packet.total - packet.travelled)
      packet.mesh.scale.setScalar(clamp01(edge / 0.6))
    }
    const packets: Packet[] = Array.from({ length: PACKET_COUNT }, (_, i) => {
      const mesh = new THREE.Mesh(packetGeometry, materials.packet)
      mesh.visible = false
      board.add(mesh)
      const packet: Packet = { mesh, points: [], total: 0, travelled: 0, speed: 0, wait: i * 0.55 }
      route(packet)
      if (reduceMotion) packet.travelled = ((i + 0.5) / PACKET_COUNT) * packet.total
      return packet
    })

    // Wide screens keep the whole model in the free space right of the copy; narrow ones centre it
    const resize = () => {
      const width = wrap.clientWidth
      const height = wrap.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const wide = width >= 1024
      const centreX = wide ? 0.82 : 0.5
      const widthShare = wide ? 0.32 : 0.92
      camera.setViewOffset(width, height, -(centreX - 0.5) * width, wide ? -height * 0.22 : 0, width, height)
      const distance = Math.max(28, 37 / (camera.aspect * widthShare))
      camera.position.set(distance * 0.36, distance * 0.6, distance * 0.72)
      camera.lookAt(0, -0.6, 0)
      camera.updateProjectionMatrix()
    }

    const pointer = { x: 0, y: 0 }
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    const dropOffset = (t: number) => (1 - easeOutCubic(clamp01(t))) * 9
    const projected = new THREE.Vector3()
    let rotationY = 0
    let rotationX = 0
    let rafId: number | null = null
    let visible = true
    let onScreen = true
    let last = performance.now()
    const start = last

    const renderFrame = (now: number) => {
      const time = (now - start) / 1000
      const delta = Math.min(0.05, (now - last) / 1000)
      last = now

      drops.forEach(({ brick, restY, delay }) => {
        const t = reduceMotion ? 1 : (time - delay) / 0.7
        brick.visible = t > 0
        brick.position.y = restY + dropOffset(t)
      })

      const phase = reduceMotion ? SCALE_IN + 2 : time < BUILD_DONE ? 0 : (time - BUILD_DONE) % SCALE_PERIOD
      scaledOut = phase > SCALE_IN + 1 && phase < SCALE_OUT
      scalingDrops.forEach(({ brick, restY, delay }) => {
        const leaving = clamp01((phase - SCALE_OUT - delay) / 0.6)
        brick.visible = phase > SCALE_IN + delay && leaving < 1
        brick.position.y = restY + dropOffset((phase - SCALE_IN - delay) / 0.7) + easeOutCubic(leaving) * 9
      })

      packets.forEach((packet) => {
        if (!reduceMotion) {
          if (time < BUILD_DONE + packet.wait) return
          packet.travelled += packet.speed * delta
          if (packet.travelled >= packet.total) route(packet)
        }
        packet.mesh.visible = true
        place(packet)
      })

      const drift = reduceMotion ? 0 : Math.sin(time * 0.25) * 0.08
      rotationY += (pointer.x * 0.18 + drift - rotationY) * 0.05
      rotationX += (pointer.y * 0.05 - rotationX) * 0.05
      model.rotation.set(rotationX, rotationY, 0)

      model.updateMatrixWorld()
      const width = wrap.clientWidth
      const height = wrap.clientHeight
      const labelsIn = width >= LABEL_MIN_VIEWPORT && (reduceMotion || time > BUILD_DONE - 0.4)
      anchors.forEach((anchor, i) => {
        const label = labelRefs.current[i]
        if (!label) return
        projected.copy(anchor)
        board.localToWorld(projected).project(camera)
        const x = (projected.x * 0.5 + 0.5) * width
        const y = (-projected.y * 0.5 + 0.5) * height
        label.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
        label.style.opacity = labelsIn ? '1' : '0'
      })

      renderer.render(scene, camera)
    }

    const loop = (now: number) => {
      renderFrame(now)
      rafId = visible && onScreen && !reduceMotion ? window.requestAnimationFrame(loop) : null
    }
    const wake = () => {
      last = performance.now()
      if (rafId === null) rafId = window.requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) wake()
    }
    const resizeObserver = new ResizeObserver(() => {
      resize()
      wake()
    })
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) wake()
    })
    const themeObserver = new MutationObserver(() => {
      applyTheme()
      wake()
    })

    resize()
    wake()
    canvas.dataset.ready = 'true'

    resizeObserver.observe(wrap)
    intersectionObserver.observe(wrap)
    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('visibilitychange', onVisibility)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      themeObserver.disconnect()
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-20 lg:data-[ready=true]:opacity-60 xl:data-[ready=true]:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent_64%,black_86%)]"
      />
      {LABELLED.map((component, i) => (
        <span
          key={component.id}
          ref={(el) => {
            labelRefs.current[i] = el
          }}
          className="absolute left-0 top-0 opacity-0 transition-opacity duration-700 whitespace-nowrap rounded-full border border-border-color bg-card-bg px-2 py-0.5 font-montserrat text-[0.62rem] font-semibold uppercase leading-normal tracking-[0.12em] text-text-secondary"
        >
          {component.label}
        </span>
      ))}
    </div>
  )
}
