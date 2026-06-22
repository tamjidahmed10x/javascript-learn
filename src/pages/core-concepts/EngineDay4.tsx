import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('js-engine-internals')!
const navItems = weekNav(week)

export default function EngineDay4() {
  const { prev, next } = dayNavLinks(week, 4)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[3].title}</h1>
        <p className="lesson-subtitle">
          When the JIT&apos;s bet loses, it bails. Deopts are the cost of speculation &mdash; and the reason
          &ldquo;surprising&rdquo; code is slow code.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>Deoptimization</strong> (&ldquo;deopt&rdquo;) is when V8 discards optimized (TurboFan) code and
            falls back to the interpreter (Ignition) because a runtime assumption was violated. The program stays
            correct &mdash; just slower.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Optimized code contains <strong>guards</strong> (checks that the speculated type/shape still holds). When a
            guard fails &mdash; a new type appears, a shape changes &mdash; V8 throws out the machine code, reconstructs
            interpreter state, and resumes in Ignition.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Whenever hot code meets an input it wasn&apos;t optimized for. A few deopts are fine (the cost of
            flexibility); <strong>repeated deopt/re-opt cycles (&ldquo;thrashing&rdquo;)</strong> in a hot loop are a
            real performance killer.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Day 2 introduced speculation: TurboFan bets that observed types/shapes will continue, and emits fast code with
          guards. Today we cover what happens when the bet loses &mdash; the <strong>deopt</strong>. It&apos;s not a
          crash and not a correctness issue; it&apos;s the JIT admitting its guess was wrong and reverting to the safe,
          always-correct interpreter.
        </p>

        <CodeBlock
          code={`function add(a, b) { return a + b; }
for (let i = 0; i < 1e7; i++) add(i, i);   // hot + monomorphic → optimized
add("hello", "world");                      // string! guard fails → DEOPT
// add() now runs in Ignition again. Correct result, slower path.`}
          filename="intro.js"
        />

        <p className="article-para">
          The function still works &mdash; the string concatenation produces <code>"helloworld"</code> correctly. The
          cost is that the optimized machine code is gone: subsequent calls run in the interpreter until (and unless)
          the function gets hot again with stable feedback. One surprising input can undo a million-call optimization.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Deoptimization (deopt / bailout)</dt>
            <dd className="def-text">
              The transition from optimized machine code back to the interpreter because a speculative guard failed.
              Always correctness-preserving; a performance event, not a bug.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Guard</dt>
            <dd className="def-text">
              A runtime check in optimized code verifying an assumption (type, shape, array mode). Guards passing = fast
              path continues; a guard failing = deopt.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Thrashing</dt>
            <dd className="def-text">
              A deopt/re-optimize cycle that repeats &mdash; the function keeps getting hot, optimizing, then
              deoptimizing on the same surprising input. Compile cost paid repeatedly with no steady-state gain.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Re-optimization</dt>
            <dd className="def-text">
              After a deopt, if the function becomes hot again with (new) stable feedback, TurboFan may recompile it &mdash;
              possibly with broader assumptions covering the new type/shape.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Express Lane Analogy</h2>
        <p className="article-para">
          A grocery store opens an <strong>express lane</strong> for &ldquo;10 items or less&rdquo; based on watching
          most shoppers fit that pattern (type feedback). The lane is fast &mdash; one predictable flow. But it has a
          <strong> guard</strong>: a cashier counting items. When someone rolls up with a full cart, the guard fails &mdash;
          the shopper is sent back to the regular lanes (deopt). The store doesn&apos;t close; service continues
          correctly, just slower for that shopper. If full carts keep coming, the express lane opens and closes
          repeatedly (thrashing) &mdash; wasted effort.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🛒</span>
            <span className="analogy-label">The express lane</span>
            <span className="analogy-target">Optimized machine code</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔢</span>
            <span className="analogy-label">&ldquo;10 items or less&rdquo; check</span>
            <span className="analogy-target">The guard</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">↩️</span>
            <span className="analogy-label">Full cart sent back</span>
            <span className="analogy-target">Deopt &rarr; Ignition</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔁</span>
            <span className="analogy-label">Lane opens/closes over and over</span>
            <span className="analogy-target">Thrashing</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The key reassurance: deopts never produce wrong answers. The interpreter is always correct for any input;
            the optimized code is just an optimization of the common case with guards. A failed guard means &ldquo;this
            optimization doesn&apos;t apply here&rdquo; &mdash; V8 falls back and carries on. Correctness is never at
            stake; only speed.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Causes, Costs, and Recovery</h2>
        <p className="article-para">
          A deopt happens for a specific reason at a specific guard. Knowing the common triggers and the recovery path
          is how you diagnose and fix performance cliffs.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Type surprise at an operation</h4>
            <p className="theory-desc">
              The classic: <code>+</code> optimized for number+number gets a string. The type guard fails &rarr; deopt.
              Mixing types at a hot call site is the #1 cause.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Shape mismatch on property access</h4>
            <p className="theory-desc">
              Code optimized for one hidden class (Day 3) sees a different shape. The inline-cache guard fails &rarr;
              polymorphic fallback or deopt. Inconsistent construction is the usual culprit.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Array mode change</h4>
            <p className="theory-desc">
              A packed <code>SMI</code> array (small integers) gets a string pushed &rarr; transitions to a different
              array representation. The optimized integer-index path bails.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Optimistic assumptions (overflow, etc.)</h4>
            <p className="theory-desc">
              Some optimizations bet conservatively (e.g., an integer won&apos;t overflow into double-precision). When
              the bet breaks, deopt. Rare but real for arithmetic-heavy code.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The deopt &rarr; recovery cycle</h3>
        <CodeBlock
          code={`// Lifecycle of an optimized function that deopts:
// 1. Hot + stable feedback  → TurboFan compiles → fast machine code
// 2. Surprising input       → guard fails → DEOPT → resume in Ignition
// 3. If input was a one-off → re-tiers to TurboFan again (small hiccup)
// 4. If surprising inputs recur → THRASHING (deopt/opt/deopt...) → slow
//
// Fix: stop the surprises. Stabilize types/shapes at the hot call site.`}
          filename="lifecycle.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">A one-off deopt (acceptable)</span>
            <p className="phase-desc">Brief slowdown, then recovery.</p>
            <ul className="phase-rules">
              <li>Single surprising input in a stream of normal ones</li>
              <li>Function re-optimizes quickly</li>
              <li>Cost: a moment in Ignition + recompile</li>
              <li>Normal, the cost of dynamic flexibility</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Thrashing (a real problem)</span>
            <p className="phase-desc">Repeated deopt/opt &mdash; no steady-state.</p>
            <ul className="phase-rules">
              <li>Surprising input recurs each pass</li>
              <li>Compile cost paid over and over</li>
              <li>Hot loop runs slow permanently</li>
              <li>Fix by stabilizing inputs</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The diagnostic loop: run with <code>--trace-deopt</code>, find the bailout reason and the function, then
            identify what surprising input/shape reaches the hot call site. The fix is almost always &ldquo;stop
            feeding it mixed types or churned shapes&rdquo; &mdash; separate the cases into different functions, or
            normalize inputs before the hot loop.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Deopts Are Accepted</h2>
        <p className="article-para">
          Speculative optimization (Self, ~1990s; HotSpot for Java; V8) made deopts a first-class event: the price of
          betting on the common case. The design philosophy is &ldquo;optimize aggressively, bail safely&rdquo; &mdash;
          the JIT emits the fastest code it can for observed patterns, and accepts that some inputs will invalidate the
          assumptions. Because the interpreter is always correct, deopts cost only speed, never correctness. Early JITs
          were conservative (fewer optimizations, fewer deopts, slower steady-state); modern ones like TurboFan
          speculate aggressively because the common case is fast and the rare deopt is a small, contained cost &mdash;
          except when thrashing, which is why stabilizing hot-path inputs matters.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Optimized (TurboFan)</th>
                <th>Deoptimized (Ignition)</th>
                <th>Thrashing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Correct?</td>
                <td>Yes (guarded)</td>
                <td>Yes (always)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>Fast (native)</td>
                <td>Slower (interpreted)</td>
                <td>Worst (compile+deopt loop)</td>
              </tr>
              <tr>
                <td>When</td>
                <td>Hot + stable feedback</td>
                <td>After a guard fails</td>
                <td>Repeated surprises</td>
              </tr>
              <tr>
                <td>Fix</td>
                <td>(the goal)</td>
                <td>Re-tier when stable</td>
                <td>Stabilize inputs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Deopt and Recovery</h2>

        <CodeBlock
          code={`function double(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i] * 2;
  return sum;
}
// Phase 1: called 1e6 times with number[] → optimized (integer math)
// Phase 2: called once with ["a","b"] → deopt (string * 2 is NaN-ish surprise)
// Phase 3: called 1e6 more times with number[] → re-optimized`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Phase 1 (optimize):</strong> <code>double</code> runs hot with number arrays. Feedback says{' '}
              <code>arr[i]</code> is always SMI, <code>sum</code> stays SMI. TurboFan compiles a tight integer loop.
            </span>
          </li>
          <li>
            <span>
              <strong>Phase 2 (deopt):</strong> <code>["a","b"]</code> arrives. The optimized code&apos;s guard on{' '}
              <code>arr[i]</code> being a number fails on <code>"a"</code>. TurboFan discards the machine code,
              reconstructs interpreter state, and resumes <code>double</code> in Ignition. The result is correct (NaN).
            </span>
          </li>
          <li>
            <span>
              <strong>Brief slowdown:</strong> calls right after the deopt run in Ignition &mdash; slower. Feedback now
              records that strings appeared.
            </span>
          </li>
          <li>
            <span>
              <strong>Phase 3 (re-optimize):</strong> number arrays resume. <code>double</code> gets hot again. Because
              the feedback now shows numbers dominating, TurboFan recompiles &mdash; possibly more cautiously. Steady
              state restored.
            </span>
          </li>
          <li>
            <span>
              If instead strings kept arriving every few calls (thrashing), <code>double</code> would bounce between
              tiers &mdash; paying compile cost repeatedly with no stable fast path. The fix: separate string handling
              into a different function so the hot number path stays monomorphic.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Triggering and viewing a deopt</h3>
        <CodeBlock
          code={`node --trace-deopt -e "
function f(x) { return x + 1; }
for (let i = 0; i < 1e7; i++) f(i);
f('surprise');
"
// Log: [bailout: ... reason: Insufficient type feedback for generic named access]
// (exact reason varies) — the guard on \`x is number\` failed.`}
          filename="trace-deopt.js"
        />

        <h3 className="article-h3">2. The type-mix deopt</h3>
        <CodeBlock
          code={`// BAD — one call site, two types → thrashes
function process(x) { return x + x; }
for (let i = 0; i < 1e6; i++) { process(i); if (i % 100 === 0) process("s"); }
// \`\${i % 100}\` injects strings periodically → repeated deopts.

// GOOD — separate the cases
function processNum(x) { return x + x; }
function processStr(x) { return x + x; }
// Each call site stays monomorphic → no deopt.`}
          filename="type-mix.js"
        />

        <h3 className="article-h3">3. Shape-mismatch deopt</h3>
        <CodeBlock
          code={`function read(o) { return o.value; }
class A { constructor(v) { this.value = v; } }
class B { constructor(v) { this.value = v; this.extra = 0; } }
const mix = [...Array(1e5)].map((_, i) => (i % 2 ? new A(i) : new B(i)));
// \`read\` sees two shapes → polymorphic IC; in tighter cases, a deopt.
// Fix: give A and B the SAME shape (same fields, same order).`}
          filename="shape-mismatch.js"
        />

        <h3 className="article-h3">4. Array mode transition deopt</h3>
        <CodeBlock
          code={`const nums = [1, 2, 3, 4, 5]; // packed SMI array
nums.push("six");          // transitions to a mixed-elements array → deopt for
                            // any code optimized assuming SMI elements
// Keep arrays homogeneous in hot paths. If you must store mixed types, use
// separate arrays per type.`}
          filename="array-mode.js"
        />

        <h3 className="article-h3">5. The <code>try/catch</code> in a hot loop (historical, mostly fixed)</h3>
        <CodeBlock
          code={`// Older V8 deoptimized functions containing try/catch entirely.
// Modern V8 handles this far better, but a try/catch around a very hot
// inner loop can still inhibit some inlining. Move hot loops OUT of
// try/catch when micro-optimizing:
function hot(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += compute(arr[i]); // keep outside TC
  return s;
}`}
          filename="try-catch.js"
        />

        <h3 className="article-h3">6. Normalizing inputs before a hot loop</h3>
        <CodeBlock
          code={`// Coerce once at the boundary so the loop sees one type
function sum(values) {
  let s = 0;
  for (let i = 0; i < values.length; i++) s += Number(values[i]); // normalize
  return s;
}
// Even if \`values\` has strings, \`Number()\` makes each a number before the
// addition — stabilizing the operation's type feedback.`}
          filename="normalize.js"
        />

        <div className="article-callout">
          <p>
            Don&apos;t chase deopts that don&apos;t matter. A one-off deopt on cold code is invisible. Profile (CPU
            profile, <code>--trace-deopt</code>) to find deopts in <em>hot</em> paths, then stabilize those inputs. The
            goal isn&apos;t zero deopts &mdash; it&apos;s no deopts in code that runs millions of times.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Write a hot function, optimize it, then trigger each deopt kind (type mix, shape mismatch, array-mode
            change) and capture the <code>--trace-deopt</code> reason. Then fix each by separating types/shapes and
            confirm the deopt disappears.
          </p>
        </div>

        <CodeBlock
          code={`// 1. Type mix
function f(x) { return x + 1; }
for (let i = 0; i < 1e7; i++) { f(i); if (i === 5e6) f("x"); }
// Run: node --trace-deopt this.js → see the bailout at i===5e6.
// Fix: function fNum(x){return x+1}; call fNum for numbers only.

// 2. Shape mismatch
function g(o) { return o.a; }
class P { constructor(){ this.a=1; this.b=2; } }
class Q { constructor(){ this.a=1; this.b=2; this.c=3; } }
for (let i = 0; i < 1e7; i++) g(i % 2 ? new P() : new Q());
// Fix: make P and Q share the same shape, or separate the call sites.

// 3. Array-mode change
function sum(a) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i]; return s; }
const arr = [1,2,3,4,5];
for (let i = 0; i < 1e6; i++) sum(arr);
arr.push("six");          // mode change
for (let i = 0; i < 1e6; i++) sum(arr); // deopt; runs slower now
// Fix: keep \`arr\` all-numeric; store strings elsewhere.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            After you call <code>f("x")</code> once, why do subsequent <code>f(i)</code> calls eventually run fast again?
            (Because the deopt discarded the old optimized code, but the function gets hot again with number feedback
            dominating, so TurboFan re-optimizes for numbers. The one-off string caused a momentary slowdown, not a
            permanent one &mdash; unless strings keep coming, which is thrashing.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is deoptimization?</h4>
            <p className="iq-a">
              When V8 discards optimized (TurboFan) machine code and falls back to the interpreter (Ignition) because a
              speculative guard failed &mdash; a runtime assumption (type, shape, array mode) was violated. It&apos;s a
              performance event, not a correctness issue: the interpreter always produces correct results; deopt just
              means &ldquo;this optimization no longer applies.&rdquo;
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What causes a deopt?</h4>
            <p className="iq-a">
              A failed guard in optimized code &mdash; an input that violates the speculation. Common causes: a type
              surprise at an operation (number+number optimized, then a string appears), a hidden-class/shape mismatch
              on property access, an array changing element representation (packed SMI &rarr; mixed), or an optimistic
              arithmetic assumption breaking (integer overflow). All reduce to &ldquo;the observed pattern stopped
              holding.&rdquo;
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Is a deopt a bug or a correctness problem?</h4>
            <p className="iq-a">
              Neither. The interpreter is always correct for any input; optimized code is the common-case fast path
              with guards. A failed guard just means the optimization doesn&apos;t apply to this input, so V8 falls
              back to the always-correct interpreter and continues. Results are identical with or without optimization.
              Deopt costs speed only &mdash; never correctness.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is deopt thrashing and why is it bad?</h4>
            <p className="iq-a">
              A repeating deopt/re-optimize cycle: a function gets hot and is optimized, then hits a surprising input
              and deopts, then gets hot and re-optimizes, then deopts again &mdash; indefinitely. The compile cost is
              paid repeatedly with no stable fast path, so the hot loop runs slow permanently. The fix is to stabilize
              inputs (separate the surprising case into a different function) so the speculation holds.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). How do you detect and diagnose a deopt?</h4>
            <p className="iq-a">
              Run with <code>node --trace-deopt</code> (or Chrome DevTools&rsquo; performance/JS profiler) to log each
              bailout with the function and reason. A CPU profile showing time in a function that &ldquo;should&rdquo;{' '}
              be fast is a clue. Then inspect the deopt reason (e.g., &ldquo;Insufficient type feedback,&rdquo;
              &ldquo;wrong map,&rdquo; &ldquo;hole/&quot;&quot;) and identify the surprising input/shape reaching the
              hot call site. The fix is almost always stabilizing that input.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How would you fix a hot loop that thrashes due to mixed types?</h4>
            <p className="iq-a">
              Separate the cases so each call site stays monomorphic. Split into two functions (e.g.,{' '}
              <code>processNum</code> and <code>processStr</code>) and route each input to the matching one, so neither
              site sees mixed types. Alternatively, normalize inputs at the boundary (coerce strings to numbers before
              the loop). The goal: a single consistent type flows through the hot path, so TurboFan&apos;s speculation
              holds and there&apos;s no deopt.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). A hot numeric loop runs 5&times; slower after a refactor that added a feature. How do you investigate whether a deopt is the cause?</h4>
            <p className="iq-a">
              (1) Confirm a regression with a benchmark before/after the refactor. (2) Run with{' '}
              <code>--trace-deopt --trace-opt</code> and look for a <code>[bailout]</code> in the loop&apos;s function
              right when slowdown begins &mdash; the reason names the cause (type, map, elements kind). (3) Check{' '}
              <code>--trace-opt</code> for re-optimization attempts; if they immediately deopt again, it&apos;s
              thrashing. (4) Inspect what changed: the refactor likely introduced a new input type, a property added
              inconsistently (shape churn), an array that now holds mixed types, or a <code>delete</code> forcing
              dictionary mode. (5) Verify the hypothesis by reverting each piece. Common fixes: keep arrays
              homogeneous, ensure objects are constructed with identical shapes, route mixed inputs to separate
              monomorphic functions, and avoid <code>delete</code>/<code>arguments</code> leaks in hot paths. The
              investigation is driven by the deopt reason &mdash; it pinpoints which speculation broke.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
