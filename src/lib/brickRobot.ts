import * as THREE from 'three'
import { BRICK_H, PLATE_H, Tone, type BrickStage } from '@/lib/brickKit'

/**
 * Builds the brick robot. Its origin is the bottom of its legs, which stand on a plate top at y = 0.
 * `parts` lists each piece that can come loose (legs, body, chest, arms, head) so a scene can
 * scatter them and put them back. Every part is a direct child of `bot`.
 */
export function buildRobot(stage: BrickStage) {
  const extras: { dispose: () => void }[] = []
  const glow = (color: string) => {
    const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.5 })
    extras.push(material)
    return material
  }
  const mesh = <G extends THREE.BufferGeometry>(geometry: G, material: THREE.Material) => {
    extras.push(geometry)
    return new THREE.Mesh(geometry, material)
  }
  const brick = (parent: THREE.Object3D, w: number, d: number, h: number, tone: Tone, x: number, y: number, z: number) => {
    const group = stage.makeBrick(w, d, h, tone)
    group.position.set(x, y, z)
    parent.add(group)
    return group
  }
  const ink = stage.materials.dark

  const bot = new THREE.Group()
  const legs = [-1, 1].map((x) => brick(bot, 1, 2, BRICK_H, 'dark', x, 0, 0))
  const body = brick(bot, 4, 2, BRICK_H, 'accent', 0, BRICK_H, 0)

  // The upper body brick carries the control panel and its three lamps
  const chest = brick(bot, 4, 2, BRICK_H, 'accent', 0, BRICK_H * 2, 0)
  const panel = mesh(new THREE.BoxGeometry(2, 1, 0.1), ink)
  panel.position.set(0, 0.1, 1.02)
  chest.add(panel)
  const lampGeometry = new THREE.SphereGeometry(0.16, 16, 16)
  extras.push(lampGeometry)
  ;['#7de3ff', '#ff4338', '#ffd60a'].forEach((color, i) => {
    const lamp = new THREE.Mesh(lampGeometry, glow(color))
    lamp.position.set(-0.55 + i * 0.55, 0.1, 1.1)
    chest.add(lamp)
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
  const mouth = mesh(new THREE.BoxGeometry(1.1, 0.16, 0.1), ink)
  mouth.position.set(0, 0.62, 1.52)
  const mast = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), ink)
  mast.position.y = 3.05
  const bulbMaterial = glow('#ff4338')
  const bulb = mesh(new THREE.SphereGeometry(0.26, 20, 20), bulbMaterial)
  bulb.position.y = 3.6
  head.add(mouth, mast, bulb)

  return {
    bot,
    head,
    eyes,
    arms,
    bulbMaterial,
    // In the order the robot is put back together: bottom up
    parts: { legLeft: legs[0], legRight: legs[1], body, chest, armLeft: arms[0], armRight: arms[1], head },
    dispose: () => extras.forEach((item) => item.dispose()),
  }
}
