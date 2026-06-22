import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('js-engine-internals')!
const navItems = weekNav(week)

export default function EngineDay2() {
  const { prev, next } = dayNavLinks(week, 2)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[1].title}</h1>
        <p className="lesson-subtitle">
          Two compilers, two jobs: Ignition runs everything fast-to-start; TurboFan specializes hot code by betting on
          observed types. Speculation is the engine of speed &mdash; and the source of deopts.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>Ignition</strong> is V8&apos;s bytecode interpreter &mdash; the baseline tier that runs all code
            immediately and cheaply. <strong>TurboFan</strong> is the optimizing compiler that recompiles hot functions
            into specialized machine code using <strong>speculation</strong> based on type feedback.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Ignition runs bytecode + records feedback. When a function is hot, TurboFan <em>speculates</em> (e.g.,
            &ldquo;<code>a + b</code> is always number+number&rdquo;) and emits a fast path with <em>guard
            checks</em>. If a guard fails at runtime, it <strong>deoptimizes</strong> (Day 4) back to Ignition.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always &mdash; you live in Ignition for cold code and TurboFan for hot code. Knowing which tier your code
            is in (and why it might bail) is the practical skill for performance work.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Yesterday you saw the four-stage pipeline. Today we zoom into the two compilers that define it. Ignition is
          the workhorse that gets your code running instantly; TurboFan is the specialist that turns hot loops into
          machine-speed code. The bridge between them is <strong>speculation</strong> &mdash; educated guesses about
          what your code will do, validated at runtime.
        </p>

        <CodeBlock
          code={`function add(a, b) { return a + b; }
// Ignition:  interprets bytecode, runs for ANY (a, b). Records feedback.
// TurboFan:  after many calls with numbers, speculates "always number+number"
//            → emits: guard(typeof a === number); guard(typeof b === number); integer add
// If a guard ever fails → DEOPT → fall back to Ignition.`}
          filename="intro.js"
        />

        <p className="article-para">
          Speculation is the whole trick. A dynamic language like JS can&apos;t know <code>a + b</code> will be numbers
          at compile time. But after seeing it a thousand times, TurboFan can <em>bet</em> it will be, emit a fast
          integer path with guards, and run at native speed. If the bet loses, it bails. You get static-language speed
          when your code is consistent, dynamic-language flexibility when it isn&apos;t.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Ignition</dt>
            <dd className="def-text">
              V8&apos;s bytecode interpreter and register-based VM. Compiles AST to bytecode, runs it, and collects type
              feedback. Fast to start, runs all code. The baseline tier.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">TurboFan</dt>
            <dd className="def-text">
              V8&apos;s optimizing JIT compiler. Takes hot functions&apos; bytecode + type feedback and emits
              specialized machine code using speculative assumptions. The optimizing tier.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Speculation</dt>
            <dd className="def-text">
              Optimizing based on an assumed (observed) property &mdash; e.g., &ldquo;this <code>+</code> is always
              number+number.&rdquo; The optimized code includes <strong>guards</strong> that verify the assumption; a
              failed guard triggers deoptimization.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Guard</dt>
            <dd className="def-text">
              A runtime check in optimized code that verifies a speculative assumption still holds. Guards are the price
              of speculation &mdash; cheap when they pass, fatal (deopt) when they fail.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Two Mechanics Analogy</h2>
        <p className="article-para">
          Ignition is the <strong>generalist mechanic</strong> who can fix any car &mdash; careful, methodical, works
          on everything, but never the fastest. TurboFan is the <strong>specialist</strong> who, having seen you bring
          the same model a hundred times, sets up a dedicated fast lane just for it: pre-staged tools, no
          double-checking, in-and-out. As long as you keep bringing that model, it&apos;s blazing fast. Bring a
          different one and the specialist tears down the fast lane (deopt) and sends you back to the generalist.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🔧</span>
            <span className="analogy-label">Generalist (any car)</span>
            <span className="analogy-target">Ignition (runs all code)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏎️</span>
            <span className="analogy-label">Specialist fast lane</span>
            <span className="analogy-target">TurboFan (specialized code)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">👀</span>
            <span className="analogy-label">Pre-staged for your model</span>
            <span className="analogy-target">Speculation from feedback</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🚧</span>
            <span className="analogy-label">Wrong model &rarr; teardown</span>
            <span className="analogy-target">Failed guard &rarr; deopt</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The fast lane only exists <em>because</em> the specialist watched what you brought. That watching is type
            feedback; the staging is speculation. Without feedback, TurboFan has nothing to specialize on. Without
            speculation, Ignition couldn&apos;t be made faster. The two-tier design is a bet that the future resembles
            the past &mdash; usually correct, occasionally (deopt) wrong.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Speculation and Tier-Up</h2>
        <p className="article-para">
          The Ignition&rarr;TurboFan transition is governed by heat and feedback. Understanding what triggers it and
          what it speculates on lets you predict (and avoid) deopts.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Ignition runs and records</h4>
            <p className="theory-desc">
              Every function starts here. Ignition interprets bytecode correctly for any input, and as a side effect
              records <strong>feedback</strong> in <em>feedback slots</em> &mdash; what types/shapes each site saw.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Heat triggers tier-up</h4>
            <p className="theory-desc">
              When a function (or loop body) crosses a call-count threshold, V8 marks it hot and hands its bytecode +
              feedback to TurboFan. Cold code stays in Ignition forever &mdash; no point optimizing it.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. TurboFan speculates + guards</h4>
            <p className="theory-desc">
              TurboFan reads the feedback and emits machine code assuming the observed types continue. Each assumption
              becomes a runtime <strong>guard</strong>: if a later call violates it, the guard fires a deopt.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Deopt &rarr; re-tier</h4>
            <p className="theory-desc">
              On a failed guard, TurboFan discards the optimized code and resumes in Ignition (with the new feedback).
              If the function gets hot again with stable feedback, it re-optimizes &mdash; possibly with broader
              assumptions. Repeated deopt/re-opt cycles (&ldquo;thrashing&rdquo;) hurt performance.
            </p>
          </div>
        </div>

        <h3 className="article-h3">What TurboFan speculates about</h3>
        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Feedback kind</th>
                <th>Speculation</th>
                <th>Guard fails when&hellip;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Operation types (<code>+</code>, <code>&lt;</code>)</td>
                <td>Always the same types (e.g. SMI+SMI)</td>
                <td>Different type appears (string)</td>
              </tr>
              <tr>
                <td>Property access shapes</td>
                <td>Property lives at a fixed offset (Day 3)</td>
                <td>Object shape changes</td>
              </tr>
              <tr>
                <td>Call targets</td>
                <td>Always the same function (monomorphic)</td>
                <td>Different function assigned</td>
              </tr>
              <tr>
                <td>Array element types</td>
                <td>Homo­geneous packed array</td>
                <td>Mixed types / holes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Monomorphic (1 type)</span>
            <p className="phase-desc">The JIT&apos;s happy path &mdash; inline, fast.</p>
            <ul className="phase-rules">
              <li>One fast path, no dispatch</li>
              <li>Best optimization</li>
              <li>Aim for this in hot code</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Polymorphic (few types) / Megamorphic (many)</span>
            <p className="phase-desc">The JIT emits a slower dispatch or bails.</p>
            <ul className="phase-rules">
              <li>Multiple type cases / ic-miss</li>
              <li>Harder or impossible to optimize</li>
              <li>Avoid mixing types in hot paths</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The performance rule that falls out: <strong>keep hot-code call sites and property accesses
            monomorphic</strong> &mdash; consistent argument types, stable object shapes (Day 3), the same function at
            a given call site. You don&apos;t hand-tune machine code; you avoid the polymorphism that defeats
            TurboFan&apos;s specialization.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; the Ignition Revolution</h2>
        <p className="article-para">
          Early V8 (2008) compiled everything straight to machine code (full-codegen) &mdash; fast steady-state but
          heavy memory and startup cost. CrankShaft added an optimizing tier with speculation. By 2017 V8 introduced{' '}
          <strong>Ignition</strong> (a bytecode interpreter, replacing full-codegen) paired with TurboFan &mdash;
          discovering that a fast interpreter feeding a smart optimizer beat compiling everything eagerly. Ignition
          also cut memory (one bytecode stream vs. machine code per arch). Today V8 (and similar designs in SpiderMonkey&apos;s
          Baseline/Ion, JavaScriptCore&apos;s LLInt/DFG) all converge on the interpreter+optimizer tiered model.
          Speculative optimization is now universal.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Ignition (interpreter)</th>
                <th>TurboFan (optimizing JIT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tier</td>
                <td>Baseline (runs all code)</td>
                <td>Optimizing (hot code only)</td>
              </tr>
              <tr>
                <td>Output</td>
                <td>Bytecode (run by VM)</td>
                <td>Machine code (CPU-native)</td>
              </tr>
              <tr>
                <td>Startup cost</td>
                <td>~None</td>
                <td>High (compile time)</td>
              </tr>
              <tr>
                <td>Uses speculation?</td>
                <td>Collects feedback</td>
                <td>Yes (guards)</td>
              </tr>
              <tr>
                <td>Handles all inputs?</td>
                <td>Yes (always correct)</td>
                <td>No (deopt on surprise)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A Call Site Through Both Tiers</h2>

        <CodeBlock
          code={`function tag(x) { return x.tag; }
for (let i = 0; i < 1e6; i++) tag({ tag: i });     // always {tag: number}
tag({ tag: 7, extra: "surprise" });                 // different shape!`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Ignition (cold):</strong> the first many <code>tag</code> calls run in the interpreter, correct
              for any input. The property-access site records feedback: &ldquo;<code>x</code> always had shape{' '}
              <code>{'{tag}'}</code>, with <code>tag</code> at offset 0.&rdquo;
            </span>
          </li>
          <li>
            <span>
              <strong>Tier-up (hot):</strong> after many calls, TurboFan compiles <code>tag</code>. It reads the
              feedback and emits machine code: <em>load <code>tag</code> from offset 0 of <code>x</code></em>, with a{' '}
              <strong>guard</strong> that <code>x</code> still has the <code>{'{tag}'}</code> shape.
            </span>
          </li>
          <li>
            <span>
              <strong>Optimized run:</strong> subsequent calls skip the interpreter &mdash; direct offset load, no
              property lookup. Near-native speed. Guards pass.
            </span>
          </li>
          <li>
            <span>
              <strong>Surprise (deopt):</strong> the <code>{'{tag, extra}'}</code> object has a different shape. The
              guard <strong>fails</strong>. TurboFan discards the optimized code and resumes <code>tag</code> in
              Ignition, which reads <code>tag</code> correctly (it handles any shape). Feedback now records both shapes.
            </span>
          </li>
          <li>
            <span>
              <strong>Re-tier (if stable):</strong> if calls continue with the new shape dominating, TurboFan
              re-optimizes for a polymorphic load (a small dispatch over the two known shapes). Slightly slower than
              the monomorphic version but still faster than Ignition.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Watch tier-up and deopt</h3>
        <CodeBlock
          code={`node --trace-opt --trace-deopt -e "
function f(x) { return x + 1; }
for (let i = 0; i < 1e7; i++) f(i);     // optimizes (monomorphic numbers)
f('boom');                              // deopts — string violates feedback
"
// Logs \`[optimizing]\` then \`[bailout: ...]\` — the speculation failing.`}
          filename="trace.js"
        />

        <h3 className="article-h3">2. Monomorphic &rarr; fast</h3>
        <CodeBlock
          code={`function sum(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i];
  return s;
}
// Always call with number[] → TurboFan emits a tight integer loop.
const big = Array.from({ length: 1e6 }, (_, i) => i);
for (let i = 0; i < 1000; i++) sum(big); // hot, monomorphic, fast`}
          filename="mono.js"
        />

        <h3 className="article-h3">3. Polymorphic &rarr; slower</h3>
        <CodeBlock
          code={`function read(o) { return o.x; }
const a = { x: 1 }, b = { x: 1, y: 2 }; // two different shapes
for (let i = 0; i < 1e6; i++) read(i % 2 ? a : b);
// The call site sees BOTH shapes → polymorphic inline cache → slower than
// monomorphic. Fix: give a and b the SAME shape.`}
          filename="poly.js"
        />

        <h3 className="article-h3">4. <code>arguments</code> and shape stability</h3>
        <CodeBlock
          code={`// BAD — leaks the arguments object (defeats some optimizations)
function leaky() { return arguments; }
// GOOD — use rest params (engines optimize these far better)
function clean(...args) { return args; }`}
          filename="arguments.js"
        />

        <h3 className="article-h3">5. <code>delete</code> breaks shapes</h3>
        <CodeBlock
          code={`const o = { a: 1, b: 2, c: 3 };
delete o.b; // transitions o to a "dictionary mode" object — slow property access
// Prefer setting to undefined (keeps the shape) if you must "remove":
o.b = undefined; // shape preserved, fast access maintained`}
          filename="delete.js"
        />

        <h3 className="article-h3">6. Stable call sites</h3>
        <CodeBlock
          code={`// MONOMORPHIC call site — always the same fn
arr.forEach((x) => x * 2);

// POLYMORPHIC call site — different fn each iteration (defeats inlining)
const fns = [(x) => x * 2, (x) => x + 1, (x) => x - 3];
for (let i = 0; i < 1e6; i++) fns[i % 3](i); // 3 different call targets`}
          filename="call-site.js"
        />

        <div className="article-callout">
          <p>
            Don&apos;t read these as &ldquo;optimize everything.&rdquo; They matter only in <strong>hot code</strong>{' '}
            &mdash; loops running millions of times, render functions, data pipelines. Cold code (run once) is fine in
            Ignition. Profile first, then stabilize shapes/types only where it pays off. Premature micro-optimization
            hurts readability for no gain.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Write a hot loop, time it monomorphic vs polymorphic, and confirm with <code>--trace-opt</code>/{' '}
            <code>--trace-deopt</code>. Then trigger a deopt deliberately and observe the bailout, the fall-back to
            Ignition, and (if it stabilizes) the re-optimization.
          </p>
        </div>

        <CodeBlock
          code={`// 1. Monomorphic (fast) — same shape every call
function getX(o) { return o.x; }
const mono = { x: 1 };
const t1 = performance.now();
for (let i = 0; i < 1e8; i++) getX(mono);
console.log("mono:", performance.now() - t1, "ms");

// 2. Polymorphic (slower) — two shapes alternate
const a = { x: 1 }, b = { x: 1, y: 2 };
const t2 = performance.now();
for (let i = 0; i < 1e8; i++) getX(i % 2 ? a : b);
console.log("poly:", performance.now() - t2, "ms"); // usually slower

// 3. Trigger a deopt and watch it
// Run: node --trace-opt --trace-deopt this.js
// Add at the end:
getX("string"); // bailout: getX was optimized for objects, now gets a string
// Re-optimize by running hot again — log shows [optimizing] reappear.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why is the polymorphic version slower even though it does &ldquo;the same work&rdquo;? (Because TurboFan
            can&apos;t emit a single direct-offset load &mdash; it doesn&apos;t know which shape it&apos;ll get. It
            must emit a polymorphic inline cache that checks the shape and dispatches, adding overhead per access.
            Monomorphic code lets it assume one shape and load directly. Same JS semantics, different machine code.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What are Ignition and TurboFan?</h4>
            <p className="iq-a">
              Ignition is V8&apos;s bytecode interpreter &mdash; the baseline tier that runs all code immediately,
              correctly, for any input, while collecting type feedback. TurboFan is the optimizing JIT that recompiles
              hot functions into specialized machine code using that feedback with speculative guards. Cold code lives
              in Ignition; hot code gets promoted to TurboFan for near-native speed.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is speculative optimization?</h4>
            <p className="iq-a">
              Generating fast machine code based on an assumption about runtime behavior (e.g., &ldquo;this{' '}
              <code>+</code> always sees numbers&rdquo;), derived from type feedback. The optimized code includes{' '}
              <strong>guards</strong> that verify the assumption at runtime; if a guard fails, it deoptimizes back to
              the interpreter. Speculation is how a dynamic language gets static-language speed for consistent code &mdash;
              with a bailout when consistency breaks.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. When does a function get optimized?</h4>
            <p className="iq-a">
              When it becomes <em>hot</em> &mdash; executed enough times to cross V8&apos;s tier-up threshold (and/or
              its loops backedge gets hot). V8 then hands its bytecode + collected feedback to TurboFan. Cold code that
              runs few times stays in Ignition, since the compile cost wouldn&apos;t pay off. The JIT optimizes lazily,
              only where the investment amortizes.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Monomorphic vs polymorphic call sites?</h4>
            <p className="iq-a">
              A monomorphic site always sees the same type/function, so TurboFan emits one fast path (or even inlines
              it). A polymorphic site sees a few types; it needs a dispatch (inline cache with multiple cases),
              slower. Megamorphic (many types) defeats optimization entirely. Keeping hot call sites monomorphic &mdash;
              consistent argument types and stable shapes &mdash; is the single biggest JIT-friendly code habit.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Why does mixing types in a hot loop hurt performance?</h4>
            <p className="iq-a">
              Because it makes call sites polymorphic. TurboFan specialized the code assuming one type (from feedback);
              when a different type appears, either the polymorphic inline cache adds dispatch overhead, or worse, the
              guard fails and the code deoptimizes to Ignition. Consistent types keep the fast path. The classic
              example: a function that sometimes adds numbers and sometimes concatenates strings runs slower than two
              separate monomorphic functions.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What happens after a deoptimization?</h4>
            <p className="iq-a">
              TurboFan discards the optimized code and resumes execution in Ignition, which is always correct for any
              input. The new feedback (including the surprising type/shape) is recorded. If the function gets hot again
              with stable feedback, TurboFan re-optimizes &mdash; possibly with broader assumptions to cover what it
              saw. If it keeps bouncing (deopt/re-opt thrashing), performance suffers; the fix is stabilizing the input
              types/shapes so the speculation holds.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How would you write JIT-friendly hot code, and what are the trade-offs?</h4>
            <p className="iq-a">
              Keep hot paths <strong>monomorphic and shape-stable</strong>: consistent argument types at each call site
              (don&apos;t mix number/string/objects through one function), stable object shapes (construct objects with
              the same properties in the same order; avoid <code>delete</code> which forces dictionary mode), avoid
              leaking <code>arguments</code> (use rest params), and keep call sites pointing at one function (enables
              inlining). Use typed arrays (<code>Float64Array</code>) for numeric data. The trade-offs: these patterns
              can reduce flexibility and readability &mdash; you&apos;re constraining the code to fit the optimizer.
              They matter <em>only in hot code</em> (loops, renderers, data pipelines); applying them everywhere is
              premature optimization that hurts maintainability for no measurable gain. Profile first, then stabilize
              the 1% that&apos;s actually hot. The engine does the work; your job is to not defeat it where it counts.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
