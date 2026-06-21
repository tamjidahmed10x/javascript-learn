import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('modules-perf-memory')!
const navItems = weekNav(week)

export default function ModulesDay3() {
  const { prev, next } = dayNavLinks(week, 3)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[2].title}</h1>
        <p className="lesson-subtitle">
          You don&apos;t free memory &mdash; the GC reclaims what nothing reaches. Understand reachability and the
          model, and tomorrow&apos;s leaks become obvious.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            JavaScript uses <strong>automatic garbage collection</strong>: the engine tracks which objects are{' '}
            <strong>reachable</strong> from a set of roots (globals, the call stack) and reclaims everything else. V8
            uses a <strong>generational mark-and-sweep</strong> collector.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            The GC <em>marks</em> every object reachable from the roots by following references, then <em>sweeps</em>{' '}
            (frees) the unmarked ones. Most objects die young, so V8 focuses frequent, cheap collections on the{' '}
            &ldquo;young generation&rdquo; and rare, expensive ones on the &ldquo;old generation.&rdquo;
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always, invisibly. You never call <code>free()</code>. But you control reachability &mdash; and a leak is
            just an object you keep reachable by mistake (Day 4). The closures and WeakMaps from prior weeks tie
            directly in.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          In low-level languages you allocate memory and you free it. Get it wrong and you crash or leak. JavaScript
          removes that burden: you create objects, and when nothing can reach them anymore, the garbage collector
          (GC) reclaims them automatically. The cost of that convenience is one concept you must understand:{' '}
          <strong>reachability</strong>.
        </p>

        <CodeBlock
          code={`let user = { name: "Tamjid" };  // user references the object → reachable
user = null;                    // nothing references it now → eligible for GC
// The { name: "Tamjid" } object will be reclaimed on the next collection.`}
          filename="intro.js"
        />

        <p className="article-para">
          The instant <code>user</code> no longer points to the object, no path from any root reaches it &mdash; so
          it&apos;s garbage. The GC will notice and free it. A memory leak is precisely the failure of this: an object
          you <em>thought</em> was dead is still reachable through some forgotten reference.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Garbage collection (GC)</dt>
            <dd className="def-text">
              Automatic reclamation of memory that&apos;s no longer reachable. V8&apos;s collector runs periodically
              and during allocation pressure; you don&apos;t trigger it directly.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Reachability</dt>
            <dd className="def-text">
              An object is reachable if some chain of references leads to it from a <strong>root</strong> (global
              variables, the current call stack, etc.). Reachable objects survive; unreachable ones are collected.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Roots</dt>
            <dd className="def-text">
              The starting points the GC marks as definitely alive: global objects (<code>globalThis</code>), the call
              stack&apos;s local variables, DOM nodes attached to the document, and other engine-internal anchors.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Mark and sweep</dt>
            <dd className="def-text">
              The collection algorithm: <em>mark</em> every object reachable from the roots (follow references), then{' '}
              <em>sweep</em> (free) the unmarked ones. Simple, handles cycles, used (in evolved form) by V8.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Lost Luggage Analogy</h2>
        <p className="article-para">
          Imagine an airport baggage system. Each bag (object) has a tag listing who claims it (references). The
          airline periodically walks from the <strong>service desk</strong> (roots) following tags to find every bag
          still connected to a living passenger (<em>mark</em>). Any bag with no path back to the desk &mdash; no
          passenger reachable &mdash; goes to the unclaimed pile and is destroyed (<em>sweep</em>). Bags can reference
          each other, but if no chain reaches the desk, the whole cluster is lost.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🛎️</span>
            <span className="analogy-label">The service desk</span>
            <span className="analogy-target">GC roots (globals, stack)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧳</span>
            <span className="analogy-label">A bag with tags</span>
            <span className="analogy-target">An object with references</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔗</span>
            <span className="analogy-label">Tag chain back to desk</span>
            <span className="analogy-target">A path of references = reachable</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🗑️</span>
            <span className="analogy-label">Unclaimed pile</span>
            <span className="analogy-target">Unreachable &rarr; swept</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Crucially, <strong>cycles don&apos;t matter</strong>. Two bags tagged to each other but with no chain to
            the desk are both unclaimed &mdash; even though each &ldquo;reaches&rdquo; the other. Older reference-
            counting collectors couldn&apos;t handle this (a cycle kept everything alive); mark-and-sweep starts from
            roots and ignores self-referential clusters entirely.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Reachability, Mark-Sweep, Generations</h2>
        <p className="article-para">
          Three layers: the <em>reachability</em> rule (what&apos;s alive), the <em>mark-and-sweep</em> algorithm (how
          it&apos;s found), and the <em>generational</em> optimization (how V8 makes it fast).
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Reachability defines aliveness</h4>
            <p className="theory-desc">
              An object is alive iff reachable from a root via reference chains. Dropping the last reference makes it
              garbage. This is the only thing <em>you</em> control &mdash; by what you keep references to.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Mark-and-sweep finds the garbage</h4>
            <p className="theory-desc">
              From roots, the GC traverses references, marking every reached object. After marking, it sweeps the heap
              freeing unmarked objects. Handles cycles correctly (a cycle with no root path is swept).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Generational hypothesis: most objects die young</h4>
            <p className="theory-desc">
              Empirically, most objects are temporary (loop variables, intermediate results). V8 splits the heap into a
              small <strong>young generation</strong> (collected often, cheaply) and a large <strong>old
              generation</strong> (collected rarely, expensively). Objects that survive a few young-gen collections
              get promoted to old.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. GC pauses cost real time</h4>
            <p className="theory-desc">
              Collection stops your code (a &ldquo;stop-the-world&rdquo; pause, partially mitigated by incremental/
              concurrent GC). Long-lived, frequently-mutated object graphs cause longer pauses &mdash; felt as jank.
              Orchestration (object pools, reusing arrays) can reduce allocation pressure.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The generational heap</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Young generation (nursery)</span>
            <p className="phase-desc">Small, collected often and fast.</p>
            <ul className="phase-rules">
              <li>Short-lived objects: temp vars, intermediates</li>
              <li>Minor GC, ~milliseconds</li>
              <li>Survivors promoted to old gen</li>
              <li>Most allocations live and die here</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Old generation</span>
            <p className="phase-desc">Large, collected rarely and slowly.</p>
            <ul className="phase-rules">
              <li>Long-lived objects: caches, singletons, DOM</li>
              <li>Major GC, more expensive</li>
              <li>Where leaks accumulate</li>
              <li>Pauses here cause noticeable jank</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The generational design is why most allocations are nearly free: they live and die in the nursery, whose
            small size makes minor GCs cheap and frequent. The leaks that hurt (Day 4) are objects that{' '}
            <em>escape</em> to the old generation and linger &mdash; caches, closures holding large scopes, detached
            DOM nodes kept alive by a stray reference. Those survive major GCs and grow the heap over time.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why JS Uses GC</h2>
        <p className="article-para">
          Manual memory management (C/C++) is fast but error-prone &mdash; use-after-free, double-free, and leaks are
          endemic. Reference counting (early Python, Objective-C) is deterministic but can&apos;t collect cycles.
          Tracing GC (Lisp, Java, JS) solves both: it finds garbage by reachability, not by counting, so cycles
          don&apos;t trap memory. The cost: unpredictable pauses and slight overhead. V8 (Chrome/Node) evolved from
          basic mark-sweep to a sophisticated <strong>Orinoco</strong> concurrent/incremental generational collector
          that minimizes stop-the-world time. The trade-off the language made: automatic, safe, occasionally pausey.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Manual (C/C++)</th>
                <th>Reference counting</th>
                <th>Tracing GC (JS/Java)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Who frees?</td>
                <td>You (<code>free</code>)</td>
                <td>Runtime (on ref &rarr; 0)</td>
                <td>GC (on reachability)</td>
              </tr>
              <tr>
                <td>Cycles handled?</td>
                <td>N/A (manual)</td>
                <td>No (leaks cycles)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Pauses</td>
                <td>None</td>
                <td>None (deterministic)</td>
                <td>Periodic (mitigated)</td>
              </tr>
              <tr>
                <td>Safety</td>
                <td>Low (UAF, leaks)</td>
                <td>Medium</td>
                <td>High (no UAF)</td>
              </tr>
              <tr>
                <td>Developer burden</td>
                <td>High</td>
                <td>Medium</td>
                <td>Low (just avoid leaks)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A Mark-and-Sweep Cycle</h2>

        <CodeBlock
          code={`let a = { name: "A" };
let b = { name: "B" };
a.ref = b;        // A references B
b.ref = a;        // B references A (a cycle!)
a = null;         // drop our reference to A
// Are A and B garbage?`}
          filename="cycle.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Roots:</strong> <code>b</code> is still a global, pointing to <code>{'{ name: "B" }'}</code>.{' '}
              <code> a</code> was set to <code>null</code>, so it no longer roots <code>{'{ name: "A" }'}</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>Mark phase:</strong> start from roots. From <code>b</code>, mark B. Follow B&apos;s{' '}
              <code>ref</code> &rarr; reaches A &rarr; mark A. Follow A&apos;s <code>ref</code> &rarr; back to B
              (already marked). Both A and B are reachable through <code>b</code> &rarr; both stay alive.
            </span>
          </li>
          <li>
            <span>
              Now drop the second reference: <code>b = null</code>. Neither <code>a</code> nor <code>b</code> roots
              anything. Re-mark from roots: no path to A or B. Both are unmarked.
            </span>
          </li>
          <li>
            <span>
              <strong>Sweep phase:</strong> A and B are unmarked &mdash; despite referencing each other (a cycle) &mdash;
              because no <em>root</em> reaches the cycle. Both are freed. Mark-and-sweep handles cycles correctly;
              reference counting would have leaked them.
            </span>
          </li>
        </ol>

        <p className="article-para">
          The lesson: an object survives only if a <em>root</em> can reach it. Self-references and mutual references
          between dead objects don&apos;t keep them alive &mdash; the cycle dies with the last root link cut.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Dropping the last reference frees the object</h3>
        <CodeBlock
          code={`function make() {
  const big = new Array(1e6).fill(0); // large allocation
  return () => big.length;            // closure holds \`big\` alive
}
let getLen = make();
getLen(); // works
getLen = null; // now nothing references big → GC eligible
// Until this reassignment, \`big\` stayed alive via the closure —
// a common accidental retention (Week 5 Day 1 / Day 4).`}
          filename="closure-retain.js"
        />

        <h3 className="article-h3">2. A cycle that dies correctly</h3>
        <CodeBlock
          code={`let x = { next: null };
let y = { next: null };
x.next = y; y.next = x; // mutual cycle
x = y = null;           // cut both roots
// Both unreachable → both collected. Cycles don't defeat mark-sweep.`}
          filename="cycle-dies.js"
        />

        <h3 className="article-h3">3. The detached-DOM leak (preview of Day 4)</h3>
        <CodeBlock
          code={`let detached;
function create() {
  const btn = document.createElement("button");
  btn.textContent = "click";
  detached = btn;       // reference kept AFTER removing from DOM
  document.body.appendChild(btn);
  document.body.removeChild(btn); // removed from page, but \`detached\` holds it
  // btn + its listeners + children stay alive → leak until \`detached = null\`
}`}
          filename="detached-dom.js"
        />

        <h3 className="article-h3">4. WeakMap lets metadata die with the key (Week 5)</h3>
        <CodeBlock
          code={`const meta = new WeakMap();
function track(node, data) { meta.set(node, data); }
let node = document.querySelector("#x");
track(node, { huge: new Array(1e6) });
node = null; // when node is collected elsewhere, the entry dies with it.
// Contrast: a Map would keep both node and data alive forever.`}
          filename="weakmap-gc.js"
        />

        <h3 className="article-h3">5. Reducing allocation pressure</h3>
        <CodeBlock
          code={`// HOT PATH — allocates per call (more minor GCs):
function sum(nums) { return nums.map((n) => n * 2).filter((n) => n > 0).reduce((a, b) => a + b, 0); }
// Each .map/.filter/.reduce creates a new array → garbage.

// Less allocation — one pass, no intermediates:
function sumLean(nums) {
  let total = 0;
  for (const n of nums) { const d = n * 2; if (d > 0) total += d; }
  return total;
}
// For tight loops over big data, the lean version creates less garbage
// → fewer GC pauses → smoother performance. Not premature optimization
// in animation/game loops.`}
          filename="allocation.js"
        />

        <div className="article-callout">
          <p>
            You can&apos;t force GC reliably (<code>gc()</code> exists only with flags in Node/V8). Don&apos;t try. The
            GC knows when to run. Your job is to <em>not keep things reachable by accident</em> &mdash; which is the
            entire subject of Day 4.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            In Node, run snippets with <code>--expose-gc</code> and call <code>global.gc()</code> + inspect{' '}
            <code>process.memoryUsage().heapUsed</code> before/after to observe reclamation. Construct a closure-held
            large array, measure it retained, then null the reference and confirm the heap drops after a forced GC.
          </p>
        </div>

        <CodeBlock
          code={`// Run with: node --expose-gc gc-demo.js
function mb() { return (process.memoryUsage().heapUsed / 1e6).toFixed(1) + "MB"; }
global.gc(); console.log("baseline:", mb());

let holder;
function allocate() {
  const big = new Array(5_000_000).fill(0); // ~40MB
  holder = () => big.length;                // closure retains \`big\`
}
allocate();
global.gc(); console.log("after allocate:", mb()); // ~+40MB — \`big\` retained

holder = null; // cut the only reference
global.gc(); console.log("after null + gc:", mb()); // back near baseline

// Conclusion: \`big\` was kept alive solely by the closure. Cutting the
// reference made it unreachable → the GC reclaimed it. That's the whole game.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            If <code>allocate</code> had returned <code>big</code> directly (not a closure) and you didn&apos;t store
            it, would it leak? (No &mdash; with no reference kept, it&apos;s unreachable the instant{' '}
            <code>allocate</code> returns, so the next GC frees it. Leaks require a <em>retained</em> reference: a
            variable, a closure, a collection, a listener. The closure is the sneaky one because it captures invisibly.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. How does JavaScript&apos;s garbage collector decide what to free?</h4>
            <p className="iq-a">
              By <strong>reachability</strong>. The GC starts from roots (globals, the call stack, attached DOM nodes)
              and marks every object reachable via reference chains. Anything unmarked is unreachable garbage and is
              swept. You don&apos;t free memory &mdash; you let references go, and the GC reclaims what nothing
              reaches.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is mark-and-sweep?</h4>
            <p className="iq-a">
              A two-phase tracing algorithm: <em>mark</em> traverses from roots, following references, marking every
              reached object as alive; <em>sweep</em> walks the heap freeing unmarked objects. It correctly collects
              cycles (a self-referential cluster with no root path is swept), which reference counting cannot.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Can a cycle cause a memory leak in JS?</h4>
            <p className="iq-a">
              Not by itself &mdash; mark-and-sweep handles cycles. A cluster of objects referencing each other is
              collected if no root reaches the cluster. A leak requires a <em>root</em> (a retained variable, closure,
              collection, or listener) keeping the cycle reachable. The cycle isn&apos;t the problem; the forgotten
              root reference is.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is the generational hypothesis and why does V8 use it?</h4>
            <p className="iq-a">
              The empirical observation that most objects die young (temp variables, intermediates). V8 splits the heap
              into a small young generation (collected often and cheaply via minor GC) and a large old generation
              (collected rarely and expensively via major GC). Objects that survive a few minor GCs are promoted to
              old. This makes most allocations nearly free and concentrates expensive work on long-lived objects.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Why can a closure cause memory retention?</h4>
            <p className="iq-a">
              A closure captures a reference to its lexical environment (Week 2 Day 1), which holds all the variables
              in scope when it was created. As long as the closure is reachable, that environment &mdash; and every
              large object in it &mdash; stays alive, even if the closure only uses one small variable. The retained
              scope is the leak. Fix by narrowing the capture or nulling the closure when done. WeakMap (Week 5 Day 5)
              avoids this for metadata.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Can you force garbage collection?</h4>
            <p className="iq-a">
              Not in production. <code>global.gc()</code> exists only when Node/V8 is run with <code>--expose-gc</code>{' '}
              (debugging only); browsers expose no API. The GC runs on its own schedule driven by allocation pressure.
              Trying to force it is an anti-pattern &mdash; the right approach is to manage reachability (drop
              references, use WeakMap) and let the GC decide when to reclaim.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How does V8&apos;s GC minimize pause times, and what can you do to help?</h4>
            <p className="iq-a">
              V8&apos;s Orinoco collector reduces stop-the-world pauses via three techniques: (1){' '}
              <strong>generational</strong> collection &mdash; frequent cheap minor GCs on the small young gen handle
              most garbage without touching the large old gen; (2) <strong>incremental</strong> marking &mdash; breaks
              the mark phase into small steps interleaved with your code; (3) <strong>concurrent</strong> collection
              &mdash; does parts of the work on background threads. What you can do: reduce allocation pressure in hot
              paths (reuse arrays/objects, single-pass algorithms over chained <code>.map/.filter</code>), avoid
              long-lived bloated objects that promote to old gen, and prevent leaks (Day 4) so major GCs have less to
              scan. Fewer allocations &rarr; fewer/minor GCs &rarr; less jank. In animation/game loops this is the
              difference between smooth and stuttery.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
