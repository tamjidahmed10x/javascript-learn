import { createFileRoute } from '@tanstack/react-router'
import { abs, sitemapPaths } from '../seo'

/**
 * Serves `/sitemap.xml`. Iterates the curriculum-derived URL list and renders
 * an absolute-URL XML sitemap. Returns application/xml with a 1h cache so
 * crawlers re-poll at a sane cadence without hammering the origin.
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = sitemapPaths()
          .map((p) => `  <url><loc>${xmlEscape(abs(p))}</loc></url>`)
          .join('\n')

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

        return new Response(xml, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})

function xmlEscape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}
