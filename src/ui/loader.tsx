import { useEffect, useRef } from 'react'
import { useStore } from '../store'

/**
 * Load sequence: rAF-driven progress (immune to main-thread stalls that
 * throttle setInterval), with a hard cap so the loader can never trap
 * the experience — even on very slow hardware.
 */
export function Loader() {
  const phase = useStore((s) => s.phase)
  const ref = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const p = useRef(0)

  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const tick = () => {
      const el = performance.now() - t0
      // eased fill: fast start, decelerating, guaranteed done at 2.4s
      const lin = Math.min(1, el / 2400)
      p.current = Math.min(100, 100 * (1 - Math.pow(1 - lin, 2.2)))
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.current / 100})`
      if (numRef.current) numRef.current.textContent = String(Math.round(p.current)).padStart(3, '0')
      if (lin < 1) raf = requestAnimationFrame(tick)
      else {
        useStore.getState().setProgress(100)
        setTimeout(() => useStore.getState().setPhase('intro'), 250)
        setTimeout(() => useStore.getState().setPhase('idle'), 1250)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (nameRef.current && phase !== 'boot') {
      nameRef.current.style.opacity = '1'
      nameRef.current.style.transform = 'translateY(0)'
    }
    if (phase === 'idle' && ref.current) {
      const el = ref.current
      el.style.transition = 'opacity 0.9s ease, visibility 0.9s'
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
      el.style.pointerEvents = 'none'
    }
  }, [phase])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink"
      role="status"
      aria-label="Loading portfolio"
    >
      <div
        ref={nameRef}
        className="font-disp text-[clamp(2.4rem,8vw,6rem)] font-semibold tracking-[0.32em] text-bone opacity-0"
        style={{ transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)' }}
      >
        NORA
      </div>
      <div className="mt-8 h-px w-[min(58vw,380px)] overflow-hidden bg-faint/40">
        <div ref={barRef} className="h-full w-full origin-left bg-ice/80" style={{ transform: 'scaleX(0)' }} />
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-[0.35em] text-mute">
        <span ref={numRef}>000</span> — CALIBRATING ENVIRONMENT
      </div>
    </div>
  )
}
