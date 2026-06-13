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

export default function Day3() {
  const { prev, next } = getDayNav(3)

  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of 7</span>
        <h1 className="lesson-title">TDZ + let + const</h1>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          <code>var</code> was JavaScript's only variable keyword for 20 years — and it was a mess.
          <code>let</code> and <code>const</code> were added in ES6 (2015) to fix scoping and
          predictability. The Temporal Dead Zone is the mechanism that enforces their rules.
        </p>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Restaurant Analogy</h2>
        <p className="article-para">
          You book a seat at a restaurant. Your name is on the reservation list — the seat <em>exists
          </em> for you. But you can't sit down until you actually arrive.
        </p>
        <p className="article-para">
          The TDZ is that gap. The variable is registered (your name is on the list), but you can't
          use it yet (you haven't arrived). The moment your declaration line executes — you've arrived.
          Seat's yours.
        </p>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>

        <h3 className="article-h3"><code>let</code></h3>
        <ul className="learn-list">
          <li>Block-scoped <code>{'{ }'}</code> — dies outside its block</li>
          <li>Hoisted but not initialized → TDZ until declaration line</li>
          <li>Can be reassigned</li>
          <li>Cannot be redeclared in the same scope</li>
        </ul>

        <h3 className="article-h3"><code>const</code></h3>
        <p className="article-para">Everything <code>let</code> is, plus:</p>
        <ul className="learn-list">
          <li>Must be initialized at declaration — <code>const x;</code> → <code>SyntaxError</code></li>
          <li>Cannot be reassigned — but objects/arrays it holds are still mutable</li>
        </ul>

        <h3 className="article-h3">TDZ (Temporal Dead Zone)</h3>
        <ul className="learn-list">
          <li>The period between when <code>let</code>/<code>const</code> is <strong>registered</strong> (creation phase) and when its <strong>line executes</strong></li>
          <li>Any access in that window → <code>ReferenceError</code></li>
          <li>Not a physical place — it's a <strong>time window</strong></li>
          <li>Even <code>typeof</code> throws inside TDZ (unlike undeclared variables)</li>
        </ul>
      </section>

      {/* ── Comparison ─────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Comparison</h2>

        <h3 className="article-h3"><code>var</code> vs <code>let</code> vs <code>const</code></h3>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>var</code></th>
                <th><code>let</code></th>
                <th><code>const</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Scope</td>
                <td>Function</td>
                <td>Block</td>
                <td>Block</td>
              </tr>
              <tr>
                <td>Hoisted</td>
                <td>Yes</td>
                <td>Yes (TDZ)</td>
                <td>Yes (TDZ)</td>
              </tr>
              <tr>
                <td>Initial value</td>
                <td><code>undefined</code></td>
                <td>none (TDZ)</td>
                <td>none (TDZ)</td>
              </tr>
              <tr>
                <td>Reassignable</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Redeclarable</td>
                <td>Yes</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Must initialize</td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="article-h3">TDZ across languages</h3>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Language</th>
                <th>Equivalent behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Python</td>
                <td>No TDZ — use before assign = <code>UnboundLocalError</code> at runtime</td>
              </tr>
              <tr>
                <td>Java</td>
                <td>Compiler error — can't compile with uninitialized variable</td>
              </tr>
              <tr>
                <td>C++</td>
                <td>Undefined behavior — no error, just garbage value</td>
              </tr>
              <tr>
                <td>Rust</td>
                <td>Compiler error — enforced at compile time</td>
              </tr>
              <tr>
                <td>JavaScript (<code>let</code>/<code>const</code>)</td>
                <td>TDZ — runtime <code>ReferenceError</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            JavaScript is unique in having a <em>runtime</em> dead zone instead of a compile-time
            check.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow — Step by Step</h2>

        <CodeBlock
          code={`console.log(a); // ← you are here
let a = 10;
console.log(a);`}
          filename="tdz-flow.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Creation phase</span>
            <ul className="phase-rules">
              <li><code>a</code> → registered in memory, NOT initialized (TDZ begins)</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Execution phase</span>
            <ul className="phase-rules">
              <li>line 1: <code>console.log(a)</code> → TDZ → ReferenceError</li>
              <li>line 2: <code>a = 10</code> → TDZ ends, <code>a</code> is initialized</li>
              <li>line 3: <code>console.log(a)</code> → 10</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3"><code>let</code> — block scope</h3>
        <CodeBlock
          code={`{
  let x = 10;
  console.log(x); // 10
}
console.log(x); // ReferenceError — x is dead outside block`}
          filename="let-block.js"
        />

        <h3 className="article-h3"><code>var</code> — leaks out of block</h3>
        <CodeBlock
          code={`{
  var y = 10;
}
console.log(y); // 10 — var ignores block boundaries`}
          filename="var-leak.js"
        />

        <h3 className="article-h3">TDZ in action</h3>
        <CodeBlock
          code={`console.log(name); // ReferenceError — TDZ
let name = "Tamjid";`}
          filename="tdz.js"
        />

        <h3 className="article-h3"><code>typeof</code> doesn't save you in TDZ</h3>
        <CodeBlock
          code={`console.log(typeof x); // ReferenceError — TDZ, NOT "undefined"
let x = 5;

console.log(typeof z); // "undefined" — z is fully undeclared, safe`}
          filename="typeof-tdz.js"
        />

        <h3 className="article-h3"><code>const</code> — no reassignment</h3>
        <CodeBlock
          code={`const PI = 3.14;
PI = 3; // TypeError: Assignment to constant variable`}
          filename="const-no-reassign.js"
        />

        <h3 className="article-h3"><code>const</code> — object mutation is fine</h3>
        <CodeBlock
          code={`const user = { name: "Tamjid" };
user.name = "Rahman"; // ✅ — mutating the object, not reassigning
user = {};            // ❌ TypeError — reassigning the binding`}
          filename="const-mutation.js"
        />

        <h3 className="article-h3"><code>const</code> must be initialized</h3>
        <CodeBlock
          code={`const x; // SyntaxError — missing initializer`}
          filename="const-init.js"
        />

        <h3 className="article-h3">TDZ in a function — same rules</h3>
        <CodeBlock
          code={`function run() {
  console.log(msg); // ReferenceError
  let msg = "hello";
}
run();`}
          filename="tdz-function.js"
        />

        <h3 className="article-h3"><code>let</code> in loops — new binding each iteration</h3>
        <CodeBlock
          code={`for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2 — each iteration gets its own i

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3 — one shared i`}
          filename="let-loop.js"
        />
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is the TDZ?</h4>
            <p className="iq-a">
              The time between when <code>let</code>/<code>const</code> is registered in memory
              and when its declaration line executes. Accessing the variable in that window throws
              a <code>ReferenceError</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What's the difference between <code>let</code> and <code>const</code>?</h4>
            <p className="iq-a">
              Both are block-scoped with TDZ. <code>let</code> can be reassigned. <code>const</code>{' '}
              cannot be reassigned and must be initialized at declaration.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Does <code>const</code> make objects immutable?</h4>
            <p className="iq-a">
              No. It prevents reassigning the <em>binding</em>. The object itself is still mutable
              — you can change its properties freely. Use <code>Object.freeze()</code> for true
              immutability.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why does <code>typeof x</code> throw when <code>x</code> is declared with <code>let</code> but not <code>typeof z</code> when <code>z</code> doesn't exist at all?</h4>
            <p className="iq-a">
              <code>typeof</code> on a fully undeclared variable safely returns <code>"undefined"
              </code>. But a <code>let</code>/<code>const</code> variable in TDZ <em>exists</em> in the
              scope — it's just inaccessible. The engine knows it's there and throws instead of
              returning <code>"undefined"</code>.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What logs?</h4>
            <CodeBlock
              code={`let x = "outer";

function test() {
  console.log(x);
  let x = "inner";
}

test();`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>ReferenceError</code>. The <code>let x</code> inside <code>test</code> puts the
              local <code>x</code> in TDZ from the top of the function. It shadows the outer{' '}
              <code>x</code>, so the outer one is unreachable. The log hits before the local{' '}
              <code>x</code> is initialized — TDZ fires.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What's the difference?</h4>
            <CodeBlock
              code={`// A
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

// B
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`}
              filename="q6.js"
            />
            <p className="iq-a">
              A → <code>3, 3, 3</code>. One <code>var i</code> shared across all iterations.
              Loop finishes, then callbacks fire — <code>i</code> is <code>3</code>.
            </p>
            <p className="iq-a" style={{ marginTop: '0.375rem' }}>
              B → <code>0, 1, 2</code>. <code>let</code> creates a <strong>new binding</strong>{' '}
              per iteration. Each callback closes over its own <code>i</code>.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What happens here?</h4>
            <CodeBlock
              code={`const obj = Object.freeze({ count: 0 });
obj.count = 99;
console.log(obj.count);`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>0</code>. <code>Object.freeze()</code> makes the object shallowly immutable —
              property assignments silently fail in non-strict mode, throw in strict mode.{' '}
              <code>count</code> stays <code>0</code>. Note: only shallow — nested objects are still
              mutable.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hardest). Explain the output.</h4>
            <CodeBlock
              code={`let a = 1;

function outer() {
  let a = 2;

  function inner() {
    console.log(a);  // ?
    let a = 3;
    console.log(a);  // ?
  }

  inner();
}

outer();`}
              filename="q8.js"
            />
            <p className="iq-a">
              First log → <code>ReferenceError</code>. Inside <code>inner</code>, <code>let a = 3
              </code> puts the local <code>a</code> in TDZ from the top of <code>inner</code>. It
              shadows both the outer <code>a = 2</code> and global <code>a = 1</code>. The first{' '}
              <code>console.log(a)</code> hits before <code>a = 3</code> executes — TDZ fires.
              Second log never runs.
            </p>
            <div className="article-callout" style={{ marginTop: '0.75rem' }}>
              <p>
                <strong>Key insight:</strong> TDZ doesn't just block uninitialized variables — it
                actively <em>shadows and blocks</em> any outer variable with the same name in that
                scope.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
