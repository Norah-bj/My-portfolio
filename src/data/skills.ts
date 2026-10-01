export interface Skill {
  name: string
  group: 'CORE' | 'WEB' | '3D' | 'DATA' | 'CRAFT'
  detail: string
}

export const skills: Skill[] = [
  { name: 'JavaScript', group: 'CORE', detail: 'The language I think in when nothing else is watching.' },
  { name: 'TypeScript', group: 'CORE', detail: 'Types as design documents that happen to compile.' },
  { name: 'React', group: 'WEB', detail: 'Composition, state, and the discipline of small components.' },
  { name: 'Three.js', group: '3D', detail: 'Geometry, light, and the patience to debug a black screen.' },
  { name: 'Java', group: 'CORE', detail: 'Where I learned that structure is a kindness to your future self.' },
  { name: 'Python', group: 'CORE', detail: 'Scripts, models, and the occasional midnight experiment.' },
  { name: 'PHP', group: 'WEB', detail: 'Still the fastest path from idea to a working endpoint.' },
  { name: 'PostgreSQL', group: 'DATA', detail: 'Schemas as architecture; queries as conversation.' },
  { name: 'Node.js', group: 'WEB', detail: 'The server is just another component with worse CSS.' },
  { name: 'Machine Learning', group: 'DATA', detail: 'Pattern-hunting — the statistics finally made sense.' },
  { name: 'UI/UX', group: 'CRAFT', detail: 'Empathy with a spec sheet.' },
  { name: 'Figma', group: 'CRAFT', detail: 'Where the arguing with myself happens productively.' },
  { name: '3D', group: '3D', detail: 'Spatial thinking leaks into everything else I build.' },
]
