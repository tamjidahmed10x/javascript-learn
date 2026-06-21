import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('prototypes-oop')!
const navItems = weekNav(week)

export default function PrototypesDay3() {
  const { prev, next } = dayNavLinks(week, 3)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[2].title}</h1>
        <p className="lesson-subtitle">
          Four steps, in order. The <code>new</code> keyword is the bridge between Week 2&apos;s{' '}
          <code>this</code> rules and this week&apos;s prototypes.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>constructor function</strong> is an ordinary function that, when called with{' '}
            <code>new</code>, manufactures an object. <code>new</code> performs four steps: create, link, bind{' '}
            <code>this</code>, and (maybe) return.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            <code>new Fn()</code> &rarr; (1) a fresh object is made, (2) its <code>[[Prototype]]</code> is set to{' '}
            <code>Fn.prototype</code>, (3) <code>Fn</code> runs with <code>this</code> = the new object, (4) the new
            object is returned unless <code>Fn</code> returned its own object.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            The pre-<code>class</code> way to build many similar objects sharing methods. Today it is mostly
            historical &mdash; but it is exactly what <code>class</code> compiles down to (Day 4), so it is
            non-negotiable for interviews.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Here is the secret behind every <code>class</code> in JavaScript: there is a function, and{' '}
          <code>new</code> runs it in a special mode. Before we dress it up in <code>class</code> syntax tomorrow,
          let&apos;s see the raw machinery.
        </p>

        <CodeBlock
          code={`function User(name) {
  this.name = name;       // instance property
}
User.prototype.greet = function () {
  return "Hi, " + this.name;
};

const u = new User("Tamjid");
u.name;     // "Tamjid" — set by the constructor on the instance
u.greet();  // "Hi, Tamjid" — found on User.prototype via the chain`}
          filename="constructor.js"
        />

        <p className="article-para">
          Two storage locations, two purposes. Per-instance data goes inside the constructor (assigned to{' '}
          <code>this</code>); shared behavior goes on <code>Fn.prototype</code> (one copy, delegated to by all).
          Get this split right and you understand the entire memory model of JavaScript objects.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Constructor</dt>
            <dd className="def-text">
              A function intended to be invoked with <code>new</code>. By convention its name starts with a capital
              letter &mdash; a hint to humans, meaningless to the engine.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Instance property</dt>
            <dd className="def-text">
              A property set on <code>this</code> inside the constructor. Each object gets its own copy. Good for
              data that differs per object (name, balance, position).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Prototype method</dt>
            <dd className="def-text">
              A function on <code>Fn.prototype</code>. Shared by all instances via delegation &mdash; never copied.
              Good for behavior (methods).
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Factory Line Analogy</h2>
        <p className="article-para">
          <code>new User("Tamjid")</code> is a factory order. The <code>new</code> operator is the floor manager
          who (1) stamps out a blank product, (2) staples a shared manual (<code>User.prototype</code>) to it, (3)
          hands it to the constructor to customize, then (4) ships it. Every product ships with its own data but
          borrows the one shared manual.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏭</span>
            <span className="analogy-label">The line</span>
            <span className="analogy-target">The constructor function</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">The order</span>
            <span className="analogy-target">The <code>new</code> keyword</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧰</span>
            <span className="analogy-label">Custom parts added</span>
            <span className="analogy-target">Instance properties (<code>this.x =</code>)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📖</span>
            <span className="analogy-label">Borrowed manual</span>
            <span className="analogy-target">Prototype methods (shared)</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            This is why a method on the prototype costs <strong>one</strong> function object no matter how many
            instances exist &mdash; a million <code>User</code>s share one <code>greet</code>. Putting{' '}
            <code>greet</code> inside the constructor (<code>this.greet = function...</code>) would create a million
            copies. Day 6 explores when even that matters.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Four Steps of <code>new</code></h2>
        <p className="article-para">
          <code>new</code> is not magic; it is a sequence. Memorize these four steps in order &mdash; every
          <code> new</code>-based interview question is answered by walking through them.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Create a fresh plain object</h4>
            <p className="theory-desc">
              A brand-new empty object is allocated: <code>{'const obj = {}'}</code> conceptually. Nothing is on it
              yet.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Link it to <code>Fn.prototype</code></h4>
            <p className="theory-desc">
              The new object&apos;s <code>[[Prototype]]</code> is set to <code>Fn.prototype</code>. This is the
              delegation link from Day 2 &mdash; the only step that touches the chain.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Run the constructor with <code>this</code> = new object</h4>
            <p className="theory-desc">
              The function executes. Every <code>this.x = ...</code> assigns onto the new object. This is{' '}
              <strong>new binding</strong> &mdash; rule #1 from Week 2 Day 5, the highest-priority <code>this</code>{' '}
              rule.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Return <code>this</code> (unless the constructor returned an object)</h4>
            <p className="theory-desc">
              Normally <code>new</code> returns the new object. <em>But</em> if the constructor explicitly returns a
              non-null object, that object is returned instead. Returning a primitive is ignored.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The return-value trap</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Constructor returns nothing / a primitive</span>
            <p className="phase-desc">
              The <code>this</code> object created in steps 1&ndash;3 is returned. The primitive is discarded.
            </p>
            <ul className="phase-rules">
              <li><code>return 5;</code> &rarr; ignored</li>
              <li><code>return "x";</code> &rarr; ignored</li>
              <li><code>return undefined;</code> &rarr; normal <code>this</code></li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Constructor returns an object</span>
            <p className="phase-desc">
              That returned object replaces <code>this</code>. The linked <code>this</code> is thrown away. A footgun
              &mdash; and a fact interviewers love.
            </p>
            <ul className="phase-rules">
                <li><code>{'return {};'}</code> &rarr; that object wins</li>
              <li><code>return [];</code> &rarr; the array wins</li>
              <li><code>return null;</code> &rarr; null is NOT an object here, ignored</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Notice <code>new</code> binding is the link between the two weeks. Week 2 Day 5 listed the{' '}
            <code>this</code> rules with <code>new</code> at the top. Today you see why: step 3 of <code>new</code>{' '}
            <em>is</em> new binding. Constructors and <code>this</code> are the same mechanism viewed from two
            angles.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Constructors Exist</h2>
        <p className="article-para">
          When Eich was forced to make JavaScript look like Java, &ldquo;classes&rdquo; became constructor
          functions plus prototypes. <code>new Foo()</code> mimicked <code>new Foo()</code> in Java superficially,
          but under the hood there was no class &mdash; just a function, an object, and a link. For twenty years
          this was the only object-creation idiom, until <code>class</code> arrived in ES6 (2015) as friendlier
          syntax over the exact same machinery.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Constructor + prototype</th>
                <th>Factory function</th>
                <th>ES6 <code>class</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Requires <code>new</code>?</td>
                <td>Convention only</td>
                <td>No</td>
                <td>Yes (throws otherwise)</td>
              </tr>
              <tr>
                <td>Shared methods</td>
                <td>On <code>Fn.prototype</code></td>
                <td>Closure (per-instance) or shared obj</td>
                <td>On <code>Class.prototype</code></td>
              </tr>
              <tr>
                <td><code>this</code> if misused</td>
                <td>Pollutes global (sloppy mode)</td>
                <td>Safe</td>
                <td>Throws</td>
              </tr>
              <tr>
                <td>Behind the scenes</td>
                <td>The primitive mechanism</td>
                <td>Just functions</td>
                <td>Sugar over constructors</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing <code>new</code> Step by Step</h2>

        <CodeBlock
          code={`function Counter(start) {     // (constructor)
  this.count = start;          // (3) instance property
}
Counter.prototype.tick = function () {  // shared method
  this.count++;
  return this.count;
};

const c = new Counter(10);     // (order placed)
c.tick(); c.tick();            // 11, 12`}
          filename="trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Create:</strong> <code>new</code> makes an empty object <code>{'{}'}</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>Link:</strong> set <code>obj.[[Prototype]] = Counter.prototype</code>. <code>tick</code> is
              now reachable.
            </span>
          </li>
          <li>
            <span>
              <strong>Run:</strong> <code>Counter</code> executes with <code>this === obj</code> (new binding).{' '}
              <code>this.count = 10</code> sets the instance property.
            </span>
          </li>
          <li>
            <span>
              <strong>Return:</strong> no explicit object returned, so <code>obj</code> (now <code>{'{ count: 10 }'}</code>)
              is returned and assigned to <code>c</code>.
            </span>
          </li>
          <li>
            <span>
              <code>c.tick()</code> misses on <code>c</code>, finds <code>tick</code> on{' '}
              <code>Counter.prototype</code>, runs with <code>this === c</code>, increments <code>c.count</code>.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Forgetting <code>new</code> &mdash; the classic bug</h3>
        <CodeBlock
          code={`function User(name) {
  this.name = name; // WITHOUT new, \`this\` is the global object
}

const u = User("Tamjid"); // forgot \`new\`
console.log(u);           // undefined — nothing returned
console.log(globalThis.name); // "Tamjid" — leaked to global! (sloppy mode)

// 'use strict' makes this throw instead of silently leaking.
// \`class\` constructors ALWAYS throw when called without new.`}
          filename="forgot-new.js"
        />

        <h3 className="article-h3">2. Returning an object hijacks <code>this</code></h3>
        <CodeBlock
          code={`function Weird() {
  this.real = true;
  return { fake: true }; // returning an OBJECT replaces this
}

const w = new Weird();
w.real;  // undefined — the linked this was discarded
w.fake;  // true     — the returned object won`}
          filename="return-object.js"
        />

        <h3 className="article-h3">3. <code>instanceof</code> checks the prototype chain</h3>
        <CodeBlock
          code={`function Animal() {}
const a = new Animal();

a instanceof Animal;                     // true
a instanceof Object;                     // true (chain reaches Object.prototype)
Object.getPrototypeOf(a) === Animal.prototype; // true (what instanceof actually checks)

// instanceof walks the [[Prototype]] chain of a looking for Animal.prototype.`}
          filename="instanceof.js"
        />

        <h3 className="article-h3">4. Methods on prototype vs in constructor</h3>
        <CodeBlock
          code={`// BAD: every instance gets its own copy of greet
function UserA(name) {
  this.name = name;
  this.greet = function () { return "Hi " + this.name; }; // new fn each \`new\`
}

// GOOD: one shared greet, delegated via the chain
function UserB(name) {
  this.name = name;
}
UserB.prototype.greet = function () { return "Hi " + this.name; };

// Memory: 1000 UserA → 1000 greet functions. 1000 UserB → 1 greet function.`}
          filename="method-placement.js"
        />

        <h3 className="article-h3">5. Re-implementing <code>new</code> from scratch</h3>
        <CodeBlock
          code={`function myNew(Constructor, ...args) {
  // 1. Create + 2. Link in one step
  const obj = Object.create(Constructor.prototype);
  // 3. Run the constructor with this = obj
  const result = Constructor.apply(obj, args);
  // 4. Return obj, or the constructor's object if it returned one
  return (result && typeof result === "object") ? result : obj;
}

function Dog(name) { this.name = name; }
Dog.prototype.bark = function () { return "woof"; };

const d = myNew(Dog, "Rex");
d.bark(); // "woof" — prototype linked, this bound correctly`}
          filename="new-from-scratch.js"
        />

        <div className="article-callout">
          <p>
            The check <code>typeof result === &quot;object&quot;</code> covers the return-object rule. Note{' '}
            <code>null</code> is technically <code>typeof &quot;object&quot;</code>, so the <code>result &amp;&amp;</code>{' '}
            guard explicitly excludes it &mdash; returning <code>null</code> from a constructor does <em>not</em>{' '}
            hijack <code>this</code>.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Build a <code>Stack</code> constructor with instance data (<code>items</code>) on <code>this</code> and
            shared methods (<code>push</code>, <code>pop</code>, <code>peek</code>, <code>size</code>) on the
            prototype. Then re-implement <code>new</code> as <code>myNew</code> above and prove your{' '}
            <code>Stack</code> works through it.
          </p>
        </div>

        <CodeBlock
          code={`function Stack() {
  this.items = []; // instance — each Stack has its own
}
Stack.prototype.push = function (x) { this.items.push(x); return this; };
Stack.prototype.pop = function () { return this.items.pop(); };
Stack.prototype.peek = function () { return this.items[this.items.length - 1]; };
Stack.prototype.size = function () { return this.items.length; };

const s = new Stack();
s.push(1).push(2).push(3);
s.peek(); // 3
s.pop();  // 3
s.size(); // 2

// Prove methods are shared, not copied:
const s2 = new Stack();
s2.push === s.push;            // true — same function via prototype
s2.hasOwnProperty("push");     // false — inherited`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            What happens to <code>s.items</code> if you accidentally call <code>Stack()</code> without{' '}
            <code>new</code>? (In sloppy mode, <code>this</code> is global, so you create a global <code>items</code>{' '}
            array and corrupt shared state. In strict mode, it throws. This is exactly why{' '}
            <code>class</code> &mdash; tomorrow &mdash; forces <code>new</code>.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What are the four steps <code>new</code> performs?</h4>
            <p className="iq-a">
              (1) Create a new empty object. (2) Set its <code>[[Prototype]]</code> to the constructor&apos;s{' '}
              <code>prototype</code> property. (3) Call the constructor with <code>this</code> bound to the new
              object (and the provided arguments). (4) Return the new object &mdash; unless the constructor returned
              its own non-null object, in which case return that instead.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Where should methods go &mdash; in the constructor or on the prototype?</h4>
            <p className="iq-a">
              Shared behavior on the prototype (one function reused by all instances via delegation). Per-instance
              data inside the constructor on <code>this</code>. Putting methods in the constructor creates a new
              function object per instance, wasting memory; the prototype shares one.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What happens if you call a constructor without <code>new</code>?</h4>
            <p className="iq-a">
              In sloppy mode, <code>this</code> defaults to the global object, so assignments like{' '}
              <code>this.name = x</code> leak onto <code>globalThis</code> and the call returns <code>undefined</code>.
              In strict mode, <code>this</code> is <code>undefined</code> and it throws. This silent-failure risk is
              why <code>class</code> was designed to throw without <code>new</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. If a constructor returns an object, what does <code>new</code> give back?</h4>
            <p className="iq-a">
              The returned object &mdash; the freshly created, prototype-linked <code>this</code> is discarded.
              Returning a primitive (or <code>undefined</code>, or <code>null</code>) is ignored and{' '}
              <code>this</code> is returned as normal. This is the &ldquo;return hijack&rdquo; footgun.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Output and why?</h4>
            <CodeBlock
              code={`function Maker() {
  this.value = 1;
  return { value: 2 };
}
const m = new Maker();
console.log(m.value);`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>2</code>. The constructor returns an object (<code>{'{ value: 2 }'}</code>), which per step 4 of{' '}
              <code>new</code> replaces the linked <code>this</code>. The prototype link to{' '}
              <code>Maker.prototype</code> is lost &mdash; <code>m</code> is a plain object. Had it returned{' '}
              <code>2</code> (a primitive) or nothing, <code>m.value</code> would be <code>1</code>.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). How does <code>instanceof</code> work?</h4>
            <CodeBlock
              code={`function P() {}
const o = new P();
console.log(o instanceof P, o instanceof Object);`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>true true</code>. <code>instanceof</code> walks the <code>[[Prototype]]</code> chain of the left
              operand looking for <code>RightOperand.prototype</code>. <code>o</code>&apos;s chain is{' '}
              <code>P.prototype</code> &rarr; <code>Object.prototype</code> &rarr; <code>null</code>, so it matches
              both. It is a structural chain check, not a type tag.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Implement <code>new</code> &mdash; including the return rule.</h4>
            <p className="iq-a">
              <code>{'function myNew(Fn, ...args) { const obj = Object.create(Fn.prototype); const r = Fn.apply(obj, args); return (r !== null && typeof r === "object") ? r : obj; }'}</code>{' '}
              <code>Object.create(Fn.prototype)</code> does steps 1&ndash;2. <code>Fn.apply(obj, args)</code> does
              step 3 (new binding via <code>apply</code>). The final ternary implements step 4, carefully treating{' '}
              <code>null</code> as &ldquo;not an object to return.&rdquo; A robust version also handles functions
              that shouldn&apos;t be called as constructors and respects <code>Symbol.species</code> in subclasses.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
