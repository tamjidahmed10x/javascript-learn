import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('modules-perf-memory')!
const navItems = weekNav(week)

export default function ModulesDay2() {
  const { prev, next } = dayNavLinks(week, 2)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[1].title}</h1>
        <p className="lesson-subtitle">
          Browsers can&apos;t load 500 module files. The bundler turns your dependency graph into optimized bundles &mdash;
          and yesterday&apos;s ESM static structure is exactly what makes it possible.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>bundler</strong> (Vite, webpack, esbuild, Rollup) reads your entry point, follows{' '}
            <code>import</code>/<code>require</code> edges to build the <strong>dependency graph</strong>, then emits one
            or more optimized output files. It can also <strong>split</strong> code into lazy chunks and{' '}
            <strong>tree-shake</strong> away unused exports.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Start from the entry, resolve each import (incl. <code>node_modules</code>, aliases, extensions), accumulate
            the graph, then transform (compile TS/JSX, minify) and emit. <strong>Code splitting</strong> carves
            <code> import()</code> &ldquo;chunks&rdquo;; <strong>tree shaking</strong> drops unreferenced ESM exports.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always in production. Without a bundler you&apos;d ship hundreds of module requests (slow) and dead code
            (bloated). Bundlers are why a modern app loads in seconds despite thousands of dependencies.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Yesterday you learned why ESM is statically analyzable. Today we use that fact. A bundler walks your import
          graph without running the code, optimizes it, and emits files the browser can load efficiently. Three
          concepts &mdash; the dependency graph, code splitting, and tree shaking &mdash; are the whole job.
        </p>

        <CodeBlock
          code={`// app.js
import { used } from "./utils.js";   // (1) an edge in the dependency graph
import("./admin.js");                 // (2) a dynamic edge → a split chunk
console.log(used());

// utils.js
export function used() { return "kept"; }
export function unused() { return "dead code"; } // (3) tree-shaken away`}
          filename="intro.js"
        />

        <p className="article-para">
          The bundler starts at <code>app.js</code>, follows the static <code>import</code> to <code>utils.js</code>,
          notices <code>unused</code> is never referenced, and sees <code>import("./admin.js")</code> as a lazy
          boundary. The output: a main bundle with <code>used</code> (but not <code>unused</code>), plus a separate{' '}
          <code>admin</code> chunk loaded on demand. Graph &rarr; split &rarr; shake, in that order.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Dependency graph</dt>
            <dd className="def-text">
              The directed graph of modules connected by <code>import</code>/<code>require</code> edges, rooted at the
              entry point. The bundler&apos;s map of your app.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Code splitting</dt>
            <dd className="def-text">
              Emitting multiple bundles (chunks) so code loads on demand &mdash; via dynamic <code>import()</code>,
              route-level splits, or shared vendor chunks. Reduces initial download.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Tree shaking</dt>
            <dd className="def-text">
              Removing unused exports from the output. Possible because ESM imports are static &mdash; the bundler knows
              exactly what&apos;s referenced without running the code. &ldquo;Shake the tree, dead leaves fall.&rdquo;
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Side effect</dt>
            <dd className="def-text">
              Code that does something when imported (polyfills, modifying globals). Side-effecty modules can&apos;t be
              safely tree-shaken; <code>package.json</code> <code>sideEffects</code> marks which files have them.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Moving Analogy</h2>
        <p className="article-para">
          Packing for a move is exactly bundling. You walk through your home (the entry), following doors into each
          room (the dependency graph), collecting what you actually use (<strong>tree shaking</strong> out the junk you
          never touch). Some boxes you mark &ldquo;open at the new house only when needed&rdquo; (<strong>code
          splitting</strong> &mdash; seasonal clothes, packed separately). Finally you label and compress everything
          into labeled boxes (<strong>minified chunks</strong>) for efficient transport.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏠</span>
            <span className="analogy-label">Walk the house</span>
            <span className="analogy-target">Build the dependency graph</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🗑️</span>
            <span className="analogy-label">Leave the junk behind</span>
            <span className="analogy-target">Tree shaking</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📦</span>
            <span className="analogy-label">Separate &ldquo;open later&rdquo; boxes</span>
            <span className="analogy-target">Code splitting</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🗜️</span>
            <span className="analogy-label">Vacuum-seal the boxes</span>
            <span className="analogy-target">Minification</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The dependency graph is the source of truth for every optimization. Tree shaking is &ldquo;remove nodes/
            exports no path reaches.&rdquo; Code splitting is &ldquo;cut the graph at dynamic-import edges into separate
            files.&rdquo; Shared chunking is &ldquo;find sub-graphs used by multiple entries and emit them once.&rdquo;
            All three are graph algorithms over your imports.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          The bundler pipeline is a graph algorithm with three optimization passes. Understanding each lets you debug
          bundle size and load performance.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Build the graph (resolve + collect)</h4>
            <p className="theory-desc">
              From the entry, follow each <code>import</code> edge, resolving bare specifiers (<code>"react"</code>),
              extensions, and aliases via the resolver. Each unique module becomes a node; cycles are handled. The
              result: a complete map of what depends on what.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Tree-shake (mark live exports)</h4>
            <p className="theory-desc">
              Starting from each entry&apos;s used imports, mark reachable exports. Anything unreferenced and free of
              side effects is dropped. Requires ESM static structure (Day 1) &mdash; CJS is opaque.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Split into chunks</h4>
            <p className="theory-desc">
              <code>import()</code> creates chunk boundaries. The bundler also extracts code shared by multiple chunks
              into a common vendor bundle, so it&apos;s downloaded once and cached.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Transform &amp; emit</h4>
            <p className="theory-desc">
              Compile TS/JSX, transpile to target syntax, minify (rename, strip whitespace), and write the chunk files
              plus an HTML/manifest that references them.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Why tree shaking needs side-effect tracking</h3>
        <CodeBlock
          code={`// logger.js — a module with a SIDE EFFECT on import
console.log("logger loaded");        // runs just by importing!
export function log() { /* ... */ }

// Even if nobody calls log(), importing logger.js prints "logger loaded".
// A bundler can't remove the side effect safely — removing the module
// would change behavior. So tree-shaking keeps the whole module.
//
// package.json can declare side effects to help:
//   { "sideEffects": false }  → safe to shake ALL exports
//   { "sideEffects": ["./polyfill.js"] } → everything else is safe`}
          filename="side-effects.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Tree shaking (ESM only)</span>
            <p className="phase-desc">Remove unreferenced, side-effect-free exports.</p>
            <ul className="phase-rules">
              <li>Needs static imports</li>
              <li>Respects <code>sideEffects</code> flag</li>
              <li>Smaller bundles</li>
              <li>Default in Rollup/esbuild/Vite</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Code splitting</span>
            <p className="phase-desc">Emit multiple chunks loaded on demand.</p>
            <ul className="phase-rules">
              <li>Triggered by <code>import()</code></li>
              <li>Route/component lazy loads</li>
              <li>Shared vendor chunks dedupe</li>
              <li>Faster initial load</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            A common bug: a tiny named import like <code>{'import { map } from "lodash"'}</code> pulls in the whole
            library if <code>lodash</code> is CJS or unshakable &mdash; megabytes instead of kilobytes. The fix:{' '}
            <code>{'import map from "lodash/map"'}</code> (per-method import) or switch to <code>lodash-es</code>{' '}
            (ESM, tree-shakeable). Knowing your dependencies&apos; module format is a real performance lever.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; the Bundler Landscape</h2>
        <p className="article-para">
          Bundlers emerged because browsers couldn&apos;t load hundreds of module files efficiently. <code>webpack</code>{' '}
          (2012) popularized bundling and code splitting for the browser; <code>Rollup</code> (2015) pioneered ESM-first
          tree shaking for libraries; <code>esbuild</code> (2020) and <code>Vite</code> (2020) brought Go/esbuild-level
          speed with native ESM dev servers; <code>Turbopack</code> and <code>Rspack</code> (Rust-based) push speed
          further. The trend: native ESM, faster builds, less config. This very project uses Vite + TanStack Start.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>webpack</th>
                <th>Rollup</th>
                <th>esbuild / Vite</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Era</td>
                <td>2012, mature</td>
                <td>2015, library-focused</td>
                <td>2020+, speed-focused</td>
              </tr>
              <tr>
                <td>Tree shaking</td>
                <td>Yes (configurable)</td>
                <td>Excellent (ESM-native)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Code splitting</td>
                <td>Yes, mature</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Build speed</td>
                <td>Slow (JS)</td>
                <td>Medium (JS)</td>
                <td>Very fast (Go/Rust)</td>
              </tr>
              <tr>
                <td>Best for</td>
                <td>Complex apps (legacy)</td>
                <td>Libraries</td>
                <td>Modern apps (default)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Bundling a Tiny App</h2>

        <CodeBlock
          code={`// entry: app.js
import { greet } from "./greet.js";   // static edge
import("./admin.js").then((m) => m.setup()); // dynamic edge → chunk
greet();

// greet.js
export function greet() { return "hi"; }
export function unusedGreet() { return "bye"; } // unreferenced

// admin.js (lazy)
export function setup() { console.log("admin ready"); }`}
          filename="app.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Graph:</strong> bundler starts at <code>app.js</code>. Static <code>import</code> &rarr; add{' '}
              <code>greet.js</code>. Dynamic <code>import("./admin.js")</code> &rarr; add <code>admin.js</code> but mark
              it as a chunk boundary. Nodes: <code>app, greet, admin</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>Tree-shake:</strong> from <code>app.js</code>, only <code>greet</code> is imported from{' '}
              <code>greet.js</code>. <code>unusedGreet</code> is unreferenced and side-effect-free &rarr; dropped.
              <code> admin.js</code>&apos;s <code>setup</code> is referenced (via <code>m.setup</code>) &rarr; kept.
            </span>
          </li>
          <li>
            <span>
              <strong>Split:</strong> <code>app.js</code> + <code>greet.js</code> go in the main chunk;{' '}
              <code>admin.js</code> becomes a separate lazy chunk because it&apos;s behind <code>import()</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>Emit:</strong> minified <code>main.[hash].js</code> (app + greet, no unusedGreet) and{' '}
              <code>admin.[hash].js</code> (lazy). The HTML loads <code>main</code> immediately; <code>admin</code>{' '}
              only when <code>import()</code> runs.
            </span>
          </li>
          <li>
            <span>
              Net effect: smaller initial bundle (no admin code on first load, no dead exports), and <code>admin</code>{' '}
              cached separately so returning users skip re-downloading it.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Dynamic import for route-level splitting</h3>
        <CodeBlock
          code={`// React.lazy + import() → the admin code becomes its own chunk
const Admin = React.lazy(() => import("./Admin"));
// First paint doesn't include Admin; it loads when <Admin /> renders.
<Suspense fallback={<Spinner />}><Admin /></Suspense>`}
          filename="route-split.js"
        />

        <h3 className="article-h3">2. <code>sideEffects</code> enables aggressive shaking</h3>
        <CodeBlock
          code={`// package.json
{ "name": "mylib", "sideEffects": false }
// Tells the bundler: NOTHING in this package has import-time side effects.
// Every unused export can be removed. If you DO have a polyfill file:
{ "name": "mylib", "sideEffects": ["./src/polyfill.js"] }`}
          filename="side-effects.json"
        />

        <h3 className="article-h3">3. Per-method imports avoid pulling a whole lib</h3>
        <CodeBlock
          code={`// BAD (CJS lodash): pulls the whole library even if you use one fn
import { debounce } from "lodash"; // ~70KB+

// GOOD: per-method ESM/CJS import — only debounce ships
import debounce from "lodash/debounce"; // ~1KB
// or use lodash-es with tree shaking:
import debounce from "lodash-es/debounce";`}
          filename="lodash.js"
        />

        <h3 className="article-h3">4. Shared vendor chunk dedupes</h3>
        <CodeBlock
          code={`// If \`react\` is imported by both \`main\` and \`admin\` chunks, the bundler
// extracts it into a shared \`vendor\` chunk so it's downloaded once and
// cached. Vite/webpack do this automatically; you can tune the split:
// vite.config.js
export default {
  build: { rollupOptions: { output: { manualChunks: { react: ["react", "react-dom"] } } } },
};`}
          filename="vendor.js"
        />

        <h3 className="article-h3">5. Inspecting the bundle</h3>
        <CodeBlock
          code={`// Tools to find bloat:
// - vite build --report / rollup-plugin-visualizer  → treemap of chunk sizes
// - webpack-bundle-analyzer
// - source-map-explorer
// Look for: huge deps, code that should be lazy, duplicated versions of
// the same package (e.g. two \`react\`s from version skew).`}
          filename="inspect.js"
        />

        <h3 className="article-h3">6. Side effects break tree shaking</h3>
        <CodeBlock
          code={`// utils.js
globalThis.__MY_FLAG__ = true;     // side effect: runs on import
export function used() {}
export function unused() {}        // can't be safely removed — module has a side effect
// Even with ESM, the bundler keeps unused() because removing the module
// would drop the __MY_FLAG__ assignment. Mark sideEffects:false ONLY if
// truly side-effect-free.`}
          filename="broke-shaking.js"
        />

        <div className="article-callout">
          <p>
            Modern trend: ship less bundling in dev. Vite serves modules unbundled in dev (the browser loads ESM
            directly via native <code>{'<script type="module">'}</code>), and only bundles for production. This is why
            Vite dev servers start instantly regardless of app size &mdash; no upfront graph build. The bundle still
            happens for production, where load time matters more than build time.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            In a throwaway Vite app, deliberately bloat the bundle (import all of <code>lodash</code>), measure it,
            then fix it three ways: (1) per-method imports, (2) switching to <code>lodash-es</code>, (3) marking{' '}
            <code>sideEffects</code>. Use <code>rollup-plugin-visualizer</code> to see the chunk treemap before/after.
            Then add a lazy route and confirm it becomes a separate chunk.
          </p>
        </div>

        <CodeBlock
          code={`// 1. Bloat — measure baseline bundle size
import _ from "lodash"; // whole library, ~70KB gzipped

// 2a. Fix: per-method
import debounce from "lodash/debounce";

// 2b. Fix: lodash-es + tree shaking
import { debounce } from "lodash-es";

// 3. Declare side effects if your own lib is clean:
//    package.json → { "sideEffects": false }

// 4. Lazy route → separate chunk
const Settings = lazy(() => import("./Settings"));

// Measure: \`vite build\` then open dist/stats.html (via visualizer).
// Expect: baseline huge → after fix, Settings chunk separate + main smaller.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does <code>{'import _ from "lodash"'}</code> bloat the bundle even if you only call <code>_.debounce</code>?
            (Because it&apos;s a default import of the whole CJS module &mdash; you reference the module object, so the
            bundler must include the entire module. There&apos;s no static named-import edge it can shake. Per-method or
            ESM imports create precise edges the bundler can prune.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What does a bundler do?</h4>
            <p className="iq-a">
              It reads your entry point, follows <code>import</code>/<code>require</code> edges to build the dependency
              graph, transforms the code (compile, transpile, minify), and emits one or more optimized output files.
              Its jobs: reduce request count (merge modules), remove dead code (tree-shake), enable lazy loading (code
              splitting), and dedupe shared dependencies. Without it you&apos;d ship hundreds of files and dead code.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is the dependency graph?</h4>
            <p className="iq-a">
              The directed graph of modules connected by import edges, rooted at the entry point. The bundler builds it
              by resolving each import (bare specifiers, extensions, aliases) and collecting every unique module. It&apos;s
              the data structure every optimization operates on: tree shaking removes unreachable nodes, code splitting
              cuts it at dynamic-import edges, vendor chunks dedupe shared subgraphs.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is tree shaking and what does it require?</h4>
            <p className="iq-a">
              Removing unused exports from the bundle. It requires <strong>static module structure</strong> (ESM) so the
              bundler can see which exports are referenced without executing code, plus knowledge of side effects
              (via <code>package.json</code> <code>sideEffects</code>). CJS can&apos;t be safely tree-shaken because{' '}
              <code>require</code> is dynamic and exports may have runtime side effects.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is code splitting and how do you trigger it?</h4>
            <p className="iq-a">
              Emitting multiple bundles (chunks) loaded on demand, so the initial download is smaller. It&apos;s
              triggered by dynamic <code>import()</code> (returns a promise) &mdash; each <code>import()</code> becomes
              a chunk boundary. Common uses: route-level splits (<code>React.lazy</code>), conditional feature loads,
              and shared vendor chunks. The browser fetches the chunk only when the import runs.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Why might <code>{'import { x } from "lib"'}</code> still pull in the whole library?</h4>
            <p className="iq-a">
              If <code>lib</code> is CommonJS or marked with side effects, the bundler can&apos;t safely remove
              unreferenced exports &mdash; it includes the whole module. Fixes: use an ESM build of the lib, import the
              specific submodule (<code>lib/x</code>), or mark <code>sideEffects: false</code> if the package is truly
              side-effect-free. A famous example is lodash (CJS) vs lodash-es (ESM, shakable).
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What is the <code>sideEffects</code> field for?</h4>
            <p className="iq-a">
              It tells the bundler which files have import-time side effects (code that runs just by importing &mdash;
              polyfills, global mutations). <code>{'"sideEffects": false'}</code> means none do, so every unused export
              can be safely removed. Listing specific files (<code>{'["./polyfill.js"]'}</code>) marks only those as
              unshakable. It&apos;s how libraries opt into aggressive tree shaking without breaking side-effecty code.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How would you reduce a 2MB initial bundle to 300KB?</h4>
            <p className="iq-a">
              Measure first (bundle analyzer), then attack the biggest offenders: (1) <strong>code split</strong> &mdash;
              move routes/heavy features behind <code>import()</code> so they&apos;re not in the initial chunk; (2){' '}
              <strong>tree-shake dependencies</strong> &mdash; switch CJS libs to ESM, use per-method imports (lodash),
              mark <code>sideEffects: false</code>; (3) <strong>dedupe</strong> &mdash; ensure one version of each dep
              (resolve version skew); (4) <strong>lazy-load below-the-fold</strong> components; (5){' '}
              <strong>replace heavy libs</strong> with smaller alternatives (Moment &rarr; date-fns); (6){' '}
              <strong>compress</strong> &mdash; gzip/brotli, set long cache headers with content hashing. The principle:
              ship only what the first paint needs; defer everything else. The analyzer tells you where the bytes are;
              the tools above remove them.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
