import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('async-js')!
const navItems = weekNav(week)

export default function AsyncDay5() {
  const { prev, next } = dayNavLinks(week, 5)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[4].title}</h1>
        <p className="lesson-subtitle">
          Syntactic sugar over promises that makes async code read like synchronous code. Same machinery, friendlier
          surface.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <code>async</code> marks a function that <em>always</em> returns a promise. <code>await</code> pauses the
            function until a promise settles, then resumes with its value (or throws on rejection). Together they
            desugar to promise <code>.then</code> chains.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            An <code>async</code> function body is split at each <code>await</code> into separate microtask
            continuations. The part after <code>await</code> becomes a <code>.then</code> handler; a rejected awaited
            promise becomes a thrown error you catch with <code>try/catch</code>.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            For sequential async logic with error handling &mdash; the common case. Use <code>.then</code> chains or
            combinators (Day 6) when you need parallelism; <code>await</code> when you need readable step-by-step
            flow.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          <code>async/await</code> adds nothing new to the runtime. It is syntax sugar: the engine rewrites your code
          into the promise chains from yesterday. The payoff is that the result <em>reads</em> top-to-bottom like
          synchronous code, with normal <code>try/catch</code> for errors.
        </p>

        <CodeBlock
          code={`// Promise chain (Day 4):
function load() {
  return getUser(1)
    .then((u) => getPosts(u.id))
    .then((p) => getComments(p[0].id))
    .then(render)
    .catch(handleError);
}

// async/await — same logic, far more readable:
async function load() {
  try {
    const user = await getUser(1);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    render(comments);
  } catch (err) {
    handleError(err);
  }
}`}
          filename="chain-vs-await.js"
        />

        <p className="article-para">
          The two are functionally equivalent. <code>await getUser(1)</code> suspends <code>load</code> until the
          promise settles, then resumes with the value. A rejection becomes a throw caught by <code>try/catch</code>.
          The magic is that suspension happens without blocking the thread &mdash; other tasks keep running.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term"><code>async</code> function</dt>
            <dd className="def-text">
              A function that always returns a Promise. If you return a value, it&apos;s wrapped in a resolved
              promise; if you return a promise, it&apos;s returned as-is; if you throw, the returned promise rejects.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>await</code></dt>
            <dd className="def-text">
              Pauses the enclosing <code>async</code> function until the operand promise settles. Resumes with the
              fulfilled value, or throws the rejection reason (catchable with <code>try/catch</code>).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Top-level <code>await</code></dt>
            <dd className="def-text">
              Using <code>await</code> outside an <code>async</code> function, at the module top level. Allowed in
              ES modules; lets a module&apos;s imports wait for async initialization.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The &ldquo;Bookmark&rdquo; Analogy</h2>
        <p className="article-para">
          Reading a <code>.then</code> chain is like passing instructions through a chain of assistants &mdash; each
          hands off to the next. <code>await</code> is like putting a <strong>bookmark</strong> in your book and
          closing it. You (the function) pause, the library (the thread) serves other readers, and when your
          reserved book arrives you reopen to the bookmark and continue reading as if nothing happened.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🔖</span>
            <span className="analogy-label">The bookmark</span>
            <span className="analogy-target">The suspension point at <code>await</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📖</span>
            <span className="analogy-label">You, paused</span>
            <span className="analogy-target">The async function, suspended</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📚</span>
            <span className="analogy-label">Library serves others</span>
            <span className="analogy-target">Thread keeps running other tasks</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">▶️</span>
            <span className="analogy-label">Reopen at bookmark</span>
            <span className="analogy-target">Resumes as a microtask with the value</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            &ldquo;Pause&rdquo; here means the <em>function</em> suspends &mdash; not the <em>thread</em>. The call
            stack frame for the async function is released on <code>await</code>; control returns to the caller
            immediately with a promise. When the awaited promise settles, the function resumes as a microtask. That is
            why <code>await</code> never blocks &mdash; nothing is actually waiting on the call stack.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Desugaring</h2>
        <p className="article-para">
          To truly understand <code>async/await</code>, see what the compiler turns it into. Everything below is the
          promise machinery from Day 4 &mdash; <code>await</code> is just a friendlier way to write it.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. <code>async</code> wraps the return</h4>
            <p className="theory-desc">
              <code>{'async () => 5'}</code> is equivalent to <code>{'() => Promise.resolve(5)'}</code>. Returning a
              promise returns it unwrapped; throwing rejects the implicit promise.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>await</code> splits the function</h4>
            <p className="theory-desc">
              Code before an <code>await</code> runs synchronously up to it. The code after becomes a{' '}
              <code>.then</code> continuation that runs as a microtask when the awaited promise settles.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Rejection &rarr; throw</h4>
            <p className="theory-desc">
              Awaiting a rejected promise throws its reason inside the function, where <code>try/catch</code> catches
              it. This is why async error handling finally looks normal.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Non-promise <code>await</code> still defers</h4>
            <p className="theory-desc">
              <code>await 5</code> wraps <code>5</code> in a resolved promise and still schedules the continuation as
              a microtask. So <code>await</code> always yields control, even on a plain value.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The desugaring in code</h3>
        <CodeBlock
          code={`// async/await:
async function f() {
  const a = await step1();      // (A)
  const b = await step2(a);     // (B)
  return b;
}

// roughly desugars to a promise chain:
function f() {
  return step1()                  // up to (A) runs sync, returns promise
    .then((a) => step2(a))        // (A)→(B) becomes a .then
    .then((b) => b);              // (B)→return becomes another .then
}
// try/catch around the awaits desugars to a .catch on the chain.`}
          filename="desugar.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">What <code>await</code> does</span>
            <p className="phase-desc">Suspends the function; resumes later as a microtask.</p>
            <ul className="phase-rules">
              <li>Yields control to caller immediately</li>
              <li>Resumes after the promise settles</li>
              <li>Throws on rejection</li>
              <li>Always defers, even for non-promises</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">What <code>await</code> does <em>not</em> do</span>
            <p className="phase-desc">It never blocks the thread or the event loop.</p>
            <ul className="phase-rules">
              <li>Doesn&apos;t freeze the page</li>
              <li>Doesn&apos;t pause other functions</li>
              <li>Doesn&apos;t block the call stack</li>
              <li>Isn&apos;t a sleep &mdash; only awaits settle</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Because <code>await</code> desugars to <code>.then</code>, everything you learned in Day 4 carries over:
            resumption happens as a microtask (Day 2 ordering rules apply), errors propagate, and a returned promise
            is adopted. The async function is, mechanically, a promise-returning function whose body is a chain.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why <code>async/await</code> Arrived</h2>
        <p className="article-para">
          Promises (2015) flattened the pyramid but chains still read inside-out and error handling used{' '}
          <code>.catch</code> rather than <code>try/catch</code>. <code>async/await</code> (ES2017) &mdash; inspired
          by C# &mdash; lets you write promise-based code that looks synchronous, restoring <code>try/catch</code> and
          linear flow. It changed no semantics: an <code>async</code> function still returns a promise, and{' '}
          <code>await</code> still rides on microtasks. Later, top-level <code>await</code> (ES2022) extended it to
          module scope.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Promises (<code>.then</code>)</th>
                <th><code>async/await</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Readability</td>
                <td>Inside-out chains</td>
                <td>Linear, looks sync</td>
              </tr>
              <tr>
                <td>Error handling</td>
                <td><code>.catch</code></td>
                <td><code>try/catch</code></td>
              </tr>
              <tr>
                <td>Conditionals/loops</td>
                <td>Awkward in chains</td>
                <td>Native <code>if</code>/<code>for</code></td>
              </tr>
              <tr>
                <td>Stack traces</td>
                <td>Across microtask boundaries</td>
                <td>Engine reconstructs (better in await)</td>
              </tr>
              <tr>
                <td>Parallelism</td>
                <td>Natural (<code>Promise.all</code>)</td>
                <td>Needs explicit <code>Promise.all</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing an <code>async</code> Function</h2>

        <CodeBlock
          code={`async function run() {
  console.log("A");              // (1) sync, before any await
  const x = await delay(10);     // (2) suspend here
  console.log("C", x);           // (4) resumes after settle
}
function delay(v) {
  return new Promise((r) => setTimeout(() => r(v), 0));
}
run();
console.log("B");                // (3)`}
          filename="trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>run()</code> is called. Because it&apos;s <code>async</code>, calling it returns a promise
              immediately &mdash; but the body starts running synchronously. Prints <code>A</code>.
            </span>
          </li>
          <li>
            <span>
              Hits <code>await delay(10)</code>. <code>delay(10)</code> returns a promise; <code>run</code> attaches a
              continuation (the rest of the body) to it and <strong>suspends</strong>. Control returns to the caller,
              with <code>run</code>&apos;s promise pending.
            </span>
          </li>
          <li>
            <span>
              The caller continues: <code>console.log("B")</code> runs &rarr; prints <code>B</code>. Stack empties.
            </span>
          </li>
          <li>
            <span>
              The timer (0ms) elapses; <code>resolve(10)</code> settles <code>delay</code>&apos;s promise. The engine
              queues <code>run</code>&apos;s continuation as a <strong>microtask</strong>.
            </span>
          </li>
          <li>
            <span>
              Microtask runs: <code>x</code> is <code>10</code>, prints <code>C 10</code>. <code>run</code> returns
              (implicitly <code>undefined</code>), so its promise fulfills.
            </span>
          </li>
          <li>
            <span>
              Final order: <code>A, B, C</code>. The await inserted a yield between <code>A</code> and{' '}
              <code>C</code>, letting <code>B</code> run &mdash; even though <code>B</code> is written after{' '}
              <code>run()</code>.
            </span>
          </li>
        </ol>

        <p className="article-para">
          This is the key insight: an <code>async</code> function is synchronous <em>up to its first{' '}
          <code>await</code></em>, then everything after runs as microtask continuations. Code after an{' '}
          <code>await</code> is always deferred.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. <code>async</code> always returns a promise</h3>
        <CodeBlock
          code={`async function f1() { return 5; }       // returns Promise<5>
async function f2() { return Promise.resolve(6); } // returns the same promise
async function f3() { throw new Error("x"); }      // returns a rejected promise

f1().then((v) => console.log(v));  // 5
f3().catch((e) => console.log(e.message)); // "x"
// Even returning undefined gives Promise<undefined>.`}
          filename="async-returns.js"
        />

        <h3 className="article-h3">2. Error handling with <code>try/catch</code></h3>
        <CodeBlock
          code={`async function load() {
  try {
    const user = await getUser(1);  // may reject
    const posts = await getPosts(user.id);
    return posts;
  } catch (err) {
    console.error("Something failed:", err.message);
    return [];                      // recover
  } finally {
    hideSpinner();                  // always runs
  }
}`}
          filename="try-catch.js"
        />

        <h3 className="article-h3">3. Sequential vs parallel (the classic mistake)</h3>
        <CodeBlock
          code={`// SEQUENTIAL — slow: each await waits for the previous
async function slow() {
  const a = await fetch("/a"); // 1s
  const b = await fetch("/b"); // 1s
  const c = await fetch("/c"); // 1s
  return [a, b, c];            // ~3s total
}

// PARALLEL — fast: start all, then await together
async function fast() {
  const [a, b, c] = await Promise.all([
    fetch("/a"),               // start all at once
    fetch("/b"),
    fetch("/c"),
  ]);                          // ~1s total
  return [a, b, c];
}`}
          filename="seq-vs-par.js"
        />

        <h3 className="article-h3">4. Looping with <code>await</code></h3>
        <CodeBlock
          code={`// for...of awaits each iteration — sequential, fine for order-dependent steps
async function process(urls) {
  for (const url of urls) {
    const data = await fetch(url);
    console.log(data);
  }
}

// CAUTION: .forEach does NOT await — callbacks fire in parallel, unhandled:
async function buggy(urls) {
  urls.forEach(async (url) => {
    await fetch(url); // not awaited by the loop!
  });
  console.log("done"); // prints before fetches finish
}
// Use for...of (or Promise.all with .map) instead of .forEach with await.`}
          filename="loops.js"
        />

        <h3 className="article-h3">5. Top-level <code>await</code> (ES modules)</h3>
        <CodeBlock
          code={`// In an ES module (type: "module"), you can await at the top level:
const config = await fetch("/config").then((r) => r.json());
export const PORT = config.port;
// Importers of this module wait for it to finish initializing.
// Not allowed inside CommonJS or non-module scripts — wrap in an async fn.`}
          filename="top-level.js"
        />

        <h3 className="article-h3">6. Awaiting non-promises still defers</h3>
        <CodeBlock
          code={`async function f() {
  console.log("before");
  const x = await 5;          // \`5\` wrapped in Promise.resolve(5)
  console.log("after", x);
}
f();
console.log("sync");
// logs: before, sync, after 5
// The await yields even though there's nothing to wait for.`}
          filename="await-value.js"
        />

        <div className="article-callout">
          <p>
            The two classic bugs: awaiting independent operations in sequence when you could parallelize (slow), and
            using <code>.forEach</code>/<code>.map</code> callbacks that <code>await</code> without the outer function
            waiting (lost control). Rule of thumb: if the steps are independent, <code>Promise.all</code> them; if
            they&apos;re order-dependent, a <code>for...of</code> loop with <code>await</code> is correct and readable.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Write <code>loadProfile(userId)</code> that fetches a user, then their posts and friends in parallel, then
            returns a combined object &mdash; with <code>try/catch</code> handling any failure. Then deliberately
            introduce the sequential/parallel bug and the <code>.forEach</code> bug, observe the timing/behavior, and
            fix them.
          </p>
        </div>

        <CodeBlock
          code={`async function loadProfile(userId) {
  try {
    const user = await fetchUser(userId);
    // posts and friends are independent → parallel
    const [posts, friends] = await Promise.all([
      fetchPosts(user.id),
      fetchFriends(user.id),
    ]);
    return { user, posts, friends };
  } catch (err) {
    console.error("loadProfile failed:", err.message);
    return null;
  }
}

// The parallel bug (avoid):
//   const posts = await fetchPosts(user.id);
//   const friends = await fetchFriends(user.id); // runs only AFTER posts
// Fix: Promise.all([fetchPosts(...), fetchFriends(...)]) then await.

// The forEach bug (avoid):
//   ids.forEach(async (id) => await process(id)); // not awaited!
// Fix: for (const id of ids) { await process(id); }
//   or await Promise.all(ids.map((id) => process(id)));`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            What does <code>loadProfile</code> return &mdash; the object or a promise? (A promise. Because the
            function is <code>async</code>, the returned object is wrapped: <code>Promise&lt;{`{ user, posts, friends }`}&gt;</code>.
            Callers must <code>await</code> or <code>.then</code> it. There is no way for an <code>async</code>{' '}
            function to return a bare value.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is <code>async/await</code>?</h4>
            <p className="iq-a">
              Syntactic sugar over promises. An <code>async</code> function always returns a promise;{' '}
              <code>await</code> pauses the function until a promise settles, then resumes with its value or throws its
              rejection. It desugars to <code>.then</code> chains, letting async code read like synchronous code with
              normal <code>try/catch</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Does <code>await</code> block the thread?</h4>
            <p className="iq-a">
              No. It suspends the <em>async function</em> (releasing its stack frame) and returns control to the
              caller with a pending promise. The thread keeps running other tasks. When the awaited promise settles,
              the function&apos;s continuation is scheduled as a microtask. Nothing on the call stack waits &mdash;
              that&apos;s the whole point.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What does an <code>async</code> function without <code>await</code> do?</h4>
            <p className="iq-a">
              It still returns a promise. Whatever it returns is wrapped: a value becomes a fulfilled promise, a
              thrown error becomes a rejection, a returned promise passes through. Without <code>await</code> the body
              runs fully synchronously before the implicit return, but the result is still promise-wrapped.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Can you <code>await</code> a non-promise?</h4>
            <p className="iq-a">
              Yes &mdash; it wraps the value in <code>Promise.resolve</code> and resolves to it. But it still{' '}
              <em>defers</em> the continuation to a microtask, so <code>await 5</code> yields control even though
              there&apos;s nothing to wait for. Awaiting <code>undefined</code> is a common no-op pattern.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Why is <code>forEach</code> with <code>await</code> buggy?</h4>
            <CodeBlock
              code={`async function f() {
  [1, 2, 3].forEach(async (n) => { await delay(n); });
  console.log("done");
}`}
              filename="q5.js"
            />
            <p className="iq-a">
              Because <code>forEach</code> ignores the promises its async callbacks return &mdash; it doesn&apos;t{' '}
              <code>await</code> them. So the loop fires all three in parallel and prints <code>done</code>{' '}
              <em>immediately</em>, before any <code>delay</code> finishes. Use a <code>for...of</code> loop (which
              awaits each iteration) for sequential, or <code>Promise.all(arr.map(async ...))</code> for parallel.
              <code> forEach</code> simply has no mechanism to await.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Difference between awaiting sequentially vs <code>Promise.all</code>?</h4>
            <p className="iq-a">
              Sequential <code>await a; await b; await c;</code> runs one after another &mdash; total time is the
              sum. <code>await Promise.all([a, b, c])</code> starts all three concurrently and waits for all to
              finish &mdash; total time is the max. Use sequential when each step depends on the previous; use{' '}
              <code>Promise.all</code> when the operations are independent. The parallel version is dramatically
              faster for independent I/O.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How is <code>async/await</code> implemented under the hood?</h4>
            <p className="iq-a">
              An async function is compiled into a state machine (or generator-style transform) plus a promise chain.
              At each <code>await</code>, the function captures its local state and registers a <code>.then</code>{' '}
              continuation on the awaited promise, then returns its own pending promise. When the awaited promise
              settles, the continuation &mdash; the rest of the body &mdash; runs as a microtask, restoring the saved
              state and resuming. A rejection calls the rejection path, which throws at the <code>await</code> site,
              caught by any enclosing <code>try</code>. Modern engines can also keep stack info across the suspension
              points, which is why await stack traces are more complete than raw <code>.then</code> chains. The entire
              mechanism is promise-based &mdash; no new concurrency primitive, just a transform.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
