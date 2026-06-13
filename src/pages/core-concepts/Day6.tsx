import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { week1NavItems, getDayNav } from './navConfig'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const navItems = [
  { label: 'Overview', path: '/core-concepts/execution-context-scope' },
  ...week1NavItems,
]

export default function Day6() {
  const { prev, next } = getDayNav(6)

  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of 7</span>
        <h1 className="lesson-title">Hard Interview Problems</h1>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Knowing theory is one thing. Explaining <em>why</em> code behaves unexpectedly under
          pressure is another. These problems test whether you truly understand execution context,
          hoisting, TDZ, scope chain, closures, <code>this</code>, and the event loop — or just
          memorized definitions.
        </p>
        <p className="article-para">
          Every problem here has caught real developers off guard in real interviews.
        </p>
      </section>

      {/* ── P1: Hoisting Priority War ─────────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 1 — Hoisting Priority War</h3>

        <CodeBlock
          code={`console.log(typeof foo);
var foo = 1;
function foo() {}
console.log(typeof foo);`}
          filename="p1.js"
        />

        <div className="iq-block">
          <h4 className="iq-q">What logs?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">First log</span>
              <code>"function"</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">Second log</span>
              <code>"number"</code>
            </div>
          </div>
          <p className="iq-a">
            During creation phase, <code>var foo</code> and <code>function foo</code> both hoist.
            But <strong>function declarations win over <code>var</code></strong> — they take priority.
            <code>foo</code> starts as the function. Then execution runs <code>foo = 1</code>, overwriting
            it with a number.
          </p>
          <div className="article-callout" style={{ marginTop: '0.5rem' }}>
            <p>
              <strong>Rule:</strong> Function declarations beat <code>var</code> during hoisting.
              Whichever assignment runs last in execution phase wins after that.
            </p>
          </div>
        </div>
      </section>

      {/* ── P2: TDZ Shadow Trap ─────────────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 2 — The TDZ Shadow Trap</h3>

        <CodeBlock
          code={`let x = "global";

function test() {
  console.log(x);
  let x = "local";
}

test();`}
          filename="p2.js"
        />

        <div className="iq-block iq-hard">
          <h4 className="iq-q">What logs?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">Output</span>
              <code>ReferenceError</code>
            </div>
          </div>
          <p className="iq-a">
            <code>let x</code> inside <code>test</code> is hoisted to the top of <code>test</code>'s
            scope and immediately enters TDZ. It <strong>shadows</strong> the global <code>x</code> from
            the very top of the function — so the global is unreachable. The log hits the local{' '}
            <code>x</code> while it's still in TDZ → <code>ReferenceError</code>.
          </p>
          <div className="article-callout" style={{ marginTop: '0.5rem' }}>
            <p>
              <strong>Rule:</strong> TDZ shadowing blocks access to outer variables with the same
              name. The engine knows the local one exists — it just won't let you use it yet.
            </p>
          </div>
        </div>
      </section>

      {/* ── P3: this Lost in Translation ─────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 3 — <code>this</code> Lost in Translation</h3>

        <CodeBlock
          code={`const obj = {
  name: "Tamjid",
  greet: function() {
    setTimeout(function() {
      console.log(this.name);
    }, 0);
  }
};

obj.greet();`}
          filename="p3.js"
        />

        <div className="iq-block iq-medium">
          <h4 className="iq-q">What logs?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">Output</span>
              <code>undefined</code> (or <code>""</code> in strict mode)
            </div>
          </div>
          <p className="iq-a">
            <code>obj.greet()</code> sets <code>this</code> to <code>obj</code> inside{' '}
            <code>greet</code>. But <code>setTimeout</code> calls its callback as a <strong>plain
            function</strong> — no object on the left, so <code>this</code> resets to{' '}
            <code>window</code> (or <code>undefined</code> in strict mode).
          </p>

          <CodeBlock
            code={`// Fix 1 — Arrow function (inherits this from greet)
setTimeout(() => {
  console.log(this.name); // "Tamjid" ✅
}, 0);

// Fix 2 — Save this
const self = this;
setTimeout(function() {
  console.log(self.name); // "Tamjid" ✅
}, 0);`}
            label="Fixes"
          />
        </div>
      </section>

      {/* ── P4: Closure in a Loop ────────────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 4 — Closure in a Loop (Classic)</h3>

        <CodeBlock
          code={`for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000);
}`}
          filename="p4.js"
        />

        <div className="iq-block iq-medium">
          <h4 className="iq-q">What logs, and when?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">At ~0ms</span>
              <code>3</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">At ~1000ms</span>
              <code>3</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">At ~2000ms</span>
              <code>3</code>
            </div>
          </div>
          <p className="iq-a">
            <code>var i</code> is function-scoped — one shared <code>i</code>. All three
            callbacks close over the same <code>i</code>. Loop finishes (<code>i = 3</code>) before
            any callback fires.
          </p>

          <CodeBlock
            code={`// Fix 1 — let (new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), i * 1000);
}
// 0, 1, 2 at 0ms, 1000ms, 2000ms ✅

// Fix 2 — IIFE captures current value
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), j * 1000);
  })(i);
}
// 0, 1, 2 ✅`}
            label="Fixes"
          />
        </div>
      </section>

      {/* ── P5: Event Loop Order ──────────────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 5 — The Event Loop Order</h3>

        <CodeBlock
          code={`console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));

console.log("5");`}
          filename="p5.js"
        />

        <div className="iq-block iq-hard">
          <h4 className="iq-q">What's the exact order?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">Output</span>
              <code>1, 5, 3, 4, 2</code>
            </div>
          </div>

          <div className="this-table" style={{ marginTop: '0.75rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Queue</th>
                  <th>Items</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Synchronous</td>
                  <td>1, 5</td>
                  <td>Runs first, always</td>
                </tr>
                <tr>
                  <td>Microtask</td>
                  <td>3, 4 (Promise <code>.then</code>)</td>
                  <td>After sync, before macro</td>
                </tr>
                <tr>
                  <td>Macrotask</td>
                  <td>2 (setTimeout)</td>
                  <td>Last</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="article-callout" style={{ marginTop: '0.75rem' }}>
            <p>
              <strong>Rule:</strong> Microtasks always fully drain before the next macrotask
              runs.
            </p>
          </div>
        </div>
      </section>

      {/* ── P6: Nested Promises + setTimeout ─────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 6 — Nested Promises + setTimeout</h3>

        <CodeBlock
          code={`console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
}).then(() => console.log("E"));

console.log("F");`}
          filename="p6.js"
        />

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Exact output?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">Sync</span>
              <code>A, F</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">Microtask 1</span>
              <code>C</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">Microtask 2</span>
              <code>E</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">Macrotask</span>
              <code>B</code>, then <code>D</code>
            </div>
          </div>
          <p className="iq-a" style={{ marginTop: '0.75rem' }}>
            <code>D</code>'s <code>setTimeout</code> is created <em>inside</em> a microtask. It
            gets added to the macrotask queue <em>after</em> <code>B</code> was already queued. So{' '}
            <code>B</code> fires before <code>D</code>.
          </p>
        </div>
      </section>

      {/* ── P7: this in Class Methods ───────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 7 — <code>this</code> in Class Methods</h3>

        <CodeBlock
          code={`class Counter {
  count = 0;

  increment() {
    this.count++;
    console.log(this.count);
  }
}

const c = new Counter();
const inc = c.increment;
inc();`}
          filename="p7.js"
        />

        <div className="iq-block iq-medium">
          <h4 className="iq-q">What happens?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">Output</span>
              <code>TypeError: Cannot read properties of undefined (reading 'count')</code>
            </div>
          </div>
          <p className="iq-a">
            <code>c.increment</code> is extracted and called as a plain function. In class bodies,
            code runs in strict mode automatically. Plain function call in strict mode →{' '}
            <code>this</code> is <code>undefined</code>.
          </p>

          <CodeBlock
            code={`// Fix 1 — Bind in constructor
class Counter {
  count = 0;
  constructor() {
    this.increment = this.increment.bind(this);
  }
  increment() {
    this.count++;
    console.log(this.count);
  }
}

// Fix 2 — Arrow function as class field
class Counter {
  count = 0;
  increment = () => {
    this.count++;
    console.log(this.count);
  };
}`}
            label="Fixes"
          />
        </div>
      </section>

      {/* ── P8: Hoisting Inside Blocks ─────────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 8 — Hoisting Inside Blocks</h3>

        <CodeBlock
          code={`console.log(foo); // A

if (true) {
  console.log(foo); // B
  function foo() { return 1; }
  console.log(foo); // C
}

console.log(foo); // D`}
          filename="p8.js"
        />

        <div className="iq-block iq-hard">
          <h4 className="iq-q">What logs at A, B, C, D?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">A →</span>
              <code>undefined</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">B →</span>
              <code>function foo</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">C →</span>
              <code>function foo</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">D →</span>
              <code>function foo</code>
            </div>
          </div>
          <p className="iq-a">
            Function declarations inside blocks are one of JS's most inconsistent behaviors. In
            non-strict mode: the <strong>name</strong> <code>foo</code> is hoisted to global as{' '}
            <code>undefined</code> (like <code>var</code>) → A. Inside the block, the full function is
            available → B, C. After the block executes, the global <code>foo</code> gets updated → D.
          </p>
          <p className="iq-a">
            In <strong>strict mode</strong>, <code>foo</code> is block-scoped. A and D would
            be <code>ReferenceError</code>.
          </p>
          <div className="article-callout" style={{ marginTop: '0.5rem' }}>
            <p>
              <strong>Rule:</strong> Never put function declarations inside <code>if</code> blocks. Use
              function expressions if you need conditional functions.
            </p>
          </div>
        </div>
      </section>

      {/* ── P9: Prototype + this Trap ───────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 9 — Prototype + <code>this</code> Trap</h3>

        <CodeBlock
          code={`function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return \`Hi, I'm \${this.name}\`;
};

const p = new Person("Tamjid");
const greet = p.greet;

console.log(p.greet());  // A
console.log(greet());    // B`}
          filename="p9.js"
        />

        <div className="iq-block iq-medium">
          <h4 className="iq-q">What logs at A and B?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">A →</span>
              <code>"Hi, I'm Tamjid"</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">B →</span>
              <code>"Hi, I'm undefined"</code> (or TypeError in strict)
            </div>
          </div>
          <p className="iq-a">
            <code>p.greet()</code> — <code>this</code> is <code>p</code>. Works perfectly.{' '}
            <code>greet()</code> — plain function call. <code>this</code> is <code>window</code> (or{' '}
            <code>undefined</code> in strict).
          </p>
          <div className="article-callout" style={{ marginTop: '0.5rem' }}>
            <p>
              The function didn't change. The <strong>call site</strong> did.
            </p>
          </div>
        </div>
      </section>

      {/* ── P10: The Stale Closure ───────────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 10 — The Stale Closure</h3>

        <CodeBlock
          code={`function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3));   // A
console.log(add10(3));  // B
console.log(add5(10));  // C`}
          filename="p10.js"
        />

        <div className="iq-block">
          <h4 className="iq-q">What logs?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">A →</span>
              <code>8</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">B →</span>
              <code>13</code>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">C →</span>
              <code>15</code>
            </div>
          </div>
          <p className="iq-a">
            Each call to <code>makeAdder</code> creates a <strong>new execution context</strong>{' '}
            with its own <code>x</code>. <code>add5</code> closes over <code>x = 5</code>.{' '}
            <code>add10</code> closes over <code>x = 10</code>. They are completely independent —
            different scope chains, different <code>[[Environment]]</code> references.
          </p>
        </div>
      </section>

      {/* ── P11: Scope Chain + Live Reference ──────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 11 — Scope Chain + Live Reference</h3>

        <CodeBlock
          code={`function outer() {
  let x = 1;

  function inner() {
    console.log(x);
  }

  x = 99;
  inner();
}

outer();`}
          filename="p11.js"
        />

        <div className="iq-block iq-medium">
          <h4 className="iq-q">What logs?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">Output</span>
              <code>99</code>
            </div>
          </div>
          <p className="iq-a">
            The scope chain holds a <strong>live reference</strong> to the outer environment —
            not a snapshot of the value at definition time. When <code>inner</code> looks up{' '}
            <code>x</code>, it reads whatever <code>x</code> currently is at call time. By then,{' '}
            <code>x</code> has been reassigned to <code>99</code>.
          </p>
          <div className="article-callout" style={{ marginTop: '0.5rem' }}>
            <p>
              Closures capture the <strong>environment</strong> (the binding), not the{' '}
              <strong>value</strong> (snapshot).
            </p>
          </div>
        </div>
      </section>

      {/* ── P12: Full Boss Round ───────────────────────── */}
      <section className="day-section">
        <h3 className="article-h3">Problem 12 — The Full Boss Round</h3>

        <CodeBlock
          code={`var x = 1;

function foo() {
  console.log(x);      // A
  var x = 2;

  return function bar() {
    console.log(x);    // B
    x = 3;

    return function baz() {
      console.log(x);  // C
    };
  };
}

const bar = foo();
const baz = bar();
baz();`}
          filename="p12.js"
        />

        <div className="iq-block iq-hard">
          <h4 className="iq-q">What logs at A, B, C?</h4>
          <div className="iq-answers">
            <div className="iq-answer-row">
              <span className="iq-answer-label">A →</span>
              <code>undefined</code>
              <span className="iq-answer-note">— var x hoisted, shadows global, not assigned yet</span>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">B →</span>
              <code>2</code>
              <span className="iq-answer-note">— reads foo's x through the chain</span>
            </div>
            <div className="iq-answer-row">
              <span className="iq-answer-label">C →</span>
              <code>3</code>
              <span className="iq-answer-note">— same environment, x mutated by bar</span>
            </div>
          </div>

          <p className="iq-a" style={{ marginTop: '0.75rem' }}>
            <code>foo()</code> runs: creation phase hoists <code>var x</code> → <code>undefined
            </code>. A logs that. Then <code>x = 2</code>. Returns <code>bar</code>, which closes
            over <code>foo</code>'s scope (<code>x = 2</code>).
          </p>
          <p className="iq-a">
            <code>bar()</code> runs: B logs <code>2</code>. Then <code>x = 3</code> <strong>
            mutates</strong> <code>foo</code>'s <code>x</code> directly (live reference). Returns{' '}
            <code>baz</code>, closes over the same environment.
          </p>
          <p className="iq-a">
            <code>baz()</code> runs: C logs <code>3</code>.
          </p>
        </div>
      </section>

      {/* ── Cheat Sheet ─────────────────────────────────── */}
      <section className="challenge-section">
        <span className="challenge-label">Cheat Sheet</span>

        <div className="this-table" style={{ marginTop: '0.5rem' }}>
          <table>
            <thead>
              <tr>
                <th>Concept</th>
                <th>Key Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hoisting priority</td>
                <td>Function declaration beats <code>var</code></td>
              </tr>
              <tr>
                <td>TDZ shadow</td>
                <td>Inner <code>let</code>/<code>const</code> blocks outer variable of same name</td>
              </tr>
              <tr>
                <td><code>this</code> in callbacks</td>
                <td>Plain function call loses <code>this</code> — use arrow or <code>.bind()</code></td>
              </tr>
              <tr>
                <td>Closure in loop</td>
                <td><code>var</code> = one shared binding. <code>let</code> = new binding per iteration</td>
              </tr>
              <tr>
                <td>Event loop order</td>
                <td>Sync → Microtask (Promise) → Macrotask (setTimeout)</td>
              </tr>
              <tr>
                <td>Scope chain timing</td>
                <td>Built at definition, not at call</td>
              </tr>
              <tr>
                <td>Closure captures</td>
                <td>The <strong>environment</strong> (live), not the value (snapshot)</td>
              </tr>
              <tr>
                <td>Class strict mode</td>
                <td>Methods lose <code>this</code> when extracted — bind or use arrow fields</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
