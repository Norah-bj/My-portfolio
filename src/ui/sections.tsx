import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import { socials } from '../data/socials'
import { site } from '../data/site'
import { useStore } from '../store'
import { Magnetic } from './magnetic'
import { scrollToSection } from '../scrollTo'
import { PointerGate } from './PointerGate'

/* ---------------------------------- HERO ---------------------------------- */

export function Hero() {
  const phase = useStore((s) => s.phase)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (phase === 'idle' && ref.current) {
      ref.current.querySelectorAll('[data-hero]').forEach((el, i) => {
        const h = el as HTMLElement
        const delay = i === 0 ? 0.1 : i === 1 ? 0.45 : i === 2 ? 0.85 : 1.15
        h.style.transition = `opacity 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}s, filter 1.2s ${delay}s`
        h.style.opacity = '1'
        h.style.transform = 'translateY(0)'
        h.style.filter = 'blur(0)'
      })
    }
  }, [phase])

  return (
    <section id="home" ref={ref} className="relative flex h-dvh flex-col items-center justify-center" aria-label="Intro">
      {/* single wrapper owns the scroll-exit parallax, so per-element intro
          transforms can never be captured as stale GSAP start values */}
      <div className="hero-exit flex flex-col items-center">
      <p
        data-hero
        className="font-mono text-[10px] tracking-[0.45em] text-mute opacity-0"
        style={{ transform: 'translateY(20px)', filter: 'blur(6px)' }}
      >
        RWANDA — PORTFOLIO 2026
      </p>
      <h1
        data-hero
        className="mt-6 font-disp text-[clamp(4.5rem,17vw,15rem)] font-bold leading-[0.85] tracking-[-0.02em] text-bone opacity-0"
        style={{ transform: 'translateY(60px)', filter: 'blur(10px)' }}
      >
        NORA
      </h1>
      <div
        data-hero
        className="mt-2 flex items-center justify-center gap-3 opacity-0 sm:gap-4"
        style={{ transform: 'translateY(30px)', filter: 'blur(6px)' }}
      >
        <span className="h-px w-5 shrink-0 bg-ice shadow-[0_0_8px_rgba(157,185,255,0.9)] sm:w-10" />
        <h2 className="whitespace-nowrap font-disp text-[clamp(0.72rem,3.3vw,1.6rem)] font-light tracking-[0.18em] text-ice">
          FULL-STACK DEVELOPER
        </h2>
        <span className="h-px w-5 shrink-0 bg-ice shadow-[0_0_8px_rgba(157,185,255,0.9)] sm:w-10" />
      </div>
      <p
        data-hero
        className="mt-8 max-w-[88vw] px-2 text-center font-mono text-[9px] leading-relaxed tracking-[0.14em] text-mute opacity-0 sm:text-[10px] sm:tracking-[0.2em]"
        style={{ transform: 'translateY(16px)', filter: 'blur(4px)' }}
      >
        FULL-STACK DEVELOPMENT × CREATIVE DEVELOPMENT × INTERACTIVE DESIGN
      </p>
      </div>
      <div
        data-hero
        className="absolute bottom-10 flex flex-col items-center gap-2 opacity-0"
        style={{ transform: 'translateY(14px)' }}
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-faint">SCROLL TO EXPLORE</span>
        <span className="block h-8 w-px animate-scroll-hint bg-gradient-to-b from-ice to-transparent" />
      </div>
    </section>
  )
}

/* -------------------------------- IDENTITY -------------------------------- */

export function Identity() {
  const words = site.heroWords
  return (
    <section id="identity" className="relative flex h-[130vh] flex-col justify-center" aria-label="Identity">
      <div className="mx-auto w-[min(90vw,1100px)]">
        {words.map((w, i) => (
          <h3
            key={w}
            data-reveal
            className={`font-disp font-semibold tracking-tight text-bone/95 ${
              i === 0
                ? 'text-[clamp(3rem,7.4vw,7.4rem)] leading-[0.95]'
                : i === 1
                  ? 'ml-[8vw] text-[clamp(2.2rem,5.4vw,4rem)] sm:ml-[12vw]'
                  : i === 2
                    ? 'ml-[16vw] text-[clamp(1.6rem,4.2vw,3.2rem)] text-mute sm:ml-[24vw]'
                    : 'text-[clamp(2.8rem,8vw,6.5rem)]'
            }`}
          >
            {w}
          </h3>
        ))}
        <p data-reveal className="mt-10 text-center font-mono text-[10px] leading-relaxed tracking-[0.2em] text-faint">
          A DISCIPLINE LADDER — EACH RUNG BUILDS ON THE LAST.
        </p>
      </div>
    </section>
  )
}

/* ---------------------------------- WORK ---------------------------------- */

export function Work() {
  const openProject = useStore((s) => s.openProject)
  const ref = useRef<HTMLElement>(null)

  return (
    <PointerGate id="work" className="relative">
    <section id="work" ref={ref} className="relative" aria-label="Selected work">
      <header className="flex h-[42vh] flex-col items-center justify-center">
        <p data-reveal className="font-mono text-[10px] tracking-[0.4em] text-faint">
          2023 — 2026
        </p>
        <h2 data-reveal className="mt-3 font-disp text-[clamp(2.4rem,7vw,5.5rem)] font-semibold tracking-tight text-bone">
          SELECTED WORK
        </h2>
        <p data-reveal className="mt-3 text-center font-mono text-[10px] tracking-[0.3em] text-mute">
          FIVE OBJECTS ALONG THE CORRIDOR. HOVER TO WAKE THEM. CLICK TO ENTER.
        </p>
      </header>

      <ul className="ml-[6vw] w-[min(70vw,560px)] space-y-[26vh] pb-[12vh] md:w-[min(52vw,560px)] lg:ml-[10vw] lg:w-[min(38vw,520px)]">
        {projects.map((p) => (
          <li key={p.id} id={`work-${p.id}`} data-reveal className="group relative">
            <button
              onClick={() => openProject(p.id)}
              data-cursor="link"
              aria-label={`Open ${p.name} case study`}
              className="block w-full text-left"
            >
              <div className="flex items-baseline justify-between border-b border-white/10 pb-3 transition-colors group-hover:border-ice/40">
                <span className="font-mono text-[10px] tracking-[0.3em] text-faint">{p.index}</span>
                <span className="font-mono text-[10px] tracking-[0.3em] text-faint">{p.year}</span>
              </div>
              <h3 className="mt-4 font-disp text-[clamp(1.8rem,5vw,3.2rem)] font-medium tracking-tight text-bone transition-all duration-500 group-hover:translate-x-2 group-hover:text-ice">
                {p.name}
              </h3>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.25em] text-mute">{p.category}</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mute transition-colors duration-500 group-hover:text-bone/85">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] tracking-wider text-faint">
                {p.stack.map((s) => (
                  <span key={s}>{s.toUpperCase()}</span>
                ))}
              </div>
              <span className="mt-4 inline-block font-mono text-[10px] tracking-[0.3em] text-ice opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                VIEW CASE STUDY →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
    </PointerGate>
  )
}

/* ------------------------------- EXPERIMENTS ------------------------------ */

export function Experiments() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      el.style.transform = `translate(${dx * 14}px, ${dy * 8}px) skewX(${dx * -4}deg)`
      el.style.letterSpacing = `${0.02 + Math.abs(dx) * 0.06}em`
    }
    const t = sectionRef.current
    t?.addEventListener('mousemove', onMove)
    return () => t?.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section id="experiments" ref={sectionRef} className="relative h-[160vh]" aria-label="Experiments">
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center">
        <p data-reveal className="font-mono text-[10px] tracking-[0.4em] text-faint">
          PLAYGROUND
        </p>
        <h2
          ref={titleRef}
          data-reveal
          className="mt-4 font-disp text-[clamp(2.6rem,9vw,7rem)] font-bold tracking-[0.02em] text-bone will-change-transform"
        >
          EXPERIMENTS
        </h2>
        <p data-reveal className="mt-4 max-w-md px-6 text-center text-sm leading-relaxed text-mute">
          The particle field behind this text reacts to your cursor. Move through it — the wake is
          real time simulation, running behind the type.
        </p>
      </div>
    </section>
  )
}

/* --------------------------------- SKILLS --------------------------------- */

export function Skills() {
  const hover = useStore((s) => s.skillHover)
  const active = hover !== null ? skills[hover] : null

  return (
    <PointerGate id="skills" className="relative h-[150vh]">
    <section id="skills" className="relative h-[150vh]" aria-label="Skills">
      <div className="sticky top-0 flex h-dvh flex-col items-center pt-[16vh] sm:pt-[19vh]">
        <p data-reveal className="font-mono text-[10px] tracking-[0.4em] text-faint">
          INSTRUMENTS
        </p>
        <h2 data-reveal className="mt-3 font-disp text-[clamp(2.4rem,7vw,5.5rem)] font-semibold tracking-tight text-bone">
          THE CONSTELLATION
        </h2>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* info panel appears when a node is hovered in the 3D scene */}
          <div
            aria-live="polite"
            className={`w-[min(84vw,340px)] rounded-xl border border-white/10 bg-ink2/70 p-5 backdrop-blur-md transition-all duration-300 ${
              active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
          >
            {active && (
              <>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-disp text-lg font-medium text-bone">{active.name}</h3>
                  <span className="font-mono text-[9px] tracking-[0.3em] text-ice">{active.group}</span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mute">{active.detail}</p>
              </>
            )}
          </div>
        </div>

        <p className="absolute bottom-12 px-6 text-center font-mono text-[9px] tracking-[0.35em] text-faint">
          HOVER THE NODES
        </p>
      </div>
    </section>
    </PointerGate>
  )
}

/* ------------------------------ CODE × DESIGN ----------------------------- */

export function CodeDesign() {
  const ref = useRef<HTMLElement>(null)

  return (
    <section id="codexdesign" ref={ref} className="relative flex h-[170vh] flex-col justify-center" aria-label="Code and design">
      <div className="mx-auto w-[min(90vw,1000px)]">
        <h2 data-reveal className="font-disp text-[clamp(2rem,5.5vw,4.2rem)] font-light tracking-[0.08em] text-mute">
          CODE <span className="text-faint">×</span> DESIGN
        </h2>
        <div className="mt-14 space-y-6">
          <p data-reveal className="font-mono text-[clamp(1rem,2.4vw,1.5rem)] tracking-[0.14em] text-ice">
            {site.codeDesign.code}
          </p>
          <p data-reveal className="text-right font-disp text-[clamp(1.2rem,3.2vw,2.1rem)] font-light italic tracking-wide text-bone/90">
            {site.codeDesign.design}
          </p>
        </div>
        <div data-reveal className="mt-16 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-[9px] tracking-[0.35em] text-faint">MERGE POINT</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
      </div>
      <p className="absolute bottom-8 left-1/2 w-[min(90vw,560px)] -translate-x-1/2 text-center font-mono text-[9px] tracking-[0.3em] text-faint">
        TWO DISCIPLINES, ONE SURFACE
      </p>
    </section>
  )
}

/* ---------------------------------- ABOUT --------------------------------- */

export function About() {
  return (
    <section id="about" className="relative flex h-[140vh] items-center" aria-label="About Nora">
      <div className="ml-[8vw] max-w-[420px] md:max-w-[440px] lg:ml-[12vw] lg:max-w-[480px]">
        <p data-reveal className="font-mono text-[10px] tracking-[0.4em] text-faint">
          WHO
        </p>
        <h2 data-reveal className="mt-4 font-disp text-[clamp(3rem,8vw,6.5rem)] font-semibold tracking-tight text-bone">
          NORA
        </h2>
        <div data-reveal className="mt-3 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-mute">
          <span>FULL-STACK DEVELOPER</span>
          <span className="h-1 w-1 rounded-full bg-ice" />
          <span>RWANDA</span>
        </div>
        <p data-reveal className="mt-8 text-sm leading-relaxed text-mute">
          Interested in software engineering, creative frontend development, interactive
          experiences, AI, systems, and design — and in the space where they overlap.
        </p>
        <p data-reveal className="mt-4 text-sm leading-relaxed text-mute">
          Mugisha Ineza Nora, known publicly as Nora, is a computer science student and creative
          developer from Rwanda building interactive digital experiences, software systems, and
          thoughtful interfaces.
        </p>
        <div data-reveal className="mt-10 flex flex-wrap gap-2">
          {['SOFTWARE ENGINEERING', 'CREATIVE FRONTEND', 'INTERACTIVE', 'AI', 'SYSTEMS', 'DESIGN'].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[9px] tracking-[0.22em] text-mute transition-colors hover:border-ice/40 hover:text-ice"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- CONTACT -------------------------------- */

export function Contact() {
  const firePulse = useStore((s) => s.firePulse)
  const ref = useRef<HTMLElement>(null)

  return (
    <section id="contact" ref={ref} className="relative flex min-h-dvh flex-col items-center justify-center pb-8 sm:pb-16" aria-label="Contact">
      <p data-reveal className="font-mono text-[10px] tracking-[0.45em] text-faint">
        {site.contact.question}
      </p>
      <h2 data-reveal className="mt-5 font-disp text-[clamp(3rem,10vw,8rem)] font-bold tracking-tight text-bone">
        {site.contact.answer}
      </h2>

      <div data-reveal className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        {socials.map((s) => (
          <Magnetic
            key={s.label}
            ariaLabel={`${s.label} — ${s.handle}`}
            onClick={() => window.open(s.href, '_blank', 'noopener')}
            className="group relative overflow-hidden rounded-full border border-white/15 px-8 py-3.5 transition-colors hover:border-ice/50"
          >
            <span className="relative z-10 font-mono text-[11px] tracking-[0.28em] text-bone transition-colors group-hover:text-ink">
              {s.label}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-ice transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
          </Magnetic>
        ))}
      </div>

      <button
        data-reveal
        onClick={() => {
          firePulse()
          scrollToSection('home')
        }}
        data-cursor="link"
        className="mt-20 font-mono text-[9px] tracking-[0.4em] text-faint transition-colors hover:text-ice"
      >
        ↑ BACK TO THE SURFACE
      </button>
    </section>
  )
}

/* --------------------------------- FOOTER --------------------------------- */

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-8 py-6 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <span className="font-disp text-sm font-semibold tracking-[0.3em] text-bone">NORA</span>
        <span className="font-mono text-[9px] tracking-[0.25em] text-faint">
          © {site.year} — {site.location.toUpperCase()}
        </span>
        <span className="font-mono text-[9px] tracking-[0.14em] text-faint">{site.tagline}</span>
      </div>
    </footer>
  )
}
