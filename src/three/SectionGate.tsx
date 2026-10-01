import { useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { continuousIndex } from './scroll'

/**
 * Progressive disclosure for the 3D world: a group is only rendered while
 * the camera's continuous section index is near its section. Kills
 * far-object bleed between sections and saves draw calls.
 */
export function SectionGate({
  index,
  band = 0.95,
  children,
}: {
  index: number
  band?: number
  children: ReactNode
}) {
  const ref = useRef<Group>(null)
  const [active, setActive] = useState(false)

  useFrame(() => {
    const g = ref.current
    if (!g) return
    // continuousIndex() ≈ i + 0.5 at a section's visual center, so measure
    // distance to the section CENTER, not its start.
    const idx = continuousIndex()
    const dist = Math.abs(idx - (index + 0.5))
    const nextActive = dist < band || (active && dist < band + 0.2)
    g.visible = nextActive
    if (nextActive !== active) setActive(nextActive)
  })

  return <group ref={ref}>{active ? children : null}</group>
}
