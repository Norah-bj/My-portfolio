import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 768): boolean {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < breakpoint)
  useEffect(() => {
    const onR = () => setM(window.innerWidth < breakpoint)
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [breakpoint])
  return m
}

export function usePrefersReducedMotion(): boolean {
  const [r, setR] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onC = () => setR(mq.matches)
    mq.addEventListener('change', onC)
    return () => mq.removeEventListener('change', onC)
  }, [])
  return r
}
