import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('async-js')!
const navItems = weekNav(week)

export default function AsyncDay4() {
  const { prev, next } = dayNavLinks(week, 4)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[3].title}</h1>
        <p className="lesson-subtitle">
          An object that represents a future value &mdash; with rules. Three states, one transition, and chaining
          that finally flattens the pyramid.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>Promise</strong> is an object representing the eventual result of an async operation. It has
            three states &mdash; <strong>pending</strong>, <strong>fulfilled</strong>, <strong>rejected</strong>{' '}
            &mdash; and settles exactly once.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            You construct one with <code>{'new Promise((resolve, reject) => {...})'}</code>. Consumers attach{' '}
            <code>.then(onFulfilled, onRejected)</code>, <code>.catch(onRejected)</code>, and{' '}
            <code>.finally()</code>. Each <code>.then</code> returns a <em>new</em> promise, enabling chains.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Any one-shot async result: a fetch, a file read, a DB query. Promises replace callbacks for sequential
            async by flattening nesting into a chain and centralizing error handling.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          A promise is a placeholder for a value you don&apos;t have yet. Think of it as an IOU: you get the IOU now,
          and you attach instructions for what to do when it&apos;s honored (or when it bounces). The breakthrough is
          that the IOU is an <strong>object</strong> &mdash; you can store it, pass it, and chain it.
        </p>

        <CodeBlock
          code={`// The callback version (Day 3):
getUser(42, (err, user) => { /* ... */ });

// The promise version:
getUser(42)
  .then((user) => getPosts(user.id))
  .then((posts) => getComments(posts[0].id))
  .then((comments) => render(comments))
  .catch((err) => console.error(err));
// Flat, linear, one error handler for the whole chain.`}
          filename="callback-vs-promise.js"
        />

        <p className="article-para">
          Same three sequential steps that nested into a pyramid yesterday now read top-to-bottom, with one{' '}
          <code>.catch</code> catching a failure anywhere. That&apos;s the whole pitch &mdash; and it works because
          promises obey a small, strict set of rules.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Pending</dt>
            <dd className="def-text">
              The initial state &mdash; the operation hasn&apos;t finished. The promise is neither fulfilled nor
              rejected.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Fulfilled</dt>
            <dd className="def-text">
              The operation succeeded; the promise has a value. Settled (terminal state). Triggers{' '}
              <code>onFulfilled</code> handlers.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Rejected</dt>
            <dd className="def-text">
              The operation failed; the promise has a reason (usually an Error). Settled. Triggers{' '}
              <code>onRejected</code> handlers.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Pager Analogy</h2>
        <p className="article-para">
          A promise is like a restaurant buzzer. You place an order and get a buzzer <em>now</em> &mdash; not the
          food. The buzzer is in one of three states: <strong>waiting</strong> (pending),{' '}
          <strong>glowing green</strong> (fulfilled &mdash; pick up your food), or <strong>red</strong> (rejected
          &mdash; they ran out). Once it changes, it never changes back. You can walk around, do other things, and
          the buzzer will notify you exactly once.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">📟</span>
            <span className="analogy-label">The buzzer</span>
            <span className="analogy-target">The Promise object</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🟢</span>
            <span className="analogy-label">Glowing green</span>
            <span className="analogy-target">Fulfilled (has a value)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔴</span>
            <span className="analogy-label">Flashing red</span>
            <span className="analogy-target">Rejected (has a reason)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔁</span>
            <span className="analogy-label">It never changes again</span>
            <span className="analogy-target">Settles exactly once</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The buzzer settles <strong>once</strong> &mdash; this is the guarantee that solves Day 3&apos;s inversion
            of control. Unlike a raw callback, a promise cannot fire your handler twice, or zero times after it
            settles. And handlers <em>always</em> run asynchronously, as microtasks &mdash; never synchronously,
            giving you predictable ordering.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; States, Settlement, and Chaining</h2>
        <p className="article-para">
          A promise&apos;s power comes from a few strict rules. Memorize them &mdash; every promise interview
          question tests one of them.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Three states, one-way transitions</h4>
            <p className="theory-desc">
              pending &rarr; fulfilled, or pending &rarr; rejected. Once settled, it stays settled forever. Calling{' '}
              <code>resolve</code> or <code>reject</code> again is a silent no-op.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Handlers run asynchronously, as microtasks</h4>
            <p className="theory-desc">
              Even an already-settled promise&apos;s <code>.then</code> callback never runs synchronously &mdash; it
              queues as a microtask. This guarantees predictable ordering (Day 2).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>.then</code> returns a new promise</h4>
            <p className="theory-desc">
              This is what enables chaining. The new promise settles based on what your handler returns: a value
              fulfills it; a thrown error rejects it; a returned promise adopts that promise&apos;s state.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Errors skip to the next <code>.catch</code></h4>
            <p className="theory-desc">
              A rejection propagates down the chain, bypassing <code>.then</code> handlers, until a{' '}
              <code>.catch</code> (or <code>.then(_, onRejected)</code>) handles it. One <code>.catch</code> covers
              the whole chain above it.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The unwrapping rule (the key to chaining)</h3>
        <p className="article-para">
          When a <code>.then</code> handler returns a value, the next promise fulfills with that value. When it
          returns <em>another promise</em>, the next promise doesn&apos;t fulfill with the promise object &mdash; it{' '}
          <strong>waits for and adopts</strong> the inner promise&apos;s state. This automatic unwrapping is what lets
          you chain <code>getUser().then(getPosts).then(getComments)</code> without nested access.
        </p>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Handler returns a plain value</span>
            <p className="phase-desc">Next promise fulfills with that value.</p>
            <ul className="phase-rules">
              <li><code>return 5;</code> &rarr; next fulfills with <code>5</code></li>
              <li><code>return {`{ a: 1 }`};</code> &rarr; fulfills with the object</li>
              <li><code>return;</code> &rarr; fulfills with <code>undefined</code></li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Handler returns a promise (or thenable)</span>
            <p className="phase-desc">Next promise adopts the inner promise&apos;s state.</p>
            <ul className="phase-rules">
              <li>Returns a fulfilled promise &rarr; next fulfills with its value</li>
              <li>Returns a rejected promise &rarr; next rejects with its reason</li>
              <li>Returns a pending promise &rarr; next waits</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            A thrown error inside any <code>.then</code> handler rejects the next promise with that error &mdash; so
            it propagates down the chain just like an explicit <code>reject</code>. This is why{' '}
            <code>.catch</code> works uniformly for both async failures and handler bugs. (Day 5 maps this onto{' '}
            <code>try/catch</code>.)
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; The Promises/A+ Standard</h2>
        <p className="article-para">
          Promise-like objects appeared in JS libraries as early as 2007 (MochiKit, jQuery&apos;s{' '}
          <code>Deferred</code>, Q). Each behaved slightly differently, breaking interoperability. The{' '}
          <strong>Promises/A+ spec</strong> (2012) standardized the <code>.then</code> mechanics &mdash; states,
          unwrapping, async scheduling &mdash; so any compliant promise could interoperate. ES6 (2015) adopted this
          as the native <code>Promise</code>, making it the lingua franca: <code>fetch</code>,{' '}
          <code>async/await</code>, and modern APIs all return native promises.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Callbacks</th>
                <th>Promises</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Represents</td>
                <td>A function to call</td>
                <td>A future value (object)</td>
              </tr>
              <tr>
                <td>Invoked how many times</td>
                <td>Caller&apos;s choice (0, 1, many)</td>
                <td>Exactly once after settling</td>
              </tr>
              <tr>
                <td>When handler runs</td>
                <td>Whenever caller invokes</td>
                <td>Always async (microtask)</td>
              </tr>
              <tr>
                <td>Sequential composition</td>
                <td>Nested (pyramid)</td>
                <td>Chained (flat)</td>
              </tr>
              <tr>
                <td>Error propagation</td>
                <td>Manual per step</td>
                <td>Automatic to <code>.catch</code></td>
              </tr>
              <tr>
                <td>Parallel composition</td>
                <td>Hand-rolled counters</td>
                <td><code>Promise.all</code> etc.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Promise Chain</h2>

        <CodeBlock
          code={`new Promise((resolve) => {
  console.log("1: executor runs synchronously");
  resolve(10);
})
  .then((v) => { console.log("2:", v); return v + 5; })   // 2: 10
  .then((v) => { console.log("3:", v); return Promise.resolve(v * 2); }) // 3: 15
  .then((v) => { console.log("4:", v); })                  // 4: 30
  .catch((e) => { console.log("err:", e); });
console.log("5: end of sync code");`}
          filename="trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              The <code>new Promise</code> executor runs <strong>synchronously</strong> right now: prints{' '}
              <code>1: executor...</code>, then <code>resolve(10)</code> settles it as fulfilled with <code>10</code>.
              The <code>.then</code> calls register handlers but don&apos;t run them yet.
            </span>
          </li>
          <li>
            <span>
              <code>console.log("5...")</code> runs &rarr; prints <code>5: end of sync code</code>. The stack is now
              empty.
            </span>
          </li>
          <li>
            <span>
              Microtask checkpoint: the first <code>.then</code> runs with <code>v = 10</code> &rarr; prints{' '}
              <code>2: 10</code>, returns <code>15</code>. The second promise fulfills with <code>15</code>.
            </span>
          </li>
          <li>
            <span>
              Next microtask: second <code>.then</code> with <code>v = 15</code> &rarr; prints <code>3: 15</code>,
              returns a <em>promise</em>. The third promise <strong>waits</strong> for it, then adopts its fulfilled
              value <code>30</code>.
            </span>
          </li>
          <li>
            <span>
              Next microtask: third <code>.then</code> with <code>v = 30</code> &rarr; prints <code>4: 30</code>. No
              rejection, so <code>.catch</code> never runs.
            </span>
          </li>
          <li>
            <span>
              Final order: <code>1, 5, 2, 3, 4</code>. Sync executor first, sync <code>5</code> next, then the chain
              unwinds as a sequence of microtasks &mdash; one per <code>.then</code>.
            </span>
          </li>
        </ol>

        <p className="article-para">
          Note the two surprises: the executor is <strong>synchronous</strong> (only the handlers are async), and
          each <code>.then</code> is its own microtask &mdash; which is why chains interleave with other microtasks
          (Day 2, Q6).
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Constructing and consuming</h3>
        <CodeBlock
          code={`const p = new Promise((resolve, reject) => {
  // do something async, then settle exactly once:
  setTimeout(() => {
    if (Math.random() < 0.3) reject(new Error("failed"));
    else resolve("success");
  }, 100);
});

p.then((val) => console.log("ok", val))
 .catch((err) => console.log("err", err.message))
 .finally(() => console.log("settled")); // runs regardless, no value passed`}
          filename="basic.js"
        />

        <h3 className="article-h3">2. Chaining with unwrapping</h3>
        <CodeBlock
          code={`fetchUser(1)               // returns Promise<user>
  .then((user) => fetchPosts(user.id))  // returns Promise<posts>
  .then((posts) => posts[0])            // returns a plain value
  .then((post) => fetchComments(post.id)) // returns Promise<comments>
  .then((comments) => render(comments))
  .catch((err) => showError(err));
// Each .then flattens the inner promise — no nesting.`}
          filename="chaining.js"
        />

        <h3 className="article-h3">3. Settles once &mdash; later calls are no-ops</h3>
        <CodeBlock
          code={`const p = new Promise((resolve, reject) => {
  resolve("first");   // settles as fulfilled with "first"
  resolve("second");  // ignored — already settled
  reject("nope");     // ignored — already settled
});
p.then((v) => console.log(v)); // "first"`}
          filename="once.js"
        />

        <h3 className="article-h3">4. Always async, even when already settled</h3>
        <CodeBlock
          code={`const p = Promise.resolve("done"); // already fulfilled
console.log("before");
p.then((v) => console.log(v)); // runs as a MICROTASK, not now
console.log("after");
// logs: before, after, done  — never before, done, after`}
          filename="always-async.js"
        />

        <h3 className="article-h3">5. Static helpers (full set on Day 6)</h3>
        <CodeBlock
          code={`Promise.resolve(42);          // already-fulfilled promise
Promise.reject(new Error("x")); // already-rejected promise
Promise.all([p1, p2, p3]);     // all-or-nothing, in order
Promise.race([fast, slow]);    // first to settle wins
Promise.allSettled([p1, p2]);  // waits for all, never rejects
Promise.any([p1, p2]);         // first fulfilled wins`}          filename="statics.js"
        />

        <h3 className="article-h3">6. Promisifying a callback API</h3>
        <CodeBlock
          code={`// Turn an error-first callback fn into a promise-returning one.
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
}

const readFileP = promisify(require("fs").readFile);
readFileP("a.txt", "utf8").then((text) => console.log(text));`}
          filename="promisify.js"
        />

        <div className="article-callout">
          <p>
            Creating a promise you never settle, or rejecting with a non-<code>Error</code> value, are the two
            classic footguns. An unsettled promise&apos;s handlers never run (a silent hang); a rejected non-Error
            loses its stack trace. Always <code>reject(new Error(...))</code> and ensure every code path settles.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Implement a small promise-based API: <code>delay(ms)</code> that resolves after <code>ms</code>,{' '}
            <code>randomFail(p)</code> that rejects with probability <code>p</code>, and a chain that does three
            sequential steps with a single <code>.catch</code>. Then write <code>promisify</code> for an error-first
            function and use it.
          </p>
        </div>

        <CodeBlock
          code={`const delay = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const randomFail = (p) => new Promise((resolve, reject) => {
  Math.random() < p ? reject(new Error("unlucky")) : resolve("ok");
});

delay(200, 1)
  .then((id) => { console.log("got", id); return delay(200, id + 1); })
  .then((id) => { console.log("got", id); return randomFail(0.3); })
  .then(() => console.log("all steps ok"))
  .catch((err) => console.error("a step failed:", err.message))
  .finally(() => console.log("done"));

// promisify an error-first fn:
function legacy(cb) { setTimeout(() => cb(null, "data"), 50); }
const promisify = (fn) => (...args) =>
  new Promise((resolve, reject) =>
    fn(...args, (err, val) => (err ? reject(err) : resolve(val)))
  );
promisify(legacy)().then((d) => console.log(d)); // "data"`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            If you add a <code>.then</code> after the <code>.catch</code>, does it run on failure? (Yes &mdash;{' '}
            <code>.catch</code> returns a new promise that fulfills with whatever the handler returns, so the chain
            <em> recovers</em>. A handler after a catch runs in both success and recovered-failure cases. This is
            &ldquo;recovery&rdquo; and it trips people up constantly.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a promise and what are its states?</h4>
            <p className="iq-a">
              An object representing the eventual result of an async operation. It has three states &mdash; pending,
              fulfilled, rejected &mdash; and transitions only from pending to one of the settled states, once,
              permanently. Fulfillment carries a value; rejection carries a reason.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Can a promise settle more than once?</h4>
            <p className="iq-a">
              No. Once pending &rarr; fulfilled or pending &rarr; rejected, the state and value/reason are frozen.
              Subsequent <code>resolve</code>/<code>reject</code> calls are silently ignored. This &ldquo;settles
              exactly once&rdquo; guarantee is what resolves the callback inversion-of-control problem.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. How does promise chaining work?</h4>
            <p className="iq-a">
              Each <code>.then</code> (and <code>.catch</code>/<code>.finally</code>) returns a <em>new</em> promise.
              Its state depends on what the handler returns: a plain value fulfills it; a thrown error rejects it; a
              returned promise is adopted (the new promise waits and mirrors its state). This unwrapping lets you
              chain async steps flatly without nesting.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Are promise handlers synchronous or asynchronous?</h4>
            <p className="iq-a">
              Asynchronous &mdash; always. They run as microtasks, even if the promise was already settled when the
              handler was attached. This guarantees the handler never runs during the current task, so execution order
              stays predictable. It also means <code>Promise.resolve().then(f)</code> defers <code>f</code> to after
              the current synchronous code.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Difference between <code>.then(a, b)</code> and <code>.then(a).catch(b)</code>?</h4>
            <p className="iq-a">
              Position. <code>.then(a, b)</code> handles rejections from <em>upstream</em> only &mdash; if <code>a</code>{' '}
              throws, <code>b</code> does <em>not</em> catch it (they&apos;re peers on the same level).{' '}
              <code>.then(a).catch(b)</code> puts <code>b</code> one step <em>after</em> <code>a</code>, so it catches
              errors thrown by <code>a</code> too. In practice <code>.catch</code> is preferred precisely because it
              covers handler errors as well as upstream rejections.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Output and why?</h4>
            <CodeBlock
              code={`Promise.resolve(1)
  .then((v) => v + 1)
  .then((v) => { throw v; })
  .then((v) => console.log("A", v))
  .catch((e) => console.log("B", e))
  .then((v) => console.log("C", v));`}
              filename="q6.js"
            />
            <p className="iq-a">
              Logs <code>B 2</code> then <code>C undefined</code>. The third <code>.then</code> throws <code>2</code>,
              rejecting its promise; the <code>then(log A)</code> is skipped (rejections bypass{' '}
              <code>onFulfilled</code>); <code>.catch</code> logs <code>B 2</code> and returns{' '}
              <code>undefined</code>, so its promise <em>fulfills</em>; the final <code>.then</code> logs{' '}
              <code>C undefined</code>. The chain recovered after the catch &mdash; a common surprise.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What is a &ldquo;thenable&rdquo; and why does it matter?</h4>
            <p className="iq-a">
              A thenable is any object with a <code>.then</code> method &mdash; not necessarily a real{' '}
              <code>Promise</code>. The promise resolution procedure treats thenables specially: when a handler
              returns a thenable, the new promise calls its <code>.then</code> to adopt its state, rather than
              fulfilling with the object itself. This enabled interoperability between different promise libraries
              (jQuery <code>Deferred</code>, Q) before native promises existed, and underpins <code>Promise.resolve</code>{' '}
              assimilation. It also means returning a plain object that happens to have a <code>.then</code> property
              can cause surprising async behavior &mdash; a subtle footgun.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
