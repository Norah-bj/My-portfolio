import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from './scroll'
import { useStore } from '../store'
import { dotTexture } from './textures'

/**
 * Experiments section — a mouse-reactive particle field
 * that swirls near the camera path and leaves a cursor "wake".
 */
export function ParticleField({ lowQuality }: { lowQuality: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const tex = useMemo(() => dotTexture(), [])
  const COUNT = lowQuality ? 300 : 700

  const { positions, base, speed } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const base = new Float32Array(COUNT * 3)
    const speed = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 11
      const y = (Math.random() - 0.5) * 7
      const z = -9.5 - Math.random() * 4
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
      speed[i] = 0.4 + Math.random() * 0.8
    }
    return { positions, base, speed }
  }, [COUNT])

  useFrame((state, dt) => {
    const pts = ref.current
    if (!pts || useStore.getState().reducedMotion) return
    const t = state.clock.elapsedTime
    const d = Math.min(dt, 0.05)
    const arr = pts.geometry.attributes.position.array as Float32Array
    const mx = scrollState.mouse.x
    const my = scrollState.mouse.y

    for (let i = 0; i < COUNT; i++) {
      const j = i * 3
      // slow orbital drift
      const a = t * 0.05 * speed[i]
      const ox = base[j]
      const oy = base[j + 1]
      const rx = ox * Math.cos(a) - oy * Math.sin(a)
      const ry = ox * Math.sin(a) + oy * Math.cos(a)
      // cursor wake: push particles away from mouse ray
      const dx = arr[j] - mx * 4.2
      const dy = arr[j + 1] - my * 2.6
      const dist = Math.hypot(dx, dy)
      const push = Math.max(0, 1 - dist / 2.2) * 0.9
      arr[j] = rx + (dist > 0.001 ? (dx / dist) * push : 0)
      arr[j + 1] = ry + (dist > 0.001 ? (dy / dist) * push : 0)
      arr[j + 2] = base[j + 2] + Math.sin(t * 0.4 + i) * 0.25
    }
    void d
    pts.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={3.4}
        sizeAttenuation={false}
        color="#9db9ff"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

