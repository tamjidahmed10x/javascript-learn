import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('consolidation')!
const navItems = weekNav(week)

export default function ConsolidationDay6() {
  const { prev, next } = dayNavLinks(week, 6)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[5].title}</h1>
        <p className="lesson-subtitle">
          Ten problems that synthesize the whole course. Solve them, then explain the trade-offs &mdash; that&apos;s the
          interview.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            Ten hard problems spanning every week: async output ordering, prototype chains, closures,{' '}
            <code>this</code>, coercion, implementation tasks (Promise, debounce, memoize, lazy sequences), and a
            design question. Each tests multiple concepts at once.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Attempt each cold before reading the solution. For output questions, trace step by step naming each rule. For
            implementation tasks, write it from a blank file. Then explain <em>why</em> &mdash; the explanation is the
            interview.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            The capstone problem set. If you can solve 7 of 10 cold and articulate the reasoning, you&apos;re
            interview-ready across the full curriculum.
          </p>
        </div>
      </div>

      {/* ── Hard Problems ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Hard Problems</h2>
        <p className="article-para">
          Attempt each before reading the solution. These are graded on the <em>explanation</em> as much as the answer.
        </p>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 1. Output order?</h4>
          <CodeBlock
            code={`console.log("1");
setTimeout(() => console.log("2"));
Promise.resolve().then(() => console.log("3"));
console.log("4");`}
            filename="p1.js"
          />
          <p className="iq-a">
            <code>1, 4, 3, 2</code>. Sync (<code>1</code>, <code>4</code>) first. Then microtasks drain before
            macrotasks: the promise callback (<code>3</code>) is a microtask, the timer (<code>2</code>) is a macrotask.
            Microtasks always precede macrotasks (Week 4 Day 2). The fundamental ordering rule.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 2. Output?</h4>
          <CodeBlock
            code={`const a = { x: 1 };
const b = Object.create(a);
b.x = 2;
delete b.x;
console.log(b.x);`}
            filename="p2.js"
          />
          <p className="iq-a">
            <code>1</code>. <code>b.x = 2</code> created an own property on <code>b</code> shadowing the inherited one.
            <code> delete b.x</code> removed that own property, so <code>b.x</code> now walks the prototype chain and
            finds <code>a.x = 1</code>. <code>delete</code> only removes own properties; the chain lookup falls through
            to <code>a</code> (Week 3 Day 1).
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 3. Output?</h4>
          <CodeBlock
            code={`var x = 1;
function f() { console.log(x); var x = 2; console.log(x); }
f();`}
            filename="p3.js"
          />
          <p className="iq-a">
            <code>undefined</code>, then <code>2</code>. <code>var x</code> inside <code>f</code> is hoisted to the top
            of the function (Week 1 Day 2), shadowing the outer <code>x</code> &mdash; but the assignment{' '}
            <code>= 2</code> stays in place. So the first <code>console.log</code> reads the hoisted-but-uninitialized{' '}
            <code>x</code> (<code>undefined</code>); the second reads it after the assignment (<code>2</code>). Classic{' '}
            <code>var</code>-hoisting trap.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 4. Output?</h4>
          <CodeBlock
            code={`const obj = { method() { return this.v; }, v: 10 };
const fn = obj.method;
console.log(fn());`}
            filename="p4.js"
          />
          <p className="iq-a">
            <code>undefined</code> (strict mode) or the global&apos;s <code>v</code> (sloppy, likely <code>undefined</code>{' '}
            too). Assigning <code>const fn = obj.method</code> <em>detaches</em> the method &mdash; <code>fn()</code> is
            default binding, so <code>this</code> is <code>undefined</code>/<code>globalThis</code>, not <code>obj</code>.
            <code> this.v</code> is therefore undefined (Week 2 Day 5). Fix: <code>fn.call(obj)</code> or call{' '}
            <code>obj.method()</code> directly.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 5. Output?</h4>
          <CodeBlock
            code={`console.log([] + []);
console.log([] + {});
console.log({} + []);`}
            filename="p5.js"
          />
          <p className="iq-a">
            <code>""</code>, <code>"[object Object]"</code>, and context-dependent. <code>[]+[]</code>: both{' '}
            <code>ToPrimitive</code> to <code>""</code>, concatenate &rarr; <code>""</code>. <code>[]+{}`</code>: <code>[]</code>{' '}
            &rarr; <code>""</code>, <code>{}`</code> &rarr; <code>"[object Object]"</code>, concatenate &rarr; that
            string. <code>{`+[]`}</code>: in an expression context it&apos;s the same (<code>"[object Object]"</code>),
            but at the start of a statement the leading <code>{}`</code> may parse as a block, giving <code>0</code> (the{' '}
            <code>+[]</code>). The spec trace is via <code>ToPrimitive</code> + the <code>+</code> rule (Week 7 Day 6).
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 6. Implement a memoize that handles any args (including objects).</h4>
          <CodeBlock
            code={`function memoize(fn) {
  const cache = new Map(); // serialized-key → result
  return (...args) => {
    const key = JSON.stringify(args); // simple; fails on fns/symbols/cycles
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}`}
            filename="p6.js"
          />
          <p className="iq-a">
            Serialize args to a cache key (<code>JSON.stringify</code> for simplicity). Limitations: functions, symbols,
            and cycles serialize poorly (to <code>null</code> or throw), so two different object-args with the same JSON
            collide, and unbounded growth leaks (add an LRU eviction). For object-identity memoization use a WeakMap
            keyed by the object (Week 5 Day 5 / Week 6 Day 5). The trade-off: JSON keys work for value-equality (two{' '}
            <code>{'{a:1}'}</code> hit the same cache); WeakMap works for identity-equality. Pick by semantics.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 7. Implement lazy <code>map</code>/<code>filter</code>/<code>take</code> over an infinite source; yield first 5 doubled evens.</h4>
          <CodeBlock
            code={`function* naturals() { let n = 1; while (true) yield n++; }
function* map(it, fn) { for (const v of it) yield fn(v); }
function* filter(it, p) { for (const v of it) if (p(v)) yield v; }
function* take(it, n) { let i = 0; for (const v of it) { if (i++ >= n) return; yield v; } }

const out = [...take(map(filter(naturals(), n => n % 2 === 0), n => n * 2), 5)];
// [4, 8, 12, 16, 20]`}
            filename="p7.js"
          />
          <p className="iq-a">
            <code>[4, 8, 12, 16, 20]</code>. The infinite <code>naturals</code> source is never fully realized &mdash;{' '}
            <code>take(5)</code> drives demand backward through <code>map</code> and <code>filter</code> to{' '}
            <code>naturals</code>, which yields only enough to produce 5 doubled evens (up to the 5th even, 10).
            Generators + lazy composition (Week 5 Day 1/3). The pipeline reads top-to-bottom but evaluates on demand.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 8. Implement <code>Promise.all</code> from scratch.</h4>
          <CodeBlock
            code={`function all(promises) {
  return new Promise((resolve, reject) => {
    const arr = [...promises];
    const results = new Array(arr.length);
    let remaining = arr.length;
    if (remaining === 0) return resolve([]);
    arr.forEach((p, i) =>
      Promise.resolve(p).then(
        (v) => { results[i] = v; if (--remaining === 0) resolve(results); },
        reject // first rejection rejects the whole thing
      )
    );
  });
}`}
            filename="p8.js"
          />
          <p className="iq-a">
            Store results by index to preserve input order; decrement a counter; resolve when it hits zero; reject
            immediately on any rejection (Week 4 Day 6). Wrap each input with <code>Promise.resolve</code> so
            non-promises work. Handle empty input (<code>resolve([])</code>). The result order matches input order, not
            completion order &mdash; a common misconception.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 9. Output &mdash; the full async trace.</h4>
          <CodeBlock
            code={`console.log("1");
setTimeout(() => console.log("2"));
async function h() {
  console.log("3");
  await null;
  console.log("4");
}
h();
Promise.resolve().then(() => console.log("5"));
console.log("6");`}
            filename="p9.js"
          />
          <p className="iq-a">
            <code>1, 3, 6, 4, 5, 2</code>. Sync: <code>1</code>; <code>h()</code> prints <code>3</code> up to its{' '}
            <code>await null</code> and suspends &mdash; this <em>enqueues</em> the continuation (logging <code>4</code>)
            as a microtask <strong>during</strong> <code>h()</code>&apos;s sync run; then <code>6</code>. After{' '}
            <code>h()</code> returns, the <code>Promise.resolve().then(() =&gt; console.log(&quot;5&quot;))</code> line
            enqueues <code>5</code> as a second microtask. So at drain the microtask queue is <code>[4, 5]</code> (FIFO:
            <code>4</code> was queued first, during <code>h()</code>; <code>5</code> after). Drain <code>4</code>, then{' '}
            <code>5</code>. Then the macrotask <code>2</code>. The key subtlety: an <code>await</code>&apos;s
            continuation is enqueued the instant the <code>await</code> is hit &mdash; here, before the later{' '}
            <code>.then(5)</code> line even runs &mdash; so FIFO puts it ahead of <code>5</code>.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 10. Design: build a rate-limited, retrying, cached fetch wrapper.</h4>
          <p className="iq-a">
            Compose the primitives: <strong>cache</strong> (Map/WeakMap keyed by URL+params, with TTL or LRU eviction
            to bound growth &mdash; Week 6 Day 4); <strong>retry with exponential backoff</strong> (recursive call with{' '}
            <code>setTimeout</code>/<code>await delay</code>, doubling delay, max attempts &mdash; Week 4 Day 6);
            <strong> rate limiting</strong> (a token bucket or a bounded-concurrency queue &mdash; <code>mapLimit</code>
            -style, cap N in-flight &mdash; Week 4 Day 6); <strong>AbortController</strong> for true cancellation on
            timeout. Layer them as higher-order wrappers: <code>cached(retrying(rateLimited(fetch)))</code> &mdash; each
            is a function returning a function, composable (Week 5 Day 1). Trade-offs to articulate: cache helps
            idempotent GETs but can serve stale data (TTL); retry helps transient failures but can multiply load (cap
            attempts + jitter); rate limiting protects the server but adds latency; AbortController stops work the
            caller abandoned (avoids leaks). The design is the conversation: which layers, what limits, how they
            interact. This single question touches closures, promises, combinators, memory, and cancellation &mdash; the
            whole course in one task.
          </p>
        </div>
      </section>

      {/* ── Self-Assessment ───────────────────────────────── */}
      <section className="day-section">
        <div className="challenge-section">
          <span className="challenge-label">Self-Assessment</span>
          <p>
            Could you explain each solution &mdash; not just produce it? For the output problems, name the rule per
            step. For the implementations, justify each design choice.
          </p>
          <ul className="challenge-list">
            <li>P1: microtask-before-macrotask.</li>
            <li>P2: shadowing, delete, prototype fallback.</li>
            <li>P3: <code>var</code> hoisting + TDZ-free initialization.</li>
            <li>P4: detached-method default binding.</li>
            <li>P5: <code>ToPrimitive</code> + the <code>+</code> rule.</li>
            <li>P6: cache key strategy, value vs identity equality, eviction.</li>
            <li>P7: lazy generator pipelines, demand-driven evaluation.</li>
            <li>P8: ordered results, reject-fast, empty input.</li>
            <li>P9: await-continuation enqueue timing, FIFO microtasks.</li>
            <li>P10: composing cache/retry/rate-limit/cancel, trade-offs.</li>
          </ul>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (120 minutes)</span>
          <p>
            Solve all 10 cold on paper. For 1, 2, 3, 4, 5, 9: write the predicted output, then the rule for each step.
            For 6, 7, 8: implement from a blank file. For 10: sketch the architecture and name the trade-offs. Then
            verify the outputs by running.
          </p>
        </div>

        <CodeBlock
          code={`// Verify your predictions by running each snippet.
// Expected answers:
// P1: 1, 4, 3, 2
// P2: 1
// P3: undefined, 2
// P4: undefined (strict)
// P5: "", "[object Object]", "[object Object]" (expression context)
// P6: [implementation]
// P7: [4, 8, 12, 16, 20]
// P8: [implementation]
// P9: 1, 3, 6, 4, 5, 2
// P10: [design]
//
// For each, write the one-sentence rule that explains the key step. The rule
// is what you'd say out loud in the interview.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Which problems took longest, and which week did each draw from? The mapping tells you what to review: P3
            &rarr; Week 1; P2 &rarr; Week 3; P4 &rarr; Week 2; P1/P9 &rarr; Week 4; P6/P7 &rarr; Week 5; P8/P10 &rarr;
            Weeks 4&ndash;6. Any weak spot is your study target before real interviews.
          </p>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
