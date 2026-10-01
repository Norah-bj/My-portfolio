import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'
import { glowTexture } from './textures'

/** Identity section — a slowly tumbling glass-like shard, reflective and quiet. */
export function IdentityShard() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state, dt) => {
    if (useStore.getState().reducedMotion) return
    const m = ref.current
    if (!m) return
    m.rotation.y += dt * 0.18
    m.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.12
  })
  return (
    <group position={[-3.1, 0.2, -10.5]} rotation={[0.2, 0.4, -0.1]}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshPhysicalMaterial
          color="#c9d6f2"
          metalness={0.1}
          roughness={0.08}
          transmission={0.9}
          thickness={1.2}
          ior={1.4}
          transparent
          opacity={0.92}
        />
      </mesh>
      <pointLight position={[1.2, 1, 1]} color="#9db9ff" intensity={1.2} distance={5} />
    </group>
  )
}

/** Code×Design section — two planes that converge as the user scrolls. */
export function CodeDesignMerge() {
  const code = useRef<THREE.Group>(null)
  const design = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // idle drift; actual merge is camera-travel based
    if (code.current && !useStore.getState().reducedMotion) {
      code.current.position.y = Math.sin(t * 0.3) * 0.08
    }
    if (design.current && !useStore.getState().reducedMotion) {
      design.current.position.y = Math.cos(t * 0.26) * 0.08
    }
  })

  return (
    <group position={[0, 0, -26.0]}>
      {/* CODE side: pure line frames — logic as structure, receding in depth */}
      <group ref={code} position={[-2.4, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[-0.18 * i, -1.5 + i * 0.95, -0.5 * i]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.6, 0.42, 0.02)]} />
              <lineBasicMaterial color="#8fa6e0" transparent opacity={0.55 - i * 0.09} />
            </lineSegments>
            {/* faint fill so it catches light without becoming a slab */}
            <mesh position={[0, 0, -0.012]}>
              <planeGeometry args={[1.6, 0.42]} />
              <meshBasicMaterial color="#10131a" transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>

      {/* DESIGN side: orbit rings — soft, curved, breathing */}
      <group ref={design} position={[2.4, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.12 * i, -1.0 + i * 1.05, -0.4 * i]} rotation={[Math.PI / 2.4, i * 0.9, 0.2 * i]}>
            <torusGeometry args={[0.5 + i * 0.14, 0.028, 12, 64]}
            />
            <meshBasicMaterial color="#b79bff" transparent opacity={0.38 - i * 0.07} />
          </mesh>
        ))}
        <pointLight color="#b79bff" intensity={0.8} distance={5} position={[0, 0, 1]} />
      </group>

      {/* unified center form between them — where the two languages meet */}
      <mesh position={[0, 0.1, -0.3]} rotation={[0.4, 0.2, 0]}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#9db9ff" emissive="#9db9ff" emissiveIntensity={0.55} metalness={0.75} roughness={0.3} flatShading />
      </mesh>
    </group>
  )
}

/** Contact section — everything converges into one calm pulsing core. */
export function ContactCore() {
  const ref = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const haloTex = useMemo(() => glowTexture(), [])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const rm = useStore.getState().reducedMotion
    const s = rm ? 1 : 1 + Math.sin(t * 0.9) * 0.03
    ref.current?.scale.setScalar(s)
    if (halo.current) {
      halo.current.scale.setScalar((rm ? 1 : 1 + Math.sin(t * 0.9 + 0.6) * 0.04) * 3.2)
      const mat = halo.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.3 + Math.abs(Math.sin(t * 0.45)) * 0.12
    }
  })
  return (
    <group position={[0, -0.25, -34.5]}>
      {/* dark polished core — a quiet monolith, not a lamp */}
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#39415a" emissive="#24304e" emissiveIntensity={0.5} metalness={0.85} roughness={0.28} flatShading />
      </mesh>
      {/* inner light seam */}
      <mesh scale={0.55}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial color="#c9d9ff" transparent opacity={0.35} />
      </mesh>
      {/* additive halo behind */}
      <mesh ref={halo} position={[0, 0, -0.8]} scale={3.2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={haloTex}
          color="#4a5f9e"
          transparent
          opacity={0.34}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color="#9db9ff" intensity={1.1} distance={5} decay={2} />
    </group>
  )
}
