import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('advanced-patterns')!
const navItems = weekNav(week)

export default function AdvancedDay5() {
  const { prev, next } = dayNavLinks(week, 5)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[4].title}</h1>
        <p className="lesson-subtitle">
          Collections that hold data <em>without</em> keeping it alive. The cure for the most common memory leak in
          caches and metadata maps.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>WeakMap</strong> and <strong>WeakSet</strong> are keyed only by objects, and they hold those keys{' '}
            <em>weakly</em>: when nothing else references a key, the GC may reclaim it and its entry vanishes.
            <strong> WeakRef</strong> and <strong>FinalizationRegistry</strong> (ES2021) extend this to arbitrary
            references and cleanup hooks.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Keys must be objects (or non-registered symbols). The collection doesn&apos;t prevent its keys from being
            collected, so it can&apos;t be iterated or sized &mdash; that would expose GC timing. Entries appear and
            disappear as the GC runs.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Attaching metadata to objects you don&apos;t own (DOM nodes, library objects), per-instance private state
            (private fields use WeakMap internally), caches keyed by object identity.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          The classic leak: you keep a <code>Map</code> of object &rarr; data to attach extra info to objects you
          don&apos;t control. When those objects are no longer used elsewhere, your <code>Map</code> still holds them
          &mdash; they can never be collected. The fix is a collection that <em>doesn&apos;t count</em> as a reference:
          a weak one.
        </p>

        <CodeBlock
          code={`// LEAK: a Map keeps every visited node alive forever
const visits = new Map();
function recordVisit(node) { visits.set(node, (visits.get(node) ?? 0) + 1); }
// Even after node is removed from the DOM, visits holds it → leak.

// FIX: WeakMap holds the key weakly — when node is gone elsewhere,
// the entry is eligible for collection.
const visits = new WeakMap();
function recordVisit(node) { visits.set(node, (visits.get(node) ?? 0) + 1); }`}
          filename="leak-vs-weak.js"
        />

        <p className="article-para">
          A <code>WeakMap</code> looks like a <code>Map</code> but its keys are held weakly. When the only reference to
          a key is inside the <code>WeakMap</code>, the GC is free to collect both the key and its entry. You attach
          data without owning the objects &mdash; no leak.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Weak reference</dt>
            <dd className="def-text">
              A reference that does <em>not</em> prevent the garbage collector from reclaiming its target. Strong refs
              keep objects alive; weak refs don&apos;t.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">WeakMap / WeakSet</dt>
            <dd className="def-text">
              Collections keyed weakly by object. Entries for unreachable keys are removed by the GC. Not iterable, no
              <code> size</code> &mdash; iteration would leak GC timing.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">WeakRef / FinalizationRegistry</dt>
            <dd className="def-text">
              <code>WeakRef</code> wraps a weak reference to an object; <code>.deref()</code> returns it or{' '}
              <code>undefined</code> if collected. <code>FinalizationRegistry</code> runs a callback when a registered
              object is collected &mdash; for cleanup of external resources.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Sticky Note Analogy</h2>
        <p className="article-para">
          A <code>Map</code> is a <strong>safe</strong> with the object locked inside &mdash; the object can&apos;t
          leave (be collected) while you hold the key. A <code>WeakMap</code> is a <strong>sticky note</strong> attached
          <em> to</em> the object: the note travels with it, but it doesn&apos;t pin the object down. When the object
          is thrown away (no other references), the note goes with it &mdash; you don&apos;t keep a copy.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🗄️</span>
            <span className="analogy-label">A safe (Map)</span>
            <span className="analogy-target">Strong reference &mdash; keeps alive</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏷️</span>
            <span className="analogy-label">A sticky note (WeakMap)</span>
            <span className="analogy-target">Weak reference &mdash; doesn&apos;t keep alive</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🚫</span>
            <span className="analogy-label">Can&apos;t list the notes</span>
            <span className="analogy-target">No iteration / no <code>size</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">👻</span>
            <span className="analogy-label">Notes vanish silently</span>
            <span className="analogy-target">GC removes dead entries</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The reason weak collections aren&apos;t iterable: iteration would have to expose <em>which</em> entries
            currently exist, which depends on <em>when</em> the GC last ran. That timing is non-deterministic, so
            exposing it would make programs un-debuggable. Weak collections are deliberately opaque to enumeration &mdash;
            you can only ask &ldquo;do you have <em>this</em> key?&rdquo;.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Why Weak Collections Behave This Way</h2>
        <p className="article-para">
          The constraints follow from one design goal: let you associate data with objects <em>without</em> affecting
          their lifetime. Every quirk &mdash; no iteration, no size, object-only keys &mdash; falls out of that.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Keys must be objects (or non-registered symbols)</h4>
            <p className="theory-desc">
              Primitives are passed by value and have no identity to track; only objects have a stable identity the GC
              can key on. (Registered symbols are excluded; they act like primitives for collection purposes.)
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Holding a key weakly means GC can reclaim it</h4>
            <p className="theory-desc">
              If the only reference to a key is inside the weak collection, the object is unreachable and the GC may
              free it &mdash; the entry disappears. The collection never keeps an object alive on its own.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. No iteration, no <code>size</code>, no clearing by listing</h4>
            <p className="theory-desc">
              Enumeration would expose GC timing. So <code>WeakMap</code>/<code>WeakSet</code> support only{' '}
              <code>get/set/has/delete</code> (WeakMap) or <code>add/has/delete</code> (WeakSet).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Values are held strongly (in WeakMap)</h4>
            <p className="theory-desc">
              Only the <em>key</em> is weak. If a value references its key, that can still leak (self-reference). To
              hold values weakly too, wrap them in <code>WeakRef</code>.
            </p>
          </div>
        </div>

        <h3 className="article-h3">When the entry actually disappears</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Strong Map</span>
            <p className="phase-desc">Keeps both key and value alive as long as the Map exists.</p>
            <ul className="phase-rules">
              <li>Iterable, has <code>size</code></li>
              <li>Common source of leaks</li>
              <li>Keys can be primitives</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">WeakMap</span>
            <p className="phase-desc">Keeps neither alive; entry dies when key is unreachable elsewhere.</p>
            <ul className="phase-rules">
              <li>Not iterable, no <code>size</code></li>
              <li>No leak from metadata maps</li>
              <li>Keys must be objects</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            <code>WeakRef</code> and <code>FinalizationRegistry</code> (ES2021) are sharper tools &mdash; use them
            sparingly. A <code>WeakRef</code> lets you check &ldquo;is this object still around?&rdquo;; a{' '}
            <code>FinalizationRegistry</code> runs cleanup when an object is collected. They&apos;re for caching and
            external-resource cleanup, but their callbacks are non-deterministic (GC-timed) and should never be load-
            bearing for correctness.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why They Exist</h2>
        <p className="article-para">
          <code>WeakMap</code> shipped in ES6 (2015); <code>WeakSet</code> too. Their original motivation was exactly
          the metadata-map leak &mdash; and they enabled true private state before <code>#</code> fields existed (a
          closure holding a <code>WeakMap</code> of instance &rarr; private data). ES2021 added{' '}
          <code>WeakRef</code>/<code>FinalizationRegistry</code> and, later, <code>WeakMap</code>/<code>WeakSet</code>{' '}
          keys could be symbols. Today, private class fields (<code>#x</code>) are implemented internally with a WeakMap
          per field &mdash; the same machinery you can use directly.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Map / Set</th>
                <th>WeakMap / WeakSet</th>
                <th>WeakRef + FinalizationRegistry</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Key/value lifetime</td>
                <td>Strong (kept alive)</td>
                <td>Key weak; value strong</td>
                <td>Single weak ref + cleanup hook</td>
              </tr>
              <tr>
                <td>Iterable / size</td>
                <td>Yes</td>
                <td>No</td>
                <td>No (one ref)</td>
              </tr>
              <tr>
                <td>Key types</td>
                <td>Any (incl. primitives)</td>
                <td>Objects / symbols only</td>
                <td>Objects only</td>
              </tr>
              <tr>
                <td>Primary use</td>
                <td>General lookup</td>
                <td>Metadata, private state</td>
                <td>Caches, external cleanup</td>
              </tr>
              <tr>
                <td>Deterministic?</td>
                <td>Yes</td>
                <td>GC-timed removal</td>
                <td>GC-timed callbacks (avoid for correctness)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A WeakMap Cache that Doesn&apos;t Leak</h2>

        <CodeBlock
          code={`const cache = new WeakMap();
function expensiveCompute(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = doRealWork(obj);   // pretend this is slow
  cache.set(obj, result);
  return result;
}

let node = document.querySelector("#x");
expensiveCompute(node); // computed + cached
expensiveCompute(node); // cache hit

node = null;             // drop our reference
// node is now unreachable except in the WeakMap → GC may collect it
// → the WeakMap entry vanishes automatically. No leak, no manual cleanup.`}
          filename="cache.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              First <code>expensiveCompute(node)</code>: <code>cache.has(node)</code> is false, so we compute,{' '}
              <code>cache.set(node, result)</code>, return it. The entry is now associated with that object.
            </span>
          </li>
          <li>
            <span>
              Second call with the same <code>node</code>: <code>cache.has</code> is true &rarr; returns the cached
              value. Fast path.
            </span>
          </li>
          <li>
            <span>
              <code>node = null</code> drops our strong reference. Now the only reference to the original DOM node is
              the WeakMap&apos;s weak key &mdash; which doesn&apos;t count. The object is unreachable.
            </span>
          </li>
          <li>
            <span>
              At some later GC pass, the node is collected. The WeakMap notices its key is gone and removes the entry.
              No explicit cleanup, no leak.
            </span>
          </li>
          <li>
            <span>
              Crucially, you can&apos;t ask &ldquo;what&apos;s in the cache?&rdquo; &mdash; only &ldquo;do you have{' '}
              <em>this</em> object?&rdquo;. That keeps the cache from pinning objects or exposing GC timing.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Attaching metadata to DOM nodes</h3>
        <CodeBlock
          code={`const handlers = new WeakMap();
button.addEventListener("click", (e) => {
  const data = handlers.get(e.currentTarget) ?? {};
  data.clicks = (data.clicks ?? 0) + 1;
  handlers.set(e.currentTarget, data);
});
// When the button is removed from the DOM and dereferenced elsewhere,
// its entry in \`handlers\` is collected automatically — no cleanup needed.`}
          filename="dom-metadata.js"
        />

        <h3 className="article-h3">2. Private fields via WeakMap (pre-<code>#</code> pattern)</h3>
        <CodeBlock
          code={`const privates = new WeakMap();
function Counter() {
  privates.set(this, { count: 0 }); // private data keyed by instance
}
Counter.prototype.inc = function () { privates.get(this).count++; };
Counter.prototype.get = function () { return privates.get(this).count; };

const c = new Counter();
c.inc(); c.get(); // 1
// privates.get(c).count is inaccessible without the \`privates\` WeakMap
// reference, which is module-private. This is how private state worked
// before #fields — and how #fields are implemented under the hood.`}
          filename="private-weakmap.js"
        />

        <h3 className="article-h3">3. WeakSet for marking objects</h3>
        <CodeBlock
          code={`const processed = new WeakSet();
function handle(obj) {
  if (processed.has(obj)) return; // skip already-seen
  doWork(obj);
  processed.add(obj);
}
// Track "have I processed this object?" without preventing its collection.`}
          filename="weakset-mark.js"
        />

        <h3 className="article-h3">4. WeakRef for a cache that can drop entries</h3>
        <CodeBlock
          code={`const cache = new Map(); // key -> WeakRef<value>
function get(key) {
  const ref = cache.get(key);
  if (ref) {
    const v = ref.deref();
    if (v) return v;      // still alive
    cache.delete(key);    // collected — clean stale entry
  }
  const fresh = compute(key);
  cache.set(key, new WeakRef(fresh));
  return fresh;
}
// Values can be collected under memory pressure; \`deref()\` returns undefined.`}
          filename="weakref-cache.js"
        />

        <h3 className="article-h3">5. FinalizationRegistry for external cleanup</h3>
        <CodeBlock
          code={`const registry = new FinalizationRegistry((held) => {
  // Called (eventually, once) when an object is collected.
  releaseExternalResource(held);
});

function track(obj, handle) {
  registry.register(obj, handle); // when obj dies, release \`handle\`
  return obj;
}
// CAUTION: the callback is GC-timed and may run much later, or be skipped
// if the program exits. Never depend on it for correctness — only best-effort cleanup.`}
          filename="finalization.js"
        />

        <h3 className="article-h3">6. The value-leak trap</h3>
        <CodeBlock
          code={`const m = new WeakMap();
function bad() {
  const obj = {};
  m.set(obj, { parent: obj }); // value references the key!
  return m;
}
// obj is reachable from the WeakMap value, which is held strongly.
// Because the value points back to the key, the key is NOT unreachable
// from the WeakMap → it leaks. Avoid self/mutual references between
// a WeakMap value and its key.`}
          filename="value-leak.js"
        />

        <div className="article-callout">
          <p>
            The golden rule: use <code>WeakMap</code>/<code>WeakSet</code> when you want to associate data with
            objects <em>without extending their lifetime</em>. If you need to enumerate the entries, or your keys are
            primitives, use a plain <code>Map</code>/<code>Set</code> and manage cleanup explicitly. Weak collections
            trade enumeration for leak-safety.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Build a <code>memoize(fn)</code> keyed by the <em>object</em> argument using a <code>WeakMap</code> (so the
            cache doesn&apos;t keep arguments alive), and a <code>oncePerObject(obj, fn)</code> helper using{' '}
            <code>WeakSet</code> that runs <code>fn</code> only the first time it sees a given object.
          </p>
        </div>

        <CodeBlock
          code={`// 1. Memoize keyed by object (single-arg, object-typed)
function memoizeWeak(fn) {
  const cache = new WeakMap();
  return function (obj) {
    if (cache.has(obj)) return cache.get(obj);
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}
const inspect = memoizeWeak((node) => expensiveParse(node));
inspect(node); // computes
inspect(node); // cached
// When node is collected elsewhere, its cache entry goes with it.

// 2. oncePerObject using WeakSet
function oncePerObject(fn) {
  const seen = new WeakSet();
  return function (obj) {
    if (seen.has(obj)) return;
    seen.add(obj);
    return fn(obj);
  };
}
const init = oncePerObject((node) => node.setup());
init(node); // runs setup
init(node); // skipped — already initialized`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why can&apos;t <code>memoizeWeak</code> memoize a function called with primitive arguments? (Because{' '}
            <code>WeakMap</code> keys must be objects &mdash; primitives have no identity to track weakly. For primitive
            args, use a plain <code>Map</code> and accept the need for manual cleanup, or key by a serialized string.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a WeakMap, and how does it differ from a Map?</h4>
            <p className="iq-a">
              A WeakMap is keyed by objects held <em>weakly</em> &mdash; when a key is unreachable elsewhere, its entry
              becomes eligible for GC. A Map holds keys strongly (keeps them alive) and is iterable with a{' '}
              <code>size</code>. WeakMap keys must be objects; it isn&apos;t iterable and has no <code>size</code>,
              because enumerating entries would expose non-deterministic GC timing.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Why can&apos;t you iterate a WeakMap or get its size?</h4>
            <p className="iq-a">
              Because which entries exist depends on <em>when</em> the GC last collected unreachable keys &mdash;
              non-deterministic timing. Exposing that would make programs behave differently run to run and break
              debugging. So weak collections support only point lookups (<code>has/get/set/delete</code>), never
              enumeration.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. When would you use a WeakMap?</h4>
            <p className="iq-a">
              Whenever you want to associate data with objects you don&apos;t own (DOM nodes, library instances)
              without keeping them alive &mdash; metadata maps, per-instance caches, and private state (this is how{' '}
              <code>#</code> private fields are implemented under the hood). It prevents the classic leak where a cache
              pins objects forever.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is a weak reference?</h4>
            <p className="iq-a">
              A reference that doesn&apos;t prevent the GC from reclaiming its target. Strong references keep an object
              alive (reachability); weak ones don&apos;t count toward reachability. <code>WeakMap</code>/{' '}
              <code>WeakSet</code> keys and <code>WeakRef</code> targets are weak &mdash; so the underlying object can
              be collected if nothing else references it strongly.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What is <code>WeakRef</code> and when would you use it?</h4>
            <p className="iq-a">
              <code>WeakRef</code> wraps a weak reference to an object; <code>.deref()</code> returns the object or{' '}
              <code>undefined</code> if it&apos;s been collected. Use it for caches that may drop entries under memory
              pressure: store <code>WeakRef</code>s as values so the cached object can be reclaimed, then recompute on
              a <code>deref()</code> miss. Avoid it for logic that depends on collection happening &mdash; timing is
              non-deterministic.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How do private fields (<code>#</code>) relate to WeakMap?</h4>
            <p className="iq-a">
              Private fields are implemented internally using WeakMap-like storage keyed by instance: each{' '}
              <code>#field</code> is effectively a per-class WeakMap of instance &rarr; value. That&apos;s why
              <code> #</code> fields give true privacy (inaccessible outside the class) and don&apos;t leak (they
              don&apos;t keep instances alive). Before <code>#</code> existed, developers emulated the same thing with a
              module-private WeakMap &mdash; the same pattern the engine now uses natively.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Can a WeakMap still leak memory? Give an example.</h4>
            <p className="iq-a">
              Yes. Only the <em>key</em> is held weakly; the <em>value</em> is held strongly. If a value references its
              key (directly or transitively), the key remains reachable <em>through the value</em>, so the entry never
              becomes collectible &mdash; a leak. Example: <code>{'m.set(obj, { parent: obj })'}</code> &mdash; the
              value&apos;s <code>parent</code> points back to the key, so <code>obj</code> is reachable from the
              WeakMap and can&apos;t be collected. Avoid mutual references between a WeakMap value and its key; if you
              need the value weak too, wrap it in a <code>WeakRef</code>. Also remember collection is GC-timed, not
              immediate, so memory isn&apos;t freed the instant a reference drops.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
