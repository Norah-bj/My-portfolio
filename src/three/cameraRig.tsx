import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { continuousIndex, scrollState } from './scroll'
import { useStore } from '../store'

/** Camera keyframes, one per section, in world space. */
const KEYS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 0.4, 7.2], look: [0, 0, 0] }, // home — face the crystal
  { pos: [1.6, 0.9, 2.4], look: [-3.1, 0.2, -10.5] }, // identity — face the shard
  { pos: [0, 0.15, -1.2], look: [0, 0, -10.5] }, // work — glide the corridor
  { pos: [0, 0, -3.2], look: [0, 0, -11.5] }, // experiments — inside the field
  { pos: [0, 0.1, -14.5], look: [0, 0, -23.5] }, // skills — face the constellation
  { pos: [0, 0.3, -21.5], look: [-0.5, 0, -26.0] }, // code × design — the merge
  { pos: [0, 0.25, -27.0], look: [1.35, 0.3, -32.2] }, // about — text left, card right
  { pos: [0, 0, -30.5], look: [0, -0.1, -34.5] }, // contact — one calm core
]

const posA = new THREE.Vector3()
const posB = new THREE.Vector3()
const lookA = new THREE.Vector3()
const lookB = new THREE.Vector3()
const tmp = new THREE.Vector3()
const pullDir = new THREE.Vector3()

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/**
 * Section timing: HOLD each section's key for the first 62% of its span,
 * then transition to the next key. Gives every section a stable rest
 * composition and cinematic moves between them.
 */
function keyBlend(idx: number): { i0: number; f: number } {
  const i0 = Math.floor(idx)
  const raw = idx - i0
  const HOLD = 0.62
  if (raw < HOLD || i0 >= KEYS.length - 1) return { i0, f: 0 }
  return { i0, f: easeInOut((raw - HOLD) / (1 - HOLD)) }
}

export function CameraRig() {
  const { camera, size } = useThree()
  const cur = useRef(new THREE.Vector3(0, 0.4, 7.2))
  const curLook = useRef(new THREE.Vector3(0, 0, 0))
  const intro = useRef(0)

  useEffect(() => {
    camera.position.copy(cur.current)
  }, [camera])

  // narrow viewports pull the camera back so objects never fill the frame
  const pull = size.width < 768 ? 1.85 : size.width < 1100 ? 1.25 : 1

  useFrame((_, dt) => {
    const st = useStore.getState()
    const mobile = st.quality === 'low'
    const rm = st.reducedMotion
    const d = Math.min(dt, 0.05)

    if (st.phase === 'intro' || st.phase === 'boot' || st.phase === 'loading') {
      // cinematic dolly-in during the load sequence
      intro.current = Math.min(1, intro.current + d / (rm ? 0.4 : 1.6))
      const e = 1 - Math.pow(1 - intro.current, 3)
      camera.position.set(0, 0.4 + (1 - e) * 1.6, 7.2 + (1 - e) * 6.5)
      camera.lookAt(0, 0, 0)
      return
    }

    const { i0, f } = keyBlend(continuousIndex())
    const a = KEYS[Math.min(i0, KEYS.length - 1)]
    const b = KEYS[Math.min(i0 + 1, KEYS.length - 1)]

    posA.set(...a.pos)
    posB.set(...b.pos)
    lookA.set(...a.look)
    lookB.set(...b.look)
    posA.lerp(posB, f)
    lookA.lerp(lookB, f)

    // mobile pull-back: keep the same look target, retreat along the view axis
    if (pull !== 1) {
      pullDir.subVectors(posA, lookA).multiplyScalar(pull - 1)
      posA.add(pullDir)
    }

    // mouse parallax — reduced on mobile
    const m = scrollState.mouse
    const par = mobile ? 0.12 : 0.45
    tmp.set(m.x * par, -m.y * par * 0.6, 0)
    posA.add(tmp)

    // smooth follow
    const k = 1 - Math.pow(0.0001, d)
    cur.current.lerp(posA, k)
    curLook.current.lerp(lookA, k)
    camera.position.copy(cur.current)
    camera.lookAt(curLook.current)
  })

  return null
}
