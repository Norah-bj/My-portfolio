import { useEffect, lazy, Suspense } from 'react'
const Scene = lazy(() => import('./three/Scene').then((m) => ({ default: m.Scene })))
import { Loader } from './ui/loader'
import { Nav } from './ui/nav'
import { Cursor } from './ui/cursor'
import { CaseOverlay } from './ui/CaseOverlay'
import { Hero, Identity, Work, Experiments, Skills, CodeDesign, About, Contact, Footer } from './ui/sections'
import { initChoreography } from './choreography'
import { useStore } from './store'
import gsap from 'gsap'

export default function App() {
  useEffect(() => {
    useStore.getState().setPhase('loading')
    document.documentElement.classList.add('ready')

    const cleanup = initChoreography()

    // pause ambient loops when tab is hidden (battery / CPU courtesy)
    const onVis = () => {
      if (document.hidden) gsap.globalTimeline.pause()
      else gsap.globalTimeline.play()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cleanup()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Loader />
      <Cursor />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Identity />
        <Work />
        <Experiments />
        <Skills />
        <CodeDesign />
        <About />
        <Contact />
        <Footer />
      </main>
      <CaseOverlay />
    </>
  )
}
