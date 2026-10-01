import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const output = join(process.cwd(), 'dist')
const siteUrlValue = process.env.SITE_URL

await mkdir(output, { recursive: true })

if (!siteUrlValue) {
  await writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  console.warn('SITE_URL is unset; built robots.txt allows crawling, but sitemap.xml was not generated.')
  process.exit(0)
}

const siteUrl = new URL(siteUrlValue)
if (siteUrl.protocol !== 'https:' || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash) {
  throw new Error('SITE_URL must be the final production HTTPS origin, for example https://example.com')
}

const origin = siteUrl.origin
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc></url>
</urlset>
`

await Promise.all([
  writeFile(join(output, 'sitemap.xml'), sitemap),
  writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`),
])
