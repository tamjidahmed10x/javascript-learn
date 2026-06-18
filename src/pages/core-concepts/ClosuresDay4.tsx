import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('closures-functions')!
const navItems = weekNav(week)

export default function ClosuresDay4() {
  const { prev, next } = dayNavLinks(week, 4)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[3].title}</h1>
        <p className="lesson-subtitle">
          Three methods to take control of <code>this</code> &mdash; the explicit binding toolkit.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <code>call</code> and <code>apply</code> invoke a function <em>immediately</em> with a chosen{' '}
            <code>this</code>. <code>bind</code> returns a <em>new function</em> permanently bound to a
            chosen <code>this</code> (and optionally preset arguments).
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            All three live on <code>Function.prototype</code>. The first argument is always the value to use
            as <code>this</code>. <code>call</code> takes args one by one; <code>apply</code> takes an array;
            <code> bind</code> takes args one by one but defers the call.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Borrowing methods from unrelated objects, forcing <code>this</code> for callbacks, and currying
            functions by presetting arguments. Less common in modern code (arrows + spread cover many cases)
            but still essential for interviews.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          <code>this</code> is decided by <em>how a function is called</em>, not where it&rsquo;s written
          (Week 1, Day 1). Most of the time that&rsquo;s fine &mdash; but sometimes you need to override the
          call site. <code>call</code>, <code>apply</code>, and <code>bind</code> are the three escape hatches
          that let you set <code>this</code> manually. This is called <strong>explicit binding</strong>.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Explicit Binding</dt>
            <dd className="def-text">
              Manually telling a function what its <code>this</code> should be, using <code>call</code>,{' '}
              <code>apply</code>, or <code>bind</code>. Overrides whatever the call site would normally imply.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Method Borrowing</dt>
            <dd className="def-text">
              Calling a method that belongs to one object, but pointing its <code>this</code> at a different
              object so it operates on the borrower&rsquo;s data.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Currying (via bind)</dt>
            <dd className="def-text">
              Using <code>bind</code> to preset some arguments of a function, producing a new function that
              waits for the rest.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── The Three Side by Side ───────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Three, Side by Side</h2>

        <CodeBlock
          code={`function greet(greeting, punctuation) {
  return greeting + ", " + this.name + punctuation;
}

const user = { name: "Tamjid" };

// call — args one by one
greet.call(user, "Hello", "!");        // "Hello, Tamjid!"

// apply — args as an array
greet.apply(user, ["Hi", "."]);        // "Hi, Tamjid."

// bind — returns a function, args one by one (or none)
const sayHello = greet.bind(user, "Hello");
sayHello("!");                         // "Hello, Tamjid!"
sayHello("?");                         // "Hello, Tamjid?"`}
          filename="three-ways.js"
        />

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>call</th>
                <th>apply</th>
                <th>bind</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Invokes now?</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>No &mdash; returns a function</td>
              </tr>
              <tr>
                <td>Args format</td>
                <td>Comma-separated</td>
                <td>Single array</td>
                <td>Comma-separated</td>
              </tr>
              <tr>
                <td>First arg</td>
                <td><code>this</code> value</td>
                <td><code>this</code> value</td>
                <td><code>this</code> value</td>
              </tr>
              <tr>
                <td>Can preset args?</td>
                <td>No (one-shot)</td>
                <td>No (one-shot)</td>
                <td>Yes (partial application)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            Memory hook: <strong>call = comma, apply = array.</strong> Both run the function immediately and
            differ only in how you pass arguments. <strong>bind = build a new function</strong> for later.
          </p>
        </div>
      </section>

      {/* ── call ──────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">call &mdash; Invoke Now, Args One by One</h2>
        <p className="article-para">
          <code>fn.call(thisArg, arg1, arg2, ...)</code> calls <code>fn</code> right now with{' '}
          <code>thisArg</code> as <code>this</code> and the remaining args passed individually.
        </p>

        <h3 className="article-h3">Borrowing a method</h3>
        <CodeBlock
          code={`const car = { wheels: 4 };
const bike = { wheels: 2 };

function describe() {
  return "Has " + this.wheels + " wheels";
}

describe.call(car);  // "Has 4 wheels"
describe.call(bike); // "Has 2 wheels"

// describe doesn't belong to either object —
// call lets us point its \`this\` wherever we want.`}
          filename="borrow.js"
        />

        <h3 className="article-h3">Borrowing a built-in method</h3>
        <p className="article-para">
          A classic trick: <code>arguments</code> and NodeLists are array-like but lack array methods.
          Borrow <code>slice</code> from <code>Array.prototype</code> to convert them.
        </p>
        <CodeBlock
          code={`function sumAll() {
  // arguments is not a real array — no .reduce
  const arr = Array.prototype.slice.call(arguments);
  return arr.reduce((a, b) => a + b, 0);
}

sumAll(1, 2, 3); // 6

// Modern equivalent: Array.from(arguments) or [...arguments]`}
          filename="slice-call.js"
        />
      </section>

      {/* ── apply ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">apply &mdash; Invoke Now, Args as an Array</h2>
        <p className="article-para">
          <code>fn.apply(thisArg, argsArray)</code> is identical to <code>call</code> except arguments arrive
          as a single array. It exists for the case where you already have your arguments collected.
        </p>

        <CodeBlock
          code={`const nums = [5, 3, 9, 1, 7];

Math.max(5, 3, 9, 1, 7); // 9 — but we have an array, not spread args

Math.max.apply(null, nums); // 9
Math.min.apply(null, nums); // 1

// null as thisArg: Math.max doesn't use \`this\`, so it doesn't matter.`}
          filename="apply-max.js"
        />

        <div className="article-callout">
          <p>
            In modern JavaScript the spread operator covers almost every <code>apply</code> use case:{' '}
            <code>{'Math.max(...nums)'}</code> does the same thing. <code>apply</code> survives mainly when{' '}
            <code>this</code> binding and an argument array are needed together, and in older codebases.
            Know it for interviews; reach for spread first in new code.
          </p>
        </div>
      </section>

      {/* ── bind ──────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">bind &mdash; Build a Permanently Bound Function</h2>
        <p className="article-para">
          <code>fn.bind(thisArg, ...presetArgs)</code> does <strong>not</strong> call <code>fn</code>. It
          returns a new function whose <code>this</code> is locked to <code>thisArg</code> forever. Any
          extra arguments are preset (partially applied).
        </p>

        <h3 className="article-h3">Fixing <code>this</code> for a callback</h3>
        <p className="article-para">
          Extracting a method and passing it as a callback usually breaks <code>this</code> &mdash; it loses
          its object. <code>bind</code> reattaches it.
        </p>
        <CodeBlock
          code={`const user = {
  name: "Tamjid",
  greet() { console.log("Hi, " + this.name); },
};

setTimeout(user.greet, 0);       // "Hi, undefined" — this is lost
setTimeout(user.greet.bind(user), 0); // "Hi, Tamjid" — this is locked in`}
          filename="bind-callback.js"
        />

        <h3 className="article-h3">Preset arguments (partial application)</h3>
        <CodeBlock
          code={`function multiply(a, b) { return a * b; }

const double = multiply.bind(null, 2); // a=2 preset, this ignored
double(5);  // 10
double(11); // 22

// bind left-to-right: only leading args can be preset.
const alsoDouble = multiply.bind(null, 2, 5); // both preset
alsoDouble(); // 10 — ignores any further args`}
          filename="bind-partial.js"
        />

        <div className="article-callout">
          <p>
            A <code>bind</code>-bound <code>this</code> is <strong>sticky</strong>: calling{' '}
            <code>.call</code>/<code>.apply</code> on a bound function does <em>not</em> change its{' '}
            <code>this</code>. Once bound, it stays bound. (The only exception is <code>new</code> on a
            bound function, which resets <code>this</code> to a fresh object &mdash; Day 5.)
          </p>
        </div>
      </section>

      {/* ── Currying with bind ────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Currying with bind</h2>
        <p className="article-para">
          Because <code>bind</code> presets arguments left to right, you can use repeated <code>bind</code>{' '}
          calls to break an <em>n</em>-argument function into nested single-argument steps. That is
          currying.
        </p>
        <CodeBlock
          code={`function add(a, b, c) { return a + b + c; }

// Curry by binding one arg at a time (this is null — unused)
const addOne = add.bind(null, 1);       // b, c remaining
const addOneAndTwo = addOne.bind(null, 2); // c remaining

addOneAndTwo(3); // 6  → 1 + 2 + 3

// This is the same idea as Day 3's partial application,
// just chained. Week 5 builds a generic curry() from scratch.`}
          filename="curry-bind.js"
        />

        <p className="article-para">
          The limitation: <code>bind</code> presets arguments <strong>left to right only</strong>, and it
          can&rsquo;t skip an argument. For full currying control (any argument, any order) you need a
          hand-written <code>curry</code> &mdash; that&rsquo;s Week 5.
        </p>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; bind Returns a Function</h2>

        <CodeBlock
          code={`const user = { name: "Tamjid" };
function greet() { return "Hi " + this.name; }

const bound = greet.bind(user); // (1)
bound();                        // (2)`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>bind</code> creates a <em>new</em> function. Internally it wraps <code>greet</code> and
              captures <code>user</code> as its permanent <code>this</code>. <code>greet</code> is not run.
            </span>
          </li>
          <li>
            <span>
              <code>bound()</code> calls the wrapper, which calls <code>greet</code> with{' '}
              <code>this = user</code>. Returns <code>"Hi Tamjid"</code>. This works no matter where{' '}
              <code>bound</code> is passed &mdash; the binding travels with it.
            </span>
          </li>
        </ol>

        <p className="article-para" style={{ marginTop: '0.5rem' }}>
          The wrapper is essentially a closure (Day 1) over the original function and the{' '}
          <code>this</code> value. <code>bind</code> is a higher-order function (Day 3) that returns a
          function. Every concept this week connects.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Converting array-like objects</h3>
        <CodeBlock
          code={`function f() {
  // Old: borrow slice
  const a = Array.prototype.slice.call(arguments);
  // Modern: spread
  const b = [...arguments];
  // Or:
  const c = Array.from(arguments);
}

// Borrowing for NodeLists (querySelectorAll result):
const buttons = document.querySelectorAll("button");
Array.prototype.forEach.call(buttons, (b) => b.disabled = true);`}
          filename="convert.js"
        />

        <h3 className="article-h3">A reusable bound logger</h3>
        <CodeBlock
          code={`function log(prefix, msg) {
  console.log(\`[\${prefix}] \${msg}\`);
}

const dbLog = log.bind(null, "DB");   // prefix preset, this ignored
dbLog("connected"); // [DB] connected
dbLog("timeout");   // [DB] timeout`}
          filename="bound-logger.js"
        />

        <h3 className="article-h3">Borrowing from a prototype</h3>
        <CodeBlock
          code={`const has = Object.prototype.hasOwnProperty;

// WRONG: has({a:1}, "a") — \`this\` would be undefined
// RIGHT:
has.call({ a: 1 }, "a"); // true
has.call({ a: 1 }, "b"); // false`}
          filename="hasown.js"
        />

        <h3 className="article-h3">bind for <code>new</code> is special</h3>
        <CodeBlock
          code={`function Point(x, y) { this.x = x; this.y = y; }

const XAxis = Point.bind(null, 0); // x=0 preset, this ignored by \`new\`

const p = new XAxis(5);
// \`new\` ignores the bound \`this\` (null) and creates a fresh object.
// Preset args (x=0) still apply.
p.x; // 0
p.y; // 5`}
          filename="bind-new.js"
        />
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>Without looking, write from memory:</p>
        </div>

        <CodeBlock
          code={`// 1. A function that logs this.name. Call it on 3 different objects
//    using call, apply, and bind (one each).
// 2. Use apply to find Math.max of an array WITHOUT spread.
// 3. Use bind to create a \`double\` function from a generic \`multiply(a,b)\`.
// 4. Borrow Array.prototype.map to run over an \`arguments\` object.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then explain</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does <code>{'setTimeout(obj.method, 0)'}</code> lose <code>this</code>, but{' '}
            <code>{'setTimeout(() => obj.method(), 0)'}</code> preserve it? Two different mechanisms &mdash;
            name both. (Answer: the first passes a bare function reference, so <code>this</code> defaults;
            the arrow callback runs <code>obj.method()</code> as a method call, so <code>this</code> is{' '}
            <code>obj</code> again. <code>bind</code> is a third way.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Difference between call, apply, and bind?</h4>
            <p className="iq-a">
              <code>call</code> and <code>apply</code> invoke the function immediately with a chosen{' '}
              <code>this</code>; they differ only in argument passing &mdash; <code>call</code> takes them
              one by one, <code>apply</code> as an array. <code>bind</code> does <em>not</em> invoke &mdash;
              it returns a new function permanently bound to the given <code>this</code> (and optional preset
              args).
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. How do you borrow a method from another object?</h4>
            <p className="iq-a">
              Use <code>call</code> or <code>apply</code> to invoke the method with <code>this</code> pointed
              at the borrower. Example: <code>Array.prototype.slice.call(arguments)</code> borrows{' '}
              <code>slice</code> to convert an array-like object. The method runs as if it belonged to the
              borrower.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why use <code>bind</code> for event handlers / callbacks?</h4>
            <p className="iq-a">
              When you pass <code>obj.method</code> as a callback, it detaches from <code>obj</code> and{' '}
              <code>this</code> is lost. <code>obj.method.bind(obj)</code> returns a function whose{' '}
              <code>this</code> is permanently <code>obj</code>, so it survives being passed around. (Modern
              alternative: arrow functions that close over <code>obj</code>, or class fields.)
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q4 (Medium). What does this output and why?</h4>
            <CodeBlock
              code={`const f = function () { return this.x; };
const a = f.bind({ x: 1 });
a.call({ x: 2 });`}
              filename="q4.js"
            />
            <p className="iq-a">
              <code>1</code>. A bound function&rsquo;s <code>this</code> is sticky &mdash; <code>call</code>,{' '}
              <code>apply</code>, even another <code>bind</code> cannot change it. The bound <code>{'{ x: 1 }'}</code>{' '}
              wins over the <code>call</code>&rsquo;s <code>{'{ x: 2 }'}</code>. Only <code>new</code> can
              override it.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Implement a simplified <code>bind</code>.</h4>
            <CodeBlock
              code={`Function.prototype.myBind = function (thisArg, ...presetArgs) {
  const fn = this;
  return function (...laterArgs) {
    return fn.apply(thisArg, [...presetArgs, ...laterArgs]);
  };
};`}
              filename="a5.js"
            />
            <p className="iq-a">
              Capture the original function and the desired <code>this</code> in a closure. The returned
              function calls <code>fn.apply(thisArg, ...)</code> merging preset and later arguments. A full
              version also handles <code>new</code> (resetting <code>this</code>) &mdash; that&rsquo;s the
              Week 8 from-scratch build.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q6 (Hard). <code>bind</code> + <code>new</code> &mdash; what happens to <code>this</code> and the preset args?</h4>
            <CodeBlock
              code={`function Foo(a, b) { this.a = a; this.b = b; }
const Bound = Foo.bind({ fake: true }, 10);
const x = new Bound(20);`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>new</code> <strong>ignores</strong> the bound <code>this</code> (the <code>{'{ fake: true }'}</code>{' '}
              object is discarded) and instead creates a fresh object as <code>this</code>, as{' '}
              <code>new</code> always does. But the <strong>preset arguments are kept</strong>: <code>a=10</code>{' '}
              from <code>bind</code>, <code>b=20</code> from the call. So <code>x.a === 10</code>,{' '}
              <code>x.b === 20</code>, and <code>x.fake</code> is <code>undefined</code>. This is the one
              case where a bound function&rsquo;s <code>this</code> does not stick &mdash; <code>new</code>{' '}
              overrides it, but the partial application survives.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
