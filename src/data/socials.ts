export interface Social {
  label: string
  handle: string
  href: string
}

export const socials: Social[] = [
  { label: 'GITHUB', handle: '@nora', href: 'https://github.com/' },
  { label: 'LINKEDIN', handle: 'in/nora', href: 'https://www.linkedin.com/' },
  { label: 'EMAIL', handle: 'hello@nora.dev', href: 'mailto:hello@nora.dev' },
]
