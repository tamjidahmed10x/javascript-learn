import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('modules-perf-memory')!
const navItems = weekNav(week)

export default function ModulesDay5() {
  const { prev, next } = dayNavLinks(week, 5)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[4].title}</h1>
        <p className="lesson-subtitle">
          Three event-handling tools that keep the main thread calm. Delegate to share, debounce to settle, throttle
          to pace.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>Event delegation</strong> attaches one listener to a parent that handles events from all children.
            <strong> Debounce</strong> runs a function only after activity <em>stops</em> for a delay.{' '}
            <strong>Throttle</strong> runs a function at most once per interval.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Delegation uses event bubbling + <code>event.target</code>. Debounce clears and resets a timer on each call,
            firing only when calls pause. Throttle records a last-run time and skips calls within the window.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Delegate for many similar children (lists, tables, menus). Debounce for burst-then-wait inputs (search,
            resize). Throttle for continuous streams you want paced (scroll, mousemove, drag).
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          The main thread is single (Week 4 Day 1). Fire a handler a thousand times during a scroll and you&apos;ll
          jank the page. These three patterns tame event volume &mdash; by sharing a listener, by waiting for calm, or
          by capping the rate. They&apos;re the bread and butter of responsive UI.
        </p>

        <CodeBlock
          code={`// Three problems, three tools:
// 1. 1000 list items, each needing a click handler  → DELEGATE (1 handler)
// 2. Search box firing on every keystroke           → DEBOUNCE (wait for pause)
// 3. Scroll handler running 200x/sec                → THROTTLE (cap to 60x/sec)`}
          filename="intro.js"
        />

        <p className="article-para">
          Different problems, different tools. Picking wrong wastes work: debouncing scroll makes it feel laggy;
          throttling search fires queries mid-typing. The skill is matching the tool to the event&apos;s shape.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Event delegation</dt>
            <dd className="def-text">
              One listener on a parent handles events from all descendants, using bubbling and <code>event.target</code>.
              Scales to dynamic/large collections with a single handler.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Debounce</dt>
            <dd className="def-text">
              Delay a function&apos;s execution until a burst of calls <em>stops</em> for a given wait. Each new call
              resets the timer. Result: one execution per quiet period.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Throttle</dt>
            <dd className="def-text">
              Cap a function to run at most once per interval, no matter how often it&apos;s called. Result: a paced
              rate (e.g. at most every 16ms) during continuous activity.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Three Doors Analogy</h2>
        <p className="article-para">
          <strong>Delegation</strong> is a single receptionist for a whole floor instead of a bell at every desk.
          <strong> Debounce</strong> is an elevator door: every time someone trips the sensor, it resets the timer &mdash;
          it only closes once everyone stops arriving. <strong>Throttle</strong> is a turnstile: no matter how fast
          the crowd pushes, only one person passes per beat.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🧑‍💼</span>
            <span className="analogy-label">One receptionist for the floor</span>
            <span className="analogy-target">Event delegation</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🚪</span>
            <span className="analogy-label">Elevator door (waits for calm)</span>
            <span className="analogy-target">Debounce</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔄</span>
            <span className="analogy-label">Turnstile (fixed pace)</span>
            <span className="analogy-target">Throttle</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">⏱️</span>
            <span className="analogy-label">The cadence knob</span>
            <span className="analogy-target">The <code>wait</code> argument</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The key distinction: debounce <strong>groups</strong> (waits for a pause, runs once at the end); throttle{' '}
            <strong>pacing</strong> (runs at a steady rate throughout). For &ldquo;react when they stop typing,&rdquo;
            debounce. For &ldquo;do something while scrolling, but not too often,&rdquo; throttle. Same wait value,
            opposite feel.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          All three are higher-order functions over events (Week 2 Day 3). Each manipulates <em>when</em> the handler
          runs relative to the event stream.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Delegation rides bubbling</h4>
            <p className="theory-desc">
              Events bubble from the target up to the root. A listener on a parent fires for every child&apos;s event;
              <code> event.target</code> is the actual element clicked. One handler, N children &mdash; and it works
              for dynamically added children too.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Debounce resets a timer on each call</h4>
            <p className="theory-desc">
              Store a timer id; on each call, clear it and start a new <code>setTimeout(wait)</code>. Only when calls
              pause for <code>wait</code> does the timeout actually fire. Trailing-edge by default; a leading-edge
              variant fires immediately then locks.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Throttle enforces a minimum gap</h4>
            <p className="theory-desc">
              Record <code>lastRun</code>; on each call, if <code>now - lastRun &gt;= wait</code>, run and update; else
              skip (or schedule a trailing call). Caps the rate to once per <code>wait</code> regardless of input
              frequency.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. All need cleanup</h4>
            <p className="theory-desc">
              Timers must be cleared on teardown (Day 4) or they leak. The debounced/throttled wrapper returns a
              function; the caller is responsible for removing listeners and clearing pending timers (a{' '}
              <code>.cancel()</code> method is idiomatic).
            </p>
          </div>
        </div>

        <h3 className="article-h3">Debounce vs throttle &mdash; output over time</h3>
        <CodeBlock
          code={`// Calls at t=0,100,200,300 ... then a pause ... with wait=250:
// DEBOUNCE: fires ONCE at t=550 (250ms after the last call at 300)
// THROTTLE: fires at t=0, t=250, t=500 ... (once per 250ms throughout)
// Same wait, opposite behavior. Pick by intent: "after calm" vs "at a pace".`}
          filename="compare.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Debounce</span>
            <p className="phase-desc">Run once after activity stops.</p>
            <ul className="phase-rules">
              <li>Search-as-you-type (query on pause)</li>
              <li>Window resize (recompute when done)</li>
              <li>Autosave (save when edits pause)</li>
              <li>Validation on blur-of-input</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Throttle</span>
            <p className="phase-desc">Run at a capped rate during activity.</p>
            <ul className="phase-rules">
              <li>Scroll position tracking</li>
              <li>Mousemove / drag updates</li>
              <li>Button spam protection</li>
              <li>Analytics pings during interaction</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            A subtle but important difference: debounce <strong>discards</strong> intermediate calls (only the last
            matters); throttle <strong>samples</strong> the stream at intervals (each sample reflects the latest state).
            For a search box you want the final query (debounce); for a scroll-progress bar you want continuous
            updates at a sane rate (throttle). Misuse feels broken: throttled search fires mid-word; debounced scroll
            feels frozen.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why These Matter</h2>
        <p className="article-para">
          Event delegation predates jQuery (which popularized <code>.on()</code> with selectors). Debounce/throttle
          became standard with lodash and underscore, codifying patterns developers had hand-rolled for years. They
          matter because the DOM fires events at high rates &mdash; <code>scroll</code> and <code>mousemove</code> can
          trigger dozens of times per second, and <code>resize</code> fires continuously during a drag. Without rate
          control, a heavy handler monopolizes the main thread and the UI stutters. These tools are the difference
          between smooth and janky.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Delegation</th>
                <th>Debounce</th>
                <th>Throttle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Reduces</td>
                <td>Number of listeners</td>
                <td>Executions (1 per pause)</td>
                <td>Execution rate (1 per interval)</td>
              </tr>
              <tr>
                <td>Mechanism</td>
                <td>Bubbling + target</td>
                <td>Clear/reset timer</td>
                <td>Time-since-last check</td>
              </tr>
              <tr>
                <td>Best for</td>
                <td>Lists, menus, dynamic children</td>
                <td>Search, resize, autosave</td>
                <td>Scroll, mousemove, drag</td>
              </tr>
              <tr>
                <td>Feels</td>
                <td>(transparent)</td>
                <td>Delayed (waits for calm)</td>
                <td>Live but paced</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Debounce in Action</h2>

        <CodeBlock
          code={`function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);                 // reset on every call
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
const search = debounce((q) => console.log("query:", q), 300);
search("a");   // t=0   — schedules t=300
search("ab");  // t=150 — clears, schedules t=450
search("abc"); // t=250 — clears, schedules t=550
// ...user stops typing...
// t=550: logs "query: abc"  (only the LAST call runs)`}
          filename="debounce-flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>search("a")</code> at t=0: <code>clearTimeout</code> (no-op, nothing pending), then schedule a
              300ms timer &rarr; would fire at t=300 with <code>"a"</code>.
            </span>
          </li>
          <li>
            <span>
              <code>search("ab")</code> at t=150: <code>clearTimeout</code> cancels the t=300 timer, schedules a new
              one &rarr; t=450 with <code>"ab"</code>. The <code>"a"</code> call is discarded.
            </span>
          </li>
          <li>
            <span>
              <code>search("abc")</code> at t=250: cancels t=450, schedules t=550 with <code>"abc"</code>. Each
              keystroke resets the window.
            </span>
          </li>
          <li>
            <span>
              User stops at t=250. No more resets. At t=550 the timer fires &rarr; <code>fn.apply(this,
              ["abc"])</code> &rarr; logs <code>"query: abc"</code>. One execution, capturing the final value, 300ms
              after typing stopped.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Event delegation for a dynamic list</h3>
        <CodeBlock
          code={`// One handler for ANY item click, present or future:
list.addEventListener("click", (e) => {
  const item = e.target.closest(".item"); // find the clicked item
  if (!item) return;                       // click wasn't on an item
  console.log("clicked", item.dataset.id);
});
// Add 1000 items later — no new listeners needed. \`closest\` walks up
// from the actual target to the matching ancestor.`}
          filename="delegate.js"
        />

        <h3 className="article-h3">2. Debounce (trailing edge) with <code>.cancel()</code></h3>
        <CodeBlock
          code={`function debounce(fn, wait) {
  let timer;
  const debounced = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
  debounced.cancel = () => clearTimeout(timer); // for cleanup
  return debounced;
}
input.addEventListener("input", debounce((e) => search(e.target.value), 300));`}
          filename="debounce.js"
        />

        <h3 className="article-h3">3. Throttle (leading + trailing)</h3>
        <CodeBlock
          code={`function throttle(fn, wait) {
  let last = 0, timer;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {              // enough time passed → run now
      clearTimeout(timer); timer = null;
      last = now;
      fn.apply(this, args);
    } else if (!timer) {              // schedule a trailing call
      timer = setTimeout(() => { last = Date.now(); timer = null; fn.apply(this, args); }, remaining);
    }
  };
}
window.addEventListener("scroll", throttle(updateProgress, 100));`}
          filename="throttle.js"
        />

        <h3 className="article-h3">4. Leading-edge debounce (fire immediately, then lock)</h3>
        <CodeBlock
          code={`// Useful for "do it now, then ignore repeats until calm"
function leadingDebounce(fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer === null) fn.apply(this, args); // fire on first call
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; }, wait); // unlock after wait
  };
}
button.addEventListener("click", leadingDebounce(submit, 1000)); // no double-submit`}
          filename="leading.js"
        />

        <h3 className="article-h3">5. <code>requestAnimationFrame</code> throttle (preview of Day 6)</h3>
        <CodeBlock
          code={`// For visual updates, throttle to the frame rate instead of a fixed ms:
function rafThrottle(fn) {
  let queued = false;
  return function (...args) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn.apply(this, args); });
  };
}
window.addEventListener("scroll", rafThrottle(updateVisuals)); // once per frame, ~60fps`}
          filename="raf-throttle.js"
        />

        <h3 className="article-h3">6. Cleanup to avoid leaks (Day 4)</h3>
        <CodeBlock
          code={`const handler = debounce(search, 300);
input.addEventListener("input", handler);
// On teardown:
input.removeEventListener("input", handler);
handler.cancel(); // clear any pending timer
// Forgetting either leaks: the listener keeps the closure (and its captured
// scope) alive forever.`}
          filename="cleanup.js"
        />

        <div className="article-callout">
          <p>
            Don&apos;t hand-roll when a battle-tested version exists: lodash&apos;s <code>debounce</code>/{' '}
            <code>throttle</code> handle leading/trailing edges, <code>maxWait</code>, and cancellation correctly. But
            know how they work &mdash; the implementations above are the interview answers, and understanding them
            prevents misuse (e.g. expecting a debounced handler to fire synchronously).
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Implement <code>debounce</code> and <code>throttle</code> from scratch (with <code>.cancel()</code>), then
            build three demos: a delegated click handler for a 1000-item list, a debounced search box, and a throttled
            scroll-progress bar. Log timestamps to confirm each tool&apos;s timing behavior.
          </p>
        </div>

        <CodeBlock
          code={`function debounce(fn, wait) {
  let timer;
  const d = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
  d.cancel = () => clearTimeout(timer);
  return d;
}
function throttle(fn, wait) {
  let last = 0, timer = null;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) { clearTimeout(timer); timer = null; last = now; fn.apply(this, args); }
    else if (!timer) { timer = setTimeout(() => { last = Date.now(); timer = null; fn.apply(this, args); }, remaining); }
  };
}

// Delegation: 1 listener for 1000 buttons
container.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) console.log("clicked", btn.textContent);
});

// Debounced search: logs once, 300ms after the last keystroke
searchInput.addEventListener("input", debounce((e) => console.log("search", e.target.value), 300));

// Throttled scroll: logs at most every 100ms during scrolling
window.addEventListener("scroll", throttle(() => console.log("scroll", window.scrollY), 100));`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            For the scroll-progress bar, why is throttle better than debounce? (Because debounce waits for scrolling to{' '}
            <em>stop</em> &mdash; the progress bar would freeze during the scroll and only jump at the end. Throttle
            updates continuously at a capped rate, so the bar tracks smoothly without firing 200x/sec. The intent is
            &ldquo;live but paced,&rdquo; which is exactly throttle.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is event delegation?</h4>
            <p className="iq-a">
              Attaching a single listener to a parent element that handles events from all its descendants, using event
              bubbling and <code>event.target</code> (with <code>.closest()</code> to find the relevant child). It
              scales to large or dynamic lists &mdash; one handler instead of thousands, and it works for children
              added later without re-binding.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Debounce vs throttle?</h4>
            <p className="iq-a">
              Debounce runs once <em>after</em> a burst of calls stops for a wait period (resets a timer on each call) &mdash;
              good for &ldquo;react when they finish&rdquo; (search, resize). Throttle runs at most once per interval
              throughout the burst &mdash; good for &ldquo;react continuously but at a capped rate&rdquo; (scroll,
              mousemove). Same wait value, opposite feel: debounce delays then fires once; throttle paces.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. When would you use delegation over individual listeners?</h4>
            <p className="iq-a">
              When many similar elements share behavior (list items, menu options, table rows), especially if they&apos;re
              dynamic. One parent listener replaces N child listeners (less memory, faster setup), and it automatically
              covers children added later. The trade-off: the handler must inspect <code>event.target</code>/{' '}
              <code>closest()</code> to find the relevant element, so it&apos;s slightly more logic per event.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Implement debounce.</h4>
            <p className="iq-a">
              <code>{'function debounce(fn, wait) { let t; const d = function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); }; d.cancel = () => clearTimeout(t); return d; }'}</code>{' '}
              Each call clears the pending timer and sets a new one for <code>wait</code>; only when calls pause does
              the timeout fire, invoking <code>fn</code> with the latest args and <code>this</code>. A{' '}
              <code>.cancel()</code> lets callers clear pending calls for cleanup.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Implement throttle with a trailing edge.</h4>
            <p className="iq-a">
              Track <code>lastRun</code> and a pending timer. On each call compute <code>remaining = wait - (now - lastRun)</code>;
              if <code>remaining &lt;= 0</code> run immediately and update <code>lastRun</code>; else if no timer is
              pending, schedule a trailing call for <code>remaining</code> ms later (so the final state isn&apos;t
              lost). This guarantees at most one execution per <code>wait</code> while still capturing the last event.
              Without the trailing edge, a fast burst would never see its final value.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why use <code>requestAnimationFrame</code> for scroll handlers instead of throttle?</h4>
            <p className="iq-a">
              For visual updates, syncing to the browser&apos;s repaint cycle (~60fps) is ideal: you update exactly
              once per frame, never more, perfectly aligned with what the user sees. A fixed-ms throttle (e.g. 100ms)
              can fire between frames (wasted work) or miss a frame (stutter). An <code>rAF</code> throttle queues at
              most one callback per frame via a flag, giving smooth visuals at the natural refresh rate. Use it for
              anything that paints; use ms-based throttle for non-visual work (analytics, data).
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). A search box fires a network query per keystroke, hammering the server. How do you fix it, and what edge cases remain?</h4>
            <p className="iq-a">
              Wrap the query in <code>debounce(search, 300)</code> &mdash; it fires once, 300ms after the user stops
              typing, using only the final value. That eliminates mid-typing requests. Edge cases to handle: (1){' '}
              <strong>out-of-order responses</strong> &mdash; an earlier query can resolve after a later one; tag each
              request with an id and ignore stale responses, or use <code>AbortController</code> to cancel in-flight
              requests on each new query (Week 4 Day 6); (2) <strong>minimum length</strong> &mdash; skip queries for
              very short input to reduce noise; (3) <strong>leading edge</strong> &mdash; if you want immediate feedback
              on the first keystroke, use a leading-edge debounce; (4) <strong>cleanup</strong> &mdash; cancel pending
              timers and abort requests on unmount to avoid leaks and setState-after-unmount warnings. The debounce
              fixes the volume; the request-id/abort pattern fixes the ordering correctness.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
