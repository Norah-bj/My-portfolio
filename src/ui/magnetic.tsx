import { useRef, type ReactNode, type MouseEvent } from 'react'

/**
 * Magnetic wrapper — element leans toward the cursor within a radius,
 * springs back on leave. Used for socials and key CTAs.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = '',
  onClick,
  ariaLabel,
}: {
  children: ReactNode
  strength?: number
  className?: string
  onClick?: () => void
  ariaLabel?: string
}) {
  const ref = useRef<HTMLButtonElement>(null)

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    el.style.transition = 'transform 0.18s cubic-bezier(0.22,1,0.36,1)'
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)'
    el.style.transform = 'translate(0px, 0px)'
  }

  return (
    <button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  )
}
