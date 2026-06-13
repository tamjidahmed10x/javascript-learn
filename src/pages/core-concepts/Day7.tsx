import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import CollapsibleQA from '../../components/CollapsibleQA'
import DayNav from '../../components/DayNav'
import { week1NavItems, getDayNav } from './navConfig'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'
import '../../components/CollapsibleQA.css'

const navItems = [
  { label: 'Overview', path: '/core-concepts/execution-context-scope' },
  ...week1NavItems,
]

export default function Day7() {
  const { prev } = getDayNav(7)

  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of 7</span>
        <h1 className="lesson-title">Revision + Mock Interview</h1>
        <p className="article-lead">
          Full session covering all Week 1 topics. Rapid fire revision, then a mock interview
          with 15 questions across 4 difficulty rounds.
        </p>
      </div>

      {/* ── Part 1: Rapid Fire ─────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Part 1 — Rapid Fire Revision</h2>
        <p className="article-para">
          No code. Just concepts. Read each, recall the answer, then check.
        </p>
      </section>

      {/* Execution Context */}
      <section className="day-section">
        <h3 className="article-h3">Execution Context</h3>

        <div className="rapid-fire-group">
          <span className="rapid-fire-label">Execution Context</span>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What are the three things every execution context contains?</p>
            <p className="rapid-fire-answer">Variable Environment, Scope Chain, <code>this</code> binding.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What are the two phases?</p>
            <p className="rapid-fire-answer">
              Creation phase (declarations registered, <code>this</code> set, scope chain built). Execution
              phase (code runs line by line).
            </p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">How many Global Execution Contexts exist per runtime?</p>
            <p className="rapid-fire-answer">Exactly one. Always at the bottom of the call stack.</p>
          </div>
        </div>
      </section>

      {/* Hoisting */}
      <section className="day-section">
        <h3 className="article-h3">Hoisting</h3>

        <div className="rapid-fire-group">
          <span className="rapid-fire-label">Hoisting</span>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What does <code>var</code> get initialized to during hoisting?</p>
            <p className="rapid-fire-answer"><code>undefined</code>.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What does a function declaration get during hoisting?</p>
            <p className="rapid-fire-answer">The full body. Callable immediately.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What does <code>let</code>/<code>const</code> get during hoisting?</p>
            <p className="rapid-fire-answer">Registered but not initialized. TDZ begins.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">Function declaration vs function expression — which hoists fully?</p>
            <p className="rapid-fire-answer">Declaration only. Expression hoists the variable name, not the function.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">Which wins during creation phase — <code>var foo</code> or <code>function foo()</code>?</p>
            <p className="rapid-fire-answer"><code>function foo()</code> wins. Always.</p>
          </div>
        </div>
      </section>

      {/* TDZ */}
      <section className="day-section">
        <h3 className="article-h3">TDZ</h3>

        <div className="rapid-fire-group">
          <span className="rapid-fire-label">TDZ</span>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What is the TDZ?</p>
            <p className="rapid-fire-answer">
              The window between when <code>let</code>/<code>const</code> is registered and when
              its line executes. Access in this window → <code>ReferenceError</code>.
            </p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">Does <code>typeof</code> safely handle TDZ variables?</p>
            <p className="rapid-fire-answer">
              No. <code>typeof undeclaredVar</code> → <code>"undefined"</code>.{' '}
              <code>typeof tdzVar</code> → <code>ReferenceError</code>.
            </p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">Does TDZ affect <code>var</code>?</p>
            <p className="rapid-fire-answer">No. <code>var</code> has no TDZ.</p>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="day-section">
        <h3 className="article-h3">Scope</h3>

        <div className="rapid-fire-group">
          <span className="rapid-fire-label">Scope</span>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What's the difference between function scope and block scope?</p>
            <p className="rapid-fire-answer">
              <code>var</code> = function scope, ignores <code>{'{ }'}</code>.{' '}
              <code>let</code>/<code>const</code> = block scope, dies at <code>{'}'}</code>.
            </p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">Can sibling scopes see each other?</p>
            <p className="rapid-fire-answer">No. Chain only goes upward.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What is lexical scope?</p>
            <p className="rapid-fire-answer">
              Scope is determined by where code is <em>written</em>, not where it's <em>called</em>.
            </p>
          </div>
        </div>
      </section>

      {/* Scope Chain */}
      <section className="day-section">
        <h3 className="article-h3">Scope Chain</h3>

        <div className="rapid-fire-group">
          <span className="rapid-fire-label">Scope Chain</span>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">When is the scope chain built?</p>
            <p className="rapid-fire-answer">
              At function definition time. Fixed. Never changes.
            </p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What is a live reference?</p>
            <p className="rapid-fire-answer">
              Closures capture the <em>environment</em>, not the value. The value read is whatever
              it is at access time.
            </p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">What happens when the engine can't find a variable at global scope?</p>
            <p className="rapid-fire-answer"><code>ReferenceError</code>.</p>
          </div>
        </div>
      </section>

      {/* this */}
      <section className="day-section">
        <h3 className="article-h3"><code>this</code></h3>

        <div className="rapid-fire-group">
          <span className="rapid-fire-label">this</span>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt"><code>this</code> in a regular function call (non-strict)?</p>
            <p className="rapid-fire-answer">Global object (<code>window</code>).</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt"><code>this</code> in a regular function call (strict mode)?</p>
            <p className="rapid-fire-answer"><code>undefined</code>.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt"><code>this</code> in an arrow function?</p>
            <p className="rapid-fire-answer">
              Inherited from the surrounding lexical context. Arrow functions have no own <code>this</code>.
            </p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt"><code>this</code> when a method is extracted and called as plain function?</p>
            <p className="rapid-fire-answer">Lost. Becomes global/<code>undefined</code>.</p>
          </div>
        </div>
      </section>

      {/* Event Loop */}
      <section className="day-section">
        <h3 className="article-h3">Event Loop</h3>

        <div className="rapid-fire-group">
          <span className="rapid-fire-label">Event Loop</span>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">Execution order?</p>
            <p className="rapid-fire-answer">Synchronous → Microtask queue → Macrotask queue.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">Promise <code>.then</code> is which queue?</p>
            <p className="rapid-fire-answer">Microtask.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt"><code>setTimeout</code> is which queue?</p>
            <p className="rapid-fire-answer">Macrotask.</p>
          </div>

          <div className="rapid-fire-item">
            <p className="rapid-fire-prompt">If a microtask schedules another microtask, when does it run?</p>
            <p className="rapid-fire-answer">
              Before any macrotask. Microtask queue fully drains first.
            </p>
          </div>
        </div>
      </section>

      {/* ── Part 2: Mock Interview ──────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Part 2 — Mock Interview</h2>
        <p className="article-para">
          Interviewer asks. You answer. Check explanation after each.
        </p>
      </section>

      {/* Round 1: Junior */}
      <section className="day-section">
        <span className="round-label">Round 1 — Junior Level</span>

        <CollapsibleQA
          difficulty="easy"
          question={<CodeBlock code={`console.log(a);
var a = 5;
console.log(a);`} filename="q1.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">First log</span><code>undefined</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">Second log</span><code>5</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>var a</code> is hoisted and initialized to <code>undefined</code> during creation phase.
              First log hits before assignment. Second log hits after <code>a = 5</code>.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="easy"
          question={<CodeBlock code={`sayHi();
sayBye();

function sayHi() { console.log("Hi"); }
var sayBye = function() { console.log("Bye"); };`} filename="q2.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Output</span><code>"Hi"</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">Then</span><code>TypeError: sayBye is not a function</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>sayHi</code> is a function declaration — fully hoisted, callable anywhere. <code>sayBye
              </code> is a <code>var</code> — hoisted as <code>undefined</code>. Calling <code>undefined()
              </code> → <code>TypeError</code>.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="easy"
          question={<CodeBlock code={`{
  var x = 1;
  let y = 2;
}
console.log(x);
console.log(y);`} filename="q3.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">First log</span><code>1</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">Second log</span><code>ReferenceError</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>var</code> ignores block boundaries — leaks out. <code>let</code> is block-scoped —
              dead outside <code>{'{ }'}</code>.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="easy"
          question={<CodeBlock code={`const user = { name: "Tamjid" };
user.name = "Rahman";
user = {};`} filename="q4.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Line 2</span><code>✅</code> — mutating the object, not reassigning</div>
              <div className="iq-answer-row"><span className="iq-answer-label">Line 3</span><code>❌ TypeError</code> — reassigning the binding</div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>const</code> prevents reassigning the <em>binding</em>, not mutating the object.{' '}
              <code>user = {}</code> reassigns the binding itself — forbidden.
            </p>
          />}
        />
      </section>

      {/* Round 2: Mid */}
      <section className="day-section">
        <span className="round-label">Round 2 — Mid Level</span>

        <CollapsibleQA
          difficulty="medium"
          question={<CodeBlock code={`let x = "global";

function outer() {
  let x = "outer";

  function inner() {
    console.log(x);
  }

  return inner;
}

const fn = outer();
fn();`} filename="q5.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Output</span><code>"outer"</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>inner</code> is defined inside <code>outer</code> — its scope chain includes{' '}
              <code>outer</code>'s environment. Even after <code>outer()</code> finishes, <code>inner</code> holds
              a reference to that environment (closure). <code>fn()</code> is called in global scope,
              but the chain was fixed at definition.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="medium"
          question={<CodeBlock code={`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`} filename="q6.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Output</span><code>3, 3, 3</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>var i</code> is function-scoped — one shared <code>i</code>. Loop finishes (<code>i = 3
              </code>) before any callback fires.
            </p>

            <CodeBlock
              code={`// Fix 1 — let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2 ✅

// Fix 2 — IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
// 0, 1, 2 ✅`}
              label="Fixes"
            />
          />}
        />

        <CollapsibleQA
          difficulty="medium"
          question={<CodeBlock code={`console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");`} filename="q7.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Order</span><code>1, 4, 3, 2</code></div>
            </div>

            <div className="this-table" style={{ marginTop: '0.75rem' }}>
              <table>
                <thead>
                  <tr><th>Queue</th><th>Items</th><th>Priority</th></tr>
                </thead>
                <tbody>
                  <tr><td>Synchronous</td><td>1, 4</td><td>Runs first, always</td></tr>
                  <tr><td>Microtask</td><td>3 (Promise <code>.then</code>)</td><td>After sync, before macro</td></tr>
                  <tr><td>Macrotask</td><td>2 (setTimeout)</td><td>Last</td></tr>
                </tbody>
              </table>
            </div>
          />}
        />

        <CollapsibleQA
          difficulty="medium"
          question={<CodeBlock code={`const obj = {
  val: 42,
  getVal: function() {
    return this.val;
  }
};

const fn = obj.getVal;
console.log(obj.getVal());
console.log(fn());`} filename="q8.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label"><code>obj.getVal()</code></span><code>42</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label"><code>fn()</code></span><code>undefined</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>obj.getVal()</code> — <code>this</code> is <code>obj</code>. <code>fn()</code> —
              plain function call, <code>this</code> is <code>window</code>/<code>undefined</code>. Same function,
              different call site.
            </p>
          />}
        />
      </section>

      {/* Round 3: Senior */}
      <section className="day-section">
        <span className="round-label">Round 3 — Senior Level</span>

        <CollapsibleQA
          difficulty="hard"
          question={<CodeBlock code={`var x = 1;

function foo() {
  console.log(x);
  var x = 2;
}

foo();
console.log(x);`} filename="q9.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">First log</span><code>undefined</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">Second log</span><code>1</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              Inside <code>foo</code>, <code>var x</code> is hoisted to the top — shadows
              global <code>x</code>. Not yet assigned at log time. Global <code>x</code> is never touched.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="hard"
          question={<CodeBlock code={`function outer() {
  let count = 0;

  return {
    increment() { count++; },
    decrement() { count--; },
    value()     { return count; }
  };
}

const counter = outer();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.value());`} filename="q10.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Output</span><code>1</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              All three methods close over the <strong>same</strong> <code>count</code> in{' '}
              <code>outer</code>'s environment. Each mutation is visible to all three. This is the{' '}
              <strong>Module Pattern</strong> — private state via closure, public API via returned object.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="hard"
          question={<CodeBlock code={`class Timer {
  seconds = 0;

  start() {
    setInterval(function() {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
}

const t = new Timer();
t.start();`} filename="q11.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Output</span><code>NaN</code> (every second)</div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>setInterval</code>'s callback is a regular function. In class body (strict mode),
              <code>this</code> is <code>undefined</code>.
            </p>

            <CodeBlock
              code={`// Fix — Arrow function
start() {
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds); // 1, 2, 3... ✅
  }, 1000);
}`}
              label="Fix"
            />
          />}
        />

        <CollapsibleQA
          difficulty="hard"
          question={<CodeBlock code={`console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
  Promise.resolve().then(() => console.log("E"));
});

console.log("F");`} filename="q12.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">Order</span><code>A, F, C, E, B, D</code></div>
            </div>
            <div className="concept-flow" style={{ marginTop: '0.75rem' }}>
              Sync: A, F
              <br />
              Microtask 1: C → schedules D (macro: [B, D]), schedules E (micro: [E])
              <br />
              Microtask 2: E
              <br />
              Macrotask: B, then D
            </div>
          />}
        />
      </section>

      {/* Round 4: Final Boss */}
      <section className="day-section">
        <span className="round-label">Round 4 — The Final Boss</span>

        <CollapsibleQA
          difficulty="boss"
          question={<CodeBlock code={`var x = 1;

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
baz();`} filename="q13.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">A →</span><code>undefined</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">B →</span><code>2</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">C →</span><code>3</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.75rem' }}>
              <strong>A:</strong> <code>var x</code> hoisted inside <code>foo</code>, shadows
              global, not yet assigned. <strong>B:</strong> <code>bar</code> closes over{' '}
              <code>foo</code>'s scope where <code>x = 2</code>. <strong>C:</strong> <code>bar</code>{' '}
              mutated <code>x</code> to <code>3</code> (live reference). All three share one{' '}
              <code>[[Environment]]</code> from <code>foo</code>.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="boss"
          question={<CodeBlock code={`function make() {
  const fns = [];

  for (let i = 0; i < 3; i++) {
    fns.push({
      get: () => i,
      set: (v) => { i = v; }
    });
  }

  return fns;
}

const fns = make();
console.log(fns[0].get()); // A
console.log(fns[1].get()); // B
fns[0].set(99);
console.log(fns[0].get()); // C
console.log(fns[1].get()); // D`} filename="q14.js" />}
          answer={<>
            <div className="iq-answers">
              <div className="iq-answer-row"><span className="iq-answer-label">A →</span><code>0</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">B →</span><code>1</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">C →</span><code>99</code></div>
              <div className="iq-answer-row"><span className="iq-answer-label">D →</span><code>1</code></div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.75rem' }}>
              <code>let</code> gives each iteration a private <code>i</code>.{' '}
              <code>fns[0].set(99)</code> only mutates <code>fns[0]</code>'s own <code>i</code>.{' '}
              <code>fns[1]</code> is completely independent — still <code>1</code>.
            </p>
          />}
        />

        <CollapsibleQA
          difficulty="boss"
          question={<p className="iq-q">Design Question: *"Explain how you would implement private state in JavaScript without using classes or WeakMap."*</p>}
          answer={<>
            <p className="iq-a" style={{ marginTop: '0.75rem' }}>
              <strong>Use closures — the Revealing Module Pattern.</strong>
            </p>
            <CodeBlock
              code={`function createUser(name, age) {
  // private — inaccessible from outside
  let _name = name;
  let _age = age;

  // public API
  return {
    getName() { return _name; },
    getAge()  { return _age; },
    birthday() {
      _age++;
      console.log(\`Happy birthday \${_name}, now \${_age}\`);
    }
  };
}

const user = createUser("Tamjid", 25);
user.birthday();          // "Happy birthday Tamjid, now 26"
console.log(user._age);   // undefined — truly private`}
              label="revealing-module.js"
            />
            <p className="iq-a">
              <code>_name</code> and <code>_age</code> live in <code>createUser</code>'s closure.
              The returned object's methods close over that environment. Nothing outside can touch them
              directly.
            </p>
          />}
        />
      </section>

      {/* ── Part 3: Self Score ─────────────────────────── */}
      <section className="challenge-section">
        <span className="challenge-label">Part 3 — Self Score</span>

        <div className="score-table">
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Topic</th>
                <th>Questions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Round 1</td>
                <td>Junior</td>
                <td>Q1–Q4</td>
              </tr>
              <tr>
                <td>Round 2</td>
                <td>Mid</td>
                <td>Q5–Q8</td>
              </tr>
              <tr>
                <td>Round 3</td>
                <td>Senior</td>
                <td>Q9–Q12</td>
              </tr>
              <tr>
                <td>Round 4</td>
                <td>Final Boss</td>
                <td>Q13–Q15</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="score-table" style={{ marginTop: '0' }}>
          <table>
            <thead>
              <tr>
                <th>Score</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>13–15 correct</td>
                <td>You own this topic. Go deeper into async/generators.</td>
              </tr>
              <tr>
                <td>10–12 correct</td>
                <td>Solid. Re-read the problems you missed, trace them line by line.</td>
              </tr>
              <tr>
                <td>7–9 correct</td>
                <td>Go back to scope chain and <code>this</code>. Those are your gaps.</td>
              </tr>
              <tr>
                <td>Below 7</td>
                <td>Restart from Execution Context. Build the foundation first.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── What To Study Next ──────────────────────────── */}
      <section className="week-bridge">
        <p>
          Based on this series, the natural next topics are:
        </p>

        <div className="topics-table">
          <table>
            <thead>
              <tr>
                <th>Topic</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Closures deep dive</strong></td>
                <td>Everything here leads to it</td>
              </tr>
              <tr>
                <td><strong>Prototypes + Prototype chain</strong></td>
                <td>The <code>this</code> + class questions point here</td>
              </tr>
              <tr>
                <td><strong>Async/Await + Event Loop</strong></td>
                <td>Q5, Q7, Q12 are just the surface</td>
              </tr>
              <tr>
                <td><strong>Generators + Iterators</strong></td>
                <td>Advanced execution control</td>
              </tr>
              <tr>
                <td><strong>Memory management + GC</strong></td>
                <td>When do closures become leaks?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
