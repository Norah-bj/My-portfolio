import * as THREE from 'three'

let _dot: THREE.Texture | null = null
/** Soft round particle sprite (avoids square point artifacts). */
export function dotTexture(): THREE.Texture {
  if (_dot) return _dot
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  _dot = new THREE.CanvasTexture(c)
  return _dot
}

let _glow: THREE.Texture | null = null
/** Large soft radial glow for atmosphere planes. */
export function glowTexture(): THREE.Texture {
  if (_glow) return _glow
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255,255,255,0.9)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.28)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  _glow = new THREE.CanvasTexture(c)
  return _glow
}
