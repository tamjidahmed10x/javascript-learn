import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('closures-functions')!
const navItems = weekNav(week)

export default function ClosuresDay5() {
  const { prev, next } = dayNavLinks(week, 5)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[4].title}</h1>
        <p className="lesson-subtitle">
          Four rules, applied in priority order. The single source of every &ldquo;wrong{' '}
          <code>this</code>&rdquo; bug.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <code>this</code> is a special binding available inside functions. Its value is decided by{' '}
            <strong>how the function is called</strong> (the call site), not where it is defined.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Four rules in priority order: <strong>new</strong> &rarr; <strong>explicit</strong> (call/apply/bind)
            &rarr; <strong>implicit</strong> (<code>obj.method()</code>) &rarr; <strong>default</strong>. Arrow
            functions sit outside the rules entirely &mdash; they inherit <code>this</code> lexically.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Every time you write a method or a callback. Get the rules wrong and <code>this</code> becomes{' '}
            <code>undefined</code>, <code>window</code>, or the wrong object &mdash; the #1 source of
            &ldquo;why is this undefined?&rdquo; bugs.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Here is the whole lesson in one sentence: <strong><code>this</code> is not the object the function
          belongs to. It is the object the function was called <em>on</em>.</strong> Read that twice. Most
          bugs come from assuming the first when the truth is the second.
        </p>

        <CodeBlock
          code={`const user = {
  name: "Tamjid",
  greet() { console.log(this.name); },
};

user.greet();            // "Tamjid" — called on user → this = user
const fn = user.greet;
fn();                    // undefined — called on nothing → default binding`}
          filename="core-idea.js"
        />

        <p className="article-para">
          The function <code>greet</code> never changed. It was <em>called</em> differently. That call-site
          difference is everything. Today we learn the four rules that decide what{' '}
          <code>this</code> is, and the priority order that resolves conflicts.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Call Site</dt>
            <dd className="def-text">
              The place in code where a function is actually invoked. <code>this</code> is determined by the
              call site, not the definition site.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Binding</dt>
            <dd className="def-text">
              The act of assigning a value to <code>this</code> for the duration of a function call.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── The Four Rules ────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Four Rules</h2>

        <h3 className="article-h3">Rule 1 &mdash; Default Binding</h3>
        <p className="article-para">
          A plain, standalone function call with no object in front of it. <code>this</code> defaults to the
          global object (<code>globalThis</code>) in sloppy mode, or <code>undefined</code> in strict mode.
        </p>
        <CodeBlock
          code={`function whoami() { console.log(this); }

whoami(); // non-strict: window/global
          // strict mode: undefined

// "use strict" at the top of a module makes this undefined.
// ES modules are strict by default — so in modern JS, default
// binding usually gives you undefined.`}
          filename="default.js"
        />

        <h3 className="article-h3">Rule 2 &mdash; Implicit Binding</h3>
        <p className="article-para">
          When a function is called as a property of an object &mdash; <code>obj.method()</code> &mdash; that
          object becomes <code>this</code>. Only the <em>last</em> object in the chain before the call
          matters.
        </p>
        <CodeBlock
          code={`const user = {
  name: "Tamjid",
  greet() { console.log(this.name); },
};

user.greet(); // "Tamjid" — the object before the dot

// Only the immediate owner counts:
const wrapper = { user, name: "Wrapper" };
wrapper.user.greet(); // "Tamjid" — user, not wrapper

// Implicit binding is LOST the moment you detach the function:
const fn = user.greet;
fn(); // undefined — no object before the dot anymore`}
          filename="implicit.js"
        />

        <div className="article-callout">
          <p>
            Implicit binding is fragile. Assigning a method to a variable, passing it as a callback, or
            destructuring it <strong>detaches</strong> it from its object. That&rsquo;s why{' '}
            <code>setTimeout(obj.method, 0)</code> loses <code>this</code> &mdash; you passed the function,
            not the call.
          </p>
        </div>

        <h3 className="article-h3">Rule 3 &mdash; Explicit Binding</h3>
        <p className="article-para">
          You force <code>this</code> yourself using <code>call</code>, <code>apply</code>, or{' '}
          <code>bind</code> (Day 4). No object-before-the-dot needed; you state the binding directly.
        </p>
        <CodeBlock
          code={`function greet() { console.log(this.name); }
const user = { name: "Tamjid" };

greet.call(user);          // "Tamjid" — explicit
greet.apply(user);         // "Tamjid"
const bound = greet.bind(user);
bound();                   // "Tamjid"

// Hard binding (bind) can't be overridden — it wins over implicit.`}
          filename="explicit.js"
        />

        <h3 className="article-h3">Rule 4 &mdash; <code>new</code> Binding</h3>
        <p className="article-para">
          Calling a function with <code>new</code> creates a brand-new object and makes it{' '}
          <code>this</code> for that call. This is how constructors work &mdash; Week 3 covers it in depth.
        </p>
        <CodeBlock
          code={`function User(name) {
  // \`new\` does four things:
  // 1. creates a new object
  // 2. sets it as \`this\`
  // 3. runs the function body
  // 4. returns it (unless the function returns its own object)
  this.name = name;
}

const u = new User("Tamjid");
u.name; // "Tamjid"
// \`this\` was the fresh object created by \`new\`.`}
          filename="new.js"
        />
      </section>

      {/* ── Priority ──────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Priority &mdash; Which Rule Wins?</h2>
        <p className="article-para">
          When two rules could apply, the engine uses this fixed priority order:
        </p>

        <div className="concept-flow">
          <span className="flow-highlight">new</span>{' '}
          <span className="flow-arrow">&gt;</span>{' '}
          <span className="flow-highlight">explicit</span>{' '}
          <span className="flow-arrow">&gt;</span>{' '}
          <span className="flow-highlight">implicit</span>{' '}
          <span className="flow-arrow">&gt;</span>{' '}
          <span className="flow-highlight">default</span>
        </div>

        <div className="theory-list" style={{ marginTop: '1rem' }}>
          <div className="theory-item">
            <h4 className="theory-title">1. new (highest)</h4>
            <p className="theory-desc"><code>new</code> always creates a fresh <code>this</code>. Beats even hard binding.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Explicit (call / apply / bind)</h4>
            <p className="theory-desc">Hard binding via <code>bind</code> is sticky &mdash; can&rsquo;t be overridden by call/apply.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Implicit (obj.method())</h4>
            <p className="theory-desc">Beaten by any explicit or <code>new</code> call.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Default (lowest)</h4>
            <p className="theory-desc">Kicks in only when nothing else applies. <code>undefined</code> in strict mode.</p>
          </div>
        </div>

        <CodeBlock
          code={`function f() { console.log(this.name); }

// default
f(); // undefined (strict mode)

// implicit
const o = { name: "implicit", f };
o.f(); // "implicit"

// explicit beats implicit
const p = { name: "explicit" };
o.f.call(p); // "explicit"

// new beats explicit (including hard bind)
const Bound = f.bind({ name: "bound" });
new Bound(); // undefined — new wins, \`this\` is a fresh {} with no name`}
          filename="priority.js"
        />
      </section>

      {/* ── Arrow Functions & Lexical this ────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Arrow Functions: Outside the Rules</h2>
        <p className="article-para">
          Arrow functions (<code>{'() => {}'}</code>) do <strong>not</strong> have their own{' '}
          <code>this</code>. They are not subject to any of the four rules. Instead, they inherit{' '}
          <code>this</code> from the surrounding lexical scope &mdash; the enclosing function or module. This
          is called <strong>lexical this</strong>.
        </p>

        <CodeBlock
          code={`const user = {
  name: "Tamjid",
  friends: ["Rafi", "Sara"],
  // Regular method: \`this\` is user (implicit binding)
  greetEach() {
    this.friends.forEach(function (friend) {
      // Regular callback: \`this\` is LOST (default binding → undefined)
      console.log(this.name + " greets " + friend); // breaks
    });
  },
  greetEachArrow() {
    this.friends.forEach((friend) => {
      // Arrow: inherits \`this\` from greetEachArrow → user
      console.log(this.name + " greets " + friend); // works!
    });
  },
};`}
          filename="arrow-lexical.js"
        />

        <p className="article-para">
          The classic pre-arrow solution was the <code>var self = this</code> hack &mdash; capturing{' '}
          <code>this</code> into a closure variable so inner callbacks could read it. Arrows made that
          obsolete by closing over <code>this</code> lexically, automatically.
        </p>

        <CodeBlock
          code={`// The old way (pre-ES6):
greetEach() {
  const self = this; // capture \`this\` into a normal variable
  this.friends.forEach(function (friend) {
    console.log(self.name + " greets " + friend); // self is closure, not this
  });
}

// Arrows do exactly this, but built in — no manual capture needed.`}
          filename="self-this.js"
        />

        <div className="article-callout">
          <p>
            You <strong>cannot</strong> rebind an arrow&rsquo;s <code>this</code>. <code>call</code>,{' '}
            <code>apply</code>, <code>bind</code>, and <code>new</code> all have no effect on an arrow&rsquo;s{' '}
            <code>this</code> (and <code>new</code> on an arrow throws). Arrows are the one case where the
            four-rule priority list does not apply. Day 6 dives deeper.
          </p>
        </div>
      </section>

      {/* ── Comparison ────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Rules Compared</h2>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Rule</th>
                <th>Trigger</th>
                <th>this is&hellip;</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>new</td>
                <td><code>new Fn()</code></td>
                <td>fresh object</td>
                <td>1 (highest)</td>
              </tr>
              <tr>
                <td>Explicit</td>
                <td><code>call/apply/bind</code></td>
                <td>given argument</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Implicit</td>
                <td><code>obj.method()</code></td>
                <td>obj</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Default</td>
                <td><code>fn()</code> bare</td>
                <td>global / undefined</td>
                <td>4 (lowest)</td>
              </tr>
              <tr>
                <td>Arrow</td>
                <td><code>{'() => {}'}</code></td>
                <td>lexical (outer scope)</td>
                <td>n/a &mdash; immune</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Determining <code>this</code></h2>
        <p className="article-para">
          When you see a function call, run this checklist top-to-bottom. The first match wins.
        </p>

        <ol className="article-steps">
          <li>
            <span>Is it an <strong>arrow</strong> function? &rarr; <code>this</code> is whatever it was in
            the enclosing scope. Stop.</span>
          </li>
          <li>
            <span>Was it called with <strong>new</strong>? &rarr; <code>this</code> is a brand-new empty
            object. Stop.</span>
          </li>
          <li>
            <span>Is there a <strong>call/apply/bind</strong>? &rarr; <code>this</code> is the explicitly
            given object. Stop.</span>
          </li>
          <li>
            <span>Is there an <strong>object before the dot</strong> (<code>obj.fn()</code>)? &rarr;{' '}
            <code>this</code> is that object. Stop.</span>
          </li>
          <li>
            <span>Otherwise &rarr; <strong>default</strong>: <code>undefined</code> (strict) or{' '}
            <code>globalThis</code> (sloppy).</span>
          </li>
        </ol>

        <div className="article-callout">
          <p>
            Step 1 first is the trap most people miss. If a function is an arrow, <em>none</em> of the other
            steps matter &mdash; arrows ignore the call site entirely.
          </p>
        </div>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Strict vs sloppy default</h3>
        <CodeBlock
          code={`"use strict";
function f() { return this; }
f(); // undefined

// same function without "use strict":
function g() { return this; }
g(); // globalThis (window / global)`}
          filename="strict.js"
        />

        <h3 className="article-h3">Detaching loses <code>this</code></h3>
        <CodeBlock
          code={`const obj = {
  v: 42,
  get() { return this.v; },
};

obj.get();           // 42 — implicit
const detached = obj.get;
detached();          // undefined — default binding
[obj.get][0]();      // 42 — the array element IS the object before the dot`}
          filename="detach.js"
        />

        <h3 className="article-h3">Arrow inside a method</h3>
        <CodeBlock
          code={`function Timer() {
  this.seconds = 0;
  setInterval(() => {
    // arrow inherits \`this\` from Timer constructor call
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}
new Timer(); // 1, 2, 3, ... — \`this\` stays the instance`}
          filename="timer-arrow.js"
        />

        <h3 className="article-h3">Arrow as object method &mdash; a common mistake</h3>
        <CodeBlock
          code={`const obj = {
  name: "Tamjid",
  greet: () => console.log(this.name),
};

obj.greet(); // undefined
// The arrow does NOT get obj as \`this\`.
// It inherits from the enclosing scope (module/global), where
// \`this\` is undefined (ESM) or globalThis.
// Arrow methods on object literals are almost always a bug.`}
          filename="arrow-method-bug.js"
        />
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>For each snippet, predict <code>this</code> before running. Then verify.</p>
        </div>

        <CodeBlock
          code={`// 1. What is \`this\` inside each callback?
const o = {
  x: 1,
  m() { return this.x; },
  arrow: () => this.x,
};

o.m();        // ?
o.arrow();    // ?

// 2. Fix the broken callback without arrows (use bind):
class Counter {
  constructor() { this.n = 0; }
  start() {
    setInterval(function () { this.n++; }, 1000); // broken
  }
}

// 3. What is \`this\` in a top-level arrow function in an ES module?`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Self-check</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            State from memory the four rules <em>and their priority order</em>. Then explain why an arrow
            function as an object-literal method is usually a bug, while an arrow as a callback inside a
            method is usually correct. If you can&rsquo;t, reread the &ldquo;Flow&rdquo; section.
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. How is <code>this</code> determined in JavaScript?</h4>
            <p className="iq-a">
              By the call site &mdash; how and where the function is invoked &mdash; not where it&rsquo;s
              defined. Four rules apply in priority order: new binding, explicit binding (call/apply/bind),
              implicit binding (obj.method()), and default binding.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is the difference between <code>this</code> in an arrow function vs a regular function?</h4>
            <p className="iq-a">
              Regular functions get their own <code>this</code> from the call site (the four rules). Arrow
              functions have no <code>this</code> of their own &mdash; they inherit it lexically from the
              enclosing scope. You cannot rebind an arrow&rsquo;s <code>this</code> with call/apply/bind.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why does <code>this</code> change when you assign a method to a variable?</h4>
            <p className="iq-a">
              Because <code>this</code> depends on the call site. <code>obj.method()</code> is implicit
              binding (<code>this</code> = obj). Assigning <code>const fn = obj.method</code> detaches the
              function; calling <code>fn()</code> is now a bare call &rarr; default binding, so{' '}
              <code>this</code> is lost (undefined in strict mode).
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What&rsquo;s the priority order of the four binding rules?</h4>
            <p className="iq-a">
              new &gt; explicit (call/apply/bind) &gt; implicit (obj.fn()) &gt; default. Arrow functions are
              outside this list entirely &mdash; they inherit <code>this</code> lexically and ignore all four
              rules.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Output of each, and why?</h4>
            <CodeBlock
              code={`var length = 10;
function fn() { console.log(this.length); }

const obj = { length: 5, method: fn };

obj.method();        // ?
const detached = obj.method;
detached();          // ?
[1, 2].map(obj.method); // ?`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>5</code>, then <code>10</code>, then <code>10</code>. (1) <code>obj.method()</code> is
              implicit binding &rarr; <code>this</code> is <code>obj</code> &rarr; length 5. (2){' '}
              <code>detached()</code> is a bare call &rarr; default binding &rarr; <code>this</code> is{' '}
              <code>globalThis</code>, where the <code>var length = 10</code> lives. (3) <code>map</code>{' '}
              passes the array as the <em>third argument</em> to the callback, not as <code>this</code>{' '}
              &mdash; without a <code>thisArg</code>, the callback&rsquo;s <code>this</code> is{' '}
              <code>globalThis</code> (sloppy) &rarr; length 10. Note: <code>let</code>/<code>const</code>{' '}
              wouldn&rsquo;t attach to global, so cases 2 and 3 would log <code>undefined</code> instead.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why is this constructor&rsquo;s timer buggy, and how do arrows fix it?</h4>
            <CodeBlock
              code={`function Counter() {
  this.count = 0;
  setInterval(function () {
    this.count++;
  }, 1000);
}`}
              filename="q6.js"
            />
            <p className="iq-a">
              The <code>function</code> callback is default-bound: inside it, <code>this</code> is{' '}
              <code>globalThis</code> (or <code>undefined</code> in strict mode), not the Counter instance. So{' '}
              <code>this.count++</code> writes to a global (or throws). Switching to an arrow &mdash;{' '}
              <code>{'() => { this.count++ }'}</code> &mdash; makes it inherit <code>this</code> lexically from
              the constructor call, where <code>this</code> is the instance. Same reason{' '}
              <code>var self = this</code> + <code>self.count++</code> worked pre-ES6.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Trace <code>this</code> through this nested call.</h4>
            <CodeBlock
              code={`const obj = {
  x: 10,
  get() { return this.x; },
  outer() {
    const inner = this.get;
    return inner();
  },
};
obj.outer();`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>undefined</code> (or throws in strict mode). Step by step: <code>obj.outer()</code> is
              implicit &rarr; <code>this</code> inside <code>outer</code> is <code>obj</code>. Then{' '}
              <code>this.get</code> reads the function <em>detached</em> &mdash; it&rsquo;s just a reference
              now.               <code>inner()</code> is a bare call (no object before the dot) &rarr; default binding &rarr;{' '}
              <code>this</code> is <code>undefined</code> (strict) / <code>globalThis</code> (sloppy).
              So <code>this.x</code> is <code>undefined</code> or a global lookup. The fix: call{' '}
              <code>this.get()</code> directly to keep implicit binding, or use <code>inner.call(this)</code>.
              This is the detachment bug hiding one layer deeper.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
