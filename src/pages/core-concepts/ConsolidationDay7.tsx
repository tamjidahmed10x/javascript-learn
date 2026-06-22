import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('consolidation')!
const navItems = weekNav(week)

export default function ConsolidationDay7() {
  const { prev } = dayNavLinks(week, 7)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[6].title}</h1>
        <p className="lesson-subtitle">
          The end of the road. A full-course map, a final self-assessment, and where to go next. Eight weeks, one
          language, mastered from first principles.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            The capstone review: an eight-week map of everything you learned, a master cheat sheet, a final
            self-assessment across all themes, and concrete next steps for deepening mastery.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Read the full-course map. Score yourself on the self-assessment. Re-solve any weak theme&apos;s hard
            problems. Then pick a next direction from the roadmap.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Now &mdash; you&apos;ve finished. This is the checkpoint that tells you what you own and what to sharpen,
            and points you toward what&apos;s next.
          </p>
        </div>
      </div>

      {/* ── Full Course Map ───────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Full Course Map</h2>
        <p className="article-para">
          Eight weeks, building from how a single statement runs to re-implementing the language itself. Each week
          answered one question:
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">Week 1 &mdash; Execution Context &amp; Scope</h4>
            <p className="theory-desc"><strong>How does JS run code?</strong> Execution context, the call stack, hoisting, the TDZ, scope and the scope chain. The foundation: every variable lives in a scope resolved at definition time.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Week 2 &mdash; Closures &amp; Functions</h4>
            <p className="theory-desc"><strong>How do functions remember and bind?</strong> First-class functions, closures (functions + their environment), the four <code>this</code> rules, <code>call</code>/<code>apply</code>/<code>bind</code>, IIFEs, arrows.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Week 3 &mdash; Prototypes &amp; OOP</h4>
            <p className="theory-desc"><strong>How do objects inherit?</strong> The prototype chain, <code>__proto__</code> vs <code>prototype</code>, constructors and <code>new</code>, ES6 classes, <code>extends</code>/<code>super</code>, composition over inheritance.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Week 4 &mdash; Asynchronous JavaScript</h4>
            <p className="theory-desc"><strong>How does single-threaded JS do concurrency?</strong> The runtime, the event loop, micro vs macrotasks, callbacks, promises, <code>async/await</code>, combinators.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Week 5 &mdash; Advanced Patterns</h4>
            <p className="theory-desc"><strong>What are the expert primitives?</strong> Currying &amp; composition, iterators &amp; generators, Proxy &amp; Reflect, weak collections, symbols &mdash; the tools of senior-level JS.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Week 6 &mdash; Modules, Performance &amp; Memory</h4>
            <p className="theory-desc"><strong>How is code bundled and run efficiently?</strong> ESM vs CJS, bundling &amp; tree-shaking, garbage collection, memory leaks, debounce/throttle/delegation, timing primitives.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Week 7 &mdash; JS Engine Internals</h4>
            <p className="theory-desc"><strong>What does V8 actually do?</strong> The parse&rarr;bytecode&rarr;JIT pipeline, Ignition &amp; TurboFan, hidden classes &amp; inline caching, deoptimization, stack vs heap, reading ECMA-262.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Week 8 &mdash; Consolidation</h4>
            <p className="theory-desc"><strong>Can you build it?</strong> Promise, <code>call</code>/<code>apply</code>/<code>bind</code>, <code>new</code>, EventEmitter, debounce, deep clone &mdash; from scratch &mdash; plus 10 hard interview problems.</p>
          </div>
        </div>
      </section>

      {/* ── Master Cheat Sheet ────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Master Cheat Sheet (One Line Per Concept)</h2>
        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Concept</th>
                <th>The one-line truth</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Hoisting</td><td>Declarations move up; assignments stay. <code>let</code>/<code>const</code> hoist but sit in the TDZ until their line.</td></tr>
              <tr><td>Scope chain</td><td>Inner scopes can see outer; resolved at definition, not call.</td></tr>
              <tr><td>Closure</td><td>A function + its captured environment. It keeps variables alive as long as it lives.</td></tr>
              <tr><td><code>this</code></td><td>Decided by <em>how a function is called</em>: new &gt; explicit &gt; implicit &gt; default; arrows inherit lexically.</td></tr>
              <tr><td>Prototype chain</td><td>Property reads walk <code>[[Prototype]]</code> links until found or <code>null</code>.</td></tr>
              <tr><td><code>new</code></td><td>Create, link to <code>.prototype</code>, run with <code>this</code>, return (unless ctor returned an object).</td></tr>
              <tr><td>class</td><td>Sugar over constructor + prototype. Requires <code>new</code>, always strict.</td></tr>
              <tr><td>Event loop</td><td>Run task &rarr; drain microtasks &rarr; (render) &rarr; one macrotask &rarr; repeat.</td></tr>
              <tr><td>Micro vs macro</td><td>Promises/await are microtasks (drain fully first); timers/I/O are macrotasks.</td></tr>
              <tr><td>Promise</td><td>State machine: pending&rarr;fulfilled/rejected, settles once, handlers always async, <code>then</code> chains + unwraps.</td></tr>
              <tr><td>async/await</td><td>Sugar over promises; <code>await</code> suspends the function (not the thread), resumes as a microtask.</td></tr>
              <tr><td>Iterators/generators</td><td><code>next()&rarr;{`{value,done}`}</code>; generators pause at <code>yield</code>, lazy &amp; infinite-able.</td></tr>
              <tr><td>Proxy/Reflect</td><td>Intercept object ops via traps; Reflect = the defaults.</td></tr>
              <tr><td>WeakMap/Set</td><td>Object keys held weakly &mdash; entries die with the key; not iterable.</td></tr>
              <tr><td>Symbols</td><td>Unique non-colliding keys; well-known symbols hook into the language.</td></tr>
              <tr><td>ESM vs CJS</td><td>ESM static + live bindings + tree-shakeable; CJS dynamic + snapshots + sync.</td></tr>
              <tr><td>GC</td><td>Mark from roots, sweep the unreachable. Generational; cycles don&apos;t leak.</td></tr>
              <tr><td>Memory leak</td><td>A forgotten reference keeping dead data reachable. Four causes: closures, timers/listeners, detached DOM, unbounded caches.</td></tr>
              <tr><td>debounce/throttle</td><td>Debounce runs after calm; throttle caps the rate.</td></tr>
              <tr><td>V8 pipeline</td><td>source &rarr; AST &rarr; Ignition bytecode &rarr; (hot) TurboFan machine code.</td></tr>
              <tr><td>Hidden classes/IC</td><td>Objects have shapes; same construction &rarr; shared; inline caches memoize offsets; keep shapes stable.</td></tr>
              <tr><td>Deopt</td><td>A failed guard (type/shape surprise) reverts to Ignition; always correct, costs speed; thrashing is bad.</td></tr>
              <tr><td>Stack vs heap</td><td>Primitives by value; objects on the heap, referenced. Closures escape vars to the heap.</td></tr>
              <tr><td>ECMA-262</td><td>The spec = the definition; abstract operations &amp; Records describe behavior precisely.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Final Self-Assessment ─────────────────────────── */}
      <section className="day-section">
        <div className="challenge-section">
          <span className="challenge-label">Final Self-Assessment</span>
          <p>
            Score yourself 1&ndash;5 on each theme. Anything below 3 &mdash; revisit that week&apos;s Day 7 hard
            problems until it&apos;s automatic.
          </p>
          <ul className="challenge-list">
            <li><strong>Execution &amp; scope:</strong> I can trace hoisting, the TDZ, and scope resolution for any snippet.</li>
            <li><strong>Functions &amp; closures:</strong> I can explain closures from first principles and predict <code>this</code> under all four rules + arrows.</li>
            <li><strong>Prototypes &amp; OOP:</strong> I can trace the prototype chain, desugar a class, and implement <code>new</code> from scratch.</li>
            <li><strong>Async:</strong> I can solve any output-ordering problem and implement <code>Promise.all</code> + a promise from scratch.</li>
            <li><strong>Advanced patterns:</strong> I can build a lazy generator pipeline, a Proxy, and use WeakMap/Symbols appropriately.</li>
            <li><strong>Modules &amp; memory:</strong> I can explain tree-shaking, find a memory leak from a heap snapshot, and choose debounce vs throttle.</li>
            <li><strong>Engine internals:</strong> I can explain the V8 pipeline, why shape stability matters, and what a deopt is.</li>
            <li><strong>The spec:</strong> I can locate a behavior in ECMA-262 and follow its abstract operations.</li>
            <li><strong>Implementation:</strong> I can build Promise, call/apply/bind, new, EventEmitter, debounce, and deep clone from a blank file.</li>
            <li><strong>Communication:</strong> I can explain each answer&apos;s <em>why</em>, not just produce it.</li>
          </ul>
        </div>
      </section>

      {/* ── What's Next ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">What&apos;s Next</h2>
        <p className="article-para">
          You&apos;ve mastered JavaScript the language. Mastery is a platform, not a finish line &mdash; here are the
          natural next directions, each building on this foundation:
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">TypeScript deeply</h4>
            <p className="theory-desc">
              Generics, conditional types, mapped types, type inference. The engine internals (Week 7) and the spec
              (Week 7 Day 6) make TS&apos;s type system far more legible &mdash; you&apos;ll see how types model the
              runtime shapes you now understand.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">A framework in depth (React/Vue/Svelte)</h4>
            <p className="theory-desc">
              Their reactivity is built on the primitives you learned: Vue 3 uses Proxy (Week 5 Day 4), React&apos;s
              hooks are closures + rules (Week 2), all use the event loop and timing (Weeks 4&ndash;6). Knowing the
              language makes the framework make sense.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Node.js &amp; the backend</h4>
            <p className="theory-desc">
              Streams (async iterators, Week 5), the module system (Week 6), the event loop&apos;s Node specifics (libuv
              phases, <code>process.nextTick</code>). Same language, different host (Week 4 Day 1).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Performance engineering</h4>
            <p className="theory-desc">
              Build on Week 7: flame charts, the performance panel, avoiding deopts and layout thrash, measuring with{' '}
              <code>performance.measure</code>. The JIT-friendly habits become a craft.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">WebAssembly, Rust, and systems</h4>
            <p className="theory-desc">
              For the curious about what&apos;s <em>under</em> V8: WASM, engines in C++/Rust, GC algorithms. Week 7 is
              the on-ramp &mdash; the pipeline and GC you learned are the door.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Open source &amp; the spec process</h4>
            <p className="theory-desc">
              Follow TC39 proposals (Week 7 Day 6), read engine source (V8 blog), contribute. The spec literacy you
              built lets you track where the language is going.
            </p>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The thread that connects every direction: you now understand <em>how JavaScript works</em>, not just how to
            use it. That&apos;s the difference that compounds. Frameworks come and go; the language and its engine stay.
            Whatever you build next, you&apos;ll build it knowing why it behaves as it does &mdash; and that
            understanding is permanent.
          </p>
        </div>
      </section>

      {/* ── The Closing ───────────────────────────────────── */}
      <section className="day-section">
        <div className="week-bridge">
          <p>
            That&apos;s the full journey: from <strong>execution context</strong> to <strong>engine internals</strong>,
            ending by <strong>re-implementing the language itself</strong>. You started eight weeks ago with &ldquo;how
            does JS run a single line?&rdquo; and finished able to build Promise, <code>new</code>, and{' '}
            <code>bind</code> from scratch &mdash; and to explain, at the spec level, why each behaves as it does.
            Revisit any week, re-solve the hard problems until the answers are automatic, and carry this foundation into
            everything you build next. The language is no longer a black box. <strong>You understand it.</strong>
          </p>
        </div>
      </section>

      {/* ── Final Practice ────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Final Practice (the real test)</span>
          <p>
            Pick any five problems from across the eight weeks&apos; Day-7 sets. Solve them cold, on paper, with no
            notes. For each, write the one-sentence rule that explains the key step. If all five are correct and
            explained &mdash; you&apos;re done. You&apos;ve mastered the curriculum.
          </p>
        </div>

        <CodeBlock
          code={`// The graduation check — do this from memory:
// 1. Implement Promise (states, then, chaining, unwrapping, catch).
// 2. Implement call/apply/bind.
// 3. Implement new (4 steps + return rule).
// 4. Implement debounce + an EventEmitter with once.
// 5. Predict the output of a mixed sync/microtask/macrotask/await snippet,
//    naming each callback's queue and the FIFO order.
//
// If you can do all five cold and explain the why, the eight weeks worked.
// Congratulations — you understand JavaScript.`}
          filename="graduation.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">One last thing</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Keep this curriculum. The hardest interviews, the gnarliest bugs, the deepest framework questions &mdash;
            they all reduce to the fundamentals here. When something confuses you in the future, come back to the week
            that covers it. The mental models you built are the reference you&apos;ll use for the rest of your career.
          </p>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
