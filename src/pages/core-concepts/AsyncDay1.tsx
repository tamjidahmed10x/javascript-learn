import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('async-js')!
const navItems = weekNav(week)

export default function AsyncDay1() {
  const { next } = dayNavLinks(week, 1)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[0].title}</h1>
        <p className="lesson-subtitle">
          JavaScript is single-threaded, yet it does a thousand things at once. The trick is one engine, three
          places for work.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            The JavaScript <strong>runtime</strong> is not just the engine. It is the engine (heap + call stack)
            plus the surrounding <strong>Web APIs</strong> (timers, DOM, network) provided by the host, plus the
            queues that return finished work to the engine.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Synchronous code runs on the <strong>call stack</strong>. Async work (a timer, a fetch) is handed to the
            Web APIs, which run outside the engine. When they finish, their callbacks line up in a <strong>task
            queue</strong> and wait for the stack to empty.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always &mdash; this architecture is why <code>setTimeout(fn, 0)</code> doesn&apos;t run <code>fn</code>{' '}
            immediately. Understanding the three pieces is the prerequisite for everything else this week.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          The single most important mental model in all of async JavaScript: <strong>the engine itself cannot do
          anything asynchronous</strong>. It runs one statement at a time on a single thread. Concurrency is a
          collaboration between the engine and its host. Today you learn who the collaborators are.
        </p>

        <CodeBlock
          code={`console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
// logs: 1, 3, 2`}
          filename="first-surprise.js"
        />

        <p className="article-para">
          If <code>setTimeout(..., 0)</code> ran the callback immediately, you&apos;d see <code>1, 2, 3</code>. You
          don&apos;t. The timer isn&apos;t handled by the engine at all &mdash; the engine hands it off, keeps
          running, and only comes back to the callback later. That handoff is the whole story of this week.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Call Stack</dt>
            <dd className="def-text">
              The engine&apos;s stack of frames for the functions currently executing. One thread means one call
              stack; only the top frame runs at any instant.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Heap</dt>
            <dd className="def-text">
              The memory region where objects live. Unstructured allocation; managed by the garbage collector (Week
              6).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Web APIs</dt>
            <dd className="def-text">
              Concurrency primitives the <em>host</em> provides &mdash; <code>setTimeout</code>,{' '}
              <code>fetch</code>, the DOM, IndexedDB. They run on separate threads/processes outside the JS engine
              and push callbacks into queues when done.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Task Queue (macrotask queue)</dt>
            <dd className="def-text">
              A FIFO queue of callbacks waiting to run. The event loop (Day 2) moves them onto the call stack one at
              a time, only when the stack is empty.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Restaurant Analogy</h2>
        <p className="article-para">
          Picture a restaurant with <strong>one chef</strong> (the single-threaded engine). The chef cooks one dish
          at a time &mdash; that&apos;s the call stack. But the chef doesn&apos;t bake bread, age wine, or grow
          vegetables. Those happen in the <strong>kitchen&apos;s back rooms</strong> (the Web APIs) by other staff.
        </p>
        <p className="article-para">
          When the bread is done baking, the waiter drops a ticket on the <strong>order rail</strong> (the task
          queue). The chef finishes the current dish, then picks up the next ticket from the rail. The chef never
          waits &mdash; waiting would freeze the whole kitchen.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">👨‍🍳</span>
            <span className="analogy-label">One chef</span>
            <span className="analogy-target">The single thread / call stack</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🚪</span>
            <span className="analogy-label">Back rooms</span>
            <span className="analogy-target">Web APIs (timers, network, DOM)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🎫</span>
            <span className="analogy-label">Order rail</span>
            <span className="analogy-target">Task queue</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔄</span>
            <span className="analogy-label">The chef checking the rail</span>
            <span className="analogy-target">The event loop (Day 2)</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The chef is never idle on purpose &mdash; if a recipe said &ldquo;wait 5 minutes,&rdquo; the chef would
            be blocked, unable to serve anyone. That&apos;s why JavaScript <strong>never blocks on I/O</strong>: it
            delegates the waiting to the back rooms and moves on. Blocking the chef = freezing the page.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Three Pieces</h2>
        <p className="article-para">
          Most people picture &ldquo;JavaScript&rdquo; as one thing. It&apos;s really three collaborating systems.
          Get their boundaries right and the rest of async falls into place.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. The engine: heap + call stack</h4>
            <p className="theory-desc">
              V8 (Chrome/Node), SpiderMonkey (Firefox), JSC (Safari). The engine executes code and manages memory.
              It has <em>no</em> built-in <code>setTimeout</code>, <code>fetch</code>, or DOM &mdash; those are
              injected by the host.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. The host: Web APIs / Node APIs</h4>
            <p className="theory-desc">
              The browser provides <code>setTimeout</code>, <code>fetch</code>, <code>XMLHttpRequest</code>, DOM
              events, IndexedDB. Node provides <code>fs</code>, <code>crypto</code>, <code>http</code>. These run
              concurrently with the engine &mdash; the actual waiting happens here, on other threads.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. The queues: macrotask + microtask</h4>
            <p className="theory-desc">
              Finished work returns as callbacks in queues. <strong>Macrotasks</strong> (timers, I/O, events) go in
              the task queue; <strong>microtasks</strong> (promise callbacks) go in a separate, higher-priority
              queue. Day 2 explains why the split matters.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. The event loop: the coordinator</h4>
            <p className="theory-desc">
              A loop that, when the stack is empty, drains the microtask queue, then takes one macrotask. It never
              interrupts running code &mdash; it only schedules between tasks.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Why the engine has no <code>setTimeout</code></h3>
        <p className="article-para">
          This surprises people: <code>setTimeout</code> is not part of the JavaScript language. It&apos;s not in the
          ECMAScript spec at all. It&apos;s defined by HTML5 (browsers) and by Node&apos;s <code>timers</code> module.
          That&apos;s why the same <code>setTimeout</code> behaves slightly differently in a browser vs Node vs a
          bare engine. The language defines <em>how to run code</em>; the host defines <em>what async tools
          exist</em>.
        </p>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Engine&apos;s job</span>
            <p className="phase-desc">Execute synchronous code on the call stack. Manage memory on the heap.</p>
            <ul className="phase-rules">
              <li>Run one statement at a time</li>
              <li>Push/pop stack frames</li>
              <li>Allocate/GC objects</li>
              <li>Drain microtasks when stack empties</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Host&apos;s job</span>
            <p className="phase-desc">Provide async primitives that work outside the single thread.</p>
            <ul className="phase-rules">
              <li>Run timers on a clock</li>
              <li>Open network sockets</li>
              <li>Read files / databases</li>
              <li>Queue callbacks when done</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The boundary is real and verifiable: run pure V8 (e.g. <code>d8</code>) with no embedder, and{' '}
            <code>setTimeout</code> is <code>undefined</code>. The engine literally doesn&apos;t know what a timer
            is. This is why &ldquo;JavaScript is single-threaded&rdquo; is half true: the <em>engine</em> is; the{' '}
            <em>runtime</em> it lives in is not.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why This Design</h2>
        <p className="article-para">
          JavaScript was built in 1995 for the browser &mdash; a UI environment where blocking the thread freezes
          rendering and input. Eich chose an event-driven, single-threaded model with non-blocking I/O because it
          was the only design that kept a page responsive while waiting on slow networks and timers. The same model
          later made Node.js (2009) viable for high-throughput servers: no thread-per-connection, just one event
          loop juggling thousands of callbacks.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>JS (single-threaded + event loop)</th>
                <th>Thread-per-request (Java/PHP)</th>
                <th>Go (goroutines)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Concurrency unit</td>
                <td>Callbacks on one stack</td>
                <td>OS threads, one per request</td>
                <td>Lightweight goroutines (M:N)</td>
              </tr>
              <tr>
                <td>Memory per unit</td>
                <td>Tiny (a closure)</td>
                <td>~1 MB stack each</td>
                <td>~2 KB, grows</td>
              </tr>
              <tr>
                <td>Blocking I/O</td>
                <td>Delegated to host APIs</td>
                <td>Thread sleeps (cheap to block)</td>
                <td>Runtime parks the goroutine</td>
              </tr>
              <tr>
                <td>Shared mutable state</td>
                <td>None (one thread)</td>
                <td>Yes (needs locks)</td>
                <td>Yes (channels preferred)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Timer Through the Runtime</h2>

        <CodeBlock
          code={`console.log("1");                       // sync
setTimeout(() => console.log("2"), 0);    // handed to Web API
console.log("3");                        // sync`}
          filename="trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>console.log("1")</code> runs on the call stack &rarr; prints <code>1</code>. Stack now empty.
            </span>
          </li>
          <li>
            <span>
              <code>setTimeout</code> is called. The engine itself can&apos;t time anything, so it forwards the
              request to the <strong>Web API</strong> layer: &ldquo;in 0ms, put this callback in the task
              queue.&rdquo; The call returns immediately; the engine does not wait.
            </span>
          </li>
          <li>
            <span>
              <code>console.log("3")</code> runs on the call stack &rarr; prints <code>3</code>. Stack empty again.
            </span>
          </li>
          <li>
            <span>
              Meanwhile the Web API&apos;s timer (0ms) has elapsed; it pushes the callback onto the{' '}
              <strong>task queue</strong>. The callback sits there, ready but not running.
            </span>
          </li>
          <li>
            <span>
              The event loop sees an empty call stack and a non-empty task queue. It moves the callback onto the
              stack. <code>console.log("2")</code> runs &rarr; prints <code>2</code>.
            </span>
          </li>
          <li>
            <span>
              Final order: <code>1, 3, 2</code>. The delay isn&apos;t the timer value &mdash; it&apos;s that the
              callback <em>must wait for the stack to clear</em>.
            </span>
          </li>
        </ol>

        <p className="article-para">
          A useful consequence: <code>setTimeout(fn, 0)</code> is never actually instant. It means &ldquo;run{' '}
          <code>fn</code> as soon as the stack is empty and the timer&apos;s minimum (browsers clamp ~4ms) has
          passed.&rdquo; It&apos;s a way to <em>defer</em> work, not to run it now.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Blocking the stack freezes everything</h3>
        <CodeBlock
          code={`// A synchronous infinite loop — the page hangs forever.
// The event loop can't run any other callback because the
// stack never empties. This is the definition of "blocking".
function block() {
  while (true) {}
}
block();
// setTimeout(() => console.log("never"), 0); // never reached`}
          filename="blocking.js"
        />

        <h3 className="article-h3">2. Network is non-blocking because of the host</h3>
        <CodeBlock
          code={`console.log("before fetch");
fetch("/api").then(() => console.log("done")); // handed to network API
console.log("after fetch");
// logs: before fetch, after fetch, ...then "done" whenever the
// response arrives. The engine never waited — the browser's
// network stack did, in the background, and queued the callback.`}
          filename="non-blocking.js"
        />

        <h3 className="article-h3">3. Many timers, one queue</h3>
        <CodeBlock
          code={`setTimeout(() => console.log("a"), 1000);
setTimeout(() => console.log("b"), 0);
setTimeout(() => console.log("c"), 500);
// logs: b, c, a — FIFO by when they ENTER the queue, not by code order.
// b's timer elapses first (0ms), so it's enqueued first.`}
          filename="queue-order.js"
        />

        <h3 className="article-h3">4. Stack overflow &mdash; the one thread has limits</h3>
        <CodeBlock
          code={`function recurse() { return recurse(); }
recurse();
// RangeError: Maximum call stack size exceeded
// Each call pushes a frame; the stack is finite. Recursion without
// a base case, or very deep sync recursion, blows the stack.
// (Async recursion with await does NOT — each await pops the frame.)`}
          filename="stack-overflow.js"
        />

        <h3 className="article-h3">5. The host differs &mdash; <code>setTimeout</code> in Node vs browser</h3>
        <CodeBlock
          code={`// Browser: setTimeout is on window, clamped to ~4ms after nesting.
// Node: setTimeout is from the 'timers' module, returns a Timeout object.
// Deno/Bun: similar API, different internals.
// The engine (V8) is the SAME in all four — the host differs.
// This is why "JavaScript" and "the JS runtime" are not synonyms.`}
          filename="host-difference.js"
        />

        <div className="article-callout">
          <p>
            Because the engine is single-threaded, any long synchronous computation blocks <em>everything</em>{' '}
            &mdash; rendering, input, all other callbacks. The rule for performant JS: <strong>keep each task
            short</strong>, and push heavy work off the main thread (Web Workers, or break it into chunks with{' '}
            <code>setTimeout</code>/<code>queueMicrotask</code>).
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            For each snippet, predict the output order <em>before</em> running it, then verify. Then draw the
            call-stack / Web-API / task-queue state at each numbered point.
          </p>
        </div>

        <CodeBlock
          code={`// Snippet A
console.log("start");
setTimeout(() => console.log("timeout"), 0);
console.log("end");

// Snippet B — does nesting change anything?
setTimeout(() => {
  console.log("outer");
  setTimeout(() => console.log("inner"), 0);
}, 0);

// Snippet C — what makes the page freeze?
console.log("before");
// for (let i = 0; i < 1e10; i++) {} // uncomment: what happens to UI?
console.log("after");

// Predict A: start, end, timeout
// Predict B: outer, inner
// Predict C: before, after — but a long gap with a frozen UI`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            In Snippet B, between <code>outer</code> and <code>inner</code>, did the engine ever wait? (No. The{' '}
            <code>inner</code> callback was handed to the Web API, the stack emptied, the timer elapsed, the
            callback queued, and the event loop picked it up. The engine kept running other work in between &mdash;
            there just wasn&apos;t any.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Is JavaScript single-threaded?</h4>
            <p className="iq-a">
              The JavaScript <em>engine</em> is single-threaded &mdash; one call stack, one statement at a time. But
              the <em>runtime</em> (engine + host Web APIs) is not: timers, network, and the DOM run on separate
              threads and feed callbacks back through queues. So JS code runs on one thread while the host does real
              concurrent work behind it.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What are the components of the JS runtime?</h4>
            <p className="iq-a">
              The engine (memory heap + call stack), the host-provided Web APIs (timers, fetch, DOM, I/O), and the
              queues (macrotask queue and microtask queue). The event loop coordinates them: when the stack is empty
              it drains microtasks, then processes one macrotask.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Is <code>setTimeout</code> part of JavaScript?</h4>
            <p className="iq-a">
              No. It&apos;s defined by the host &mdash; HTML5 in browsers, the <code>timers</code> module in Node. The
              ECMAScript spec doesn&apos;t mention it. The engine just sees a function the host injected; the actual
              timing work happens outside the engine, in the host&apos;s own threads.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why does <code>setTimeout(fn, 0)</code> not run <code>fn</code> immediately?</h4>
            <p className="iq-a">
              Because the callback goes to the Web API, then the task queue, and the event loop only moves it onto
              the stack <em>after</em> the current synchronous code finishes and the stack empties. The <code>0</code>{' '}
              is the minimum delay before enqueueing, not a guarantee of instant execution. Browsers also clamp very
              small timeouts to ~4ms after nesting.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q5. What does &ldquo;blocking&rdquo; mean, and why is it bad?</h4>
            <p className="iq-a">
              Blocking is any synchronous operation that keeps the call stack busy &mdash; a long loop, a busy-wait,
              or a sync XHR. While the stack is occupied, the event loop can&apos;t process other tasks, so the UI
              freezes, timers are delayed, and input is ignored. Non-blocking I/O is the whole point of the
              event-loop design.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Output and why?</h4>
            <CodeBlock
              code={`console.log("a");
setTimeout(() => console.log("b"), 0);
while (Date.now() < startTime + 2000) {} // busy-wait 2s
console.log("c");`}
              filename="q6.js"
            />
            <p className="iq-a">
              Logs <code>a</code>, then (2-second freeze), <code>c</code>, then <code>b</code>. The busy-wait keeps
              the stack occupied for 2 seconds, so although the <code>0ms</code> timer&apos;s callback was ready in
              the queue almost immediately, the event loop couldn&apos;t run it until the stack cleared.{' '}
              <code>b</code> prints only after <code>c</code>. This is blocking in action.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q7 (Medium). How can you run heavy CPU work without freezing the UI?</h4>
            <p className="iq-a">
              Move it off the main thread: a <strong>Web Worker</strong> runs code on a separate thread and
              communicates via messages. If that&apos;s not available, chunk the work &mdash; process a batch, then{' '}
              <code>setTimeout</code>/<code>requestAnimationFrame</code>/<code>queueMicrotask</code> to yield,
              letting the event loop service rendering and input between batches. The key is to never let a single
              task run long enough to drop frames.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hard). The same V8 runs in Chrome and Node &mdash; why can their async behave differently?</h4>
            <p className="iq-a">
              Because V8 is just the engine (heap + stack + ECMAScript semantics). The async behavior comes from the{' '}
              <em>embedder</em>: Chrome provides the HTML5 Web APIs (one task queue per origin, rendering-related
              timers, microtask checkpoint rules tied to the event loop); Node provides its own libuv-backed event
              loop with multiple phase queues (timers, poll, check, etc.) and different microtask-drain timing.
              Identical engine, different hosts &rarr; same language, different scheduling details. That&apos;s why
              <code> process.nextTick</code> exists in Node but not browsers, and why microtask drain points can
              differ between them.
            </p>
          </div>
        </div>
      </section>

      <DayNav next={next} />
    </ContentLayout>
  )
}
