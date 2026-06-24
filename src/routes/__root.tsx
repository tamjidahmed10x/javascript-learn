import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from '../context/ThemeContext'
import NavigationProgress from '../components/NavigationProgress'
import globalCss from '../index.css?url'

// Runs synchronously as the first child of <body>, before paint.
// Reads the persisted theme (with prefers-color-scheme fallback) and applies
// `body.light` so there is no flash of the wrong theme. Mirrors ThemeContext logic.
const themeInitScript = `(function(){try{var s=localStorage.getItem('js-learn-theme');var t=s;if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}if(t==='light'){document.body.classList.add('light')}}catch(e){}})()`

// Registers the service worker on load. Skipped on localhost so dev stays
// cache-free; in production it enables offline support. Non-blocking — wrapped
// in try/catch and fired after window load so it never delays first paint.
const swRegisterScript = `(function(){if('serviceWorker'in navigator&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1'){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}})()`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        name: 'description',
        content:
          'Structured, opinionated deep-dives into JavaScript internals for interview preparation.',
      },
      { title: 'js.learn — JavaScript to its core' },
      // Fallback OG site name for routes that don't override (e.g. 404s).
      { property: 'og:site_name', content: 'js.learn — JavaScript to its core' },
      { name: 'twitter:card', content: 'summary' },
      // PWA: theme color adapts to the active theme (dark default, light toggle).
      { name: 'theme-color', content: '#1a1a1a', media: '(prefers-color-scheme: dark)' },
      { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
      // iOS standalone + status bar.
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'js.learn' },
    ],
    links: [
      { rel: 'stylesheet', href: globalCss },
      // PWA manifest.
      { rel: 'manifest', href: '/manifest.webmanifest' },
      // Icons: SVG preferred, PNG fallback for older browsers / Apple.
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
      { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      {/* suppressHydrationWarning: the no-FOUC script mutates body.className before hydration. */}
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: swRegisterScript }} />
        <NavigationProgress />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
