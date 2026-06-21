import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('advanced-patterns')!
const navItems = weekNav(week)

export default function AdvancedDay3() {
  const { prev, next } = dayNavLinks(week, 3)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[2].title}</h1>
        <p className="lesson-subtitle">
          Functions you can pause and resume &mdash; and feed values back into. Yesterday&apos;s iterator protocol,
          written with a fraction of the code.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>generator</strong> is a function declared with <code>function*</code> that can pause itself with
            <code> yield</code> and resume later. Calling it returns a <strong>generator object</strong> &mdash; both
            an iterator and an iterable &mdash; that produces values one at a time.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            <code>yield v</code> pauses, emitting <code>v</code>; the next call to <code>next()</code> resumes just
            after the <code>yield</code>. <code>yield</code> also <em>receives</em> a value from the caller &mdash;{' '}
            <code>const x = yield</code> &mdash; enabling two-way communication. <code>yield*</code> delegates to
            another iterable.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            To write iterators/sequences (finite or infinite) with far less code than the raw protocol, to model
            state machines, and as the basis for async iteration. Lazy sequences, custom iterables, and cooperative
            coroutines are the sweet spots.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Yesterday you wrote a <code>Range</code> iterator with a closure and a <code>next()</code> method. Today
          the same idea in three lines &mdash; because generators let you write the iterator&apos;s body as ordinary
          sequential code, with <code>yield</code> marking each pause.
        </p>

        <CodeBlock
          code={`// Yesterday (raw protocol):
const range = {
  [Symbol.iterator]() {
    let i = this.from;
    return { next: () => i <= this.to ? { value: i++, done: false } : { value: undefined, done: true } };
  }, from: 1, to: 3,
};

// Today (generator):
function* range(from, to) {
  for (let i = from; i <= to; i++) yield i;
}
for (const n of range(1, 3)) console.log(n); // 1, 2, 3`}
          filename="protocol-vs-gen.js"
        />

        <p className="article-para">
          Same behavior, dramatically less code &mdash; and the body reads like a normal loop. The magic: when{' '}
          <code>yield</code> is reached, the generator <em>suspends</em> (preserving its local variables and position),
          hands the value out, and resumes exactly where it left off on the next <code>next()</code>. No closure
          juggling required.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Generator function (<code>function*</code>)</dt>
            <dd className="def-text">
              A special function that, instead of running to completion, returns a generator object and executes in
              chunks separated by <code>yield</code>. The <code>*</code> marks it.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>yield</code></dt>
            <dd className="def-text">
              Pauses the generator and emits a value to the caller. On resume, <code>yield</code> evaluates to whatever
              the caller passed in via <code>next(value)</code> (or <code>undefined</code>).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>yield*</code></dt>
            <dd className="def-text">
              Delegates to another iterable/generator, yielding each of its values in turn, then resumes the current
              generator. Useful for composing sequences.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Conversation Analogy</h2>
        <p className="article-para">
          A normal function is a monologue: you call it, it talks until done, returns one thing. A generator is a{' '}
          <strong>conversation</strong>: it says something (<code>yield</code>), pauses to listen, you reply
          (<code>next(value)</code>), and it continues with your reply in hand. You take turns, back and forth, for as
          long as the conversation lasts.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🎤</span>
            <span className="analogy-label">It speaks</span>
            <span className="analogy-target"><code>yield value</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">👂</span>
            <span className="analogy-label">It listens</span>
            <span className="analogy-target"><code>const reply = yield</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">▶️</span>
            <span className="analogy-label">You prompt it to continue</span>
            <span className="analogy-target"><code>gen.next(reply)</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📞</span>
            <span className="analogy-label">Hand off the mic</span>
            <span className="analogy-target"><code>yield*</code> delegation</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The two-way communication is the unique feature. A plain iterator only outputs; a generator outputs{' '}
            <em>and</em> accepts input each step. That makes generators coroutines &mdash; cooperatively-scheduled
            functions that can be steered by their caller. This is the foundation of libraries that implement async
            flows with generators (the pre-<code>async/await</code> pattern).
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          Generators are sugar over the iterator protocol &mdash; but with a critical addition: the ability to pause
          execution mid-statement and receive a value back. Here&apos;s what&apos;s really happening.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Calling a generator doesn&apos;t run it</h4>
            <p className="theory-desc">
              <code>{'const g = gen()'}</code> returns a generator object. The body hasn&apos;t started &mdash; it runs
              only up to the first <code>yield</code> on the first <code>next()</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>yield</code> pauses and emits</h4>
            <p className="theory-desc">
              Hitting <code>yield v</code> suspends the generator and returns <code>{'{ value: v, done: false }'}</code>{' '}
              to the caller. Local state is frozen across the pause.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>next(value)</code> resumes and passes input</h4>
            <p className="theory-desc">
              The argument to <code>next()</code> becomes the result of the paused <code>yield</code> expression
              inside the generator. <code>const x = yield</code> captures it. This is the two-way channel.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Return ends it; <code>yield*</code> delegates</h4>
            <p className="theory-desc">
              A <code>return</code> (or running off the end) sets <code>done: true</code> with the returned value.
              <code> yield*</code> dives into another iterable, yielding its values until exhausted, then resumes.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The first <code>next()</code> ignores its argument</h3>
        <CodeBlock
          code={`function* convo() {
  const a = yield "first";   // (B) receives what the 2nd next() passes
  const b = yield a + 1;     // (C) receives what the 3rd next() passes
  return a + b;
}
const g = convo();
g.next("ignored"); // (A) { value: "first", done: false } — arg ignored!
g.next(10);        // (B) a = 10 → { value: 11, done: false }
g.next(20);        // (C) b = 20 → { value: 30, done: true }`}
          filename="first-next.js"
        />
        <p className="article-para">
          The first <code>next()</code> starts the generator up to the first <code>yield</code> &mdash; nothing is
          paused yet to receive a value, so its argument is discarded. Only from the second <code>next()</code> onward
          does the argument land in a paused <code>yield</code>. This asymmetry is the #1 generator gotcha.
        </p>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Generator object is BOTH</span>
            <p className="phase-desc">An iterator <em>and</em> an iterable.</p>
            <ul className="phase-rules">
              <li>Has <code>next</code>, <code>return</code>, <code>throw</code></li>
              <li>Its <code>[Symbol.iterator]()</code> returns itself</li>
              <li>Works directly in <code>for...of</code></li>
              <li>Single-use: exhausted = done forever</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label"><code>throw()</code> throws at the pause</span>
            <p className="phase-desc">Injects an error into the paused generator.</p>
            <ul className="phase-rules">
              <li>Throws at the current <code>yield</code></li>
              <li>Catchable with <code>try/catch</code> inside</li>
              <li>If uncaught, propagates out of <code>throw()</code></li>
              <li>Basis for async-generator error handling</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Generators were the original async/await. Before ES2017, libraries like <code>co</code> ran generator
            functions that yielded promises, awaiting each and resuming with the resolved value &mdash; exactly what{' '}
            <code>async/await</code> now does natively. The two-way channel (<code>yield</code> receives) is what made
            that possible. Today you&apos;d just use <code>async/await</code>, but the lineage matters.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Generators Exist</h2>
        <p className="article-para">
          Generators arrived in ES6 (2015), borrowed from Python. They solved two problems at once: (1) writing
          iterators without the verbose raw protocol, and (2) enabling cooperative concurrency &mdash; functions that
          could pause and resume. Their two-way <code>yield</code> made them the substrate for pre-<code>await</code>{' '}
          async libraries. When <code>async/await</code> (ES2017) took over the async use case, async generators
          (<code>async function*</code>, ES2018) extended them to async iteration &mdash; the basis of{' '}
          <code>for await...of</code> over streams.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Raw iterator</th>
                <th>Generator</th>
                <th>Async function</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pause/resume</td>
                <td>Manual (closure state)</td>
                <td>Automatic (<code>yield</code>)</td>
                <td>Automatic (<code>await</code>)</td>
              </tr>
              <tr>
                <td>Two-way channel</td>
                <td>No (output only)</td>
                <td>Yes (<code>yield</code> receives)</td>
                <td>No (one-way to await)</td>
              </tr>
              <tr>
                <td>Produces</td>
                <td>Values</td>
                <td>Values (sync)</td>
                <td>One promise</td>
              </tr>
              <tr>
                <td>Best for</td>
                <td>Simple sequences</td>
                <td>Lazy sequences, state machines</td>
                <td>Sequential async</td>
              </tr>
              <tr>
                <td>Async variant</td>
                <td>&mdash;</td>
                <td><code>async function*</code></td>
                <td>(is async)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Two-Way Generator</h2>

        <CodeBlock
          code={`function* accumulator(start) {
  let total = start;
  while (true) {
    const delta = yield total;   // emit total, receive delta
    total += delta;               // resume here with the received value
  }
}
const acc = accumulator(10);
acc.next();       // (A)
acc.next(5);      // (B)
acc.next(3);      // (C)`}
          filename="trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>accumulator(10)</code> returns a generator object; body hasn&apos;t run. Local <code>total = 10</code>{' '}
              isn&apos;t set yet.
            </span>
          </li>
          <li>
            <span>
              <strong>(A)</strong> <code>acc.next()</code> runs the body to the first <code>yield</code>: sets{' '}
              <code>total = 10</code>, enters the loop, hits <code>yield total</code> &rarr; returns{' '}
              <code>{'{ value: 10, done: false }'}</code> and suspends there. The arg to this first <code>next</code>{' '}
              is ignored.
            </span>
          </li>
          <li>
            <span>
              <strong>(B)</strong> <code>acc.next(5)</code>: the <code>5</code> becomes the value of the paused{' '}
              <code>yield</code>, so <code>delta = 5</code>. <code>total += 5</code> &rarr; 15. Loop continues, hits{' '}
              <code>yield total</code> again &rarr; <code>{'{ value: 15, done: false }'}</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>(C)</strong> <code>acc.next(3)</code>: <code>delta = 3</code>, <code>total = 18</code>, yields{' '}
              <code>18</code>. And so on forever &mdash; it&apos;s an infinite, stateful, steerable sequence.
            </span>
          </li>
          <li>
            <span>
              The caller drives the generator and feeds it data each step; the generator maintains its state between
              steps without any external variable. That&apos;s a coroutine.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Infinite sequences, one line each</h3>
        <CodeBlock
          code={`function* naturals() { let n = 1; while (true) yield n++; }
function* fibonacci() {
  let a = 0, b = 1;
  while (true) { yield a; [a, b] = [b, a + b]; }
}
// Take 5 of an infinite generator:
const fib5 = [];
for (const n of fibonacci()) { fib5.push(n); if (fib5.length === 5) break; }
fib5; // [0, 1, 1, 2, 3]`}
          filename="infinite.js"
        />

        <h3 className="article-h3">2. <code>yield*</code> delegates</h3>
        <CodeBlock
          code={`function* inner() { yield "a"; yield "b"; }
function* outer() {
  yield 1;
  yield* inner();    // delegates: yields a, b, then resumes
  yield 2;
  yield* [10, 20];   // works on any iterable
}
[...outer()]; // [1, "a", "b", 2, 10, 20]`}
          filename="delegate.js"
        />

        <h3 className="article-h3">3. Two-way: a stateful counter</h3>
        <CodeBlock
          code={`function* stepper() {
  let step = yield "set step"; // first next() returns "set step"
  while (true) {
    step = yield step;          // each next(n) updates step, echoes it
  }
}
const s = stepper();
s.next();     // { value: "set step", done: false }
s.next(5);    // { value: 5, done: false }   — step = 5
s.next(10);   // { value: 10, done: false }  — step = 10
s.next(10);   // { value: 10 } — same step, echoes again`}
          filename="two-way.js"
        />

        <h3 className="article-h3">4. Lazy map/filter over any iterable</h3>
        <CodeBlock
          code={`function* map(it, fn) { for (const v of it) yield fn(v); }
function* filter(it, pred) { for (const v of it) if (pred(v)) yield v; }
function* take(it, n) {
  let i = 0;
  for (const v of it) { if (i++ >= n) return; yield v; }
}

// Pipeline over an INFINITE source — nothing materializes eagerly:
const firstEvenDouble = take(
  map(filter(naturals(), (n) => n % 2 === 0), (n) => n * 2),
  3
);
[...firstEvenDouble]; // [4, 8, 12]`}
          filename="lazy-pipeline.js"
        />

        <h3 className="article-h3">5. <code>throw()</code> and cleanup</h3>
        <CodeBlock
          code={`function* safe() {
  const handle = openResource();
  try {
    while (true) yield doWork(handle);
  } finally {
    handle.close(); // runs on return(), throw(), or normal completion
  }
}
const g = safe();
g.next();
g.throw(new Error("boom")); // injected at the yield → finally runs, error propagates`}
          filename="throw-cleanup.js"
        />

        <h3 className="article-h3">6. Async generators &mdash; the bridge to streams</h3>
        <CodeBlock
          code={`async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page}\`);
    const data = await res.json();
    if (data.length === 0) return;
    yield data;            // yield works inside async generators
    page++;
  }
}
// Consumed with for await...of (ES2018):
for await (const page of fetchPages("/api/items")) {
  render(page);
}`}
          filename="async-gen.js"
        />

        <div className="article-callout">
          <p>
            Generators are single-use: once a generator object reaches <code>done</code>, calling{' '}
            <code>next()</code> keeps returning <code>{'{ done: true }'}</code>. To iterate again, call the generator{' '}
            <em>function</em> again for a fresh object. This mirrors iterators from Day 2 &mdash; a generator object{' '}
            <em>is</em> an iterator.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Implement an infinite <code>naturals()</code>, a lazy <code>map</code>/<code>filter</code>/<code>take</code>{' '}
            toolkit using generators, and a two-way <code>runningTotal()</code> generator that accumulates values you
            pass via <code>next()</code>. Then build a pipeline that yields the first 5 doubled even naturals &mdash;
            all lazily.
          </p>
        </div>

        <CodeBlock
          code={`function* naturals() { let n = 1; while (true) yield n++; }
function* map(it, fn) { for (const v of it) yield fn(v); }
function* filter(it, p) { for (const v of it) if (p(v)) yield v; }
function* take(it, n) {
  let i = 0;
  for (const v of it) { if (i++ >= n) return; yield v; }
}

const result = [...take(map(filter(naturals(), (n) => n % 2 === 0), (n) => n * 2), 5)];
// [4, 8, 12, 16, 20] — infinite source, only 5 computed

function* runningTotal() {
  let total = 0;
  while (true) total = (yield total) + total; // careful: yield total first
}
// Note: (yield total) is the received value; +total adds it to running sum.
const rt = runningTotal();
rt.next();     // prime: { value: 0 }
rt.next(5);    // { value: 5 }
rt.next(10);   // { value: 15 }`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            In the lazy pipeline, how many naturals does <code>filter</code> actually pull from <code>naturals</code>?
            (Just enough to yield 5 even numbers &mdash; i.e., it pulls 1..10, because the 5th even is 10. The
            infinite source is never fully realized; <code>take</code> drives the demand, and each stage pulls only
            what the next needs. That&apos;s lazy evaluation end to end.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a generator?</h4>
            <p className="iq-a">
              A function declared <code>function*</code> that can pause itself with <code>yield</code> and resume
              later. Calling it doesn&apos;t run the body &mdash; it returns a generator object (both iterator and
              iterable). The body runs in chunks: each <code>yield</code> emits a value and suspends, preserving local
              state across the pause.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What does <code>yield</code> do?</h4>
            <p className="iq-a">
              It pauses the generator, emits a value to the caller (as <code>{'{value, done}'}</code>), and freezes
              local state. On the next <code>next()</code>, execution resumes just after the <code>yield</code>.{' '}
              <code>yield</code> is also an expression that evaluates to the argument passed to the next{' '}
              <code>next()</code> &mdash; enabling two-way communication.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why is the first <code>next()</code>&apos;s argument ignored?</h4>
            <p className="iq-a">
              Because nothing is paused yet to receive it. The first <code>next()</code> starts the generator and runs
              to the first <code>yield</code>; there&apos;s no awaiting <code>yield</code> expression for its argument
              to fill. Only from the second <code>next()</code> onward does the argument land in a paused{' '}
              <code>yield</code>. This asymmetry is the most common generator gotcha.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Difference between <code>yield</code> and <code>yield*</code>?</h4>
            <p className="iq-a">
              <code>yield v</code> emits a single value and pauses. <code>yield* iterable</code> <em>delegates</em> to
              another iterable/generator, yielding each of its values in turn before resuming the current generator.
              It&apos;s how you compose sequences or recursively flatten nested generators without manual
              forwarding.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Output of this generator trace?</h4>
            <CodeBlock
              code={`function* g() {
  const a = yield 1;
  const b = yield a + 1;
  return a + b;
}
const it = g();
it.next();
it.next(10);
it.next(20);`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>{'{value:1}'}</code>, then <code>{'{value:11}'}</code>, then <code>{'{value:30, done:true}'}</code>.
              First <code>next</code> runs to the first <code>yield</code> &rarr; emits 1. <code>it.next(10)</code>:{' '}
              <code>a = 10</code>, yields <code>a+1 = 11</code>. <code>it.next(20)</code>: <code>b = 20</code>,{' '}
              <code>return 10+20 = 30</code> &rarr; <code>done: true</code>.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How do generators enable lazy pipelines?</h4>
            <p className="iq-a">
              Each <code>map</code>/<code>filter</code> written as a generator pulls one value from its source only
              when its consumer asks for one &mdash; demand flows backward from the consumer through each stage to the
              source. So an infinite source filtered and mapped and taken-5 only ever computes the values needed to
              produce 5 results. Nothing materializes eagerly; cost is proportional to consumption, not potential
              size.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How were generators used for async before <code>async/await</code>?</h4>
            <p className="iq-a">
              Libraries like <code>co</code> exploited the two-way <code>yield</code>: you wrote a generator that{' '}
              <code>yield</code>ed promises; the runner awaited each, then called <code>gen.next(resolvedValue)</code>,
              feeding the result back into the paused <code>yield</code>. Because <code>yield</code> both emits and
              receives, the generator read as linear synchronous-style code while the runner handled the async
              plumbing. <code>async/await</code> (ES2017) is essentially this pattern built into the language: an
              async function is a generator-like construct over promises, where <code>await</code> replaces{' '}
              <code>yield</code> and the engine is the runner. Async generators (<code>async function*</code>) extend
              it to async iteration &mdash; <code>for await...of</code> over streams.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
