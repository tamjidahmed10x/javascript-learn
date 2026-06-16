# TanStack Start Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the React 19 + Vite SPA into a TanStack Start SSR app deployed to Cloudflare Workers, preserving all 10 routes, content, styling, and behavior.

**Architecture:** In-place migration. Keep all components/CSS in `src/` untouched (only router-API imports change). Add a `src/routes/` tree of thin route wrappers, a `src/router.tsx` + `src/client.tsx` entry, and a `src/routes/__root.tsx` document shell that owns SSR `<html>`, fonts, global CSS, and a no-FOUC theme script. Build via plain Vite (`tanstackStart()` + `nitro()` plugins) with the `cloudflare-module` Nitro preset.

**Tech Stack:** React 19, TanStack Start (`@tanstack/react-start`), TanStack Router (`@tanstack/react-router`), Nitro (`cloudflare-module`), Vite, Tailwind v4, TypeScript, bun, Wrangler.

---

## Verification strategy (note on TDD)

This is a **behavior-preserving UI migration of static content** with no business logic to unit-test, and the project has **no test harness** (no vitest/jest). Setting one up is out of scope (YAGNI). Per the project's own `agents.md` convention ("Always run a build and lint check after every result"), verification is:

- `bun run typecheck` (`tsc --noEmit`) — types pass
- `bun run build` (`vite build`) — production build succeeds, emits `.output/`
- `bun run lint` (`eslint .`) — no lint errors
- `bun run dev` — manual smoke test: all 10 routes render SSR HTML, nav works, theme toggle persists with no flash

This is an intentional, documented deviation from test-first TDD, justified by the nature of the work.

## File map

**Create:**
- `src/router.tsx` — `getRouter()` factory + `Register` module augmentation.
- `src/client.tsx` — hydration entry (`StartClient` + `hydrateRoot`).
- `src/routes/__root.tsx` — root route / SSR document shell / no-FOUC script.
- `src/routes/index.tsx` — `/` (Landing)
- `src/routes/core-concepts/execution-context-scope/index.tsx` — Week1Index
- `src/routes/core-concepts/execution-context-scope/day-1.tsx` … `day-7.tsx` — Day1…Day7
- `src/routes/core-concepts/execution-context-guide.tsx` — ExecutionContextGuide
- `src/routeTree.gen.ts` — **auto-generated** by the router plugin on first dev/build (do not hand-create or hand-edit).
- `wrangler.jsonc` — Cloudflare Workers deploy config.

**Modify:**
- `vite.config.ts` — `tanstackStart()` + `nitro()` + `viteReact()` + `tailwindcss()`.
- `package.json` — scripts + dependency changes.
- `src/components/ContentLayout.tsx` — `react-router-dom` → `@tanstack/react-router`.
- `src/components/DayNav.tsx` — same.
- `src/pages/Landing.tsx` — same.
- `src/pages/core-concepts/Week1Index.tsx` — same.
- `src/pages/core-concepts/navConfig.ts` — type paths against the registered router (type-safe `Link`).

**Delete:**
- `src/main.tsx`, `src/App.tsx`, `index.html` (duties move to `client.tsx` + `__root.tsx`).

**Unchanged:** `src/context/ThemeContext.tsx` (already SSR-guarded — verified) and all `.css` files.

---

## Task 1: Dependencies & build config

**Files:**
- Modify: `package.json` (deps + scripts via bun + Edit)
- Modify: `vite.config.ts` (rewrite)
- Create: `wrangler.jsonc`

- [ ] **Step 1: Add TanStack Start/Router/Nitro deps and Wrangler; remove react-router-dom**

Run from the project root:

```bash
bun add @tanstack/react-router @tanstack/react-start nitro
bun add -D wrangler @tanstack/router-plugin
bun remove react-router-dom
```

Expected: `package.json` `dependencies` gains `@tanstack/react-router`, `@tanstack/react-start`, `nitro`; `devDependencies` gains `wrangler`, `@tanstack/router-plugin`; `react-router-dom` is removed.

- [ ] **Step 2: Rewrite `vite.config.ts`**

Replace the entire file with:

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // Order matters: Start plugin first, React plugin after it.
    tanstackStart(),
    nitro({
      preset: 'cloudflare-module',
      compatibilityDate: '2024-09-23',
    }),
    viteReact(),
    tailwindcss(),
  ],
})
```

Note: `tanstackStart()` with no arguments defaults to scanning `src/routes` and generating `src/routeTree.gen.ts` — which matches our layout exactly.

- [ ] **Step 3: Update `package.json` scripts**

Edit the `"scripts"` block to:

```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "start": "wrangler dev",
  "preview": "wrangler dev",
  "deploy": "wrangler deploy",
  "typecheck": "tsc --noEmit",
  "lint": "eslint ."
}
```

- [ ] **Step 4: Create `wrangler.jsonc`**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "javascript-learn",
  "compatibility_date": "2024-09-23",
  "main": ".output/server/index.mjs",
  "assets": {
    "directory": ".output/public",
    "binding": "ASSETS"
  }
}
```

Note: This targets the Nitro `cloudflare-module` output. Exact asset/main paths may need a tweak at first real deploy; the dev/build flow does not depend on it.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock vite.config.ts wrangler.jsonc
git commit -m "build: switch to TanStack Start + Nitro (cloudflare-module)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Router entry skeleton

**Files:**
- Create: `src/router.tsx`
- Create: `src/client.tsx`

- [ ] **Step 1: Create `src/router.tsx`**

```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
  })

  return router
}

// Register the router so <Link> / useRouter / useNavigate are fully type-safe.
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

Note: `./routeTree.gen` does not exist yet — it is generated in Task 7. `tsc` will error until then; that is expected and fine (we are not building mid-migration).

- [ ] **Step 2: Create `src/client.tsx`**

```tsx
import { StartClient } from '@tanstack/react-start/client'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
)
```

Note: `<StartClient />` takes no router prop — the `tanstackStart()` plugin discovers `getRouter()` from `src/router.tsx` by convention and wires both client hydration and SSR. If a runtime/typecheck error indicates the router is missing, add `import { getRouter } from './router'` and change to `<StartClient router={getRouter()} />` as the fallback.

- [ ] **Step 3: Commit**

```bash
git add src/router.tsx src/client.tsx
git commit -m "feat: add TanStack Start router + client entry

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Root route (SSR document shell + no-FOUC theme)

**Files:**
- Create: `src/routes/__root.tsx`

- [ ] **Step 1: Create `src/routes/__root.tsx`**

```tsx
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from '../context/ThemeContext'
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
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: '',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
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
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

Notes:
- If `typecheck` complains about `crossOrigin: ''` on the preconnect link, remove that single property (the preconnect still works without it).
- `ThemeContext.tsx` is imported unchanged — it is already SSR-safe (`typeof window` guard) and uses the same dark default + `localStorage`/`prefers-color-scheme` logic as the script.

- [ ] **Step 2: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "feat: add SSR root route with document shell and no-FOUC theme script

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Swap react-router-dom → @tanstack/react-router in components/pages

**Files:**
- Modify: `src/components/ContentLayout.tsx`
- Modify: `src/components/DayNav.tsx`
- Modify: `src/pages/Landing.tsx`
- Modify: `src/pages/core-concepts/Week1Index.tsx`
- Modify: `src/pages/core-concepts/navConfig.ts`

TanStack Router notes for these edits:
- `useLocation()` from `@tanstack/react-router` returns `{ pathname, ... }` — a drop-in for the existing `location.pathname` usage.
- `<Link to=...>` is strictly typed to known route ids. Static route paths (`/`, `/core-concepts/execution-context-scope`, etc.) pass type-checking directly. **Dynamic** path strings (from `navConfig` / template literals) need a cast to `LinkProps['to']`.

- [ ] **Step 1: Update `src/components/ContentLayout.tsx`**

Change the import line (line 1):

```tsx
import { Link, useLocation, type LinkProps } from '@tanstack/react-router'
```

In the sidebar `.map` (the `<Link to={item.path} ...>`), cast the dynamic path:

```tsx
<Link
  to={item.path as LinkProps['to']}
  className={`sidebar-link ${isActive ? 'is-active' : ''}`}
  onClick={() => setSidebarOpen(false)}
>
```

Leave the two `<Link to="/" ...>` logo links as-is (static path, type-safe).

- [ ] **Step 2: Update `src/components/DayNav.tsx`**

Change the import (line 1):

```tsx
import { Link, type LinkProps } from '@tanstack/react-router'
```

Cast the prev/next dynamic paths:

```tsx
<Link to={prev.path as LinkProps['to']} className="day-nav-link day-nav-prev">
```

```tsx
<Link to={next.path as LinkProps['to']} className="day-nav-link day-nav-next">
```

- [ ] **Step 3: Update `src/pages/Landing.tsx`**

Change the import (line 1):

```tsx
import { Link } from '@tanstack/react-router'
```

All existing `<Link to="/" ...>` usages are static — no cast needed. If `typecheck` flags the section-card link at line ~192 (verify whether it is static `/` or dynamic), and it is dynamic, cast it with `as LinkProps['to']` (add `type LinkProps` to the import in that case).

- [ ] **Step 4: Update `src/pages/core-concepts/Week1Index.tsx`**

Change the import (line 1):

```tsx
import { Link, type LinkProps } from '@tanstack/react-router'
```

Cast the dynamic day-card link:

```tsx
<Link
  key={day.day}
  to={`/core-concepts/execution-context-scope/day-${day.day}` as LinkProps['to']}
  className="day-card"
>
```

- [ ] **Step 5: Update `src/pages/core-concepts/navConfig.ts`**

Add a clarifying type-only import so intent is explicit (paths must match registered routes):

```ts
import type { LinkProps } from '@tanstack/react-router'
import type { NavItem } from '../../components/ContentLayout'
import type { DayNavLink } from '../../components/DayNav'
```

Then annotate the path fields so misuse is caught. Replace the `NavItem[]` declaration's usage by typing the array explicitly as `(NavItem & { path: LinkProps['to'] })[]`:

```ts
export const week1NavItems: (NavItem & { path: LinkProps['to'] })[] = [
  { label: 'Day 1: How JS Executes Code', path: '/core-concepts/execution-context-scope/day-1' },
  { label: 'Day 2: Hoisting', path: '/core-concepts/execution-context-scope/day-2' },
  { label: 'Day 3: TDZ + let + const', path: '/core-concepts/execution-context-scope/day-3' },
  { label: 'Day 4: Scope', path: '/core-concepts/execution-context-scope/day-4' },
  { label: 'Day 5: Scope Chain Deep Dive', path: '/core-concepts/execution-context-scope/day-5' },
  { label: 'Day 6: Hard Problems', path: '/core-concepts/execution-context-scope/day-6' },
  { label: 'Day 7: Revision', path: '/core-concepts/execution-context-scope/day-7' },
]
```

In `getDayNav`, type the returned path the same way so `DayNav`'s cast stays consistent:

```ts
export function getDayNav(day: number): { prev?: DayNavLink; next?: DayNavLink } {
  // ...existing body unchanged...
}
```

(`DayNavLink.path` is a plain `string` in the component prop type; the `as LinkProps['to']` cast in `DayNav.tsx` handles the boundary. If `typecheck` instead prefers widening `DayNavLink.path`, do that — either is acceptable as long as it type-checks.)

- [ ] **Step 6: Commit**

```bash
git add src/components/ContentLayout.tsx src/components/DayNav.tsx src/pages/Landing.tsx src/pages/core-concepts/Week1Index.tsx src/pages/core-concepts/navConfig.ts
git commit -m "refactor: migrate router API from react-router-dom to TanStack Router

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Create the file-based route tree

**Files:**
- Create: `src/routes/index.tsx`
- Create: `src/routes/core-concepts/execution-context-scope/index.tsx`
- Create: `src/routes/core-concepts/execution-context-scope/day-1.tsx` … `day-7.tsx`
- Create: `src/routes/core-concepts/execution-context-guide.tsx`

Each route file is a thin wrapper that imports the existing page component and registers it at its URL. URLs are identical to the current app — no links break.

- [ ] **Step 1: Landing → `src/routes/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import Landing from '../pages/Landing'

export const Route = createFileRoute('/')({
  component: Landing,
})
```

- [ ] **Step 2: Week1Index → `src/routes/core-concepts/execution-context-scope/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import Week1Index from '../../../pages/core-concepts/Week1Index'

export const Route = createFileRoute('/core-concepts/execution-context-scope/')({
  component: Week1Index,
})
```

- [ ] **Step 3: Days 1–7 → `src/routes/core-concepts/execution-context-scope/day-1.tsx` … `day-7.tsx`**

Create seven files (`day-1.tsx` through `day-7.tsx`), each of the form (example for day-1):

```tsx
import { createFileRoute } from '@tanstack/react-router'
import Day1 from '../../../pages/core-concepts/Day1'

export const Route = createFileRoute('/core-concepts/execution-context-scope/day-1')({
  component: Day1,
})
```

Repeat for `day-2.tsx` (component `Day2`, route id `…/day-2`) through `day-7.tsx` (component `Day7`, route id `…/day-7`). Same relative import path `../../../pages/core-concepts/DayN` for all seven.

- [ ] **Step 4: ExecutionContextGuide → `src/routes/core-concepts/execution-context-guide.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import ExecutionContextGuide from '../../pages/core-concepts/ExecutionContextGuide'

export const Route = createFileRoute('/core-concepts/execution-context-guide')({
  component: ExecutionContextGuide,
})
```

- [ ] **Step 5: Commit**

```bash
git add src/routes/index.tsx src/routes/core-concepts
git commit -m "feat: add file-based routes for all 10 pages

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Remove obsolete SPA files

**Files:**
- Delete: `src/main.tsx`
- Delete: `src/App.tsx`
- Delete: `index.html`

- [ ] **Step 1: Delete the three files**

```bash
git rm src/main.tsx src/App.tsx index.html
```

Why:
- `src/main.tsx` → replaced by `src/client.tsx` (hydration) + the plugin's SSR entry.
- `src/App.tsx` → routing is now file-based (`src/routes/`).
- `index.html` → the document shell now lives in `src/routes/__root.tsx` (fonts, title, meta all moved there).

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove obsolete Vite SPA entry (main/App/index.html)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Generate route tree & verify

**Files:**
- Auto-generated: `src/routeTree.gen.ts`
- Possibly minor fixes across the files above.

- [ ] **Step 1: Generate the route tree**

The `tanstackStart()` plugin regenerates `src/routeTree.gen.ts` on dev start and on build. Trigger a generation by starting the dev server, then stop it once `src/routeTree.gen.ts` appears:

```bash
bun run dev
```

Wait until the terminal shows the dev server URL and `src/routeTree.gen.ts` exists (a few seconds), then stop it (Ctrl-C). Confirm the file exists:

```bash
ls src/routeTree.gen.ts
```

Expected: file present and non-empty.

- [ ] **Step 2: Typecheck**

```bash
bun run typecheck
```

Expected: no errors. If errors appear:
- `Cannot find module './routeTree.gen'` → re-run Step 1 (generation didn't complete).
- `Link` `to` type errors → add/adjust the `as LinkProps['to']` casts from Task 4.
- `crossOrigin` error on the preconnect → remove that property from `__root.tsx`.

- [ ] **Step 3: Build**

```bash
bun run build
```

Expected: build succeeds and emits a `.output/` directory (Nitro cloudflare-module output). `src/routeTree.gen.ts` may also be (re)written here — stage it.

- [ ] **Step 4: Lint**

```bash
bun run lint
```

Expected: no errors. Fix any reported issues (e.g. unused imports from the old `App.tsx` removal, or `noUnusedLocals`/`noUnusedParameters` violations introduced by the swaps).

- [ ] **Step 5: Manual SSR smoke test**

```bash
bun run dev
```

Open the printed URL (default `http://localhost:3000`) and verify:
1. `/` (Landing) renders.
2. Navigate to each: `/core-concepts/execution-context-scope`, `/core-concepts/execution-context-guide`, and `day-1` … `day-7`.
3. Sidebar active link highlights on the day pages.
4. Prev/Next day nav (DayNav) works.
5. Theme toggle switches and **persists across a hard reload with no flash**.
6. SSR check: View Source on `/` — the page's content HTML is present (not just `<div id="root">`), confirming server rendering.

Stop the dev server (Ctrl-C).

- [ ] **Step 6: Commit generated tree + any fixes**

```bash
git add src/routeTree.gen.ts
# also add any fix-ups made in steps 2–4
git commit -m "chore: generate route tree and verify build/lint/types

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Self-Review (run after writing — already performed)

**Spec coverage:** Every spec section maps to a task — dependencies/config (Task 1), entry files router.tsx/client.tsx (Task 2), `__root.tsx` shell + no-FOUC (Task 3), router-API conversions (Task 4), file-based routes for all 10 URLs (Task 5), deletion of `main.tsx`/`App.tsx`/`index.html` (Task 6), build/lint/typecheck/dev verification (Task 7). Cloudflare preset (`cloudflare-module`, compatibilityDate) is in Task 1. Theme no-FOUC is in Task 3. Type-safe `Link` is in Task 4. Out-of-scope items (server functions, loaders, redesign) correctly have no task.

**Placeholder scan:** No TBD/TODO/"add error handling"/"similar to Task N". Each code step contains full code. The few "if X then Y" notes are conditional fallbacks for genuine framework-version uncertainty (router wiring, `crossOrigin` field), which is honest rather than placeholder — the primary path is fully specified.

**Type consistency:** `LinkProps['to']` cast used consistently in Task 4 (ContentLayout, DayNav, Week1Index, navConfig). Route ids in Task 5 (`createFileRoute('...')`) exactly match the navConfig paths from Task 4 and the existing URLs. Relative import depths verified: `routes/index.tsx` → `../pages/...`; `routes/core-concepts/execution-context-scope/*` → `../../../pages/...`; `routes/core-concepts/execution-context-guide.tsx` → `../../pages/...`.
