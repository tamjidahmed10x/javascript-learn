import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('consolidation')!
const navItems = weekNav(week)

export default function ConsolidationDay2() {
  const { prev, next } = dayNavLinks(week, 2)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[1].title}</h1>
        <p className="lesson-subtitle">
          Today we make yesterday&apos;s skeleton spec-compliant: async handlers, <code>then</code> returns a promise,
          unwrapping, and <code>catch</code>/<code>finally</code>. The four rules that make a real promise.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            We upgrade yesterday&apos;s <code>MyPromise</code> with: (1) <strong>async</strong> handler scheduling
            (microtasks), (2) <code>then</code> <strong>returns a new promise</strong> (chaining), (3){' '}
            <strong>unwrapping</strong> returned promises, (4) <code>catch</code>/<code>finally</code>.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Wrap handler invocation in <code>queueMicrotask</code>. Make <code>then</code> create a new{' '}
            <code>MyPromise</code> whose settle is driven by the handler&apos;s result: a value fulfills it, a throw
            rejects it, a returned promise is adopted.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            This completes the from-scratch build &mdash; a working, chainable, spec-shaped promise. The unwrapping rule
            is the subtle crown jewel and the most common interview follow-up.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Yesterday&apos;s skeleton settles and notifies &mdash; but synchronously, and without chaining. Today we add
          the four behaviors that make it a <em>real</em> promise. The result: <code>MyPromise</code> that supports{' '}
          <code>.then().then()</code> chains, runs handlers asynchronously, and unwraps returned promises &mdash; matching
          the Promises/A+ contract.
        </p>

        <CodeBlock
          code={`// After today, this works on MyPromise:
new MyPromise((r) => r(1))
  .then((v) => v + 1)                  // 2 — chaining
  .then((v) => new MyPromise((r) => r(v * 10))) // unwrapping
  .then((v) => console.log(v))         // 20
  .catch((e) => console.error(e));     // error path
// Handlers run as microtasks, not inline.`}
          filename="intro.js"
        />

        <p className="article-para">
          Each upgrade is small on its own; together they transform the skeleton into the abstraction you use daily.
          The key new idea is the <strong>resolution procedure</strong> &mdash; what happens to the new promise when a{' '}
          <code>then</code> handler returns. Master that and you understand promises completely.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Async scheduling</dt>
            <dd className="def-text">
              Handlers always run as microtasks (<code>queueMicrotask</code>), never inline &mdash; even on an
              already-settled promise. Guarantees predictable ordering (Week 4 Day 2).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Chaining</dt>
            <dd className="def-text">
              <code>then</code> returns a <em>new</em> promise whose state is determined by what the handler returns or
              throws. This is what flattens callback pyramids into chains.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Unwrapping (the resolution procedure)</dt>
            <dd className="def-text">
              If a handler returns a promise (or thenable), the new promise <em>adopts</em> its state &mdash; waits for
              it, then fulfills/rejects with its outcome. The rule that makes <code>.then(fetchX).then(fetchY)</code>{' '}
              work.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Pass-through</dt>
            <dd className="def-text">
              A missing <code>onFulfilled</code>/<code>onRejected</code> forwards the value/reason unchanged down the
              chain &mdash; so errors skip to the next <code>.catch</code> and values flow to the next{' '}
              <code>.then</code>.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Bucket Brigade Analogy</h2>
        <p className="article-para">
          Yesterday&apos;s promise was a one-shot buzzer. Chaining makes it a <strong>bucket brigade</strong>: each
          person (<code>.then</code>) receives a bucket (value), transforms it, and hands a new bucket to the next. If
          someone hands back <em>another brigade line</em> (a returned promise), the next person waits for that whole
          line to finish before proceeding (unwrapping). If someone drops the bucket (throws), it skips down the line
          until someone catches it (<code>.catch</code>).
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🪣</span>
            <span className="analogy-label">Pass the bucket</span>
            <span className="analogy-target">Chaining &mdash; value flows on</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🛗</span>
            <span className="analogy-label">Wait for another line</span>
            <span className="analogy-target">Unwrapping a returned promise</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">⏱️</span>
            <span className="analogy-label">Everyone acts on their own turn</span>
            <span className="analogy-target">Async (microtask) scheduling</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧯</span>
            <span className="analogy-label">Dropped bucket skipped to a catcher</span>
            <span className="analogy-target">Errors &rarr; <code>catch</code></span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The unwrapping rule is the heart of it. When a handler returns a plain value, the next promise fulfills with
            it &mdash; easy. When it returns a <em>promise</em>, the next promise doesn&apos;t fulfill with the promise
            object; it <strong>waits and mirrors</strong> that inner promise&apos;s outcome. That mirroring is what lets
            you chain async operations flatly instead of nesting.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Four Upgrades</h2>
        <p className="article-para">
          Each upgrade maps to one spec rule. Let&apos;s state them precisely before coding.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Always schedule handlers async</h4>
            <p className="theory-desc">
              Wrap every handler call in <code>queueMicrotask(() =&gt; handler(value))</code>. Now even an
              already-settled promise&apos;s <code>then</code> defers &mdash; matching the &ldquo;never synchronous&rdquo;
              rule (Week 4 Day 4).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>then</code> returns a new promise</h4>
            <p className="theory-desc">
              Inside <code>then</code>, create <code>{'new MyPromise((resolve, reject) => {...})'}</code>. Run the handler;
              its result drives <code>resolve</code>/<code>reject</code> of <em>that</em> new promise. Return it.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. The resolution procedure (unwrap)</h4>
            <p className="theory-desc">
              When resolving with a value <code>x</code>: if <code>x</code> is a thenable (has <code>.then</code>), call{' '}
              <code>x.then(resolve, reject)</code> so the new promise adopts <code>x</code>&apos;s state. Otherwise
              fulfill with <code>x</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Pass-through + catch/finally</h4>
            <p className="theory-desc">
              If the relevant handler is missing, forward value/reason: <code>onFulfilled</code> absent &rarr; resolve
              with the value; <code>onRejected</code> absent &rarr; reject with the reason. <code>catch</code> ={' '}
              <code>then(undefined, fn)</code>; <code>finally</code> runs regardless and forwards.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The resolution procedure, visualized</h3>
        <CodeBlock
          code={`// resolvePromise(promise, x, resolve, reject):
function resolvePromise(promise, x, resolve, reject) {
  if (x === promise) return reject(new TypeError("chaining cycle")); // 1
  if (x instanceof MyPromise) return x.then(resolve, reject);        // 2 unwrap
  if (x !== null && typeof x === "object" && typeof x.then === "function") {
    try { x.then((y) => resolvePromise(promise, y, resolve, reject), reject); } // 3 thenable (recurse)
    catch (e) { reject(e); }
    return;
  }
  resolve(x);                                                          // 4 plain value
}`}
          filename="resolve-procedure.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Handler returns a plain value</span>
            <p className="phase-desc">Next promise fulfills with it.</p>
            <ul className="phase-rules">
              <li><code>return 5</code> &rarr; fulfill with 5</li>
              <li><code>return {`{ a: 1 }`}</code> &rarr; fulfill with it</li>
              <li><code>return undefined</code> &rarr; fulfill with undefined</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Handler returns a promise / throws</span>
            <p className="phase-desc">Next promise adopts it / rejects.</p>
            <ul className="phase-rules">
              <li>return fulfilled promise &rarr; fulfill with its value</li>
              <li>return rejected promise &rarr; reject with its reason</li>
              <li>throw &rarr; reject with the error</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The cycle guard (<code>x === promise</code>) matters: resolving a promise with itself would loop forever,
            so the spec rejects with a <code>TypeError</code>. And the &ldquo;thenable&rdquo; branch (3) is why foreign
            promise libraries interoperate &mdash; anything with a <code>.then</code> gets adopted (Week 4 Day 4 Q7).
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Promises/A+ Compliance</h2>
        <p className="article-para">
          The Promises/A+ spec (2012) exists precisely to nail down the resolution procedure and the async-scheduling
          rule &mdash; the two things that let different promise libraries interoperate. Our Day 2 implementation
          follows it: handlers async, <code>then</code> returns a promise, the resolution procedure unwraps thenables,
          pass-through forwards. The full A+ spec has more edge cases (recursion guards, single-call guarantees on{' '}
          <code>then</code>, <code>resolve</code>/<code>reject</code> idempotency) we approximate &mdash; but the core
          is here. Completing it is the proof-of-understanding the spec was designed to enable.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Behavior</th>
                <th>Day 1 skeleton</th>
                <th>Day 2 full</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Settle once, store value</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Handlers async</td>
                <td>No (sync)</td>
                <td>Yes (microtask)</td>
              </tr>
              <tr>
                <td><code>then</code> returns promise</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Unwrapping returned promise</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>catch</code> / <code>finally</code></td>
                <td>No</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Chain with Unwrapping</h2>

        <CodeBlock
          code={`new MyPromise((r) => r(1))
  .then((v) => v + 1)                                  // (A)
  .then((v) => new MyPromise((r) => r(v * 10)))        // (B) returns a promise
  .then((v) => console.log(v));                        // (C)`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              The outer promise fulfills with <code>1</code>. <code>.then(A)</code> creates a new promise P1; when the
              outer settles, A runs (as a microtask) with <code>1</code> &rarr; returns <code>2</code> (a plain value)
              &rarr; P1 fulfills with <code>2</code>.
            </span>
          </li>
          <li>
            <span>
              <code>.then(B)</code> created P2 from P1. P1 fulfilled with <code>2</code>, so B runs with <code>2</code>{' '}
              &rarr; returns <code>new MyPromise(...)</code> (an inner promise P_inner). The resolution procedure sees a
              promise: P2 <strong>adopts</strong> P_inner &mdash; <code>P_inner.then(resolveP2, rejectP2)</code>.
            </span>
          </li>
          <li>
            <span>
              P_inner fulfills with <code>20</code> &rarr; that calls <code>resolveP2(20)</code> &rarr; P2 fulfills with{' '}
              <code>20</code>. (If P_inner were pending, P2 would wait.)
            </span>
          </li>
          <li>
            <span>
              <code>.then(C)</code> created P3 from P2. P2 fulfilled with <code>20</code>, so C runs with <code>20</code>
              &rarr; logs <code>20</code>. Each step is a microtask; the chain unwinds asynchronously but reads
              linearly.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. The full <code>MyPromise</code></h3>
        <CodeBlock
          code={`const PENDING = "pending", FULFILLED = "fulfilled", REJECTED = "rejected";

class MyPromise {
  state = PENDING; value = undefined; callbacks = [];

  constructor(executor) {
    const settle = (state, value) => {
      if (this.state !== PENDING) return;
      this.state = state; this.value = value;
      this.callbacks.forEach((cb) => cb()); // each cb already schedules a microtask
    };
    try { executor((v) => resolvePromise(this, v, settle.bind(null, FULFILLED), settle.bind(null, REJECTED)),
                   (r) => settle(REJECTED, r)); }
    catch (e) { settle(REJECTED, e); }
  }

  then(onFulfilled, onRejected) {
    const p = new MyPromise(() => {});
    const handle = () => queueMicrotask(() => {
      const cb = this.state === FULFILLED ? onFulfilled : onRejected;
      if (typeof cb !== "function") { // pass-through
        if (this.state === FULFILLED) resolvePromise(p, this.value, (v) => p.#doResolve(v), p.#reject);
        else p.#reject(this.value);
        return;
      }
      try {
        const x = cb(this.state === FULFILLED ? this.value : this.value);
        resolvePromise(p, x, (v) => p.#doResolve(v), p.#reject);
      } catch (e) { p.#reject(e); }
    });
    if (this.state === PENDING) this.callbacks.push(handle);
    else handle();
    return p;
  }
  catch(fn) { return this.then(undefined, fn); }
  finally(fn) { return this.then((v) => MyPromise.resolve(fn?.()).then(() => v),
                                 (e) => MyPromise.resolve(fn?.()).then(() => { throw e; })); }

  // helpers (private-ish)
  #reject(r) { if (this.state === PENDING) { this.state = REJECTED; this.value = r; this.callbacks.forEach((c)=>c()); } }
  #doResolve(v) { if (this.state === PENDING) { this.state = FULFILLED; this.value = v; this.callbacks.forEach((c)=>c()); } }
  static resolve(v) { return v instanceof MyPromise ? v : new MyPromise((r) => r(v)); }
  static reject(r) { return new MyPromise((_, rej) => rej(r)); }
}

function resolvePromise(p, x, fulfill, reject) {
  if (x === p) return reject(new TypeError("cycle"));
  if (x instanceof MyPromise) return x.then((v) => resolvePromise(p, v, fulfill, reject), reject); // recurse → flatten
  if (x && typeof x.then === "function") { // generic thenable
    let called = false;
    try {
      x.then(
        (y) => { if (!called) { called = true; resolvePromise(p, y, fulfill, reject); } },
        (r) => { if (!called) { called = true; reject(r); } }
      );
    } catch (e) { if (!called) reject(e); }
    return;
  }
  fulfill(x); // plain value → terminal fulfill (no recursion)
}`}
          filename="full.js"
        />

        <h3 className="article-h3">2. Chaining works</h3>
        <CodeBlock
          code={`MyPromise.resolve(1).then((v) => v + 1).then((v) => v * 10).then((v) => console.log(v)); // 20
// Each .then returns a new promise; values flow through.`}
          filename="chain.js"
        />

        <h3 className="article-h3">3. Unwrapping a returned promise</h3>
        <CodeBlock
          code={`MyPromise.resolve(5)
  .then((v) => new MyPromise((r) => setTimeout(() => r(v * 2), 50))) // returns a promise
  .then((v) => console.log(v)); // 10 (after ~50ms — the chain WAITED for the inner promise)
// Without unwrapping, v would be the promise object, not 10.`}
          filename="unwrap.js"
        />

        <h3 className="article-h3">4. Errors propagate to catch</h3>
        <CodeBlock
          code={`MyPromise.resolve(1)
  .then((v) => { throw new Error("boom"); })
  .then((v) => console.log("skipped"))   // skipped — rejection bypasses onFulfilled
  .catch((e) => console.log(e.message)); // "boom" — caught here`}
          filename="errors.js"
        />

        <h3 className="article-h3">5. Async scheduling confirmed</h3>
        <CodeBlock
          code={`console.log("a");
MyPromise.resolve(1).then(() => console.log("c")); // microtask, after sync
console.log("b");
// logs: a, b, c — handlers never run inline, even on a settled promise.`}
          filename="async.js"
        />

        <h3 className="article-h3">6. <code>finally</code> runs regardless</h3>
        <CodeBlock
          code={`MyPromise.resolve(1)
  .finally(() => console.log("cleanup")) // runs whether fulfilled or rejected
  .then((v) => console.log(v));          // 1 — finally forwarded the value`}
          filename="finally.js"
        />

        <div className="article-callout">
          <p>
            Production promises add more (<code>Promise.all/race/allSettled/any</code>, real microtask integration,
            tighter recursion guards, unhandled-rejection tracking). Our version captures the essential contract.
            Building it once means you&apos;ll never find promises mysterious again &mdash; they&apos;re a state
            machine with a resolution procedure, nothing more.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Extend yesterday&apos;s skeleton into the full <code>MyPromise</code>: add async scheduling, make{' '}
            <code>then</code> return a promise, implement the resolution procedure (unwrapping), and add{' '}
            <code>catch</code>/<code>finally</code> plus <code>static resolve/reject</code>. Verify chaining,
            unwrapping, error propagation, and async ordering all behave like native promises.
          </p>
        </div>

        <CodeBlock
          code={`// Verify these against your MyPromise:
// 1. Chaining + plain values
MyPromise.resolve(1).then(v=>v+1).then(v=>console.log(v)); // 2

// 2. Unwrapping a returned promise
MyPromise.resolve(5).then(v => new MyPromise(r => r(v*2))).then(v => console.log(v)); // 10

// 3. Error propagation + catch
MyPromise.reject(new Error("x")).catch(e => console.log(e.message)); // "x"

// 4. Async ordering
console.log("sync"); MyPromise.resolve().then(()=>console.log("micro")); console.log("end");
// sync, end, micro

// 5. finally forwards value
MyPromise.resolve(7).finally(()=>console.log("clean")).then(v=>console.log(v)); // clean, then 7

// If all five match native Promise behavior, your MyPromise is spec-shaped.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            What breaks if you skip the cycle guard (<code>x === promise</code>)? (An infinite loop: a handler returns
            the very promise being resolved, whose resolution waits for itself &hellip; forever. The spec mandates
            rejecting with <code>TypeError</code> to break it. Edge case, but it shows why the resolution procedure is
            precise about every branch.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. How do you make <code>then</code> chainable?</h4>
            <p className="iq-a">
              Have <code>then</code> create and return a <em>new</em> promise. Inside, run the handler; its return value
              drives the new promise&apos;s <code>resolve</code>, and a thrown error drives its <code>reject</code>. So
              <code> .then(f).then(g)</code> means g receives whatever f returned &mdash; the chain threads one value
              through a sequence of handlers.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is the resolution procedure (unwrapping)?</h4>
            <p className="iq-a">
              When resolving a promise with a value <code>x</code>: if <code>x</code> is the promise itself, reject
              (cycle guard); if <code>x</code> is a promise/thenable, adopt its state &mdash; <code>x.then(resolve,
              reject)</code>, so the outer promise waits and mirrors <code>x</code>; otherwise fulfill with <code>x</code>.
              This makes a handler returning a promise transparently chain instead of nesting.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why must handlers run asynchronously?</h4>
            <p className="iq-a">
              Predictability. If a settled promise&apos;s <code>then</code> ran the handler inline, handler code would
              interleave with the caller&apos;s synchronous code &mdash; surprising order-dependent bugs. The spec
              mandates handlers always run as microtasks (<code>queueMicrotask</code>), so a <code>.then</code> callback
              <em> never</em> executes during the current task, regardless of whether the promise was already settled.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. How do errors reach a <code>catch</code>?</h4>
            <p className="iq-a">
              A thrown error inside a <code>then</code> handler rejects the next promise in the chain. Rejections
              propagate down, skipping each step&apos;s <code>onFulfilled</code>, until a step has an{' '}
              <code>onRejected</code> handler &mdash; <code>catch(fn)</code> is just <code>then(undefined, fn)</code>.
              That handler can return a value to recover (the chain resumes as fulfilled) or re-throw to keep
              propagating.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What is pass-through and why is it needed?</h4>
            <p className="iq-a">
              When a <code>then</code> is called without the relevant handler (e.g., <code>.then(undefined,
              onRejected)</code> or a chain that only has <code>.catch</code>), the value/reason is forwarded unchanged
              to the next promise. This lets errors skip intermediate <code>.then</code>s to reach a <code>.catch</code>,
              and values flow through <code>.catch</code> handlers that don&apos;t apply. Without it, a missing handler
              would swallow the value. Implementation: if <code>onFulfilled</code> isn&apos;t a function, resolve with
              the value; if <code>onRejected</code> isn&apos;t, reject with the reason.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Implement <code>Promise.all</code> using your <code>MyPromise</code>.</h4>
            <p className="iq-a">
              <code>{'static all(iterable) { return new MyPromise((resolve, reject) => { const arr = [...iterable]; const results = new Array(arr.length); let remaining = arr.length; if (remaining === 0) return resolve([]); arr.forEach((p, i) => MyPromise.resolve(p).then((v) => { results[i] = v; if (--remaining === 0) resolve(results); }, reject)); }); }'}</code>{' '}
              Store results by index to preserve order, decrement a counter, resolve on zero, reject fast on any
              rejection. Wrap each input with <code>MyPromise.resolve</code> so non-promises work. Handle empty input.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Why does resolving with a thenable need a single-call guard, and what bug does it prevent?</h4>
            <p className="iq-a">
              The resolution procedure calls <code>x.then(resolve, reject)</code> on the returned thenable. A malicious
              or buggy thenable could call both <code>resolve</code> and <code>reject</code>, or call them multiple
              times, or call <code>then</code> synchronously. The spec requires wrapping <code>x.then</code> in a{' '}
              <code>try</code>, ensuring <code>resolve</code>/<code>reject</code> are each called at most once (the
              settle-once guard handles the rest), and ignoring subsequent calls. Without this, an adversarial thenable
              could resolve the promise twice (re-running handlers) or throw inside <code>then</code> access after
              partial resolution, breaking the settle-once invariant and the trust model. The guard makes promise
              adoption safe <em>regardless</em> of what the thenable does &mdash; which is exactly what lets
              third-party promise libraries interoperate with native ones without crashing each other.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
