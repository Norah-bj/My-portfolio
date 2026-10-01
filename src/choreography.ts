import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { scrollState, registerSections, currentSection } from './three/scroll'
import { useStore } from './store'
import { setLenis } from './scrollTo'

/**
 * Wires Lenis + ScrollTrigger + the 3D scrollState singleton.
 * One system drives the DOM timeline and the camera path.
 */
export function initChoreography() {
  gsap.registerPlugin(ScrollTrigger)

  const reduced = useStore.getState().reducedMotion
  const lenis = new Lenis({
    duration: reduced ? 0 : 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduced,
    touchMultiplier: 1.4,
  })
  setLenis(lenis)

  // single rAF driving Lenis → ScrollTrigger → 3D state
  let raf = 0
  const loop = (time: number) => {
    lenis.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  lenis.on('scroll', () => {
    scrollState.y = window.scrollY
    scrollState.vh = window.innerHeight
    scrollState.p = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    useStore.getState().setActiveSection(currentSection())
  })

  // ---- mouse for 3D parallax (shared singleton) ----
  const onMouse = (e: PointerEvent) => {
    scrollState.mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
    scrollState.mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onMouse, { passive: true })

  // ---- measure sections for the camera path ----
  const measure = () => {
    const ids = ['home', 'identity', 'work', 'experiments', 'skills', 'codexdesign', 'about', 'contact']
    const spans = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { id: el.id, start: r.top + window.scrollY, end: r.top + window.scrollY + r.height }
      })
    registerSections(spans)
    scrollState.vh = window.innerHeight
    ScrollTrigger.refresh()
  }
  measure()
  window.addEventListener('resize', measure)

  // ---- DOM reveals: batched, once, with depth-fade ----
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]')
  if (!reduced && reveals.length) {
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 42, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      )
    })
  } else {
    gsap.set(reveals, { autoAlpha: 1 })
  }

  // ---- staggered work items ----
  if (!reduced) {
    gsap.utils.toArray<HTMLElement>('#work li').forEach((li, i) => {
      gsap.fromTo(
        li,
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: li, start: 'top 85%', once: true },
          delay: (i % 2) * 0.05,
        },
      )
    })
  }

  // ---- hero exit: typography recedes as the camera dives ----
  // (runs on wrapper opacity, so it never fights the per-element reveal)
  if (!reduced) {
    gsap.to('#home', {
      autoAlpha: 0,
      ease: 'power2.in',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom 45%', scrub: 0.6 },
    })
    gsap.to('#home .hero-exit', {
      y: -120,
      ease: 'power2.in',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom 45%', scrub: 0.6 },
    })

    // section label parallax for identity words (spatial ladder feel)
    gsap.utils.toArray<HTMLElement>('#identity h3').forEach((h, i) => {
      gsap.fromTo(
        h,
        { y: 80 * (i + 1) * 0.5, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#identity', start: 'top 80%', end: 'center 45%', scrub: 0.8 },
        },
      )
    })

    // contact finale: soft scale-in of the answer
    gsap.fromTo(
      '#contact h2',
      { scale: 0.92, autoAlpha: 0.4 },
      {
        scale: 1,
        autoAlpha: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top 75%', end: 'center 55%', scrub: 0.8 },
      },
    )
  }

  return () => {
    cancelAnimationFrame(raf)
    lenis.destroy()
    window.removeEventListener('pointermove', onMouse)
    window.removeEventListener('resize', measure)
    ScrollTrigger.getAll().forEach((t) => t.kill())
  }
}
