import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('js-engine-internals')!
const navItems = weekNav(week)

export default function EngineDay7() {
  const { prev } = dayNavLinks(week, 7)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[6].title}</h1>
        <p className="lesson-subtitle">
          One week, condensed. Then ten problems across pipeline, JIT, hidden classes, deopts, and the spec &mdash; the
          capstone of &ldquo;how JS runs.&rdquo;
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A compressed review of the week &mdash; the V8 pipeline, Ignition &amp; TurboFan, hidden classes &amp;
            inline caching, deoptimization, stack vs heap, and reading ECMA-262 &mdash; followed by hard problems and
            a self-assessment.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Memorize the cheat sheet, then attempt each problem cold. These connect every layer: a single question may
            need the pipeline, shape stability, and the spec together.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            End of Week 7. If you can solve 7 of 10 cold and explain the layers, you&apos;re ready for Week 8
            (Consolidation &amp; Hard Problems).
          </p>
        </div>
      </div>

      {/* ── Cheat Sheet ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Week 7 Cheat Sheet</h2>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">V8 pipeline</h4>
            <p className="theory-desc">source &rarr; parse (AST) &rarr; Ignition bytecode &rarr; (hot) TurboFan machine code. Tiering: interpret immediately, optimize lazily where it pays off.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Ignition &amp; TurboFan</h4>
            <p className="theory-desc">Ignition = bytecode interpreter (baseline, runs all code, collects type feedback). TurboFan = optimizing JIT that speculates on feedback with guards. Monomorphic &gt; polymorphic &gt; megamorphic.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Hidden classes &amp; ICs</h4>
            <p className="theory-desc">Every object has a hidden class recording its property layout. Same construction order &rarr; shared shape. Inline caches memoize offsets per call site. <code>delete</code>/dynamic keys &rarr; dictionary mode (slow).</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Deoptimization</h4>
            <p className="theory-desc">A failed guard (type/shape surprise) discards optimized code, falls back to Ignition. Always correct; costs speed. Thrashing = repeated deopt/opt = slow hot loop; fix by stabilizing inputs.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Stack vs heap</h4>
            <p className="theory-desc">Stack = call frames, primitives + references, automatic, bounded (overflow). Heap = objects + closure environments, GC-managed, lifetime = reachability. Primitives by value, objects by reference (reference copied on assign).</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Reading the spec</h4>
            <p className="theory-desc">ECMA-262 defines behavior as abstract operations (numbered steps) using spec types (Records, Completion Records). The authoritative source; MDN explains it. Resolve edge cases by following operations recursively.</p>
          </div>
        </div>
      </section>

      {/* ── Common Traps ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Seven Traps</h2>
        <p className="article-para">
          These recur in performance work and interviews. Recognize the shape.
        </p>

        <ol className="article-ol">
          <li><strong>Mixing types in a hot call site</strong> &mdash; polymorphic/deopt (Day 2/4).</li>
          <li><strong>Constructing objects inconsistently</strong> &mdash; fragmented shapes, slow ICs (Day 3).</li>
          <li><strong><code>delete</code> on properties</strong> &mdash; forces dictionary mode (Day 3).</li>
          <li><strong>Reassigning a parameter expecting caller change</strong> &mdash; references are by value (Day 5).</li>
          <li><strong>Deep recursion</strong> &mdash; stack overflow (Day 5).</li>
          <li><strong>Assuming JIT = always fast</strong> &mdash; cold code runs interpreted; deopts undo optimization (Day 1/4).</li>
          <li><strong>Trusting blog over spec for edge cases</strong> &mdash; the spec is the definition (Day 6).</li>
        </ol>
      </section>

      {/* ── Hard Problems ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Hard Problems</h2>
        <p className="article-para">
          Attempt each before reading the answer. These tie the language to the engine that runs it.
        </p>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 1. Order the V8 pipeline stages.</h4>
          <p className="iq-a">
            <strong>source &rarr; parse &rarr; AST &rarr; Ignition bytecode &rarr; (interpreter runs + collects feedback) &rarr; TurboFan machine code (if hot)</strong>. Each stage loses detail and gains speed; tiering means cold code lives in the interpreter and only hot code pays the optimize cost.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 2. Why is a function slow right after a deopt?</h4>
          <CodeBlock
            code={`function f(x) { return x + 1; }
for (let i = 0; i < 1e7; i++) f(i);
f("boom");                              // deopt
for (let i = 0; i < 1e6; i++) f(i);     // slower than before?`}
            filename="p2.js"
          />
          <p className="iq-a">
            After <code>f("boom")</code> the optimized machine code is discarded; the next million calls run in Ignition
            (the interpreter) until <code>f</code> crosses the heat threshold again and TurboFan recompiles. That
            re-takeoff window is the slowdown. If numbers dominate again, it re-optimizes and speed returns. The string
            caused a temporary tier-down.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 3. Which runs faster, and why?</h4>
          <CodeBlock
            code={`// A:
const a = [], b = [];
for (let i = 0; i < 1e5; i++) { a.push({x:1, y:2}); b.push({x:1, y:2}); }
// B:
const a = [], b = [];
for (let i = 0; i < 1e5; i++) { a.push({x:1, y:2}); b.push({y:2, x:1}); }`}
            filename="p3.js"
          />
          <p className="iq-a">
            A is faster. In A, all objects share one hidden class ({`{x,y}`} order). In B, <code>b</code>&apos;s objects
            have a <em>different</em> shape ({`{y,x}`}) than <code>a</code>&apos;s ({`{x,y}`}), so any code reading
            <code> .x</code> across both sees two shapes &mdash; polymorphic inline caches with dispatch overhead. Same
            property set, different construction order, different (slower) optimization.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 4. Output &mdash; by value vs by reference.</h4>
          <CodeBlock
            code={`let p = { n: 1 };
const q = p;
q.n = 2;
function reset(o) { o = { n: 0 }; }
reset(p);
console.log(p.n);`}
            filename="p4.js"
          />
          <p className="iq-a">
            <code>2</code>. <code>q = p</code> copies the reference &mdash; <code>q.n = 2</code> mutates the shared
            object, so <code>p.n</code> is 2. <code>reset(p)</code> receives a copy of the reference; rebinding its
            local <code>o</code> to a new object does <em>not</em> affect <code>p</code> (JS has no output parameters).
            So <code>p.n</code> stays 2.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 5. What happens here, engine-wise?</h4>
          <CodeBlock
            code={`const o = { a: 1, b: 2, c: 3 };
for (let i = 0; i < 1e7; i++) o.a;
delete o.b;
for (let i = 0; i < 1e7; i++) o.a;`}
            filename="p5.js"
          />
          <p className="iq-a">
            After <code>delete o.b</code>, V8 transitions <code>o</code> to <strong>dictionary mode</strong> (its shape
            is no longer a clean hidden-class chain). The second loop&apos;s <code>o.a</code> reads now go through a
            hash-table lookup instead of a direct offset load &mdash; significantly slower than the first loop. The fix
            in hot code: set <code>o.b = undefined</code> (preserves the shape) instead of deleting.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 6. A hot loop is 5&times; slower than expected. How do you investigate with engine tools?</h4>
          <p className="iq-a">
            (1) Benchmark to confirm the regression. (2) Run <code>node --trace-opt --trace-deopt</code> and look for a{' '}
            <code>[bailout]</code> in the loop&apos;s function &mdash; the reason names the cause (wrong map, type
            surprise, elements-kind change). (3) If no deopt, check whether the function optimized at all (no{' '}
            <code>[optimizing]</code> line &rarr; maybe never got hot, or hit an optimization blocker like{' '}
            <code>arguments</code> leak / <code>with</code> / <code>try</code> around the inner loop). (4) Inspect for
            shape churn (objects built inconsistently &rarr; polymorphic ICs), type mixing (numbers+strings through one{' '}
            <code>+</code>), or <code>delete</code> forcing dictionary mode. (5) Fix the root cause (separate types,
            stabilize shapes, avoid <code>delete</code>) and confirm speed returns. The deopt reason pinpoints which
            speculation broke.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 7. Trace <code>{'{} + []'}</code> from the spec.</h4>
          <p className="iq-a">
            (1) <code>+</code> calls <code>ToPrimitive</code> on both operands with hint number. (2) RHS{' '}
            <code>[]</code>: <code>[].valueOf()</code> returns <code>[]</code> (not primitive) &rarr;{' '}
            <code>[].toString()</code> &rarr; <code>""</code>. (3) LHS <code>{'{}'}</code>: <code>({}).valueOf()</code>{' '}
            returns the object &rarr; <code>({}).toString()</code> &rarr; <code>"[object Object]"</code>. (4) The{' '}
            <code>+</code> rule: if either operand after <code>ToPrimitive</code> is a string, concatenate &rarr;{' '}
            <code>"[object Object]" + ""</code> &rarr; <code>"[object Object]"</code>. (In a real JS console, leading{' '}
            <code>{'{}'}</code> may parse as a block statement, giving a different result &mdash; wrap in{' '}
            <code>({`{}`})</code> to force expression context.)
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 8. Why does a closure keep a variable alive, engine-wise?</h4>
          <p className="iq-a">
            A closure references its lexical environment, which holds the captured variables. When the closure outlives
            the call that created it (returned, stored), V8 <strong>escapes</strong> that environment to the heap &mdash;
            it&apos;s no longer tied to the (popped) stack frame. As long as the closure is reachable (a root), the heap
            environment (and its variables) is reachable, so the GC can&apos;t reclaim it. Stack variables die with
            their frame; only by escaping to the heap via a closure do they persist. This is the engine truth behind
            Week 2 Day 1.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 9. Write JIT-friendly code for a hot numeric pipeline.</h4>
          <CodeBlock
            code={`// Stable shapes, homogeneous arrays, monomorphic call sites, no delete
class Vec { constructor(x, y) { this.x = x; this.y = y; } } // uniform shape
function sum(vs) {
  let s = 0;
  for (let i = 0; i < vs.length; i++) s += vs[i].x + vs[i].y; // numbers only
  return s;
}
const vs = Array.from({ length: 1e6 }, (_, i) => new Vec(i, i + 1));
for (let i = 0; i < 100; i++) sum(vs); // hot, monomorphic, fast`}
            filename="p9.js"
          />
          <p className="iq-a">
            All <code>Vec</code>s share one hidden class; <code>vs</code> is a homogeneous packed array of them;{' '}
            <code>sum</code> sees one type/shape at every call site &rarr; monomorphic ICs, TurboFan inlines and
            optimizes the integer loop. Contrast with churning shapes, mixing <code>Vec</code> and ad-hoc{' '}
            <code>{'{x,y}'}</code> literals, or pushing strings into <code>vs</code> &mdash; each would polymorphize or
            deopt. The discipline: consistent construction, homogeneous data, no <code>delete</code>, in hot paths only.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 10. Combine everything: explain why a specific refactor sped up code, across all layers.</h4>
          <CodeBlock
            code={`// BEFORE: mixing types → polymorphic + occasional deopt
function process(items) { let s = 0; for (const it of items) s += it.value; return s; }
const items = data.map((d) => d.kind === "num" ? { value: d.n } : { value: d.s });

// AFTER: separate paths, homogeneous
function processNums(nums) { let s = 0; for (const n of nums) s += n.value; return s; }
const nums = data.filter((d) => d.kind === "num").map((d) => ({ value: d.n }));`}
            filename="p10.js"
          />
          <p className="iq-a">
            The refactor helps across layers: (1) <strong>shapes</strong> &mdash; <code>nums</code> is a homogeneous
            array of {`{value:number}`} objects sharing one hidden class &rarr; monomorphic inline caches on{' '}
            <code>it.value</code>; before, mixed value types fragmented shapes. (2) <strong>speculation</strong> &mdash;
            <code>processNums</code>&apos;s <code>+=</code> sees only numbers &rarr; TurboFan emits a tight integer
            loop with no guards firing; before, strings triggered deopts. (3) <strong>no thrashing</strong> &mdash; the
            monomorphic path stabilizes, so optimization persists. One refactor, three engine mechanisms (hidden
            classes, ICs, speculative JIT) all aligning toward the fast path. That&apos;s the practical payoff of
            understanding the pipeline.
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
            <li>I can name the V8 pipeline stages in order and what each does.</li>
            <li>I can explain why V8 tiers (interpreter + optimizer) instead of one or the other.</li>
            <li>I can explain speculation, guards, and why a deopt happens.</li>
            <li>I know the difference between monomorphic, polymorphic, and megamorphic.</li>
            <li>I can explain hidden classes and how construction order affects them.</li>
            <li>I know what inline caches do and why shape stability helps them.</li>
            <li>I can describe the deopt &rarr; recovery cycle and what thrashing is.</li>
            <li>I can explain stack vs heap and &ldquo;by value vs by reference&rdquo; from first principles.</li>
            <li>I can explain why closures keep variables alive (heap escape).</li>
            <li>I can locate and read a behavior in ECMA-262, following abstract operations.</li>
          </ul>

          <p style={{ marginTop: '1rem' }}>
            <strong>Ready for Week 8?</strong> The final week is consolidation: re-implementing <code>Promise</code>,{' '}
            <code>new</code>, <code>call</code>/<code>apply</code>/<code>bind</code>, and an event emitter from scratch
            &mdash; proving you understand each by building it &mdash; plus ten hard interview problems. Everything from
            all seven weeks converges: you&apos;ll use the spec (Day 6), prototypes (Week 3), closures (Week 2), and the
            async model (Week 4) to build the primitives you&apos;ve been using.
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
          code={`// From a blank file / terminal, in order:
// 1. Draw the V8 pipeline (source → AST → bytecode → machine code).
// 2. Write a hot loop; trigger a deopt; capture --trace-deopt output.
// 3. Construct 1e5 objects two ways (consistent vs random order); benchmark
//    property reads; explain the difference via hidden classes.
// 4. Demonstrate by-value vs by-reference with primitives and objects.
// 5. Write a closure that retains a variable; explain the heap escape.
// 6. From the spec, trace why \`[] == ![]\` is true (name each operation).
// 7. List 5 JIT-friendly code habits and when they matter (hot code only).

// Then solve Problems 3, 6, and 10 on paper, naming every layer involved.`}
          filename="final-practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Why paper matters</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Senior interviews test whether you understand <em>why</em> code is fast or slow &mdash; predicting
            optimization, deopts, and shape effects from reading code. Doing it cold on paper proves the engine mental
            models are internalized, not memorized tool output.
          </p>
        </div>
      </section>

      {/* ── Bridge to Week 8 ──────────────────────────────── */}
      <section className="day-section">
        <div className="week-bridge">
          <p>
            Week 7 complete. You now understand <strong>how JavaScript runs</strong> &mdash; the parse/bytecode/JIT
            pipeline, hidden classes and inline caching, speculative optimization and deopts, the stack/heap memory
            model, and how to read the spec that defines it all. <strong>Week 8 (Consolidation &amp; Hard
            Problems)</strong> is the capstone: re-implementing core primitives (<code>Promise</code>, <code>new</code>,
            <code> call/apply/bind</code>, an event emitter) from scratch and solving ten hard interview problems.
            Every concept from all seven weeks comes together &mdash; you&apos;ll build the things you&apos;ve been
            using, proving mastery from first principles.
          </p>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
