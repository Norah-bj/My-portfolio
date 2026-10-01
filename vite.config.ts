import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function getSiteUrl(value: string | undefined) {
  if (!value) return undefined
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be the final production HTTPS origin, for example https://example.com')
  }
  return url.origin
}

export default defineConfig(({ mode }) => {
  const siteUrl = getSiteUrl(loadEnv(mode, process.cwd(), '').SITE_URL)

  return {
    plugins: [
      react(),
      {
        name: 'portfolio-seo',
        transformIndexHtml(html: string) {
          const canonical = siteUrl
            ? `<link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />`
            : ''
          const person = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Mugisha Ineza Nora',
            alternateName: ['Nora', 'Nora Mugisha Ineza'],
            jobTitle: 'Creative developer',
            description:
              'Nora is a computer science student and creative developer from Rwanda building interactive digital experiences, software systems, and thoughtful interfaces.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RW',
            },
            sameAs: ['https://github.com/Norah-bj'],
            knowsAbout: [
              'Creative development',
              'Full-stack development',
              'Software systems',
              'Interactive design',
              'React',
              'TypeScript',
              'Node.js',
            ],
            ...(siteUrl ? { url: `${siteUrl}/` } : {}),
          }

          return html
            .replace('<!-- PORTFOLIO_CANONICAL -->', canonical)
            .replace(
              '<!-- PORTFOLIO_PERSON_JSONLD -->',
              `<script type="application/ld+json">${JSON.stringify(person)}</script>`,
            )
        },
      },
    ],
  }
})
