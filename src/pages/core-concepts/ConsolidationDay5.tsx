import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('consolidation')!
const navItems = weekNav(week)

export default function ConsolidationDay5() {
  const { prev, next } = dayNavLinks(week, 5)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[4].title}</h1>
        <p className="lesson-subtitle">
          Three everyday utilities that test closures, <code>this</code>, and recursion. The workhorses of real
          codebases &mdash; built from first principles.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            Three classic implementations: <strong>EventEmitter</strong> (on/emit/off, pub/sub), <strong>debounce</strong>{' '}
            (run after calm), and <strong>deep clone</strong> (recursively copy any value). Each tests a different core
            skill.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            EventEmitter: a map of event&rarr;listener arrays. Debounce: clear/reset a timer on each call (Week 6 Day 5).
            Deep clone: recurse into objects/arrays, handle cycles with a <code>WeakMap</code> (Week 5 Day 5).
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            All three are real production utilities and frequent interview asks. Together they exercise closures,{' '}
            <code>this</code>-binding, recursion, and weak collections &mdash; a microcosm of the course.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Today we build three utilities you&apos;ll use &mdash; or have used &mdash; in real code. They&apos;re short,
          but each hides a subtlety that separates a working version from a correct one. EventEmitter needs clean{' '}
          <code>off</code> semantics; debounce needs cleanup; deep clone needs to handle cycles without infinite-looping.
        </p>

        <CodeBlock
          code={`// Three utilities:
const bus = new EventEmitter();
bus.on("click", (x) => console.log("clicked", x));
bus.emit("click", 42); // "clicked 42"

const save = debounce((text) => api.save(text), 300);
input.addEventListener("input", (e) => save(e.target.value)); // saves 300ms after typing stops

const copy = deepClone(complexNestedGraph); // independent copy, no shared refs, cycles handled`}
          filename="intro.js"
        />

        <p className="article-para">
          None is long. The skill is the edge cases: removing the right listener in a multi-listener event, resetting
          timers cleanly, and not blowing the stack or looping forever on a circular reference. Getting those right is
          the whole point.
        </p>
      </section>

      {/* ── EventEmitter ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">EventEmitter</h2>
        <p className="article-para">
          The pub/sub primitive: register listeners, fire them on emit, remove them on off. A map of event name to
          listener arrays is the whole data structure.
        </p>

        <CodeBlock
          code={`class EventEmitter {
  #events = new Map(); // event name → Set<listener>

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, new Set());
    this.#events.get(event).add(listener);
    return () => this.off(event, listener); // convenience disposer
  }
  off(event, listener) { this.#events.get(event)?.delete(listener); }
  once(event, listener) {
    const wrap = (...args) => { this.off(event, wrap); listener(...args); };
    return this.on(event, wrap);
  }
  emit(event, ...args) { this.#events.get(event)?.forEach((fn) => fn(...args)); }
}

const bus = new EventEmitter();
const off = bus.on("greet", (n) => console.log("hi", n));
bus.emit("greet", 1); // "hi 1"
off();                 // remove via the returned disposer
bus.emit("greet", 2); // nothing`}
          filename="event-emitter.js"
        />

        <p className="article-para">
          Notes: a <code>Set</code> makes <code>off</code> O(1) and prevents duplicate listeners. Returning a disposer
          from <code>on</code> is the modern idiom (cleaner than passing the same fn to <code>off</code>).{' '}
          <code>once</code> wraps the listener to self-remove. Edge case: emitting during an emit (a listener emits the
          same event) &mdash; a <code>Set</code> iterator can misbehave if modified mid-iteration, so a robust version
          copies the listener list before iterating.
        </p>
      </section>

      {/* ── Debounce ─────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Debounce</h2>
        <p className="article-para">
          Already covered in Week 6 Day 5, but worth re-implementing here as a capstone utility. Run a function only
          after activity stops for <code>wait</code> ms; each call resets the timer.
        </p>

        <CodeBlock
          code={`function debounce(fn, wait, { leading = false } = {}) {
  let timer = null;
  const debounced = function (...args) {
    const callNow = leading && timer === null;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; if (!leading) fn.apply(this, args); }, wait);
    if (callNow) fn.apply(this, args);
  };
  debounced.cancel = () => { clearTimeout(timer); timer = null; };
  debounced.flush = function (...args) { clearTimeout(timer); timer = null; fn.apply(this, args); };
  return debounced;
}

const search = debounce((q) => console.log("query:", q), 300);
search("a"); search("ab"); search("abc"); // burst
// ~300ms after the last: "query: abc"`}
          filename="debounce.js"
        />

        <p className="article-para">
          Key correctness points: <code>clearTimeout(timer)</code> on every call (reset), a <code>.cancel()</code> for
          cleanup (avoid leaks, Week 6 Day 4), and <code>fn.apply(this, args)</code> so the original <code>this</code>{' '}
          and arguments are preserved (important when used as a method). The <code>leading</code> option fires on the
          first call then locks &mdash; useful for &ldquo;do it now, ignore repeats.&rdquo;
        </p>
      </section>

      {/* ── Deep Clone ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Deep Clone</h2>
        <p className="article-para">
          Recursively copy a value so the result shares no references with the original. The subtlety: cycles
          (self-referential objects) will infinite-loop a naive recursion. A <code>WeakMap</code> tracking
          original&rarr;copy breaks cycles.
        </p>

        <CodeBlock
          code={`function deepClone(value, seen = new WeakMap()) {
  // Primitives & functions: return as-is
  if (Object(value) !== value || typeof value === "function") return value;

  // Cycle guard: return the already-made copy
  if (seen.has(value)) return seen.get(value);

  // Dates
  if (value instanceof Date) return new Date(value);

  // RegExps
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  // Maps
  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach((v, k) => copy.set(deepClone(k, seen), deepClone(v, seen)));
    return copy;
  }
  // Sets
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach((v) => copy.add(deepClone(v, seen)));
    return copy;
  }

  // Arrays or plain objects
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) { // includes symbols
    copy[key] = deepClone(value[key], seen);
  }
  return copy;
}

// Cycles handled:
const a = { name: "a" }; a.self = a;
const b = deepClone(a);
b.self === b;    // true — cycle preserved in the copy
b.self === a.self; // false — no shared reference with original`}
          filename="deep-clone.js"
        />

        <p className="article-para">
          The <code>seen</code> WeakMap is the crux: before cloning an object, check if we&apos;ve already started
          cloning it; if so, return the in-progress copy. This breaks cycles and also shares structure correctly
          (two refs to the same object clone into two refs to the same copy, not two separate copies).{' '}
          <code>Reflect.ownKeys</code> includes symbol keys; preserving the prototype via <code>Object.getPrototypeOf</code>{' '}
          keeps class instances&apos; shape. For most production needs, <code>structuredClone</code> (built-in) does
          this &mdash; but building it teaches the recursion and the cycle problem.
        </p>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Why Each Is Non-Trivial</h2>
        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">EventEmitter: iteration safety + identity</h4>
            <p className="theory-desc">
              A <code>Set</code> gives O(1) <code>off</code> and dedup, but emitting during emit can mutate the set
              mid-iteration. Copy the listeners before iterating in a robust version. Listeners must be removed by
              identity, so the same function reference must be passed to <code>off</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Debounce: cleanup + <code>this</code> preservation</h4>
            <p className="theory-desc">
              The pending timer must be clearable (<code>.cancel()</code>) to avoid leaks, and the original{' '}
              <code>this</code>/<code>args</code> must be forwarded via <code>apply</code> so the debounced fn works as
              a method, not just a free function.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Deep clone: cycles + symbols + prototypes</h4>
            <p className="theory-desc">
              Naive recursion infinite-loops on cycles (<code>a.self = a</code>). The <code>WeakMap</code> seen-map
              breaks them and preserves shared-structure identity. <code>Reflect.ownKeys</code> catches symbol keys;
              preserving the prototype keeps class-instance shapes.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Built-ins exist &mdash; know when to use them</h4>
            <p className="theory-desc">
              <code>structuredClone</code> (deep clone) and lodash&apos;s <code>debounce</code> are battle-tested. Build
              these to learn; in production, reach for the library unless you have a specific reason not to.
            </p>
          </div>
        </div>

        <div className="article-callout">
          <p>
            All three are microcosms of the course: EventEmitter uses closures and <code>this</code>; debounce uses
            closures, timers, and <code>apply</code>; deep clone uses recursion, weak collections, reflection, and the
            prototype chain. If you can build all three cleanly, you&apos;ve internalized the core mechanics.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Production Versions</h2>
        <p className="article-para">
          EventEmitter (pub/sub) predates JS &mdash; Node&apos;s <code>events</code> module standardized it for the JS
          ecosystem. Debounce/throttle were codified by lodash/underscore. Deep clone was hand-rolled for years
          (<code>JSON.parse(JSON.stringify(x))</code> was the hacky standard, lossy and cycle-unsafe) until{' '}
          <code>structuredClone</code> arrived (2022) as a native, cycle-safe, type-aware alternative. Today you&apos;d
          use <code>structuredClone</code> for cloning and lodash for debounce &mdash; but the from-scratch versions
          remain the canonical &ldquo;can you implement it?&rdquo; interview questions.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Utility</th>
                <th>Core skill tested</th>
                <th>Production version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EventEmitter</td>
                <td>Closures, <code>this</code>, iteration safety</td>
                <td>Node <code>events</code>, mitt</td>
              </tr>
              <tr>
                <td>Debounce</td>
                <td>Closures, timers, <code>apply</code></td>
                <td>lodash <code>debounce</code></td>
              </tr>
              <tr>
                <td>Deep clone</td>
                <td>Recursion, WeakMap, reflection</td>
                <td><code>structuredClone</code> (built-in)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Deep Clone with a Cycle</h2>

        <CodeBlock
          code={`const a = { n: 1 }; a.self = a;   // a.self points back to a
const b = deepClone(a);`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>deepClone(a, seen={`{}`})</code>: <code>a</code> is an object. Record <code>seen.set(a, copyA)</code>{' '}
              where <code>copyA</code> is a new empty object &mdash; <em>before</em> cloning its children.
            </span>
          </li>
          <li>
            <span>
              Iterate <code>a</code>&apos;s keys: <code>n</code> &rarr; <code>deepClone(1)</code> = <code>1</code> (primitive),
              set <code>copyA.n = 1</code>. Then <code>self</code> &rarr; <code>deepClone(a)</code> again &mdash; but{' '}
              <code>seen.has(a)</code> is <strong>true</strong>!
            </span>
          </li>
          <li>
            <span>
              The cycle guard returns <code>seen.get(a)</code> = <code>copyA</code> (the in-progress copy). So{' '}
              <code>copyA.self = copyA</code> &mdash; the cycle is faithfully reproduced in the copy, not infinite-looped.
            </span>
          </li>
          <li>
            <span>
              Result: <code>b</code> is a fresh object with <code>b.self === b</code> (cycle preserved) and{' '}
              <code>b.self !== a.self</code> (no shared reference with the original). Recursion terminates.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. EventEmitter with <code>once</code> + disposer</h3>
        <CodeBlock
          code={`const bus = new EventEmitter();
bus.once("init", () => console.log("init once"));
bus.emit("init"); // "init once"
bus.emit("init"); // nothing — listener auto-removed after first fire`}
          filename="ee-once.js"
        />

        <h3 className="article-h3">2. Robust emit (copy before iterate)</h3>
        <CodeBlock
          code={`emit(event, ...args) {
  const listeners = this.#events.get(event);
  if (!listeners) return;
  [...listeners].forEach((fn) => fn(...args)); // copy: safe if a listener off()'s mid-emit
}
// Without the copy, a listener that removes itself during emit could mutate the
// set being iterated → skipped/duplicate calls.`}
          filename="ee-robust.js"
        />

        <h3 className="article-h3">3. Debounce as a method (<code>this</code> preserved)</h3>
        <CodeBlock
          code={`class Search {
  constructor() { this.query = debounce(this.fetch, 300); }
  fetch(q) { console.log("fetching for", this.prefix, q); } // \`this\` = the Search
  prefix = "user:";
}
const s = new Search();
s.query("a"); s.query("ab"); // ~300ms later: "fetching for user: ab"
// fn.apply(this, args) inside debounce preserves the Search as \`this\`.`}
          filename="debounce-method.js"
        />

        <h3 className="article-h3">4. Deep clone with symbols + prototype</h3>
        <CodeBlock
          code={`const sym = Symbol("id");
class Box { constructor() { this[sym] = 42; this.val = 1; } }
Box.prototype.method = function () { return "m"; };
const b = new Box();
const c = deepClone(b);
c[sym];        // 42 — symbol key cloned
c.method();    // "m" — prototype preserved
c instanceof Box; // true`}
          filename="clone-symbols.js"
        />

        <h3 className="article-h3">5. When to just use <code>structuredClone</code></h3>
        <CodeBlock
          code={`// Built-in, handles cycles, dates, maps, sets, arrays, typed arrays:
const copy = structuredClone(complexValue);
// Limitations: can't clone functions (throws), DOM nodes, or class instances
// with private fields cleanly. For those, write a custom \`toJSON\`/clone.`}
          filename="structured-clone.js"
        />

        <h3 className="article-h3">6. The JSON hack and why it&apos;s lossy</h3>
        <CodeBlock
          code={`const copy = JSON.parse(JSON.stringify(value));
// Loses: undefined, functions, symbols, Dates (→ strings), Maps/Sets (→ {}),
// throws on cycles. Fast and built-in, but only safe for plain JSON data.`}
          filename="json-hack.js"
        />

        <div className="article-callout">
          <p>
            The unifying lesson: every utility hides one non-obvious correctness concern &mdash; iteration safety
            (EventEmitter), cleanup/<code>this</code> (debounce), cycles (deep clone). The naive version &ldquo;works&rdquo;
            on happy paths and fails on edge cases. Production-quality means handling the edges, which is what
            libraries like lodash and built-ins like <code>structuredClone</code> do for you.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Implement all three from scratch and test the edge cases: EventEmitter with <code>once</code> + a listener
            that removes itself during emit; debounce used as a method (confirm <code>this</code>) with{' '}
            <code>.cancel()</code>; deep clone of a cyclic object with a symbol key and a Date.
          </p>
        </div>

        <CodeBlock
          code={`// 1. EventEmitter — once + safe iteration
class EventEmitter {
  #events = new Map();
  on(e, l) { (this.#events.get(e) ?? this.#events.set(e, new Set()).get(e)).add(l); return () => this.off(e, l); }
  off(e, l) { this.#events.get(e)?.delete(l); }
  once(e, l) { const w = (...a) => { this.off(e, w); l(...a); }; return this.on(e, w); }
  emit(e, ...a) { [...(this.#events.get(e) ?? [])].forEach((fn) => fn(...a)); }
}

// 2. Debounce with cancel + this preservation
function debounce(fn, wait) {
  let t;
  const d = function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
  d.cancel = () => clearTimeout(t);
  return d;
}

// 3. Deep clone with cycle guard
function deepClone(v, seen = new WeakMap()) {
  if (Object(v) !== v) return v;
  if (seen.has(v)) return seen.get(v);
  if (v instanceof Date) return new Date(v);
  const copy = Array.isArray(v) ? [] : Object.create(Object.getPrototypeOf(v));
  seen.set(v, copy);
  for (const k of Reflect.ownKeys(v)) copy[k] = deepClone(v[k], seen);
  return copy;
}

// Test cycle: const a = {}; a.self = a; deepClone(a).self === deepClone(a) // false-but-cyclic-ok`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why must <code>seen</code> be set <em>before</em> recursing into children, not after? (So that when the
            recursion encounters a back-reference to the current object, the guard finds the in-progress copy and returns
            it &mdash; breaking the cycle. If you set <code>seen</code> only after fully cloning, the cycle would
            re-enter <code>deepClone(value)</code> before the entry exists, looping forever. Recording the copy early is
            what makes cycle detection work.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Implement an EventEmitter (on/emit/off/once).</h4>
            <p className="iq-a">
              A class holding a <code>Map</code> of event name &rarr; <code>Set</code> of listeners. <code>on</code> adds
              a listener (returning a disposer that calls <code>off</code>); <code>off</code> deletes by identity;
              <code> emit</code> copies the set and calls each listener with the args; <code>once</code> wraps the
              listener to self-remove after first call. Using a Set gives O(1) removal and dedup.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Why copy the listener set before iterating in <code>emit</code>?</h4>
            <p className="iq-a">
              Because a listener might call <code>off</code> (or <code>on</code>) during the emit, mutating the set
              mid-iteration. Iterating a mutating Set can skip listeners or throw. Copying (<code>[...listeners]</code>)
              snapshots the set, so additions/removals during emit don&apos;t affect the current dispatch. This is the
              &ldquo;emit-during-emit&rdquo; edge case.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Implement <code>debounce</code> with <code>.cancel()</code>.</h4>
            <p className="iq-a">
              <code>{'function debounce(fn, wait) { let t; const d = function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); }; d.cancel = () => clearTimeout(t); return d; }'}</code>{' '}
              Each call clears the pending timer and sets a new one; only after <code>wait</code> of silence does{' '}
              <code>fn</code> run, with the latest args and the caller&apos;s <code>this</code> (via <code>apply</code>).
              <code> .cancel()</code> clears the timer for cleanup, preventing leaks.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why does debounce use <code>fn.apply(this, args)</code>?</h4>
            <p className="iq-a">
              To preserve the original <code>this</code> and arguments. A debounced function is often used as a method
              (<code>{'obj.debounced = debounce(obj.method, 300)'}</code>) or event handler; if it called{' '}
              <code>fn(args)</code> directly, <code>this</code> would be wrong (the wrapper, not the receiver) and
              spread args would be lost. <code>apply(this, args)</code> forwards both faithfully.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Implement deep clone that handles cycles.</h4>
            <p className="iq-a">
              <code>{'function deepClone(v, seen = new WeakMap()) { if (Object(v) !== v) return v; if (seen.has(v)) return seen.get(v); const copy = Array.isArray(v) ? [] : Object.create(Object.getPrototypeOf(v)); seen.set(v, copy); for (const k of Reflect.ownKeys(v)) copy[k] = deepClone(v[k], seen); return copy; }'}</code>{' '}
              The <code>seen</code> WeakMap records each original &rarr; its in-progress copy <em>before</em> recursing,
              so a back-reference returns the existing copy instead of looping. WeakMap (vs Map) doesn&apos;t leak.{' '}
              <code>Reflect.ownKeys</code> includes symbols; preserving the prototype keeps shapes.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why a WeakMap for the cycle guard, and why set it before recursing?</h4>
            <p className="iq-a">
              WeakMap so the guard itself doesn&apos;t keep the originals alive (it&apos;s transient; once cloning
              finishes, the map should be GC-able with the data). Set the entry <em>before</em> recursing into children
              so that when the recursion hits a back-reference to the current object, the guard finds the in-progress
              copy and returns it &mdash; breaking the cycle. Setting it after would mean the entry doesn&apos;t exist
              yet when the cycle re-enters, looping forever.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What can&apos;t <code>structuredClone</code> / your deep clone handle, and how do you deal with it?</h4>
            <p className="iq-a">
              Functions (can&apos;t be meaningfully cloned &mdash; <code>structuredClone</code> throws; a custom clone
              usually returns the same reference), class instances with private fields or non-trivial constructors
              (cloning the shape loses invariants), DOM nodes, and objects holding external resources (file handles,
              sockets). For these, you don&apos;t generically clone &mdash; you implement a type-specific{' '}
              <code>clone()</code> method or <code>toJSON</code>/<code>fromJSON</code> pair that reconstructs the
              invariant correctly. <code>structuredClone</code> also can&apos;t preserve a class&apos;s prototype (it
              returns plain objects), so <code>instanceof</code> breaks on its output for class instances. The right
              approach depends on the type: plain data &rarr; <code>structuredClone</code>; class instances &rarr; a
              dedicated <code>clone()</code> or copy constructor; functions &rarr; share the reference (or re-bind). The
              general lesson: deep cloning is type-aware, and a single generic function is necessarily a compromise.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
