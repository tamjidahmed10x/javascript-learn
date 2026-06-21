import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('advanced-patterns')!
const navItems = weekNav(week)

export default function AdvancedDay7() {
  const { prev } = dayNavLinks(week, 7)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[6].title}</h1>
        <p className="lesson-subtitle">
          One week, condensed. Then ten problems combining currying, generators, Proxy, weak collections, and symbols
          &mdash; the primitives that mark a senior candidate.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A compressed review of the week &mdash; currying &amp; composition, iterators &amp; generators, Proxy &amp;
            Reflect, weak collections, and symbols &mdash; followed by hard problems and a self-assessment.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Memorize the cheat sheet, then attempt each problem cold. These primitives combine: a single problem may
            need currying <em>and</em> a generator <em>and</em> a symbol-keyed WeakMap.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            End of Week 5. If you can solve 7 of 10 cold and explain the trade-offs, you&apos;re ready for Week 6
            (Modules, Performance &amp; Memory).
          </p>
        </div>
      </div>

      {/* ── Cheat Sheet ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Week 5 Cheat Sheet</h2>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">Currying &amp; composition</h4>
            <p className="theory-desc">Currying: <code>f(a)(b)(c)</code>, partial application one arg at a time. <code>compose</code> is right-to-left; <code>pipe</code> left-to-right. Both <code>reduce</code> one value through fns. Data-last args enable point-free pipelines.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Iterators</h4>
            <p className="theory-desc">Iterator = <code>next() &rarr; {`{value, done}`}</code>. Iterable = has <code>[Symbol.iterator]</code>. Lazy &mdash; values produced on demand; can be infinite. Single-use; re-call <code>[Symbol.iterator]()</code> for a fresh one.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Generators</h4>
            <p className="theory-desc"><code>function*</code> + <code>yield</code> pause/resume. Returns an iterator+iterable. <code>yield</code> emits and receives (<code>next(v)</code>). First <code>next</code>&apos;s arg is ignored. <code>yield*</code> delegates. <code>throw()</code> injects errors at the pause.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Proxy &amp; Reflect</h4>
            <p className="theory-desc">Proxy wraps a target; traps intercept operations (<code>get/set/has/apply/construct</code>). <code>Reflect</code> methods are the defaults &mdash; call them inside traps. <code>set</code> must return a boolean. Invariants keep proxies honest.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Weak collections</h4>
            <p className="theory-desc"><code>WeakMap</code>/<code>WeakSet</code> hold keys weakly &mdash; entries die when keys are unreachable. Not iterable, no size (would leak GC timing). <code>WeakRef</code>/<code>FinalizationRegistry</code> (ES2021) for caches/external cleanup. Values held strongly &mdash; avoid value&rarr;key cycles.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Symbols</h4>
            <p className="theory-desc">7th primitive &mdash; unique, immutable. <code>Symbol()</code> fresh each call; <code>Symbol.for()</code> shared global. Symbol keys skip <code>for...in</code>/JSON but appear in spread/<code>Reflect.ownKeys</code>. Well-known symbols (<code>iterator</code>, <code>toPrimitive</code>, &hellip;) hook into the language.</p>
          </div>
        </div>
      </section>

      {/* ── Common Traps ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Seven Traps</h2>
        <p className="article-para">
          These recur in interviews and real code. Recognize the shape.
        </p>

        <ol className="article-ol">
          <li><strong>First <code>next()</code> arg ignored</strong> &mdash; generators can&apos;t receive input until something is paused (Day 3).</li>
          <li><strong>Exhausting a single-use iterator</strong> &mdash; spreading/consuming twice yields nothing the second time (Day 2).</li>
          <li><strong><code>set</code> trap returning falsy</strong> &mdash; throws in strict mode; use <code>Reflect.set</code> (Day 4).</li>
          <li><strong>WeakMap value referencing its key</strong> &mdash; keeps the key alive, leaks (Day 5).</li>
          <li><strong>Treating symbols as private</strong> &mdash; <code>getOwnPropertySymbols</code> reveals them; use <code>#</code> for real privacy (Day 6).</li>
          <li><strong>Data-first curried helpers</strong> &mdash; breaks point-free pipelines; data must come last (Day 1).</li>
          <li><strong>Relying on <code>FinalizationRegistry</code> for correctness</strong> &mdash; GC-timed, may not run (Day 5).</li>
        </ol>
      </section>

      {/* ── Hard Problems ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Hard Problems</h2>
        <p className="article-para">
          Attempt each before reading the answer. These combine multiple primitives &mdash; the mark of senior-level
          fluency.
        </p>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 1. Output?</h4>
          <CodeBlock
            code={`function* g() {
  yield 1;
  yield 2;
  return 3;
  yield 4;
}
const it = g();
console.log(it.next().value, it.next().value, it.next().value, it.next().value);`}
            filename="p1.js"
          />
          <p className="iq-a">
            <code>1 2 3 undefined</code>. <code>yield 1</code> &rarr; 1; <code>yield 2</code> &rarr; 2; <code>return 3</code>{' '}
            ends the generator with value 3 (<code>done: true</code>); <code>yield 4</code> is unreachable. The fourth{' '}
            <code>next()</code> on an exhausted generator returns <code>{'{value: undefined, done: true}'}</code>.{' '}
            <code>return</code> in a generator sets the final value but stops iteration.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 2. Output?</h4>
          <CodeBlock
            code={`const obj = {
  [Symbol.iterator]: function* () { yield "a"; yield "b"; },
};
const a = [...obj];
const b = [...obj];
console.log(a, b);`}
            filename="p2.js"
          />
          <p className="iq-a">
            <code>{'["a","b"] ["a","b"]'}</code>. The <code>[Symbol.iterator]</code> is a generator <em>function</em>
            (note the <code>function*</code>), so each spread calls it and gets a <em>fresh</em> generator. Both spreads
            produce the full sequence. Contrast with spreading a single generator <em>object</em> twice (exhausted the
            second time) &mdash; the difference is iterable (reusable) vs iterator (single-use).
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 3. What does this log, and what&apos;s the bug?</h4>
          <CodeBlock
            code={`const cache = new WeakMap();
function memo(fn) {
  return (obj) => {
    if (cache.has(obj)) return cache.get(obj);
    const r = fn(obj);
    cache.set(obj, r);
    return r;
  };
}
const m = memo((s) => s.toUpperCase());
console.log(m("hi"));`}
            filename="p3.js"
          />
          <p className="iq-a">
            It throws <code>TypeError: Invalid value used as weak map key</code>. <code>WeakMap</code> keys must be
            objects; <code>"hi"</code> is a primitive string. The cache works for object arguments but not primitives.
            Fix: use a plain <code>Map</code> (with manual cleanup) or key by a serialized string for primitive
            arguments. The bug is assuming WeakMap accepts any key type.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 4. Output?</h4>
          <CodeBlock
            code={`const p = new Proxy({}, {
  get(t, k) { console.log("get", k); return Reflect.get(t, k); },
  set(t, k, v) { console.log("set", k, v); return Reflect.set(t, k, v); },
});
p.x = 1;
p.x;
p.y;`}
            filename="p4.js"
          />
          <p className="iq-a">
            Logs <code>set x 1</code>, then <code>get x</code>, then <code>get y</code>. Assignment fires{' '}
            <code>set</code>; reads fire <code>get</code> &mdash; even for missing keys (<code>y</code> never existed,
            but the trap still runs, returning <code>undefined</code> via <code>Reflect.get</code>). This is the basis of
            reactivity and default-value proxies: every access is observable.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 5. Implement lazy <code>take</code> + infinite <code>naturals</code>; yield first 3 evens doubled.</h4>
          <CodeBlock
            code={`function* naturals() { let n = 1; while (true) yield n++; }
function* map(it, fn) { for (const v of it) yield fn(v); }
function* filter(it, p) { for (const v of it) if (p(v)) yield v; }
function* take(it, n) { let i = 0; for (const v of it) { if (i++ >= n) return; yield v; } }
// First 3 evens doubled:
[...take(map(filter(naturals(), n => n % 2 === 0), n => n * 2), 3)];`}
            filename="p5.js"
          />
          <p className="iq-a">
            <code>{'[4, 8, 12]'}</code>. The evens are 2, 4, 6; doubled: 4, 8, 12. Crucially,{' '}
            <code>naturals()</code> only yields enough to produce the answer &mdash; it pulls up to 6 (since the 3rd
            even is 6), never realizing the infinite tail. Lazy evaluation flows backward from <code>take</code>{' '}
            through <code>map</code> and <code>filter</code> to <code>naturals</code>; each stage pulls one value only
            when the next needs it.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 6. Implement a memoizer that caches by object identity <em>and</em> won&apos;t leak.</h4>
          <CodeBlock
            code={`function memoizeWeak(fn) {
  const cache = new WeakMap();           // keyed by the object argument
  return function (obj, ...rest) {
    if (cache.has(obj)) return cache.get(obj); // cache hit
    const result = fn(obj, ...rest);
    cache.set(obj, result);              // store result on the object's entry
    return result;
  };
}`}
            filename="p6.js"
          />
          <p className="iq-a">
            Use a <code>WeakMap</code> keyed by the object argument so the cache doesn&apos;t keep it alive: when the
            caller drops the object, the entry is GC&apos;d automatically. Keys must be objects (primitives throw); for
            mixed args, layer WeakMaps for object args or fall back to a Map for primitives. The non-leaking property is
            the point &mdash; a plain <code>Map</code> cache would pin every argument forever. Note the value is held
            strongly, so ensure it doesn&apos;t reference the key (Day 5 trap).
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 7. Make an object iterable over its values (a plain object, which isn&apos;t iterable by default).</h4>
          <CodeBlock
            code={`function iterableValues(obj) {
  obj[Symbol.iterator] = function* () {
    for (const v of Object.values(this)) yield v;
  };
  return obj;
}
const o = iterableValues({ a: 1, b: 2 });
[...o];              // [1, 2]
for (const v of o) console.log(v); // 1, 2`}
            filename="p7.js"
          />
          <p className="iq-a">
            Add a <code>Symbol.iterator</code> method (a generator is the concise way) that yields each value. Now{' '}
            <code>for...of</code>, spread, and destructuring work. The symbol key won&apos;t clash with any string
            property (Day 6) and won&apos;t appear in <code>Object.keys</code>. This is the canonical use of the
            well-known <code>Symbol.iterator</code> combined with a generator for brevity.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 8. Build a reactive object that logs every property change using Proxy + Reflect.</h4>
          <CodeBlock
            code={`function reactive(target, onChange) {
  return new Proxy(target, {
    set(t, k, v, r) {
      const old = t[k];
      const ok = Reflect.set(t, k, v, r);
      if (ok && old !== v) onChange(k, old, v);
      return ok;
    },
    deleteProperty(t, k) {
      const had = k in t;
      const ok = Reflect.deleteProperty(t, k);
      if (ok && had) onChange(k, had ? "deleted" : null, undefined);
      return ok;
    },
  });
}
const state = reactive({ count: 0 }, (k, old, v) => console.log(k, old, "->", v));
state.count = 1;      // logs: count 0 -> 1
state.count = 1;      // nothing — no change
delete state.count;   // logs deletion`}
            filename="p8.js"
          />
          <p className="iq-a">
            The <code>set</code> trap performs the real write via <code>Reflect.set</code> (returning the required
            boolean), then fires <code>onChange</code> only if the value actually changed. The{' '}
            <code>deleteProperty</code> trap similarly notifies on removal. From outside, <code>state</code> behaves
            like a plain object, but every mutation is observable &mdash; the foundation of reactivity systems. Using{' '}
            <code>Reflect</code> preserves all default semantics and proxy invariants.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 9. Implement <code>pipe</code> using <code>reduce</code>, and <code>compose</code> using <code>reduceRight</code>.</h4>
          <CodeBlock
            code={`const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

pipe((x) => x + 1, (x) => x * 2)(3);    // (3+1)*2 = 8
compose((x) => x * 2, (x) => x + 1)(3); // 2*(3+1) = 8 (same result, right-to-left)`}
            filename="p9.js"
          />
          <p className="iq-a">
            <code>pipe</code> reduces left-to-right so the first function runs first (reads in execution order);{' '}
            <code>compose</code> uses <code>reduceRight</code> so the <em>last</em> function in the list runs first
            (mathematical convention). Both seed the accumulator with the input and thread it through each function.
            The reducer body <code>(v, f) =&gt; f(v)</code> is the entire mechanism: apply each function to the running
            result.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 10. Combine everything: a curried, point-free pipeline over a generator, observing each step with a Proxy.</h4>
          <CodeBlock
            code={`const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const curry = (fn) => (a) => (b) => fn(a, b);
const map = curry((fn, it) => (function* () { for (const v of it) yield fn(v); })());
const take = curry((n, it) => {
  return (function* () { let i = 0; for (const v of it) { if (i++ >= n) return; yield v; } })();
});

function observed(label, fn) {
  return new Proxy(fn, {
    apply(t, thisArg, args) {
      const result = Reflect.apply(t, thisArg, args);
      console.log(label, "produced");
      return result;
    },
  });
}

function* naturals() { let n = 1; while (true) yield n++; }

const pipeline = pipe(
  observed("naturals", naturals),
  map((n) => n * 10),
  take(3)
);
[...pipeline()];`}
            filename="p10.js"
          />
          <p className="iq-a">
            Produces <code>{'[10, 20, 30]'}</code>, logging <code>naturals produced</code> once. The pipeline combines
            currying (data-last <code>map</code>/<code>take</code>), point-free composition (<code>pipe</code>), lazy
            generator sequences (infinite <code>naturals</code> materializing only 3 values), and a Proxy (<code>apply</code>{' '}
            trap observing the function call). One problem, five Week-5 primitives. Note <code>map</code>/{' '}
            <code>take</code> are curried generators so they compose lazily; only <code>take(3)</code>&apos;s demand
            drives <code>naturals</code> to yield exactly 3 values.
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
            <li>I can implement <code>curry</code>, <code>pipe</code>, and <code>compose</code> from scratch.</li>
            <li>I can explain the &ldquo;data-last&rdquo; convention and why it enables point-free style.</li>
            <li>I can write an iterable by hand and with a generator.</li>
            <li>I understand why iterators are lazy and single-use, and when each matters.</li>
            <li>I can explain <code>yield</code> as a two-way channel and why the first <code>next</code> arg is ignored.</li>
            <li>I can write a Proxy with <code>get</code>/<code>set</code> traps and use <code>Reflect</code> correctly.</li>
            <li>I know why <code>set</code> must return a boolean and what proxy invariants are.</li>
            <li>I can explain when to use <code>WeakMap</code>/<code>WeakSet</code> vs <code>Map</code>/<code>Set</code>, and why they aren&apos;t iterable.</li>
            <li>I can name 4+ well-known symbols and what each hooks into.</li>
            <li>I know the difference between symbol keys and <code>#</code> private fields.</li>
          </ul>

          <p style={{ marginTop: '1rem' }}>
            <strong>Ready for Week 6?</strong> Modules, Performance &amp; Memory connects your code to the engine that
            runs it: how ES modules bundle and tree-shake, how garbage collection reclaims memory, where leaks come
            from (including the WeakMap value-cycle you learned today), and how event-loop timing primitives like{' '}
            <code>requestAnimationFrame</code> fit in. The lazy/composition mindset from this week recurs &mdash;
            bundlers are pipelines over module graphs.
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
// 1. curry, pipe, compose (data-last, reduce/reduceRight).
// 2. A lazy map/filter/take toolkit using generators.
// 3. An infinite naturals() generator; take the first 5 squares.
// 4. A two-way generator: a stateful counter fed by next(n).
// 5. A Proxy that logs reads and validates writes (Reflect inside).
// 6. A revocable Proxy wrapping a "secret" object; revoke and confirm.
// 7. A WeakMap-based memoizer for a single object argument.
// 8. Make a plain object iterable via Symbol.iterator (generator).
// 9. Implement Symbol.toPrimitive on a Money class (string vs number hints).

// Then solve Problems 5, 8, and 10 on paper, naming every primitive used.`}
          filename="final-practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Why paper matters</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Senior interviews test whether you can reason about these primitives cold &mdash; tracing a generator,
            predicting a Proxy&apos;s effect, choosing WeakMap vs Map. Building them from a blank file without
            references is the proof of fluency the week is designed to produce.
          </p>
        </div>
      </section>

      {/* ── Bridge to Week 6 ──────────────────────────────── */}
      <section className="day-section">
        <div className="week-bridge">
          <p>
            Week 5 complete. You now hold JavaScript&apos;s <strong>expert primitives</strong> &mdash; functional
            composition, lazy iteration with generators, metaprogramming with Proxy/Reflect, memory-safe weak
            collections, and the protocol-hooking symbol type. These are the tools that distinguish senior candidates
            and underpin real frameworks (Vue&apos;s reactivity, Immer, RxJS pipelines). <strong>Week 6 (Modules,
            Performance &amp; Memory)</strong> zooms out from language features to the system that runs them: how
            modules bundle and tree-shake (a composition problem over your code&apos;s graph), how the garbage
            collector decides what to reclaim (including the weak references from today), where memory leaks originate,
            and the timing primitives that keep the event loop responsive.
          </p>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
