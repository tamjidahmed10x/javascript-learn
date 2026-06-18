import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('closures-functions')!
const navItems = weekNav(week)

export default function ClosuresDay6() {
  const { prev, next } = dayNavLinks(week, 6)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[5].title}</h1>
        <p className="lesson-subtitle">
          Same syntax family, four meaningful differences. Pick wrong and your code silently breaks.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            Arrow functions (<code>{'() => {}'}</code>) look like shorthand but differ from regular
            functions in <strong>four</strong> ways: <code>this</code>, <code>arguments</code>,{' '}
            <code>new</code>, and <code>prototype</code>/<code>super</code>.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            An arrow has no own <code>this</code> or <code>arguments</code> &mdash; it uses the enclosing
            scope&rsquo;s. It cannot be a constructor (<code>new</code> throws) and has no{' '}
            <code>prototype</code>.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Use arrows for <em>callbacks</em> that need the surrounding <code>this</code> (timers, event
            handlers, array methods). Use regular functions for <em>methods</em> and <em>constructors</em>{' '}
            that need their own <code>this</code>.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Arrows are not just &ldquo;shorter functions.&rdquo; That shorthand is the bait; the four
          behavioral differences are the hook. Treating them as interchangeable is the single most common
          source of <code>this</code>-related bugs in modern JavaScript.
        </p>

        <CodeBlock
          code={`// These are NOT equivalent:
const obj = {
  name: "Tamjid",
  regular: function () { return this.name; },  // own this
  arrow: () => this.name,                        // no own this
};

obj.regular(); // "Tamjid"
obj.arrow();   // undefined — inherits module/global this`}
          filename="not-equivalent.js"
        />

        <p className="article-para">
          Yesterday you learned the four <code>this</code> rules and that arrows sit outside them. Today we
          nail down the <em>other</em> three differences and build the decision rule for when to use which.
        </p>
      </section>

      {/* ── Difference 1: this ────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Difference 1 &mdash; <code>this</code> (Lexical)</h2>
        <p className="article-para">
          The big one. A regular function creates its own <code>this</code> binding on each call. An arrow{' '}
          <strong>does not create one</strong> &mdash; it captures <code>this</code> from where it was
          defined.
        </p>

        <CodeBlock
          code={`function Timer() {
  this.count = 0;

  // Regular: new \`this\` each tick → wrong object
  setInterval(function () {
    this.count++;          // \`this\` is global/undefined
  }, 1000);

  // Arrow: no own \`this\` → uses Timer's \`this\`
  setInterval(() => {
    this.count++;          // \`this\` is the Timer instance ✓
  }, 1000);
}`}
          filename="this-diff.js"
        />

        <p className="article-para">
          This is exactly why arrows replaced the <code>var self = this</code> hack. The arrow closes over{' '}
          <code>this</code> lexically &mdash; the same closure mechanism from Day 1, applied to the special{' '}
          <code>this</code> binding.
        </p>

        <div className="article-callout">
          <p>
            You <strong>cannot</strong> rebind an arrow&rsquo;s <code>this</code>.{' '}
            <code>{'arrow.call(someObj)'}</code> silently ignores <code>someObj</code> &mdash; the lexical{' '}
            <code>this</code> wins. Arrows are immune to all four binding rules.
          </p>
        </div>
      </section>

      {/* ── Difference 2: arguments ───────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Difference 2 &mdash; <code>arguments</code></h2>
        <p className="article-para">
          Regular functions get their own <code>arguments</code> object &mdash; an array-like collection of
          the arguments they were called with. Arrows do <strong>not</strong> have their own{' '}
          <code>arguments</code>; they inherit it from the enclosing function, just like <code>this</code>.
        </p>

        <CodeBlock
          code={`function regular() {
  console.log(arguments[0]); // works — own arguments
}

const arrow = () => {
  console.log(arguments); // NOT your arguments —
                          // refers to enclosing function's, or throws
};

function outer() {
  const inner = () => {
    console.log(arguments[0]); // outer's arguments, not inner's
  };
  inner();
}
outer("hi"); // "hi" — inner borrowed outer's arguments`}
          filename="arguments-diff.js"
        />

        <div className="article-callout">
          <p>
            <strong>Modern advice:</strong> forget <code>arguments</code> entirely. Use rest parameters{' '}
            <code>(...args) =&gt; [array]</code> instead &mdash; they are real arrays, work in arrows, and
            avoid all the array-like-but-not-an-array pain.
          </p>
        </div>
      </section>

      {/* ── Difference 3: new ─────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Difference 3 &mdash; <code>new</code> and Constructors</h2>
        <p className="article-para">
          Regular functions can be constructors &mdash; called with <code>new</code> they create an object.
          Arrows <strong>cannot</strong> be constructors; <code>new</code> on an arrow throws{' '}
          <code>TypeError</code>.
        </p>

        <CodeBlock
          code={`function RegularUser(name) { this.name = name; }
const u = new RegularUser("Tamjid"); // works → { name: "Tamjid" }

const ArrowUser = (name) => { this.name = name; };
new ArrowUser("Tamjid"); // TypeError: ArrowUser is not a constructor`}
          filename="new-diff.js"
        />

        <p className="article-para">
          Arrows also have no <code>prototype</code> property, and (in classes) no <code>super</code> of
          their own &mdash; they borrow the enclosing method&rsquo;s. This is why class methods are regular
          functions, not arrows.
        </p>
      </section>

      {/* ── Difference 4: misc ────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Difference 4 &mdash; The Smaller Ones</h2>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">No <code>prototype</code> property</h4>
            <p className="theory-desc">Arrows can&rsquo;t be used as constructors, so they have no <code>.prototype</code>.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">No <code>super</code> / <code>new.target</code> of their own</h4>
            <p className="theory-desc">In classes, arrows inherit these from the enclosing context &mdash; useful, but a footgun if misread.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Cannot be generators</h4>
            <p className="theory-desc"><code>function*</code> exists; <code>{'() => yield x'}</code> does not. Use regular generator functions.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Implicit return</h4>
            <p className="theory-desc">An arrow with no body braces returns its expression: <code>(x) =&gt; x + 1</code>. Convenience, not behavior.</p>
          </div>
        </div>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Regular function</th>
                <th>Arrow function</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Own <code>this</code></td>
                <td>Yes (4 rules)</td>
                <td>No (lexical)</td>
              </tr>
              <tr>
                <td>Own <code>arguments</code></td>
                <td>Yes</td>
                <td>No (lexical)</td>
              </tr>
              <tr>
                <td>Can be <code>new</code>&rsquo;d</td>
                <td>Yes</td>
                <td>No (throws)</td>
              </tr>
              <tr>
                <td>Has <code>prototype</code></td>
                <td>Yes</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Hoisted (declaration)</td>
                <td>Yes</td>
                <td>No (must define before use)</td>
              </tr>
              <tr>
                <td>Can be a generator</td>
                <td>Yes (<code>function*</code>)</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── When to use which ─────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">When to Use Which</h2>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Use arrows for&hellip;</span>
            <p className="phase-desc">Callbacks that need the surrounding <code>this</code>.</p>
            <ul className="phase-rules">
              <li>Array methods: <code>.map</code>, <code>.filter</code></li>
              <li>Timers: <code>setTimeout</code>, <code>setInterval</code></li>
              <li>Event listeners (when you want the outer <code>this</code>)</li>
              <li>Short pure transforms</li>
              <li>Class fields: <code>{'onClick = () => {}'}</code></li>
                </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Use regular functions for&hellip;</span>
            <p className="phase-desc">Anything that needs its own <code>this</code> or acts as a template.</p>
            <ul className="phase-rules">
                  <li>Object methods</li>
                  <li>Class methods</li>
                  <li>Constructors (or just use <code>class</code>)</li>
                  <li>Functions called via <code>.call/.apply</code> for <code>this</code></li>
                  <li>Generators (<code>function*</code>)</li>
                </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The single rule that prevents 90% of bugs: <strong>if the function needs <code>this</code> bound
            by the caller (a method or constructor), use a regular function. If it needs the <em>outer</em>{' '}
            <code>this</code> (a callback), use an arrow.</strong> Object-literal methods defined as arrows
            are almost always mistakes.
          </p>
        </div>
      </section>

      {/* ── The Loop Problem Revisited ────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Loop Problem, Finally Solved</h2>
        <p className="article-para">
          Back in Day 1 we saw the <code>var</code> loop printing <code>3, 3, 3</code>. Now we have everything
          to explain it completely &mdash; and why <code>let</code> fixes it without needing closures at all.
        </p>

        <CodeBlock
          code={`// PROBLEM: var → one shared i, all callbacks see the final i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
} // 3, 3, 3

// FIX 1: let → block scope → fresh i per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
} // 0, 1, 2

// FIX 2 (the classic pre-let answer): IIFE to capture i by value
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 0))(i);
} // 0, 1, 2`}
          filename="loop-solved.js"
        />

        <p className="article-para">
          The IIFE fix is the historical answer: each iteration calls a fresh function with <code>i</code> as
          an argument, creating a fresh <code>j</code> binding per call &mdash; a new closure each time.{' '}
          <code>let</code> achieves the same thing at the language level: each iteration of a{' '}
          <code>let</code> loop gets its own binding, so each callback closes over a different{' '}
          <code>i</code>. Same outcome, no ceremony.
        </p>

        <div className="article-callout">
          <p>
            Both fixes work for the same reason: <strong>each callback captures a distinct variable</strong>.
            With <code>var</code> there is one variable shared by all; with <code>let</code> or an IIFE there
            are three. Closures capture variables, not values &mdash; that&rsquo;s the whole lesson of Day 1
            paying off here.
          </p>
        </div>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">Arrow as object method &mdash; the classic bug</h3>
        <CodeBlock
          code={`const counter = {
  count: 0,
  // BUG: arrow inherits outer \`this\` (undefined in a module)
  increment: () => { this.count++; },
};
counter.increment();
counter.count; // still 0 — \`this\` was never \`counter\`

// FIX: use a regular method
const counter2 = {
  count: 0,
  increment() { this.count++; }, // implicit binding → this is counter2
};`}
          filename="method-bug.js"
        />

        <h3 className="article-h3">Arrow callback that needs outer <code>this</code></h3>
        <CodeBlock
          code={`class Shop {
  constructor() { this.stock = 10; }
  sell() {
    setTimeout(() => {
      // arrow → \`this\` is the Shop instance
      this.stock--;
      console.log("Sold! Stock:", this.stock);
    }, 100);
  }
}
const s = new Shop();
s.sell(); // "Sold! Stock: 9"`}
          filename="callback-good.js"
        />

        <h3 className="article-h3">Rest params replace arguments</h3>
        <CodeBlock
          code={`// Old (regular fn only):
function sum() { return [...arguments].reduce((a, b) => a + b, 0); }

// Modern (works in arrows + regular):
const sum2 = (...nums) => nums.reduce((a, b) => a + b, 0);
sum2(1, 2, 3); // 6`}
          filename="rest.js"
        />

        <h3 className="article-h3">Arrow + <code>call</code> is a no-op for <code>this</code></h3>
        <CodeBlock
          code={`const arrow = () => this;
const fake = { pretend: true };

arrow.call(fake); // NOT fake — lexical \`this\` wins
arrow.bind(fake)(); // same — ignored

// Contrast with a regular function:
const reg = function () { return this; };
reg.call(fake); // { pretend: true } — explicit binding works`}
          filename="arrow-call.js"
        />
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>Convert this legacy code to clean modern style:</p>
        </div>

        <CodeBlock
          code={`function Search(results) {
  this.results = results;
  var self = this;
  this.display = function () {
    this.results.forEach(function (r) {
      console.log(self.format(r));
    });
  };
  this.format = function (r) { return "> " + r; };
}

// Goal: rewrite using arrows + rest params. Remove every
// \`var self = this\` and every \`arguments\`. Keep behavior identical.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then predict</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            For each of these, say <em>regular or arrow</em> and justify: (a) a React component method, (b)
            a <code>.map</code> callback inside that method, (c) a constructor, (d) a debounce utility. If
            you hesitate on (a) or (c), reread &ldquo;When to Use Which.&rdquo;
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What are the differences between arrow and regular functions?</h4>
            <p className="iq-a">
              Four: (1) arrows have no own <code>this</code> (lexical); (2) no own <code>arguments</code>;
              (3) cannot be called with <code>new</code> and have no <code>prototype</code>; (4) cannot be
              generators. Syntactically arrows also support implicit return and aren&rsquo;t hoisted as
              declarations.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. When should you NOT use an arrow function?</h4>
            <p className="iq-a">
              As object methods or class methods (you need the caller&rsquo;s <code>this</code>), as
              constructors (<code>new</code> throws), and as generators (not allowed). Object-literal methods
              written as arrows are a common bug because they inherit the module/global <code>this</code>{' '}
              instead of the object.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Do arrow functions have their own <code>arguments</code>?</h4>
            <p className="iq-a">
              No. They inherit <code>arguments</code> from the enclosing function. Modern code should use
              rest parameters (<code>...args</code>) instead &mdash; they work in arrows, produce real
              arrays, and avoid the array-like quirks of <code>arguments</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why does <code>let</code> in a loop fix the closure problem without an IIFE?</h4>
            <p className="iq-a">
              <code>var</code> is function-scoped, so all loop iterations share one <code>i</code>; every
              callback closes over that same variable and sees the final value. <code>let</code> is
              block-scoped, and the spec creates a fresh binding per iteration &mdash; each callback closes
              over its own <code>i</code>. Same effect as an IIFE, built into the language.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Output and explanation?</h4>
            <CodeBlock
              code={`const obj = {
  x: 1,
  m() {
    const inner = () => this.x;
    return inner();
  },
  n() {
    const inner = function () { return this.x; };
    return inner();
  },
};

obj.m(); // ?
obj.n(); // ?`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>1</code>, then <code>undefined</code> (or throws in strict mode). In <code>m</code>, the
              arrow inherits <code>this</code> from <code>m</code> &mdash; which is <code>obj</code> (implicit
              binding on the <code>obj.m()</code> call) &mdash; so <code>this.x</code> is 1. In <code>n</code>,
              <code> inner</code> is a regular function called bare (<code>inner()</code>), so default
              binding applies &rarr; <code>this</code> is <code>undefined</code>/<code>globalThis</code>. The
              arrow preserved the outer <code>this</code>; the regular function discarded it.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Can you rebind an arrow&rsquo;s <code>this</code> with call/apply/bind?</h4>
            <CodeBlock
              code={`const f = () => this;
const target = { id: 1 };
f.call(target); // ?`}
              filename="q6.js"
            />
            <p className="iq-a">
              No &mdash; it returns the arrow&rsquo;s lexical <code>this</code>, ignoring <code>target</code>.
              <code>call</code>/<code>apply</code>/<code>bind</code> are silently no-ops for an arrow&rsquo;s{' '}
              <code>this</code> (they can still pass arguments). This is why arrows are immune to all four
              binding rules &mdash; there is no own <code>this</code> to bind.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Explain every number this logs.</h4>
            <CodeBlock
              code={`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("a", i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("b", j), 0);
}`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>a 3, a 3, a 3</code> then <code>b 0, b 1, b 2</code>. The <code>var</code> loop declares
              one <code>i</code> for the whole function; the loop finishes (i = 3) before any timer fires, so
              all three callbacks read the same final value. The <code>let</code> loop creates a fresh{' '}
              <code>j</code> per iteration, so each callback closes over a distinct variable holding 0, 1, 2.
              The arrow choice is irrelevant here &mdash; both loops use arrows &mdash; the difference is
              entirely <code>var</code> vs <code>let</code> scoping. This is the Day 1 closure lesson
              (<em>closures capture variables, not values</em>) in its purest form.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
