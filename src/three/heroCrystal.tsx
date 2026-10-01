import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from './scroll'

/**
 * The hero object: a faceted crystalline monolith.
 * Icosahedron shell with flat shading + an inner glowing core + orbiting shards.
 */
export function HeroCrystal({ lowQuality, reducedMotion }: { lowQuality: boolean; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const shell = useRef<THREE.Mesh>(null)
  const core = useRef<THREE.Mesh>(null)
  const shards = useRef<THREE.Group>(null)

  const shardData = useMemo(
    () =>
      Array.from({ length: lowQuality ? 5 : 9 }, (_, i) => {
        const a = (i / (lowQuality ? 5 : 9)) * Math.PI * 2
        const r = 1.65 + Math.random() * 0.5
        return {
          pos: [Math.cos(a) * r, (Math.random() - 0.5) * 1.6, Math.sin(a) * r] as [number, number, number],
          scale: 0.05 + Math.random() * 0.09,
          speed: 0.12 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
        }
      }),
    [lowQuality],
  )

  useFrame((state, dt) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return

    // idle rotation
    g.rotation.y += dt * 0.12
    shell.current!.rotation.x = Math.sin(t * 0.2) * 0.08
    shell.current!.rotation.z = Math.cos(t * 0.16) * 0.06

    // breathing scale
    const breathe = 1 + Math.sin(t * 0.6) * 0.015
    shell.current!.scale.setScalar(breathe)

    // mouse-reactive tilt
    const mx = scrollState.mouse.x
    const my = scrollState.mouse.y
    g.rotation.x += (my * 0.14 - g.rotation.x) * 0.04
    g.rotation.z += (mx * -0.1 - g.rotation.z) * 0.04

    // core pulse
    const s = 0.42 + Math.sin(t * 1.1) * 0.02
    core.current!.scale.setScalar(s)

    // orbiting shards
    if (shards.current) {
      shards.current.children.forEach((c, i) => {
        const d = shardData[i]
        c.rotation.y += dt * d.speed * 2
        c.rotation.x += dt * d.speed
        c.position.y = d.pos[1] + Math.sin(t * d.speed * 2 + d.phase) * 0.18
      })
      shards.current.rotation.y -= dt * 0.05
    }
  })

  return (
    <group ref={group}>
      {/* faceted shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#232c44"
          metalness={0.65}
          roughness={0.3}
          flatShading
        />
      </mesh>

      {/* wireframe overlay — structural, not decorative */}
      <mesh scale={1.002}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#5f7cc0" wireframe transparent opacity={0.14} />
      </mesh>

      {/* glowing core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#c9d9ff" transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0, 0]} color="#9db9ff" intensity={2.2} distance={6} decay={2} />

      {/* orbiting shards */}
      <group ref={shards}>
        {shardData.map((d, i) => (
          <mesh key={i} position={d.pos} scale={d.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#8ea6e8" metalness={0.55} roughness={0.35} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}
