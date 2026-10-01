import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

/**
 * About section — a floating identity card: rim frame, data lines,
 * a photo block. Sits right of the DOM text column.
 */
export function AboutCard() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return
    const rm = useStore.getState().reducedMotion
    if (!rm) {
      g.rotation.y = 0.32 + Math.sin(t * 0.3) * 0.14
      g.rotation.x = Math.cos(t * 0.22) * 0.06
      g.position.y = 0.35 + Math.sin(t * 0.6) * 0.06
    }
  })
  return (
    <group ref={group} position={[3.0, 0.35, -32.8]}>
      {/* glass slab */}
      <mesh>
        <boxGeometry args={[2.2, 1.4, 0.06]} />
        <meshPhysicalMaterial
          color="#0e1118"
          metalness={0.55}
          roughness={0.25}
          transmission={0.25}
          thickness={0.4}
          emissive="#141b2c"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* rim light frame */}
      <lineSegments scale={1.01}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.2, 1.4, 0.06)]} />
        <lineBasicMaterial color="#8fa6e0" transparent opacity={0.55} />
      </lineSegments>
      {/* data lines */}
      {[0.42, 0.24, 0.06].map((y, i) => (
        <mesh key={i} position={[-0.45, y, 0.045]}>
          <planeGeometry args={[0.95 - i * 0.22, 0.045]} />
          <meshBasicMaterial color="#6f8cd6" transparent opacity={0.65 - i * 0.15} />
        </mesh>
      ))}
      {/* muted sub-line */}
      <mesh position={[-0.45, -0.38, 0.045]}>
        <planeGeometry args={[0.6, 0.035]} />
        <meshBasicMaterial color="#3d4966" transparent opacity={0.8} />
      </mesh>
      {/* portrait block */}
      <mesh position={[0.72, 0.12, 0.045]}>
        <planeGeometry args={[0.5, 0.62]} />
        <meshBasicMaterial color="#1a2337" />
      </mesh>
      <lineSegments position={[0.72, 0.12, 0.05]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.5, 0.62)]} />
        <lineBasicMaterial color="#5f7cc0" transparent opacity={0.5} />
      </lineSegments>
      {/* inner glow */}
      <pointLight color="#9db9ff" intensity={0.5} distance={3.5} position={[0, 0, 1]} />
    </group>
  )
}
