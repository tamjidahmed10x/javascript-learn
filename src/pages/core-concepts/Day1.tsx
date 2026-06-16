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

export default function Day1() {
  const { prev, next } = getDayNav(1)

  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of 7</span>
        <h1 className="lesson-title">How JavaScript Executes Code</h1>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            An <strong>execution context</strong> is the environment JavaScript builds around a piece
            of code before running it — its variable bindings, the scope chain, and the{' '}
            <code>this</code> value.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Each context is created in two phases: <em>creation</em> (register declarations, set up
            scope chain and <code>this</code>) then <em>execution</em> (run line by line). Contexts
            stack on the call stack and pop when finished.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always. One global context per script, plus a brand-new context every time a function is
            called.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Before your code runs, JavaScript builds a workspace around it. That workspace — with all
          its variables, scope, and <code>this</code> — is the <strong>execution context</strong>.
        </p>
        <p className="article-para">
          Every weird bug with <code>undefined</code>, wrong <code>this</code>, or "variable not
          defined"? Execution context is behind it.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Execution Context</dt>
            <dd className="def-text">
              The data structure JavaScript creates to run a piece of code. It holds the variable
              environment, the scope chain, and the <code>this</code> binding. One exists per script
              (global) and one is created per function call.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Call Stack</dt>
            <dd className="def-text">
              The LIFO stack that tracks which execution context is currently running. The global
              context sits at the bottom; each function call pushes a new context, each return pops
              one.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Kitchen Analogy</h2>
        <p className="article-para">
          You're a chef. Before cooking, you set up your station — ingredients out, tools ready,
          recipe in hand. That setup is the <strong>creation phase</strong>. Then you actually cook —
          that's the <strong>execution phase</strong>.
        </p>
        <p className="article-para">
          Each chef has their own station. A junior chef can see the head chef's counter (outer scope),
          but not another chef's private area. When a chef leaves, their station is cleaned up.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏢</span>
            <span className="analogy-label">Each station</span>
            <span className="analogy-target">Execution Context</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🍳</span>
            <span className="analogy-label">Kitchen</span>
            <span className="analogy-target">Call Stack</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">👨‍🍳</span>
            <span className="analogy-label">Head chef's counter</span>
            <span className="analogy-target">Global Scope</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">👀</span>
            <span className="analogy-label">Peeking at outer counter</span>
            <span className="analogy-target">Scope Chain</span>
          </div>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          Every execution context has three things:
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">Variable Environment</h4>
            <p className="theory-desc">All declarations stored in memory before code runs.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Scope Chain</h4>
            <p className="theory-desc">A link to the outer scope. Can't find a variable? Walk up the chain.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>this</code> Binding</h4>
            <p className="theory-desc">Depends on <em>how</em> the function was called, not where it was written.</p>
          </div>
        </div>

        <h3 className="article-h3">Two Phases</h3>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Creation Phase</span>
            <p className="phase-desc">
              Engine scans code, registers all declarations, sets up <code>this</code> and scope
              chain. Nothing runs yet.
            </p>
            <ul className="phase-rules">
              <li><code>var</code> → <code>undefined</code></li>
              <li>Function declarations → fully loaded</li>
              <li><code>let</code>/<code>const</code> → locked (TDZ)</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Execution Phase</span>
            <p className="phase-desc">
              Code runs line by line. Assignments happen. Functions are called. New contexts are
              pushed onto the stack.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Three Types</h3>

        <div className="theory-list" style={{ marginTop: '0.75rem' }}>
          <div className="theory-item">
            <h4 className="theory-title">Global Execution Context</h4>
            <p className="theory-desc">Created once. Always at the bottom of the stack. <code>this</code> = <code>window</code>.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Function Execution Context</h4>
            <p className="theory-desc">Created every time a function is <em>called</em>. Destroyed when it returns.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Eval</h4>
            <p className="theory-desc">Ignore it.</p>
          </div>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History & Comparison</h2>
        <p className="article-para">
          JavaScript was written in 10 days in 1995. The execution context model was baked in from
          day one to handle its dynamic, loosely typed, browser nature.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>JS</th>
                <th>Python</th>
                <th>Java</th>
                <th>C++</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hoisting</td>
                <td>Yes (<code>var</code> + functions)</td>
                <td>No</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>this</code></td>
                <td>Dynamic (call-site)</td>
                <td>No <code>this</code></td>
                <td>Always the instance</td>
                <td>Manual</td>
              </tr>
              <tr>
                <td>Closures</td>
                <td>First-class</td>
                <td>Yes</td>
                <td>Java 8+ only</td>
                <td>Limited</td>
              </tr>
              <tr>
                <td>Scope</td>
                <td>Lexical</td>
                <td>Lexical (LEGB)</td>
                <td>Lexical</td>
                <td>Lexical</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            JavaScript's <code>this</code> is the biggest "why is this different" moment for anyone
            coming from Java or Python.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow — Step by Step</h2>

        <CodeBlock
          code={`let name = "global";

function greet(person) {
  let message = "Hello, " + person;
  return message;
}

let result = greet("Tamjid");`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>GEC created → <code>name</code>, <code>greet</code>, <code>result</code> registered</span>
          </li>
          <li>
            <span>Execution starts → <code>name = "global"</code></span>
          </li>
          <li>
            <span><code>greet("Tamjid")</code> called → new FEC pushed</span>
          </li>
          <li>
            <span><code>message = "Hello, Tamjid"</code> → returned</span>
          </li>
          <li>
            <span>FEC destroyed → <code>result = "Hello, Tamjid"</code></span>
          </li>
          <li>
            <span>GEC stays until script ends</span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Hoisting</h3>
        <CodeBlock
          code={`console.log(a); // undefined — var hoisted
console.log(b); // ReferenceError — let is in TDZ

var a = 10;
let b = 20;`}
          filename="hoisting.js"
        />

        <h3 className="article-h3">Function Declaration vs Expression</h3>
        <CodeBlock
          code={`hello();   // ✅ works — fully hoisted
goodbye(); // ❌ TypeError — var is undefined, not a function yet

function hello() { console.log("Hello!"); }
var goodbye = function() { console.log("Bye!"); };`}
          filename="declaration-vs-expression.js"
        />

        <h3 className="article-h3">Scope Chain</h3>
        <CodeBlock
          code={`let city = "Dhaka";

function outer() {
  let area = "Mirpur";
  function inner() {
    console.log(city);  // "Dhaka"  — found in global
    console.log(area);  // "Mirpur" — found in outer
  }
  inner();
}`}
          filename="scope-chain.js"
        />

        <h3 className="article-h3"><code>this</code> Binding</h3>
        <CodeBlock
          code={`const user = {
  name: "Tamjid",
  greet()       { console.log(this.name); },          // "Tamjid"
  greetArrow: () { console.log(this.name); }           // undefined
};

user.greet();
const fn = user.greet;
fn(); // undefined — this is no longer user`}
          filename="this.js"
        />

        <h3 className="article-h3">Closure</h3>
        <CodeBlock
          code={`function makeCounter() {
  let count = 0;
  return function() { return ++count; };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
// makeCounter's FEC is gone, but count lives on`}
          filename="closure.js"
        />
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (1 hour)</span>
          <p>For every function call in this code, draw the call stack:</p>
        </div>

        <CodeBlock
          code={`function one() { two(); }
function two() { three(); }
function three() { console.log("hello"); }
one();`}
          filename="callstack.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Draw the call stack</span>
          <div className="concept-flow" style={{ marginTop: '0.5rem' }}>
            Global{' '}
            <span className="flow-arrow">↓</span>{' '}
            <span className="flow-highlight">one()</span>{' '}
            <span className="flow-arrow">↓</span>{' '}
            <span className="flow-highlight">two()</span>{' '}
            <span className="flow-arrow">↓</span>{' '}
            <span className="flow-highlight">three()</span>
          </div>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Each context is <strong>pushed</strong> onto the stack when called and <strong>popped</strong>{' '}
            when it returns. <code>three()</code> finishes first, then <code>two()</code>, then{' '}
            <code>one()</code>, then the global context.
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is an execution context?</h4>
            <p className="iq-a">
              The environment JS creates to run code. Has variable environment, scope chain, and{' '}
              <code>this</code> binding.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is the call stack?</h4>
            <p className="iq-a">
              Tracks active execution contexts. LIFO — last in, first out. GEC always at the bottom.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is hoisting?</h4>
            <p className="iq-a">
              During creation phase, declarations are registered before code runs. <code>var</code> →{' '}
              <code>undefined</code>. Functions → fully loaded. <code>let</code>/<code>const</code> → TDZ.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is the TDZ?</h4>
            <p className="iq-a">
              The gap between when <code>let</code>/<code>const</code> is registered and when its
              line executes. Touch it in that gap → <code>ReferenceError</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q5. Why does <code>this</code> break when you extract a method?</h4>
            <p className="iq-a">
              <code>this</code> is set at call time. <code>obj.greet()</code> → <code>this</code> is{' '}
              <code>obj</code>. <code>const fn = obj.greet; fn()</code> → plain call, <code>this</code> is{' '}
              <code>undefined</code>/global. The method didn't change — the call site did.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What logs here and why?</h4>
            <CodeBlock
              code={`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>3, 3, 3</code>. <code>var</code> is function-scoped — one shared <code>i</code>.
              By the time timeouts fire, the loop is done and <code>i</code> is <code>3</code>.
              Fix: use <code>let</code>.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q7 (Medium). What's the output, in order?</h4>
            <CodeBlock
              code={`console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>1, 4, 3, 2</code>. Sync first (1, 4). Then microtasks — Promise (3). Then
              macrotasks — setTimeout (2).
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hard). What logs and why does it still work?</h4>
            <CodeBlock
              code={`function outer() {
  let x = 10;
  return function middle() {
    let y = 20;
    return function inner() {
      console.log(x + y);
    };
  };
}

outer()()();`}
              filename="q8.js"
            />
            <p className="iq-a">
              <code>30</code>. <code>outer</code>'s FEC is gone, but <code>x</code> stays alive
              because <code>middle</code> holds a reference to its lexical environment.{' '}
              <code>middle</code>'s FEC is gone too, but <code>y</code> stays alive because{' '}
              <code>inner</code> holds its reference. Two nested closures — <code>inner</code> walks
              the chain and finds both. That's the scope chain and closure model working exactly
              as designed.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
