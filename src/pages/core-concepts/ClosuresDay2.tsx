import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('closures-functions')!
const navItems = weekNav(week)

export default function ClosuresDay2() {
  const { prev, next } = dayNavLinks(week, 2)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[1].title}</h1>
        <p className="lesson-subtitle">
          The three patterns closures are bought and sold for: memoization, partial application, and the
          module pattern.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            Three classic uses of closures: <strong>memoization</strong> (cache results in hidden state),
            <strong> partial application</strong> (fix some arguments now, the rest later), and the{' '}
            <strong>module pattern</strong> (private variables exposed through a public API).
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Each one is an outer function that closes over a variable, then returns a function (or set of
            functions) that operate on it. The hidden variable is the closure.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Memoization for expensive pure functions. Partial application for reusing configurations.
            Module pattern for encapsulation &mdash; less common now that ES modules and{' '}
            <code>#private</code> fields exist, but still everywhere in libraries.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Yesterday you learned what a closure <em>is</em>. Today you learn what it is <em>for</em>. A
          closure is essentially a function with a hidden, persistent memory. The three patterns on this
          page are the three reasons that memory is worth having.
        </p>
        <p className="article-para">
          They share a skeleton:
        </p>

        <CodeBlock
          code={`function factory(/* setup args */) {
  const hiddenState = /* ... */;   // closed-over memory
  return function (/* call args */) {
    // read / write hiddenState
  };
}`}
          filename="skeleton.js"
        />

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Memoization</dt>
            <dd className="def-text">
              Caching the return value of a function keyed by its arguments, so repeated calls with the
              same inputs skip the work. The cache is private state held in a closure.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Partial Application</dt>
            <dd className="def-text">
              Fixing one or more arguments of a function now to produce a new function that takes the rest
              later. The fixed arguments live in a closure.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Module Pattern</dt>
            <dd className="def-text">
              An outer function holding private state and returning an object of public methods that close
              over it. The methods are privileged; the state is unreachable from outside.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Pattern 1: Memoization ───────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Pattern 1 &mdash; Memoization</h2>
        <p className="article-para">
          A pure function with the same input always returns the same output. So why recompute it? Store
          the result keyed by the arguments in a private cache; return the cached value on the next call.
        </p>

        <CodeBlock
          code={`function memoize(fn) {
  const cache = new Map();          // private — no one outside can touch it
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => {
  console.log("computing...");
  return n * n;
};

const fastSquare = memoize(slowSquare);

fastSquare(4); // "computing..." → 16
fastSquare(4); // 16 (no log — came from cache)`}
          filename="memoize.js"
        />

        <h3 className="article-h3">Why it works</h3>
        <p className="article-para">
          The returned function closes over <code>cache</code>. Every call goes through the same closure,
          so the same <code>Map</code> persists across calls &mdash; but <code>cache</code> is never
          exposed. It is a private, module-level memory that the outside world can only influence
          indirectly, by calling the function.
        </p>

        <div className="article-callout">
          <p>
            Memoization only works on <strong>pure</strong> functions. If a function reads a clock, a
            random number, or an external variable, caching its result is a bug. The whole premise is
            &ldquo;same input &rarr; same output, forever.&rdquo;
          </p>
        </div>

        <h3 className="article-h3">Classic example: Fibonacci</h3>
        <CodeBlock
          code={`const fib = memoize((n) => {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
});

// Naive recursion: O(2^n). Memoized: O(n).
// Without the cache, fib(40) would take millions of calls.
fib(40); // fast — each subproblem computed once.`}
          filename="fib.js"
        />

        <p className="article-para">
          Notice <code>fib</code> calls <code>fib</code> recursively &mdash; and because we assigned the
          memoized version back to <code>fib</code>, the recursion itself hits the cache. That single
          assignment turns exponential into linear.
        </p>
      </section>

      {/* ── Pattern 2: Partial Application ───────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Pattern 2 &mdash; Partial Application</h2>
        <p className="article-para">
          You have a function of several arguments. You know some of them now. Partial application produces
          a new function that already knows those arguments and only waits for the rest.
        </p>

        <CodeBlock
          code={`function multiply(a, b, c) {
  return a * b * c;
}

function partial(fn, ...fixedArgs) {
  return function (...laterArgs) {
    return fn(...fixedArgs, ...laterArgs);
  };
}

const timesTwoThenThree = partial(multiply, 2, 3); // a=2, b=3 fixed
timesTwoThenThree(4); // 2 * 3 * 4 = 24
timesTwoThenThree(10); // 60`}
          filename="partial.js"
        />

        <h3 className="article-h3">Why it works</h3>
        <p className="article-para">
          <code>fixedArgs</code> is captured in the closure of the returned function. When that function is
          later called with <code>laterArgs</code>, it merges the two and calls the original. The fixed
          arguments are frozen in the closure; the rest arrive at call time.
        </p>

        <h3 className="article-h3">Realistic example: a configured logger</h3>
        <CodeBlock
          code={`function log(level, prefix, message) {
  console.log(\`[\${level}] \${prefix}: \${message}\`);
}

const warnDb = partial(log, "WARN", "DB");
warnDb("connection lost"); // [WARN] DB: connection lost
warnDb("slow query");      // [WARN] DB: slow query

// Currying (Day 4 / Week 5) is the extreme case:
// one argument at a time, producing a chain of closures.`}
          filename="logger.js"
        />

        <div className="article-callout">
          <p>
            <strong>Partial application &ne; currying.</strong> Partial application fixes <em>some</em>{' '}
            arguments and leaves the rest. Currying breaks an <em>n</em>-argument function into a chain of{' '}
            <em>n</em> single-argument functions. Currying is a special, stricter shape of partial
            application &mdash; we build it with <code>bind</code> on Day 4 and from scratch in Week 5.
          </p>
        </div>
      </section>

      {/* ── Pattern 3: Module Pattern ────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Pattern 3 &mdash; The Module Pattern</h2>
        <p className="article-para">
          For two decades, closures were JavaScript&rsquo;s only form of data privacy. The module pattern
          wraps private state in an outer function and returns an object whose methods close over that
          state. The methods are public; the state is sealed off.
        </p>

        <CodeBlock
          code={`const Counter = (function () {
  let count = 0;                    // private

  return {
    increment() { count++; },
    decrement() { count--; },
    value() { return count; },
  };
})();

Counter.increment();
Counter.increment();
Counter.value(); // 2
Counter.count;   // undefined — private
// count is reachable ONLY through the three methods.`}
          filename="module-iife.js"
        />

        <h3 className="article-h3">The IIFE wrapper</h3>
        <p className="article-para">
          The <code>{'(function () { ... })()'}</code> is an <strong>IIFE</strong> &mdash; Immediately Invoked
          Function Expression. It runs once, creates the closed-over environment, and returns the public
          object. The environment is never re-created; it just sits behind the methods forever. This is how
          you get a singleton with private state.
        </p>

        <h3 className="article-h3">Factory variant (multiple instances)</h3>
        <CodeBlock
          code={`function createCounter(start = 0) {
  let count = start;                // each call → fresh private count

  return {
    increment() { count++; },
    value() { return count; },
  };
}

const a = createCounter();
const b = createCounter(100);
a.increment();
a.value(); // 1
b.value(); // 100 — independent environments`}
          filename="module-factory.js"
        />

        <div className="article-callout">
          <p>
            <strong>Today&rsquo;s alternatives:</strong> ES modules give you file-level encapsulation, and{' '}
            <code>#private</code> fields give you true per-instance privacy on classes. The module pattern
            is still everywhere in older code and in libraries that predate those features. Knowing it lets
            you read them; knowing the alternatives tells you when <em>not</em> to write new ones.
          </p>
        </div>
      </section>

      {/* ── Comparison ────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Comparing the Three</h2>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Memoization</th>
                <th>Partial Application</th>
                <th>Module Pattern</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>What&rsquo;s in the closure</td>
                <td>A cache (<code>Map</code>)</td>
                <td>Fixed arguments</td>
                <td>Private state + methods</td>
              </tr>
              <tr>
                <td>Returns</td>
                <td>A cached function</td>
                <td>A partially-filled function</td>
                <td>An object of methods</td>
              </tr>
              <tr>
                <td>Goal</td>
                <td>Speed</td>
                <td>Reuse / configuration</td>
                <td>Encapsulation</td>
              </tr>
              <tr>
                <td>Requires pure fn?</td>
                <td>Yes</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Modern alternative</td>
                <td>Still manual</td>
                <td><code>.bind()</code>, currying</td>
                <td>ES modules, <code>#</code> fields</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="article-para">
          Notice the unifying idea: in every case the closure is acting as <strong>configuration that a
          function carries with it.</strong> The cache, the fixed arguments, the private state &mdash; all
          just &ldquo;setup data baked into a function.&rdquo;
        </p>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Memoization Step by Step</h2>

        <CodeBlock
          code={`const memo = memoize(slowSquare); // (1)
memo(4); // (2) "computing..." → 16
memo(5); // (3) "computing..." → 25
memo(4); // (4) → 16 (cached)`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>memoize(slowSquare)</code> runs. A fresh <code>cache</code> <code>Map</code> is created
              in a new environment. The inner function closes over it and is returned as <code>memo</code>.
            </span>
          </li>
          <li>
            <span>
              <code>memo(4)</code> runs. Key <code>"[4]"</code> not in <code>cache</code> &rarr; compute{' '}
              <code>16</code>, store <code>"[4]" &rarr; 16</code>, return <code>16</code>.
            </span>
          </li>
          <li>
            <span>
              <code>memo(5)</code> runs. Key <code>"[5]"</code> not in <code>cache</code> &rarr; compute{' '}
              <code>25</code>, store it, return <code>25</code>. The cache now has two entries.
            </span>
          </li>
          <li>
            <span>
              <code>memo(4)</code> runs again. Key <code>"[4]"</code> <strong>is</strong> in{' '}
              <code>cache</code> &rarr; return <code>16</code> immediately. <code>slowSquare</code> never
              runs. No &ldquo;computing...&rdquo; log.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Memoizing by single argument (no JSON)</h3>
        <p className="article-para">
          <code>JSON.stringify</code> is safe but slow. For a one-argument function whose arg is a string
          or number, a plain <code>Map</code> keyed directly on the argument is faster and handles objects
          by reference.
        </p>
        <CodeBlock
          code={`function memoize1(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}`}
          filename="memoize1.js"
        />

        <h3 className="article-h3">Partial application from the right</h3>
        <CodeBlock
          code={`function partialRight(fn, ...fixedArgs) {
  return function (...laterArgs) {
    return fn(...laterArgs, ...fixedArgs); // fixed args go last
  };
}

const divide = (a, b) => a / b;
const halve = partialRight(divide, 2);   // b=2 fixed
halve(10); // 5
halve(8);  // 4`}
          filename="partial-right.js"
        />

        <h3 className="article-h3">Module pattern with truly hidden helpers</h3>
        <CodeBlock
          code={`const Wallet = (function () {
  let balance = 0;            // private state
  function validate(amount) { // private helper — not returned
    if (amount <= 0) throw new Error("Amount must be positive");
  }

  return {
    deposit(amount) { validate(amount); balance += amount; },
    withdraw(amount) {
      validate(amount);
      if (amount > balance) throw new Error("Insufficient");
      balance -= amount;
    },
    get balance() { return balance; }, // getter, not a stored field
  };
})();

Wallet.validate;   // undefined — helper is private
Wallet.deposit(50);
Wallet.balance;    // 50`}
          filename="wallet.js"
        />

        <h3 className="article-h3">Building <code>once</code> (run-at-most-once)</h3>
        <CodeBlock
          code={`function once(fn) {
  let done = false;
  let result;
  return function (...args) {
    if (done) return result;   // closed-over flag guards re-entry
    done = true;
    result = fn.apply(this, args);
    return result;
  };
}

const init = once(() => {
  console.log("initializing...");
  return { ready: true };
});

init(); // "initializing..." → { ready: true }
init(); // { ready: true } — body never runs again`}
          filename="once.js"
        />
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>Build all three patterns from a blank file, no notes:</p>
        </div>

        <CodeBlock
          code={`// 1. memoize(fn) — cache by JSON.stringify(args)
// 2. partial(fn, ...fixed) — fix left args
// 3. createTodoList() — module with private \`items\` array,
//    exposing add(item), remove(index), and list()`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then stress-test memoize</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Write a function that returns a <em>different</em> object each call (e.g. <code>{'() => ({})'}</code>)
            and memoize it. Call it twice with the same (empty) args. What happens, and why is this{' '}
            <strong>not</strong> a violation of the &ldquo;same input &rarr; same output&rdquo; rule? (Hint:
            <code> JSON.stringify([])</code> is the same key every time, so you get the <em>same</em>{' '}
            object back &mdash; the memoized version is now <em>more</em> deterministic than the original.
            That is exactly why memoizing impure functions is dangerous: it silently changes behavior.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Implement <code>memoize</code>.</h4>
            <CodeBlock
              code={`function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`}
              filename="a1.js"
            />
            <p className="iq-a">
              The cache lives in a closure so it is private and persists across calls. <code>apply(this,
              args)</code> preserves the original <code>this</code> so memoized methods still bind
              correctly.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. When does memoization break?</h4>
            <p className="iq-a">
              On impure functions &mdash; anything depending on time, randomness, external state, or mutable
              inputs. It also breaks when the argument can&rsquo;t be serialized to a stable key (e.g.
              functions, circular objects) or when arguments are equal-by-value but unequal-by-reference and
              you key by reference.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is partial application vs currying?</h4>
            <p className="iq-a">
              Partial application fixes <em>some</em> arguments, returning a function that takes the rest in
              one call. Currying transforms an <em>n</em>-arg function into <em>n</em> nested 1-arg
              functions, applied one argument at a time. Currying is a stricter, fully-decomposed form of
              partial application.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Explain the module pattern and why it was the standard for privacy.</h4>
            <p className="iq-a">
              An outer function (often an IIFE) holds private variables and returns an object of methods that
              close over them. The methods can read/write the private state; nothing else can. Before ES
              modules and <code>#</code> private fields, closures were the only mechanism for true
              encapsulation in JavaScript, so the module pattern became universal.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What&rsquo;s the flaw in this memoize?</h4>
            <CodeBlock
              code={`function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = args.join(",");
    if (key in cache) return cache[key];
    return (cache[key] = fn(...args));
  };
}`}
              filename="q5.js"
            />
            <p className="iq-a">
              Two problems. (1) <code>args.join(",")</code> collides: <code>f(1, 2)</code> and{' '}
              <code>f("1,2")</code> produce the same key <code>"1,2"</code>, returning a wrong cached
              result. (2) If an argument is an object, <code>join</code> coerces it to{' '}
              <code>"[object Object]"</code>, so all object args collide with each other. Use{' '}
              <code>JSON.stringify</code> for a safer key, and be aware even that fails on functions and
              cycles.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What does <code>add(2)(3)</code> need, and how do closures make it work?</h4>
            <CodeBlock
              code={`const add = (a) => (b) => a + b;
add(2)(3); // 5`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>add(2)</code> returns a function that closes over <code>a = 2</code>. Calling that with{' '}
              <code>3</code> adds the closed-over <code>a</code> to the new argument <code>b</code>. This is
              currying &mdash; each step is a closure holding the arguments accumulated so far. Day 4 covers{' '}
              <code>bind</code>-based currying; Week 5 builds a generic <code>curry</code>.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What&rsquo;s wrong with this <code>once</code>?</h4>
            <CodeBlock
              code={`function once(fn) {
  let result;
  return function (...args) {
    if (result !== undefined) return result;
    result = fn.apply(this, args);
    return result;
  };
}`}
              filename="q7.js"
            />
            <p className="iq-a">
              The guard <code>result !== undefined</code> treats &ldquo;already ran&rdquo; and &ldquo;ran but
              returned <code>undefined</code>&rdquo; as the same thing. If <code>fn</code> legitimately
              returns <code>undefined</code> on its first real call, the function re-runs on the next call
              &mdash; defeating <code>once</code>. The fix is a separate boolean flag (<code>let done =
              false</code>) so &ldquo;has it run&rdquo; is decoupled from &ldquo;what did it return.&rdquo;
              This is the closure-as-state lesson: never overload one captured variable to mean two things.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
