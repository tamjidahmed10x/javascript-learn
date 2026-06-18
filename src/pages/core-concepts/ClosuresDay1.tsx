import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('closures-functions')!
const navItems = weekNav(week)

export default function ClosuresDay1() {
  const { next } = dayNavLinks(week, 1)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[0].title}</h1>
        <p className="lesson-subtitle">
          The single concept that separates people who &ldquo;know JavaScript&rdquo; from people who
          understand it.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>closure</strong> is a function bundled together with the lexical environment it
            was created in. It is the function <em>plus</em> the variables it remembers.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Every function captures a reference to its surrounding <strong>lexical environment</strong>
            (its variable bindings + a link to the outer scope). That reference travels with the
            function, even after the outer scope has finished running.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            A closure is formed the moment a function is <strong>created</strong> &mdash; not when it is
            returned, not when it is called. Every function in JavaScript is a closure.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          You already wrote a closure today without noticing. Here it is:
        </p>

        <CodeBlock
          code={`function greet(name) {
  const message = "Hello, " + name;
  return message;
}

greet("Tamjid"); // "Hello, Tamjid"`}
          filename="not-magic.js"
        />

        <p className="article-para">
          The word <code>message</code> lives <em>inside</em> <code>greet</code>. When <code>greet</code>{' '}
          runs, it finds <code>message</code> in its own environment. That is a closure doing its most
          ordinary job: letting a function reach the variables defined around it.
        </p>
        <p className="article-para">
          The interesting part comes when a function <strong>survives</strong> the scope it was born in.
          Watch this:
        </p>

        <CodeBlock
          code={`function makeGreeting(name) {
  const message = "Hello, " + name;
  return function () {
    console.log(message);
  };
}

const greet = makeGreeting("Tamjid");
greet(); // "Hello, Tamjid"`}
          filename="first-closure.js"
        />

        <p className="article-para">
          <code>makeGreeting</code> has finished. Its execution context is gone. By every rule you
          learned in Week 1, <code>message</code> should be destroyed. Yet the inner function still
          prints it. That is a closure. <code>message</code> did not die because the inner function is{' '}
          <strong>holding on to it</strong>.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Closure</dt>
            <dd className="def-text">
              The combination of a function and the lexical environment in which it was declared. The
              function &ldquo;closes over&rdquo; the variables of that environment.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Lexical Environment</dt>
            <dd className="def-text">
              A data structure the engine creates to hold variable bindings for the current scope, plus a
              reference (the <code>[[Parent]]</code> / outer link) to the surrounding environment. Together,
              these links form the scope chain.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Environment Record</dt>
            <dd className="def-text">
              The part of a lexical environment that actually stores the name &rarr; value mappings
              (e.g. <code>name &rarr; "Tamjid"</code>).
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Backpack Analogy</h2>
        <p className="article-para">
          Imagine a function is a traveler. Before it leaves home to go work somewhere else, it packs a{' '}
          <strong>backpack</strong>. Inside the backpack: every variable from its home scope that it might
          need.
        </p>
        <p className="article-para">
          The traveler can move to a new city (be returned, passed around, stored in a variable). The
          original home might be demolished (the outer function returns, its execution context is
          destroyed). None of that matters. The traveler still has the backpack.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🎒</span>
            <span className="analogy-label">The backpack</span>
            <span className="analogy-target">Closure</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏠</span>
            <span className="analogy-label">Home it left</span>
            <span className="analogy-target">Lexical Environment</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📦</span>
            <span className="analogy-label">Items in the bag</span>
            <span className="analogy-target">Captured Variables</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧭</span>
            <span className="analogy-label">Where it can reach next</span>
            <span className="analogy-target">Scope Chain</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            A closure does <strong>not</strong> copy the values of variables. It holds a{' '}
            <strong>reference</strong> to the environment. If the original variable changes later, the
            closure sees the new value.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          To understand closures precisely, you need one mental model: <strong>every function carries a
          hidden link to the lexical environment where it was created.</strong> That link is stored on
          the function in an internal slot called <code>[[Environment]]</code>.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Lexical means &ldquo;where it is written&rdquo;</h4>
            <p className="theory-desc">
              Scope is decided by the source code&rsquo;s structure &mdash; where the function is physically
              nested &mdash; not by where the function is called from.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. The environment is captured at creation</h4>
            <p className="theory-desc">
              When the engine creates a function object, it stamps it with a reference to the current
              lexical environment. That stamp <em>is</em> the closure.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Lookups walk the chain</h4>
            <p className="theory-desc">
              When the function runs and needs a variable, it checks its own environment record first.
              Not found? Follow the outer link. Repeat up to global. Stop at the first match.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. A variable lives as long as something references it</h4>
            <p className="theory-desc">
              An outer scope&rsquo;s variables are normally cleaned up (garbage collected) when the scope
              ends. A closure keeps them alive by holding a reference to the environment.
            </p>
          </div>
        </div>

        <h3 className="article-h3">When is a closure actually created?</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">The Common Myth</span>
            <p className="phase-desc">
              &ldquo;A closure is created when you return an inner function.&rdquo;
            </p>
            <ul className="phase-rules">
              <li>Wrong</li>
              <li>Inner functions always form closures</li>
              <li>Return is irrelevant</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">The Truth</span>
            <p className="phase-desc">
              A closure is created when the function object is created &mdash; the instant the function
              declaration runs.
            </p>
            <ul className="phase-rules">
              <li>Every function is a closure</li>
              <li>Even unused inner functions close over scope</li>
              <li>Return only makes it <em>visible</em></li>
            </ul>
          </div>
        </div>

        <CodeBlock
          code={`function outer() {
  let secret = "captured";
  function inner() {
    // closure formed right here, when this line is reached
    console.log(secret);
  }
  inner(); // works — no return needed
}
outer(); // "captured"`}
          filename="no-return-needed.js"
        />

        <p className="article-para">
          The reason we associate closures with <em>returning</em> functions is simple: that is the only
          time the closure becomes <strong>observable</strong>. As long as <code>inner</code> lives inside{' '}
          <code>outer</code>, the environment is alive anyway. It is only when <code>inner</code>{' '}
          escapes &mdash; is returned, stored, passed as a callback &mdash; that the environment would{' '}
          <em>normally</em> die, and the closure proves it did not.
        </p>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Closures Exist</h2>
        <p className="article-para">
          Closures were part of JavaScript from the very first version (1995). They were not a feature
          the designers had to add &mdash; they fell out of a simpler design decision: functions are
          values, and scope is lexical. Once you have those two things, closures are automatic.
        </p>
        <p className="article-para">
          For the first 20 years of JavaScript, closures were the <strong>only</strong> way to get data
          privacy. Before <code>class</code> private fields (<code>#</code>), before modules, developers
          used the <em>module pattern</em>: an outer function holding private variables, returning an
          object of methods that closed over them. Closures were the language&rsquo;s encapsulation
          primitive.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>JavaScript</th>
                <th>Python</th>
                <th>Java</th>
                <th>Go</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Closures</td>
                <td>Automatic, everywhere</td>
                <td>Yes (closures)</td>
                <td>Lambdas (capture effectively-final)</td>
                <td>Yes (function literals)</td>
              </tr>
              <tr>
                <td>Capture by</td>
                <td>Reference (live)</td>
                <td>Reference (late binding)</td>
                <td>Value (snapshot)</td>
                <td>Reference</td>
              </tr>
              <tr>
                <td>Mutation of captured var</td>
                <td>Allowed</td>
                <td><code>nonlocal</code> needed</td>
                <td>Disallowed</td>
                <td>Allowed</td>
              </tr>
              <tr>
                <td>Privacy via closure</td>
                <td>Idiomatic (module pattern)</td>
                <td>Rare</td>
                <td>No</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            Java captures by value and bans mutation &mdash; that is why Java lambdas can only use{' '}
            &ldquo;effectively final&rdquo; variables. JavaScript captures the environment by reference, so
            you can mutate captured variables freely. That power is exactly what makes the loop problem
            (Day 6) possible.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Step by Step</h2>

        <CodeBlock
          code={`function makeCounter() {
  let count = 0;                    // (1)
  return function () {              // (2)
    count = count + 1;              // (4)
    return count;
  };
}

const counter = makeCounter();      // (3)
counter(); // 1
counter(); // 2`}
          filename="counter.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              Call <code>makeCounter()</code> &rarr; a fresh lexical environment <code>E1</code> is
              created with binding <code>count &rarr; 0</code>.
            </span>
          </li>
          <li>
            <span>
              The inner function is created. Its <code>[[Environment]]</code> slot is stamped with{' '}
              <code>E1</code>. <strong>The closure now exists.</strong>
            </span>
          </li>
          <li>
            <span>
              The inner function is returned and assigned to <code>counter</code>.{' '}
              <code>makeCounter</code>&rsquo;s execution context is popped &mdash; but <code>E1</code>{' '}
              survives because the returned function still references it.
            </span>
          </li>
          <li>
            <span>
              <code>counter()</code> runs. It needs <code>count</code>. Not in its own record &rarr;
              follow the outer link to <code>E1</code> &rarr; found. Increment. <code>E1</code>&rsquo;s{' '}
              <code>count</code> becomes <code>1</code>.
            </span>
          </li>
          <li>
            <span>
              Next <code>counter()</code> does the same lookup. Same <code>E1</code>, same{' '}
              <code>count</code> &mdash; now <code>2</code>. The environment persists between calls.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Each call creates a fresh environment</h3>
        <CodeBlock
          code={`function makeCounter() {
  let count = 0;
  return () => ++count;
}

const a = makeCounter();
const b = makeCounter();

a(); a(); a(); // 3
b();           // 1  — b has its OWN count

// Two calls → two environments → two separate counts.`}
          filename="independent.js"
        />

        <h3 className="article-h3">2. Captured by reference, not by value</h3>
        <CodeBlock
          code={`function makeTracker() {
  let value = 10;
  const get = () => value;       // reads live value
  const set = (v) => { value = v; };
  return { get, set };
}

const t = makeTracker();
t.get();   // 10
t.set(99);
t.get();   // 99 — the closure saw the change`}
          filename="by-reference.js"
        />

        <h3 className="article-h3">3. Private state (encapsulation)</h3>
        <p className="article-para">
          From outside, there is no way to touch <code>balance</code> directly. Only the returned methods
          can. This is data hiding with nothing but closures.
        </p>
        <CodeBlock
          code={`function createBankAccount(initial) {
  let balance = initial;  // private — not accessible outside

  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
    },
    getBalance() { return balance; },
  };
}

const acc = createBankAccount(100);
acc.balance;        // undefined — not exposed
acc.deposit(50);
acc.getBalance();   // 150`}
          filename="private-state.js"
        />

        <h3 className="article-h3">4. Closures capture the variable, not the value at a moment</h3>
        <CodeBlock
          code={`let name = "Tamjid";
function sayHi() {
  console.log("Hi, " + name); // reads CURRENT value of name
}
name = "Rafi";
sayHi(); // "Hi, Rafi" — not "Hi, Tamjid"`}
          filename="live-binding.js"
        />

        <h3 className="article-h3">5. The loop teaser (full breakdown on Day 6)</h3>
        <CodeBlock
          code={`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs 3, 3, 3

// var is function-scoped → ONE shared i.
// All three closures capture the SAME variable.
// By the time they run, the loop is done and i === 3.`}
          filename="loop-teaser.js"
        />

        <div className="article-callout">
          <p>
            Fix it today by changing <code>var</code> to <code>let</code>. <code>let</code> is
            block-scoped, so <strong>each iteration gets its own fresh binding</strong> &mdash; three
            separate closures capturing three separate <code>i</code>s. We unpack this fully in Day 6.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Build a <code>createCounter(start, step)</code> where each call to the returned function adds{' '}
            <code>step</code> and returns the new value. Then build two independent counters from the
            same factory and prove they don&rsquo;t share state.
          </p>
        </div>

        <CodeBlock
          code={`function createCounter(start, step) {
  let current = start;
  return function () {
    current += step;
    return current;
  };
}

const up = createCounter(0, 2);   // 2, 4, 6, ...
const down = createCounter(100, -10); // 90, 80, 70, ...

up(); up(); up();   // 2, 4, 6
down();            // 90
up();              // 8 — still going from where it left off`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            If you called <code>createCounter</code> ten times, how many separate <code>current</code>{' '}
            variables exist in memory? (Answer: ten. One environment per call, each kept alive by its own
            returned function.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a closure?</h4>
            <p className="iq-a">
              A function bundled with the lexical environment it was created in. The function retains
              access to variables from that environment even after the outer scope has finished executing.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. When is a closure created &mdash; when the function is returned?</h4>
            <p className="iq-a">
              No. A closure is created the moment the function object is created, because every function
              stores a reference to its current lexical environment in its <code>[[Environment]]</code>{' '}
              slot. Returning the function only makes the closure observable; it doesn&rsquo;t create it.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is a lexical environment?</h4>
            <p className="iq-a">
              A structure holding an environment record (the variable bindings of the current scope) plus a
              reference to the outer environment. Lexical environments are linked together to form the
              scope chain that variable lookups walk.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Does a closure capture a value or a reference?</h4>
            <p className="iq-a">
              A reference. The closure captures the <em>environment</em>, so it sees the live, current
              value of variables. If a captured variable is mutated later, the closure observes the new
              value.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q5. Why don&rsquo;t captured variables get garbage collected?</h4>
            <p className="iq-a">
              Garbage collection reclaims memory that is no longer reachable. As long as the closure is
              reachable, it holds a reference to its lexical environment, which keeps that environment (and
              its variables) reachable &mdash; so they survive.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What does this log and why?</h4>
            <CodeBlock
              code={`function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2));   // ?
console.log(add10(2));  // ?`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>7</code> then <code>12</code>. Each <code>makeAdder</code> call creates its own
              environment (<code>x=5</code> and <code>x=10</code>). <code>add5</code> closes over the
              first, <code>add10</code> over the second. They are independent closures &mdash; this is
              partial application, covered in Day 2.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q7 (Medium). Predict the output.</h4>
            <CodeBlock
              code={`for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>0, 1, 2</code>. <code>let</code> is block-scoped, so each loop iteration creates a
              fresh binding of <code>i</code>. Each callback closes over its <em>own</em> <code>i</code>.
              Contrast with <code>var</code> (Day 6 teaser), which shares one binding and prints{' '}
              <code>3, 3, 3</code>.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hard). Will the 100MB array leak? Explain.</h4>
            <CodeBlock
              code={`function setup() {
  const huge = new Array(1e8).fill(0); // ~100MB
  const index = 42;

  return function getByIndex() {
    return huge[index];
  };
}

const get = setup();`}
              filename="q8.js"
            />
            <p className="iq-a">
              Yes &mdash; it is kept alive. <code>getByIndex</code> closes over <code>setup</code>&rsquo;s
              environment, which contains <code>huge</code>. Even though <code>getByIndex</code> only needs{' '}
              <code>index</code>, engines historically retained the <em>entire</em> environment record, so{' '}
              <code>huge</code> stays reachable and is never collected while <code>get</code> exists. Modern
              engines can sometimes optimize escape-analyzed variables, but you should not rely on it: do
              not capture large objects in long-lived closures unless you mean to. This is the closure-based
              memory leak we revisit in Week 6.
            </p>
          </div>
        </div>
      </section>

      <DayNav next={next} />
    </ContentLayout>
  )
}
