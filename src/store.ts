import { create } from 'zustand'
import { projects, type Project } from './data/projects'
import { skills } from './data/skills'

export type Phase = 'boot' | 'loading' | 'intro' | 'idle'
export type Quality = 'high' | 'low'

interface StoreState {
  phase: Phase
  progress: number
  quality: Quality
  reducedMotion: boolean
  activeProject: string | null
  activeSection: string
  cursorLabel: string | null
  cursorHover: boolean
  skillHover: number | null
  workHover: string | null
  pulse: number
  setPhase: (p: Phase) => void
  setProgress: (n: number) => void
  setQuality: (q: Quality) => void
  setReducedMotion: (b: boolean) => void
  openProject: (id: string) => void
  closeProject: () => void
  setActiveSection: (id: string) => void
  setCursor: (label: string | null, hover?: boolean) => void
  setSkillHover: (i: number | null) => void
  setWorkHover: (id: string | null) => void
  firePulse: () => void
}

export const useStore = create<StoreState>((set) => ({
  phase: 'boot',
  progress: 0,
  quality: 'high',
  reducedMotion: false,
  activeProject: null,
  activeSection: 'home',
  cursorLabel: null,
  cursorHover: false,
  skillHover: null,
  workHover: null,
  pulse: 0,
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setQuality: (quality) => set({ quality }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  openProject: (id) => set({ activeProject: id, cursorLabel: null, cursorHover: false }),
  closeProject: () => set({ activeProject: null }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setCursor: (cursorLabel, cursorHover = false) =>
    set((s) =>
      s.cursorLabel === cursorLabel && s.cursorHover === cursorHover
        ? s
        : { cursorLabel, cursorHover },
    ),
  setSkillHover: (skillHover) => set({ skillHover }),
  setWorkHover: (workHover) => set({ workHover }),
  firePulse: () => set((s) => ({ pulse: s.pulse + 1 })),
}))

export const getProject = (id: string | null): Project | null =>
  id ? (projects.find((p) => p.id === id) ?? null) : null

export const skillCount = skills.length
