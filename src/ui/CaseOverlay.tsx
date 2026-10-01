import { useEffect, useRef } from 'react'
import { getProject, useStore } from '../store'
import { Magnetic } from './magnetic'
import { getLenis } from '../scrollTo'

/**
 * Case-study overlay: camera focuses the object, the world dims,
 * and the study types itself in with staggered reveals.
 *
 * Mobile scrolling: the overlay's own scroll layer is marked
 * data-lenis-prevent so Lenis never hijacks swipes inside it, and
 * the page Lenis instance is stopped while the overlay is open so
 * the background cannot scroll behind it.
 */
export function CaseOverlay() {
  const activeId = useStore((s) => s.activeProject)
  const close = useStore((s) => s.closeProject)
  const p = getProject(activeId)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastActive = useRef<string | null>(null)

  useEffect(() => {
    if (activeId) lastActive.current = activeId
  }, [activeId])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (activeId) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      getLenis()?.stop()
      const rows = el.querySelectorAll('[data-case-row]')
      rows.forEach((r, i) => {
        const h = r as HTMLElement
        h.style.transition = 'none'
        h.style.opacity = '0'
        h.style.transform = 'translateY(26px)'
        requestAnimationFrame(() => {
          h.style.transition = `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.09}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.09}s`
          h.style.opacity = '1'
          h.style.transform = 'translateY(0)'
        })
      })
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      getLenis()?.start()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId, close])

  // keep last project mounted during the exit fade
  const shown = p ?? getProject(lastActive.current)

  return (
    <div
      ref={panelRef}
      aria-modal="true"
      role="dialog"
      aria-label={shown ? `${shown.name} case study` : undefined}
      className={`fixed inset-0 z-[70] transition-opacity duration-500 ${
        activeId ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* dim + blur the world hard so the study is effortlessly readable */}
      <div className="absolute inset-0 bg-ink/92 backdrop-blur-2xl backdrop-saturate-50" onClick={close} />
      {/* extra radial darkening behind the text column */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(11,13,18,0.55), transparent 70%)' }}
      />
      {shown && (
        <div
          data-lenis-prevent
          className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* my-auto centers short content and grows with it, so nothing is
              clipped on small viewports and every section stays reachable */}
          <div className="relative mx-auto my-auto flex w-[min(92vw,880px)] flex-col py-24 sm:py-28 lg:w-[min(76vw,1080px)]">
            {/* sticky close: sits at the panel's top-right corner on every
                screen size and stays pinned there while the study scrolls */}
            <button
              onClick={close}
              aria-label="Close case study"
              data-cursor="link"
              className="sticky top-5 z-10 -mb-11 flex h-11 w-11 self-end items-center justify-center rounded-full border border-white/20 bg-ink/70 text-bone backdrop-blur-md transition-all hover:rotate-90 hover:border-ice/50 hover:text-ice"
            >
              ✕
            </button>

            <div data-case-row className="font-mono text-[10px] tracking-[0.3em] text-ice">
              {shown.index} / {shown.category} — {shown.year}
            </div>

            <h2
              data-case-row
              className="mt-4 text-balance font-disp text-[clamp(2.2rem,4.5vw_+_1.2rem,5.5rem)] font-semibold leading-[0.95] tracking-tight text-bone"
            >
              {shown.name}
            </h2>

            <p data-case-row className="mt-4 max-w-xl text-[15px] leading-relaxed text-bone/85">
              {shown.description}
            </p>

            <div className="mt-8 grid gap-x-12 gap-y-7 sm:mt-10 md:grid-cols-2 lg:gap-x-16">
              <div data-case-row>
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-ice/80">ROLE</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone">{shown.role}</p>
              </div>
              <div data-case-row>
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-ice/80">TECHNOLOGY</h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[12px] tracking-wider text-bone">
                  {shown.stack.map((t) => (
                    <span key={t} className="border-b border-ice/30 pb-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div data-case-row>
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-ice/80">PROBLEM</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone/75">{shown.problem}</p>
              </div>
              <div data-case-row>
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-ice/80">APPROACH</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone/75">{shown.approach}</p>
              </div>
              <div data-case-row className="md:col-span-2">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-ice/80">RESULT</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone">{shown.result}</p>
              </div>
            </div>

            <div data-case-row className="mt-10 flex flex-wrap items-center gap-5 sm:mt-12">
              <Magnetic
                onClick={() => window.open(shown.link, '_blank', 'noopener')}
                ariaLabel={`Open ${shown.name} live site`}
                className="group relative overflow-hidden rounded-full border border-ice/40 px-7 py-3 font-mono text-[11px] tracking-[0.25em] text-ice transition-colors hover:text-ink"
              >
                <span className="relative z-10">VIEW LIVE SITE ↗</span>
                <span className="absolute inset-0 -translate-x-full bg-ice transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              </Magnetic>
              <Magnetic
                onClick={() => window.open(shown.repo, '_blank', 'noopener')}
                ariaLabel={`Open ${shown.name} source code on GitHub`}
                className="group relative overflow-hidden rounded-full border border-white/20 px-7 py-3 font-mono text-[11px] tracking-[0.25em] text-bone transition-colors hover:border-ice/50 hover:text-ice"
              >
                <span className="relative z-10">VIEW CODE</span>
              </Magnetic>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
