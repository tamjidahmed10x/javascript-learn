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

export default function Day5() {
  const { prev, next } = getDayNav(5)

  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of 7</span>
        <h1 className="lesson-title">Scope Chain Deep Dive</h1>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          The scope chain is how JavaScript finds variables it can't see locally. It's not magic —
          it's a linked list of environments built at the moment a function is <em>defined</em>.
          Get this wrong in your mental model and closures, bugs, and <code>undefined</code> will
          never fully make sense.
        </p>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Lost Keys Analogy</h2>
        <p className="article-para">
          You lose your keys. You check your own pockets first. Not there — you check the room
          you're in. Not there — you check the house. Not there — you check the building lobby.
        </p>
        <p className="article-para">
          You always search <strong>outward, one level at a time</strong>. You never skip levels.
          You never search a neighbor's house (sibling scope). The moment you find it, you stop.
        </p>

        <div className="article-callout">
          <p>
            Your pocket = local scope. Each outer room = parent scope. The lobby = global scope.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>

        <h3 className="article-h3">What builds the scope chain?</h3>
        <p className="article-para">
          Every function, at the moment it is <strong>defined</strong>, captures a reference to its
          surrounding lexical environment. This reference is stored internally as{' '}
          <code>[[Environment]]</code> — you can't access it directly, but the engine uses it every
          time a variable lookup happens.
        </p>
        <p className="article-para">
          This chain is <strong>fixed at write time</strong>. Moving or calling a function somewhere
          else does not change its chain.
        </p>

        <h3 className="article-h3">How lookup works</h3>
        <ol className="article-steps">
          <li><span>Check local scope first</span></li>
          <li><span>Not found → go to <code>[[Environment]]</code> (parent)</span></li>
          <li><span>Repeat until global</span></li>
          <li><span>Still not found → <code>ReferenceError</code></span></li>
        </ol>

        <p className="article-para" style={{ marginTop: '0.5rem' }}>
          The engine <strong>stops at the first match</strong>. Inner variables shadow outer ones.
        </p>

        <h3 className="article-h3">Variable Shadowing</h3>
        <p className="article-para">
          When an inner scope declares a variable with the same name as an outer one, the inner one{' '}
          <strong>shadows</strong> the outer. The outer still exists — it's just invisible from inside
          that scope.
        </p>

        <h3 className="article-h3">What does NOT create a new scope</h3>
        <ul className="learn-list">
          <li><code>if</code> / <code>else</code> blocks → block scope only (for <code>let</code>/<code>const</code>), not a new function scope</li>
          <li><code>for</code> / <code>while</code> loops → same</li>
          <li>Plain <code>{'{ }'}</code> curly braces → block scope only</li>
        </ul>
        <p className="article-para">
          Only <strong>functions</strong> and <strong>blocks</strong> (for <code>let</code>/<code>const
          </code>) create new scope levels on the chain.
        </p>
      </section>

      {/* ── Comparison ─────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Comparison</h2>

        <h3 className="article-h3">Scope chain vs similar concepts</h3>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Concept</th>
                <th>Language</th>
                <th>How it works</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Scope chain</td>
                <td>JavaScript</td>
                <td>Lexical — chain built at definition</td>
              </tr>
              <tr>
                <td>LEGB rule</td>
                <td>Python</td>
                <td>Local → Enclosing → Global → Built-in</td>
              </tr>
              <tr>
                <td>Block scope lookup</td>
                <td>Java / C++</td>
                <td>Walk up blocks, compile-time checked</td>
              </tr>
              <tr>
                <td>Dynamic scope</td>
                <td>Bash / older Lisps</td>
                <td>Chain built at <em>call time</em>, not definition</td>
              </tr>
              <tr>
                <td><code>global</code> keyword</td>
                <td>PHP</td>
                <td>Must explicitly import outer variable</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="article-h3">Lexical vs Dynamic scope</h3>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Lexical (JS)</th>
                <th>Dynamic (Bash)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chain set at</td>
                <td>Definition time</td>
                <td>Call time</td>
              </tr>
              <tr>
                <td>Predictable</td>
                <td>Always</td>
                <td>Depends on caller</td>
              </tr>
              <tr>
                <td>Closures possible</td>
                <td>Yes</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Debugging ease</td>
                <td>Easier</td>
                <td>Harder</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            JS chose lexical. Almost every modern language does. Dynamic scope makes code
            unpredictable.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow — Step by Step</h2>

        <CodeBlock
          code={`let a = 1;

function outer() {
  let b = 2;

  function middle() {
    let c = 3;

    function inner() {
      let d = 4;
      console.log(a, b, c, d);
    }

    inner();
  }

  middle();
}

outer();`}
          filename="chain.js"
        />

        <p className="article-para" style={{ marginTop: '1rem' }}>
          <code>inner()</code> needs: <code>a</code>, <code>b</code>, <code>c</code>, <code>d</code>
        </p>

        <div className="concept-flow">
          <code>d</code>{' '}
          <span className="flow-arrow">→</span>{' '}
          found locally in inner{' '}
          <br />
          <code>c</code>{' '}
          <span className="flow-arrow">→</span>{' '}
          not local{' '}
          <span className="flow-arrow">→</span>{' '}
          found in middle{' '}
          <br />
          <code>b</code>{' '}
          <span className="flow-arrow">→</span>{' '}
          not local{' '}
          <span className="flow-arrow">→</span>{' '}
          not in middle{' '}
          <span className="flow-arrow">→</span>{' '}
          found in outer{' '}
          <br />
          <code>a</code>{' '}
          <span className="flow-arrow">→</span>{' '}
          not local{' '}
          <span className="flow-arrow">→</span>{' '}
          not in middle{' '}
          <span className="flow-arrow">→</span>{' '}
          not in outer{' '}
          <span className="flow-arrow">→</span>{' '}
          found in global
        </div>

        <div className="article-callout" style={{ marginTop: '0.75rem' }}>
          <p>
            <strong>Chain:</strong> inner → middle → outer → global. Each arrow is one{' '}
            <code>[[Environment]]</code> reference the engine follows.
          </p>
        </div>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Basic chain lookup</h3>
        <CodeBlock
          code={`let brand = "Nike";

function store() {
  let section = "Shoes";

  function shelf() {
    console.log(brand, section); // "Nike" "Shoes"
  }

  shelf();
}
store();`}
          filename="basic.js"
        />

        <h3 className="article-h3">Sibling scopes can't see each other</h3>
        <CodeBlock
          code={`function a() { let x = 1; }
function b() { console.log(x); } // ❌ ReferenceError

a();
b();`}
          filename="sibling.js"
        />

        <h3 className="article-h3">Shadowing — inner wins</h3>
        <CodeBlock
          code={`let color = "red";

function paint() {
  let color = "blue";
  console.log(color); // "blue"
}

paint();
console.log(color); // "red" — outer untouched`}
          filename="shadow.js"
        />

        <h3 className="article-h3">Shadowing — outer still alive</h3>
        <CodeBlock
          code={`let score = 100;

function game() {
  let score = 0;
  console.log(score); // 0

  function bonus() {
    console.log(score); // 0 — game's score, not global
  }
  bonus();
}

game();
console.log(score); // 100 — global untouched`}
          filename="shadow-alive.js"
        />

        <h3 className="article-h3">Chain is set at definition, not call</h3>
        <CodeBlock
          code={`let env = "global";

function foo() {
  console.log(env); // always looks at global
}

function bar() {
  let env = "bar";
  foo(); // calling from bar doesn't change foo's chain
}

bar(); // "global"`}
          filename="lexical.js"
        />

        <h3 className="article-h3">Closure — chain survives function exit</h3>
        <CodeBlock
          code={`function outer() {
  let count = 0;

  return function inner() {
    count++;
    console.log(count);
  };
}

const inc = outer();
inc(); // 1
inc(); // 2
inc(); // 3
// outer() is done — but count lives on because inner holds the chain reference`}
          filename="closure.js"
        />

        <h3 className="article-h3">Block scope on the chain</h3>
        <CodeBlock
          code={`let x = "global";

{
  let x = "block";
  console.log(x);  // "block"
}

console.log(x); // "global"`}
          filename="block-chain.js"
        />

        <h3 className="article-h3">The chain walks up, never sideways</h3>
        <CodeBlock
          code={`function left() {
  let secret = 42;
}

function right() {
  console.log(secret); // ❌ ReferenceError
}

left();
right();`}
          filename="sideways.js"
        />
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is the scope chain?</h4>
            <p className="iq-a">
              A linked list of lexical environments. When a variable isn't found locally, the engine
              walks up this chain — parent scope, then grandparent, until global. If not found
              anywhere → <code>ReferenceError</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. When is the scope chain created?</h4>
            <p className="iq-a">
              At <strong>definition time</strong> — when the function is written. Not when it's
              called. This is lexical scoping. The chain is fixed and doesn't change no matter where
              or how the function is invoked.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Can two sibling functions access each other's variables?</h4>
            <p className="iq-a">
              No. The chain only goes <em>upward</em> to parent scopes. Sibling scopes are
              invisible to each other.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is variable shadowing?</h4>
            <p className="iq-a">
              When an inner scope declares a variable with the same name as an outer one. The inner
              one wins locally. The outer still exists — it's just blocked from view inside that scope.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What logs?</h4>
            <CodeBlock
              code={`let val = "outer";

function one() {
  let val = "one";

  function two() {
    console.log(val); // ?
  }

  return two;
}

const fn = one();
fn();`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>"one"</code>. <code>two</code> is defined inside <code>one</code>, so its{' '}
              <code>[[Environment]]</code> points to <code>one</code>'s scope where{' '}
              <code>val = "one"</code>. Even though <code>fn()</code> is called in global scope, the
              chain was fixed at definition. Classic closure + lexical scope combo.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What logs and why?</h4>
            <CodeBlock
              code={`function make(x) {
  return function(y) {
    return function(z) {
      return x + y + z;
    };
  };
}

console.log(make(1)(2)(3));`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>6</code>. Each returned function closes over the outer parameter. The innermost
              function's chain is: local <code>z</code> → middle's <code>y</code> → outer's{' '}
              <code>x</code> → global. It walks up and collects all three values.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What logs?</h4>
            <CodeBlock
              code={`let x = 0;

function a() {
  let x = 1;
  function b() {
    let x = 2;
    function c() {
      console.log(x); // ?
    }
    x = 99;
    c();
  }
  b();
}

a();`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>99</code>. <code>c</code> looks up <code>x</code> through the chain and
              finds it in <code>b</code>'s scope. By the time <code>c()</code> is called, <code>x
              </code> in <code>b</code> has already been reassigned to <code>99</code>.
            </p>
            <div className="article-callout" style={{ marginTop: '0.75rem' }}>
              <p>
                <strong>Key detail:</strong> The scope chain holds a <em>live reference</em> to the
                environment, not a snapshot. Whatever the current value is when you access it —
                that's what you get.
              </p>
            </div>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hardest). Explain the full output.</h4>
            <CodeBlock
              code={`function factory(n) {
  let fns = [];

  for (var i = 0; i < n; i++) {
    fns.push(function() {
      return i;
    });
  }

  return fns;
}

const arr = factory(3);
console.log(arr[0]()); // ?
console.log(arr[1]()); // ?
console.log(arr[2]()); // ?`}
              filename="q8.js"
            />
            <div className="iq-answers">
              <div className="iq-answer-row">
                <span className="iq-answer-label">arr[0]()</span>
                <code>3</code>
              </div>
              <div className="iq-answer-row">
                <span className="iq-answer-label">arr[1]()</span>
                <code>3</code>
              </div>
              <div className="iq-answer-row">
                <span className="iq-answer-label">arr[2]()</span>
                <code>3</code>
              </div>
            </div>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              All three functions share the <strong>same scope chain</strong> — they all close over{' '}
              <code>factory</code>'s scope where there is exactly one <code>var i</code>. By the time
              any of them is called, the loop has finished and <code>i</code> is <code>3</code>.
            </p>

            <CodeBlock
              code={`// Fix 1 — use let (new binding per iteration)
for (let i = 0; i < n; i++) { ... }
// 0, 1, 2 ✅

// Fix 2 — use an IIFE to capture the value
fns.push((function(j) {
  return function() { return j; };
})(i));
// 0, 1, 2 ✅`}
              label="Fixes"
            />

            <p className="iq-a">
              The IIFE creates a <strong>new scope</strong> on the chain for each iteration with its
              own <code>j</code>. Each function closes over a different environment. This is the
              classic closure-in-a-loop problem — understanding it requires understanding the scope
              chain at a deep level.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
