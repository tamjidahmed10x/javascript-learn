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
    ],
    links: [
      { rel: 'stylesheet', href: globalCss },
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
        <NavigationProgress />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
