import { useEffect, useRef } from 'react'
import { site } from '../data/site'
import { useStore } from '../store'
import { scrollToSection } from '../scrollTo'

export function Nav() {
  const active = useStore((s) => s.activeSection)
  const phase = useStore((s) => s.phase)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (phase === 'idle' && ref.current) {
      const el = ref.current
      el.style.transition = 'opacity 1s ease 0.5s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.5s'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }
  }, [phase])

  return (
    <nav
      ref={ref}
      aria-label="Primary"
      className="fixed left-3 top-3 z-40 opacity-0 sm:left-6 sm:top-5"
      style={{ transform: 'translateY(-12px)' }}
    >
      <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-ink2/50 py-1.5 pl-2 pr-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <a
          href="#home"
          data-nav="home"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection('home')
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] font-disp text-[13px] font-semibold text-bone transition-colors hover:border-ice/40 hover:text-ice"
          aria-label="Nora — home"
        >
          N
        </a>
        <span className="mx-0.5 h-3.5 w-px bg-white/10" aria-hidden="true" />

        {/* mobile: compact jump dots with accessible labels */}
        <ul className="flex items-center gap-2 px-1 sm:hidden">
          {site.nav.slice(1).map((n) => (
            <li key={n.id}>
              <button
                aria-label={`Go to ${n.label}`}
                onClick={() => scrollToSection(n.id)}
                className={`h-1.5 w-1.5 rounded-full border transition-colors duration-300 ${
                  active === n.id ? 'border-ice bg-ice' : 'border-white/30 bg-transparent'
                }`}
              />
            </li>
          ))}
        </ul>

        {/* desktop: full labels */}
        <ul className="hidden items-center sm:flex">
          {site.nav.slice(1).map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                data-nav={n.id}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(n.id)
                }}
                aria-current={active === n.id ? 'true' : undefined}
                className={`relative rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${
                  active === n.id ? 'text-bone' : 'text-faint hover:text-bone'
                }`}
              >
                {n.label}
                <span
                  className={`absolute inset-x-3.5 bottom-[3px] h-px bg-ice transition-all duration-300 ${
                    active === n.id ? 'opacity-80' : 'scale-x-0 opacity-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <span className="ml-2 hidden items-center gap-1.5 lg:flex" aria-label={site.status}>
          <span className="relative flex h-1 w-1">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ice opacity-50" />
            <span className="relative inline-flex h-1 w-1 rounded-full bg-ice" />
          </span>
          <span className="whitespace-nowrap font-mono text-[8.5px] tracking-[0.16em] text-faint">
            OPEN FOR PROJECTS
          </span>
        </span>
      </div>
    </nav>
  )
}
