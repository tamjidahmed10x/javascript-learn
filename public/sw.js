/**
 * js.learn service worker — offline-first caching.
 *
 * Strategies:
 *   • Navigations (HTML pages)     → NetworkFirst  (fresh when online, cached offline)
 *   • Hashed assets / fonts / imgs → CacheFirst    (immutable, served instantly)
 *   • Other same-origin            → StaleWhileRevalidate
 *
 * Bump CACHE_VERSION to invalidate all caches on the next deploy; the activate
 * step deletes every cache that does not match the current version.
 */
const CACHE_VERSION = 'v1'
const STATIC_CACHE = `jslearn-static-${CACHE_VERSION}`
const PAGE_CACHE = `jslearn-pages-${CACHE_VERSION}`
const RUNTIME_CACHE = `jslearn-runtime-${CACHE_VERSION}`

// App shell: the bare minimum needed to boot offline.
// NOTE: use `/offline` not `/offline.html` — Nitro's clean-URL routing redirects
// the .html form to /offline (307). The SW precache must hit the final URL.
const APP_SHELL = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/fonts/geist-latin.woff2',
  '/fonts/jetbrains-mono-latin.woff2',
]

/* ── Install: precache the app shell ──────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE)
      // addAll is atomic — if any single request fails, none are cached.
      // Use individual puts with fallback so one missing font doesn't abort all.
      await Promise.all(
        APP_SHELL.map(async (url) => {
          try {
            await cache.add(url)
          } catch {
            /* tolerate individual precache misses (e.g. transient network) */
          }
        }),
      )
      await self.skipWaiting()
    })(),
  )
})

/* ── Activate: clear old caches, claim clients ────────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, PAGE_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      )
      await self.clients.claim()
    })(),
  )
})

/* ── Fetch: route requests by type ────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET. Let everything else (POST, etc.) hit the network.
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Don't intercept cross-origin requests (analytics, etc.).
  if (url.origin !== self.location.origin) return

  // 1. HTML navigations → NetworkFirst with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  // 2. Hashed build assets + fonts → CacheFirst (immutable).
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/fonts/') ||
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // 3. Everything else same-origin → StaleWhileRevalidate.
  event.respondWith(staleWhileRevalidate(request))
})

/* ── Strategies ───────────────────────────────────────────────── */

// Try the network for fresh HTML; cache success; fall back to cache, then
// the offline shell when there is no connection at all.
async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE)
  try {
    const response = await fetch(request)
    // Only cache valid, OK responses (avoid caching redirects/errors).
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await cache.match(request)
    return cached || (await caches.match('/offline'))
  }
}

// Serve immutable assets from cache instantly; populate cache on first hit.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Nothing we can do for a missing asset offline.
    return Response.error()
  }
}

// Serve stale immediately, refresh from network in the background.
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cached = await cache.match(request)
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok && response.type === 'basic') {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)
  return cached || fetchPromise
}

/* ── Allow the page to trigger an immediate update ────────────── */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})
