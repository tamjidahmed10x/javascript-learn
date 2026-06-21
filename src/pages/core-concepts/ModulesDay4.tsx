import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('modules-perf-memory')!
const navItems = weekNav(week)

export default function ModulesDay4() {
  const { prev, next } = dayNavLinks(week, 4)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[3].title}</h1>
        <p className="lesson-subtitle">
          A leak is just a forgotten reference. Yesterday you learned reachability; today you hunt the four places it
          hides.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>memory leak</strong> is memory that stays reachable (so the GC won&apos;t reclaim it) but that
            you&apos;ll never use again. The four classic causes: <strong>closures</strong> capturing too much,
            <strong> forgotten timers/listeners</strong>, <strong>detached DOM</strong>, and <strong>growing
            caches/collections</strong>.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Each keeps an object reachable through a forgotten reference. You detect them with heap snapshots, the
            allocation timeline, and watching <code>performance.memory</code> /{' '}
            <code>process.memoryUsage()</code> grow over time instead of stabilizing.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Long-lived sessions (SPAs, editors, dashboards) are most vulnerable &mdash; small leaks compound over
            hours. A leak in a short-lived page reload is invisible; in a never-reload app, it crashes the tab.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Yesterday&apos;s rule: an object is freed when nothing reaches it. A leak is the failure mode &mdash; an
          object you&apos;re done with but that something <em>still references</em>, so the GC can&apos;t collect it.
          The reference is almost always one you forgot you created.
        </p>

        <CodeBlock
          code={`// Classic leak: a timer that never stops
function setup() {
  const huge = new Array(1e6).fill(0);
  setInterval(() => console.log(huge.length), 1000); // huge captured forever
}
setup();
// \`huge\` stays alive as long as the interval runs — and we never clear it.
// The function returned, but the timer holds the closure holds the array.`}
          filename="intro.js"
        />

        <p className="article-para">
          <code>huge</code> is unreachable from your code &mdash; you can&apos;t even get to it. But the timer&apos;s
          callback closes over it, and the timer is registered with the runtime (a root). So the GC sees it as alive.
          That&apos;s the shape of every leak: a forgotten path from a root to dead data.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Memory leak</dt>
            <dd className="def-text">
              Memory that remains reachable (uncollectable) but is no longer needed. Not a crash &mdash; a slow growth
              that degrades performance and eventually exhausts memory.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Retention path</dt>
            <dd className="def-text">
              The chain of references from a root to a leaked object. Heap-snapshot tools show this path &mdash; finding
              it is finding the bug.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Detached DOM</dt>
            <dd className="def-text">
              A DOM node removed from the document but still referenced by JS. It and its subtree (and event
              listeners) stay alive &mdash; a common, expensive leak.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Sticky-Note Analogy</h2>
        <p className="article-para">
          Imagine the GC as a janitor who clears any desk with no name on it. A leak is a <strong>sticky note with
          someone&apos;s name that they never come back for</strong> &mdash; the desk stays &ldquo;reserved&rdquo;
          forever because the note (reference) keeps it marked. The person (your data) is long gone, but the note
          lingers in the booking system (a root), so the desk never frees. Fix the leak by removing the note.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🧹</span>
            <span className="analogy-label">The janitor</span>
            <span className="analogy-target">The garbage collector</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🗒️</span>
            <span className="analogy-label">A lingering sticky note</span>
            <span className="analogy-target">A forgotten reference from a root</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🪑</span>
            <span className="analogy-label">A reserved-but-empty desk</span>
            <span className="analogy-target">Leaked memory (reachable, unused)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔍</span>
            <span className="analogy-label">Find the note, peel it off</span>
            <span className="analogy-target">Find the retention path, null the reference</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Leaks are worst in long-lived sessions. A page that reloads every minute self-heals (the whole heap is
            thrown away). A single-page app that runs for hours accumulates &mdash; every leaked listener, every
            detached node, every growing cache adds up until the tab crashes. This is why SPAs need disciplined
            cleanup.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Four Causes</h2>
        <p className="article-para">
          Almost every JS leak is one of four shapes. Learn to recognize each on sight.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Closures capturing more than intended</h4>
            <p className="theory-desc">
              A closure holds its whole lexical environment alive. If it outlives its scope (stored, returned), every
              large object in that environment stays reachable &mdash; even ones the closure never uses. (Week 2 Day 1,
              Week 5 Day 1.)
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Forgotten timers &amp; listeners</h4>
            <p className="theory-desc">
              <code>setInterval</code>/<code>setTimeout</code> and <code>addEventListener</code> register a callback
              with the runtime (a root). Forget to clear/remove them and the callback &mdash; and everything it
              captures &mdash; lives forever. The single most common leak.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Detached DOM nodes</h4>
            <p className="theory-desc">
              <code>removeChild</code> detaches a node from the page, but if JS still references it, the node and its
              subtree (plus attached listeners) stay in memory &mdash; invisible on screen, alive in the heap. Often
              paired with listener leaks.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Unbounded caches &amp; collections</h4>
            <p className="theory-desc">
              A <code>Map</code>/<code>Set</code>/array that grows without eviction keeps every entry alive forever.
              Use a bounded cache (LRU), <code>WeakMap</code> for object-keyed metadata, or periodic cleanup.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Detection toolkit</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Observe growth</span>
            <p className="phase-desc">Watch memory rise instead of stabilizing.</p>
            <ul className="phase-rules">
              <li>DevTools Performance &rarr; Memory</li>
              <li><code>performance.memory</code> (Chrome)</li>
              <li><code>process.memoryUsage()</code> (Node)</li>
              <li>Sawtooth that trends up = leak</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Find the retention path</span>
            <p className="phase-desc">Heap snapshots reveal what holds the leak.</p>
            <ul className="phase-rules">
              <li>Take snapshot, do action, take another</li>
              <li>Compare (&ldquo;objects allocated between&rdquo;)</li>
              <li>Inspect <strong>Retainers</strong> panel</li>
              <li>Allocation timeline for live view</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The diagnostic loop: (1) take a heap snapshot, (2) perform the suspected action (open/close a panel, navigate
            a route), (3) force GC, (4) take another snapshot, (5) diff. Objects that grew and didn&apos;t shrink are
            leaked; their <strong>Retainers</strong> panel shows the reference chain keeping them alive &mdash; the
            exact line to fix.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Leaks Matter Now</h2>
        <p className="article-para">
          In the page-reload era, leaks were self-limiting &mdash; every navigation threw away the whole heap. The rise
          of single-page apps (post-2010) made leaks critical: a tab open for days accumulates every forgotten listener
          and detached node. Modern frameworks (React, Vue) help by auto-cleaning effects/listeners on unmount, but
          imperative code (timers, observers, manual DOM) still leaks if you forget cleanup. The shift from
          &ldquo;pages&rdquo; to &ldquo;long-running apps&rdquo; turned memory hygiene from nice-to-have into
          essential.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Leak type</th>
                <th>Typical cause</th>
                <th>Fix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Closure retention</td>
                <td>Closure outlives scope, holds large env</td>
                <td>Narrow capture; null the closure</td>
              </tr>
              <tr>
                <td>Timers</td>
                <td><code>setInterval</code> never cleared</td>
                <td><code>clearInterval</code> on cleanup</td>
              </tr>
              <tr>
                <td>Listeners</td>
                <td><code>addEventListener</code> never removed</td>
                <td><code>removeEventListener</code> / <code>AbortSignal</code></td>
              </tr>
              <tr>
                <td>Detached DOM</td>
                <td>JS refs a removed node</td>
                <td>Null the reference; avoid storing nodes</td>
              </tr>
              <tr>
                <td>Unbounded cache</td>
                <td>Map/Set grows forever</td>
                <td>LRU / WeakMap / eviction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Diagnosing a Listener Leak</h2>

        <CodeBlock
          code={`// A component that adds a listener but never removes it
function attachWidget(element) {
  const data = new Array(1e6).fill(0); // big payload
  element.addEventListener("click", function onClick() {
    console.log(data.length);
  });
}
const el = document.querySelector("#w");
attachWidget(el);
// Later: el is removed from the DOM, but the listener + \`data\` survive.`}
          filename="listener-leak.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Symptom:</strong> in DevTools Memory, heap grows each time the widget is attached; forcing GC
              doesn&apos;t bring it back down. Sawtooth trending upward.
            </span>
          </li>
          <li>
            <span>
              <strong>Snapshot diff:</strong> take snapshot S1, attach+detach the widget, force GC, take S2. The{' '}
              <code>Array</code> of 1e6 entries appears in &ldquo;objects allocated between S1 and S2&rdquo; and is{' '}
              <em>not</em> collected.
            </span>
          </li>
          <li>
            <span>
              <strong>Retainers:</strong> select the leaked Array; the Retainers panel shows{' '}
              <code>onClick</code> (the listener) &rarr; <code>element</code> &rarr; still registered with the event
              system. The closure <code>onClick</code> captures <code>data</code>; the listener registration is the
              root keeping it all alive.
            </span>
          </li>
          <li>
            <span>
              <strong>Fix:</strong> keep a reference to the listener and remove it on cleanup &mdash; or use an{' '}
              <code>AbortController</code> so a single <code>abort()</code> tears down the listener. Once removed, the{' '}
              <code>onClick</code> closure is unreachable &rarr; <code>data</code> is unreachable &rarr; GC reclaims it.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Timer leak &rarr; fix with cleanup</h3>
        <CodeBlock
          code={`// LEAK: interval runs forever, captures \`big\`
function start() {
  const big = new Array(1e6).fill(0);
  setInterval(() => console.log(big.length), 1000);
}

// FIX: return a stop function and clear it
function startFixed() {
  const big = new Array(1e6).fill(0);
  const id = setInterval(() => console.log(big.length), 1000);
  return () => clearInterval(id); // caller invokes to release \`big\`
}
const stop = startFixed();
// ...later, when done:
stop(); // interval cleared → \`big\` unreachable → GC'd`}
          filename="timer.js"
        />

        <h3 className="article-h3">2. Listener leak &rarr; <code>AbortController</code></h3>
        <CodeBlock
          code={`// Modern cleanup: one signal controls many listeners
const ac = new AbortController();
document.addEventListener("click", onClick, { signal: ac.signal });
window.addEventListener("resize", onResize, { signal: ac.signal });
// Teardown — removes BOTH at once:
ac.abort();
// \`ac.abort()\` makes the signal remove every listener registered with it.
// Cleaner than storing each removeEventListener reference.`}
          filename="abort-listener.js"
        />

        <h3 className="article-h3">3. Detached DOM leak</h3>
        <CodeBlock
          code={`// LEAK: reference held after removal
let cache;
function render() {
  const div = document.createElement("div");
  div.textContent = "hi";
  cache = div;                  // retained!
  document.body.appendChild(div);
  document.body.removeChild(div); // detached, but \`cache\` holds it
}
// FIX: don't store DOM nodes you don't need; null the reference.
function renderFixed() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  // ...use it...
  document.body.removeChild(div); // no lingering reference → collected
}`}
          filename="detached.js"
        />

        <h3 className="article-h3">4. Unbounded cache &rarr; WeakMap or LRU</h3>
        <CodeBlock
          code={`// LEAK: grows forever
const cache = new Map();
function get(obj) { if (!cache.has(obj)) cache.set(obj, compute(obj)); return cache.get(obj); }

// FIX A: WeakMap (object keys die with the key)
const cache = new WeakMap(); // entries vanish when obj is GC'd elsewhere

// FIX B: bounded LRU for primitive/string keys
function makeLRU(max) {
  const m = new Map();
  return {
    get(k) { if (!m.has(k)) return undefined; const v = m.get(k); m.delete(k); m.set(k, v); return v; },
    set(k, v) { if (m.has(k)) m.delete(k); else if (m.size >= max) m.delete(m.keys().next().value); m.set(k, v); },
  };
}`}
          filename="cache.js"
        />

        <h3 className="article-h3">5. Closure capturing more than needed</h3>
        <CodeBlock
          code={`// LEAK: the handler captures the entire large \`config\`
function makeHandler(config) {
  const huge = config.big; // big object
  return () => console.log(huge.length); // holds \`config\` (and huge) alive
}

// FIX: extract only what you need so the big object can be collected
function makeHandlerFixed(config) {
  const len = config.big.length; // primitive — no reference to \`config\`
  return () => console.log(len);
}`}
          filename="closure-narrow.js"
        />

        <h3 className="article-h3">6. React <code>useEffect</code> cleanup (framework-managed)</h3>
        <CodeBlock
          code={`useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup runs on unmount → no leak
}, []);
// Frameworks automate this: return a teardown from the effect and it's
// called on unmount. The leak only happens if you forget the return.`}
          filename="react-effect.js"
        />

        <div className="article-callout">
          <p>
            The universal fix pattern: <strong>whatever you register, store a handle to remove it</strong>. Timer &rarr;
            keep the id. Listener &rarr; keep the fn (or use <code>AbortSignal</code>). Observer &rarr; keep it to{' '}
            <code>disconnect()</code>. The handle lives as long as the thing it observes; when that ends, you tear
            down. Frameworks formalize this in lifecycle/effect cleanup hooks.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Write a leaky widget (adds a listener + interval capturing a big array, stores a detached node, grows a
            cache), measure the heap grow in DevTools across 10 open/close cycles, then fix each leak and confirm the
            heap stabilizes. Use heap-snapshot diffs to find the retention paths.
          </p>
        </div>

        <CodeBlock
          code={`// LEAKY VERSION — find and fix each leak
let cache = new Map();
function openWidget() {
  const big = new Array(5e5).fill(0);
  const id = setInterval(() => console.log(big.length), 1000);
  const node = document.createElement("div");
  node.addEventListener("mousemove", () => cache.set(Date.now(), big));
  document.body.appendChild(node);
  // ...no cleanup returned...
}

// FIXED VERSION — every registration has a teardown
function openWidgetFixed() {
  const big = new Array(5e5).fill(0);
  const id = setInterval(() => console.log(big.length), 1000);
  const node = document.createElement("div");
  const ac = new AbortController();
  node.addEventListener("mousemove", () => cache.set(Date.now(), big.slice(0,10)), { signal: ac.signal });
  document.body.appendChild(node);
  return () => { clearInterval(id); ac.abort(); node.remove(); };
}
const close = openWidgetFixed();
// ...later: close();  → all four leaks resolved`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            After calling <code>close()</code>, what keeps <code>big</code> alive? (Nothing &mdash; the interval is
            cleared, the listener aborted, the node removed. With no root reaching <code>big</code>, the GC reclaims it
            on the next collection. If the heap doesn&apos;t drop after <code>close()</code> + forced GC, you missed a
            reference &mdash; re-snapshot to find it.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a memory leak in JavaScript?</h4>
            <p className="iq-a">
              Memory that stays reachable (so the GC can&apos;t reclaim it) but that the program will never use again.
              It&apos;s caused by a forgotten reference from a root &mdash; a closure capturing too much, an uncleared
              timer/listener, a detached DOM node, or an unbounded cache. The result is heap growth that degrades
              performance and can crash long-running tabs.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Name the four common causes of JS memory leaks.</h4>
            <p className="iq-a">
              (1) Closures that capture more of their environment than they use; (2) forgotten timers
              (<code>setInterval</code>) and event listeners (<code>addEventListener</code>) never cleared/removed;
              (3) detached DOM nodes referenced by JS after removal; (4) unbounded caches/collections (Map/Set/arrays)
              that grow without eviction. Each keeps otherwise-dead objects reachable.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. How do you detect a memory leak?</h4>
            <p className="iq-a">
              Watch memory grow instead of stabilize: DevTools Performance/Memory, <code>performance.memory</code>, or{' '}
              <code>process.memoryUsage()</code>. A sawtooth trending up after repeated actions (and not dropping on
              forced GC) signals a leak. To find it: take a heap snapshot, perform the action, force GC, snapshot
              again, diff, and inspect the <strong>Retainers</strong> of objects that survived &mdash; that panel shows
              the reference chain keeping them alive.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. How do you prevent timer/listener leaks?</h4>
            <p className="iq-a">
              Store a handle and remove it on cleanup: <code>clearInterval(id)</code> for timers;{' '}
              <code>removeEventListener(type, fn)</code> for listeners (the same function reference). The modern
              approach is <code>AbortController</code> &mdash; register multiple listeners with one{' '}
              <code>signal</code> and <code>abort()</code> to remove them all. In frameworks, return a teardown from an
              effect/lifecycle hook so cleanup is automatic on unmount.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Why is a detached DOM node a leak, and how do you fix it?</h4>
            <p className="iq-a">
              When you <code>removeChild</code> a node, it leaves the document but any JS reference to it keeps it
              alive &mdash; along with its subtree and any attached listeners. It&apos;s invisible on screen yet
              occupies heap. Fix by nulling the reference after removal, avoiding storing nodes you don&apos;t need,
              and removing listeners before detaching. Heap snapshots show detached nodes under &ldquo;Detached DOM
              tree&rdquo; &mdash; a clear tell.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How does a closure cause a leak, and how do you fix it?</h4>
            <p className="iq-a">
              A closure holds its whole lexical environment alive as long as the closure is reachable. If it outlives
              its scope (returned, stored, used in a long-lived callback), every object in that environment stays
              reachable &mdash; even ones the closure never reads. Fix by narrowing the capture (extract only the
              primitive you need before creating the closure) or nulling the closure when done. The Week 2 Day 1
              &ldquo;100MB array&rdquo; trap and the WeakMap value-cycle (Week 5 Day 5) are variants.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). A long-running SPA&apos;s heap grows by 5MB per navigation and never drops. How do you debug it?</h4>
            <p className="iq-a">
              First, confirm it&apos;s a leak not churn: force GC (DevTools) after navigating &mdash; if memory
              doesn&apos;t return to baseline, it&apos;s a leak. Then isolate: take a heap snapshot at baseline,
              navigate away and back a few times, force GC, snapshot again, and diff. The diff shows objects retained
              across navigations &mdash; group by constructor (Detached DOM trees, (closure), Array, Map). For each
              suspicious cluster, open the <strong>Retainers</strong> panel to see the reference chain from a root;
              that chain names the exact forgotten cleanup. Common SPA culprits: route components that add
              listeners/timers without unmount cleanup, a global store keeping old route data, observers
              (<code>ResizeObserver</code>/<code>IntersectionObserver</code>) not disconnected, and caches keyed by
              route that grow unbounded. Fix each retention path, re-test the navigate-and-GC cycle until the heap
              stabilizes at baseline. Automate with a puppeteer memory-leak test for regression protection.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
