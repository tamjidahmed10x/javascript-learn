import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('js-engine-internals')!
const navItems = weekNav(week)

export default function EngineDay3() {
  const { prev, next } = dayNavLinks(week, 3)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[2].title}</h1>
        <p className="lesson-subtitle">
          V8 gives every object a hidden &ldquo;shape.&rdquo; Keep shapes stable and property access becomes a direct
          memory read; churn them and it becomes a hash lookup.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>hidden class</strong> (or &ldquo;map&rdquo;/&ldquo;shape&rdquo;) is an internal descriptor V8
            attaches to each object, recording its property layout (which properties, in what order, at what offsets).
            Objects with the same shape share one hidden class.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Adding properties in a consistent order builds a <strong>transition tree</strong> of hidden classes.
            <strong> Inline caching</strong> memoizes the offset for a property access per call site, so repeated
            same-shape accesses skip lookup entirely &mdash; a direct memory read.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always, internally. You control it by <strong>constructing objects consistently</strong> (same properties,
            same order, in constructors) &mdash; which keeps shapes stable and unlocks fast property access and good
            optimization.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          JavaScript objects are dynamic &mdash; you can add and remove properties at any time. That flexibility is a
          problem for performance: if every object can have any shape, how does the engine find <code>obj.x</code>{' '}
          quickly? V8&apos;s answer is the <strong>hidden class</strong> &mdash; an internal tag that records an
          object&apos;s exact property layout, so property access becomes a predictable memory offset instead of a hash
          lookup.
        </p>

        <CodeBlock
          code={`// Two objects with the same shape share a hidden class:
const a = { x: 1, y: 2 };
const b = { x: 3, y: 4 };
// V8: both have hidden class HC0 = { x@0, y@1 }. Reading \`b.y\` = offset 1.

// Adding a property in a different order creates a DIFFERENT hidden class:
const c = { y: 5, x: 6 }; // different transition order → different HC
// Now \`c.x\` and \`a.x\` don't share a shape → less optimization.`}
          filename="intro.js"
        />

        <p className="article-para">
          Same properties, different order &rarr; different hidden class. Same order &rarr; shared. The rule that makes
          V8 fast: <strong>objects constructed the same way share a shape, and shape-stable access is fast</strong>.
          This is why constructor functions and classes (Week 3) aren&apos;t just syntactic &mdash; they encourage
          uniform construction, which is exactly what hidden classes reward.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Hidden class (map / shape)</dt>
            <dd className="def-text">
              An internal descriptor attached to every object, recording its property layout: property names, their
              order, and the memory offset of each. The key to fast property access in V8.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Transition</dt>
            <dd className="def-text">
              Adding a property to an object moves it to a new hidden class (one with that property appended). V8 builds
              a <strong>transition tree</strong> linking related shapes so similar objects share structure.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Inline cache (IC)</dt>
            <dd className="def-text">
              A per-call-site memo of the last-seen hidden class and property offset for an access. Repeated same-shape
              accesses hit the cache &mdash; a direct offset read, skipping the lookup.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Dictionary mode</dt>
            <dd className="def-text">
              A fallback storage for objects whose shape is too complex/chaotic (many deletions, dynamic keys).
              Property access becomes a hash-table lookup &mdash; much slower than hidden-class offset access.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Seating Chart Analogy</h2>
        <p className="article-para">
          Picture a restaurant. Each table (object) has a <strong>seating chart</strong> (hidden class) listing who
          sits where: &ldquo;Alice at seat 1, Bob at seat 2.&rdquo; To find Bob you check the chart and go straight to
          seat 2 &mdash; an <strong>offset lookup</strong>. If every table used the same chart, the waiter memorizes
          one layout (inline cache) and serves instantly. But if tables keep rearranging (&ldquo;actually Bob&apos;s at
          seat 4 now, and there&apos;s a Carol&rdquo;), the chart changes constantly and the waiter must re-check every
          time &mdash; slow.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🪑</span>
            <span className="analogy-label">The seating chart</span>
            <span className="analogy-target">The hidden class</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📍</span>
            <span className="analogy-label">&ldquo;Bob &rarr; seat 2&rdquo;</span>
            <span className="analogy-target">Property offset</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧠</span>
            <span className="analogy-label">Memorized layout</span>
            <span className="analogy-target">Inline cache (IC)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔢</span>
            <span className="analogy-label">Reservations desk lookup</span>
            <span className="analogy-target">Dictionary mode (slow)</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The performance punchline: a property read in <strong>hidden-class mode</strong> is a single memory load at
            a known offset &mdash; as fast as a C struct field. In <strong>dictionary mode</strong> it&apos;s a hash
            lookup (compute hash, probe, compare) &mdash; several times slower. Your code&apos;s shape stability decides
            which one runs.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Transitions and Inline Caches</h2>
        <p className="article-para">
          Two mechanisms make property access fast: <strong>transition trees</strong> (sharing shape structure) and{' '}
          <strong>inline caches</strong> (memoizing offsets per call site). Both reward consistency.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Construction order defines the shape</h4>
            <p className="theory-desc">
              An object&apos;s hidden class is determined by the order properties were added. <code>{'{x,y}'}</code> and{' '}
              <code>{'{y,x}'}</code> have <em>different</em> hidden classes because the transition path differs.
              Construct objects the same way to share shapes.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Transitions build a tree</h4>
            <p className="theory-desc">
              Adding a property transitions to a new hidden class that extends the previous. V8 links these into a tree
              so objects with a common prefix share the early classes &mdash; saving memory and enabling fast checks.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Inline caches memoize per call site</h4>
            <p className="theory-desc">
              The first <code>obj.x</code> at a call site looks up <code>x</code>&apos;s offset and caches &ldquo;for
              hidden class HC0, x is at offset 0.&rdquo; Next time, if the object&apos;s HC is still HC0, skip the
              lookup &mdash; direct load. This is the single biggest property-access speedup.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Shape churn defeats the cache</h4>
            <p className="theory-desc">
              If a call site sees many shapes (polymorphic/megamorphic), the IC must hold multiple entries and dispatch
              &mdash; slower. Extreme churn (<code>delete</code>, dynamic keys) can force <strong>dictionary mode</strong>,
              disabling ICs entirely.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The transition tree, visualized</h3>
        <CodeBlock
          code={`// V8 builds hidden classes as properties are added:
const p1 = {};                 // HC: {} (empty)
p1.x = 1;                      // HC: {x@0}    (transition from {})
p1.y = 2;                      // HC: {x@0, y@1} (transition from {x@0})

const p2 = {};
p2.x = 5;                      // reuses HC {x@0} — same transition path!
p2.y = 6;                      // reuses HC {x@0, y@1} — p1 and p2 SHARE it.

const p3 = {};
p3.y = 9;                      // HC: {y@0} — DIFFERENT path (y first). p3 has its own HC.
// p1/p2 share; p3 diverges. Reading p3.x vs p1.x hits different ICs.`}
          filename="transitions.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Fast path (hidden-class mode)</span>
            <p className="phase-desc">Property access = direct offset load.</p>
            <ul className="phase-rules">
              <li>Stable, consistent construction</li>
              <li>Monomorphic inline caches</li>
              <li>~C-struct speed</li>
              <li>What classes/constructors encourage</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Slow path (dictionary mode)</span>
            <p className="phase-desc">Property access = hash-table lookup.</p>
            <ul className="phase-rules">
              <li><code>delete</code> on properties</li>
              <li>Many dynamic/string keys</li>
              <li>Huge/changing shape</li>
              <li>No inline caching benefit</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            This is the deep reason constructors and classes matter beyond syntax: they create objects with a{' '}
            <em>uniform shape</em>. Every <code>new Point(x,y)</code> builds <code>{'{x,y}'}</code> in the same order
            &rarr; all instances share one hidden class &rarr; property access across all of them hits a monomorphic IC.
            Ad-hoc object literals scattered around, built differently, fragment into many shapes and lose the
            optimization.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Hidden Classes Exist</h2>
        <p className="article-para">
          Self (1987, Smalltalk lineage) pioneered hidden classes (&ldquo;maps&rdquo;) to make dynamic-object property
          access fast &mdash; the same idea V8 (2008) adopted and the broader JS-engine ecosystem copied (SpiderMonkey
          &ldquo;shapes,&rdquo; JavaScriptCore &ldquo;structures&rdquo;). The motivation: dynamic languages let you add
          properties anytime, which naively requires a hash table per object (slow). Hidden classes turn the common
          case &mdash; many objects with the same layout &mdash; into a shared descriptor with fixed offsets,
          recovering struct-like speed. Combined with inline caches (also from Self, ~1991), this made dynamic-object
          property access competitive with static-language field access for shape-stable code.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Hidden-class mode</th>
                <th>Dictionary mode</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Storage</td>
                <td>Fixed-offset slots</td>
                <td>Hash table of key&rarr;value</td>
              </tr>
              <tr>
                <td>Access cost</td>
                <td>One memory load (offset)</td>
                <td>Hash + probe + compare</td>
              </tr>
              <tr>
                <td>Inline caches?</td>
                <td>Yes (huge speedup)</td>
                <td>No / limited</td>
              </tr>
              <tr>
                <td>Triggered by</td>
                <td>Consistent construction</td>
                <td><code>delete</code>, many dynamic keys</td>
              </tr>
              <tr>
                <td>Typical for</td>
                <td>App/domain objects</td>
                <td>Caches, configs, ad-hoc maps</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A Property Read Through the IC</h2>

        <CodeBlock
          code={`function getX(p) { return p.x; }  // call site S
const a = new Point(1, 2);       // shape {x@0, y@1}
const b = new Point(3, 4);       // same shape
getX(a); getX(b); getX(a);       // repeated calls`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>First call <code>getX(a)</code>:</strong> the IC at site S is empty (uninitialized). V8 looks up{' '}
              <code>x</code> in <code>a</code>&apos;s hidden class &rarr; finds it at offset 0. The IC records:{' '}
              <em>&ldquo;HC <code>{'{x,y}'}</code> &rarr; x at offset 0.&rdquo;</em> Returns <code>a.x</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>Second call <code>getX(b)</code>:</strong> <code>b</code> has the same hidden class (constructed
              identically). The IC checks: same HC? Yes &rarr; load offset 0 directly. No lookup. Returns{' '}
              <code>b.x</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>Third call:</strong> same HC, cache hit, direct load. Every subsequent same-shape call is a
              single memory read &mdash; this is the fast path that makes shape-stable code fast.
            </span>
          </li>
          <li>
            <span>
              <strong>Surprise:</strong> if <code>getX</code> is later called with <code>{'{y,x}'}</code> (different
              HC), the IC sees a new class &rarr; becomes polymorphic (caches a second entry). More shapes &rarr;{' '}
              megamorphic &rarr; the IC degrades to a generic slow lookup.
            </span>
          </li>
          <li>
            <span>
              The IC is per-call-site, not per-object. So <code>getX</code> called only with <code>Point</code>s stays
              monomorphic even if other code reads <code>x</code> from other shapes elsewhere &mdash; each site caches
              independently.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Consistent construction &rarr; shared shape</h3>
        <CodeBlock
          code={`class Point { constructor(x, y) { this.x = x; this.y = y; } }
const a = new Point(1, 2), b = new Point(3, 4);
// Both built {x, y} in the same order → same hidden class → fast IC.`}
          filename="consistent.js"
        />

        <h3 className="article-h3">2. Different order &rarr; different shape</h3>
        <CodeBlock
          code={`const a = {}; a.x = 1; a.y = 2;   // shape: {x, y}
const b = {}; b.y = 1; b.x = 2;   // shape: {y, x} — DIFFERENT hidden class
// A function reading \`obj.x\` sees two shapes → polymorphic IC → slower.`}
          filename="order.js"
        />

        <h3 className="article-h3">3. <code>delete</code> forces dictionary mode</h3>
        <CodeBlock
          code={`const o = { a: 1, b: 2, c: 3 };
delete o.b;            // o leaves hidden-class mode → dictionary mode (slow)
// In hot code, "remove" by setting to undefined instead (keeps the shape):
o.b = undefined;       // shape preserved, property access stays fast`}
          filename="delete-mode.js"
        />

        <h3 className="article-h3">4. Dynamic keys &rarr; dictionary mode</h3>
        <CodeBlock
          code={`const cache = {};
for (const key of userGeneratedKeys) cache[key] = compute(key);
// Many unpredictable string keys → V8 gives up on a stable shape and
// uses dictionary mode. This is FINE for a cache (flexibility wins),
// but don't do it for hot domain objects.`}
          filename="dynamic-keys.js"
        />

        <h3 className="article-h3">5. Allocate all properties in the constructor</h3>
        <CodeBlock
          code={`// BAD — shape grows over time, churning hidden classes
function Lazy() { this.x = 1; }
const o = new Lazy();
o.y = 2; o.z = 3; // 3 transitions before stabilizing

// GOOD — declare all fields up front (stable shape immediately)
class Full { constructor() { this.x = 1; this.y = 0; this.z = 0; } }
const f = new Full(); // single stable shape from the start`}
          filename="allocate-upfront.js"
        />

        <h3 className="article-h3">6. Observing with <code>%HasFastProperties</code> (V8 internals)</h3>
        <CodeBlock
          code={`// In Node with --allow-natives-syntax:
const o = { a: 1, b: 2 };
console.log(%HasFastProperties(o)); // true — hidden-class mode
delete o.a;
console.log(%HasFastProperties(o)); // false — now dictionary mode
// A diagnostic, not production code — but shows the mode switch.`}
          filename="has-fast.js"
        />

        <div className="article-callout">
          <p>
            The discipline that helps hidden classes is the same that makes code readable: <strong>construct objects
            completely and consistently</strong>, prefer classes/constructors over scattered literals in hot paths,
            avoid <code>delete</code>, and reserve dictionary-style objects for genuinely dynamic data (caches, configs).
            Good structure and good performance align here.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Benchmark property reads on shape-stable vs shape-churning objects. Build 100k <code>Point</code>s with a
            constructor (stable shape) and 100k ad-hoc objects with properties added in random order (churned), then
            time a loop reading <code>.x</code> from each. Observe the difference; then trigger dictionary mode with{' '}
            <code>delete</code> and re-measure.
          </p>
        </div>

        <CodeBlock
          code={`class Point { constructor(x, y) { this.x = x; this.y = y; } }

// Stable shape
const stable = Array.from({ length: 1e5 }, (_, i) => new Point(i, i + 1));
// Churned shape (properties in different orders)
const churned = stable.map((p) => {
  const o = {};
  if (p.x % 2) { o.x = p.x; o.y = p.y; } else { o.y = p.y; o.x = p.x; }
  return o;
});

function readX(arr) { let s = 0; for (let i = 0; i < arr.length; i++) s += arr[i].x; return s; }
console.time("stable");  readX(stable);  console.timeEnd("stable");
console.time("churned"); readX(churned); console.timeEnd("churned"); // usually slower

// Dictionary mode:
delete stable[0].y;
console.time("after-delete"); readX(stable); console.timeEnd("after-delete"); // first object slow`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does the churned version cost more, even though it has the same properties? (Because the call site{' '}
            <code>arr[i].x</code> sees two hidden classes ({`{x,y}`} and {`{y,x}`}) alternating &mdash; a polymorphic IC
            that must check the shape and dispatch each time, instead of one cached offset. Same JS semantics, but V8
            can&apos;t memoize a single fast path.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a hidden class in V8?</h4>
            <p className="iq-a">
              An internal descriptor attached to each object recording its property layout &mdash; which properties it
              has, in what order, and at what memory offset. Objects with the same layout share one hidden class,
              enabling property access by direct offset instead of hash lookup. It&apos;s the mechanism that makes
              dynamic-object property access fast in V8.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. How are hidden classes created and shared?</h4>
            <p className="iq-a">
              They&apos;re determined by the order properties are added. Adding a property transitions an object to a
              new hidden class; V8 links these into a transition tree so objects with a common prefix share the early
              classes. Two objects built with the same properties in the same order share a hidden class; different
              order &rarr; different class.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is an inline cache, and why does it matter?</h4>
            <p className="iq-a">
              A per-call-site memo of the hidden class and offset last seen for a property access. The first access
              looks up the offset and caches it; subsequent accesses to same-shape objects skip the lookup and load
              directly from the cached offset. ICs are the single biggest property-access speedup &mdash; they turn
              repeated same-shape reads into a single memory load.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What forces an object into dictionary mode?</h4>
            <p className="iq-a">
              <code>delete</code> on a property, adding very many properties, or using unpredictable/dynamic string
              keys. V8 then switches the object to a hash-table storage where property access is a hash lookup instead
              of an offset load &mdash; several times slower, with no inline-cache benefit. It&apos;s appropriate for
              genuinely dynamic data (caches, configs) but costly for hot domain objects.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Why does <code>{'{x:1,y:2}'}</code> have a different hidden class than <code>{'{y:1,x:2}'}</code>?</h4>
            <p className="iq-a">
              Because hidden classes are built by transition as properties are added, and the transition order differs.
              <code> {'{x:1,y:2}'}</code> goes empty &rarr; {`{x}`} &rarr; {`{x,y}`}; <code>{'{y:1,x:2}'}</code> goes
              empty &rarr; {`{y}`} &rarr; {`{y,x}`}. Different paths produce different classes, even though the property
              <em> sets</em> are identical. Same set, different order &rarr; different shape &rarr; polymorphic ICs at
              shared call sites.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How should you construct objects to keep shapes stable?</h4>
            <p className="iq-a">
              Use a constructor or class that assigns all properties in the same order every time, declaring every field
              up front (even if initially <code>undefined</code>). Avoid adding properties ad hoc after construction,
              avoid <code>delete</code> (set to <code>undefined</code> instead), and don&apos;t use dynamic string keys
              for hot domain objects. Uniform construction &rarr; one shared hidden class &rarr; monomorphic inline
              caches &rarr; fast property access.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Explain monomorphic vs polymorphic vs megamorphic inline caches and their performance impact.</h4>
            <p className="iq-a">
              An inline cache at a call site records the shapes it has seen. <strong>Monomorphic</strong> (one shape):
              the cache holds a single entry and the access is a direct offset load &mdash; fastest, this is what
              TurboFan inlines and optimizes aggressively. <strong>Polymorphic</strong> (a few shapes, ~2&ndash;4): the
              cache holds multiple entries and each access checks the object&apos;s hidden class against them, then
              dispatches &mdash; slower but still cached. <strong>Megamorphic</strong> (many shapes): the cache
              overflows and falls back to a generic hash-based lookup, bypassing the IC &mdash; slowest. The
              performance gap between monomorphic and megamorphic can be 10&ndash;100&times; for hot property reads.
              This is why shape stability (constructing objects consistently) is the most impactful JIT-friendly habit:
              it keeps call sites monomorphic, where the engine emits the tightest code. Mixing shapes at a call site
              (e.g., passing both <code>Point</code> and <code>ColoredPoint</code> to one function) pushes it
              polymorphic and erodes the speedup.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
