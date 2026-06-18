import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('closures-functions')!
const navItems = weekNav(week)

export default function ClosuresDay7() {
  const { prev } = dayNavLinks(week, 7)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 7 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[6].title}</h1>
        <p className="lesson-subtitle">
          One week, condensed. Then ten problems that separate understanding from memorization.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A compressed review of the entire week &mdash; closures, the three patterns, first-class/HOFs,
            call/apply/bind, the <code>this</code> rules, and arrow functions &mdash; followed by hard
            interview problems and a self-assessment.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Read the cheat sheet, then attempt each problem cold. Only check the answer after you&rsquo;ve
            committed to one in writing. If you get it wrong, trace <em>why</em> &mdash; that&rsquo;s where
            the real learning is.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            End of Week 2. This is your checkpoint: if you can solve 7 of 10 cold, you&rsquo;re ready for
            Week 3 (Prototypes &amp; OOP).
          </p>
        </div>
      </div>

      {/* ── Cheat Sheet ───────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Week 2 Cheat Sheet</h2>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">Closure</h4>
            <p className="theory-desc">Function + its lexical environment. Captures variables <em>by reference</em>. Created at function creation, not return. Keeps outer-scope variables alive.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Three patterns</h4>
            <p className="theory-desc"><strong>Memoize</strong> (cache), <strong>partial application</strong> (preset args), <strong>module</strong> (private state). All are outer-fn + closed-over state + returned fn.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">First-class / Higher-order</h4>
            <p className="theory-desc">First-class = functions are values (the capability). Higher-order = a function that takes or returns a function (the usage). Callback = the role of being passed in.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">map / filter / reduce</h4>
            <p className="theory-desc"><code>map</code> transforms (same length), <code>filter</code> keeps (subset), <code>reduce</code> folds (any shape). All return new arrays; none mutate.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">call / apply / bind</h4>
            <p className="theory-desc"><code>call</code>: invoke now, comma args. <code>apply</code>: invoke now, array args. <code>bind</code>: return bound fn (sticky <code>this</code> + preset args). <em>call = comma, apply = array, bind = build.</em></p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">this &mdash; 4 rules + arrows</h4>
            <p className="theory-desc">Priority: <code>new</code> &gt; explicit &gt; implicit &gt; default. Default is <code>undefined</code> in strict mode. Arrows ignore all four &mdash; lexical <code>this</code>.</p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">Arrow vs regular</h4>
            <p className="theory-desc">Arrow: no own <code>this</code>/<code>arguments</code>, no <code>new</code>, no <code>prototype</code>. Use arrows for callbacks needing outer <code>this</code>; regular functions for methods/constructors.</p>
          </div>
        </div>
      </section>

      {/* ── Common Traps ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Seven Traps</h2>
        <p className="article-para">
          These come up in interviews again and again. Recognize the shape and you recognize the bug.
        </p>

        <ol className="article-ol">
          <li><strong>The loop closure</strong> &mdash; <code>var</code> shares one variable across callbacks (Day 1, Day 6).</li>
          <li><strong>Detached method</strong> &mdash; <code>const fn = obj.method</code> loses <code>this</code> (Day 5).</li>
          <li><strong>Arrow as method</strong> &mdash; inherits outer <code>this</code>, not the object (Day 6).</li>
          <li><strong>setTimeout callback</strong> &mdash; regular function loses <code>this</code>; use arrow or <code>bind</code> (Day 5, Day 6).</li>
          <li><strong>map(parseInt)</strong> &mdash; callback signature mismatch, index read as radix (Day 3).</li>
          <li><strong>Memoize on impure fn</strong> &mdash; silently changes behavior (Day 2).</li>
          <li><strong>Closure holding a huge object</strong> &mdash; memory leak (Day 1, Week 6).</li>
        </ol>
      </section>

      {/* ── Hard Problems ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Hard Problems</h2>
        <p className="article-para">
          Attempt each before reading the answer. The goal is not getting it right &mdash; it&rsquo;s being
          able to <em>explain</em> it.
        </p>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 1. Output?</h4>
          <CodeBlock
            code={`function create() {
  let x = 0;
  return [
    () => x++,
    () => x,
  ];
}
const [inc, get] = create();
inc(); inc();
console.log(get());`}
            filename="p1.js"
          />
          <p className="iq-a">
            <code>2</code>. Both arrows close over the <em>same</em> <code>x</code> in <code>create</code>&rsquo;s
            environment. <code>inc</code> mutates it; <code>get</code> reads it. One closure, shared state &mdash;
            this is the module pattern in miniature.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 2. Output?</h4>
          <CodeBlock
            code={`for (let i = 0; i < 2; i++) {
  setTimeout(() => console.log(i), 0);
}
for (var j = 0; j < 2; j++) {
  setTimeout(() => console.log(j), 0);
}`}
            filename="p2.js"
          />
          <p className="iq-a">
            <code>0, 1</code> then <code>2, 2</code>. <code>let</code> gives each iteration a fresh{' '}
            <code>i</code>; <code>var</code> shares one <code>j</code> that ends at 2 before any timer fires.
            Classic closure + scope interaction.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 3. Output?</h4>
          <CodeBlock
            code={`const obj = {
  name: "Tamjid",
  arrow: () => console.log(this.name),
  regular() { console.log(this.name); },
};
obj.arrow();
obj.regular();`}
            filename="p3.js"
          />
          <p className="iq-a">
            <code>undefined</code> (or throws) then <code>"Tamjid"</code>. The arrow inherits{' '}
            <code>this</code> from the enclosing scope (module/global) where <code>name</code> doesn&rsquo;t
            exist. The regular method gets <code>obj</code> via implicit binding. Arrows as object methods are
            almost always a bug.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 4. What logs?</h4>
          <CodeBlock
            code={`var length = 4;
const arr = [1, 2, 3];
function cb() { console.log(this.length); }

arr.map(cb);
cb();`}
            filename="p4.js"
          />
          <p className="iq-a">
            Both log <code>4</code>. <code>map</code> passes the array as the <em>third argument</em> to the
            callback, not as <code>this</code> &mdash; without a <code>thisArg</code>, the callback&rsquo;s{' '}
            <code>this</code> is <code>globalThis</code> (sloppy), so <code>this.length</code> is the global{' '}
            <code>var length = 4</code>. The bare <code>cb()</code> call is default binding &rarr; same{' '}
            <code>globalThis</code> &rarr; also 4. Note <code>let</code>/<code>const</code> would make both{' '}
            <code>undefined</code>.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 5. Implement <code>once</code> &mdash; correctly.</h4>
          <CodeBlock
            code={`function once(fn) {
  let done = false;
  let result;
  return function (...args) {
    if (done) return result;
    done = true;
    result = fn.apply(this, args);
    return result;
  };
}`}
            filename="p5.js"
          />
          <p className="iq-a">
            A separate <code>done</code> flag (not <code>result !== undefined</code>) ensures it works even
            if <code>fn</code> legitimately returns <code>undefined</code>. <code>apply(this, args)</code>{' '}
            preserves <code>this</code> and forwards args. The closure holds both the flag and the cached
            result.
          </p>
        </div>

        <div className="iq-block iq-medium">
          <h4 className="iq-q">Problem 6. What does this memoized sum do?</h4>
          <CodeBlock
            code={`function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const add = memoize((a, b) => a + b);
add(1, 2); add(2, 1); add(1, 2);`}
            filename="p6.js"
          />
          <p className="iq-a">
            <code>add</code> runs twice, not three times. <code>add(1, 2)</code> computes 3 and caches under{' '}
            <code>"[1,2]"</code>. <code>add(2, 1)</code> is a different key (<code>"[2,1]"</code>), so it
            computes again. The final <code>add(1, 2)</code> hits the cache. Order of arguments matters &mdash;
            <code>JSON.stringify</code> is order-sensitive, so <code>(1,2)</code> and <code>(2,1)</code> are
            distinct keys.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 7. Trace the call stack &amp; <code>this</code>.</h4>
          <CodeBlock
            code={`const obj = {
  x: 10,
  get() { return this.x; },
  delegate() {
    const f = this.get;
    return f();
  },
};
console.log(obj.delegate());`}
            filename="p7.js"
          />
          <p className="iq-a">
            <code>undefined</code> (or throws in strict mode). <code>obj.delegate()</code> sets <code>this</code>{' '}
            to <code>obj</code> inside <code>delegate</code>. But <code>this.get</code> detaches the function
            &mdash; <code>f</code> is now a bare reference. <code>f()</code> is a plain call &rarr; default
            binding &rarr; <code>this</code> is <code>undefined</code>/global. Fix: <code>return this.get()</code>{' '}
            (keep the dot) or <code>f.call(this)</code>. This is the detachment bug nested one level deep.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 8. Will this leak memory? How would you fix it?</h4>
          <CodeBlock
            code={`function setup() {
  const big = new Array(1e8).fill(0);
  const name = "x";
  return function getName() { return name; };
}
const getName = setup();`}
            filename="p8.js"
          />
          <p className="iq-a">
            Conceptually <code>big</code> is unreachable from <code>getName</code>, but engines historically
            retain the <em>whole</em> environment record, so <code>big</code> may stay alive as long as{' '}
            <code>getName</code> exists &mdash; a closure-based leak. Fix: don&rsquo;t declare <code>big</code>{' '}
            in the same scope as the returned function; compute it in a nested, short-lived scope that ends
            before <code>setup</code> returns, or restructure so the large value isn&rsquo;t captured. Modern
            engines optimize some cases, but don&rsquo;t rely on it. (Week 6 covers this in depth.)
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 9. Implement <code>bind</code> from scratch.</h4>
          <CodeBlock
            code={`Function.prototype.myBind = function (thisArg, ...preset) {
  const fn = this;
  return function (...later) {
    return fn.apply(thisArg, [...preset, ...later]);
  };
};`}
            filename="p9.js"
          />
          <p className="iq-a">
            Capture the original function and target <code>this</code> in a closure. The returned function
            merges preset and later args and calls via <code>apply</code>. A complete version also handles{' '}
            <code>new</code> (resetting <code>this</code> to a fresh object while keeping preset args) &mdash;
            that&rsquo;s the Week 8 from-scratch build. The core insight: <code>bind</code> is just a
            higher-order function returning a closure.
          </p>
        </div>

        <div className="iq-block iq-hard">
          <h4 className="iq-q">Problem 10. Output of every line, in order.</h4>
          <CodeBlock
            code={`console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

const o = {
  v: 5,
  show() {
    setTimeout(() => console.log(this.v), 0);
    setTimeout(function () { console.log(this.v); }, 0);
  },
};
o.show();`}
            filename="p10.js"
          />
          <p className="iq-a">
            <code>1, 4, 3, 2</code> (async order: sync first, then microtasks, then macrotasks), then{' '}
            <code>5</code> then <code>undefined</code>. The two <code>show</code> timers run after the first
            chain. The arrow timer inherits <code>this</code> from <code>show</code> (which is <code>o</code>
            via implicit binding), so <code>this.v</code> is 5. The regular-function timer loses{' '}
            <code>this</code> (default binding inside <code>setTimeout</code>), so <code>this.v</code> is{' '}
            <code>undefined</code>. One problem, four concepts: event-loop ordering, arrow <code>this</code>,
            regular <code>this</code>, and implicit binding.
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
            <li>I can define a closure and explain when it&rsquo;s created.</li>
            <li>I can build memoize, partial, and the module pattern from scratch.</li>
            <li>I can explain first-class vs higher-order vs callback without hesitation.</li>
            <li>I can use map/filter/reduce fluently and implement them.</li>
            <li>I can choose between call/apply/bind and implement bind.</li>
            <li>I can recite the four <code>this</code> rules and their priority.</li>
            <li>I can decide arrow vs regular for any given context and justify it.</li>
            <li>I can solve the <code>var</code> loop problem three different ways.</li>
          </ul>

          <p style={{ marginTop: '1rem' }}>
            <strong>Ready for Week 3?</strong> Prototypes &amp; OOP rewrites how inheritance works in
            JavaScript. The <code>this</code> binding rules you just learned are the foundation &mdash;{' '}
            <code>new</code> binding (Rule 4) is exactly what constructor functions and classes rely on.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Final Practice (90 minutes)</span>
          <p>Timed. No notes, no IDE autocomplete, no search:</p>
        </div>

        <CodeBlock
          code={`// From a blank file, in order:
// 1. memoize(fn)
// 2. partial(fn, ...fixed)
// 3. once(fn)
// 4. Function.prototype.myBind (handling \`new\` is bonus)
// 5. compose(...fns) and pipe(...fns)
// 6. A module-pattern bank account with private \`balance\`
//    and deposit/withdraw/getBalance methods

// Then solve Problem 7 and Problem 10 on paper, line by line.`}
          filename="final-practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Why paper matters</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Interviews are mostly mental execution. Writing trace problems by hand &mdash; predicting output
            without running &mdash; is the closest practice to the real thing. If you can&rsquo;t do it on
            paper, you can&rsquo;t do it under pressure.
          </p>
        </div>
      </section>

      {/* ── Bridge to Week 3 ──────────────────────────────── */}
      <section className="day-section">
        <div className="week-bridge">
          <p>
            Week 2 complete. You now understand <strong>functions</strong> &mdash; how they capture state
            (closures), how they&rsquo;re passed around (first-class/HOFs), and how they get their{' '}
            <code>this</code> (the four rules + arrows). <strong>Week 3 (Prototypes &amp; OOP)</strong>{' '}
            answers the question that <code>new</code> binding raised today: where do objects come from, and
            how does inheritance actually work under the class syntax? The <code>this</code> rules stay; the
            objects get a prototype chain.
          </p>
        </div>
      </section>

      <DayNav prev={prev} />
    </ContentLayout>
  )
}
