/**
 * SEO helpers — single source of truth for per-route metadata.
 *
 * Every title, description, and URL is derived from `curriculum.ts`, so the
 * curriculum data and the SEO output can never drift apart. Route files stay
 * thin: they just call `weekHead('<slug>')` or `dayHead('<slug>', n)`.
 *
 * The production origin is hardcoded below so canonical/sitemap/OG URLs are
 * always absolute — no env var to forget or misconfigure. SITE_URL is still
 * honored if set, to override during local dev or a future domain move.
 */
import {
  curriculum,
  dayPath,
  getWeekBySlug,
  weekPath,
  type Week,
} from './pages/core-concepts/curriculum'

/* ── Origin helpers ────────────────────────────────────────────── */

/**
 * The production origin, without a trailing slash.
 *
 * Hardcoded so absolute URLs are correct by default — relying solely on
 * `process.env.SITE_URL` is fragile: on Vercel it is not injected unless set
 * manually, and a missing var silently degrades every canonical/OG URL to a
 * relative path. SITE_URL still wins if present (local dev, domain change).
 */
const PRODUCTION_ORIGIN = 'https://javascript-learn-beta.vercel.app'

function readSiteUrl(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (globalThis as any).process?.env
  return (env?.SITE_URL ?? PRODUCTION_ORIGIN).replace(/\/$/, '')
}

/** Resolve a site-relative path to an absolute URL (or leave relative if unset). */
export function abs(path: string): string {
  return `${readSiteUrl()}${path}`
}

/* ── Brand constants ───────────────────────────────────────────── */

const BRAND = 'js.learn'
const SITE_NAME = 'js.learn — JavaScript to its core'

/* ── Shared tag builders ──────────────────────────────────────── */

/**
 * Open Graph + Twitter tags shared by every page. Title/description are passed
 * in so each page gets its own values; the rest is invariant.
 */
function socialTags(title: string, description: string, url: string) {
  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]
}

function canonicalLink(url: string) {
  return [{ rel: 'canonical', href: url }]
}

/* ── JSON-LD schema ───────────────────────────────────────────── */

/** `Course` schema for a week — rich-result eligible for educational content. */
function courseSchema(week: Week, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${week.title} — JavaScript Interview Prep`,
    description: week.subtitle,
    provider: {
      '@type': 'Organization',
      name: BRAND,
      sameAs: readSiteUrl() || undefined,
    },
    url,
    educationalLevel: 'Intermediate to Advanced',
    inLanguage: 'en',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT21H', // ~3h/day × 7 days
    },
  }
}

/* ── Route head builders ──────────────────────────────────────── */

export type RouteHead = {
  meta: Record<string, unknown>[]
  links: Record<string, unknown>[]
}

/** Metadata for the landing page (`/`). */
export function homeHead(): RouteHead {
  const url = abs('/')
  const title = `${BRAND} — Learn JavaScript to its core`
  const description =
    'A structured 8-week path from execution context to engine internals. Written for developers who already write JS — now it is time to explain it.'
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...socialTags(title, description, url),
    ],
    links: canonicalLink(url),
  }
}

/** Metadata for a week-index page (`/core-concepts/<slug>`). */
export function weekHead(slug: string): RouteHead {
  const week = getWeekBySlug(slug)
  if (!week) {
    // Defensive: should never happen for a registered route, but never emit
    // schema/canonical for an unknown week.
    return { meta: [], links: [] }
  }
  const url = abs(weekPath(week.slug))
  const title = `${week.title} — JavaScript Interview Deep Dive | ${BRAND}`
  const description = `${week.subtitle} ${week.meta.join(' · ')}.`
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...socialTags(title, description, url),
      { 'script:ld+json': courseSchema(week, url) },
    ],
    links: canonicalLink(url),
  }
}

/** Metadata for a day lesson (`/core-concepts/<slug>/day-<n>`). */
export function dayHead(slug: string, day: number): RouteHead {
  const week = getWeekBySlug(slug)
  const dayData = week?.days[day - 1]
  if (!week || !dayData) return { meta: [], links: [] }

  const url = abs(dayPath(week.slug, day))
  const title = `${dayData.title} — ${week.title} | ${BRAND}`
  const description = `Day ${day} of ${week.title}: ${dayData.topics.join(', ')}. Deep dive into ${dayData.title.toLowerCase()} for JavaScript interviews.`
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...socialTags(title, description, url),
    ],
    links: canonicalLink(url),
  }
}

/* ── Sitemap helpers ──────────────────────────────────────────── */

/** Every indexable URL on the site, in sitemap order. */
export function sitemapPaths(): string[] {
  const paths: string[] = ['/', '/core-concepts/execution-context-guide']
  for (const week of curriculum) {
    paths.push(weekPath(week.slug))
    for (const day of week.days) {
      paths.push(dayPath(week.slug, day.day))
    }
  }
  return paths
}
