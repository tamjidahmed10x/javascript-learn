import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('modules-perf-memory')!
const navItems = weekNav(week)

export default function ModulesDay7() {
  const { prev } = dayNavLinks(week, 7)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[6].title}</h1>
        <p className="lesson-subtitle">
          One week, condensed. Then ten problems spanning modules, GC, leaks, and timing &mdash; the system that runs
          your code.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A compressed review of the week &mdash; ESM vs CJS, bundling &amp; tree shaking, garbage collection, memory
            leaks, debounce/throttle/delegation, and the timing primitives &mdash; followed by hard problems and a
            self-assessment.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Memorize the cheat sheet, then attempt each problem cold. These tie the language to the engine: a single
            problem may need the ESM graph, reachability, and a <code>rAF</code> loop together.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            End of Week 6. If you can solve 7 of 10 cold and explain the trade-offs, you&apos;re ready for Week 7 (JS
            Engine Internals).
          </p>
        </div>
      </div>

      {/* ── Cheat Sheet ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Week 6 Cheat Sheet</h2>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">ESM vs CJS</h4>
            <p className="theory-desc">ESM: static <code>import</code>, live bindings, async load, tree-shakeable. CJS: dynamic <code>require</code>, snapshots, sync. Static structure is why ESM wins tooling.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Bundling</h4>
            <p className="theory-desc">Build the dependency graph from the entry; <strong>tree-shake</strong> unreferenced side-effect-free exports; <strong>code-split</strong> at <code>import()</code> boundaries; minify &amp; emit chunks.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Garbage collection</h4>
            <p className="theory-desc">Mark-and-sweep frees objects unreachable from roots. Generational: young gen (cheap, frequent) vs old gen (expensive, rare). Cycles die if no root reaches them.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Memory leaks</h4>
            <p className="theory-desc">Four causes: closure over-capture, forgotten timers/listeners, detached DOM, unbounded caches. Fix by removing the retention path; detect with heap-snapshot diffs + Retainers.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Debounce / throttle / delegation</h4>
            <p className="theory-desc">Debounce: run once after calm (search). Throttle: cap rate (scroll). Delegation: one parent listener via bubbling + <code>target</code>. Always cancel timers on cleanup.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Timing primitives</h4>
            <p className="theory-desc"><code>rAF</code> pre-paint (animation); microtasks before paint (&ldquo;ASAP&rdquo;); <code>setTimeout</code> macrotask (defer/yield); <code>requestIdleCallback</code> spare time (background). Time-base animations for frame-rate independence.</p>
          </div>
        </div>
      </section>

      {/* ── Common Traps ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Seven Traps</h2>
        <p className="article-para">
          These recur in production and interviews. Recognize the shape.
        </p>

        <ol className="article-ol">
          <li><strong>CJS snapshot stale data</strong> &mdash; destructured exports don&apos;t see later mutations (Day 1).</li>
          <li><strong>Whole-library import</strong> &mdash; <code>{'import _ from "lodash"'}</code> blocks tree shaking (Day 2).</li>
          <li><strong>Closure over-capture</strong> &mdash; a returned fn keeps a huge scope alive (Day 4).</li>
          <li><strong>Uncleared timer/listener</strong> &mdash; the #1 leak; keep a handle, clear on teardown (Day 4).</li>
          <li><strong>Detached DOM</strong> &mdash; removed node still referenced &rarr; leak (Day 4).</li>
          <li><strong>Animating with <code>setInterval</code></strong> &mdash; frame-misaligned, runs in background tabs (Day 6).</li>
          <li><strong>Fixed-increment animation</strong> &mdash; runs at different speeds on different refresh rates (Day 6).</li>
        </ol>
      </section>

      {/* ── Hard Problems ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Hard Problems</h2>
        <p className="article-para">
          Attempt each before reading the answer. These connect language features to engine behavior.
        </p>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 1. ESM output?</h4>
          <CodeBlock
            code={`// counter.mjs
export let count = 0;
export function bump() { count++; }
// app.mjs
import { count, bump } from "./counter.mjs";
console.log(count); bump(); console.log(count);`}
            filename="p1.js"
          />
          <p className="iq-a">
            <code>0</code>, then <code>1</code>. ESM exports are live bindings &mdash; <code>count</code> in{' '}
            <code>app.mjs</code> is a read-only reference to the exporter&apos;s variable, so after{' '}
            <code>bump()</code> mutates it, the importer sees the new value. (The CJS equivalent would print{' '}
            <code>0, 0</code> because it destructured a snapshot.)
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 2. CJS output?</h4>
          <CodeBlock
            code={`// counter.cjs
let count = 0;
function bump() { count++; }
module.exports = { count, bump };
// app.cjs
const { count, bump } = require("./counter");
console.log(count); bump(); console.log(count);`}
            filename="p2.js"
          />
          <p className="iq-a">
            <code>0</code>, then <code>0</code>. CJS copies the exported values at <code>require</code>-time.{' '}
            <code>count</code> in <code>app.cjs</code> is a local variable holding the number <code>0</code>;{' '}
            <code>bump()</code> mutated the exporter&apos;s internal <code>count</code>, not your copy. To see changes
            in CJS, export a shared object and mutate its property.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 3. Which exports survive tree shaking?</h4>
          <CodeBlock
            code={`// utils.mjs
globalThis.__inited = true;   // (A) side effect on import
export function used() {}      // (B) imported by app
export function unused() {}    // (C) never imported
// app.mjs: import { used } from "./utils.mjs";`}
            filename="p3.js"
          />
          <p className="iq-a">
            <code>used</code> (B) survives (imported). <code>unused</code> (C) is dropped <em>only if</em> the package is
            marked side-effect-free; because <code>(A)</code> is a side effect on import, a conservative bundler keeps
            the whole module (including <code>unused</code>) to preserve the <code>__inited</code> assignment. Marking{' '}
            <code>{'"sideEffects": false'}</code> in <code>package.json</code> (truthfully) lets the bundler drop{' '}
            <code>unused</code> &mdash; but only if there really are no side effects.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 4. Is this a leak?</h4>
          <CodeBlock
            code={`let ref;
function make() {
  const big = new Array(1e6).fill(0);
  ref = () => big.length;
  return ref;
}
const fn = make();
fn();`}
            filename="p4.js"
          />
          <p className="iq-a">
            Yes &mdash; <code>ref</code> is a module-level variable holding the closure, which captures <code>big</code>.
            As long as <code>ref</code> is assigned, <code>big</code> (and its ~8MB) stays reachable and is never
            collected. Fix: <code>ref = null</code> when done, or don&apos;t store the closure in a long-lived
            variable. The leak is the retained reference, not the closure itself.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 5. Output of the debounced calls?</h4>
          <CodeBlock
            code={`const d = debounce(console.log, 100);
d("a"); d("b"); d("c");      // burst at t=0..20
// ...no more calls...
// (assume wait=100ms, what logs and when?)`}
            filename="p5.js"
          />
          <p className="iq-a">
            <code>"c"</code> logs once, ~100ms after the last call (t&asymp;120). Each call resets the timer; only after{' '}
            <code>100ms</code> of silence does the timeout fire, invoking <code>fn</code> with the <em>latest</em> args
            (<code>"c"</code>). The earlier <code>"a"</code>/<code>"b"</code> are discarded entirely &mdash; that&apos;s
            the point of debounce: one execution per quiet period.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 6. Implement <code>debounce</code> with a <code>.cancel()</code> and a leading-edge option.</h4>
          <CodeBlock
            code={`function debounce(fn, wait, { leading = false } = {}) {
  let timer = null;
  const d = function (...args) {
    const callNow = leading && timer === null;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; if (!leading) fn.apply(this, args); }, wait);
    if (callNow) fn.apply(this, args);
  };
  d.cancel = () => { clearTimeout(timer); timer = null; };
  return d;
}`}
            filename="p6.js"
          />
          <p className="iq-a">
            Trailing edge (default): each call clears and resets the timer; <code>fn</code> runs once after{' '}
            <code>wait</code> of silence. Leading edge (<code>leading: true</code>): fire on the first call, then lock
            until <code>wait</code> passes with no calls. <code>.cancel()</code> clears the pending timer for cleanup.
            The <code>timer === null</code> guard distinguishes &ldquo;no pending call&rdquo; from &ldquo;a call is
            scheduled,&rdquo; which is what makes the leading-edge logic correct.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 7. Why does this animation jank, and how do you fix it?</h4>
          <CodeBlock
            code={`setInterval(() => {
  box.style.transform = \`translateX(\${pos += 5}px)\`;
  document.querySelector("#dbg").textContent = pos; // forces layout
}, 16);`}
            filename="p7.js"
          />
          <p className="iq-a">
            Two problems: (1) <code>setInterval</code> is frame-misaligned and keeps running in background tabs &mdash; use{' '}
            <code>requestAnimationFrame</code> to sync to the paint cycle. (2) Writing <code>textContent</code> inside
            the loop <strong>forces synchronous layout</strong> (layout thrash) every tick &mdash; reading/writing DOM
            alternately makes the browser recalculate layout repeatedly. Fix: move to a <code>rAF</code> loop, batch DOM
            writes, and avoid interleaving reads (<code>offsetTop</code>) with writes (<code>style</code>). Better:
            drop the debug read or update it at a throttled rate.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 8. A SPA&apos;s heap grows 5MB per route change and never drops. Outline the debug.</h4>
          <p className="iq-a">
            (1) Confirm it&apos;s a leak: force GC after navigating &mdash; if memory doesn&apos;t return to baseline,
            it&apos;s retention, not churn. (2) Take a baseline heap snapshot, navigate away and back a few times, force
            GC, snapshot again, diff. (3) Group survivors by constructor &mdash; look for Detached DOM trees,
            <code> (closure)</code>, growing <code>Map</code>/<code>Array</code>. (4) For each cluster, open the{' '}
            <strong>Retainers</strong> panel to see the reference chain from a root &mdash; that names the forgotten
            cleanup. Common SPA culprits: listeners/timers added in route components without unmount cleanup,
            observers (<code>ResizeObserver</code>, <code>IntersectionObserver</code>) not disconnected, a global store
            retaining old route data, caches keyed by route that grow unbounded. Fix each retention path and re-test
            until the heap stabilizes.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 9. Reduce a 2MB initial bundle to 300KB &mdash; ordered steps.</h4>
          <p className="iq-a">
            Measure first (bundle analyzer), then attack biggest offenders: (1) <strong>code split</strong> &mdash; move
            routes/heavy features behind <code>import()</code>; (2) <strong>tree-shake deps</strong> &mdash; switch CJS
            libs to ESM, use per-method imports (lodash/debounce), mark <code>sideEffects: false</code>; (3){' '}
            <strong>dedupe</strong> &mdash; one version of each dep; (4) <strong>lazy-load below-the-fold</strong>; (5){' '}
            <strong>replace heavy libs</strong> (Moment&rarr;date-fns); (6) <strong>compress</strong> (brotli/gzip) +
            long-cache with content hashing. Principle: ship only what first paint needs; defer the rest.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 10. Combine everything: a leak-free, throttled, lazy-loaded module.</h4>
          <CodeBlock
            code={`// Feature is code-split (loaded on demand) and cleans up fully.
let cleanup = null;
async function openChart() {
  const { draw } = await import("./chart.mjs");        // (1) code-split
  const ac = new AbortController();                     // (2) one signal for cleanup
  let pos = 0;
  function frame() { draw(pos++); rafId = requestAnimationFrame(frame); }
  let rafId = requestAnimationFrame(frame);            // (3) rAF animation
  window.addEventListener("resize", throttle(() => draw(pos), 100), { signal: ac.signal }); // (4) throttle + cleanable
  cleanup = () => { cancelAnimationFrame(rafId); ac.abort(); cleanup = null; };
}
openChart();
// ...later:
cleanup?.(); // cancels rAF, removes listener, releases the dynamic module's scope`}
            filename="p10.js"
          />
          <p className="iq-a">
            One flow combining five week concepts: (1) dynamic <code>import()</code> code-splits the chart so it
            doesn&apos;t bloat the initial bundle; (2) <code>AbortController</code> gives a single teardown handle for
            all listeners; (3) <code>rAF</code> drives the animation frame-aligned; (4) <code>throttle</code> paces the
            resize handler; (5) <code>cleanup()</code> cancels the rAF, aborts listeners (no leak), and lets the
            dynamically-imported module&apos;s scope be collected when nothing else holds it. No retention paths &rarr;
            no leak &rarr; the heap returns to baseline after teardown.
          </p>
        </div>
      </section>

      {/* ── Self-Assessment ───────────────────────────────── */}
      <section className="day-section">
        <div className="challenge-section">
          <span className="challenge-label">Self-Assessment</span>
          <p>
            Rate yourself 1&ndash;5 on each. If anything is below 3, redo that day before moving on.
          </p>
          <ul className="challenge-list">
            <li>I can explain ESM live bindings vs CJS snapshots with an example.</li>
            <li>I know why ESM enables tree shaking and CJS doesn&apos;t.</li>
            <li>I can describe the bundler pipeline (graph &rarr; shake &rarr; split &rarr; emit).</li>
            <li>I can explain reachability and why cycles don&apos;t leak under mark-sweep.</li>
            <li>I can name the four leak causes and the fix pattern for each.</li>
            <li>I can debug a leak with heap snapshots and the Retainers panel.</li>
            <li>I can implement <code>debounce</code> and <code>throttle</code> from scratch with cleanup.</li>
            <li>I know when to use delegation vs debounce vs throttle.</li>
            <li>I can explain where <code>rAF</code>, microtasks, and <code>setTimeout</code> fire in one frame.</li>
            <li>I know why animation uses <code>rAF</code> and time-based motion.</li>
          </ul>

          <p style={{ marginTop: '1rem' }}>
            <strong>Ready for Week 7?</strong> JS Engine Internals goes inside V8 itself: the parse &rarr; AST &rarr;
            bytecode pipeline, JIT compilation with TurboFan, hidden classes and inline caching, deoptimization traps,
            stack vs heap memory layout, and reading the ECMA-262 spec. The GC and module knowledge from this week
            returns immediately &mdash; hidden classes explain why object shape stability matters, and the spec is the
            source of truth for every behavior you&apos;ve learned.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Final Practice (90 minutes)</span>
          <p>Timed. No notes, no autocomplete, no search:</p>
        </div>

        <CodeBlock
          code={`// From a blank file, in order:
// 1. Show ESM live binding vs CJS snapshot (two tiny modules each).
// 2. Implement debounce and throttle from scratch (with .cancel()).
// 3. Write an event-delegated click handler for a dynamic list.
// 4. Implement an rAF time-based animation loop with cleanup.
// 5. Write a leaky widget (timer + listener + detached node) and its fix.
// 6. Outline reducing a 2MB bundle to 300KB (ordered steps).
// 7. Describe the four GC/leak causes and how to detect each.

// Then solve Problems 4, 7, and 10 on paper, naming every concept used.`}
          filename="final-practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Why paper matters</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Performance and memory interviews test whether you can reason about the system, not just the syntax &mdash;
            predicting which exports ship, which references leak, which timer fires first. Doing it cold on paper proves
            the mental models are internalized, not Googled.
          </p>
        </div>
      </section>

      {/* ── Bridge to Week 7 ──────────────────────────────── */}
      <section className="day-section">
        <div className="week-bridge">
          <p>
            Week 6 complete. You now understand the <strong>system around the language</strong> &mdash; how modules
            bundle and tree-shake, how the garbage collector reclaims memory, where leaks hide, and which timing
            primitive fits each job. <strong>Week 7 (JS Engine Internals)</strong> goes one level deeper, inside V8:
            the parse &rarr; AST &rarr; Ignition bytecode &rarr; TurboFan JIT pipeline, hidden classes and inline
            caching (why object shape stability drives performance), deoptimization traps, stack vs heap memory, and
            reading ECMA-262 &mdash; the spec that defines every behavior you&apos;ve learned across all six weeks.
          </p>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
