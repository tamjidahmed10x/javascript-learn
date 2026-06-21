import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('async-js')!
const navItems = weekNav(week)

export default function AsyncDay6() {
  const { prev, next } = dayNavLinks(week, 6)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[5].title}</h1>
        <p className="lesson-subtitle">
          Four combinators, one mental table. Knowing which to reach for is half of production async code.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>Combinators</strong> are static methods that coordinate multiple promises:{' '}
            <code>Promise.all</code> (all-or-nothing), <code>Promise.allSettled</code> (wait for all),{' '}
            <code>Promise.race</code> (first to settle), <code>Promise.any</code> (first to fulfill).
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Each takes an iterable of promises and returns a new promise whose state summarizes the inputs. They differ
            in <em>which</em> input settles the result and whether rejections cause failure. Error handling maps to{' '}
            <code>try/catch</code> (await) or <code>.catch</code> (chains).
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            <code>all</code> for &ldquo;need every result,&rdquo; <code>allSettled</code> for &ldquo;best effort,&rdquo;
            <code> race</code> for timeouts/cancellation, <code>any</code> for &ldquo;fastest mirror.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Real async code rarely does one thing. It loads several resources, races a fetch against a timeout, retries
          on failure. Yesterday you saw how <code>await</code> and <code>Promise.all</code> parallelize independent
          work. Today we complete the toolkit: the four combinators and the error-handling patterns that go with them.
        </p>

        <CodeBlock
          code={`// Load three resources, fail if ANY fails, results in input order:
const [user, posts, settings] = await Promise.all([
  fetchUser(1), fetchPosts(1), fetchSettings(1),
]);

// Race a fetch against a timeout — whichever settles first wins:
const result = await Promise.race([fetch(url), timeout(5000)]);`}
          filename="intro.js"
        />

        <p className="article-para">
          Both lines coordinate multiple promises, but with opposite philosophies: <code>all</code> wants everything,
          <code> race</code> wants the first. Knowing the four combinators &mdash; and when each is right &mdash; is
          the difference between async code that works and async code that hangs or fails silently.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term"><code>Promise.all</code></dt>
            <dd className="def-text">
              Waits for all to fulfill; fulfills with an array of results in input order. <strong>Short-circuits on
              first rejection</strong> &mdash; rejects with that reason immediately (other promises keep running).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>Promise.allSettled</code></dt>
            <dd className="def-text">
              Waits for all to settle, never rejects. Resolves with an array of{' '}
              <code>{'{ status, value }'}</code>/<code>{'{ status, reason }'}</code> objects describing each outcome.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>Promise.race</code></dt>
            <dd className="def-text">
              Settles with the first promise to settle &mdash; fulfill <em>or</em> reject. Used for timeouts and
              cancellation. Other promises keep running (no built-in cancellation).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>Promise.any</code></dt>
            <dd className="def-text">
              Fulfills with the first promise to <em>fulfill</em>. Rejects only if <strong>all</strong> reject (with an{' '}
              <code>AggregateError</code>). The &ldquo;optimistic&rdquo; combinator.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Four Race Types</h2>
        <p className="article-para">
          Picture four runners, each a promise. The combinators are different finish rules:
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🎯</span>
            <span className="analogy-label">Everyone must finish (<code>all</code>)</span>
            <span className="analogy-target">Fulfills with all results; one collapse = everyone loses</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📊</span>
            <span className="analogy-label">Record every outcome (<code>allSettled</code>)</span>
            <span className="analogy-target">Always resolves; report who finished/who collapsed</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏁</span>
            <span className="analogy-label">First to cross wins (<code>race</code>)</span>
            <span className="analogy-target">First settle (good or bad) ends it</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🥇</span>
            <span className="analogy-label">First to <em>finish</em> (<code>any</code>)</span>
            <span className="analogy-target">First fulfill wins; collapses ignored unless all collapse</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            None of the combinators <strong>cancel</strong> the losing promises &mdash; they just stop paying
            attention. A losing fetch still completes in the background. Real cancellation requires{' '}
            <code>AbortController</code> (covered below), or the losing work runs to completion and is discarded.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Combinator Table</h2>
        <p className="article-para">
          This one table answers 90% of &ldquo;which combinator should I use?&rdquo; questions. Read it carefully
          &mdash; the differences are subtle and interviewers love them.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Fulfills when</th>
                <th>Rejects when</th>
                <th>Result shape</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Promise.all</code></td>
                <td>All fulfill</td>
                <td>Any rejects (first)</td>
                <td>Array of values, in order</td>
              </tr>
              <tr>
                <td><code>Promise.allSettled</code></td>
                <td>Always (all settle)</td>
                <td>Never</td>
                <td>Array of <code>{'{status, value|reason}'}</code></td>
              </tr>
              <tr>
                <td><code>Promise.race</code></td>
                <td>First to fulfill</td>
                <td>First to reject</td>
                <td>The first settled value/reason</td>
              </tr>
              <tr>
                <td><code>Promise.any</code></td>
                <td>First to fulfill</td>
                <td>All reject (<code>AggregateError</code>)</td>
                <td>The first fulfilled value</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. <code>all</code> short-circuits on rejection</h4>
            <p className="theory-desc">
              The moment any input rejects, <code>Promise.all</code> rejects with that reason &mdash; it doesn&apos;t
              wait for the others. But the other promises <em>keep running</em>; only the result is ignored.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>allSettled</code> never throws</h4>
            <p className="theory-desc">
              It always resolves. Each entry is an object: <code>{'{ status: "fulfilled", value }'}</code> or{' '}
              <code>{'{ status: "rejected", reason }'}</code>. Use it when partial success matters (e.g., load all
              images, show the ones that worked).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>race</code> is symmetric on settle type</h4>
            <p className="theory-desc">
              First to settle wins, whether fulfilled or rejected. A timeout implemented as a rejected promise will
              win the race and propagate the rejection. Classic timeout pattern.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. <code>any</code> is the optimistic mirror of <code>all</code></h4>
            <p className="theory-desc">
              First <em>fulfillment</em> wins; rejections are ignored unless every input rejects, in which case it
              rejects with an <code>AggregateError</code> collecting all reasons. Great for racing mirrors/redundant
              sources.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Error handling: the two surfaces</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label"><code>async/await</code> + <code>try/catch</code></span>
            <p className="phase-desc">Reads like sync code; one catch covers a block of awaits.</p>
            <ul className="phase-rules">
              <li>Most readable for sequential logic</li>
              <li><code>finally</code> works for cleanup</li>
              <li>Granular: wrap each await or the whole block</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label"><code>.catch</code> on chains/combinators</span>
            <p className="phase-desc">A single handler at the end of a chain or around a combinator.</p>
            <ul className="phase-rules">
              <li>Concise for pipelines</li>
              <li>Recovery: return a value in catch to continue</li>
              <li>Re-throw to keep the failure propagating</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Unhandled promise rejections are a real production hazard. A promise that rejects with no{' '}
            <code>.catch</code>/<code>await try</code> logs a warning (browsers) or crashes the process (Node 15+).
            The safe rule: <strong>every promise chain ends in a <code>.catch</code> or is <code>await</code>ed inside
            a <code>try</code></strong>. Linters can enforce this.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Four Combinators</h2>
        <p className="article-para">
          ES6 (2015) shipped <code>Promise.all</code> and <code>Promise.race</code> &mdash; the two extremes
          (everyone, or the first). Real-world code kept needing &ldquo;wait for all but don&apos;t fail&rdquo; and
          &ldquo;first success,&rdquo; which developers hand-rolled. ES2020 added <code>Promise.allSettled</code>; ES2021
          added <code>Promise.any</code> (with <code>AggregateError</code> to carry multiple reasons). Together the
          four cover every common coordination need, eliminating most hand-rolled counters and flags.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Use case</th>
                <th>Right combinator</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Load user, posts, settings &mdash; need all</td>
                <td><code>Promise.all</code></td>
              </tr>
              <tr>
                <td>Preload images, show whatever loads</td>
                <td><code>Promise.allSettled</code></td>
              </tr>
              <tr>
                <td>Fetch with a 5s timeout</td>
                <td><code>Promise.race</code></td>
              </tr>
              <tr>
                <td>Try 3 mirrors, use fastest</td>
                <td><code>Promise.any</code></td>
              </tr>
              <tr>
                <td>First of several, success or fail</td>
                <td><code>Promise.race</code></td>
              </tr>
              <tr>
                <td>All-or-nothing transaction</td>
                <td><code>Promise.all</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A Timeout with <code>race</code></h2>

        <CodeBlock
          code={`function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timed out")), ms)
  );
}

async function fetchWithTimeout(url, ms) {
  try {
    const res = await Promise.race([fetch(url), timeout(ms)]);
    return await res.json();
  } catch (err) {
    if (err.message === "timed out") console.warn(url, "slow");
    throw err; // re-throw to caller
  }
}`}
          filename="timeout.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>Promise.race</code> starts both <code>fetch(url)</code> and <code>timeout(ms)</code> immediately.
              Whichever settles first decides the outcome.
            </span>
          </li>
          <li>
            <span>
              If <code>fetch</code> returns within <code>ms</code>: <code>race</code> fulfills with the response;
              <code> timeout</code>&apos;s later rejection is ignored (but its timer still fires &mdash; a dangling
              rejection, hence the empty <code>catch</code> inside <code>timeout</code> is wise, or attach a{' '}
              <code>.catch</code>).
            </span>
          </li>
          <li>
            <span>
              If <code>ms</code> elapses first: <code>timeout</code> rejects; <code>race</code> rejects; the{' '}
              <code>try</code> catches it; we warn and re-throw so the caller sees the failure.
            </span>
          </li>
          <li>
            <span>
              The losing <code>fetch</code> <em>keeps running</em> in the background &mdash; its result is discarded.
              To truly cancel it, pass an <code>AbortSignal</code> to <code>fetch</code> and abort on timeout.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. <code>Promise.all</code> &mdash; all-or-nothing, ordered</h3>
        <CodeBlock
          code={`const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
// Results are in INPUT order, not completion order.
// If fetchB rejects, the whole thing rejects immediately with fetchB's
// reason; fetchA and fetchC results are lost (but they still complete).`}
          filename="all.js"
        />

        <h3 className="article-h3">2. <code>Promise.allSettled</code> &mdash; best-effort collection</h3>
        <CodeBlock
          code={`const results = await Promise.allSettled([loadA(), loadB(), loadC()]);
for (const r of results) {
  if (r.status === "fulfilled") console.log("ok", r.value);
  else console.log("failed", r.reason.message);
}
// Always resolves. Use to render whatever succeeded, log what failed.`}
          filename="allSettled.js"
        />

        <h3 className="article-h3">3. <code>Promise.race</code> &mdash; timeout / first-finish</h3>
        <CodeBlock
          code={`const fastest = await Promise.race([
  fetch("mirror1/api"),
  fetch("mirror2/api"),
  fetch("mirror3/api"),
]);
// First to settle (fulfill OR reject) wins. If the fastest mirror is
// down and rejects first, you get a rejection even if others succeed.
// For "first success" use Promise.any instead.`}
          filename="race.js"
        />

        <h3 className="article-h3">4. <code>Promise.any</code> &mdash; first success</h3>
        <CodeBlock
          code={`const winner = await Promise.any([
  fetch("mirror1/api"), // rejects
  fetch("mirror2/api"), // fulfills in 80ms
  fetch("mirror3/api"), // fulfills in 120ms
]);
// winner = mirror2's response (first FULFILLMENT).
// Only rejects if ALL reject, with an AggregateError:
//   err.errors is an array of all rejection reasons.`}
          filename="any.js"
        />

        <h3 className="article-h3">5. Retry with exponential backoff</h3>
        <CodeBlock
          code={`async function retry(fn, attempts = 3, delay = 200) {
  try {
    return await fn();
  } catch (err) {
    if (attempts <= 1) throw err;          // out of tries → propagate
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, attempts - 1, delay * 2); // exponential backoff
  }
}
const data = await retry(() => fetch("/flaky").then((r) => r.json()));`}
          filename="retry.js"
        />

        <h3 className="article-h3">6. Real cancellation with <code>AbortController</code></h3>
        <CodeBlock
          code={`const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);
try {
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timer);
  return await res.json();
} catch (err) {
  if (err.name === "AbortError") console.warn("cancelled");
  else throw err;
}
// Unlike Promise.race, this ACTUALLY cancels the network request, freeing
// the connection and resources. AbortController is the standard JS
// cancellation primitive.`}
          filename="abort.js"
        />

        <div className="article-callout">
          <p>
            Concurrency limits: <code>Promise.all</code> on 10,000 items fires them all at once, which can exhaust
            connections or rate limits. For bounded concurrency, chunk with a small <code>Promise.all</code> per batch,
            or use an iterator that processes N at a time. The pattern matters more than the primitive in real
            systems.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Build a <code>loadGallery(urls)</code> that downloads all images in parallel but renders each as it
            arrives and shows a placeholder for any that fail &mdash; using <code>allSettled</code>. Then build{' '}
            <code>fetchFastest(mirrors)</code> using <code>Promise.any</code>, and a <code>fetchWithTimeout</code>{' '}
            using <code>AbortController</code> (true cancellation).
          </p>
        </div>

        <CodeBlock
          code={`// 1. Best-effort gallery
async function loadGallery(urls) {
  const settled = await Promise.allSettled(urls.map((u) => loadImage(u)));
  return settled.map((r, i) =>
    r.status === "fulfilled" ? r.value : placeholder(urls[i], r.reason)
  );
}

// 2. First successful mirror
async function fetchFastest(mirrors) {
  try {
    return await Promise.any(mirrors.map((m) => fetch(m).then((r) => r.json())));
  } catch (aggErr) {
    throw new Error("All mirrors failed: " + aggErr.errors.map((e) => e.message).join(", "));
  }
}

// 3. True cancellation via AbortController
function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
}`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why use <code>allSettled</code> instead of <code>all</code> for the gallery? (Because one broken image
            shouldn&apos;t fail the whole gallery &mdash; <code>all</code> would reject on the first failure and lose
            the others. <code>allSettled</code> lets you render successes and placeholders for failures, which is the
            resilient UX.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Difference between <code>Promise.all</code>, <code>allSettled</code>, <code>race</code>, and <code>any</code>?</h4>
            <p className="iq-a">
              <code>all</code> fulfills with all results in order, rejects on the first rejection.{' '}
              <code>allSettled</code> always resolves, reporting each outcome (<code>{'{status,value|reason}'}</code>).{' '}
              <code>race</code> settles (fulfill or reject) with the first to settle. <code>any</code> fulfills with
              the first to fulfill, rejects only if all reject (with an <code>AggregateError</code>). They differ in
              which input decides the outcome and how rejections are treated.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. When <code>Promise.all</code> rejects, do the other promises get cancelled?</h4>
            <p className="iq-a">
              No. <code>all</code> stops <em>waiting</em> and rejects with the first rejection, but the other
              promises continue running to completion &mdash; their results are just discarded. JavaScript promises
              have no built-in cancellation. To actually cancel, use <code>AbortController</code>/<code>AbortSignal</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. How do you implement a timeout for a promise?</h4>
            <p className="iq-a">
              With <code>Promise.race([task, timeoutPromise])</code>, where <code>timeoutPromise</code> rejects after
              the delay. The first to settle wins, so a slow task loses to the timeout rejection. Note this only
              <em> stops waiting</em> &mdash; the task keeps running. For real cancellation, pass an{' '}
              <code>AbortSignal</code> to the underlying API (e.g., <code>fetch</code>) and abort it on timeout.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is an unhandled promise rejection, and why care?</h4>
            <p className="iq-a">
              A promise that rejects with no <code>.catch</code> or enclosing <code>await</code> + <code>try</code>.
              Browsers log a warning; Node 15+ terminates the process. It usually means a failure path was forgotten,
              so errors vanish silently or crash production. End every chain with a <code>.catch</code> or{' '}
              <code>await</code> it inside <code>try</code>.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Implement <code>Promise.all</code> from scratch.</h4>
            <p className="iq-a">
              <code>{'function all(promises) { return new Promise((resolve, reject) => { const results = new Array(promises.length); let remaining = promises.length; if (remaining === 0) return resolve([]); promises.forEach((p, i) => { Promise.resolve(p).then((v) => { results[i] = v; if (--remaining === 0) resolve(results); }, reject); }); }); }'}</code>{' '}
              Key points: store results by index to preserve order, decrement a counter, resolve when it hits zero,
              reject immediately on any rejection. Wrap each input with <code>Promise.resolve</code> so non-promise
              values work. Handle the empty-array edge case.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Difference between <code>race</code> and <code>any</code> for mirrors?</h4>
            <p className="iq-a">
              <code>race</code> settles with the first promise to settle of <em>either</em> kind &mdash; so if the
              fastest mirror is down and rejects first, you get a rejection even though other mirrors would succeed.
              <code> any</code> ignores rejections until one fulfills, so it returns the first <em>successful</em>{' '}
              response. For &ldquo;use the fastest working mirror,&rdquo; <code>any</code> is correct;{' '}
              <code>race</code> would wrongly fail on a fast-but-broken mirror.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How would you limit <code>Promise.all</code> to N concurrent operations?</h4>
            <p className="iq-a">
              <code>Promise.all</code> fires everything at once, which can exhaust connections or trip rate limits. To
              bound concurrency, maintain a pool of size N: start N promises, and each time one finishes, start the
              next from the queue. A simple version uses a recursive <code>runNext</code> over an index, or an
              async-iterable mapper. Libraries call this <code>p-limit</code> / <code>pool</code>. The pattern: keep a
              count of in-flight tasks, never exceeding N, and resolve the outer promise when all are done. This
              preserves <code>Promise.all</code>&apos;s ordered-results guarantee while capping parallelism &mdash;
              essential for batched API calls or file processing.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
