import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('prototypes-oop')!
const navItems = weekNav(week)

export default function PrototypesDay7() {
  const { prev } = dayNavLinks(week, 7)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[6].title}</h1>
        <p className="lesson-subtitle">
          One week, condensed. Then ten prototype puzzles that separate &ldquo;I&apos;ve used a class&rdquo; from
          &ldquo;I understand the chain.&rdquo;
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A compressed review of the whole week &mdash; the prototype chain, <code>__proto__</code> vs{' '}
            <code>prototype</code>, constructors and <code>new</code>, ES6 classes, inheritance and{' '}
            <code>super</code>, and composition over inheritance &mdash; followed by hard problems and a
            self-assessment.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Read the cheat sheet, then attempt each problem cold. Commit to an answer in writing before checking.
            Wrong answers are the valuable ones &mdash; trace exactly which step you misread.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            End of Week 3. This is your checkpoint: if you can solve 7 of 10 cold, you&apos;re ready for Week 4
            (Asynchronous JavaScript).
          </p>
        </div>
      </div>

      {/* ── Cheat Sheet ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Week 3 Cheat Sheet</h2>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">Prototype chain</h4>
            <p className="theory-desc">Every object has a <code>[[Prototype]]</code> link. Property reads walk the chain until found or <code>null</code>. Writes usually create an own property (shadow), not a chain walk.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>__proto__</code> vs <code>prototype</code></h4>
            <p className="theory-desc"><code>obj.__proto__</code> = this object&apos;s link (on all objects). <code>fn.prototype</code> = the template instances will link to (on functions). Prefer <code>Object.getPrototypeOf</code> / <code>Object.create</code>.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>new</code> in four steps</h4>
            <p className="theory-desc">(1) Create object, (2) link to <code>fn.prototype</code>, (3) run constructor with <code>this</code> = new object (new binding), (4) return <code>this</code> unless constructor returned a non-null object.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">ES6 <code>class</code></h4>
            <p className="theory-desc">Sugar over constructor + prototype. <code>typeof Class === &quot;function&quot;</code>. Requires <code>new</code>, always strict, not hoisted (TDZ). Methods non-enumerable on the prototype.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title"><code>extends</code> &amp; <code>super</code></h4>
            <p className="theory-desc"><code>extends</code> sets <em>two</em> links (prototype + static). <code>super()</code> required before <code>this</code> in a subclass. <code>super.m()</code> looks up one level but keeps current <code>this</code>.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Composition &gt; inheritance</h4>
            <p className="theory-desc">Use inheritance only for true is-a (Liskov). Mixins copy methods (<code>Object.assign</code>); composition delegates to held objects. Favor composition to avoid the fragile base class.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">The unifying fact</h4>
            <p className="theory-desc">A <code>class</code> <em>is</em> a function; instances inherit via the <em>same</em> <code>[[Prototype]]</code> chain as plain objects. There are no &ldquo;real&rdquo; classes &mdash; only objects and links.</p>
          </div>
        </div>
      </section>

      {/* ── Common Traps ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Seven Traps</h2>
        <p className="article-para">
          These recur in interviews. Recognize the shape and you recognize the bug.
        </p>

        <ol className="article-ol">
          <li><strong>Forgetting <code>new</code></strong> &mdash; pollutes global in sloppy mode; throws in strict / <code>class</code> (Day 3, Day 4).</li>
          <li><strong>Constructor returns an object</strong> &mdash; hijacks <code>this</code>, loses the prototype link (Day 3).</li>
          <li><strong>Reassigning <code>Fn.prototype</code></strong> &mdash; old instances keep the old link; only new ones get the new one (Day 2).</li>
          <li><strong><code>this</code> before <code>super()</code></strong> &mdash; throws <code>ReferenceError</code> in a subclass (Day 5).</li>
          <li><strong>Trusting <code>constructor</code></strong> &mdash; it&apos;s just an inherited, mutable property, not an identity check (Day 2).</li>
          <li><strong>Arrow as constructor</strong> &mdash; no <code>prototype</code>, <code>new</code> throws (Week 2 Day 6 revisited).</li>
          <li><strong>Mixin name collisions</strong> &mdash; later <code>Object.assign</code> silently wins (Day 6).</li>
        </ol>
      </section>

      {/* ── Hard Problems ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Hard Problems</h2>
        <p className="article-para">
          Attempt each before reading the answer. The goal is not getting it right &mdash; it&apos;s being able to{' '}
          <em>explain</em> every step.
        </p>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 1. Output?</h4>
          <CodeBlock
            code={`function F() {}
F.prototype = { n: 1 };
const a = new F();
F.prototype = { n: 2 };
const b = new F();
console.log(a.n, b.n);`}
            filename="p1.js"
          />
          <p className="iq-a">
            <code>1 2</code>. <code>a</code> was linked to the <em>original</em> prototype object ({'{'}
            n:1{'}'}); reassigning <code>F.prototype</code> swaps in a new object, which only <em>future</em>{' '}
            instances (<code>b</code>) link to. <code>a</code> still delegates to the original. Reassignment does not
            retroactively re-wire existing instances &mdash; they hold their link by reference.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 2. Output?</h4>
          <CodeBlock
            code={`function F() { this.x = 1; return { y: 2 }; }
F.prototype.z = 3;
const f = new F();
console.log(f.x, f.y, f.z);`}
            filename="p2.js"
          />
          <p className="iq-a">
            <code>undefined 2 undefined</code>. The constructor returns a non-null object <code>{'{ y: 2 }'}</code>,
            so step 4 of <code>new</code> discards the prototype-linked <code>this</code> and returns that object
            instead. <code>f</code> is a plain object &mdash; it has <code>y</code> but no <code>x</code> (the{' '}
            <code>this.x = 1</code> assignment went to the discarded <code>this</code>) and no <code>z</code> (the
            prototype link was lost). This is the return-hijack footgun.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 3. Output?</h4>
          <CodeBlock
            code={`const proto = { greet() { return this.name; } };
const obj = Object.create(proto);
obj.name = "Tamjid";
const fn = obj.greet;
console.log(fn());`}
            filename="p3.js"
          />
          <p className="iq-a">
            <code>undefined</code> (or throws in strict mode). <code>const fn = obj.greet</code> <em>detaches</em> the
            method &mdash; <code>fn</code> is now a bare reference with no receiver. Calling <code>fn()</code> is
            default binding, so <code>this</code> is <code>undefined</code>/<code>globalThis</code>, and{' '}
            <code>this.name</code> is undefined. The Week 2 &ldquo;detached method&rdquo; bug, now nested inside a
            prototype lookup. Fix: <code>obj.greet()</code> (keep the dot) or <code>fn.call(obj)</code>.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 4. What does <code>instanceof</code> report, and why?</h4>
          <CodeBlock
            code={`class A {}
class B extends A {}
const b = new B();
console.log(b instanceof B, b instanceof A, b instanceof Object);`}
            filename="p4.js"
          />
          <p className="iq-a">
            <code>true true true</code>. <code>instanceof</code> walks the entire <code>[[Prototype]]</code> chain of{' '}
            <code>b</code> looking for each class&apos;s <code>.prototype</code>. <code>b</code>&apos;s chain is{' '}
            <code>B.prototype &rarr; A.prototype &rarr; Object.prototype &rarr; null</code>, so it matches all three.
            It&apos;s a structural chain test, not a type tag &mdash; a subclass instance is an instance of every
            ancestor (Liskov substitution).
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 5. Output and why?</h4>
          <CodeBlock
            code={`class Base {
  constructor() { this.type = "base"; }
  show() { return this.type; }
}
class Sub extends Base {
  constructor() {
    this.type = "sub"; // no super() first
    super();
  }
}
new Sub();`}
            filename="p5.js"
          />
          <p className="iq-a">
            It throws <code>ReferenceError: must call super() before accessing &apos;this&apos;</code>. In a subclass,
            <code> this</code> is uninitialized until <code>super()</code> runs &mdash; the parent constructor
            creates the object. Referencing <code>this.type</code> before <code>super()</code> is illegal. Swap the
            two lines (<code>super()</code> first) and <code>this.type</code> becomes <code>"sub"</code> (overriding
            the base&apos;s assignment).
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 6. Output?</h4>
          <CodeBlock
            code={`class Counter {
  #count = 0;
  inc() { this.#count++; return this; }
  get value() { return this.#count; }
}
const c = new Counter();
const copy = { ...c };
console.log(copy.value, copy.inc);`}
            filename="p6.js"
          />
          <p className="iq-a">
            <code>undefined undefined</code>. <code>#count</code> is private &mdash; it is <em>not</em> an enumerable
            own property and is not copied by spread, so <code>copy</code> has no <code>#count</code>. More subtly,
            the methods (<code>inc</code>, <code>value</code>) live on <code>Counter.prototype</code>, not on the
            instance, so spread (which copies own enumerable properties) doesn&apos;t copy them either.{' '}
            <code>copy</code> is an empty plain object disconnected from <code>Counter</code>. Spread breaks
            encapsulation assumptions around private fields and prototype methods.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 7. Implement <code>instanceof</code> from scratch.</h4>
          <CodeBlock
            code={`function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}`}
            filename="p7.js"
          />
          <p className="iq-a">
            Walk <code>obj</code>&apos;s prototype chain with <code>Object.getPrototypeOf</code>, comparing each link
            to <code>Constructor.prototype</code> by reference. Return true on a match, false when the chain reaches{' '}
            <code>null</code>. This is literally what the spec&apos;s <code>OrdinaryHasInstance</code> does. Note it
            checks the <em>prototype object</em>, not the constructor function &mdash; which is why reassigning{' '}
            <code>Fn.prototype</code> changes past <code>instanceof</code> results.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 8. Trace every lookup; what is the final value?</h4>
          <CodeBlock
            code={`const a = { v: 1 };
const b = Object.create(a);
const c = Object.create(b);
Object.defineProperty(a, "v", { value: 1, writable: false });
c.v = 99;
console.log(c.v, b.v, a.v);`}
            filename="p8.js"
          />
          <p className="iq-a">
            <code>1 1 1</code> (and <code>c.v = 99</code> <em>silently fails</em> in sloppy mode, or throws in strict
            mode). <code>a.v</code> is a read-only (non-writable) <em>data</em> property. When you assign{' '}
            <code>c.v = 99</code>, the engine walks the chain and finds <code>v</code> on <code>a</code> is
            non-writable &mdash; so it refuses to create a shadowing own property on <code>c</code>. The assignment is
            ignored. All three reads resolve to <code>a.v</code> = 1. This is one of the assignment exceptions from
            Day 1: a non-writable inherited property blocks shadowing.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 9. Build <code>Object.create</code> from scratch.</h4>
          <CodeBlock
            code={`function myCreate(proto, descriptors) {
  if (proto !== null && typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Object prototype may only be an Object or null");
  }
  function F() {}          // throwaway constructor
  F.prototype = proto;     // set the link
  const obj = new F();     // new links obj to F.prototype === proto
  F.prototype = null;      // clean up (optional, releases the temp)
  if (descriptors) Object.defineProperties(obj, descriptors);
  return obj;
}`}
            filename="p9.js"
          />
          <p className="iq-a">
            The classic trick: a throwaway function whose <code>prototype</code> is set to the desired proto, then{' '}
            <code>new</code> it. Because <code>new</code> links the instance to <code>F.prototype</code>, the result
            delegates to <code>proto</code>. Passing <code>null</code> creates an object with no prototype (a true
            dictionary). The optional descriptor map uses <code>Object.defineProperties</code> for the second
            argument. This is essentially how engines implement <code>Object.create</code>.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 10. Output of every line, with reasoning.</h4>
          <CodeBlock
            code={`function Animal() {}
Animal.prototype.speak = function () { return "generic"; };

function Dog() {}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.bark = function () { return "woof"; };

const d = new Dog();
console.log(d.bark(), d.speak(), d instanceof Dog, d instanceof Animal);
console.log(d.constructor === Dog, d.constructor === Animal);`}
            filename="p10.js"
          />
          <p className="iq-a">
            Line 1: <code>"woof" "generic" true true</code>. Line 2: <code>false true</code>. <code>d.bark()</code>{' '}
            finds <code>bark</code> on <code>Dog.prototype</code>; <code>d.speak()</code> walks up to{' '}
            <code>Animal.prototype</code>; <code>instanceof</code> is true for both because the chain reaches both
            prototypes. The trap is line 2: after <code>Dog.prototype = Object.create(Animal.prototype)</code>, the
            <code> constructor</code> back-link points to <code>Animal</code> (it was inherited from{' '}
            <code>Animal.prototype</code>), not <code>Dog</code> &mdash; the manual prototype reassignment lost it.
            This is exactly why <code>constructor</code> is unreliable, and why the fix is to repair it:{' '}
            <code>Dog.prototype.constructor = Dog</code>. One problem, four concepts: chain lookup,{' '}
            <code>instanceof</code>, manual prototypal inheritance, and the mutable <code>constructor</code> footgun.
          </p>
        </div>
      </section>

      {/* ── Self-Assessment ───────────────────────────────── */}
      <section className="day-section">
        <div className="challenge-section">
          <span className="challenge-label">Self-Assessment</span>
          <p>
            Rate yourself 1&ndash;5 on each. If anything is below 3, redo that day before moving on.
          </p>
          <ul className="challenge-list">
            <li>I can trace a property lookup across a multi-level prototype chain.</li>
            <li>I can explain <code>__proto__</code> vs <code>prototype</code> without hesitation.</li>
            <li>I can list the four steps of <code>new</code> and handle the return-object rule.</li>
            <li>I can desugar a <code>class</code> into a constructor + prototype by hand.</li>
            <li>I know why <code>super()</code> must run before <code>this</code> in a subclass.</li>
            <li>I can implement <code>new</code>, <code>instanceof</code>, and <code>Object.create</code> from scratch.</li>
            <li>I can justify composition over inheritance using Liskov substitution.</li>
            <li>I can spot the detached-method, return-hijack, and <code>constructor</code> traps on sight.</li>
          </ul>

          <p style={{ marginTop: '1rem' }}>
            <strong>Ready for Week 4?</strong> Async JavaScript is the most practically important week. The prototype
            chain stays relevant &mdash; <code>Promise</code>, <code>AsyncFunction</code>, and every API you await
            are objects with their own prototypes &mdash; but the focus shifts to the <em>event loop</em>: how
            JavaScript stays single-threaded yet handles thousands of concurrent operations. The{' '}
            <code>this</code> rules and prototype lookups you now own become the foundation everything async is built
            on.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Final Practice (90 minutes)</span>
          <p>Timed. No notes, no autocomplete, no search:</p>
        </div>

        <CodeBlock
          code={`// From a blank file, in order:
// 1. Model a 3-object prototype chain with Object.create and prove
//    delegation + shadowing.
// 2. Write a constructor function with instance fields and shared
//    prototype methods; forget \`new\` deliberately and observe.
// 3. Re-implement \`new\` (myNew) including the return-object rule.
// 4. Re-implement \`instanceof\` (myInstanceof) by walking the chain.
// 5. Re-implement \`Object.create\` (myCreate) using a throwaway fn.
// 6. Write an ES6 class with a private field, a getter, and a static
//    method; then desugar it to the constructor form.
// 7. Build a 2-level \`extends\` hierarchy using super() and super.m().
// 8. Rewrite a small inheritance hierarchy as composition + a mixin.

// Then solve Problems 8 and 10 on paper, step by step.`}
          filename="final-practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Why paper matters</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Interviews test mental execution. Tracing prototype lookups by hand &mdash; predicting output without
            running &mdash; is the closest practice to the real thing. If you can&apos;t draw the chain on paper,
            you can&apos;t reason about it under pressure.
          </p>
        </div>
      </section>

      {/* ── Bridge to Week 4 ──────────────────────────────── */}
      <section className="day-section">
        <div className="week-bridge">
          <p>
            Week 3 complete. You now understand <strong>objects</strong> &mdash; how they link (the prototype chain),
            how they&apos;re manufactured (<code>new</code> and classes), how they inherit (<code>extends</code>/
            <code>super</code>), and when to compose instead. <strong>Week 4 (Asynchronous JavaScript)</strong>{' '}
            answers the question that has been lurking since Week 1: how does a single-threaded language do more than
            one thing at a time? The event loop, microtasks vs macrotasks, promises, and <code>async/await</code>{' '}
            internals &mdash; every interview&apos;s favorite territory.
          </p>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
