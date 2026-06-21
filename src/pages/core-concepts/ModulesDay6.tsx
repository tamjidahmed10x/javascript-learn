import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('modules-perf-memory')!
const navItems = weekNav(week)

export default function ModulesDay6() {
  const { prev, next } = dayNavLinks(week, 6)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[5].title}</h1>
        <p className="lesson-subtitle">
          Four timers, four jobs. Match the scheduling primitive to the work and your UI stops fighting the browser.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <code>setTimeout</code>/<code>setInterval</code> schedule macrotasks; <code>queueMicrotask</code> and
            promise callbacks schedule microtasks; <code>requestAnimationFrame</code> (<strong>rAF</strong>) schedules
            work just before the browser paints; <code>requestIdleCallback</code> runs during spare frame time.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Each queues work at a different point in the event loop (Day 4 Week 4). <code>rAF</code> aligns to the
            display refresh (~60fps); microtasks drain before the next task and before paint; timers are macrotasks
            that run after a delay, never blocking.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            <code>rAF</code> for any visual/animation update. <code>setTimeout</code> for deferred non-visual work.
            <code> queueMicrotask</code> for &ldquo;right after this, ASAP.&rdquo; <code>requestIdleCallback</code> for
            low-priority background work that won&apos;t hurt if delayed.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          &ldquo;Run this later&rdquo; has four answers in JavaScript, and picking the wrong one causes jank, double
          renders, or work that fights the frame rate. Today we map each scheduling primitive to the event loop point
          it targets (Week 4 Day 2) and the job it&apos;s built for.
        </p>

        <CodeBlock
          code={`// Four ways to "run fn later" — each at a different loop point:
setTimeout(fn, 0);              // next macrotask (after paint)
queueMicrotask(fn);              // microtask (before paint, before next task)
Promise.resolve().then(fn);      // same as queueMicrotask
requestAnimationFrame(fn);        // just before the next paint (~16ms)
requestIdleCallback(fn);          // during spare frame time, maybe never urgent`}
          filename="four-timers.js"
        />

        <p className="article-para">
          All four defer <code>fn</code>, but at different moments and for different purposes. <code>rAF</code> is the
          one most people underuse &mdash; it&apos;s the correct tool for anything that changes what the user sees,
          because it syncs to the browser&apos;s paint cycle. Using <code>setTimeout</code> for animation instead
          causes dropped frames and visual tearing.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term"><code>requestAnimationFrame</code> (rAF)</dt>
            <dd className="def-text">
              Schedules a callback to run immediately before the browser repaints &mdash; once per frame, aligned to
              the display refresh (~60fps / 16ms). The API for smooth animation.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>requestIdleCallback</code></dt>
            <dd className="def-text">
              Runs a callback during idle time at the end of a frame (or when the browser is otherwise free), with a
              deadline indicating how much time is left. For non-urgent background work.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Frame budget</dt>
            <dd className="def-text">
              The ~16ms window at 60fps to do all work (JS + style + layout + paint) for one frame. Exceed it and the
              frame drops &mdash; felt as jank.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Theater Analogy</h2>
        <p className="article-para">
          Think of the browser as a theater putting on a show at a fixed frame rate. <strong>Paint</strong> is the
          curtain call &mdash; the audience sees the stage. <strong>rAF</strong> is the stagehand who runs on{' '}
          <em>just before</em> each curtain call to reposition props, so the change is seen in the next scene.
          <strong> Microtasks</strong> are the quick notes passed between scenes (handled before the curtain).
          <strong> setTimeout</strong> schedules an act for a later show (next macrotask).{' '}
          <strong>requestIdleCallback</strong> is the janitor who cleans only when no scene is rehearsing.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🎬</span>
            <span className="analogy-label">Stagehand before the curtain</span>
            <span className="analogy-target"><code>rAF</code> (pre-paint)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📝</span>
            <span className="analogy-label">Quick notes between scenes</span>
            <span className="analogy-target">Microtasks</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🎭</span>
            <span className="analogy-label">A scheduled later act</span>
            <span className="analogy-target"><code>setTimeout</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧹</span>
            <span className="analogy-label">Janitor in spare time</span>
            <span className="analogy-target"><code>requestIdleCallback</code></span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The key insight for animation: <strong>change visuals in <code>rAF</code>, not <code>setTimeout</code></strong>.
            The browser paints on its own schedule; <code>rAF</code> hands you the moment right before paint, so your
            update lands in the very next frame. A <code>setTimeout(fn, 0)</code> might fire mid-frame (your change
            misses this paint) or fire twice between paints (wasted work). <code>rAF</code> aligns work to output.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Where Each Fires in the Loop</h2>
        <p className="article-para">
          Recall the event loop (Week 4 Day 2): run a task &rarr; drain microtasks &rarr; render &rarr; next task.
          Each scheduling API injects work at a specific point. Knowing the point tells you when your code runs.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. <code>rAF</code>: just before paint</h4>
            <p className="theory-desc">
              The browser calls registered rAF callbacks once per frame, right before it repaints, passing a
              high-resolution <code>timestamp</code>. Multiple rAFs in one frame all run together pre-paint. The native
              animation hook.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Microtasks: before paint, before next task</h4>
            <p className="theory-desc">
              <code>queueMicrotask</code> / promise <code>.then</code> callbacks drain fully after the current task,
              before render and before the next macrotask. Higher priority than timers and rAF. Great for
              &ldquo;ASAP, after this synchronous code.&rdquo;
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>setTimeout</code>/<code>setInterval</code>: macrotasks</h4>
            <p className="theory-desc">
              Scheduled after a delay, run as their own macrotask (one per loop turn). Predictable deferral but
              frame-misaligned &mdash; not for animation. Intervals can stack if the handler exceeds the interval.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. <code>requestIdleCallback</code>: spare frame time</h4>
            <p className="theory-desc">
              Invoked when the browser is idle (end of a frame with time left, or when nothing else is happening). Gets
              a <code>deadline</code> with <code>timeRemaining()</code> &mdash; check it to avoid overrunning into the
              next frame. For non-urgent background tasks.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Order within a single frame</h3>
        <CodeBlock
          code={`// In one frame, this is the rough order:
// 1. Run a macrotask (e.g. an event handler, a setTimeout)
// 2. Drain ALL microtasks (promises, queueMicrotask)
// 3. Run requestAnimationFrame callbacks (pre-paint)
// 4. Style → Layout → Paint → Composite
// 5. If time remains: requestIdleCallback callbacks (with deadline)
// 6. Next frame...`}
          filename="frame-order.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Use <code>rAF</code> for</span>
            <p className="phase-desc">Anything that changes pixels.</p>
            <ul className="phase-rules">
              <li>Animations (position, opacity, transforms)</li>
              <li>Canvas/WebGL drawing</li>
              <li>Scroll-linked visual updates</li>
              <li>Throttling visual handlers to the frame rate</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Use <code>setTimeout</code> for</span>
            <p className="phase-desc">Deferred non-visual work.</p>
            <ul className="phase-rules">
              <li>Yielding to let the UI catch up</li>
              <li>Polling / retries</li>
              <li>Breaking long tasks into chunks</li>
              <li>Delayed notifications</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            A common performance bug: animating with <code>setInterval(move, 16)</code> instead of <code>rAF</code>. The
            interval fires on a fixed clock that ignores the actual refresh rate &mdash; on a 120Hz display it updates
            too slowly; if a frame is busy, the interval stacks callbacks. <code>rAF</code> pauses when the tab is
            hidden (saving battery) and adapts to the display. Always animate with <code>rAF</code>.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; the rAF Revolution</h2>
        <p className="article-para">
          Before <code>rAF</code> (2011), developers animated with <code>setInterval</code>/<code>setTimeout</code> &mdash;
          which wasted CPU (ran in background tabs), misaligned with the monitor, and caused tearing. <code>rAF</code>{' '}
          gave a hook directly into the browser&apos;s render loop: &ldquo;tell me when you&apos;re about to paint, and
          I&apos;ll update.&rdquo; It auto-pauses in hidden tabs and matches the display refresh.{' '}
          <code>requestIdleCallback</code> (2015) extended the idea for background work. CSS transitions/animations now
          handle most declarative animation (often more performant than JS+rAF), but <code>rAF</code> remains essential
          for imperative, JS-driven animation and canvas.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Primitive</th>
                <th>Loop point</th>
                <th>Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>requestAnimationFrame</code></td>
                <td>Pre-paint, once per frame</td>
                <td>Animation, canvas, visual updates</td>
              </tr>
              <tr>
                <td><code>queueMicrotask</code> / promise</td>
                <td>After current task, before paint</td>
                <td>&ldquo;ASAP after this sync code&rdquo;</td>
              </tr>
              <tr>
                <td><code>setTimeout</code></td>
                <td>Next macrotask after delay</td>
                <td>Deferred non-visual work, yielding</td>
              </tr>
              <tr>
                <td><code>setInterval</code></td>
                <td>Repeating macrotasks</td>
                <td>Polling (avoid for animation)</td>
              </tr>
              <tr>
                <td><code>requestIdleCallback</code></td>
                <td>Spare frame/free time</td>
                <td>Low-priority background work</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A <code>rAF</code> Animation Loop</h2>

        <CodeBlock
          code={`let pos = 0, rafId;
function animate(timestamp) {
  pos += 2;                       // advance state
  box.style.transform = \`translateX(\${pos}px)\`; // update visual
  if (pos < 300) rafId = requestAnimationFrame(animate); // schedule next
}
rafId = requestAnimationFrame(animate); // start

// To stop: cancelAnimationFrame(rafId);`}
          filename="raf-loop.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>requestAnimationFrame(animate)</code> registers <code>animate</code> to run before the next paint.
              The loop hasn&apos;t started &mdash; <code>animate</code> first runs at the next frame.
            </span>
          </li>
          <li>
            <span>
              At the next frame (pre-paint), the browser calls <code>animate(timestamp)</code>. We advance{' '}
              <code>pos</code>, update <code>box.style.transform</code>. Because this runs <em>before</em> paint, the
              new position is visible in this very frame.
            </span>
          </li>
          <li>
            <span>
              If <code>pos &lt; 300</code>, we schedule <code>animate</code> again for the next frame. Each frame: one
              state update, one visual update, perfectly aligned &mdash; ~60 updates per second on a 60Hz display.
            </span>
          </li>
          <li>
            <span>
              If the tab is hidden, the browser pauses rAF callbacks (battery saving); they resume when visible.{' '}
              <code>cancelAnimationFrame(rafId)</code> stops the loop cleanly &mdash; essential for cleanup (Day 4).
            </span>
          </li>
          <li>
            <span>
              The <code>timestamp</code> argument lets you compute delta time, making the animation frame-rate{' '}
              <em>independent</em> (moves the same speed on 60Hz and 120Hz). Always derive motion from elapsed time,
              not a fixed increment, for consistency.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Time-based (frame-rate-independent) animation</h3>
        <CodeBlock
          code={`let last = null, pos = 0;
const SPEED = 200; // pixels per second
function animate(now) {
  if (last === null) last = now;
  const dt = (now - last) / 1000; // seconds since last frame
  last = now;
  pos += SPEED * dt;              // same speed on 60Hz or 120Hz
  box.style.transform = \`translateX(\${pos}px)\`;
  if (pos < 300) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);`}
          filename="time-based.js"
        />

        <h3 className="article-h3">2. <code>rAF</code>-throttled scroll handler</h3>
        <CodeBlock
          code={`// At most one update per frame — smooth and efficient
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateProgress(); ticking = false; });
});`}
          filename="raf-scroll.js"
        />

        <h3 className="article-h3">3. Yielding with <code>setTimeout</code> to break long tasks</h3>
        <CodeBlock
          code={`// Process a big array in chunks so the UI stays responsive
function chunk(items, process) {
  let i = 0;
  function step() {
    const end = Math.min(i + 100, items.length);
    for (; i < end; i++) process(items[i]);
    if (i < items.length) setTimeout(step, 0); // yield between chunks
  }
  step();
}
// setTimeout(…, 0) yields to the event loop → renders/input get a turn.`}
          filename="yield.js"
        />

        <h3 className="article-h3">4. <code>queueMicrotask</code> for &ldquo;ASAP after this&rdquo;</h3>
        <CodeBlock
          code={`// Update state, then notify — but after the current sync code:
function setState(patch) {
  Object.assign(state, patch);
  queueMicrotask(notify); // runs before paint, before any timer
}
// Use when you want to batch multiple synchronous state changes into one
// notification, but still update within the same frame.`}
          filename="microtask.js"
        />

        <h3 className="article-h3">5. <code>requestIdleCallback</code> for background work</h3>
        <CodeBlock
          code={`// Precompute analytics when the browser is free
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && queue.length) {
    process(queue.pop()); // do work only while time remains
  }
  if (queue.length) requestIdleCallback(processMore); // resume later
});
// Never blocks the UI; may be delayed if the tab is busy. \`timeout\` option
// ensures it runs within N ms even if idle time is scarce.`}
          filename="idle.js"
        />

        <h3 className="article-h3">6. Always clean up scheduled work</h3>
        <CodeBlock
          code={`const rafId = requestAnimationFrame(animate);
const timerId = setTimeout(deferred, 1000);
// On teardown:
cancelAnimationFrame(rafId);
clearTimeout(timerId);
// Forgotten rAF/timer callbacks keep running (and capturing scope) —
// a leak (Day 4). Cancel everything you schedule.`}
          filename="cleanup.js"
        />

        <div className="article-callout">
          <p>
            Prefer <strong>CSS transitions/animations</strong> for declarative animation whenever possible &mdash; they
            run off the main thread (compositor-only) and stay smooth even when JS is busy. Reserve{' '}
            <code>rAF</code> + JS for animations that can&apos;t be expressed declaratively (canvas, physics,
            data-driven). The fastest animation is the one the browser handles natively.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Build a smooth horizontal animation three ways &mdash; <code>setInterval</code>, naive <code>rAF</code>
            (fixed increment), and time-based <code>rAF</code> &mdash; and observe the difference on a 60Hz vs high-
            refresh display and when switching tabs. Then write an <code>rAF</code>-throttled scroll handler and a{' '}
            <code>requestIdleCallback</code> background task.
          </p>
        </div>

        <CodeBlock
          code={`// 1. BAD: setInterval — frame-misaligned, runs in background tabs
setInterval(() => { box.style.transform = \`translateX(\${pos += 2}px)\`; }, 16);

// 2. OK but frame-rate-dependent: fixed increment in rAF
function fixed() { box.style.transform = \`translateX(\${pos += 2}px)\`; if (pos < 300) requestAnimationFrame(fixed); }
requestAnimationFrame(fixed);

// 3. BEST: time-based rAF — same speed everywhere, pauses when hidden
let last = null, pos = 0;
function timeBased(now) {
  if (last === null) last = now;
  pos += 200 * (now - last) / 1000; last = now;
  box.style.transform = \`translateX(\${pos}px)\`;
  if (pos < 300) requestAnimationFrame(timeBased);
}
requestAnimationFrame(timeBased);

// rAF-throttled scroll:
let ticking = false;
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { updateProgress(); ticking = false; }); } });

// Idle background task:
const work = bigArray.slice();
requestIdleCallback(function run(deadline) {
  while (deadline.timeRemaining() && work.length) process(work.pop());
  if (work.length) requestIdleCallback(run);
});`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does the time-based version move at the same speed on 120Hz? (Because each frame advances{' '}
            <code>pos</code> by <code>SPEED &times; dt</code>, where <code>dt</code> is smaller on 120Hz (frames come
            twice as often). Twice as many frames &times; half the distance each = the same pixels per second. The
            fixed-increment version would move twice as fast on 120Hz &mdash; a subtle bug.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is <code>requestAnimationFrame</code> and why use it?</h4>
            <p className="iq-a">
              An API that schedules a callback to run once per frame, immediately before the browser repaints, aligned
              to the display refresh. Use it for any visual/animation update: it syncs work to output (no wasted
              mid-frame work), adapts to the refresh rate, and pauses in hidden tabs (battery saving). It&apos;s the
              correct tool for smooth animation; <code>setTimeout</code> is frame-misaligned.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Why is <code>rAF</code> better than <code>setInterval</code> for animation?</h4>
            <p className="iq-a">
              <code>rAF</code> fires once per actual frame, just before paint &mdash; perfectly aligned with what the
              user sees. <code>setInterval</code> fires on a fixed clock that ignores the refresh rate (wasted or
              missed updates), keeps running in background tabs (wasted CPU/battery), and stacks callbacks if a handler
              exceeds the interval. <code>rAF</code> avoids all three: aligned, paused when hidden, non-stacking.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. <code>setTimeout(fn, 0)</code> vs <code>queueMicrotask(fn)</code>?</h4>
            <p className="iq-a">
              Different loop points and priority. <code>queueMicrotask</code> (and promise <code>.then</code>) runs as a
              microtask &mdash; after the current task, before render and before the next macrotask.{' '}
              <code>setTimeout(fn, 0)</code> is a macrotask &mdash; it runs on a later loop turn, after pending
              microtasks and potentially after paint. Microtasks are higher priority and run sooner; use them for
              &ldquo;ASAP after this.&rdquo; Use <code>setTimeout</code> to truly yield to other tasks/rendering.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is <code>requestIdleCallback</code> for?</h4>
            <p className="iq-a">
              Running low-priority work during the browser&apos;s spare time &mdash; at the end of a frame with time
              left, or when idle. The callback receives a <code>deadline</code> with <code>timeRemaining()</code>; you
              check it and stop before overrunning into the next frame, rescheduling if needed. Use it for background
              tasks that shouldn&apos;t block the UI (precomputation, analytics, prefetching). Never for urgent or
              visual work.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). How do you make a JS animation frame-rate independent?</h4>
            <p className="iq-a">
              Derive motion from elapsed time, not a fixed per-frame increment. <code>rAF</code> passes a high-res{' '}
              <code>timestamp</code>; compute <code>dt = (now - last) / 1000</code> seconds and advance position by{' '}
              <code>speed &times; dt</code>. On a 120Hz display, frames come twice as often but each moves half as far
              &mdash; same pixels per second. A fixed-increment animation would run twice as fast on high-refresh
              displays. Always time-base animations that matter.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How would you keep a heavy scroll handler from janking?</h4>
            <p className="iq-a">
              Three layers: (1) <strong>throttle to the frame rate</strong> with an rAF flag &mdash; at most one update
              per frame, so 200 scroll events collapse to ~60 updates; (2) <strong>do cheap work in the handler, expensive
              work off it</strong> &mdash; store <code>scrollY</code>, let rAF read it and update visuals; (3){' '}
              <strong>avoid layout thrash</strong> &mdash; don&apos;t interleave reads (offsetTop) and writes (style) which
              force synchronous reflow. For purely visual scroll effects, prefer CSS (<code>position: sticky</code>,
              scroll-driven animations) which run on the compositor, off the main thread entirely.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Describe one frame of the event loop and where each timing API fires.</h4>
            <p className="iq-a">
              A frame proceeds: (1) <strong>Run one macrotask</strong> &mdash; an event handler, a <code>setTimeout</code>/{' '}
              <code>setInterval</code> callback, or a message event. (2) <strong>Drain the microtask queue entirely</strong>{' '}
              &mdash; promise <code>.then</code>/<code>catch</code>/<code>finally</code>, <code>queueMicrotask</code>,{' '}
              <code>MutationObserver</code>, and <code>await</code> continuations, in FIFO order, even ones queued
              during draining. (3) <strong>Run requestAnimationFrame callbacks</strong> &mdash; all registered this
              frame, just before paint, each receiving a timestamp. (4) <strong>Render</strong> &mdash; style, layout,
              paint, composite; this is what the user sees. (5) If time remains in the ~16ms budget, run{' '}
              <strong>requestIdleCallback</strong> callbacks with a deadline; they check{' '}
              <code>deadline.timeRemaining()</code> and yield. Then the next frame repeats. So within a frame: timers
              and events first, then microtasks (before paint, before rAF), then rAF (pre-paint), then paint, then idle.
              This ordering explains why a promise callback beats a zero-delay timer (Day 4 Week 4), and why rAF is the
              visual-update hook (it&apos;s the last code to run before pixels change).
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
