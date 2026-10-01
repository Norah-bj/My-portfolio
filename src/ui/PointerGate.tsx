import { type ReactNode } from 'react'
import { useStore } from '../store'

/**
 * Sections sit above the WebGL canvas. To keep R3F raycasts alive for the
 * section currently on screen, a section only accepts pointer events while
 * it is the active section. Others pass events through to the canvas.
 */
export function PointerGate({
  id,
  children,
  className = '',
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  const active = useStore((s) => s.activeSection)
  const isActive = active === id
  return (
    <div
      data-section={id}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
      className={className}
    >
      {children}
    </div>
  )
}
