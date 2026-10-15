import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export type Tone = 'plate' | 'neutral' | 'dark' | 'accent' | 'accentSoft' | 'wire' | 'packet'

// Classic brick colours; they read on both the day and night backgrounds
const PALETTE: Record<Tone, string> = {
  plate: '#dcdfe6',
  neutral: '#dcdfe6',
  dark: '#1a1f3d',
  accent: '#ffcd03',
  accentSoft: '#7de3ff',
  wire: '#c9d2ff',
  packet: '#e5281b',
}

// Sizes in stud units: a brick is 1.2 tall, a plate 0.4
export const PLATE_H = 0.4
export const BRICK_H = 1.2
const STUD_R = 0.3
const STUD_H = 0.21
// Wall and roof thickness of a hollow brick, as seen from underneath
const WALL = 0.16
const ROOF = 0.14

const currentTheme = (): 'light' | 'dark' => {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export type BrickStage = NonNullable<ReturnType<typeof createBrickStage>>

/**
 * Sets up a themed, shadowed three.js stage on a canvas and owns its render loop.
 * The loop only runs while the stage is on screen and the tab is visible; `time`
 * passed to the frame callback excludes the time spent paused.
 */
export function createBrickStage(wrap: HTMLElement, canvas: HTMLCanvasElement, options: { groundY?: number } = {}) {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200)

  // A faint studio reflection keeps the plastic from looking like flat paint
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  scene.environment = environment

  const hemi = new THREE.HemisphereLight(0xffffff, 0x8fa0c4, 0.36)
  const sun = new THREE.DirectionalLight(0xffffff, 0.8)
  sun.position.set(-8, 22, 12)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.radius = 5
  sun.shadow.normalBias = 0.03
  sun.shadow.camera.left = -12
  sun.shadow.camera.right = 12
  sun.shadow.camera.top = 12
  sun.shadow.camera.bottom = -12
  sun.shadow.camera.far = 60
  sun.shadow.bias = -0.0005
  scene.add(hemi, sun)

  const disposables: { dispose: () => void }[] = [environment]
  const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.12 })
  disposables.push(shadowMaterial)

  const materials = {} as Record<Tone, THREE.MeshPhysicalMaterial>
  const applyTheme = () => {
    const theme = currentTheme()
    ;(Object.keys(PALETTE) as Tone[]).forEach((tone) => {
      if (!materials[tone]) {
        materials[tone] = new THREE.MeshPhysicalMaterial({ roughness: 0.55, metalness: 0, clearcoat: 0.06, clearcoatRoughness: 0.6, envMapIntensity: 0.1 })
        disposables.push(materials[tone])
      }
      materials[tone].color.set(PALETTE[tone])
    })
    hemi.intensity = theme === 'light' ? 0.36 : 0.3
    shadowMaterial.opacity = theme === 'light' ? 0.22 : 0.4
  }
  applyTheme()

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), shadowMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = options.groundY ?? -2.6
  ground.receiveShadow = true
  disposables.push(ground.geometry)
  scene.add(ground)

  // A stud with a chamfered top edge, origin at its base
  const studGeometry = new THREE.LatheGeometry(
    [[STUD_R, 0], [STUD_R, STUD_H - 0.035], [STUD_R - 0.035, STUD_H], [0, STUD_H]].map(([x, y]) => new THREE.Vector2(x, y)),
    24,
  )
  disposables.push(studGeometry)

  const geometries = new Map<string, THREE.BufferGeometry>()
  const cached = <G extends THREE.BufferGeometry>(key: string, build: () => G) => {
    let geometry = geometries.get(key)
    if (!geometry) {
      geometry = build()
      geometries.set(key, geometry)
      disposables.push(geometry)
    }
    return geometry as G
  }
  const roundedRect = (target: THREE.Shape | THREE.Path, w: number, d: number, r: number) => {
    target.moveTo(-w / 2 + r, -d / 2)
    target.lineTo(w / 2 - r, -d / 2)
    target.absarc(w / 2 - r, -d / 2 + r, r, -Math.PI / 2, 0, false)
    target.lineTo(w / 2, d / 2 - r)
    target.absarc(w / 2 - r, d / 2 - r, r, 0, Math.PI / 2, false)
    target.lineTo(-w / 2 + r, d / 2)
    target.absarc(-w / 2 + r, d / 2 - r, r, Math.PI / 2, Math.PI, false)
    target.lineTo(-w / 2, -d / 2 + r)
    target.absarc(-w / 2 + r, -d / 2 + r, r, Math.PI, Math.PI * 1.5, false)
    return target
  }

  /**
   * A brick with its origin at the centre of its base. `hollow` builds the open
   * underside (walls, roof and tubes) for bricks that are seen from below.
   */
  const makeBrick = (w: number, d: number, h: number, tone: Tone, opts: { round?: boolean; studs?: boolean; hollow?: boolean } = {}) => {
    const brick = new THREE.Group()
    const material = materials[tone]
    const add = (geometry: THREE.BufferGeometry, y: number, x = 0, z = 0) => {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      brick.add(mesh)
    }

    if (opts.round) {
      add(cached(`round:${w}:${h}`, () => new THREE.CylinderGeometry(w / 2 - 0.04, w / 2 - 0.04, h, 40)), h / 2)
    } else if (opts.hollow) {
      const inner = h - ROOF
      add(
        cached(`walls:${w}:${d}:${h}`, () => {
          const outline = roundedRect(new THREE.Shape(), w - 0.04, d - 0.04, 0.06) as THREE.Shape
          outline.holes.push(roundedRect(new THREE.Path(), w - 0.04 - WALL * 2, d - 0.04 - WALL * 2, 0.03) as THREE.Path)
          return new THREE.ExtrudeGeometry(outline, { depth: inner, bevelEnabled: false, curveSegments: 4 }).rotateX(-Math.PI / 2)
        }),
        0,
      )
      add(cached(`roof:${w}:${d}`, () => new RoundedBoxGeometry(w - 0.04, ROOF, d - 0.04, 2, 0.05)), h - ROOF / 2)
      if (w > 1 && d > 1) {
        // Hollow tubes between each group of four studs
        const tube = cached(`tube:${h}`, () =>
          new THREE.LatheGeometry([[0.25, 0], [0.34, 0], [0.34, inner], [0.25, inner], [0.25, 0]].map(([x, y]) => new THREE.Vector2(x, y)), 20),
        )
        for (let i = 1; i < w; i++) for (let j = 1; j < d; j++) add(tube, 0, i - w / 2, j - d / 2)
      } else {
        // One-stud-wide bricks have thin posts instead
        const post = cached(`post:${h}`, () => new THREE.CylinderGeometry(0.15, 0.15, inner, 14).translate(0, inner / 2, 0))
        for (let i = 1; i < Math.max(w, d); i++) add(post, 0, w > 1 ? i - w / 2 : 0, d > 1 ? i - d / 2 : 0)
      }
    } else {
      add(cached(`box:${w}:${h}:${d}`, () => new RoundedBoxGeometry(w - 0.04, h, d - 0.04, 3, 0.06)), h / 2)
    }

    if (opts.studs !== false) {
      const studs = new THREE.InstancedMesh(studGeometry, material, w * d)
      const matrix = new THREE.Matrix4()
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < d; j++) {
          matrix.setPosition(i - w / 2 + 0.5, h, j - d / 2 + 0.5)
          studs.setMatrixAt(i * d + j, matrix)
        }
      }
      studs.castShadow = true
      studs.receiveShadow = true
      disposables.push(studs)
      brick.add(studs)
    }
    return brick
  }

  let onFrame: (time: number, delta: number) => void = () => {}
  let onResize: (width: number, height: number) => void = () => {}
  let rafId: number | null = null
  let started = false
  let tabVisible = document.visibilityState === 'visible'
  let onScreen = false
  let clock = 0
  let last = 0

  const loop = (now: number) => {
    const real = (now - last) / 1000
    last = now
    clock += real
    onFrame(clock, Math.min(real, 0.05))
    renderer.render(scene, camera)
    rafId = tabVisible && onScreen && !reduceMotion ? window.requestAnimationFrame(loop) : null
  }
  const wake = () => {
    if (!started || rafId !== null) return
    last = performance.now()
    rafId = window.requestAnimationFrame(loop)
  }

  const resizeObserver = new ResizeObserver(() => {
    const width = wrap.clientWidth
    const height = wrap.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    onResize(width, height)
    camera.updateProjectionMatrix()
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
  const onVisibility = () => {
    tabVisible = document.visibilityState === 'visible'
    if (tabVisible) wake()
  }

  return {
    scene,
    camera,
    ground,
    materials,
    reduceMotion,
    makeBrick,
    wake,
    start(handlers: { frame: (time: number, delta: number) => void; resize: (width: number, height: number) => void }) {
      onFrame = handlers.frame
      onResize = handlers.resize
      started = true
      resizeObserver.observe(wrap)
      intersectionObserver.observe(wrap)
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      document.addEventListener('visibilitychange', onVisibility)
      canvas.dataset.ready = 'true'
    },
    dispose() {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
    },
  }
}
