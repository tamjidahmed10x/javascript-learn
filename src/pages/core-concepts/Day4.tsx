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

export default function Day4() {
  const { prev, next } = getDayNav(4)

  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of 7</span>
        <h1 className="lesson-title">Scope</h1>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Scope is the rulebook for where a variable can be seen and used. Declare a variable — scope
          decides who has access to it. Get it wrong and you get <code>undefined</code>,{' '}
          <code>ReferenceError</code>, or worse — accidental globals silently breaking things.
        </p>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Building Analogy</h2>
        <p className="article-para">
          Think of a building with floors.
        </p>
        <p className="article-para">
          The ground floor (global scope) is the lobby — everyone can see it. Each floor above is a
          function or block — people on that floor can see down to the lobby, but the lobby can't see
          up to their floor. And people on floor 3 can't peek into floor 2's private office.
        </p>

        <div className="article-callout">
          <p>
            You can always look <em>down</em>. Never <em>sideways</em>. Never <em>up</em>.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>

        <h3 className="article-h3">Four types of scope in JS</h3>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">Global Scope</h4>
            <p className="theory-desc">
              Declared outside everything. Accessible everywhere. Dangerous if overused.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Function Scope</h4>
            <p className="theory-desc">
              Declared inside a function with <code>var</code>, <code>let</code>, or <code>const
              </code>. Dies when function ends.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Block Scope</h4>
            <p className="theory-desc">
              Declared inside <code>{'{ }'}</code> with <code>let</code> or <code>const</code>.
              Dies when block ends. <code>var</code> ignores blocks entirely.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Module Scope</h4>
            <p className="theory-desc">
              In ES6 modules, top-level declarations are scoped to the file, not global.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Lexical Scope</h3>
        <p className="article-para">
          JS uses <strong>lexical (static) scoping</strong> — scope is determined by where code
          is <em>written</em>, not where it's <em>called</em>.
        </p>
        <p className="article-para">
          A function carries its scope from its definition site, not its call site.
        </p>

        <h3 className="article-h3">Scope Chain</h3>
        <p className="article-para">
          When a variable isn't found locally, the engine walks <em>up</em> through parent scopes
          until it hits global. If still not found → <code>ReferenceError</code>.
        </p>
      </section>

      {/* ── Comparison ─────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Comparison</h2>

        <h3 className="article-h3"><code>var</code> vs <code>let</code>/<code>const</code> scope</h3>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>var</code></th>
                <th><code>let</code> / <code>const</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Function scope</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Block scope</td>
                <td>No (leaks out)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Global object prop</td>
                <td>Yes (<code>window.x</code>)</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="article-h3">Scope across languages</h3>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Language</th>
                <th>Scope model</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JavaScript</td>
                <td>Lexical — function + block (<code>let</code>/<code>const</code>)</td>
              </tr>
              <tr>
                <td>Python</td>
                <td>Lexical — LEGB (Local → Enclosing → Global → Built-in)</td>
              </tr>
              <tr>
                <td>Java</td>
                <td>Lexical — block scope only, strict compile-time</td>
              </tr>
              <tr>
                <td>C/C++</td>
                <td>Lexical — block scope, file scope</td>
              </tr>
              <tr>
                <td>Ruby</td>
                <td>Mixed — local, instance, class, global (<code>$var</code>)</td>
              </tr>
              <tr>
                <td>PHP</td>
                <td>No automatic outer scope — must use <code>global $x</code> explicitly</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            PHP is the odd one out — functions don't automatically see outer variables. JavaScript
            and Python both walk up the chain automatically.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow — Step by Step</h2>

        <CodeBlock
          code={`let global = "G";

function outer() {
  let a = "A";

  function inner() {
    let b = "B";
    console.log(global); // found in global scope
    console.log(a);      // found in outer's scope
    console.log(b);      // found locally
  }

  inner();
}`}
          filename="scope-chain.js"
        />

        <div className="concept-flow" style={{ marginTop: '1rem' }}>
          <span className="flow-highlight">inner()</span>{' '}
          looks up <code>b</code>{' '}
          <span className="flow-arrow">→</span>{' '}
          found locally{' '}
          <br />
          <span className="flow-highlight">inner()</span>{' '}
          looks up <code>a</code>{' '}
          <span className="flow-arrow">→</span>{' '}
          not local{' '}
          <span className="flow-arrow">→</span>{' '}
          found in outer{' '}
          <br />
          <span className="flow-highlight">inner()</span>{' '}
          looks up <code>global</code>{' '}
          <span className="flow-arrow">→</span>{' '}
          not local{' '}
          <span className="flow-arrow">→</span>{' '}
          not in outer{' '}
          <span className="flow-arrow">→</span>{' '}
          found in global
        </div>

        <div className="article-callout" style={{ marginTop: '0.75rem' }}>
          <p>
            <strong>Scope chain:</strong> inner → outer → global
          </p>
        </div>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Global scope</h3>
        <CodeBlock
          code={`let city = "Dhaka"; // global

function show() {
  console.log(city); // ✅ accessible
}
show();`}
          filename="global.js"
        />

        <h3 className="article-h3">Function scope</h3>
        <CodeBlock
          code={`function greet() {
  var msg = "Hello";
  console.log(msg); // ✅
}
greet();
console.log(msg); // ❌ ReferenceError — msg is dead outside`}
          filename="function.js"
        />

        <h3 className="article-h3">Block scope — <code>let</code> vs <code>var</code></h3>
        <CodeBlock
          code={`{
  let a = 1;
  var b = 2;
}
console.log(a); // ❌ ReferenceError — block scoped
console.log(b); // ✅ 2 — var leaks out of block`}
          filename="block.js"
        />

        <h3 className="article-h3">Lexical scope — call site doesn't matter</h3>
        <CodeBlock
          code={`let name = "global";

function foo() {
  console.log(name); // "global" — scope set at definition, not call site
}

function bar() {
  let name = "bar";
  foo(); // calling from bar doesn't give foo access to bar's name
}

bar(); // "global"`}
          filename="lexical.js"
        />

        <h3 className="article-h3">Scope chain lookup</h3>
        <CodeBlock
          code={`let x = 1;

function a() {
  let x = 2;
  function b() {
    let x = 3;
    console.log(x); // 3 — found locally, stops walking
  }
  b();
}
a();`}
          filename="lookup.js"
        />

        <h3 className="article-h3">Accidental global (classic bug)</h3>
        <CodeBlock
          code={`function run() {
  leak = "oops"; // no var/let/const — becomes global
}
run();
console.log(leak); // "oops" — polluted global scope`}
          filename="leak.js"
        />

        <h3 className="article-h3">Module scope</h3>
        <CodeBlock
          code={`// file: utils.js (ES module)
let secret = "hidden"; // scoped to this file only, not window.secret
export function getSecret() { return secret; }`}
          filename="module.js"
        />
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is scope?</h4>
            <p className="iq-a">
              The region of code where a variable is accessible. JS has global, function, block, and
              module scope.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What's the difference between function scope and block scope?</h4>
            <p className="iq-a">
              <code>var</code> is function-scoped — it lives for the entire function, ignores{' '}
              <code>{'{ }'}</code> blocks. <code>let</code>/<code>const</code> are block-scoped —
              they die at the closing <code>{'}'}</code> of their block.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is the scope chain?</h4>
            <p className="iq-a">
              When the engine can't find a variable locally, it walks up to the parent scope, then
              the parent's parent, all the way to global. If still not found →{' '}
              <code>ReferenceError</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is lexical scope?</h4>
            <p className="iq-a">
              Scope is determined by where code is <em>written</em>, not where it's <em>called</em>.
              A function's scope chain is fixed at definition time.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What logs?</h4>
            <CodeBlock
              code={`var x = 1;

function foo() {
  var x = 2;
  function bar() {
    console.log(x);
  }
  return bar;
}

const fn = foo();
fn();`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>2</code>. <code>bar</code> is defined inside <code>foo</code>, so its scope chain
              includes <code>foo</code>'s scope where <code>x = 2</code>. It doesn't matter that{' '}
              <code>fn()</code> is called in global scope — lexical scope, not call site.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What's the output?</h4>
            <CodeBlock
              code={`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>3, 3, 3</code>. <code>var</code> is function-scoped — one <code>i</code> shared
              by all iterations. Callbacks fire after loop ends, <code>i</code> is <code>3</code>.
              Fix: use <code>let</code> for a new binding per iteration.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What logs and why?</h4>
            <CodeBlock
              code={`let x = "global";

function outer() {
  function inner() {
    console.log(x); // ?
  }
  let x = "outer";
  inner();
}

outer();`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>"outer"</code>. Even though <code>let x = "outer"</code> is written <em>after
              </em> <code>inner</code>'s definition, it's still in <code>outer</code>'s scope.
              By the time <code>inner()</code> is called, <code>x</code> is already initialized to{' '}
              <code>"outer"</code>. Lexical scope means <code>inner</code> looks into <code>outer
              </code>'s scope — and finds <code>"outer"</code>. No TDZ issue here because the call
              happens after the declaration.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hardest). What's the output? Explain each line.</h4>
            <CodeBlock
              code={`var x = 1;

function outer() {
  console.log(x);   // A
  var x = 2;

  function inner() {
    console.log(x); // B
    var x = 3;
    console.log(x); // C
  }

  inner();
  console.log(x);   // D
}

outer();
console.log(x);     // E`}
              filename="q8.js"
            />
            <div className="iq-answers">
              <div className="iq-answer-row">
                <span className="iq-answer-label">A →</span>
                <code>undefined</code>
                <span className="iq-answer-note">— var x inside outer is hoisted, shadows global x, not assigned yet</span>
              </div>
              <div className="iq-answer-row">
                <span className="iq-answer-label">B →</span>
                <code>undefined</code>
                <span className="iq-answer-note">— var x inside inner is hoisted, not assigned yet</span>
              </div>
              <div className="iq-answer-row">
                <span className="iq-answer-label">C →</span>
                <code>3</code>
                <span className="iq-answer-note">— now assigned</span>
              </div>
              <div className="iq-answer-row">
                <span className="iq-answer-label">D →</span>
                <code>2</code>
                <span className="iq-answer-note">— outer's x was assigned 2 before inner() was called</span>
              </div>
              <div className="iq-answer-row">
                <span className="iq-answer-label">E →</span>
                <code>1</code>
                <span className="iq-answer-note">— global x, never touched by outer or inner</span>
              </div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              Each function gets its own <code>var x</code> due to function scope. They all shadow
              each other without interfering. Hoisting within each scope causes the{' '}
              <code>undefined</code> values at A and B.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
