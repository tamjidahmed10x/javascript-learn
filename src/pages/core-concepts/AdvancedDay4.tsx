import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('advanced-patterns')!
const navItems = weekNav(week)

export default function AdvancedDay4() {
  const { prev, next } = dayNavLinks(week, 4)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[3].title}</h1>
        <p className="lesson-subtitle">
          The metaprogramming layer. Intercept any operation on an object &mdash; reads, writes, iteration, function
          calls &mdash; and decide what really happens.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>Proxy</strong> wraps a target object and lets you intercept fundamental operations (get, set,
            <code> has</code>, delete, etc.) via handler &ldquo;traps.&rdquo; <strong>Reflect</strong> is a companion
            API that calls those same default operations &mdash; handy inside traps.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            <code>new Proxy(target, handler)</code> returns an object that forwards to <code>target</code> unless a
            trap overrides. Each trap (<code>get</code>, <code>set</code>, <code>has</code>, &hellip;) mirrors an
            internal operation; returning a value or throwing controls the result.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Validation, logging, default values, revocable references, virtual objects, mocking. Power features &mdash;
            Vue 3 and MobX build reactivity on Proxies. Use sparingly: they add overhead and can obscure intent.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Every object operation &mdash; <code>obj.x</code>, <code>obj.x = 1</code>, <code>{'"x" in obj'}</code>,{' '}
          <code>delete obj.x</code> &mdash; routes through internal &ldquo;methods&rdquo; the engine calls. A Proxy
          lets you override those methods. The result is an object whose behavior you fully control: validate writes,
          synthesize reads, log access, revoke access on demand.
        </p>

        <CodeBlock
          code={`// A proxy that rejects negative assignments:
const validator = new Proxy({}, {
  set(target, key, value) {
    if (key === "age" && value < 0) throw new Error("age must be >= 0");
    target[key] = value;
    return true;
  },
});
validator.age = 30;     // ok
validator.age = -1;     // throws Error: age must be >= 0`}
          filename="intro.js"
        />

        <p className="article-para">
          The proxy looks like a normal object, but every assignment funnels through your <code>set</code> trap. You
          get to decide what really happens. That&apos;s metaprogramming: writing code that customizes how other code
          behaves at the language level.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Proxy</dt>
            <dd className="def-text">
              An object that wraps a <code>target</code> and intercepts operations using a <code>handler</code> of
              traps. Reads/writes/etc. on the proxy invoke the matching trap if present, else forward to the target.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Trap</dt>
            <dd className="def-text">
              A handler method named after an internal operation (<code>get</code>, <code>set</code>, <code>has</code>,
              <code> deleteProperty</code>, <code>ownKeys</code>, <code>apply</code>, <code>construct</code>, &hellip;).
              Each trap mirrors one fundamental object operation.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Reflect</dt>
            <dd className="def-text">
              A built-in object whose methods are the default implementations of those same operations
              (<code>Reflect.get</code>, <code>Reflect.set</code>, &hellip;). Inside a trap, you call them to do the
              &ldquo;normal&rdquo; thing.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Front Desk Analogy</h2>
        <p className="article-para">
          A regular object is a building you walk into directly. A Proxy is a <strong>front desk</strong> in front of
          the building: every request (read a room, store something, ask if a room exists) must pass the receptionist
          first. The receptionist can let it through unchanged, modify it, reject it, or pretend a room exists that
          doesn&apos;t. Visitors interact with the desk as if it were the building.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏢</span>
            <span className="analogy-label">The building</span>
            <span className="analogy-target">The target object</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🛎️</span>
            <span className="analogy-label">The front desk</span>
            <span className="analogy-target">The Proxy</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧑‍✈️</span>
            <span className="analogy-label">The receptionist</span>
            <span className="analogy-target">The handler traps</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">Standard procedure</span>
            <span className="analogy-target"><code>Reflect</code> defaults</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Invariants: the engine enforces consistency rules on traps. A <code>get</code> trap can&apos;t return a
            value for a non-configurable, non-writable property that differs from the real one; a{' '}
            <code>set</code> must return a truthy value or be treated as failure in strict mode. These &ldquo;proxy
            invariants&rdquo; keep proxies from violating the language&apos;s object semantics &mdash; you can&apos;t
            make an object lie about its own frozen properties.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Traps and Their Reflect Twins</h2>
        <p className="article-para">
          Every trap corresponds to an internal method and a <code>Reflect</code> function. The clean pattern inside a
          trap is: do your custom logic, then call the matching <code>Reflect</code> method for the default behavior.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Trap</th>
                <th>Reflect method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>obj.x</code></td>
                <td><code>get</code></td>
                <td><code>Reflect.get</code></td>
              </tr>
              <tr>
                <td><code>obj.x = 1</code></td>
                <td><code>set</code></td>
                <td><code>Reflect.set</code></td>
              </tr>
              <tr>
                <td><code>{'"x" in obj'}</code></td>
                <td><code>has</code></td>
                <td><code>Reflect.has</code></td>
              </tr>
              <tr>
                <td><code>delete obj.x</code></td>
                <td><code>deleteProperty</code></td>
                <td><code>Reflect.deleteProperty</code></td>
              </tr>
              <tr>
                <td><code>Object.keys</code></td>
                <td><code>ownKeys</code></td>
                <td><code>Reflect.ownKeys</code></td>
              </tr>
              <tr>
                <td><code>fn(...args)</code></td>
                <td><code>apply</code></td>
                <td><code>Reflect.apply</code></td>
              </tr>
              <tr>
                <td><code>new fn(...args)</code></td>
                <td><code>construct</code></td>
                <td><code>Reflect.construct</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. No trap &rarr; forward to target</h4>
            <p className="theory-desc">
              If a handler omits a trap, the operation is performed on the target as normal. You only override what you
              need.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>Reflect</code> methods forward to the target</h4>
            <p className="theory-desc">
              <code>Reflect.get(target, key, receiver)</code> does exactly what the default <code>get</code> would.
              Calling it inside a trap means &ldquo;do the normal thing&rdquo; without re-implementing it.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>Reflect.set</code> returns success/failure</h4>
            <p className="theory-desc">
              Unlike <code>=</code>, <code>Reflect.set</code> returns a boolean. A <code>set</code> trap must return
              <code> true</code>/<code>false</code> to report success &mdash; cleaner than the bare assignment model.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. <code>apply</code>/<code>construct</code> trap function calls</h4>
            <p className="theory-desc">
              To intercept <code>fn()</code> or <code>new fn()</code>, the target itself must be a function and the
              proxy is called in its place. This is how you wrap/augment function invocation.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The Reflect idiom inside a trap</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Without Reflect (manual)</span>
            <p className="phase-desc">Re-implement the default, error-prone.</p>
            <ul className="phase-rules">
              <li>Misses receivers, accessors</li>
              <li>Easier to break invariants</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">With Reflect (idiomatic)</span>
            <p className="phase-desc">Delegate to the default, then add behavior.</p>
            <ul className="phase-rules">
              <li><code>return Reflect.get(...arguments)</code></li>
              <li>Preserves semantics + invariants</li>
              <li>Pairs 1:1 with each trap</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Why <code>Reflect</code> exists as a separate object: before ES6, the default operations were scattered
            (<code>Object.defineProperty</code>, <code>delete</code>, the <code>in</code> operator) and some
            (<code>delete</code>, <code>in</code>) had no function form. <code>Reflect</code> gathers all of them as
            callable functions &mdash; essential because a trap needs to call the default as a function, not as syntax.
            It also gives <code>set</code> a boolean return, which the trap contract requires.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Proxies Exist</h2>
        <p className="article-para">
          Proxies were prototyped in ES4 (never shipped) and finally landed in ES6 (2015), giving JavaScript a
          general-purpose metaprogramming layer &mdash; something Lisp and Smalltalk had long had. They replaced
          ad-hoc <code>Object.defineProperty</code> tricks and <code>__defineGetter__</code> hacks with a uniform
          interception API. Real-world impact: Vue 3&apos;s reactivity, MobX, Immer (immutable updates via proxy
          recording), and most mocking libraries are built on Proxies. <code>Reflect</code> shipped alongside as the
          matching &ldquo;default behavior&rdquo; API.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>Object.defineProperty</code></th>
                <th>Proxy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>What it changes</td>
                <td>One property&apos;s descriptor</td>
                <td>All operations on an object</td>
              </tr>
              <tr>
                <td>Intercepts</td>
                <td>get/set of that property</td>
                <td>get/set/has/delete/keys/apply/new/&hellip;</td>
              </tr>
              <tr>
                <td>Targets existing object?</td>
                <td>Yes (mutates)</td>
                <td>No (wraps, original untouched)</td>
              </tr>
              <tr>
                <td>Performance</td>
                <td>One-time descriptor cost</td>
                <td>Per-operation overhead</td>
              </tr>
              <tr>
                <td>Revocable?</td>
                <td>No</td>
                <td>Yes (<code>Proxy.revocable</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A Reactive Object with <code>get</code>/<code>set</code></h2>

        <CodeBlock
          code={`function reactive(target) {
  const handlers = {
    get(t, key, receiver) {
      const result = Reflect.get(t, key, receiver);
      track(t, key);              // record dependency
      return result;
    },
    set(t, key, value, receiver) {
      const ok = Reflect.set(t, key, value, receiver);
      if (ok) trigger(t, key);    // notify subscribers
      return ok;
    },
  };
  return new Proxy(target, handlers);
}

const state = reactive({ count: 0 });
state.count;     // get trap: reads 0, tracks \`count\`
state.count = 5; // set trap: writes 5, triggers update`}
          filename="reactive.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>reactive(obj)</code> returns a Proxy wrapping the original. The original is untouched; all access
              goes through the proxy.
            </span>
          </li>
          <li>
            <span>
              A <code>get</code> on <code>state.count</code> fires the <code>get</code> trap. <code>Reflect.get</code>{' '}
              performs the real read from the target (returning 0); <code>track</code> records that someone cares
              about <code>count</code>.
            </span>
          </li>
          <li>
            <span>
              An assignment <code>state.count = 5</code> fires the <code>set</code> trap. <code>Reflect.set</code>{' '}
              writes 5 to the target and returns <code>true</code>; on success, <code>trigger</code> re-runs anyone who
              depended on <code>count</code>.
            </span>
          </li>
          <li>
            <span>
              From outside, <code>state</code> looks and behaves like a plain object &mdash; but every interaction is
              observed. This is exactly how Vue 3&apos;s reactivity works.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Default values via <code>get</code></h3>
        <CodeBlock
          code={`const withDefaults = (obj, fallback) =>
  new Proxy(obj, {
    get: (t, k) => (k in t ? Reflect.get(t, k) : fallback),
  });
const cfg = withDefaults({ port: 3000 }, "unset");
cfg.port;   // 3000
cfg.host;   // "unset" — synthesized, not undefined`}
          filename="defaults.js"
        />

        <h3 className="article-h3">2. Negative-index arrays (Python-style)</h3>
        <CodeBlock
          code={`const arr = new Proxy([10, 20, 30], {
    get(t, k) {
      const i = Number(k);
      if (Number.isInteger(i)) return Reflect.get(t, i < 0 ? t.length + i : i);
      return Reflect.get(t, k); // pass through "length", etc.
    },
  });
  arr[-1]; // 30
  arr[-2]; // 20`}
          filename="negative-index.js"
        />

        <h3 className="article-h3">3. Validation via <code>set</code></h3>
        <CodeBlock
          code={`const validated = new Proxy({}, {
  set(t, k, v) {
    if (k === "age" && (typeof v !== "number" || v < 0)) return false;
    return Reflect.set(t, k, v);
  },
});
validated.age = 25;  // ok
validated.age = -5;  // fails silently (strict mode throws)
validated.age;       // 25`}
          filename="validation.js"
        />

        <h3 className="article-h3">4. Revocable proxy &mdash; cut off access</h3>
        <CodeBlock
          code={`const { proxy, revoke } = Proxy.revocable({ secret: 42 }, {});
proxy.secret; // 42
revoke();     // sever the wrapper
proxy.secret; // TypeError: illegal operation attempted on a revoked proxy
// Great for giving temporary access to an object you can later disable.`}
          filename="revocable.js"
        />

        <h3 className="article-h3">5. <code>apply</code>/<code>construct</code> traps on functions</h3>
        <CodeBlock
          code={`function double(x) { return x * 2; }
const logged = new Proxy(double, {
  apply(t, thisArg, args) {
    console.log("called with", args);
    return Reflect.apply(t, thisArg, args);
  },
  construct(t, args) {
    console.log("new'd with", args);
    return Reflect.construct(t, args);
  },
});
logged(5);        // logs, returns 10
// new logged(5); // logs, builds an instance (if double were a ctor)`}
          filename="apply-construct.js"
        />

        <h3 className="article-h3">6. <code>has</code> trap &mdash; hide properties</h3>
        <CodeBlock
          code={`const hidden = new Proxy({ a: 1, _secret: 2 }, {
  has(t, k) { return k.startsWith("_") ? false : Reflect.has(t, k); },
});
"a" in hidden;      // true
"_secret" in hidden; // false — looks like it doesn't exist
// Also affects \`with\` and \`Object.keys\` (via ownKeys) where applicable.`}
          filename="has-trap.js"
        />

        <div className="article-callout">
          <p>
            Cost and correctness caveats: each proxied operation adds overhead (a trap call), so wrapping
            hot-path objects can hurt performance. Traps also make code harder to reason about &mdash; an assignment
            may now run arbitrary code. Reserve Proxies for cross-cutting concerns (validation, reactivity, logging,
            mocking) where the indirection earns its keep, not for everyday objects.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Build three proxies: (1) <code>withDefaults(obj, fallback)</code> synthesizing missing reads, (2) a
            write validator that rejects non-string keys, (3) a revocable cache that returns cached values until{' '}
            <code>revoke()</code> is called. Use <code>Reflect</code> for every default action.
          </p>
        </div>

        <CodeBlock
          code={`// 1. Defaults
const withDefaults = (obj, fallback) =>
  new Proxy(obj, {
    get(t, k, r) { return k in t ? Reflect.get(t, k, r) : fallback; },
  });

// 2. String-key validator
const stringsOnly = new Proxy({}, {
  set(t, k, v, r) {
    if (typeof k !== "string") throw new TypeError("string keys only");
    return Reflect.set(t, k, v, r);
  },
});

// 3. Revocable cache
function makeCache() {
  const store = new Map();
  const { proxy, revoke } = Proxy.revocable({}, {
    get(t, k) { return store.has(k) ? store.get(k) : undefined; },
    set(t, k, v) { store.set(k, v); return true; },
  });
  return { cache: proxy, revoke };
}
const { cache, revoke } = makeCache();
cache.x = 1; cache.x; // 1
revoke();
cache.x; // TypeError: revoked`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does <code>set</code> return <code>true</code>/<code>Reflect.set(...)</code> rather than nothing?
            (Because the proxy contract requires the <code>set</code> trap to return a boolean success indicator &mdash;
            in strict mode, returning falsy throws <code>TypeError</code>. <code>Reflect.set</code> returns that boolean
            for you, which is why the Reflect idiom is the safe default.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a Proxy?</h4>
            <p className="iq-a">
              An object that wraps a target and intercepts fundamental operations on it via handler traps. Created with{' '}
              <code>new Proxy(target, handler)</code>. Each trap (<code>get</code>, <code>set</code>, <code>has</code>,
              <code> deleteProperty</code>, <code>apply</code>, <code>construct</code>, &hellip;) overrides one
              operation; omitted traps forward to the target unchanged. It enables metaprogramming &mdash; customizing
              object behavior at the language level.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is a trap, and how does it relate to <code>Reflect</code>?</h4>
            <p className="iq-a">
              A trap is a handler method that intercepts one operation. <code>Reflect</code> is a companion object
              whose methods are the <em>default implementations</em> of those same operations. Inside a trap, calling
              the matching <code>Reflect</code> method performs the normal behavior, so you typically do your custom
              work then delegate to <code>Reflect</code>. The names match one-to-one (<code>get</code>/{' '}
              <code>Reflect.get</code>, <code>set</code>/<code>Reflect.set</code>, &hellip;).
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why does a <code>set</code> trap need to return a boolean?</h4>
            <p className="iq-a">
              The proxy contract requires <code>set</code> to report success/failure as a boolean. In strict mode,
              returning a falsy value throws <code>TypeError</code> (assignment failed). <code>Reflect.set</code>{' '}
              returns that boolean for you, so the idiomatic trap returns <code>Reflect.set(...)</code> &mdash; cleaner
              and invariant-safe than re-implementing the assignment.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What are proxy invariants?</h4>
            <p className="iq-a">
              Rules the engine enforces so a proxy can&apos;t violate core object semantics &mdash; e.g., a{' '}
              <code>get</code> trap can&apos;t return a different value for a non-configurable, non-writable property
              than the real one; <code>getPrototypeOf</code> must return an object consistent with the target&apos;s
              prototype chain. Violating throws <code>TypeError</code>. They keep proxies from making objects lie about
              frozen or sealed state.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What is <code>Proxy.revocable</code> for?</h4>
            <p className="iq-a">
              It creates a proxy plus a <code>revoke</code> function. Calling <code>revoke()</code> disables the proxy
              &mdash; any subsequent operation throws <code>TypeError</code>. It&apos;s used to grant temporary,
              revocable access to an object (e.g., hand a wrapped resource to untrusted code, then cut it off). A plain
              <code> Proxy</code> cannot be disabled this way.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How would you build reactivity (like Vue) with Proxies?</h4>
            <p className="iq-a">
              Wrap the state object in a Proxy whose <code>get</code> trap records which property was read by the
              current effect (dependency tracking) and whose <code>set</code> trap, after writing, notifies the effects
              that depended on the changed key. Because every read and write flows through the traps, the system
              automatically observes access without the developer annotating anything. <code>Reflect.get/set</code>{' '}
              performs the real operation so the object still behaves normally. This is the core of Vue 3 and MobX.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What are the performance and correctness trade-offs of using Proxies?</h4>
            <p className="iq-a">
              Performance: every operation on a proxy incurs a trap call, which is slower than a direct property
              access &mdash; significant in hot loops. Engines can&apos;t optimize proxied access as aggressively as
              normal objects because the trap may do anything, so hidden classes and inline caching (Week 7) are
              defeated. Correctness: proxies make code harder to reason about because a simple read or write may run
              arbitrary logic, break debugging expectations, or introduce subtle bugs (e.g., a <code>get</code> trap
              that always returns a truthy value breaks <code>in</code> checks elsewhere). They also can&apos;t
              transparently wrap some native objects (DOM nodes have quirks). Reserve Proxies for cross-cutting
              concerns where the indirection is clearly worth it &mdash; reactivity, validation, mocking, logging &mdash;
              and prefer plain objects elsewhere.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
