import { Suspense, useEffect, useRef, useState } from 'react'
import { lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore, type Quality } from '../store'
import { CameraRig } from './cameraRig'
import { Dust, GlowPlanes } from './dust'
import { Lighting } from './lighting'
import { SectionGate } from './SectionGate'

const HeroCrystal = lazy(() => import('./heroCrystal').then((module) => ({ default: module.HeroCrystal })))
const IdentityShard = lazy(() => import('./objects').then((module) => ({ default: module.IdentityShard })))
const WorkGallery = lazy(() => import('./workGallery').then((module) => ({ default: module.WorkGallery })))
const ParticleField = lazy(() => import('./experiments').then((module) => ({ default: module.ParticleField })))
const SkillConstellation = lazy(() => import('./skills').then((module) => ({ default: module.SkillConstellation })))
const CodeDesignMerge = lazy(() => import('./objects').then((module) => ({ default: module.CodeDesignMerge })))
const AboutCard = lazy(() => import('./about').then((module) => ({ default: module.AboutCard })))
const ContactCore = lazy(() => import('./objects').then((module) => ({ default: module.ContactCore })))

function SceneContents({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const low = quality === 'low'

  return (
    <>
      <color attach="background" args={['#0b0d12']} />
      <fog attach="fog" args={['#0b0d12', 10, 30]} />
      <Lighting />
      <Dust count={low ? 160 : 420} />
      <GlowPlanes />
      <Suspense fallback={null}>
        <SectionGate index={0} band={0.62}>
          <HeroCrystal lowQuality={low} reducedMotion={reducedMotion} />
        </SectionGate>
      </Suspense>
      <Suspense fallback={null}>
        <SectionGate index={1} band={0.62}>
          <IdentityShard />
        </SectionGate>
      </Suspense>
      <Suspense fallback={null}>
        <SectionGate index={2} band={0.62}>
          <WorkGallery />
        </SectionGate>
      </Suspense>
      <Suspense fallback={null}>
        <SectionGate index={3} band={0.62}>
          <ParticleField lowQuality={low} />
        </SectionGate>
      </Suspense>
      <Suspense fallback={null}>
        <SectionGate index={4} band={0.62}>
          <SkillConstellation lowQuality={low} />
        </SectionGate>
      </Suspense>
      <Suspense fallback={null}>
        <SectionGate index={5} band={0.62}>
          <CodeDesignMerge />
        </SectionGate>
      </Suspense>
      <Suspense fallback={null}>
        <SectionGate index={6} band={0.62}>
          <AboutCard />
        </SectionGate>
      </Suspense>
      <Suspense fallback={null}>
        <SectionGate index={7} band={0.62}>
          <ContactCore />
        </SectionGate>
      </Suspense>
      <CameraRig />
    </>
  )
}

export function Scene() {
  const setQuality = useStore((s) => s.setQuality)
  const setReducedMotion = useStore((s) => s.setReducedMotion)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [deviceQuality] = useState<Quality>(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768
    const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency ?? 4) : 4
    return mobile || cores <= 4 ? 'low' : 'high'
  })
  const [deviceReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [visible, setVisible] = useState(() => !document.hidden)

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    setQuality(deviceQuality)
    setReducedMotion(deviceReducedMotion)
  }, [deviceQuality, deviceReducedMotion, setQuality, setReducedMotion])

  return (
    <div ref={canvasRef} className="fixed inset-0 z-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={deviceQuality === 'low' ? 1 : [1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 42, near: 0.1, far: 60, position: [0, 0.4, 7.2] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
          gl.setClearColor('#0b0d12')
        }}
        style={{ position: 'fixed', inset: 0 }}
      >
        <SceneContents quality={deviceQuality} reducedMotion={deviceReducedMotion} />
      </Canvas>
    </div>
  )
}
