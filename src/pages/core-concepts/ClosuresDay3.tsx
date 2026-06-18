import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('closures-functions')!
const navItems = weekNav(week)

export default function ClosuresDay3() {
  const { prev, next } = dayNavLinks(week, 3)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[2].title}</h1>
        <p className="lesson-subtitle">
          The reason closures exist at all: functions are values, and values can be passed around.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            In JavaScript, functions are <strong>first-class</strong>: they can be stored in variables,
            passed as arguments, and returned from other functions &mdash; just like numbers or strings. A{' '}
            <strong>higher-order function</strong> is any function that takes a function as an argument or
            returns one.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Because functions are values, you can build small, reusable operations and{' '}
            <em>compose</em> them &mdash; <code>map</code> transforms each element, <code>filter</code>{' '}
            keeps the ones that pass, <code>reduce</code> folds a list down to a single value.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Constantly. Every callback, every <code>.then</code>, every event handler, every array
            transformation is first-class functions in motion. This is the foundation functional
            programming is built on.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Two terms, often confused. They describe related but distinct ideas:
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">First-Class Function</dt>
            <dd className="def-text">
              A property of the <em>language</em>. It means functions are treated like any other value &mdash;
              assignable to variables, storable in arrays, passable as arguments, returnable from calls.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Higher-Order Function (HOF)</dt>
            <dd className="def-text">
              A property of a <em>specific function</em>. Any function that takes one or more functions as
              arguments, or returns a function, is higher-order. HOFs are only <em>possible</em> because
              functions are first-class.
            </dd>
          </div>
        </dl>

        <p className="article-para">
          The relationship is causal: <strong>first-class is the capability; higher-order is how you use
          it.</strong> JavaScript having first-class functions is what lets you write higher-order ones.
        </p>

        <CodeBlock
          code={`// Functions as values — first-class in action
const greet = function (name) {   // assigned to a variable
  return "Hello, " + name;
};

const functions = [greet, console.log]; // stored in an array
const obj = { greet };                   // stored in an object

greet("Tamjid");                         // called normally
obj.greet("Rafi");                       // called as a method`}
          filename="first-class.js"
        />
      </section>

      {/* ── The Four Things ───────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">What &ldquo;First-Class&rdquo; Actually Means</h2>
        <p className="article-para">
          A value is first-class when it supports four operations. Functions in JavaScript support all
          four. That is the entire definition.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Assign to a variable</h4>
            <p className="theory-desc"><code>const fn = function () {'{}'}</code> &mdash; or the arrow shorthand <code>const fn = () =&gt; {'{}'}</code>.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Pass as an argument</h4>
            <p className="theory-desc"><code>[1,2].map(double)</code> &mdash; <code>double</code> is handed over, the receiver decides when to call it.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Return from a function</h4>
            <p className="theory-desc"><code>return () =&gt; x + 1</code> &mdash; yesterday&rsquo;s factory functions, the module pattern, all of it.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Store in data structures</h4>
            <p className="theory-desc">Arrays, objects, <code>Map</code>s &mdash; a function can live anywhere a number can.</p>
          </div>
        </div>

        <CodeBlock
          code={`const ops = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
};

function apply(op, x, y) {       // HOF: takes a function as an arg
  return op(x, y);
}

apply(ops.add, 5, 3); // 8 — the function is just another value in the call`}
          filename="four-operations.js"
        />

        <div className="article-callout">
          <p>
            &ldquo;Callback&rdquo; is just a job title for a function. When a function is <em>passed in</em>{' '}
            to be called later by someone else, we call it a callback. There is no special callback type &mdash;
            it is an ordinary first-class function in a particular role.
          </p>
        </div>
      </section>

      {/* ── map / filter / reduce ─────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Big Three: map, filter, reduce</h2>
        <p className="article-para">
          These three array methods are the canonical higher-order functions. Each takes a callback and
          uses it to do one job. Master them and most array manipulation becomes trivial.
        </p>

        <h3 className="article-h3">map &mdash; transform every element</h3>
        <p className="article-para">
          Returns a <strong>new array</strong> of the same length. Each element is the result of calling
          the callback on the corresponding input element. It never mutates the original.
        </p>
        <CodeBlock
          code={`const nums = [1, 2, 3, 4];

const doubled = nums.map((n) => n * 2);
// [2, 4, 6, 8]

const nums.length;        // 4 — original unchanged
const doubled.length;     // 4 — same length, always

// The callback also receives index and the whole array:
nums.map((n, i) => \`\${i}: \${n}\`); // ["0: 1", "1: 2", "2: 3", "3: 4"]`}
          filename="map.js"
        />

        <h3 className="article-h3">filter &mdash; keep what passes</h3>
        <p className="article-para">
          Returns a <strong>new array</strong> containing only the elements for which the callback returned
          a truthy value. Length can be anything from zero up to the original length.
        </p>
        <CodeBlock
          code={`const nums = [1, 2, 3, 4, 5, 6];

const evens = nums.filter((n) => n % 2 === 0);
// [2, 4, 6]

// Truthy/falsy matters — not just strict boolean:
[0, 1, "", "a", null, "b"].filter(Boolean);
// [1, "a", "b"] — Boolean coerces and filters out falsy values`}
          filename="filter.js"
        />

        <h3 className="article-h3">reduce &mdash; fold many into one</h3>
        <p className="article-para">
          The most powerful of the three. It walks the array accumulating a single result. The callback
          receives <code>(accumulator, currentValue)</code> and returns the next accumulator.
        </p>
        <CodeBlock
          code={`const nums = [1, 2, 3, 4];

const sum = nums.reduce((acc, n) => acc + n, 0);
// acc: 0 → 1 → 3 → 6 → 10
// 0 is the initial value — without it, reduce uses the first element

// reduce can build ANY structure, not just a number:
const grouped = people.reduce((acc, p) => {
  (acc[p.city] ||= []).push(p);
  return acc;
}, {}); // groups people by city into an object of arrays`}
          filename="reduce.js"
        />

        <div className="article-callout">
          <p>
            <code>map</code> and <code>filter</code> are both special cases of <code>reduce</code>. You
            could implement them with it. The reason they exist separately is readability: the name tells
            the reader the <em>shape</em> of the transformation. Prefer the specific one when it fits.
          </p>
        </div>

        <h3 className="article-h3">Chaining &mdash; the functional style</h3>
        <CodeBlock
          code={`const users = [
  { name: "Tamjid", active: true,  score: 88 },
  { name: "Rafi",   active: false, score: 72 },
  { name: "Sara",   active: true,  score: 95 },
  { name: "Mita",   active: true,  score: 60 },
];

const result = users
  .filter((u) => u.active)        // keep active users
  .map((u) => u.score)            // pull out scores
  .filter((s) => s >= 80)         // keep high scores
  .reduce((sum, s) => sum + s, 0); // add them up
// 88 + 95 = 183`}
          filename="chaining.js"
        />

        <p className="article-para">
          Each step returns a new array, which becomes the input to the next. No mutation, no loops, no
          intermediate variables &mdash; the data flows through a pipeline of small named operations. This
          is the heart of functional style in JavaScript.
        </p>
      </section>

      {/* ── Returning Functions ───────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Returning Functions</h2>
        <p className="article-para">
          A function that returns a function is a higher-order function too &mdash; the other half of the
          definition. You saw this yesterday: every factory, every <code>memoize</code>, every module
          pattern returns a function. Today we generalize why it&rsquo;s useful.
        </p>

        <CodeBlock
          code={`// A function that MAKES functions
function makeMultiplier(factor) {
  return function (n) {
    return n * factor;       // factor is captured — a closure
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

double(5); // 10
triple(5); // 15`}
          filename="make-multiplier.js"
        />

        <p className="article-para">
          Returning a function lets you <strong>configure behavior at one time and use it at
          another.</strong> The configuration (<code>factor</code>) is frozen into the closure; the
          resulting function is reusable. This is the mechanism behind partial application, currying,
          decorators, and middleware.
        </p>

        <h3 className="article-h3">Function decorators</h3>
        <p className="article-para">
          A decorator is a higher-order function that takes a function and returns a new one with added
          behavior &mdash; logging, timing, caching &mdash; without changing the original.
        </p>
        <CodeBlock
          code={`function withLogging(fn) {
  return function (...args) {
    console.log("calling with", args);
    const result = fn.apply(this, args);
    console.log("returned", result);
    return result;
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);

loggedAdd(2, 3);
// calling with [2, 3]
// returned 5
// add itself is untouched`}
          filename="decorator.js"
        />

        <div className="article-callout">
          <p>
            The two faces of higher-order functions: <strong>take a function in</strong> (like{' '}
            <code>map</code>) to generalize a pattern, or <strong>return a function out</strong> (like{' '}
            <code>makeMultiplier</code>) to configure behavior. Real-world libraries do both: Express
            middleware takes a handler in; <code>bind</code> returns a configured function out.
          </p>
        </div>
      </section>

      {/* ── Comparison ────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Comparison &amp; Common Confusions</h2>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>First-class</th>
                <th>Higher-order</th>
                <th>Callback</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Describes</td>
                <td>The language</td>
                <td>A specific function</td>
                <td>A function&rsquo;s role</td>
              </tr>
              <tr>
                <td>Takes fn as arg?</td>
                <td>&mdash;</td>
                <td>Yes (or returns one)</td>
                <td>No (it IS the arg)</td>
              </tr>
              <tr>
                <td>Returns fn?</td>
                <td>&mdash;</td>
                <td>Yes (or takes one)</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Example</td>
                <td>JS has first-class fns</td>
                <td><code>map</code>, <code>memoize</code></td>
                <td><code>(n) =&gt; n*2</code> in map</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            A callback is not a different <em>kind</em> of function. It&rsquo;s the same first-class
            function, just <em>being passed in</em>. Call the same function twice &mdash; once as an
            argument, once returned &mdash; and in one call it&rsquo;s a callback, in the other it&rsquo;s a
            return value. The function is unchanged; only its role changes.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; reduce, Step by Step</h2>

        <CodeBlock
          code={`const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              Initial accumulator <code>acc = 0</code> (the second argument to <code>reduce</code>).
            </span>
          </li>
          <li>
            <span>
              Element <code>1</code>: callback returns <code>0 + 1 = 1</code> &rarr; <code>acc = 1</code>.
            </span>
          </li>
          <li>
            <span>
              Element <code>2</code>: callback returns <code>1 + 2 = 3</code> &rarr; <code>acc = 3</code>.
            </span>
          </li>
          <li>
            <span>
              Element <code>3</code>: callback returns <code>3 + 3 = 6</code> &rarr; <code>acc = 6</code>.
            </span>
          </li>
          <li>
            <span>
              Element <code>4</code>: callback returns <code>6 + 4 = 10</code> &rarr; <code>acc = 10</code>.
              Array exhausted; <code>reduce</code> returns <code>10</code>.
            </span>
          </li>
        </ol>

        <div className="concept-flow">
          0 <span className="flow-arrow">→</span>{' '}
          <span className="flow-highlight">+1 = 1</span>{' '}
          <span className="flow-arrow">→</span>{' '}
          <span className="flow-highlight">+2 = 3</span>{' '}
          <span className="flow-arrow">→</span>{' '}
          <span className="flow-highlight">+3 = 6</span>{' '}
          <span className="flow-arrow">→</span>{' '}
          <span className="flow-highlight">+4 = 10</span>
        </div>

        <p className="article-para" style={{ marginTop: '0.5rem' }}>
          Skip the initial value and <code>reduce</code> uses <code>nums[0]</code> as the accumulator and
          starts at index 1. On an empty array <em>without</em> an initial value, it throws{' '}
          <code>TypeError</code>. Always pass an initial value unless you have a reason not to.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Building map, filter, reduce from scratch</h3>
        <CodeBlock
          code={`function map(arr, fn) {
  const result = [];
  for (const el of arr) result.push(fn(el));
  return result;
}

function filter(arr, fn) {
  const result = [];
  for (const el of arr) if (fn(el)) result.push(el);
  return result;
}

function reduce(arr, fn, initial) {
  let acc = initial;
  for (const el of arr) acc = fn(acc, el);
  return acc;
}

reduce([1, 2, 3, 4], (a, b) => a + b, 0); // 10`}
          filename="from-scratch.js"
        />

        <h3 className="article-h3">reduce as group-by</h3>
        <CodeBlock
          code={`const orders = [
  { product: "Book",   total: 12 },
  { product: "Pen",    total: 3 },
  { product: "Book",   total: 8 },
  { product: "Pen",    total: 5 },
];

const byProduct = orders.reduce((acc, o) => {
  acc[o.product] = (acc[o.product] || 0) + o.total;
  return acc;
}, {});
// { Book: 20, Pen: 8 }`}
          filename="group-by.js"
        />

        <h3 className="article-h3">A configurable validator (returning functions)</h3>
        <CodeBlock
          code={`function makeValidator(min, max) {
  return (value) => value >= min && value <= max;
}

const ageOK = makeValidator(0, 120);
const pctOK = makeValidator(0, 100);

ageOK(25);  // true
ageOK(200); // false
pctOK(50);  // true`}
          filename="validator.js"
        />

        <h3 className="article-h3">Composition via higher-order functions</h3>
        <CodeBlock
          code={`// compose(f, g)(x) === f(g(x))
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

const addOne = (x) => x + 1;
const double = (x) => x * 2;
const shout  = (x) => x + "!";

const transform = compose(shout, double, addOne);
transform(3); // "8!"  → addOne(3)=4 → double(4)=8 → shout(8)="8!"`}
          filename="compose.js"
        />

        <div className="article-callout">
          <p>
            <code>compose</code> is itself a higher-order function: it takes functions in, returns a
            function out, and the returned function is built from closures over the list of <code>fns</code>.
            This is functional programming in one image &mdash; we go deeper in Week 5.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>Solve each twice &mdash; once with a loop, once with map/filter/reduce:</p>
        </div>

        <CodeBlock
          code={`const products = [
  { name: "Laptop", price: 1200, inStock: true },
  { name: "Mouse",  price: 25,   inStock: false },
  { name: "Keyboard", price: 75, inStock: true },
  { name: "Monitor", price: 300, inStock: true },
];

// 1. Names of all in-stock products
// 2. Total price of in-stock products
// 3. A new array with a 10% discount applied to each price
// 4. The most expensive in-stock product (use reduce)`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then implement</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            A <code>memoize(fn)</code> and a <code>once(fn)</code> using nothing but what you learned
            yesterday and today. Then write <code>pipe(f, g, h)</code> &mdash; the left-to-right version of{' '}
            <code>compose</code>. The test of understanding is building them unprompted.
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a first-class function?</h4>
            <p className="iq-a">
              A language property: functions are treated as values. They can be assigned to variables,
              passed as arguments, returned from functions, and stored in data structures &mdash; just like
              primitives. JavaScript functions are first-class.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is a higher-order function?</h4>
            <p className="iq-a">
              A function that takes one or more functions as arguments, or returns a function (or both).
              Examples: <code>map</code>, <code>filter</code>, <code>memoize</code>, <code>compose</code>.
              Higher-order functions are only possible because the language has first-class functions.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Difference between map and forEach?</h4>
            <p className="iq-a">
              <code>map</code> builds and returns a new array from the callback&rsquo;s return values;
              <code> forEach</code> returns <code>undefined</code> and is for side effects only. Use{' '}
              <code>map</code> to transform, <code>forEach</code> to iterate for effect. Chaining{' '}
              <code>forEach</code> is a code smell &mdash; it returns nothing to chain.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why provide an initial value to reduce?</h4>
            <p className="iq-a">
              Without one, <code>reduce</code> uses the first element as the accumulator and starts at index
              1. That breaks when the array is empty (throws <code>TypeError</code>), and it can produce
              surprising types when the first element isn&rsquo;t the accumulator&rsquo;s intended shape.
              An explicit initial value makes the accumulator&rsquo;s type obvious and safe on empty arrays.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What does this return and why?</h4>
            <CodeBlock
              code={`["1", "2", "3"].map(parseInt);`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>[1, NaN, NaN]</code>. <code>map</code> calls the callback with{' '}
              <code>(value, index, array)</code>. <code>parseInt</code> takes{' '}
              <code>(string, radix)</code>, so it receives <code>parseInt("1", 0)</code>{' '}
              (<code>0</code> = auto-detect &rarr; <code>1</code>), <code>parseInt("2", 1)</code> (radix 1
              is invalid &rarr; <code>NaN</code>), <code>parseInt("3", 2)</code> (<code>"3"</code> is not
              valid binary &rarr; <code>NaN</code>). Fix: <code>.map((s) =&gt; parseInt(s, 10))</code>. This
              is the classic callback-signature trap.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Implement <code>reduce</code>. Why return the accumulator from the callback?</h4>
            <CodeBlock
              code={`function reduce(arr, fn, initial) {
  let acc = initial;
  for (const el of arr) acc = fn(acc, el);
  return acc;
}`}
              filename="a6.js"
            />
            <p className="iq-a">
              The callback <em>must</em> return the next accumulator, because <code>reduce</code> reassigns{' '}
              <code>acc</code> from that return value each iteration. If the callback returns{' '}
              <code>undefined</code> (e.g. you used a block body without a <code>return</code>), the
              accumulator becomes <code>undefined</code> and every subsequent step is corrupted. This is the
              #1 bug people hit writing their first reduce.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Rewrite this loop as a single expression. What changes about readability and performance?</h4>
            <CodeBlock
              code={`let total = 0;
for (const u of users) {
  if (u.active && u.score >= 80) {
    total += u.score;
  }
}`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>{'users.filter((u) => u.active && u.score >= 80).reduce((s, u) => s + u.score, 0)'}</code>{' '}
              &mdash; or, in one pass, <code>{'users.reduce((s, u) => (u.active && u.score >= 80 ? s + u.score : s), 0)'}</code>.
              The chained version is more readable but creates an intermediate array (two passes). The
              single-<code>reduce</code> version is one pass and no intermediate allocation, but bakes the
              filter predicate into the reducer, making it less reusable. The loop is fastest of all. The
              trade-off is readability vs. allocation vs. raw speed &mdash; for most UI code the chained
              version wins; for hot inner loops over large data, the single pass or a plain loop wins.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
