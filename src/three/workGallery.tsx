import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { projects, type Project } from '../data/projects'
import { useStore } from '../store'

function ProjectGeometry({ geometry }: { geometry: Project['geometry'] }) {
  switch (geometry) {
    case 'icosa':
      return <icosahedronGeometry args={[0.5, 0]} />
    case 'octa':
      return <octahedronGeometry args={[0.5, 0]} />
    case 'torus':
      return <torusGeometry args={[0.4, 0.15, 16, 40]} />
    case 'prism':
      return <cylinderGeometry args={[0.42, 0.42, 0.8, 3]} />
    case 'gem':
      return <octahedronGeometry args={[0.55, 0]} />
  }
}

function WireGeometry({ geometry }: { geometry: Project['geometry'] }) {
  switch (geometry) {
    case 'icosa':
    case 'octa':
    case 'gem':
      return <octahedronGeometry args={[0.5, 0]} />
    case 'torus':
      return <torusGeometry args={[0.4, 0.15, 8, 24]} />
    case 'prism':
      return <cylinderGeometry args={[0.42, 0.42, 0.8, 3]} />
  }
}

/**
 * Project monoliths along the corridor. Each reacts to cursor proximity
 * (R3F raycast hover), rotates slightly, glows, and neighbors repel on focus.
 */
export function WorkGallery() {
  const meshes = useRef<(THREE.Group | null)[]>([])
  const hoveredId = useRef<string | null>(null)
  const setCursor = useStore((s) => s.setCursor)

  const layout = useMemo(
    () =>
      projects.map((p, i) => ({
        p,
        x: 1.9 + (i % 2) * 0.55, // right column — DOM text owns the left
        y: i % 2 === 0 ? 0.35 : -0.35,
        z: -4.5 - i * 2.1,
      })),
    [],
  )

  const perMesh = useRef(projects.map(() => ({ hover: 0, focus: 0, target: 0 })))

  useFrame((state, dt) => {
    const st = useStore.getState()
    const active = st.activeProject
    const rm = st.reducedMotion
    const d = Math.min(dt, 0.05)
    const t = state.clock.elapsedTime
    layout.forEach((L, i) => {
      const m = meshes.current[i]
      if (!m) return
      const pd = perMesh.current[i]
      const isActive = active === L.p.id

      pd.hover += ((pd.target ?? 0) - pd.hover) * Math.min(1, d * 7)
      pd.focus += ((isActive ? 1 : 0) - pd.focus) * Math.min(1, d * 4)

      // neighbors repel while a project is focused
      let repel = 0
      if (active) {
        const ai = projects.findIndex((p) => p.id === active)
        const gap = Math.abs(i - ai)
        repel = gap === 1 ? 0.45 : gap === 2 ? 0.2 : 0
      }

      const idleY = rm ? 0 : Math.sin(t * 0.7 + i * 1.7) * 0.06
      m.position.y += ((L.y + idleY) - m.position.y) * Math.min(1, d * 3)
      m.position.x += ((L.x + repel) - m.position.x) * Math.min(1, d * 3)

      const idleSpin = rm ? 0 : t * 0.25 + i * 0.7
      const targetRot = idleSpin + pd.hover * 0.55 + pd.focus * 0.35
      m.rotation.y += (targetRot - m.rotation.y) * Math.min(1, d * 4)

      const targetScale = 1 + pd.hover * 0.08 + pd.focus * 0.1
      m.scale.setScalar(m.scale.x + (targetScale - m.scale.x) * Math.min(1, d * 5))

      const core = m.children[0] as THREE.Mesh
      const mat = core.material as THREE.MeshStandardMaterial
      const em = pd.hover * 0.55 + pd.focus * 0.8
      mat.emissiveIntensity += (em - mat.emissiveIntensity) * Math.min(1, d * 6)

      const wire = m.children[1] as THREE.Mesh
      const wmat = wire.material as THREE.MeshBasicMaterial
      wmat.opacity = 0.14 + pd.hover * 0.3 + pd.focus * 0.4
    })
  })

  const onOver = (i: number, e: ThreeEvent<PointerEvent>) => {
    const st = useStore.getState()
    perMesh.current[i].target = 1
    e.stopPropagation()
    if (!st.activeProject && !st.reducedMotion) {
      hoveredId.current = layout[i].p.id
      setCursor('VIEW PROJECT', true)
    }
  }
  const onOut = (i: number) => {
    perMesh.current[i].target = 0
    if (hoveredId.current === layout[i].p.id) {
      hoveredId.current = null
      setCursor(null, false)
    }
  }

  return (
    <group>
      {layout.map((L, i) => (
        <group
          key={L.p.id}
          ref={(el) => {
            meshes.current[i] = el
          }}
          position={[L.x, L.y, L.z]}
          onPointerOver={(e) => onOver(i, e)}
          onPointerOut={() => onOut(i)}
          onClick={(e) => {
            e.stopPropagation()
            if (!useStore.getState().activeProject) useStore.getState().openProject(L.p.id)
          }}
        >
          <mesh>
            <ProjectGeometry geometry={L.p.geometry} />
            <meshStandardMaterial
              color={L.p.color}
              metalness={0.55}
              roughness={0.32}
              emissive={L.p.color}
              emissiveIntensity={0}
              flatShading
            />
          </mesh>
          <mesh scale={1.22}>
            <WireGeometry geometry={L.p.geometry} />
            <meshBasicMaterial color={L.p.color} wireframe transparent opacity={0.14} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
