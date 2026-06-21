import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('advanced-patterns')!
const navItems = weekNav(week)

export default function AdvancedDay1() {
  const { next } = dayNavLinks(week, 1)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[0].title}</h1>
        <p className="lesson-subtitle">
          Three primitives that turn scattered logic into pipelines. Currying prepares, composition connects, and
          point-free gets out of the way.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>Currying</strong> turns a multi-argument function into a chain of single-argument functions.
            <strong> Composition</strong> (<code>compose</code>/<code>pipe</code>) wires functions together so the
            output of one feeds the next. <strong>Point-free</strong> style omits the data argument when it&apos;s
            obvious.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            A curried <code>f(a, b, c)</code> is called as <code>f(a)(b)(c)</code>.{' '}
            <code>{'compose(f, g, h)(x) === f(g(h(x)))'}</code> runs right-to-left;{' '}
            <code>pipe</code> is the same left-to-right. Both reduce by threading one value through many transforms.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            When transforming data through several steps &mdash; map/filter pipelines, formatters, validators.
            Currying shines for partial application and config reuse; composition for readability of multi-step
            transforms.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          You already write pipelines: <code>data.map(f).filter(g).reduce(h)</code>. Today we extract the idea behind
          that chain &mdash; <em>feeding one function&apos;s output into the next</em> &mdash; into reusable
          primitives. The payoff: pipelines that read as a sentence, with steps you can swap, reorder, and test in
          isolation.
        </p>

        <CodeBlock
          code={`// Imperative, step by step:
const result = [];
for (const u of users) {
  const upper = u.name.toUpperCase();
  if (upper.length > 3) result.push(upper);
}

// The same idea as a composed pipeline:
const longNames = pipe(
  (users) => users.map((u) => u.name.toUpperCase()),
  (names) => names.filter((n) => n.length > 3)
);
longNames(users);`}
          filename="intro.js"
        />

        <p className="article-para">
          The pipeline version names the transformation once and applies it. Add currying and you can pre-fill
          arguments (<code>filter(greaterThan(3))</code>), turning config into a building block. This is the heart of
          functional JavaScript &mdash; small, generic, reusable pieces.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Currying</dt>
            <dd className="def-text">
              Transforming <code>f(a, b, c)</code> into <code>f(a)(b)(c)</code> &mdash; a series of functions that
              each take one argument and return the next, until all are collected and the original runs.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Partial application</dt>
            <dd className="def-text">
              Fixing some arguments now to produce a function that takes the rest later. Currying is partial
              application one argument at a time.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Composition / <code>pipe</code></dt>
            <dd className="def-text">
              Combining functions so the output of one is the input of the next. <code>compose</code> applies
              right-to-left; <code>pipe</code> left-to-right (often more readable).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Point-free (tacit) style</dt>
            <dd className="def-text">
              Defining a function by composing others without naming its argument &mdash; e.g.{' '}
              <code>{'const f = pipe(g, h)'}</code> instead of <code>{'const f = (x) => h(g(x))'}</code>.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Assembly Line Analogy</h2>
        <p className="article-para">
          A composition is a factory <strong>assembly line</strong>: the raw material goes in at one end, and each
          station transforms it and passes it along. <code>pipe</code> reads exactly like the line order &mdash;
          first this station, then that one. Currying is the <strong>tool crib</strong>: you pick up a pre-configured
          tool (&ldquo;the saw set to 30cm&rdquo;) once, then reuse it on many pieces without re-specifying the
          setting each time.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏭</span>
            <span className="analogy-label">Assembly line</span>
            <span className="analogy-target"><code>pipe</code> / <code>compose</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🛠️</span>
            <span className="analogy-label">Pre-set tool</span>
            <span className="analogy-target">A curried, partially applied fn</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔁</span>
            <span className="analogy-label">Right-to-left vs left-to-right</span>
            <span className="analogy-target"><code>compose</code> vs <code>pipe</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🚫</span>
            <span className="analogy-label">No named material on the line</span>
            <span className="analogy-target">Point-free style</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The constraint that makes all this work: every function in the pipe takes <strong>one input and returns
            one output</strong>. That&apos;s why currying matters &mdash; it normalizes multi-argument functions into
            the single-argument shape the pipeline expects. Composition and currying are two views of the same idea:
            <em> functions as connectable units</em>.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          These three tools are pure functions over functions &mdash; higher-order, as in Week 2 Day 3. The mechanics
          are tiny; the power comes from the discipline of keeping each step single-purpose.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Currying collects arguments one at a time</h4>
            <p className="theory-desc">
              Each call returns a function waiting for the next argument. Only when the final argument arrives does
              the original function execute. This lets you stop early and reuse the partial result.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>compose</code> is right-to-left, <code>pipe</code> is left-to-right</h4>
            <p className="theory-desc">
              <code>{'compose(f, g)(x) === f(g(x))'}</code> &mdash; mathematically natural but read backwards.
              <code> pipe(f, g)(x) === g(f(x))</code> &mdash; reads in execution order. Same result, different
              reading direction.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Both reduce by threading one value through</h4>
            <p className="theory-desc">
              <code>{'pipe(...fns) = (x) => fns.reduce((v, f) => f(v), x)'}</code>. The accumulator is the data
              flowing through; each function transforms it and hands it to the next.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Point-free removes the data variable</h4>
            <p className="theory-desc">
              When a function only forwards its argument to another function, you can drop the parameter entirely.
              This emphasizes <em>what</em> the pipeline does over <em>what</em> it does it to.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Currying vs partial application &mdash; not identical</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Currying (one arg at a time)</span>
            <p className="phase-desc">A series of unary functions.</p>
            <ul className="phase-rules">
              <li><code>{'add(1)(2)'}</code> &rarr; 3</li>
              <li>Each step takes exactly one arg</li>
              <li>Naturally partial-able at any step</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Partial application (any number fixed)</span>
            <p className="phase-desc">Fix some args, keep the rest as a group.</p>
            <ul className="phase-rules">
              <li><code>{'partial(add, 1)(2)'}</code> &rarr; 3</li>
              <li>Can fix several args at once</li>
              <li><code>bind</code> is a built-in partial (Week 2)</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            JavaScript functions are variadic by default, so &ldquo;currying&rdquo; in JS usually means an
            auto-currying helper that keeps collecting args until it has enough, then runs. Pure mathematical currying
            is strictly unary; the practical JS version is a convenience wrapper. Know which one a library offers.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why These Matter in JS</h2>
        <p className="article-para">
          Currying and composition come from mathematical lambda calculus (Haskell Curry, 1930s) and are native to
          functional languages like Haskell, ML, and Scala. JavaScript, being multi-paradigm, didn&apos;t grow up
          with them built in &mdash; but its first-class functions (Week 2 Day 3) make them trivial to implement.
          Libraries like Ramda, lodash/fp, and RxJS popularized pipeline style in JS; <code>bind</code> (ES5) gave a
          built-in partial-application tool. A stage-2 pipeline operator (<code>|&gt;</code>) proposal aims to make{' '}
          <code>pipe</code> native syntax, but for now <code>pipe()</code> helpers fill the gap.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Imperative</th>
                <th>Method chain</th>
                <th>Composition (<code>pipe</code>)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Shape</td>
                <td>Statements, mutation</td>
                <td><code>.map().filter()</code></td>
                <td><code>{'pipe(f, g, h)'}</code></td>
              </tr>
              <tr>
                <td>Works on</td>
                <td>Anything</td>
                <td>Arrays/promises only</td>
                <td>Any value</td>
              </tr>
              <tr>
                <td>Reusable as a value</td>
                <td>No (inline)</td>
                <td>Partly</td>
                <td>Yes (named pipeline)</td>
              </tr>
              <tr>
                <td>Reorder steps</td>
                <td>Rewrite</td>
                <td>Rewrite chain</td>
                <td>Reorder the list</td>
              </tr>
              <tr>
                <td>Testability</td>
                <td>Per statement</td>
                <td>Whole chain</td>
                <td>Per step, in isolation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Building and Running a Pipeline</h2>

        <CodeBlock
          code={`const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const curry = (fn) => (a) => (b) => (c) => fn(a, b, c);

const greet = curry((greeting, name, punct) => greeting + ", " + name + punct);
const shout = (s) => s.toUpperCase();
const exclaim = greet("Hello");          // partially applied: 1 of 3 args

const pipeline = pipe(exclaim, (g) => g("!"), shout);
pipeline("Tamjid"); // "HELLO, TAMJID!"`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>curry(greet)</code> returns a chain: <code>(a) =&gt; (b) =&gt; (c) =&gt; greet(a,b,c)</code>.
              <code> greet("Hello")</code> supplies <code>a</code> and returns a function waiting for <code>b</code>{' '}
              &mdash; this is <code>exclaim</code>.
            </span>
          </li>
          <li>
            <span>
              <code>pipe(exclaim, (g) =&gt; g("!"), shout)</code> builds a function that will thread its input
              through those three steps, left to right.
            </span>
          </li>
          <li>
            <span>
              Call <code>pipeline("Tamjid")</code>. <code>reduce</code> starts with <code>v = "Tamjid"</code>.
            </span>
          </li>
          <li>
            <span>
              Step 1: <code>exclaim("Tamjid")</code> &mdash; supplies <code>b = "Tamjid"</code> (the <em>name</em>{' '}
              slot), returns a function waiting for <code>c</code>. <code>v</code> is now that function.
            </span>
          </li>
          <li>
            <span>
              Step 2: <code>(g) =&gt; g("!")</code> &mdash; supplies <code>c = "!"</code> (the <em>punct</em> slot), so{' '}
              <code>greet</code> finally runs as <code>greet("Hello", "Tamjid", "!")</code> &rarr;{' '}
              <code>"Hello, Tamjid!"</code>. <code>v</code> is now the string.
            </span>
          </li>
          <li>
            <span>
              Step 3: <code>shout(v)</code> &rarr; <code>"HELLO, TAMJID!"</code>. That&apos;s the final result.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Manual currying vs <code>bind</code> partial</h3>
        <CodeBlock
          code={`// Manual curry (manual, unary chain):
const add = (a) => (b) => a + b;
add(2)(3); // 5
const add2 = add(2); // a reusable partially-applied fn
add2(10);  // 12

// Same effect with bind (built-in partial application):
function addAll(a, b) { return a + b; }
const add2b = addAll.bind(null, 2);
add2b(10); // 12`}
          filename="curry-vs-bind.js"
        />

        <h3 className="article-h3">2. Auto-currying helper (variadic-friendly)</h3>
        <CodeBlock
          code={`// Keeps collecting args until it has \`length\` of them, then calls.
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
const sum = curry((a, b, c) => a + b + c);
sum(1)(2)(3);    // 6
sum(1, 2)(3);    // 6 — can pass multiple per step
sum(1)(2, 3);    // 6`}
          filename="auto-curry.js"
        />

        <h3 className="article-h3">3. <code>compose</code> and <code>pipe</code></h3>
        <CodeBlock
          code={`const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const double = (x) => x * 2;
const inc = (x) => x + 1;

compose(double, inc)(3); // double(inc(3)) = double(4) = 8
pipe(inc, double)(3);    // double(inc(3)) = 8 — same result, reads in order`}
          filename="compose-pipe.js"
        />

        <h3 className="article-h3">4. Point-free pipeline with curried helpers</h3>
        <CodeBlock
          code={`const curry = (fn) => (a) => (b) => fn(a, b);
const filter = curry((pred, arr) => arr.filter(pred));
const map = curry((fn, arr) => arr.map(fn));
const prop = curry((key, obj) => obj[key]);

// Point-free: the data (users) is never named inside the pipeline.
const getActiveNames = pipe(
  filter((u) => u.active),
  map(prop("name")),
  map((s) => s.toUpperCase())
);
getActiveNames(users); // ["ALICE", "BOB"]`}
          filename="point-free.js"
        />

        <h3 className="article-h3">5. Realistic: a formatting pipeline</h3>
        <CodeBlock
          code={`const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const normalize = (s) => s.trim().toLowerCase();
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const suffix = (end) => (s) => s + end;

const formatName = pipe(normalize, capitalize, suffix("!"));
formatName("  tamjid  "); // "Tamjid!"`}
          filename="format.js"
        />

        <div className="article-callout">
          <p>
            The readability win comes with a cost: deep point-free pipelines can be hard to debug (no intermediate
            names) and to type (TypeScript inference across composed generic functions is tricky). Use composition
            where the steps are clear and small; name a variable when a step needs explaining. Clarity beats clever.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Implement <code>curry</code>, <code>compose</code>, and <code>pipe</code> from scratch. Then build a
            point-free pipeline that takes a list of numbers, filters out negatives, doubles each, sums them, and
            formats the result as a currency string &mdash; all from small, named, reusable pieces.
          </p>
        </div>

        <CodeBlock
          code={`const curry = (fn) => {
  const go = (...args) =>
    args.length >= fn.length ? fn(...args) : (...more) => go(...args, ...more);
  return go;
};
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const filter = curry((pred, xs) => xs.filter(pred));
const map = curry((fn, xs) => xs.map(fn));
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const currency = (n) => "$" + n.toFixed(2);

const total = pipe(
  filter((n) => n >= 0),
  map((n) => n * 2),
  sum,
  currency
);
total([10, -5, 3, -2, 7]); // "$40.00"`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why must the curried helpers take the data last? (So you can pre-apply the config &mdash;{' '}
            <code>filter(pred)</code> &mdash; and get back a function waiting for the data, which is what{' '}
            <code>pipe</code> threads through. If data came first, partial application would fix the data, defeating
            reusability. This &ldquo;data-last&rdquo; convention is why Ramda/lodash-fp order arguments the way they
            do.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is currying?</h4>
            <p className="iq-a">
              Transforming a function that takes multiple arguments into a chain of functions that each take one.{' '}
              <code>f(a, b, c)</code> becomes <code>f(a)(b)(c)</code>. Each call returns a function awaiting the next
              argument until all are supplied and the original runs. It enables partial application &mdash; fixing
              some args now to get a reusable, specialized function.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Currying vs partial application?</h4>
            <p className="iq-a">
              Currying breaks a function into a series of unary functions (one arg per step). Partial application
              fixes any number of arguments at once, leaving the rest as a group. Currying implies a specific shape
              (one-at-a-time); partial application is more general. <code>bind</code> is a built-in partial
              application; true currying needs a helper in JS.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Difference between <code>compose</code> and <code>pipe</code>?</h4>
            <p className="iq-a">
              Direction only. <code>{'compose(f, g)(x) === f(g(x))'}</code> applies right-to-left (mathematical
              convention, reads backwards). <code>{'pipe(f, g)(x) === g(f(x))'}</code> applies left-to-right (reads
              in execution order). Same result; <code>pipe</code> is usually more readable for data transformations.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is point-free (tacit) style?</h4>
            <p className="iq-a">
              Defining a function by composing others without naming its argument &mdash; <code>{'const f = pipe(g, h)'}</code>{' '}
              instead of <code>{'const f = (x) => h(g(x))'}</code>. It emphasizes the transformation pipeline over the
              data flowing through it. It works only when the function purely forwards its argument; useful for
              readability when steps are small and clear, but can hurt clarity if overused.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Implement <code>curry</code>.</h4>
            <p className="iq-a">
              <code>{'function curry(fn) { return function curried(...args) { if (args.length >= fn.length) return fn(...args); return (...more) => curried(...args, ...more); }; }'}</code>{' '}
              Collect arguments in a closure; once you have at least <code>fn.length</code> of them, call the original;
              otherwise return a function awaiting more. This supports both strict one-at-a-time and multi-arg-per-step
              calls. Edge: relies on <code>fn.length</code>, so default/rest params distort it.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Implement <code>pipe</code> and <code>compose</code>.</h4>
            <p className="iq-a">
              <code>{'const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);'}</code> and{' '}
              <code>{'const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);'}</code>.{' '}
              <code>pipe</code> reduces left-to-right (first function applied first); <code>compose</code> uses{' '}
              <code>reduceRight</code> so the last function in the list is applied first. Both thread one accumulator
              (the data) through every function.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What is the &ldquo;data-last&rdquo; convention and why does it matter for composition?</h4>
            <p className="iq-a">
              In data-last APIs, the data argument comes last: <code>map(fn, arr)</code>, <code>filter(pred,
              arr)</code>. This makes the function curry-friendly: <code>map(fn)</code> fixes the transform and
              returns a function awaiting the data &mdash; exactly the shape a pipeline needs, since{' '}
              <code>pipe</code> threads one data value through a list of single-argument functions. If data came first
              (<code>map(arr, fn)</code>), partial application would fix the data, producing a useless one-off. The
              convention (used by Ramda, lodash-fp) is what makes point-free pipelines composable: you pre-configure
              each step with its config, leaving the data slot open for the pipe to fill.
            </p>
          </div>
        </div>
      </section>

      <DayNav next={next} />
    </ContentLayout>
  )
}
