import { useEffect, useRef } from 'react'
import { useStore } from '../store'

/**
 * Custom cursor — white dot + trailing ring with mix-blend-difference so it
 * stays visible on ANY surface (including the case-study overlay).
 * Sits above every layer (z-100). Desktop pointer:fine only.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const ringScale = useRef({ s: 1, t: 1 })
  const dotScale = useRef({ s: 1, t: 1 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current!
    const ringEl = ringRef.current!
    const label = labelRef.current!
    let raf = 0
    let shown = false

    const show = () => {
      if (!shown) {
        shown = true
        dot.style.opacity = '1'
        ringEl.style.opacity = '1'
      }
    }
    const hide = () => {
      shown = false
      dot.style.opacity = '0'
      ringEl.style.opacity = '0'
      label.style.opacity = '0'
    }

    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      show()
      const t = e.target as HTMLElement
      const interactive = t.closest('[data-cursor="link"], a, button')
      const big = t.closest('[data-cursor="big"]')
      ringScale.current.t = big ? 2.6 : interactive ? 1.9 : 1
      dotScale.current.t = big ? 0.45 : interactive ? 0.55 : 1
    }

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16
      ring.current.y += (pos.current.y - ring.current.y) * 0.16
      ringScale.current.s += (ringScale.current.t - ringScale.current.s) * 0.14
      dotScale.current.s += (dotScale.current.t - dotScale.current.s) * 0.2

      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%) scale(${dotScale.current.s.toFixed(3)})`
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%) scale(${ringScale.current.s.toFixed(3)})`

      const { cursorLabel, cursorHover } = useStore.getState()
      if (cursorLabel) {
        label.textContent = cursorLabel
        label.style.opacity = '1'
        label.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(16px, 16px)`
      } else {
        label.style.opacity = '0'
      }
      ringEl.style.borderColor = cursorHover ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)'
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    document.documentElement.addEventListener('pointerleave', hide)
    document.documentElement.addEventListener('pointerenter', show)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.documentElement.removeEventListener('pointerenter', show)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block"
      aria-hidden="true"
    >
      <div
        ref={ringRef}
        className="absolute h-8 w-8 rounded-full border opacity-0 mix-blend-difference"
        style={{ borderColor: 'rgba(255,255,255,0.5)', transition: 'border-color 0.25s, opacity 0.3s' }}
      />
      <div
        ref={dotRef}
        className="absolute h-2 w-2 rounded-full bg-white opacity-0 mix-blend-difference"
        style={{ transition: 'opacity 0.3s' }}
      />
      <div
        ref={labelRef}
        className="absolute font-mono text-[9px] tracking-[0.3em] text-ice opacity-0"
        style={{ transition: 'opacity 0.25s' }}
      >
        VIEW PROJECT
      </div>
    </div>
  )
}
