import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('consolidation')!
const navItems = weekNav(week)

export default function ConsolidationDay4() {
  const { prev, next } = dayNavLinks(week, 4)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[3].title}</h1>
        <p className="lesson-subtitle">
          Four steps, in order. Implementing <code>new</code> proves you understand the constructor-&rarr;-prototype
          machinery at the heart of JavaScript objects.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            We re-implement the <code>new</code> operator as a function <code>myNew(Constructor, ...args)</code>. It
            performs the four steps you learned in Week 3 Day 3: create, link, bind <code>this</code>, return.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            (1) Create a fresh object. (2) Link its <code>[[Prototype]]</code> to <code>Constructor.prototype</code> via{' '}
            <code>Object.create</code>. (3) Run the constructor with <code>this</code> bound to the new object. (4) Return
            it &mdash; unless the constructor returned its own object.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            The classic companion to &ldquo;implement <code>bind</code>.&rdquo; Building <code>new</code> from{' '}
            <code>Object.create</code> + <code>apply</code> proves you grasp how objects and prototypes are manufactured.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Week 3 Day 3 listed <code>new</code>&apos;s four steps. Today you turn that list into working code. The
          result: a function that does exactly what the <code>new</code> operator does, built from primitives you now
          understand &mdash; <code>Object.create</code> (the link), <code>apply</code> (the bind), and the return
          rule.
        </p>

        <CodeBlock
          code={`// What we're building:
function User(name) { this.name = name; }
User.prototype.greet = function () { return "Hi, " + this.name; };

const u = myNew(User, "Tamjid"); // same as: new User("Tamjid")
u.name;     // "Tamjid"
u.greet();  // "Hi, Tamjid" — prototype method reachable via the link`}
          filename="intro.js"
        />

        <p className="article-para">
          The whole thing is ~5 lines. The value isn&apos;t the code &mdash; it&apos;s that writing it forces you to
          confront each step: where the prototype link comes from, how <code>this</code> gets bound, and the
          subtle return rule that can hijack the new object.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Create</dt>
            <dd className="def-text">
              Allocate a new empty object. Done implicitly by <code>Object.create</code> (which also handles step 2).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Link</dt>
            <dd className="def-text">
              Set the new object&apos;s <code>[[Prototype]]</code> to <code>Constructor.prototype</code>, so instances
              inherit the constructor&apos;s shared methods (Week 3 Day 1/2).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Bind &amp; run</dt>
            <dd className="def-text">
              Call the constructor with <code>this</code> bound to the new object (new binding &mdash; Week 2 Day 5,
              rule #1). Its body sets instance properties.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Return</dt>
            <dd className="def-text">
              Return the new object &mdash; unless the constructor explicitly returned a non-null object, in which case
              that object wins and the new one is discarded (the &ldquo;return hijack&rdquo;).
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Factory Order Analogy</h2>
        <p className="article-para">
          <code>new</code> is a <strong>factory order form</strong>. (1) Stamp out a blank product (<em>create</em>).
          (2) Staple the shared product manual to it (<em>link</em> the prototype). (3) Hand it to the assembly line to
          customize for this order (<em>bind &amp; run</em> the constructor). (4) Ship the product &mdash; unless the
          assembly line swapped in a totally different finished item, in which case ship that instead (<em>return
          rule</em>).
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">📦</span>
            <span className="analogy-label">Stamp a blank product</span>
            <span className="analogy-target">Create the object</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📖</span>
            <span className="analogy-label">Staple the manual</span>
            <span className="analogy-target">Link to <code>Constructor.prototype</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔧</span>
            <span className="analogy-label">Customize on the line</span>
            <span className="analogy-target">Run ctor with <code>this</code> = new obj</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🚚</span>
            <span className="analogy-label">Ship (or the swap-in)</span>
            <span className="analogy-target">Return rule</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            <code>Object.create(Constructor.prototype)</code> cleverly fuses steps 1 and 2: it returns a fresh object
            <em> whose <code>[[Prototype]]</code> is already set</em>. That&apos;s why the implementation is so short &mdash;
            the linking is the one non-obvious step, and <code>Object.create</code> does it for free. It is, in essence,
            the primitive <code>new</code> is built on.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Four Steps in Code Terms</h2>
        <p className="article-para">
          Each step maps to one line. The return rule is the only one with a branch.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Create + link in one call</h4>
            <p className="theory-desc">
              <code>const obj = Object.create(Constructor.prototype)</code>. Returns a new empty object whose{' '}
              <code>[[Prototype]]</code> is <code>Constructor.prototype</code>. Steps 1 and 2 fused.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Run the constructor with <code>this</code> = obj</h4>
            <p className="theory-desc">
              <code>const result = Constructor.apply(obj, args)</code>. <code>apply</code> (Day 3) binds{' '}
              <code>this</code> to the new object and runs the body, setting instance fields. This is new-binding.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Apply the return rule</h4>
            <p className="theory-desc">
              <code>return (result &amp;&amp; typeof result === "object") ? result : obj</code>. If the constructor
              returned a non-null object, that wins; otherwise return the new object (even if the constructor returned a
              primitive or nothing).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. The <code>typeof === "function"</code> nuance</h4>
            <p className="theory-desc">
              A returned function also counts as an object hijack (<code>typeof function === "function"</code>, but a
              function <em>is</em> an object). For full fidelity check <code>typeof result === "object" || typeof
              result === "function"</code>.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The return rule &mdash; why it matters</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Constructor returns nothing / primitive</span>
            <p className="phase-desc">The new object is returned (normal case).</p>
            <ul className="phase-rules">
              <li><code>return undefined</code> &rarr; new obj</li>
              <li><code>return 5</code> &rarr; new obj (5 ignored)</li>
              <li><code>return null</code> &rarr; new obj (null isn&apos;t an object here)</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Constructor returns an object/function</span>
            <p className="phase-desc">That returned object wins; new obj discarded.</p>
            <ul className="phase-rules">
              <li><code>return {`{}`}</code> &rarr; that object</li>
              <li><code>return []</code> &rarr; the array</li>
              <li><code>return () =&gt; {}</code> &rarr; the function</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            This return-hijack is how some libraries implement &ldquo;constructors&rdquo; that cache or return shared
            instances (the constructor returns a pre-existing object instead of a fresh one). It&apos;s also a footgun &mdash;
            a stray <code>return {}</code> in a constructor silently discards the prototype-linked <code>this</code>, so{' '}
            <code>instance.method()</code> suddenly fails. <code>class</code> constructors forbid returning objects for
            this reason (mostly).
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why <code>new</code> Exists</h2>
        <p className="article-para">
          <code>new</code> was added to mimic Java syntax when JS was created (1995) &mdash; marketing demanded
          class-like constructors. Underneath, it was always prototypes: <code>new Fn()</code> links an object to{' '}
          <code>Fn.prototype</code> and runs the function as an initializer. The <code>class</code> keyword (ES6, 2015)
          is sugar over this exact mechanism &mdash; <code>class</code> constructors are still invoked via <code>new</code>,
          which still does these four steps. Implementing <code>new</code> from <code>Object.create</code> +{' '}
          <code>apply</code> makes the &ldquo;no real classes&rdquo; truth of JS tangible: it&apos;s all functions,
          objects, and links.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>What <code>new</code> does</th>
                <th>Our code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Create</td>
                <td>New empty object</td>
                <td>(<code>Object.create</code> handles)</td>
              </tr>
              <tr>
                <td>Link</td>
                <td>Set <code>[[Prototype]]</code></td>
                <td><code>Object.create(Fn.prototype)</code></td>
              </tr>
              <tr>
                <td>Bind &amp; run</td>
                <td>Call ctor, <code>this</code> = obj</td>
                <td><code>Fn.apply(obj, args)</code></td>
              </tr>
              <tr>
                <td>Return</td>
                <td>obj, or ctor&apos;s object</td>
                <td>ternary on <code>typeof</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing <code>myNew(User, &quot;Tamjid&quot;)</code></h2>

        <CodeBlock
          code={`function User(name) { this.name = name; }
User.prototype.greet = function () { return "Hi, " + this.name; };
const u = myNew(User, "Tamjid");`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Create + link:</strong> <code>Object.create(User.prototype)</code> &rarr; a new empty object whose{' '}
              <code>[[Prototype]]</code> points at <code>User.prototype</code> (which holds <code>greet</code>). So{' '}
              <code>greet</code> is already reachable from this object via the chain.
            </span>
          </li>
          <li>
            <span>
              <strong>Bind &amp; run:</strong> <code>User.apply(obj, ["Tamjid"])</code> runs <code>User</code> with{' '}
              <code>this = obj</code> &rarr; <code>this.name = "Tamjid"</code> sets an own property on the new object.
              Returns <code>undefined</code> (no explicit return).
            </span>
          </li>
          <li>
            <span>
              <strong>Return rule:</strong> <code>result</code> is <code>undefined</code> (not an object) &rarr; return{' '}
              <code>obj</code>, now <code>{'{ name: "Tamjid" }'}</code> with the prototype link.
            </span>
          </li>
          <li>
            <span>
              <code>u.name</code> &rarr; own property &rarr; <code>"Tamjid"</code>. <code>u.greet()</code> misses on{' '}
              <code>u</code>, walks to <code>User.prototype</code>, finds <code>greet</code>, runs with{' '}
              <code>this = u</code> &rarr; <code>"Hi, Tamjid"</code>. Exactly like the native <code>new</code>.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. <code>myNew</code> &mdash; the core</h3>
        <CodeBlock
          code={`function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // create + link
  const result = Constructor.apply(obj, args);       // bind & run
  return (result && (typeof result === "object" || typeof result === "function"))
    ? result : obj;                                   // return rule
}`}
          filename="myNew.js"
        />

        <h3 className="article-h3">2. Normal constructor</h3>
        <CodeBlock
          code={`function Point(x, y) { this.x = x; this.y = y; }
Point.prototype.sum = function () { return this.x + this.y; };
const p = myNew(Point, 3, 4);
p.sum(); // 7
Object.getPrototypeOf(p) === Point.prototype; // true — link worked`}
          filename="normal.js"
        />

        <h3 className="article-h3">3. The return hijack</h3>
        <CodeBlock
          code={`function Hijack() { this.real = true; return { fake: true }; }
const h = myNew(Hijack);
h.real;  // undefined — the linked \`this\` was discarded
h.fake;  // true     — the returned object won
Object.getPrototypeOf(h) === Object.prototype; // true (plain object, link lost)`}
          filename="hijack.js"
        />

        <h3 className="article-h3">4. Returning a primitive is ignored</h3>
        <CodeBlock
          code={`function ReturnsPrim() { this.x = 1; return 99; }
const r = myNew(ReturnsPrim);
r.x;  // 1 — the new object, not 99
r;    // { x: 1 } — primitive return ignored`}
          filename="primitive.js"
        />

        <h3 className="article-h3">5. <code>instanceof</code> still works</h3>
        <CodeBlock
          code={`const q = myNew(Point, 1, 2);
q instanceof Point; // true — the prototype chain reaches Point.prototype
// Because Object.create(Point.prototype) set the link, instanceof walks it.`}
          filename="instanceof.js"
        />

        <h3 className="article-h3">6. Works with <code>class</code> (mostly)</h3>
        <CodeBlock
          code={`class Animal { constructor(name) { this.name = name; } speak() { return this.name; } }
const a = myNew(Animal, "Rex");
a.speak(); // "Rex"
// Note: real \`new\` on a class throws if called without new; our myNew bypasses
// that check. Native \`class\` constructors enforce new-binding; this is a
// simplification. The 4 steps are identical for class constructors.`}
          filename="class.js"
        />

        <div className="article-callout">
          <p>
            One caveat: a native <code>class</code> constructor refuses to run without <code>new</code> (it throws). Our{' '}
            <code>myNew</code> calls it via <code>apply</code>, which for a real class constructor would throw because
            classes detect they weren&apos;t <code>new</code>-invoked. For plain function constructors it works
            perfectly. The four-step model is identical; only the class-enforcement detail differs. For a fully faithful
            version you&apos;d need engine-level hooks.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Implement <code>myNew</code> from scratch and verify it against native <code>new</code> on a constructor with
            instance fields, prototype methods, and all three return cases (nothing, primitive, object). Confirm{' '}
            <code>instanceof</code> and the prototype link behave identically.
          </p>
        </div>

        <CodeBlock
          code={`function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const r = Ctor.apply(obj, args);
  return r && (typeof r === "object" || typeof r === "function") ? r : obj;
}

// Verify against \`new\`:
function Thing(v) { this.v = v; }
Thing.prototype.doubled = function () { return this.v * 2; };

const a = myNew(Thing, 5);
const b = new Thing(5);
a.v;            // 5 === b.v
a.doubled();    // 10 === b.doubled()
Object.getPrototypeOf(a) === Object.getPrototypeOf(b); // true
a instanceof Thing; // true

// Return cases:
function None() { this.x = 1; }                 // no return → new obj
function Prim() { this.x = 1; return 9; }       // primitive → new obj
function Obj() { this.x = 1; return { y: 2 }; } // object → that object
myNew(None).x;  // 1
myNew(Prim).x;  // 1
myNew(Obj).y;   // 2 (x is gone — hijacked)`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does <code>myNew(Obj).x</code> return <code>undefined</code> while <code>myNew(Prim).x</code> returns{' '}
            <code>1</code>? (Because <code>Obj</code> returns <code>{'{ y: 2 }'}</code> &mdash; an object &mdash; so the
            return rule discards the linked <code>this</code> (with <code>x=1</code>) and ships the returned object.
            <code> Prim</code> returns <code>9</code>, a primitive, which the rule ignores &mdash; so the new object
            with <code>x=1</code> is returned. The type of the returned value flips which object you get.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What does <code>new</code> do?</h4>
            <p className="iq-a">
              Four steps: (1) create a new empty object; (2) link its <code>[[Prototype]]</code> to{' '}
              <code>Constructor.prototype</code>; (3) call the constructor with <code>this</code> bound to the new object
              (new binding), passing the arguments; (4) return the new object &mdash; unless the constructor returned a
              non-null object, in which case return that instead. It manufactures an instance linked to the
              constructor&apos;s prototype.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Implement <code>new</code>.</h4>
            <p className="iq-a">
              <code>{'function myNew(Ctor, ...args) { const obj = Object.create(Ctor.prototype); const r = Ctor.apply(obj, args); return r && (typeof r === "object" || typeof r === "function") ? r : obj; }'}</code>{' '}
              <code>Object.create(Ctor.prototype)</code> fuses create + link. <code>apply</code> binds{' '}
              <code>this</code> to the new object and runs the constructor. The return ternary implements the return
              rule: a returned object/function wins, otherwise the new object.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why does <code>Object.create(Constructor.prototype)</code> handle two steps?</h4>
            <p className="iq-a">
              Because it creates a fresh empty object <em>and</em> sets its <code>[[Prototype]]</code> to the argument in
              one call. So &ldquo;create&rdquo; and &ldquo;link&rdquo; collapse into one line. It is, in effect, the
              primitive operation <code>new</code> is built on &mdash; the linking is the essential part, and{' '}
              <code>Object.create</code> exposes it directly (Week 3 Day 2).
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is the return rule, and why does it matter?</h4>
            <p className="iq-a">
              If the constructor explicitly returns a non-null object (or function), <code>new</code> returns that
              instead of the new object; otherwise it returns the new object (primitives and <code>undefined</code> are
              ignored). It matters because a stray <code>return {}</code> silently discards the prototype-linked{' '}
              <code>this</code> &mdash; <code>instance.method()</code> then fails. It&apos;s also deliberately used by
              libraries that return cached/shared instances from a &ldquo;constructor.&rdquo;
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Does <code>myNew</code> work on a <code>class</code>?</h4>
            <p className="iq-a">
              The four-step model is identical for class constructors (a class is still a function with a prototype).
              But a real <code>class</code> constructor refuses to run without <code>new</code> &mdash; it detects
              non-<code>new</code> invocation and throws. Our <code>myNew</code> calls it via <code>apply</code>, so it
              would throw on a real class. For plain function constructors it works perfectly. A fully faithful version
              would need engine-level hooks to satisfy the class-enforcement check.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why check <code>typeof result === "function"</code> too?</h4>
            <p className="iq-a">
              Because a function is an object. If a constructor returns a function, the spec treats it like any returned
              object: it wins over the new <code>this</code>. <code>typeof function === "function"</code>, not{' '}
              <code>"object"</code>, so checking only <code>typeof === "object"</code> would miss the function case and
              wrongly return the new object. Including the function check matches the spec&apos;s &ldquo;object&rdquo;
              definition (which includes functions).
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How do <code>new</code> and the prototype chain relate to ES6 <code>class</code>?</h4>
            <p className="iq-a">
              A <code>class</code> is syntactic sugar over the constructor + prototype mechanism. <code>{'class C { constructor(){} m(){} }'}</code>{' '}
              desugars to a function <code>C</code> (the constructor) with <code>C.prototype.m</code> set. <code>new
              C()</code> does the same four steps as <code>new</code> on any function: creates an object, links it to{' '}
              <code>C.prototype</code>, runs the constructor with <code>this</code> bound, returns it. So{' '}
              <code>instance instanceof C</code> works because the chain reaches <code>C.prototype</code>, and methods
              are shared (one copy on the prototype, delegated to) &mdash; no copying. The <code>extends</code>/{' '}
              <code>super</code> sugar builds the two prototype links (instance-side and static-side) the same way you
              would by hand (Week 3 Day 5). Implementing <code>new</code> from <code>Object.create</code> makes this
              tangible: there are no real classes in JS, only functions, objects, and prototype links &mdash;{' '}
              <code>class</code> just makes the common pattern readable and enforces <code>new</code>.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
