import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '../data/skills'
import { useStore } from '../store'

interface Node {
  name: string
  pos: [number, number, number]
  phase: number
}

const CENTER: [number, number, number] = [0, -1.25, -23.5]

function prand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Organic constellation of skill nodes around a NORA core.
 * Hover (raycast): node glows, its links brighten, DOM panel shows detail.
 */
export function SkillConstellation({ lowQuality }: { lowQuality: boolean }) {
  const group = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])
  const lineRefs = useRef<unknown[]>([])
  const hovered = useRef<number>(-1)

  const nodes: Node[] = useMemo(() => {
    return skills.map((_, i) => {
      const a = (i / skills.length) * Math.PI * 2 + prand(i * 3 + 1) * 0.8
      const r = 1.9 + prand(i * 7 + 2) * 1.2
      const y = (prand(i * 13 + 3) - 0.5) * 2.0
      return {
        name: skills[i].name,
        pos: [Math.cos(a) * r, y, Math.sin(a) * r * 0.32] as [number, number, number],
        phase: prand(i * 17 + 4) * Math.PI * 2,
      }
    })
  }, [])

  const links = useMemo(() => {
    const ls: { a: number; b: number }[] = []
    for (let i = 0; i < skills.length; i++) {
      ls.push({ a: -1, b: i }) // -1 = center
      if (i > 0 && prand(i * 5 + 1) > 0.4) ls.push({ a: i - 1, b: i })
    }
    return ls
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const rm = useStore.getState().reducedMotion
    const d = Math.min(dt, 0.05)

    // gentle breathing of the whole constellation
    if (!rm) {
      g.rotation.y = Math.sin(t * 0.1) * 0.06
      g.rotation.x = Math.cos(t * 0.08) * 0.03
    }

    nodeRefs.current.forEach((m, i) => {
      if (!m) return
      const n = nodes[i]
      const isHov = hovered.current === i
      const target = isHov ? 1.6 : 1
      m.scale.setScalar(m.scale.x + (target - m.scale.x) * Math.min(1, d * 6))
      if (!rm) {
        m.position.y = n.pos[1] + Math.sin(t * 0.8 + n.phase) * 0.12
        m.position.x = n.pos[0] + Math.sin(t * 0.5 + n.phase * 2) * 0.05
      }
      const mat = m.material as THREE.MeshStandardMaterial
      const glow = isHov ? 1.3 : 0.25
      mat.emissiveIntensity += (glow - mat.emissiveIntensity) * Math.min(1, d * 5)
    })

    lineRefs.current.forEach((entry, li) => {
      if (!entry) return
      const line = entry as { material: THREE.Material & { opacity: number } }
      const l = links[li]
      if (!l) return
      const mat = line.material
      const active = hovered.current >= 0 && (l.a === hovered.current || l.b === hovered.current)
      const target = active ? 0.8 : 0.14
      mat.opacity += (target - mat.opacity) * Math.min(1, d * 6)
    })
  })

  const setHover = (i: number) => {
    if (hovered.current === i) return
    hovered.current = i
    const st = useStore.getState()
    st.setCursor(null, true)
    st.setSkillHover(i)
  }
  const clearHover = () => {
    if (hovered.current === -1) return
    hovered.current = -1
    const st = useStore.getState()
    st.setCursor(null, false)
    st.setSkillHover(null)
  }

  return (
    <group ref={group} position={CENTER}>
      {/* links */}
      {links.map((l, i) => {
        const pa = l.a === -1 ? [0, 0, 0] : nodes[l.a].pos
        const pb = nodes[l.b].pos
        return (
          <Line
            key={i}
            ref={(el: unknown) => {
              lineRefs.current[i] = el
            }}
            points={[pa as [number, number, number], pb as [number, number, number]]}
            color="#7d98e0"
            transparent
            opacity={0.22}
            lineWidth={1}
            dashed={false}
          />
        )
      })}

      {/* center node — NORA */}
      <mesh>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial
          color="#dfe4f2"
          emissive="#9db9ff"
          emissiveIntensity={0.35}
          metalness={0.75}
          roughness={0.25}
          flatShading
        />
      </mesh>

      {/* skill nodes */}
      {nodes.map((n, i) => (
        <mesh
          key={n.name}
          ref={(el) => {
            nodeRefs.current[i] = el
          }}
          position={n.pos}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHover(i)
          }}
          onPointerOut={() => clearHover()}
        >
          <icosahedronGeometry args={[lowQuality ? 0.18 : 0.13, 0]} />
          <meshStandardMaterial
            color={i % 2 ? '#b79bff' : '#9db9ff'}
            emissive={i % 2 ? '#b79bff' : '#9db9ff'}
            emissiveIntensity={0.25}
            metalness={0.6}
            roughness={0.35}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}
