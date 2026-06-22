import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('js-engine-internals')!
const navItems = weekNav(week)

export default function EngineDay1() {
  const { next } = dayNavLinks(week, 1)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[0].title}</h1>
        <p className="lesson-subtitle">
          Your source code never runs directly. It becomes a tree, then bytecode, then machine code &mdash; with a JIT
          deciding when the upgrade is worth it.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            V8 (Chrome/Node) executes JavaScript in a pipeline: <strong>source &rarr; tokens &rarr; AST &rarr; Ignition
            bytecode &rarr; (TurboFan) optimized machine code</strong>. Each stage trades detail for speed.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            The parser builds an <strong>AST</strong> (the program&apos;s structure). <strong>Ignition</strong> compiles
            it to bytecode and runs it via an interpreter &mdash; fast to start. <strong>TurboFan</strong> later
            recompiles <em>hot</em> functions to optimized machine code based on observed types.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always, transparently. You never invoke the stages &mdash; but knowing them explains why &ldquo;shape
            stability&rdquo; matters (Day 3), why JITs bail (Day 4), and why loosely-typed code can be slower than
            type-stable code.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          For six weeks you&apos;ve learned what JavaScript <em>does</em>. This week you learn what the engine{' '}
          <em>does with it</em>. Your <code>.js</code> file is not what the CPU runs. Before a single instruction
          executes, V8 transforms it through a pipeline that turns text into a tree, a tree into bytecode, and &mdash;
          for hot code &mdash; bytecode into highly optimized machine code.
        </p>

        <CodeBlock
          code={`// You write:
function add(a, b) { return a + b; }

// V8 sees, roughly:
// 1. text → tokens:  [function, add, (, a, ,, b, ), {, return, a, +, b, }, ...]
// 2. tokens → AST:   FunctionDeclaration("add", [a, b], BinaryExpr(+, a, b))
// 3. AST → bytecode: Ldar a; Star r0; Ldar b; Add r0; Return;
// 4. bytecode → machine code (if hot): add rax, rbx; ret`}
          filename="pipeline.js"
        />

        <p className="article-para">
          Each stage loses information and gains speed: the AST is precise but slow to walk; bytecode is compact and
          portable; machine code is the fastest but takes effort to produce. The genius of the JIT (&ldquo;Just In
          Time&rdquo;) compiler is <em>tiering</em> &mdash; start with the cheap interpreter, then invest in machine
          code only for functions that earn it.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">AST (Abstract Syntax Tree)</dt>
            <dd className="def-text">
              A tree representing the syntactic structure of your code &mdash; functions as nodes, operators as branches.
              The parser&apos;s output; analyzed but never directly executed.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Bytecode (Ignition)</dt>
            <dd className="def-text">
              A compact, portable instruction set V8 runs on an interpreter (Ignition). Fast to generate, fast enough to
              run, and the unit the JIT optimizes from. The &ldquo;baseline&rdquo; tier.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">JIT compiler (TurboFan)</dt>
            <dd className="def-text">
              &ldquo;Just In Time&rdquo; &mdash; compiles hot bytecode to optimized machine code <em>during</em>
              execution, using observed type feedback to specialize. The optimizing tier.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Type feedback</dt>
            <dd className="def-text">
              Runtime observations (argument types, object shapes) the JIT records while the interpreter runs. Used to
              generate specialized machine code &mdash; and the thing that, when violated, triggers deoptimization (Day
              4).
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Kitchen Translation Analogy</h2>
        <p className="article-para">
          Imagine cooking from a recipe written in a foreign language. First you <strong>read the words</strong> (parse
          &rarr; tokens). Then you build a <strong>mental picture of the steps</strong> (the AST). Then you translate
          each step into <strong>simple instructions you can do quickly</strong> (bytecode &mdash; &ldquo;chop the
          onion&rdquo;). And for a dish you cook every day, eventually you stop reading at all &mdash; you&apos;ve{' '}
          <strong>memorized the fastest way</strong> (machine code). The JIT is the memorization: it only invests the
          effort for dishes you cook often.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">📖</span>
            <span className="analogy-label">Reading the words</span>
            <span className="analogy-target">Lexing / parsing</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧠</span>
            <span className="analogy-label">Mental picture of steps</span>
            <span className="analogy-target">The AST</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">Translated instructions</span>
            <span className="analogy-target">Ignition bytecode</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">⚡</span>
            <span className="analogy-label">Memorized, fastest version</span>
            <span className="analogy-target">TurboFan machine code</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The tiering is the whole strategy: <strong>interpret immediately</strong> so the program starts fast, then{' '}
            <strong>optimize lazily</strong> only where the investment pays off. A function called once costs zero
            compile time; a function called a million times gets machine code and runs far faster. The JIT bets on the
            future using the past.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Pipeline Stages</h2>
        <p className="article-para">
          Four stages, each with a clear job. Understanding what each preserves and discards is the key to writing
          JIT-friendly code.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Parse: source &rarr; AST</h4>
            <p className="theory-desc">
              The parser (<strong>scanner</strong> tokenizes, then <strong>parser</strong> builds the AST). It validates
              syntax and produces a structural representation. V8 uses a parallel <strong>lazy parsing</strong> strategy
              &mdash; functions are fully parsed only when first executed, speeding startup.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Compile: AST &rarr; bytecode (Ignition)</h4>
            <p className="theory-desc">
              Ignition compiles the AST into bytecode &mdash; a register-machine instruction set. Bytecode runs on an
              interpreter: fast to generate, portable, memory-efficient. This is the baseline tier that runs your code
              immediately.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Execute + profile (type feedback)</h4>
            <p className="theory-desc">
              While Ignition runs the bytecode, it records <strong>type feedback</strong>: what types flowed through
              each operation, what shapes objects had. This is the raw data the optimizer uses to specialize.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Optimize: bytecode &rarr; machine code (TurboFan)</h4>
            <p className="theory-desc">
              When a function gets <strong>hot</strong> (called many times), TurboFan recompiles it to optimized machine
              code, using the type feedback to emit type-specific fast paths. Now it runs at near-C speed &mdash; until
              the feedback is violated (deopt, Day 4).
            </p>
          </div>
        </div>

        <h3 className="article-h3">Why tiering beats a single strategy</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Interpreter only (no JIT)</span>
            <p className="phase-desc">Fast startup, slow steady-state.</p>
            <ul className="phase-rules">
              <li>No compile cost &mdash; runs immediately</li>
              <li>Each operation interpreted per-call</li>
              <li>~5&ndash;10&times; slower for hot loops</li>
              <li>Old interpreters, some embedded engines</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Ahead-of-time compile only</span>
            <p className="phase-desc">Fast steady-state, slow startup.</p>
            <ul className="phase-rules">
              <li>Optimize everything up front</li>
              <li>Long startup delay before first run</li>
              <li>No runtime specialization</li>
              <li>Pays for code that never runs</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The tiered JIT gets the best of both: <strong>start in the interpreter</strong> (instant startup),{' '}
            <strong>promote hot code to machine code</strong> (fast steady-state). It optimizes <em>only what
            matters</em>, using real runtime data (type feedback) to specialize &mdash; something ahead-of-time
            compilers can&apos;t do for a dynamically-typed language. This is why JS, despite being dynamic, can run
            near native speed for hot code.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; the JIT Revolution</h2>
        <p className="article-para">
          Early JS engines (1990s&ndash;2000s) were pure interpreters &mdash; simple but slow, fine for the trivial
          scripts of the era. As web apps grew complex, performance became critical. V8 (2008) changed the game by
          compiling straight to machine code with a JIT, making JS competitive with native for the first time and
          enabling Node.js (2009). The modern multi-tier pipeline (Ignition interpreter + TurboFan optimizer, ~2017)
          refined this: it turned out a fast interpreter feeding a smart optimizer beats full-codegen everywhere. The
          arc: pure interpretation &rarr; full JIT &rarr; tiered interpreter+JIT &mdash; converging on the
          cost-benefit balance of tiering.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Interpreter</th>
                <th>Baseline JIT</th>
                <th>Optimizing JIT (TurboFan)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Output</td>
                <td>Walks AST / runs bytecode</td>
                <td>Light machine code</td>
                <td>Heavily optimized machine code</td>
              </tr>
              <tr>
                <td>Startup cost</td>
                <td>None</td>
                <td>Low</td>
                <td>High</td>
              </tr>
              <tr>
                <td>Steady-state speed</td>
                <td>Slow</td>
                <td>Medium</td>
                <td>Fast (near native)</td>
              </tr>
              <tr>
                <td>Uses type feedback?</td>
                <td>Collects it</td>
                <td>Somewhat</td>
                <td>Yes (specializes)</td>
              </tr>
              <tr>
                <td>When used</td>
                <td>Always (first tier)</td>
                <td>Warm code</td>
                <td>Hot code</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A Function Through the Pipeline</h2>

        <CodeBlock
          code={`function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) total += arr[i];
  return total;
}
// Called 10 million times with arrays of numbers.`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Parse:</strong> V8 tokenizes the source and builds the AST for <code>sum</code> &mdash; a
              FunctionDeclaration with a loop body. (Lazy parsing may defer full parsing of nested functions until
              called.)
            </span>
          </li>
          <li>
            <span>
              <strong>Compile to bytecode:</strong> Ignition turns the AST into bytecode &mdash; <code>Ldar</code>/{' '}
              <code>Star</code>/<code>Add</code>/<code>Jump</code> ops. <code>sum</code> now runs, interpreted. The first
              few calls execute here.
            </span>
          </li>
          <li>
            <span>
              <strong>Profile while running:</strong> as <code>sum</code> is called repeatedly, Ignition records type
              feedback: <code>arr</code> is always a packed array of <code>SMI</code>s (small integers);{' '}
              <code>total</code> stays a number; <code>length</code> is an integer. No surprises.
            </span>
          </li>
          <li>
            <span>
              <strong>Promote (get hot):</strong> after many invocations, TurboFan takes over. It reads the feedback
              and emits specialized machine code: an integer loop using direct array indexing &mdash; no type checks,
              no bounds-check overhead beyond the minimum. <code>sum</code> now runs at near-C speed.
            </span>
          </li>
          <li>
            <span>
              <strong>Watch for surprises:</strong> if a later call passes an array of strings, the feedback is
              violated &mdash; TurboFan <strong>deoptimizes</strong> (Day 4): throws out the machine code, falls back
              to bytecode, and (if it stabilizes) re-optimizes with broader assumptions.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Seeing the bytecode (Node)</h3>
        <CodeBlock
          code={`// Print Ignition bytecode for a function:
node --print-bytecode -e "function add(a,b){return a+b} add(1,2)"
// Output shows Ldar/Star/Add/Return ops — the interpreter's instructions,
// not your source. This is what actually runs before optimization.`}
          filename="print-bytecode.js"
        />

        <h3 className="article-h3">2. Seeing optimization/deopt logs</h3>
        <CodeBlock
          code={`// Trace TurboFan optimization decisions:
node --trace-opt --trace-deopt app.js
// Logs when functions are optimized (\`optimizing\`) and when they bail
// (\`deoptimizing\` + the reason). The fastest code stays optimized.`}
          filename="trace-opt.js"
        />

        <h3 className="article-h3">3. Monomorphic vs polymorphic (preview of Day 3)</h3>
        <CodeBlock
          code={`// MONOMORPHIC — always same shape: optimizes great
function doubleArr(arr) { let r = 0; for (let i = 0; i < arr.length; i++) r += arr[i]; return r; }
for (let i = 0; i < 1e6; i++) doubleArr([1, 2, 3]); // always number[] → fast

// POLYMORPHIC — varying types: harder to optimize
function add(a, b) { return a + b; }
for (let i = 0; i < 1e6; i++) { add(1, 2); add("a", "b"); } // mixes number and string
// The JIT can't pick one fast path; it emits a slower dispatch.`}
          filename="poly-mono.js"
        />

        <h3 className="article-h3">4. Lazy parsing speeds startup</h3>
        <CodeBlock
          code={`// V8 lazily parses functions until they're called:
function app() {
  function neverCalled() { /* huge body */ }  // parsed lazily — skipped at startup
  function used() { return 1; }                // fully parsed only when app() runs
  return used();
}
app(); // \`neverCalled\` is never fully parsed → faster startup`}
          filename="lazy-parse.js"
        />

        <h3 className="article-h3">5. Why hot loops matter</h3>
        <CodeBlock
          code={`// A function called once never gets optimized — no payoff:
function once() { /* 1000 lines */ }
once(); // runs in interpreter, that's fine

// A function in a hot loop is worth optimizing:
for (let i = 0; i < 1e7; i++) hot(i); // TurboFan compiles \`hot\` to machine code
// The compile cost (~ms) is amortized across millions of fast calls.`}
          filename="hot-loop.js"
        />

        <div className="article-callout">
          <p>
            The practical takeaway: <strong>write code that&apos;s easy to optimize</strong> &mdash; consistent types,
            stable object shapes (Day 3), and no mid-stream type surprises (Day 4). You don&apos;t micro-optimize; you
            avoid the patterns that defeat the JIT. The engine does the hard work if you don&apos;t fight it.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Use Node&apos;s flags to observe the pipeline: print the bytecode for a small function
            (<code>--print-bytecode</code>), then trace optimization on a hot loop (<code>--trace-opt</code>). Pass it
            mixed types and watch it deoptimize (<code>--trace-deopt</code>). Connect each log line to a pipeline stage.
          </p>
        </div>

        <CodeBlock
          code={`// 1. See bytecode
node --print-bytecode -e "function f(a,b){return a+b} f(1,2)"
//    → look for Ldar/Star/Add/Return ops (Ignition's instructions).

// 2. See optimization
node --trace-opt -e "function f(x){return x+1} for(let i=0;i<1e7;i++)f(i)"
//    → \`[optimizing]\` line appears once f gets hot.

// 3. See deoptimization
node --trace-deopt -e "function f(x){return x+1} for(let i=0;i<1e7;i++){f(i); if(i===5e6)f('a')}"
//    → \`[bailout]\` line: f was optimized for numbers, then got a string.
//      V8 falls back to bytecode; if it stabilizes, re-optimizes.

// Connect each log to: parse (always), bytecode (always), optimize (hot),
// deopt (feedback violated). The pipeline made visible.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does the deopt happen at <code>i===5e6</code> and not at <code>i===1</code>? (Because TurboFan only
            compiles <code>f</code> after it&apos;s been called many times &mdash; it observed only numbers in the
            feedback. The first string at <code>5e6</code> violates that feedback, triggering the bailout. Before
            optimization, the interpreter handles any type happily; the deopt is purely a JIT-tier phenomenon.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Walk through how V8 executes JavaScript.</h4>
            <p className="iq-a">
              Source is parsed into an AST, which Ignition compiles to bytecode and runs via an interpreter (fast
              startup). While running, V8 collects type feedback. When a function becomes hot (called many times),
              TurboFan recompiles its bytecode into optimized machine code using that feedback, yielding near-native
              speed. If a later call violates the feedback, it deoptimizes back to bytecode. The tiered pipeline trades
              startup cost for steady-state speed only where it pays off.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is an AST and what is it for?</h4>
            <p className="iq-a">
              An Abstract Syntax Tree &mdash; a tree representation of the syntactic structure of your code (functions,
              operators, and statements as nodes). The parser builds it from tokens; it captures the program&apos;s
              structure so subsequent stages can compile it. The AST is never directly executed; it&apos;s the input to
              bytecode generation.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is a JIT compiler and why use one?</h4>
            <p className="iq-a">
              &ldquo;Just In Time&rdquo; &mdash; compiles code to machine code during execution rather than ahead of
              time. For a dynamic language like JS, this lets the compiler use <em>runtime type feedback</em> to
              specialize code (it knows what types actually flow through). It tiering-starts in an interpreter (cheap
              startup) and optimizes only hot code (amortizing compile cost). The result: dynamic JS runs near native
              speed for hot paths.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why does V8 have both an interpreter (Ignition) and an optimizer (TurboFan)?</h4>
            <p className="iq-a">
              Tiering gets the best of both. The interpreter runs immediately with no compile cost &mdash; great for
              startup and for code that runs few times. The optimizer invests in machine code only for hot functions,
              where the compile cost is amortized across millions of fast calls. Optimizing everything up front would
              slow startup and waste effort on cold code; interpreting everything would leave hot loops slow. The two
              tiers cover both regimes.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What is type feedback and why is it central to the JIT?</h4>
            <p className="iq-a">
              Runtime observations the interpreter records as code runs &mdash; what types each operation saw, what
              shapes objects had. TurboFan uses this feedback to emit specialized machine code (e.g., &ldquo;this{' '}
              <code>+</code> is always number+number, so emit an integer add&rdquo;). It&apos;s central because it lets
              a dynamic language be optimized like a static one &mdash; and it&apos;s exactly what, when violated,
              triggers deoptimization (Day 4).
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What is lazy parsing and why does it help?</h4>
            <p className="iq-a">
              V8 fully parses a function only when it&apos;s first called, not when it&apos;s defined. For large apps
              where much code is unused at startup (or only runs later), this skips parsing work that&apos;s not yet
              needed &mdash; significantly speeding initial load. The trade-off: a brief parsing pause the first time a
              function runs. Most apps benefit because not every function executes immediately.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Why can a JIT be faster than ahead-of-time compilation for a dynamic language?</h4>
            <p className="iq-a">
              For a statically-typed language, ahead-of-time (AOT) compilation has all the type information it needs up
              front and is hard to beat. But JavaScript is dynamically typed &mdash; an AOT compiler can&apos;t know
              what types will flow through an operation, so it must emit generic, defensive code (type checks on every{' '}
              <code>+</code>, every property access). A JIT, compiling at runtime, sees the actual types via feedback
              and can specialize: a <code>+</code> that&apos;s always number+number becomes a single integer-add
              instruction with no checks. Specialization against real usage beats generic correctness. The cost is the
              tiering machinery and the risk of deopt when assumptions break &mdash; but for hot code in dynamic
              languages, the JIT&apos;s runtime specialization wins. This is why V8 can approach native speed for JS
              despite JS being dynamically typed.
            </p>
          </div>
        </div>
      </section>

      <DayNav next={next} />
    </ContentLayout>
  )
}
