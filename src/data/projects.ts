export interface Project {
  id: string
  index: string
  name: string
  category: string
  year: string
  description: string
  stack: string[]
  geometry: 'icosa' | 'octa' | 'torus' | 'prism' | 'gem'
  color: string
  link: string
  repo: string
  role: string
  problem: string
  approach: string
  result: string
}

export const projects: Project[] = [
  {
    id: 'motherlink',
    index: '01',
    name: 'MotherLink',
    category: 'HEALTH PLATFORM',
    year: '2025',
    description: 'A maternal-health companion connecting expectant mothers to clinics and community care across Kigali.',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    geometry: 'icosa',
    color: '#9db9ff',
    link: 'https://github.com/',
    repo: 'https://github.com/',
    role: 'Full-stack developer & product design',
    problem:
      'Expectant mothers in low-connectivity districts lose contact with clinics between visits, and critical guidance arrives too late.',
    approach:
      'An offline-first PWA with background sync, SMS fallbacks for critical reminders, and a clinical dashboard tuned for community health workers on shared devices.',
    result:
      'Pilot with two clinics; appointment follow-through improved measurably and the workflow survived 2G conditions.',
  },
  {
    id: 'finexa',
    index: '02',
    name: 'Finexa',
    category: 'FINTECH DASHBOARD',
    year: '2025',
    description: 'A personal-finance interface that treats budgeting like instrument flying: calm, dense, precise.',
    stack: ['TypeScript', 'React', 'Node.js'],
    geometry: 'octa',
    color: '#b79bff',
    link: 'https://github.com/',
    repo: 'https://github.com/',
    role: 'Frontend engineer',
    problem: 'Finance apps drown users in numbers without hierarchy; the important signal hides inside the noise.',
    approach:
      'A layered data surface: one glanceable horizon, drill-down timelines, and motion that only appears where data changes.',
    result: 'A dashboard users describe as quiet — dense information with almost no visual anxiety.',
  },
  {
    id: 'freesia-tone',
    index: '03',
    name: 'Freesia Tone',
    category: 'AUDIO / CREATIVE TOOL',
    year: '2024',
    description: 'A browser-native tone sequencer where chords grow as plants — composition becomes gardening.',
    stack: ['JavaScript', 'Web Audio', 'Canvas'],
    geometry: 'torus',
    color: '#9db9ff',
    link: 'https://github.com/',
    repo: 'https://github.com/',
    role: 'Creator',
    problem: 'Music tools intimidate non-musicians; the gap between an idea and a sound is too wide.',
    approach:
      'Mapping harmony to growth rules: stems, leaves, and blossoms carry pitch and rhythm, so the eye composes before the ear does.',
    result: 'An toy that non-musicians actually finish songs with — and screenshot.',
  },
  {
    id: 'apupeka',
    index: '04',
    name: 'Apupeka',
    category: 'EVENT DISCOVERY',
    year: '2024',
    description: 'A map-first event explorer for local culture: what is happening tonight, within walking distance.',
    stack: ['React', 'PHP', 'PostgreSQL'],
    geometry: 'prism',
    color: '#b79bff',
    link: 'https://github.com/',
    repo: 'https://github.com/',
    role: 'Full-stack developer',
    problem: 'Local events live in scattered WhatsApp groups and posters; discovery is word-of-mouth or nothing.',
    approach:
      'A geospatial feed with lightweight organizer tooling, aggressive image compression, and a feed that degrades gracefully on old Android phones.',
    result: 'Adopted by local organizers for monthly listings without any marketing spend.',
  },
  {
    id: 'parking-system',
    index: '05',
    name: 'Parking System',
    category: 'SYSTEMS / IoT',
    year: '2023',
    description: 'A campus parking system with live occupancy, plate recognition, and a queue that respects reality.',
    stack: ['Python', 'Java', 'PostgreSQL'],
    geometry: 'gem',
    color: '#9db9ff',
    link: 'https://github.com/',
    repo: 'https://github.com/',
    role: 'Systems designer & developer',
    problem: 'Campus parking is a daily rumor: nobody knows where space exists until they are already circling.',
    approach:
      'Sensor-fed occupancy, a state machine for gates, and a mobile view designed to be read while walking.',
    result: 'A working end-to-end build — hardware, API, and interface — that ran through a full semester of traffic.',
  },
]
