import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('consolidation')!
const navItems = weekNav(week)

export default function ConsolidationDay1() {
  const { next } = dayNavLinks(week, 1)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[0].title}</h1>
        <p className="lesson-subtitle">
          The capstone: build the abstraction you&apos;ve used all month. Today, a promise that settles, stores its
          value, and runs its handlers.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            We re-implement <code>Promise</code> from scratch &mdash; today the core: three states, one-way settlement,
            storing the value/reason, and running <code>then</code> handlers when ready. Tomorrow adds async
            scheduling, chaining, and unwrapping.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            A <code>MyPromise</code> holds <code>state</code>, <code>value</code>, and a list of pending{' '}
            <code>then</code> callbacks. <code>resolve</code>/<code>reject</code> settle once and flush the callbacks.
            <code> then</code> registers a callback &mdash; run immediately if already settled, queued if pending.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            This is the proof you understand Week 4. Building it forces you to confront the rules: settles-once, async
            handlers, value storage, and (tomorrow) chaining &amp; unwrapping. The classic senior interview task.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          For two months you&apos;ve used promises. Now you build one. The exercise strips away the magic: a promise is
          just a state machine with callbacks. Get the rules right &mdash; three states, settles once, handlers run on
          settlement &mdash; and you&apos;ve demonstrated real understanding of async JavaScript.
        </p>

        <CodeBlock
          code={`// What we're building, incrementally:
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("done"), 100);
});
p.then((v) => console.log(v)); // "done" (after 100ms)`}
          filename="intro.js"
        />

        <p className="article-para">
          Today&apos;s scope: the constructor, state transitions, value/reason storage, and synchronous handler
          invocation. We <em>defer</em> the hard parts (async scheduling, chaining, unwrapping) to Day 2 so each piece
          is clear. By the end of today you&apos;ll have a working &ldquo;promise&rdquo; that settles and notifies &mdash;
          the skeleton tomorrow fleshes out.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">State machine</dt>
            <dd className="def-text">
              A promise is one of <code>pending</code>, <code>fulfilled</code>, <code>rejected</code> &mdash; with
              one-way transitions (pending &rarr; fulfilled/rejected). The whole abstraction rests on this.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Settles once</dt>
            <dd className="def-text">
              After the first <code>resolve</code>/<code>reject</code>, state and value are frozen; later calls are
              no-ops. The guarantee that solves inversion of control (Week 4 Day 3/4).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Handler queue</dt>
            <dd className="def-text">
              <code>then</code> callbacks registered while pending are stored; on settlement, all are flushed in order.
              If already settled, <code>then</code> runs the callback (async, tomorrow) immediately.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Order Ticket Analogy</h2>
        <p className="article-para">
          A promise is a restaurant order ticket. You hand it in (<code>new Promise</code>) and get a receipt (<code>{'{state: pending}'}</code>).
          The kitchen either fulfills it (food ready &rarr; <code>fulfilled</code> with a value) or rejects it (out of
          stock &rarr; <code>rejected</code> with a reason). Once decided, the ticket is stamped permanently &mdash; no
          re-cooking. If you ask &ldquo;is it ready?&rdquo; (<code>then</code>) before it&apos;s done, they take your
          number and call you when it&apos;s settled; if it&apos;s already done, they tell you right away.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🎫</span>
            <span className="analogy-label">The order ticket</span>
            <span className="analogy-target">A MyPromise instance</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">⏳</span>
            <span className="analogy-label">Waiting / done / failed</span>
            <span className="analogy-target">pending / fulfilled / rejected</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">List of &ldquo;call me&rdquo; numbers</span>
            <span className="analogy-target">The handler queue</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔒</span>
            <span className="analogy-label">Stamped once, permanent</span>
            <span className="analogy-target">Settles exactly once</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The core insight you&apos;ll rediscover by building: <strong>the value has to be stored</strong>. When{' '}
            <code>resolve</code> runs, it saves the value on the promise; later <code>then</code> calls read that stored
            value. That storage is what decouples <em>when</em> you settle from <em>when</em> you attach a handler &mdash;
            the heart of why promises beat callbacks.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Pieces We Need</h2>
        <p className="article-para">
          A minimal promise needs four things: state, value, a place for pending callbacks, and the settle/notify
          logic. Let&apos;s justify each before coding.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. State + value/reason fields</h4>
            <p className="theory-desc">
              Track where we are and what we carry. <code>state</code> starts <code>pending</code>; on settlement it and{' '}
              <code>value</code> (or <code>reason</code>) are set together, atomically.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Two callback lists (or one with type)</h4>
            <p className="theory-desc">
              <code>then(onFulfilled, onRejected)</code> may register either handler. Store pending callbacks (with their
              type) so settlement can dispatch the right one per registration.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>resolve</code>/<code>reject</code> settle once</h4>
            <p className="theory-desc">
              Each checks <code>state === pending</code> first; if not pending, return (no-op). Otherwise set state +
              value/reason and flush the queued callbacks.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. <code>then</code> branches on current state</h4>
            <p className="theory-desc">
              If settled, run the matching handler (today: synchronously; tomorrow: async). If pending, queue both so
              they run when settlement arrives.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Why &ldquo;settle once&rdquo; is non-negotiable</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">With the guard (correct)</span>
            <p className="phase-desc">First settle wins; rest ignored.</p>
            <ul className="phase-rules">
              <li>Handlers run exactly once</li>
              <li>State never flips back</li>
              <li>Trust: callers can rely on it</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Without the guard (broken)</span>
            <p className="phase-desc">Double-resolve re-runs handlers.</p>
            <ul className="phase-rules">
              <li>Handlers fire multiple times</li>
              <li>State/value can mutate</li>
              <li>Inversion of control returns</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            A subtlety we handle tomorrow: real promises run handlers <strong>asynchronously</strong> (as microtasks),
            even when already settled. Today&apos;s version runs them synchronously for clarity &mdash; we add the async
            scheduling in Day 2. Keep that in mind: today is the synchronous skeleton.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Build It</h2>
        <p className="article-para">
          Promises were standardized in ES6 (2015) per the Promises/A+ spec (2012). But the spec is dense; building a
          minimal version is the fastest way to internalize it. The exercise is a rite of passage: it forces you to
          confront the state machine, the settle-once guarantee, async scheduling, and unwrapping &mdash; the four
          things that make promises work. Every senior JS interview that asks &ldquo;implement a promise&rdquo; is
          testing exactly this understanding. Today&apos;s synchronous skeleton is step one; tomorrow completes it.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Today (synchronous skeleton)</th>
                <th>Tomorrow (full)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>States + settlement</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Value/reason storage</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Handler notification</td>
                <td>Synchronous</td>
                <td>Async (microtask)</td>
              </tr>
              <tr>
                <td><code>then</code> returns a promise</td>
                <td>No</td>
                <td>Yes (chaining)</td>
              </tr>
              <tr>
                <td>Unwrapping returned promises</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>catch</code>/<code>finally</code></td>
                <td>No</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Settled-After-Attach</h2>

        <CodeBlock
          code={`const p = new MyPromise((resolve) => {
  setTimeout(() => resolve("done"), 100); // settles later
});
p.then((v) => console.log("A", v));       // attach while pending
p.then((v) => console.log("B", v));       // second handler`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>new MyPromise(executor)</code> sets <code>state = pending</code>, <code>value = undefined</code>,
              empty callback list. Then runs the executor with <code>resolve</code>/<code>reject</code> &mdash; which
              schedules <code>resolve("done")</code> in 100ms (pending still).
            </span>
          </li>
          <li>
            <span>
              <code>p.then(A)</code>: state is <code>pending</code>, so A is <strong>queued</strong> (not run). Same for{' '}
              <code>p.then(B)</code> &mdash; queue now <code>[A, B]</code>.
            </span>
          </li>
          <li>
            <span>
              100ms later, <code>resolve("done")</code> runs: guard passes (still pending), sets{' '}
              <code>state = fulfilled</code>, <code>value = "done"</code>. Then flushes the queue &mdash; runs A with{' '}
              <code>"done"</code>, then B with <code>"done"</code>.
            </span>
          </li>
          <li>
            <span>
              Output: <code>A done</code>, <code>B done</code>. Both handlers ran, in registration order, with the
              stored value &mdash; even though they were attached before settlement.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. The synchronous skeleton</h3>
        <CodeBlock
          code={`const PENDING = "pending", FULFILLED = "fulfilled", REJECTED = "rejected";

class MyPromise {
  state = PENDING;
  value = undefined;
  callbacks = []; // { onFulfilled, onRejected }

  constructor(executor) {
    const resolve = (value) => this.#settle(FULFILLED, value);
    const reject = (reason) => this.#settle(REJECTED, reason);
    try { executor(resolve, reject); }
    catch (err) { reject(err); } // sync throw in executor → reject
  }

  #settle(state, value) {
    if (this.state !== PENDING) return; // settles once
    this.state = state;
    this.value = value;
    for (const cb of this.callbacks) this.#run(cb); // flush
  }

  #run({ onFulfilled, onRejected }) {
    if (this.state === FULFILLED) onFulfilled?.(this.value);
    else if (this.state === REJECTED) onRejected?.(this.reason ?? this.value);
  }

  then(onFulfilled, onRejected) {
    const cb = { onFulfilled, onRejected };
    if (this.state === PENDING) this.callbacks.push(cb); // queue
    else this.#run(cb);                                  // already settled → run now
  }
}`}
          filename="skeleton.js"
        />

        <h3 className="article-h3">2. Settles once &mdash; later calls ignored</h3>
        <CodeBlock
          code={`const p = new MyPromise((resolve, reject) => {
  resolve("first");
  resolve("second"); // ignored — already settled
  reject("nope");    // ignored
});
p.then((v) => console.log(v)); // "first"`}
          filename="once.js"
        />

        <h3 className="article-h3">3. Attach before settle (queues)</h3>
        <CodeBlock
          code={`const p = new MyPromise((resolve) => setTimeout(() => resolve(42), 50));
p.then((v) => console.log("got", v)); // queued; runs at 50ms with 42
// The handler is stored and called with the stored value when settle fires.`}
          filename="attach-before.js"
        />

        <h3 className="article-h3">4. Attach after settle (runs immediately)</h3>
        <CodeBlock
          code={`const p = new MyPromise((resolve) => resolve(7)); // settled synchronously
p.then((v) => console.log("immediate", v)); // runs right now (today: sync)
// Real promises defer this to a microtask — that's tomorrow's upgrade.`}
          filename="attach-after.js"
        />

        <h3 className="article-h3">5. Sync throw in the executor rejects</h3>
        <CodeBlock
          code={`const p = new MyPromise(() => { throw new Error("boom"); });
p.then(undefined, (err) => console.log("caught", err.message)); // "caught boom"
// The try/catch around executor() routes thrown errors to reject.`}
          filename="throw.js"
        />

        <h3 className="article-h3">6. What&apos;s missing (tomorrow)</h3>
        <CodeBlock
          code={`// This does NOT work yet — then doesn't return a promise:
const p2 = new MyPromise((r) => r(1)).then((v) => v + 1);
p2.then((v) => console.log(v)); // ERROR: p2.then is not a function
// Tomorrow: \`then\` returns a new MyPromise, enabling chaining + unwrapping.`}
          filename="missing.js"
        />

        <div className="article-callout">
          <p>
            The skeleton proves the concept: a promise is state + stored value + callback queue + settle-once logic.
            Everything else (async scheduling, chaining, unwrapping, catch/finally) is layered on top. Today you built
            the foundation; tomorrow you make it production-shaped.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Build the synchronous <code>MyPromise</code> skeleton from scratch (no peeking). Test all four cases:
            settle-before-attach, attach-before-settle, settle-once, and sync-throw-rejects. Confirm handlers run with
            the stored value in each.
          </p>
        </div>

        <CodeBlock
          code={`// Test 1: attach before settle (queues, runs on settle)
new MyPromise((r) => setTimeout(() => r("late"), 50))
  .then((v) => console.log("1:", v)); // "1: late" at 50ms

// Test 2: settle before attach (runs immediately today)
new MyPromise((r) => r("early"))
  .then((v) => console.log("2:", v)); // "2: early" now

// Test 3: settles once
new MyPromise((resolve, reject) => { resolve("a"); reject("b"); resolve("c"); })
  .then((v) => console.log("3:", v), (e) => console.log("3 err", e)); // "3: a"

// Test 4: sync throw rejects
new MyPromise(() => { throw new Error("x"); })
  .then(undefined, (e) => console.log("4:", e.message)); // "4: x"

// Verify your #settle guard rejects double-settle and your queue flushes in order.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does test 2 run synchronously today, and why is that wrong for a real promise? (Because today&apos;s{' '}
            <code>then</code> calls the handler directly when settled. Real promises <em>always</em> schedule handlers
            as microtasks &mdash; even on an already-settled promise &mdash; so handler code never runs interleaved with
            the caller&apos;s synchronous code. That predictability is tomorrow&apos;s addition: wrap the{' '}
            <code>#run</code> calls in <code>queueMicrotask</code>.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What are the essential pieces of a promise?</h4>
            <p className="iq-a">
              A state field (<code>pending</code>/<code>fulfilled</code>/<code>rejected</code>), a stored value/reason,
              and a queue of pending handlers. The constructor runs an executor with <code>resolve</code>/{' '}
              <code>reject</code>; <code>resolve</code>/<code>reject</code> settle once and flush the queue;{' '}
              <code>then</code> registers handlers &mdash; run immediately if settled, queued if pending. State
              transitions are one-way and terminal.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. How do you enforce &ldquo;settles once&rdquo;?</h4>
            <p className="iq-a">
              Guard the settle function: <code>if (this.state !== PENDING) return;</code> at the top of{' '}
              <code>resolve</code>/<code>reject</code>. Only the first call (when still pending) sets state and value and
              flushes handlers; all later calls are no-ops. This guarantees handlers run exactly once and state never
              mutates after settlement.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why must <code>then</code> branch on current state?</h4>
            <p className="iq-a">
              Because a handler can be attached before or after settlement. If pending, it must be queued to run when{' '}
              <code>resolve</code>/<code>reject</code> eventually fires (otherwise it&apos;d be lost). If already
              settled, it must run with the stored value immediately (the caller shouldn&apos;t have to know the timing).
              The stored value is what makes both cases consistent.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why store the value on settlement?</h4>
            <p className="iq-a">
              To decouple <em>when</em> you settle from <em>when</em> handlers attach. Without storage, a handler
              attached after settlement would have no value to receive. With it, settlement saves the value; any later{' '}
              <code>then</code> reads the stored value. This is the core advantage over callbacks, where missing the
              event means missing the data.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Why wrap the executor in try/catch?</h4>
            <p className="iq-a">
              So a synchronous throw inside the executor function rejects the promise instead of propagating out of the
              constructor. <code>{'new Promise(() => { throw ... })'}</code> should produce a rejected promise, not
              crash. The <code>{'try { executor(resolve, reject) } catch (err) { reject(err) }'}</code> pattern routes the
              error into the normal rejection path.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What does today&apos;s implementation get wrong vs the real spec?</h4>
            <p className="iq-a">
              Two big things, both fixed tomorrow: (1) handlers run <strong>synchronously</strong> on an already-settled
              promise, but the spec requires them to run <strong>asynchronously</strong> as microtasks (so handler code
              never interleaves with the caller&apos;s sync code); (2) <code>then</code> returns <code>undefined</code>,
              but the spec requires it to return a <em>new promise</em>, enabling chaining and unwrapping. Today is the
              state-machine skeleton; tomorrow adds the async + chaining layers that make it spec-compliant.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Sketch the data flow when a handler is attached before settlement and the promise later resolves.</h4>
            <p className="iq-a">
              At <code>then</code>-attach time: state is <code>pending</code>, so the handler is pushed onto the
              promise&apos;s callback queue (with its <code>onFulfilled</code>/<code>onRejected</code> pair) &mdash; nothing
              runs. Later, <code>resolve(value)</code> is called: the settle guard checks <code>state === pending</code>
              (passes), sets <code>state = fulfilled</code> and <code>value</code>, then iterates the queue and calls
              each handler&apos;s <code>onFulfilled</code> with the stored value (tomorrow: scheduled as microtasks, not
              run inline). The handler reads the value that was saved at settlement &mdash; this is why the value must be
              stored: the handler wasn&apos;t present when the value was produced, so the promise holds it until the
              handler arrives. If multiple handlers were queued, they all run, in order, each receiving the same stored
              value. No handler is lost, none runs twice, and the timing of attach vs settle doesn&apos;t matter &mdash;
              exactly the contract that makes promises reliable.
            </p>
          </div>
        </div>
      </section>

      <DayNav next={next} />
    </ContentLayout>
  )
}
