import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('async-js')!
const navItems = weekNav(week)

export default function AsyncDay7() {
  const { prev } = dayNavLinks(week, 7)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[6].title}</h1>
        <p className="lesson-subtitle">
          One week, condensed. Then ten output-ordering puzzles &mdash; the bread and butter of every async interview.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A compressed review of the whole week &mdash; the runtime, the event loop, micro vs macro, callbacks,
            promises, <code>async/await</code>, and the four combinators &mdash; followed by hard output-ordering and
            async-design problems, plus a self-assessment.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Memorize the cheat sheet, then attempt each problem cold. The skill being tested isn&apos;t getting the
            answer &mdash; it&apos;s being able to <em>explain the trace</em> step by step.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            End of Week 4. If you can solve 7 of 10 cold and explain the microtask/macrotask ordering, you&apos;re
            ready for Month 2.
          </p>
        </div>
      </div>

      {/* ── Cheat Sheet ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Week 4 Cheat Sheet</h2>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">The runtime</h4>
            <p className="theory-desc">Engine (heap + call stack, single thread) + host Web APIs (timers, fetch, DOM) + queues. The engine alone can&apos;t do async; the host does the waiting.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Event loop rule</h4>
            <p className="theory-desc">When the stack empties: drain all microtasks, run one macrotask, (maybe render), repeat. <strong>All microtasks before any macrotask.</strong></p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Micro vs macro</h4>
            <p className="theory-desc">Micro: promise handlers, <code>queueMicrotask</code>, <code>await</code> continuations. Macro: timers, I/O, events, <code>postMessage</code>. Microtasks always drain first.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Promise rules</h4>
            <p className="theory-desc">3 states, settles once, handlers always async (microtask). <code>.then</code> returns a new promise; returned promise is adopted; thrown error rejects.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>async/await</code></h4>
            <p className="theory-desc"><code>async</code> always returns a promise. <code>await</code> suspends the function (not the thread) and resumes as a microtask. Rejection &rarr; throw &rarr; <code>try/catch</code>.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Four combinators</h4>
            <p className="theory-desc"><code>all</code> (all-or-nothing, ordered), <code>allSettled</code> (always resolves, per-item status), <code>race</code> (first settle), <code>any</code> (first fulfill, <code>AggregateError</code> if all fail).</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Cancellation</h4>
            <p className="theory-desc">Promises can&apos;t be cancelled &mdash; use <code>AbortController</code>/<code>AbortSignal</code>. Combinators stop <em>waiting</em>, not <em>running</em>.</p>
          </div>
        </div>
      </section>

      {/* ── Common Traps ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Seven Traps</h2>
        <p className="article-para">
          Async bugs are nearly always one of these. Recognize the shape.
        </p>

        <ol className="article-ol">
          <li><strong>Forgetting <code>await</code></strong> &mdash; the promise resolves later; you use a Promise object as a value (Day 5).</li>
          <li><strong>Sequential instead of parallel</strong> &mdash; <code>await a; await b;</code> when independent (Day 5).</li>
          <li><strong><code>.forEach</code> with <code>await</code></strong> &mdash; the loop doesn&apos;t wait; callbacks run unattended (Day 5).</li>
          <li><strong>Unhandled rejections</strong> &mdash; a rejected promise with no <code>.catch</code>/<code>try</code> (Day 6).</li>
          <li><strong>Promise not resolving</strong> &mdash; a code path that never calls <code>resolve</code>/<code>reject</code> (Day 4).</li>
          <li><strong>Microtask starvation</strong> &mdash; an endless promise chain freezing the UI (Day 2).</li>
          <li><strong><code>race</code> instead of <code>any</code></strong> &mdash; a fast-but-failing source wins and rejects (Day 6).</li>
        </ol>
      </section>

      {/* ── Hard Problems ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Hard Problems</h2>
        <p className="article-para">
          Attempt each before reading the answer. Output-ordering problems are solved by classifying every callback as
          micro or macro and applying the loop rule mechanically.
        </p>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 1. Output?</h4>
          <CodeBlock
            code={`console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");`}
            filename="p1.js"
          />
          <p className="iq-a">
            <code>1, 4, 3, 2</code>. Sync first (<code>1</code>, <code>4</code>). Then the microtask drain runs the
            promise callback (<code>3</code>). Then the loop takes the timer macrotask (<code>2</code>). Microtasks
            always precede macrotasks.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 2. Output?</h4>
          <CodeBlock
            code={`async function a() {
  console.log("a1");
  await Promise.resolve();
  console.log("a2");
}
a();
console.log("b");`}
            filename="p2.js"
          />
          <p className="iq-a">
            <code>a1, b, a2</code>. <code>a1</code> runs synchronously up to the <code>await</code>; the function
            suspends and returns a pending promise. <code>b</code> runs. Then the awaited promise settles and{' '}
            <code>a2</code> resumes as a microtask. The <code>await</code> inserted a yield between <code>a1</code> and{' '}
            <code>a2</code>, letting <code>b</code> run in between.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 3. Output?</h4>
          <CodeBlock
            code={`Promise.resolve()
  .then(() => console.log("A"))
  .then(() => console.log("B"));
Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));`}
            filename="p3.js"
          />
          <p className="iq-a">
            <code>A, C, B, D</code>. Each <code>.then</code> returns a new promise, so <code>B</code>&apos;s callback
            is queued only <em>after</em> <code>A</code> runs (a separate microtask). At the start, <code>A</code> and{' '}
            <code>C</code> are both queued; they run, queuing <code>B</code> and <code>D</code> behind the other. The
            two chains interleave at the microtask level.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 4. Output?</h4>
          <CodeBlock
            code={`async function f() {
  return [1, 2, 3].map(async (n) => {
    await Promise.resolve();
    return n * 2;
  });
}
f().then((arr) => Promise.all(arr)).then((v) => console.log(v));`}
            filename="p4.js"
          />
          <p className="iq-a">
            Logs <code>[2, 4, 6]</code>. <code>f</code> is async, so it returns a promise that resolves to an{' '}
            <em>array of promises</em> (<code>.map</code> with an async callback returns promises, not values).{' '}
            <code>.then((arr) =&gt; Promise.all(arr))</code> awaits them all, producing the doubled values. The trap:
            <code> map</code> doesn&apos;t await its async callback, so you get promises you must explicitly await.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 5. What does this log, and what&apos;s the bug?</h4>
          <CodeBlock
            code={`async function load() {
  const results = [];
  [1, 2, 3].forEach(async (n) => {
    const v = await fetch("/api/" + n);
    results.push(await v.json());
  });
  console.log("done", results);
}
load();`}
            filename="p5.js"
          />
          <p className="iq-a">
            Logs <code>done []</code> (immediately), then the fetches resolve later &mdash; but{' '}
            <code>results</code> was already logged empty. The bug: <code>forEach</code> doesn&apos;t await its async
            callbacks, so <code>console.log</code> runs before any fetch completes. Fix with a{' '}
            <code>for...of</code> loop (sequential) or <code>await Promise.all(ids.map(async ...))</code> (parallel).
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 6. Output, in order?</h4>
          <CodeBlock
            code={`console.log("1");
setTimeout(() => console.log("2"), 0);
async function g() {
  console.log("3");
  await Promise.resolve();
  console.log("4");
}
g().then(() => console.log("5"));
Promise.resolve().then(() => console.log("6"));
console.log("7");`}
            filename="p6.js"
          />
          <p className="iq-a">
            <code>1, 3, 7, 4, 6, 5, 2</code>. Sync: <code>1</code>, then <code>g()</code> prints <code>3</code> up to
            its <code>await</code> and suspends &mdash; this enqueues g&apos;s continuation (logging <code>4</code>)
            as a microtask <em>during</em> <code>g()</code>&apos;s sync run &mdash; then <code>7</code>. The later{' '}
            <code>Promise.resolve().then(() =&gt; console.log(&quot;6&quot;))</code> enqueues <code>6</code>{' '}
            <em>afterwards</em>, so the microtask queue at drain time is <code>[4, 6]</code> (FIFO). Run{' '}
            <code>4</code>; that finishes <code>g</code>, so its returned promise fulfills, queuing <code>5</code>{' '}
            behind <code>6</code> &rarr; queue is now <code>[6, 5]</code>. Run <code>6</code>, then <code>5</code>.
            Then the macrotask <code>2</code>. The ordering of <code>4</code> before <code>6</code> hinges on FIFO
            microtask scheduling &mdash; an await continuation is enqueued the instant the await is hit, not when the
            function resumes.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 7. Implement <code>Promise.all</code> from scratch.</h4>
          <CodeBlock
            code={`function all(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    if (remaining === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => { results[i] = v; if (--remaining === 0) resolve(results); },
        reject // first rejection rejects the whole thing
      );
    });
  });
}`}
            filename="p7.js"
          />
          <p className="iq-a">
            Preserve input order by storing results by index; decrement a counter and resolve when it reaches zero;
            reject immediately on any rejection. Wrap each input with <code>Promise.resolve</code> so non-promises
            (and thenables) work. Handle the empty-input case (<code>resolve([])</code>). This is exactly the spec
            algorithm &mdash; the same shape as the hand-rolled counter from Day 3, now promise-based.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 8. Implement a concurrency-limited map.</h4>
          <CodeBlock
            code={`async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const index = i++;
      results[index] = await fn(items[index], index);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}`}
            filename="p8.js"
          />
          <p className="iq-a">
            Spawn <code>limit</code> workers, each pulling the next index from a shared counter and awaiting{' '}
            <code>fn</code>. This bounds concurrency to <code>limit</code> while preserving result order (store by
            index). <code>Promise.all(workers)</code> resolves when all workers finish. Edge cases: <code>limit</code>{' '}
            larger than items (clamp), rejections propagate (wrap in try/catch to keep going or let it fail &mdash;
            design choice). This is the <code>p-limit</code> / bounded-pool pattern.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 9. Implement <code>Promise.race</code> and explain why losing promises aren&apos;t cancelled.</h4>
          <CodeBlock
            code={`function race(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject); // first settle wins
    }
  });
}`}
            filename="p9.js"
          />
          <p className="iq-a">
            Attach the same <code>resolve</code>/<code>reject</code> to every promise. The first to settle calls one
            of them &mdash; and since a promise settles once, later calls are ignored. The losing promises{' '}
            <em>keep running</em> because promises have no cancellation API; <code>race</code> only stops{' '}
            <em>listening</em>. To truly cancel, the caller must use <code>AbortController</code> and signal the
            underlying operation. This is why a <code>race</code>-based timeout leaves a fetch running in the
            background.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 10. Output of every line, in order &mdash; the final exam.</h4>
          <CodeBlock
            code={`console.log("1");
setTimeout(() => console.log("2"));
Promise.resolve().then(() => console.log("3"));
async function h() {
  console.log("4");
  await null;                          // yields like awaiting a promise
  console.log("5");
}
h();
queueMicrotask(() => console.log("6"));
console.log("7");`}
            filename="p10.js"
          />
          <p className="iq-a">
            <code>1, 4, 7, 3, 5, 6, 2</code>. Sync: <code>1</code>, then <code>h()</code> prints <code>4</code> up to{' '}
            <code>await null</code> and suspends &mdash; this enqueues h&apos;s continuation (logging <code>5</code>)
            as a microtask <em>during</em> <code>h()</code>&apos;s sync run &mdash; then <code>7</code>. The earlier{' '}
            <code>Promise.resolve().then(() =&gt; console.log(&quot;3&quot;))</code> had already enqueued{' '}
            <code>3</code>; the later <code>queueMicrotask(() =&gt; console.log(&quot;6&quot;))</code> enqueues{' '}
            <code>6</code> <em>after</em> both. So the microtask queue at drain time is (in order): <code>3</code>,
            <code>5</code>, <code>6</code>. Drain FIFO: <code>3</code>, <code>5</code>, <code>6</code>. Then the
            macrotask <code>2</code>. One problem, five concepts: sync execution, <code>await</code> enqueuing its
            continuation as a microtask the instant it&apos;s hit (here, before the later{' '}
            <code>queueMicrotask</code>), explicit <code>queueMicrotask</code>, promise microtasks, and the macrotask
            finishing last.
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
            <li>I can name the three runtime pieces and explain why the engine alone can&apos;t do async.</li>
            <li>I can recite the event-loop rule and the microtask/macrotask ordering.</li>
            <li>I can solve any output-ordering problem by classifying callbacks.</li>
            <li>I can explain the three promise states and the &ldquo;settles once&rdquo; guarantee.</li>
            <li>I can describe how <code>.then</code> chaining and unwrapping work.</li>
            <li>I can desugar <code>async/await</code> into a promise chain.</li>
            <li>I know the four combinators and when each is right.</li>
            <li>I can implement <code>Promise.all</code> and <code>Promise.race</code> from scratch.</li>
            <li>I can spot the <code>forEach</code>+<code>await</code> and unhandled-rejection bugs.</li>
          </ul>

          <p style={{ marginTop: '1rem' }}>
            <strong>Month 1 complete.</strong> You now understand <em>how JavaScript runs</em>: execution context and
            scope (Week 1), functions and <code>this</code> (Week 2), objects and prototypes (Week 3), and now
            asynchronous flow (Week 4). <strong>Month 2</strong> moves from understanding to mastery &mdash;{' '}
            <strong>Week 5 (Advanced Patterns)</strong> introduces currying, iterators, generators, Proxy/Reflect, and
            the metaprogramming primitives that separate senior candidates. The async foundation you just built
            returns immediately: generators and async iterators are promises&apos; close cousins.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Final Practice (90 minutes)</span>
          <p>Timed. No notes, no autocomplete, no running code:</p>
        </div>

        <CodeBlock
          code={`// From a blank file, in order:
// 1. Promisify an error-first callback function.
// 2. Write a 3-step sequential flow with a single try/catch (async/await).
// 3. Rewrite it to run the independent parts in parallel (Promise.all).
// 4. Implement Promise.all from scratch (ordered, reject-fast).
// 5. Implement Promise.race from scratch.
// 6. Implement fetchWithTimeout using AbortController.
// 7. Implement retry(fn, attempts) with exponential backoff.
// 8. Implement mapLimit(items, limit, fn) — bounded concurrency.

// Then solve Problems 6 and 10 on paper, line by line, naming each
// callback as micro or macro and the queue order.`}
          filename="final-practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Why paper matters</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Async interviews are mostly &ldquo;what does this log, in order?&rdquo; Tracing on paper &mdash;
            classifying each callback and applying the loop rule &mdash; is the skill under test. If you can&apos;t do
            it cold on paper, you can&apos;t do it under interview pressure.
          </p>
        </div>
      </section>

      {/* ── Bridge to Week 5 ──────────────────────────────── */}
      <section className="day-section">
        <div className="week-bridge">
          <p>
            Week 4 complete. You now understand <strong>concurrency</strong> &mdash; how single-threaded JavaScript
            juggles thousands of operations via the event loop, microtasks and macrotasks, promises,{' '}
            <code>async/await</code>, and the four combinators. <strong>Week 5 (Advanced Patterns)</strong> enters
            expert territory: currying and composition, iterators and generators (including async generators &mdash;
            promises&apos; sibling for streams of values), Proxy and Reflect for metaprogramming, weak collections,
            and symbols. The async model you just mastered underpins async iteration &mdash; the bridge between this
            week and the next.
          </p>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
