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

export default function Day2() {
  const { prev, next } = getDayNav(2)

  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of 7</span>
        <h1 className="lesson-title">Hoisting</h1>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          JavaScript reads your file twice — once to prepare, once to run. During preparation, it moves
          declarations to the top of their scope in memory. That's hoisting. It's why you can call a
          function before you write it.
        </p>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Form Analogy</h2>
        <p className="article-para">
          You're filling out a form. Before you start writing answers, someone already wrote all the
          field <em>labels</em> at the top — Name, Age, City. The values are blank for now, but the
          fields exist.
        </p>
        <p className="article-para">
          That's hoisting. The labels (declarations) are set up first. The values (assignments) come
          later when execution actually reaches that line.
        </p>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          Hoisting happens during the <strong>creation phase</strong> of the execution context — before
          a single line runs.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title"><code>var</code></h4>
            <p className="theory-desc">
              Declared <em>and</em> initialized to <code>undefined</code>. Accessible before its line,
              but value is <code>undefined</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>function</code> declaration</h4>
            <p className="theory-desc">
              Fully hoisted. Name + body. Callable anywhere in scope.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>let</code> / <code>const</code></h4>
            <p className="theory-desc">
              Declared but <strong>not</strong> initialized. Sit in the <strong>Temporal Dead Zone
              (TDZ)</strong> until their line. Touch them early → <code>ReferenceError</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>function</code> expression / arrow</h4>
            <p className="theory-desc">
              <strong>Not</strong> hoisted as a function. Only the variable is hoisted (
              <code>var</code> → <code>undefined</code>, <code>let</code>/<code>const</code> → TDZ).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>class</code> declarations</h4>
            <p className="theory-desc">
              Hoisted but in TDZ. Same as <code>let</code>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Comparison ─────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Comparison</h2>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Hoisting</th>
                <th>Default value</th>
                <th>TDZ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>var</code></td>
                <td>Yes</td>
                <td><code>undefined</code></td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>let</code></td>
                <td>Declaration only</td>
                <td>none</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>const</code></td>
                <td>Declaration only</td>
                <td>none</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>function</code> declaration</td>
                <td>Full body</td>
                <td>Ready to call</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>function</code> expression</td>
                <td>Variable only</td>
                <td><code>undefined</code> / TDZ</td>
                <td>Depends</td>
              </tr>
              <tr>
                <td><code>class</code></td>
                <td>Declaration only</td>
                <td>none</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="article-h3">Other languages</h3>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Language</th>
                <th>Hoisting</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Python</td>
                <td>No — use before define = <code>NameError</code></td>
              </tr>
              <tr>
                <td>Java</td>
                <td>No — compiler catches it</td>
              </tr>
              <tr>
                <td>C/C++</td>
                <td>No — strict top-to-bottom</td>
              </tr>
              <tr>
                <td>Ruby</td>
                <td>No — <code>undefined</code> variable error</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            JavaScript is nearly alone in doing this. It's a legacy of being built in 10 days.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow — Step by Step</h2>

        <CodeBlock
          code={`greet();
console.log(x);
var x = 5;
function greet() { console.log("hi"); }`}
          filename="hoisting-flow.js"
        />

        <p className="article-para" style={{ marginTop: '1rem' }}>
          <strong>What the engine does internally before running:</strong>
        </p>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Creation phase</span>
            <ul className="phase-rules">
              <li><code>x</code> → registered, value = <code>undefined</code></li>
              <li><code>greet</code> → registered, full function body loaded</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Execution phase</span>
            <ul className="phase-rules">
              <li><code>greet()</code> → works, function was fully loaded</li>
              <li><code>console.log(x)</code> → <code>undefined</code> (registered but not assigned yet)</li>
              <li><code>x = 5</code> → now <code>x</code> is <code>5</code></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3"><code>var</code> hoisting</h3>
        <CodeBlock
          code={`console.log(name); // undefined — not ReferenceError
var name = "Tamjid";
console.log(name); // "Tamjid"`}
          filename="var-hoist.js"
        />

        <h3 className="article-h3"><code>let</code> TDZ</h3>
        <CodeBlock
          code={`console.log(age); // ReferenceError — TDZ
let age = 25;`}
          filename="let-tdz.js"
        />

        <h3 className="article-h3">Function declaration — fully hoisted</h3>
        <CodeBlock
          code={`sayHi(); // ✅ "Hi!" — works before the definition

function sayHi() {
  console.log("Hi!");
}`}
          filename="function-hoist.js"
        />

        <h3 className="article-h3">Function expression — NOT fully hoisted</h3>
        <CodeBlock
          code={`sayBye(); // ❌ TypeError: sayBye is not a function

var sayBye = function() {
  console.log("Bye!");
};
// var is hoisted as undefined, calling undefined() throws`}
          filename="expression-hoist.js"
        />

        <h3 className="article-h3"><code>const</code> in TDZ</h3>
        <CodeBlock
          code={`console.log(PI); // ReferenceError
const PI = 3.14;`}
          filename="const-tdz.js"
        />

        <h3 className="article-h3">Class in TDZ</h3>
        <CodeBlock
          code={`const obj = new Person(); // ReferenceError
class Person {}`}
          filename="class-tdz.js"
        />
      </section>

      {/* ── Exercise ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="exercise-callout">
          <span className="exercise-callout-label">Exercise</span>
          <p>
            Write 20 hoisting snippets and predict each output <strong>before</strong> running.
            Mix <code>var</code>, function declarations, and function expressions.
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is hoisting?</h4>
            <p className="iq-a">
              JS registers declarations in memory before code runs. Variables exist before their
              line — but may be <code>undefined</code> or in TDZ depending on how they were declared.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What's the difference between <code>var</code> and <code>let</code> hoisting?</h4>
            <p className="iq-a">
              Both are hoisted. <code>var</code> is initialized to <code>undefined</code> — safe
              to access, just no value yet. <code>let</code> is in TDZ — accessing it throws a{' '}
              <code>ReferenceError</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Are function expressions hoisted?</h4>
            <p className="iq-a">
              The variable is hoisted, not the function. If declared with <code>var</code>, it's{' '}
              <code>undefined</code> until that line. Calling it before → <code>TypeError</code>.
              If declared with <code>let</code>/<code>const</code> → <code>ReferenceError</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What logs here?</h4>
            <CodeBlock
              code={`console.log(a);
var a = 1;
console.log(a);`}
              filename="q4.js"
            />
            <p className="iq-a">
              <code>undefined</code>, then <code>1</code>. <code>a</code> is registered as{' '}
              <code>undefined</code> before execution. Assignment happens on line 2.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What's the output?</h4>
            <CodeBlock
              code={`var x = 1;
function foo() {
  console.log(x);
  var x = 2;
  console.log(x);
}
foo();`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>undefined</code>, then <code>2</code>. Inside <code>foo</code>, <code>var x
              </code> is hoisted to the top of <em>that function's</em> scope — it shadows the
              outer <code>x</code>. At <code>console.log(x)</code>, the local <code>x</code> exists
              but is <code>undefined</code>. Then it's assigned <code>2</code>.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What happens here?</h4>
            <CodeBlock
              code={`foo();
bar();

function foo() { console.log("foo"); }
var bar = function() { console.log("bar"); };`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>"foo"</code> logs fine. <code>bar()</code> throws <code>TypeError</code> —{' '}
              <code>bar</code> is <code>undefined</code> at call time. Only <code>foo</code> gets
              fully hoisted.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). What logs?</h4>
            <CodeBlock
              code={`let x = "global";

function outer() {
  console.log(x); // ?
  let x = "local";
}

outer();`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>ReferenceError</code>. Even though <code>x</code> exists in the global scope,
              the engine sees the <code>let x</code> inside <code>outer</code> during creation phase
              and puts it in TDZ. At <code>console.log(x)</code>, the local <code>x</code> is in TDZ —
              it shadows the global one and blocks access to it. TDZ wins.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hardest). What's the output and why?</h4>
            <CodeBlock
              code={`function test() {
  console.log(typeof a); // ?
  console.log(typeof b); // ?

  var a = 1;
  let b = 2;
}
test();`}
              filename="q8.js"
            />
            <p className="iq-a">
              <code>"undefined"</code> for <code>a</code> — <code>var</code> is hoisted and initialized,
              <code>typeof</code> sees <code>undefined</code>.
            </p>
            <p className="iq-a" style={{ marginTop: '0.5rem' }}>
              <code>ReferenceError</code> for <code>b</code> — <code>let</code> is in TDZ, and unlike
              most operators, <code>typeof</code> does <strong>NOT</strong> safely handle TDZ variables.
              It throws. (<code>typeof</code> on a completely undeclared variable returns{' '}
              <code>"undefined"</code> safely — but TDZ is different. The variable <em>exists</em> but
              is inaccessible.)
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
