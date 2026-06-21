import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('async-js')!
const navItems = weekNav(week)

export default function AsyncDay3() {
  const { prev, next } = dayNavLinks(week, 3)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[2].title}</h1>
        <p className="lesson-subtitle">
          The original async pattern &mdash; and the reason promises were invented. Understand what it gets wrong and
          tomorrow&apos;s solution makes sense.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>callback</strong> is a function passed to another function to be invoked later, typically when
            async work finishes. The Node <strong>error-first</strong> convention passes <code>(err, result)</code>{' '}
            so callers can distinguish success from failure.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            When async work completes, the host queues the callback (a macrotask). Inside, you check for{' '}
            <code>err</code> first, then handle <code>result</code>. Nesting callbacks for sequential steps produces
            the <strong>pyramid of doom</strong>.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Callbacks are still everywhere &mdash; <code>addEventListener</code>, <code>setTimeout</code>, streams.
            But for <em>sequential</em> async with error handling, callbacks scale badly; promises (Day 4) and{' '}
            <code>async/await</code> (Day 5) replaced them for that use.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Before promises, before <code>async/await</code>, there was one way to do anything asynchronous: pass a
          function to be called later. It works. It also scales into a maintenance nightmare the moment you need
          three async steps in a row.
        </p>

        <CodeBlock
          code={`// Fetch user, then their posts, then comments on the first post.
getUser(42, function (err, user) {
  if (err) return handleError(err);
  getPosts(user.id, function (err, posts) {
    if (err) return handleError(err);
    getComments(posts[0].id, function (err, comments) {
      if (err) return handleError(err);
      render(user, posts, comments);   // finally
    });
  });
});`}
          filename="pyramid.js"
        />

        <p className="article-para">
          Three levels deep and it already reads sideways. Add error handling and the indentation balloons. This is
          the famous <strong>pyramid of doom</strong>, and it&apos;s not just ugly &mdash; it actively causes bugs by
          making control flow hard to follow. Today we learn why callbacks were the standard, what they got right,
          and exactly what they got wrong &mdash; so tomorrow&apos;s promises feel like relief, not magic.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Callback</dt>
            <dd className="def-text">
              A function passed as an argument, to be invoked by the receiver at a later time. The fundamental
              enabler of async JS &mdash; every async abstraction is built on callbacks at the bottom.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Error-first convention</dt>
            <dd className="def-text">
              Node&apos;s standard: the callback&apos;s first argument is an error (null on success), the rest are
              results. Lets a single callback represent both success and failure paths.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Pyramid of doom</dt>
            <dd className="def-text">
              The nested-callbacks shape that emerges when sequential async steps each require their own callback,
              driving code further right with every step.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Take-a-Number Analogy</h2>
        <p className="article-para">
          With callbacks, you don&apos;t wait at the counter for your results. You take a number and{' '}
          <strong>leave instructions</strong>: &ldquo;when my order is ready, do X with it.&rdquo; The kitchen
          doesn&apos;t return a value &mdash; it <em>calls you back</em>. The problem is what happens when X itself
          requires another async step: you must leave nested instructions, and the instruction sheet grows sideways.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🎫</span>
            <span className="analogy-label">Take a number</span>
            <span className="analogy-target">Register a callback</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📞</span>
            <span className="analogy-label">They call you back</span>
            <span className="analogy-target">Host invokes the callback later</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">Nested instructions</span>
            <span className="analogy-target">The pyramid of doom</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">⚠️</span>
            <span className="analogy-label">Who handles mistakes?</span>
            <span className="analogy-target">Inversion of control</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The deeper problem isn&apos;t indentation &mdash; it&apos;s <strong>inversion of control</strong>. When
            you pass a callback into someone else&apos;s API, you hand them control over <em>when and whether</em> your
            code runs. They might call it twice, never, too early, with the wrong args. You&apos;ve surrendered
            trust. Promises fix this by guaranteeing the rules.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Two Problems</h2>
        <p className="article-para">
          Callbacks have one fundamental strength (they&apos;re the lowest-level async primitive) and two fundamental
          weaknesses that motivated everything after them.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Sequential nesting &rarr; the pyramid</h4>
            <p className="theory-desc">
              Each async step needs its own callback. Composing steps means nesting callbacks inside callbacks,
              pushing code rightward and obscuring the logical top-to-bottom flow.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Inversion of control</h4>
            <p className="theory-desc">
              You hand your callback to an API you don&apos;t control. It decides if, when, and how many times your
              code runs &mdash; and with what arguments. Bugs in the API become bugs in your flow.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Error handling is manual and inconsistent</h4>
            <p className="theory-desc">
              Without <code>try/catch</code> across async boundaries, every callback must check <code>err</code>{' '}
              manually. Forget one check and errors vanish silently. There&apos;s no central error path.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. No built-in composition</h4>
            <p className="theory-desc">
              &ldquo;Run these three in parallel, then this one, but fail if any one fails&rdquo; requires hand-rolled
              counters and flags. There&apos;s no primitive for parallel/sequential composition.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The error-first contract</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Error-first (Node style)</span>
            <p className="phase-desc">One callback handles both outcomes; <code>err</code> first.</p>
            <ul className="phase-rules">
              <li><code>{'fn(args, (err, result) => {...})'}</code></li>
              <li>Check <code>err</code> before using <code>result</code></li>
              <li>De-facto standard in Node since 2009</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Split success/error (DOM style)</span>
            <p className="phase-desc">Separate callbacks for success and failure.</p>
            <ul className="phase-rules">
              <li><code>{'addEventListener(type, handler)'}</code></li>
              <li>Often success-only, no error path</li>
              <li>Inconsistent across APIs</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The split between &ldquo;did it work?&rdquo; and &ldquo;what did it return?&rdquo; is the heart of the
            problem. With raw callbacks, every API inventor chose a different convention. Promises standardized it:
            <strong> settled</strong> means either fulfilled (with one value) or rejected (with one reason), and the
            same object represents both. That uniformity is what makes composition possible.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; How We Got Here</h2>
        <p className="article-para">
          Callbacks are as old as JavaScript &mdash; <code>addEventListener</code>, <code>setTimeout</code>, and{' '}
          <code>XMLHttpRequest</code> (1999) all used them. Node (2009) formalized the error-first convention so the
          ecosystem could share one contract. By the early 2010s, callback hell was a universal pain; libraries like
          <code> async.js</code> and <code>Q</code> arose to manage it, and Promises/A+ (2012) standardized the
          promise shape that ES6 adopted in 2015. <code>async/await</code> (ES2017) then made promise code read
          synchronously. The arc: callbacks &rarr; promises &rarr; await, each layer reclaiming control flow
          readability.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Raw callbacks</th>
                <th>Promises</th>
                <th><code>async/await</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sequential flow</td>
                <td>Nested (pyramid)</td>
                <td>Chained (<code>.then</code>)</td>
                <td>Linear (looks sync)</td>
              </tr>
              <tr>
                <td>Error handling</td>
                <td>Manual per callback</td>
                <td>Single <code>.catch</code></td>
                <td><code>try/catch</code></td>
              </tr>
              <tr>
                <td>Control trust</td>
                <td>Inverted (caller decides)</td>
                <td>Guaranteed (settles once)</td>
                <td>Same as promises</td>
              </tr>
              <tr>
                <td>Parallel composition</td>
                <td>Hand-rolled counters</td>
                <td><code>Promise.all</code></td>
                <td>Wrap with <code>await</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Callback Chain</h2>

        <CodeBlock
          code={`readFile("a.txt", (err, a) => {
  if (err) return console.error(err);
  writeFile("b.txt", a.toUpperCase(), (err) => {
    if (err) return console.error(err);
    console.log("done");
  });
});
console.log("kicked off");`}
          filename="trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>readFile</code> is called with a callback. The host (Node fs / browser) starts reading on its own
              thread; the engine does <strong>not</strong> wait &mdash; the call returns immediately.
            </span>
          </li>
          <li>
            <span>
              <code>console.log("kicked off")</code> runs synchronously and prints <em>before</em> any file work
              resolves. This is the non-blocking behavior from Day 1.
            </span>
          </li>
          <li>
            <span>
              Later, the read completes. The host queues the callback as a macrotask. When the stack empties, the
              loop runs it. We check <code>err</code>; if null, we have <code>a</code>.
            </span>
          </li>
          <li>
            <span>
              Inside that callback we call <code>writeFile</code> with <em>another</em> callback &mdash; nesting one
              level deeper. Again the host does the work; the engine moves on.
            </span>
          </li>
          <li>
            <span>
              When the write completes, its callback runs, checks <code>err</code>, and prints <code>done</code>. Two
              async steps &rarr; two nesting levels. Ten steps &rarr; ten levels.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Error-first callback (the Node contract)</h3>
        <CodeBlock
          code={`// A function that follows the error-first convention
function loadConfig(cb) {
  setTimeout(() => {
    if (Math.random() < 0.2) return cb(new Error("disk failed"));
    cb(null, { port: 3000 }); // success: err is null
  }, 100);
}

loadConfig((err, config) => {
  if (err) {
    console.error("Failed:", err.message);
    return;                       // MUST return, or fall through to success path
  }
  console.log("Loaded:", config.port);
});`}
          filename="error-first.js"
        />

        <h3 className="article-h3">2. Parallel callbacks with a hand-rolled counter</h3>
        <CodeBlock
          code={`// Run three async tasks "in parallel", proceed when all done.
function parallel(tasks, done) {
  const results = new Array(tasks.length);
  let pending = tasks.length;
  tasks.forEach((task, i) => {
    task((err, value) => {
      if (err) return done(err);     // fail fast — but other tasks still run!
      results[i] = value;
      if (--pending === 0) done(null, results);
    });
  });
}

parallel([fetchA, fetchB, fetchC], (err, [a, b, c]) => {
  if (err) return console.error(err);
  console.log(a, b, c);
});
// This is exactly what Promise.all automates — without the boilerplate.`}
          filename="parallel.js"
        />

        <h3 className="article-h3">3. Flattening the pyramid by naming functions</h3>
        <CodeBlock
          code={`// Pre-promise technique: name each step to keep code flat.
function onUser(err, user) {
  if (err) return console.error(err);
  getPosts(user.id, onPosts);
}
function onPosts(err, posts) {
  if (err) return console.error(err);
  getComments(posts[0].id, onComments);
}
function onComments(err, comments) {
  if (err) return console.error(err);
  render(comments);
}
getUser(42, onUser);
// Flat — but control flow is scattered across named functions,
// and shared state between steps must live in an outer scope.`}
          filename="named-steps.js"
        />

        <h3 className="article-h3">4. Inversion of control &mdash; the trust problem</h3>
        <CodeBlock
          code={`// You trust analytics() to call your callback exactly once.
analytics("event", (result) => {
  chargeCreditCard(result.amount); // called when analytics says so
});
// But you don't control analytics(). It might:
//  - call the callback twice → double charge
//  - never call it → UI hangs forever
//  - call it synchronously → surprising execution order
//  - swallow exceptions thrown inside → silent failures
// Promises guarantee: settle exactly once, never sync, errors propagate.`}
          filename="inversion.js"
        />

        <h3 className="article-h3">5. Where callbacks are still the right tool</h3>
        <CodeBlock
          code={`// Event handlers are inherently many-shot — promises (one-shot) don't fit.
button.addEventListener("click", handleClick); // called many times

// Streams/backpressure: a callback per chunk is the natural model.
process.stdin.on("data", (chunk) => transform(chunk));

// Don't force promises onto genuinely repeating events. Use callbacks
// (or async iterators, Day on Week 5) where many-shot semantics are needed.`}
          filename="still-good.js"
        />

        <div className="article-callout">
          <p>
            The lesson isn&apos;t &ldquo;callbacks are bad.&rdquo; It&apos;s &ldquo;callbacks are the wrong tool for
            <strong> sequential async with error handling</strong>.&rdquo; For one-shot async results &mdash; fetch a
            thing, then another &mdash; promises and <code>await</code> reclaim readability and trust. For repeating
            events, callbacks remain idiomatic.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Implement an error-first <code>parallel(tasks, cb)</code> from scratch (no promises), then write the
            same logic with the pyramid pattern for a 3-step sequential flow. Feel the pain on purpose &mdash; it
            makes tomorrow&apos;s promises feel like relief.
          </p>
        </div>

        <CodeBlock
          code={`// 1. PARALLEL (hand-rolled): run N tasks, call cb once all finish
function parallel(tasks, cb) {
  const results = [];
  let remaining = tasks.length;
  let finished = false;
  tasks.forEach((task, i) => {
    task((err, value) => {
      if (finished) return;            // ignore late results after a failure
      if (err) { finished = true; return cb(err); }
      results[i] = value;
      if (--remaining === 0) cb(null, results);
    });
  });
}

parallel(
  [
    (cb) => setTimeout(() => cb(null, "a"), 50),
    (cb) => setTimeout(() => cb(null, "b"), 10),
  ],
  (err, [a, b]) => console.log(err, a, b) // null, "a", "b"
);

// 2. SEQUENTIAL (pyramid): do step1 → step2 → step3, fail-fast
step1((e, r1) => {
  if (e) return console.error(e);
  step2(r1, (e, r2) => {
    if (e) return console.error(e);
    step3(r2, (e, r3) => {
      if (e) return console.error(e);
      console.log("all done", r3);
    });
  });
});`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            What bugs hide in your <code>parallel</code>? (A task that calls back twice would corrupt{' '}
            <code>remaining</code>; a task that throws synchronously crashes before any callback; there&apos;s no way
            to cancel. Promises solve the first by settling once &mdash; the others need <code>AbortController</code>{' '}
            and careful try/catch.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a callback?</h4>
            <p className="iq-a">
              A function passed as an argument to another function, to be invoked later &mdash; usually when
              asynchronous work completes. The host queues it (as a macrotask) and the event loop runs it once the
              stack empties. Callbacks are the lowest-level async primitive; promises and <code>await</code> are
              built on top of them.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is &ldquo;callback hell&rdquo; / the pyramid of doom?</h4>
            <p className="iq-a">
              The deeply nested shape that emerges when sequential async steps each need their own callback. Each
              step nests inside the previous one&apos;s callback, pushing code rightward and making control flow hard
              to read and error handling repetitive. It&apos;s a readability and maintainability problem that
              promises and <code>await</code> were designed to fix.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is inversion of control in async code?</h4>
            <p className="iq-a">
              When you pass a callback into a third-party API, you hand it control over <em>when, whether, and how
              many times</em> your code runs &mdash; and with what arguments. The API might call it zero times, twice,
              or synchronously, and you have no guarantee. Promises restore trust by settling exactly once and never
              synchronously.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is the error-first convention?</h4>
            <p className="iq-a">
              Node&apos;s standard callback signature: the callback&apos;s first argument is an error (<code>null</code>{' '}
              on success), with result values following. It lets one callback represent both success and failure, so
              callers always check <code>err</code> first and return early on failure. Most of Node&apos;s core API
              follows it.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). How would you run three async tasks in parallel with callbacks?</h4>
            <p className="iq-a">
              Track a pending counter and a results array. Invoke all three immediately. In each callback, on error,
              call the final callback once (guard against double-invocation); on success, store the result by index,
              decrement pending, and when it hits zero call the final callback with all results. This is exactly what{' '}
              <code>Promise.all</code> does &mdash; the manual version is error-prone (double-callbacks, late
              results, missing cancellation).
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). When are callbacks preferable to promises?</h4>
            <p className="iq-a">
              For <strong>many-shot</strong> events &mdash; <code>addEventListener</code>, stream{' '}
              <code>data</code> events, WebSocket messages. Promises are one-shot (they settle once), so modeling
              repeating signals as promises is awkward. Callbacks (or async iterators) fit naturally where the same
              handler fires repeatedly. One-shot async results, by contrast, are better as promises.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Why did the ecosystem move from callbacks to promises &mdash; what specific guarantees do promises add?</h4>
            <p className="iq-a">
              Promises standardized async-result handling and added hard guarantees callbacks couldn&apos;t enforce:
              (1) a promise settles <em>exactly once</em> &mdash; no double-callback bug; (2) its callback always
              runs <em>asynchronously</em>, as a microtask &mdash; never synchronously, so execution order is
              predictable; (3) errors propagate automatically through a chain to a <code>.catch</code> &mdash; no
              manual <code>err</code> checks at every level; (4) uniform composition &mdash;{' '}
              <code>Promise.all/race/allSettled</code> replace hand-rolled counters and flags; (5) you keep control
              of flow rather than handing it to the API (inversion of control resolved). Together these turned async
              from a convention-dependent mess into a reliable, composable primitive.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
