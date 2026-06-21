import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('async-js')!
const navItems = weekNav(week)

export default function AsyncDay2() {
  const { prev, next } = dayNavLinks(week, 2)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[1].title}</h1>
        <p className="lesson-subtitle">
          Two queues, one rule: microtasks always clear before the next macrotask. This single ordering fact solves
          half of all async interview questions.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            The <strong>event loop</strong> is the coordinator: when the call stack empties, it drains the entire{' '}
            <strong>microtask queue</strong>, then takes <strong>one</strong> macrotask, then drains microtasks
            again, and repeats.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            <strong>Microtasks</strong>: promise <code>then</code>/<code>catch</code>/<code>finally</code> callbacks,
            <code> queueMicrotask</code>, <code>MutationObserver</code>. <strong>Macrotasks</strong>:{' '}
            <code>setTimeout</code>/<code>setInterval</code>, I/O, UI events, message events. Microtasks always run
            first and to completion.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Every async question is answered by classifying each callback as micro or macro and applying the
            ordering rule. Get this and the rest of the week is mechanics.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Yesterday you saw three pieces: engine, host APIs, queues. Today we zoom into the loop that ties them
          together and introduce the single distinction that dominates async JavaScript: there are{' '}
          <strong>two</strong> queues, not one, and they have different priority.
        </p>

        <CodeBlock
          code={`console.log("sync");
setTimeout(() => console.log("macro"), 0);
Promise.resolve().then(() => console.log("micro"));
console.log("done");
// logs: sync, done, micro, macro`}
          filename="two-queues.js"
        />

        <p className="article-para">
          Both callbacks were scheduled with a zero delay, yet the promise callback (&ldquo;micro&rdquo;) runs before
          the timer (&ldquo;macro&rdquo;). That ordering is not a fluke &mdash; it&apos;s the defining rule of the
          event loop. Memorize it and you can solve almost any output-ordering problem.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Microtask</dt>
            <dd className="def-text">
              A short callback that runs after the current task, <em>before</em> rendering and before the next
              macrotask. Promise reactions and <code>queueMicrotask</code> are the common sources.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Macrotask (task)</dt>
            <dd className="def-text">
              A discrete unit of work from the task queue: a timer firing, an I/O completion, a UI event, a message
              event. The loop runs one at a time.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Microtask checkpoint</dt>
            <dd className="def-text">
              The moment the loop drains the microtask queue &mdash; after every macrotask (and after the initial
              script). It drains <em>all</em> microtasks, even ones queued during draining, before moving on.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Toll Booth Analogy</h2>
        <p className="article-para">
          Imagine a single-lane highway with a toll booth. <strong>Macrotasks</strong> are the big trucks in the main
          lane &mdash; the booth lets one through at a time. <strong>Microtasks</strong> are VIP cars on a side ramp.
          The rule: before letting the next truck through, the booth must clear <em>every</em> VIP car currently on
          the ramp &mdash; and any VIPs that arrive while clearing them. VIPs always go first, and the ramp is
          emptied completely.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🚛</span>
            <span className="analogy-label">Trucks in the main lane</span>
            <span className="analogy-target">Macrotasks (one at a time)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🚗</span>
            <span className="analogy-label">VIP cars on the ramp</span>
            <span className="analogy-target">Microtasks (drained fully)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🛂</span>
            <span className="analogy-label">The booth operator</span>
            <span className="analogy-target">The event loop</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🛑</span>
            <span className="analogy-label">Starvation risk</span>
            <span className="analogy-target">Too many VIPs block trucks</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The &ldquo;drain completely&rdquo; rule is the source of <strong>microtask starvation</strong>: if
            microtasks keep spawning microtasks, the loop never gets to the next macrotask. Timers stall, the UI
            freezes. This is why an infinite promise chain can hang a page just like a <code>while(true)</code>.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Loop Step by Step</h2>
        <p className="article-para">
          Here is the event loop algorithm, in the order it actually runs. Every async trace is an application of
          these steps.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Run the current task (or the initial script)</h4>
            <p className="theory-desc">
              Execute synchronous code on the call stack until the stack is empty. This is one &ldquo;task.&rdquo;
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Drain the microtask queue</h4>
            <p className="theory-desc">
              Run <em>every</em> microtask currently queued, in FIFO order. If a microtask queues more microtasks,
              those run too &mdash; the drain only ends when the microtask queue is empty.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Render (browsers, if needed)</h4>
            <p className="theory-desc">
              The browser may repaint between tasks, roughly tied to the display refresh. This is why microtasks run
              <em> before</em> you&apos;d see a paint, but a long macrotask can skip frames.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Take one macrotask from the task queue</h4>
            <p className="theory-desc">
              Pick the oldest task, run it. Then go back to step 2 (drain microtasks again). One task &rarr; full
              microtask drain &rarr; maybe render &rarr; next task.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Micro vs macro &mdash; the master table</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Microtasks</span>
            <p className="phase-desc">Drained fully before the next macrotask or render.</p>
            <ul className="phase-rules">
              <li>Promise <code>then</code>/<code>catch</code>/<code>finally</code></li>
              <li><code>queueMicrotask(fn)</code></li>
              <li><code>MutationObserver</code> callbacks</li>
              <li><code>await</code> continuation (after the awaited promise settles)</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Macrotasks</span>
            <p className="phase-desc">Run one per loop iteration, after microtasks.</p>
            <ul className="phase-rules">
              <li><code>setTimeout</code> / <code>setInterval</code></li>
              <li><code>setImmediate</code> (Node)</li>
              <li>I/O, network completions</li>
              <li>UI events, <code>postMessage</code>, <code>requestAnimationFrame</code></li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            <code>requestAnimationFrame</code> is a special case: it runs just <em>before</em> the render, after
            microtasks but on its own schedule tied to the refresh rate. Treat it as &ldquo;render-aligned,&rdquo; not
            a plain macrotask &mdash; its exact position relative to <code>setTimeout</code> depends on frame timing.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Two Queues</h2>
        <p className="article-para">
          The original web had only the task queue &mdash; timers, events, I/O. When promises arrived (ES6, 2015),
          they needed callbacks to run &ldquo;soon but not now, and definitely before the next event.&rdquo; Adding
          them to the task queue would have introduced unpredictable latency behind pending timers. So the spec
          created the microtask queue: a fast lane guaranteed to drain before the next task and before paint.
          <code> MutationObserver</code> (2012) was the first microtask user; promises made the concept central.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Microtask queue</th>
                <th>Macrotask (task) queue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Priority</td>
                <td>Always first (after each task)</td>
                <td>After microtasks drain</td>
              </tr>
              <tr>
                <td>Drained how</td>
                <td>Entirely (until empty)</td>
                <td>One at a time</td>
              </tr>
              <tr>
                <td>Typical source</td>
                <td>Promises, <code>queueMicrotask</code></td>
                <td>Timers, I/O, events</td>
              </tr>
              <tr>
                <td>Can starve the other?</td>
                <td>Yes (endless microtasks)</td>
                <td>No (microtasks always interleave)</td>
              </tr>
              <tr>
                <td>Relative to paint</td>
                <td>Before paint</td>
                <td>Before next task&apos;s paint</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing Mixed Micro and Macro</h2>

        <CodeBlock
          code={`console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
Promise.resolve().then(() => console.log("D"));
console.log("E");`}
          filename="trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              Sync code runs: <code>A</code>, then <code>E</code>. Meanwhile <code>setTimeout</code> handed its
              callback to the Web API; the two <code>then</code> callbacks went straight to the{' '}
              <strong>microtask queue</strong> (promises don&apos;t use the Web API).
            </span>
          </li>
          <li>
            <span>
              Stack empties &rarr; microtask checkpoint. Drain microtasks FIFO: <code>C</code>, then <code>D</code>.
              (If <code>C</code> had queued another microtask, it would run before any macrotask too.)
            </span>
          </li>
          <li>
            <span>
              Microtask queue empty &rarr; take one macrotask. The timer&apos;s callback is in the task queue &rarr;
              run <code>B</code>.
            </span>
          </li>
          <li>
            <span>
              Final order: <code>A, E, C, D, B</code>. Both promise callbacks beat the zero-delay timer because
              microtasks drain before the first macrotask.
            </span>
          </li>
        </ol>

        <p className="article-para">
          The mental shortcut: <strong>all microtasks before any macrotask</strong>. If a callback is promise-based,
          it goes first; if it&apos;s timer/I/O-based, it waits behind every microtask currently queued.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Microtasks can be queued during draining</h3>
        <CodeBlock
          code={`Promise.resolve().then(function f1() {
  console.log("1");
  Promise.resolve().then(() => console.log("3")); // queued mid-drain
});
Promise.resolve().then(() => console.log("2"));
// logs: 1, 2, 3
// The "3" callback was added during the drain, so it runs AFTER the
// already-queued "2" — FIFO within the same drain.`}
          filename="queue-during-drain.js"
        />

        <h3 className="article-h3">2. Starvation &mdash; microtasks blocking a timer</h3>
        <CodeBlock
          code={`// Dangerous: each microtask schedules another. The timer never runs.
let n = 0;
function loop() {
  console.log(n++);
  if (n < 1e9) Promise.resolve().then(loop); // re-queue as microtask
}
setTimeout(() => console.log("I will be delayed"), 0);
loop();
// The setTimeout callback is stuck behind an effectively endless
// stream of microtasks → starvation. The page freezes.`}
          filename="starvation.js"
        />

        <h3 className="article-h3">3. <code>queueMicrotask</code> &mdash; the explicit microtask API</h3>
        <CodeBlock
          code={`console.log("sync");
queueMicrotask(() => console.log("microtask"));
setTimeout(() => console.log("macrotask"), 0);
// logs: sync, microtask, macrotask
// queueMicrotask puts work on the same queue promise callbacks use.`}
          filename="queue-microtask.js"
        />

        <h3 className="article-h3">4. Nested macrotasks interleave with microtasks</h3>
        <CodeBlock
          code={`setTimeout(() => {
  console.log("task1");
  Promise.resolve().then(() => console.log("micro after task1"));
}, 0);
setTimeout(() => {
  console.log("task2");
}, 0);
// logs: task1, micro after task1, task2
// After task1 runs, its microtask drains BEFORE task2 begins.`}
          filename="interleave.js"
        />

        <h3 className="article-h3">5. <code>await</code> resumes as a microtask</h3>
        <CodeBlock
          code={`async function run() {
  console.log("A");
  await Promise.resolve(); // suspends; resumes later as microtask
  console.log("C");
}
run();
console.log("B");
// logs: A, B, C
// \`await\` yields control; the rest of run() is scheduled as a microtask
// after B. (Day 5 unpacks why.)`}
          filename="await-microtask.js"
        />

        <div className="article-callout">
          <p>
            The rule that makes output-ordering problems tractable: <strong>classify every callback, then order by
            (a) all current sync code, (b) all microtasks to completion, (c) one macrotask, (b) again, (d) next
            macrotask, &hellip;</strong> Apply it mechanically and you won&apos;t get these wrong.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Predict the exact output order of each snippet on paper, then verify by running. For each, write which
            queue each callback lands in.
          </p>
        </div>

        <CodeBlock
          code={`// Snippet 1
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);

// Snippet 2
Promise.resolve()
  .then(() => console.log("a"))
  .then(() => console.log("b"));
Promise.resolve()
  .then(() => console.log("c"));
// Hint: chaining .then creates a NEW microtask per link.

// Snippet 3
setTimeout(() => {
  console.log("T1");
  Promise.resolve().then(() => console.log("P1"));
}, 0);
Promise.resolve().then(() => console.log("P0"));
console.log("S");

// Predict: 1) 1,4,3,2  2) a,c,b  3) S,P0,T1,P1`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            In Snippet 2, why does <code>c</code> print before <code>b</code>? (Because each <code>.then</code>{' '}
            returns a new promise that settles <em>as a separate microtask</em>. After <code>a</code> runs, the
            second <code>.then</code> is queued; meanwhile <code>c</code> from the independent chain was already in
            the queue ahead of it. Day 4 covers this chaining mechanic in depth.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Explain the event loop.</h4>
            <p className="iq-a">
              It&apos;s a loop that, whenever the call stack is empty, drains the entire microtask queue, then takes
              one task from the macrotask queue, runs it, drains microtasks again, (optionally renders), and repeats.
              It only schedules work between tasks &mdash; it never interrupts a running task. This is how
              single-threaded JS achieves concurrency.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Difference between microtasks and macrotasks?</h4>
            <p className="iq-a">
              Microtasks (promise callbacks, <code>queueMicrotask</code>, <code>MutationObserver</code>) are drained
              fully before the next macrotask and before paint. Macrotasks (timers, I/O, UI events) run one per loop
              iteration. The loop always finishes all queued microtasks before moving to the next macrotask.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why does a promise callback run before a zero-delay <code>setTimeout</code>?</h4>
            <p className="iq-a">
              Because promise callbacks are microtasks and <code>setTimeout</code> callbacks are macrotasks. After
              the current task finishes, the loop drains all microtasks first; only then does it take the first
              macrotask. So any ready microtask beats any ready macrotask regardless of their delay values.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is microtask starvation?</h4>
            <p className="iq-a">
              If microtasks continuously queue more microtasks, the loop never reaches the next macrotask &mdash;
              pending timers, I/O, and UI events stall and the page freezes. Because the drain runs to completion,
              an effectively-infinite promise chain can hang the runtime just like a blocking loop, without a{' '}
              <code>while(true)</code> in any single callback.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Output and why?</h4>
            <CodeBlock
              code={`console.log("1");
setTimeout(() => console.log("2"));
Promise.resolve().then(() => console.log("3"));
console.log("4");`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>1, 4, 3, 2</code>. Sync code first (<code>1</code>, <code>4</code>). Then the microtask drain
              runs the promise callback (<code>3</code>). Then the loop takes the timer macrotask (<code>2</code>).
              Microtasks always precede macrotasks.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Output and why?</h4>
            <CodeBlock
              code={`Promise.resolve().then(() => console.log("a")).then(() => console.log("b"));
Promise.resolve().then(() => console.log("c")).then(() => console.log("d"));`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>a, c, b, d</code>. Each <code>.then</code> returns a new promise, and that promise&apos;s{' '}
              <code>then</code> callback is queued as a <em>separate</em> microtask only after the previous one
              settles. After <code>a</code> runs, the chain queues <code>b</code>; but <code>c</code> (from the
              independent chain, queued at the start) was already ahead in the queue. So order is{' '}
              <code>a, c, b, d</code> &mdash; chains interleave at the microtask level.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Why can a microtask-heavy loop freeze the UI but a <code>setTimeout</code> loop cannot?</h4>
            <p className="iq-a">
              Because the event loop only renders (and runs UI-event macrotasks) <em>between</em> macrotasks, after
              the microtask drain. A <code>setTimeout</code>-based loop hands control back to the loop each
              iteration, so renders and input events get a turn. A microtask-based loop never yields to a macrotask
              &mdash; it keeps the loop in the drain phase forever &mdash; so rendering is starved and the page
              appears frozen. The same logical &ldquo;work&rdquo; is fine chunked across macrotasks but fatal chunked
              across microtasks.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
