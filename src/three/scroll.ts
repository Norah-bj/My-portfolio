export interface SectionSpan {
  id: string
  start: number
  end: number
}

export const scrollState = {
  y: 0,
  p: 0, // 0..1 over whole page
  vh: 800,
  sections: [] as SectionSpan[],
  mouse: { x: 0, y: 0, tx: 0, ty: 0 },
}

export function registerSections(spans: SectionSpan[]) {
  scrollState.sections = spans
}

export function currentSection(): string {
  const s = scrollState.sections
  const y = scrollState.y + scrollState.vh * 0.5
  for (const se of s) if (y >= se.start && y < se.end) return se.id
  return s.length ? s[s.length - 1].id : 'home'
}

/** Continuous fractional section index (e.g. 2.42 = between section 2 and 3). */
export function continuousIndex(): number {
  const s = scrollState.sections
  if (!s.length) return 0
  const y = scrollState.y + scrollState.vh * 0.5
  for (let i = 0; i < s.length; i++) {
    const se = s[i]
    const span = se.end - se.start
    if (y < se.end) {
      return i + Math.min(1, Math.max(0, (y - se.start) / span))
    }
  }
  return s.length - 1
}
