import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from './scroll'
import { useStore } from '../store'
import { dotTexture, glowTexture } from './textures'

/** Ambient dust motes drifting through the whole corridor. */
export function Dust({ count = 420 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const tex = useMemo(() => dotTexture(), [])

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = 4 - Math.random() * 26 - 2
      speeds[i] = 0.02 + Math.random() * 0.05
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, speeds, phases }
  }, [count])

  useFrame((state) => {
    const pts = ref.current
    if (!pts || useStore.getState().reducedMotion) return
    const t = state.clock.elapsedTime
    const arr = pts.geometry.attributes.position.array as Float32Array
    const mx = scrollState.mouse.x
    const my = scrollState.mouse.y
    for (let i = 0; i < count; i++) {
      const j = i * 3
      arr[j + 1] += speeds[i] * 0.016
      arr[j] += Math.sin(t * 0.4 + phases[i]) * 0.0012 + mx * 0.0016
      arr[j + 1] += my * 0.0012
      if (arr[j + 1] > 6) arr[j + 1] = -6
      if (arr[j] > 9) arr[j] = -9
      if (arr[j] < -9) arr[j] = 9
    }
    pts.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={2.6}
        sizeAttenuation={false}
        color="#9db9ff"
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Atmospheric glow planes — soft light pools in the distance.
 * Replaces the harsh vertical streaks (which read as scratches).
 */
export function GlowPlanes() {
  const group = useRef<THREE.Group>(null)
  const tex = useMemo(() => glowTexture(), [])

  const items = useMemo(
    () => [
      { pos: [0, 0.4, -3.5] as [number, number, number], scale: 7.5, color: '#3d4f86', base: 0.16 },
      { pos: [2.4, -0.6, -13] as [number, number, number], scale: 6, color: '#4a3f86', base: 0.12 },
      { pos: [-2.2, 0.8, -19] as [number, number, number], scale: 5.5, color: '#33456e', base: 0.1 },
    ],
    [],
  )

  useFrame((state) => {
    const g = group.current
    if (!g || useStore.getState().reducedMotion) return
    const t = state.clock.elapsedTime
    g.children.forEach((c, i) => {
      const it = items[i]
      const m = c as THREE.Mesh
      const mat = m.material as THREE.MeshBasicMaterial
      mat.opacity = it.base + Math.sin(t * 0.22 + i * 2.1) * 0.045
      m.position.y = it.pos[1] + Math.sin(t * 0.12 + i) * 0.25
    })
  })

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} scale={it.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={tex}
            color={it.color}
            transparent
            opacity={it.base}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
