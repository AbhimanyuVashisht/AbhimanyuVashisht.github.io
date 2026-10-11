import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export type Tone = 'plate' | 'neutral' | 'dark' | 'accent' | 'accentSoft' | 'wire' | 'packet'

// Classic brick colours; they read on both the day and night backgrounds
const PALETTE: Record<Tone, string> = {
  plate: '#ffffff',
  neutral: '#f4f6ff',
  dark: '#14183a',
  accent: '#ffd60a',
  accentSoft: '#7de3ff',
  wire: '#c9d2ff',
  packet: '#ff4338',
}

// Sizes in stud units: a brick is 1.2 tall, a plate 0.4
export const PLATE_H = 0.4
export const BRICK_H = 1.2
const STUD_R = 0.3
const STUD_H = 0.2

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
    ;(Object.keys(PALETTE) as Tone[]).forEach((tone) => {
      if (!materials[tone]) {
        materials[tone] = new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.02 })
        disposables.push(materials[tone])
      }
      materials[tone].color.set(PALETTE[tone])
    })
    materials.packet.emissive.set(PALETTE.packet)
    materials.packet.emissiveIntensity = 0.45
    hemi.intensity = theme === 'light' ? 1.3 : 1.05
    shadowMaterial.opacity = theme === 'light' ? 0.22 : 0.4
  }
  applyTheme()

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), shadowMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = options.groundY ?? -2.6
  ground.receiveShadow = true
  disposables.push(ground.geometry)
  scene.add(ground)

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
  const makeBrick = (w: number, d: number, h: number, tone: Tone, opts: { round?: boolean; studs?: boolean } = {}) => {
    const brick = new THREE.Group()
    const body = new THREE.Mesh(bodyGeometry(w, h, d, !!opts.round), materials[tone])
    body.position.y = h / 2
    body.castShadow = true
    body.receiveShadow = true
    brick.add(body)

    if (opts.studs !== false) {
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
