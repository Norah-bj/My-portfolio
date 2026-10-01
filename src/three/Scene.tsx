import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'
import { CameraRig } from './cameraRig'
import { Dust, GlowPlanes } from './dust'
import { HeroCrystal } from './heroCrystal'
import { WorkGallery } from './workGallery'
import { ParticleField } from './experiments'
import { SkillConstellation } from './skills'
import { IdentityShard, CodeDesignMerge, ContactCore, Lighting } from './objects'
import { AboutCard } from './about'
import { SectionGate } from './SectionGate'

function SceneContents() {
  const quality = useStore((s) => s.quality)
  const reducedMotion = useStore((s) => s.reducedMotion)
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
        <SectionGate index={1} band={0.62}>
          <IdentityShard />
        </SectionGate>
        <SectionGate index={2} band={0.62}>
          <WorkGallery />
        </SectionGate>
        <SectionGate index={3} band={0.62}>
          <ParticleField lowQuality={low} />
        </SectionGate>
        <SectionGate index={4} band={0.62}>
          <SkillConstellation lowQuality={low} />
        </SectionGate>
        <SectionGate index={5} band={0.62}>
          <CodeDesignMerge />
        </SectionGate>
        <SectionGate index={6} band={0.62}>
          <AboutCard />
        </SectionGate>
        <SectionGate index={7} band={0.62}>
          <ContactCore />
        </SectionGate>
      </Suspense>
      <CameraRig />
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
    </>
  )
}

export function Scene() {
  const setQuality = useStore((s) => s.setQuality)
  const setReducedMotion = useStore((s) => s.setReducedMotion)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    const cores = navigator.hardwareConcurrency ?? 4
    setQuality(mobile || cores <= 4 ? 'low' : 'high')
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [setQuality, setReducedMotion])

  return (
    <div ref={canvasRef} className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
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
        <SceneContents />
      </Canvas>
    </div>
  )
}
