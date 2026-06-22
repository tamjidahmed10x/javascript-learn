import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('consolidation')!
const navItems = weekNav(week)

export default function ConsolidationDay3() {
  const { prev, next } = dayNavLinks(week, 3)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 3 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[2].title}</h1>
        <p className="lesson-subtitle">
          Three methods you&apos;ve used since Week 2. Building them makes the &ldquo;set <code>this</code> + invoke&rdquo;
          pattern concrete &mdash; and the trick is the same for all three.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            We re-implement <code>call</code>, <code>apply</code>, and <code>bind</code> on a function. <code>call</code>/{' '}
            <code>apply</code> invoke immediately with a chosen <code>this</code>; <code>bind</code> returns a new
            function permanently bound to that <code>this</code> (and preset args).
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            The shared trick: set the function as a property on the target object, invoke it as a method (so{' '}
            <code>this</code> is the object), then delete the property. <code>apply</code> spreads an arg array;{' '}
            <code>bind</code> wraps a <code>call</code> in a returned function and presets args.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Classic interview question and a real test of <code>this</code>-binding understanding (Week 2 Day 4/5). The
            implementation proves you grasp how method calls set <code>this</code>.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          <code>call</code>, <code>apply</code>, <code>bind</code> all do one thing: control what <code>this</code>{' '}
          refers to inside a function call. The mechanism is mundane &mdash; make the function a method, call it &mdash;
          but building all three from that one trick cements the implicit-binding rule (Week 2 Day 5) more than any
          explanation.
        </p>

        <CodeBlock
          code={`// What we're building:
function greet(greeting) { return greeting + ", " + this.name; }
const user = { name: "Tamjid" };

myCall(greet, user, "Hi");     // "Hi, Tamjid" — invoke now with this=user
myApply(greet, user, ["Hi"]);  // same, args as array
const bound = myBind(greet, user, "Hi");
bound();                        // "Hi, Tamjid" — permanently bound fn`}
          filename="intro.js"
        />

        <p className="article-para">
          The unifying idea: a function called as <code>obj.method()</code> has <code>this === obj</code> (implicit
          binding). So to force <code>this = someObj</code>, we temporarily attach the function to <code>someObj</code>,
          call it, then clean up. Every one of the three methods is a variation on that.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term"><code>call</code></dt>
            <dd className="def-text">
              Invoke the function immediately with a specified <code>this</code> and arguments passed individually:
              <code> fn.call(thisArg, a, b, c)</code>.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>apply</code></dt>
            <dd className="def-text">
              Like <code>call</code>, but arguments passed as an array: <code>fn.apply(thisArg, [a, b, c])</code>.
              Identical effect to <code>call</code> otherwise.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>bind</code></dt>
            <dd className="def-text">
              Return a <em>new function</em> permanently bound to a <code>this</code> (and optionally preset leading
              arguments). Not invoked immediately.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Implicit binding (the lever)</dt>
            <dd className="def-text">
              <code>obj.fn()</code> sets <code>this = obj</code>. This is the primitive all three reimplementations
              exploit &mdash; attach &amp; call.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Guest Badge Analogy</h2>
        <p className="article-para">
          <code>this</code> is like a <strong>guest badge</strong> that says whose house you belong to. Normally the
          badge is filled in by where you&apos;re standing when called (the object before the dot). To forge a badge for
          a different house, you sneak the function into that house, call it there (badge now reads that house), then
          remove it before anyone notices. <code>call</code>/<code>apply</code> do this once on the spot;{' '}
            <code>bind</code> makes a permanent clone that always carries the forged badge.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏷️</span>
            <span className="analogy-label">The guest badge</span>
            <span className="analogy-target"><code>this</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏠</span>
            <span className="analogy-label">Sneak into a house, call, leave</span>
            <span className="analogy-target">Attach, invoke, delete</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📞</span>
            <span className="analogy-label">Call right now</span>
            <span className="analogy-target"><code>call</code> / <code>apply</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">A pre-badged clone</span>
            <span className="analogy-target"><code>bind</code></span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The &ldquo;sneak in&rdquo; uses a <strong>unique property key</strong> (often <code>Symbol</code> or a random
            string) to avoid colliding with the object&apos;s real properties, and always <code>delete</code> it after.
            Forgetting to delete would leave a stray method on the object &mdash; a subtle bug. The attach-call-delete
            dance must be exception-safe (use <code>try/finally</code> in production code).
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Attach-Call-Delete Pattern</h2>
        <p className="article-para">
          All three reimplementations share one core maneuver. Understand it and the three are trivial variations.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Get <code>this</code> safe (default to global)</h4>
            <p className="theory-desc">
              If the caller passes <code>null</code>/<code>undefined</code> as <code>thisArg</code>, the spec falls back
              to the global object (sloppy) or <code>undefined</code> (strict). Handle it: <code>ctx = thisArg ?? globalThis</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Attach the function as a unique key</h4>
            <p className="theory-desc">
              <code>ctx[fn] = this</code> (the original function). Use a key unlikely to exist &mdash; a Symbol or random
              string &mdash; so you don&apos;t overwrite a real property.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Invoke as a method, capture result</h4>
            <p className="theory-desc">
              <code>const result = ctx[fn](...args)</code>. Because it&apos;s called as <code>ctx.[fn]()</code>,{' '}
              <code>this</code> inside is <code>ctx</code>. This is the implicit-binding lever.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Delete the temporary key, return result</h4>
            <p className="theory-desc">
              <code>delete ctx[fn]</code> cleans up so the object is left untouched. Wrap 2&ndash;4 in{' '}
              <code>try/finally</code> so cleanup runs even if the function throws.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Variations across the three</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label"><code>call</code> &amp; <code>apply</code></span>
            <p className="phase-desc">Invoke now; args differ.</p>
            <ul className="phase-rules">
              <li><code>call</code>: args spread individually</li>
              <li><code>apply</code>: args as one array</li>
              <li>Both return the function&apos;s result</li>
              <li>Same attach-call-delete core</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label"><code>bind</code></span>
            <p className="phase-desc">Return a bound function.</p>
            <ul className="phase-rules">
              <li>Wrap a <code>call</code> in a returned fn</li>
              <li>Preset (curry) leading args</li>
              <li>Bound fn ignores re-binding by call/apply</li>
              <li><code>new</code> on a bound fn ignores bound <code>this</code></li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The bind edge cases are interview gold. (1) A bound function ignores later <code>call</code>/{' '}
            <code>apply</code> &mdash; the bind is sticky. (2) When called with <code>new</code>, a bound function uses
            the new object as <code>this</code>, <em>not</em> the bound <code>this</code> (Week 2 Day 5: new-binding
            beats explicit). (3) Preset args compose: <code>bind(ctx, 1)(2)</code> calls with <code>(1, 2)</code> &mdash;
            partial application.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why They&apos;re on <code>Function.prototype</code></h2>
        <p className="article-para">
          <code>call</code>/<code>apply</code> have been in JS since ES3 (1999) &mdash; essential for borrowing methods
          and controlling <code>this</code> before arrow functions existed. <code>bind</code> arrived in ES5 (2009) to
          solve the detached-method <code>this</code> bug permanently (the pre-callback pattern). All three live on{' '}
          <code>Function.prototype</code> so every function inherits them. The attach-call-delete trick is how
          polyfills implemented them before engines made them native &mdash; and it&apos;s still the clearest way to
          show you understand method-invocation <code>this</code>.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>call</code></th>
                <th><code>apply</code></th>
                <th><code>bind</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Invokes now?</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>No (returns fn)</td>
              </tr>
              <tr>
                <td>Arguments</td>
                <td>Individual</td>
                <td>Array</td>
                <td>Individual (preset)</td>
              </tr>
              <tr>
                <td>Re-bindable?</td>
                <td>One-shot</td>
                <td>One-shot</td>
                <td>Sticky</td>
              </tr>
              <tr>
                <td>Use case</td>
                <td>Borrow/immediate</td>
                <td>Args from array</td>
                <td>Callbacks/partial</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing <code>myCall</code></h2>

        <CodeBlock
          code={`function greet(g) { return g + ", " + this.name; }
const user = { name: "Tamjid" };
myCall(greet, user, "Hi"); // "Hi, Tamjid"`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>myCall(greet, user, "Hi")</code>: <code>thisArg = user</code> (not null), so <code>ctx = user</code>.
              Args after <code>thisArg</code> are <code>["Hi"]</code>.
            </span>
          </li>
          <li>
            <span>
              Attach: <code>ctx["__fn__"] = greet</code> (using a temp key). Now <code>user.__fn__</code> is the{' '}
              <code>greet</code> function. (Use a Symbol/random key in real code to avoid collisions.)
            </span>
          </li>
          <li>
            <span>
              Invoke: <code>ctx["__fn__"]("Hi")</code> &mdash; called as <code>user.__fn__()</code>, so implicit binding
              sets <code>this = user</code> inside <code>greet</code>. Returns <code>"Hi, Tamjid"</code>.
            </span>
          </li>
          <li>
            <span>
              Clean up: <code>delete ctx["__fn__"]</code>. <code>user</code> is back to its original shape. Return the
              captured result. Done &mdash; we forced <code>this</code> using only method invocation.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. <code>myCall</code></h3>
        <CodeBlock
          code={`Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;             // null/undefined → global
  const key = Symbol("fn");
  ctx[key] = this;                      // attach
  try { return ctx[key](...args); }     // invoke (this === ctx)
  finally { delete ctx[key]; }          // always clean up
};
function greet(g) { return g + ", " + this.name; }
greet.myCall({ name: "Tamjid" }, "Hi"); // "Hi, Tamjid"`}
          filename="call.js"
        />

        <h3 className="article-h3">2. <code>myApply</code> (args as array)</h3>
        <CodeBlock
          code={`Function.prototype.myApply = function (ctx, args = []) {
  ctx = ctx ?? globalThis;
  const key = Symbol("fn");
  ctx[key] = this;
  try { return ctx[key](...args); }
  finally { delete ctx[key]; }
};
greet.myApply({ name: "Tamjid" }, ["Hi"]); // "Hi, Tamjid"`}
          filename="apply.js"
        />

        <h3 className="article-h3">3. <code>myBind</code> (returns a bound function)</h3>
        <CodeBlock
          code={`Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...args) {
    return fn.myCall(ctx, ...preset, ...args); // sticky this + preset args
  };
};
const hi = greet.myBind({ name: "Tamjid" }, "Hi");
hi(); // "Hi, Tamjid" — bound fn, this can't be overridden by later call`}
          filename="bind.js"
        />

        <h3 className="article-h3">4. Bind preset args = partial application</h3>
        <CodeBlock
          code={`function add(a, b, c) { return a + b + c; }
const addTen = add.myBind(null, 10); // preset a=10
addTen(20, 30); // 60 — (10, 20, 30)`}
          filename="partial.js"
        />

        <h3 className="article-h3">5. Bound fns ignore re-binding</h3>
        <CodeBlock
          code={`const bound = greet.myBind({ name: "A" }, "Hi");
bound.myCall({ name: "B" }); // "Hi, A" — the bind is sticky; later call can't change \`this\``}
          filename="sticky.js"
        />

        <h3 className="article-h3">6. The <code>new</code> edge case (advanced)</h3>
        <CodeBlock
          code={`// A complete bind also respects \`new\` overriding the bound this:
Function.prototype.myBindFull = function (ctx, ...preset) {
  const fn = this;
  const bound = function (...args) {
    const isNew = new.target !== undefined;          // called with new?
    return (isNew ? fn : fn.myCall).call(
      isNew ? this : ctx, ...preset, ...args
    );
  };
  bound.prototype = Object.create(fn.prototype);     // for instanceof
  return bound;
};
// new (Bound)(...) → \`this\` is the new object, not the bound ctx (Week 2 Day 5).`}
          filename="new-edge.js"
        />

        <div className="article-callout">
          <p>
            The primitive-key choice matters: a plain string like <code>"__fn__"</code> could collide with an existing
            property (overwriting it), so production polyfills use a <code>Symbol</code> or a counter-generated unique
            name. And <code>try/finally</code> guarantees the delete runs even if the function throws &mdash; leaving the
            temp method behind is a real-world bug.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Implement <code>myCall</code>, <code>myApply</code>, and <code>myBind</code> on <code>Function.prototype</code>{' '}
            from scratch. Test all cases: basic invoke, null <code>this</code>, preset args, sticky re-bind, and the{' '}
            <code>new</code> override. Use a Symbol key and <code>try/finally</code> cleanup.
          </p>
        </div>

        <CodeBlock
          code={`Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;
  const key = Symbol("fn");
  ctx[key] = this;
  try { return ctx[key](...args); } finally { delete ctx[key]; }
};
Function.prototype.myApply = function (ctx, args = []) {
  ctx = ctx ?? globalThis;
  const key = Symbol("fn");
  ctx[key] = this;
  try { return ctx[key](...args); } finally { delete ctx[key]; }
};
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...args) { return fn.myCall(ctx, ...preset, ...args); };
};

// Tests:
function f(a, b) { return [this.name, a, b]; }
f.myCall({ name: "n" }, 1, 2);              // ["n", 1, 2]
f.myApply({ name: "n" }, [1, 2]);           // ["n", 1, 2]
const g = f.myBind({ name: "n" }, 1);
g(2);                                        // ["n", 1, 2] (preset a=1)
g.myCall({ name: "other" }, 9);             // ["n", 1, 9] — sticky this, preset arg`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does <code>g.myCall({'{ name: "other" }'}, 9)</code> still log <code>"n"</code>? (Because{' '}
            <code>myBind</code> captured <code>ctx</code> in its closure; the returned function always calls{' '}
            <code>fn.myCall(ctx, ...)</code> with that captured <code>ctx</code>, ignoring whatever <code>this</code>{' '}
            the bound function is later called with. That stickiness is the whole point of <code>bind</code> &mdash; the
            detached-method fix from Week 2 Day 4.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Implement <code>call</code>.</h4>
            <p className="iq-a">
              <code>{'Function.prototype.myCall = function (ctx, ...args) { ctx = ctx ?? globalThis; const key = Symbol("fn"); ctx[key] = this; try { return ctx[key](...args); } finally { delete ctx[key]; } };'}</code>{' '}
              The trick: attach the function to the target as a temporary property, invoke it as a method (so{' '}
              <code>this</code> is the target via implicit binding), then delete the property. Use a Symbol key to avoid
              collisions and <code>try/finally</code> to guarantee cleanup.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Difference between <code>call</code> and <code>apply</code>?</h4>
            <p className="iq-a">
              Only how arguments are passed. <code>call(thisArg, a, b, c)</code> takes them individually;{' '}
              <code>apply(thisArg, [a, b, c])</code> takes them as a single array. Both invoke immediately with the
              specified <code>this</code> and return the function&apos;s result. <code>apply</code> is useful when you
              already have an array (e.g., <code>Math.max.apply(null, nums)</code>); modern spread (<code>fn(...arr)</code>{' '}
              <code> </code>) often replaces it.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Implement <code>bind</code>.</h4>
            <p className="iq-a">
              <code>{'Function.prototype.myBind = function (ctx, ...preset) { const fn = this; return function (...args) { return fn.call(ctx, ...preset, ...args); }; };'}</code>{' '}
              Capture the function and target in a closure; return a new function that calls the original via{' '}
              <code>call</code> with the captured <code>this</code> and the preset (curried) args prepended to any
              runtime args. The bind is sticky because the closure ignores the bound function&apos;s own{' '}
              <code>this</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why use a Symbol key (not a string) for the temp property?</h4>
            <p className="iq-a">
              To avoid collisions. A string key like <code>"__fn__"</code> might already exist on the target object,
              overwriting a real property &mdash; a subtle bug. A Symbol is guaranteed unique, so attaching the function
              under it can&apos;t clobber anything. (A counter-generated random string is the older alternative.) The
              property is also non-enumerable in practice, keeping the object&apos;s shape clean.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What happens if you <code>new</code> a bound function?</h4>
            <p className="iq-a">
              The bound <code>this</code> is ignored &mdash; <code>new</code> creates a fresh object and uses it as{' '}
              <code>this</code> (new-binding beats explicit binding, Week 2 Day 5). However, the preset (curried) args
              still apply. A spec-complete <code>bind</code> detects <code>new</code> (via <code>new.target</code>) and
              calls the original with the new object instead of the bound context, and sets up <code>prototype</code> so{' '}
              <code>instanceof</code> works. This is the bind edge case interviewers love.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why does a bound function ignore later <code>call</code>/<code>apply</code>?</h4>
            <p className="iq-a">
              Because the bound function is a wrapper that calls the original with a <em>closured</em> <code>this</code>,
              not its own <code>this</code>. When you <code>boundFn.call(otherObj)</code>, the wrapper still calls{' '}
              <code>original.call(boundCtx)</code> &mdash; the <code>otherObj</code> is the wrapper&apos;s{' '}
              <code>this</code>, which it ignores. This stickiness is the feature: it makes <code>bind</code> reliable
              for callbacks that would otherwise lose their <code>this</code>.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Implement a spec-complete <code>bind</code> including the <code>new</code> override and prototype.</h4>
            <p className="iq-a">
              <code>{'Function.prototype.myBind = function (ctx, ...preset) { const fn = this; const bound = function (...args) { const isNew = new.target !== undefined; const thisArg = isNew ? this : ctx; return fn.apply(thisArg, [...preset, ...args]); }; Object.setPrototypeOf(bound.prototype || {}, fn.prototype); bound.prototype = Object.create(fn.prototype); return bound; };'}</code>{' '}
              The returned function checks <code>new.target</code>: if called with <code>new</code>, it uses the
              freshly-created <code>this</code> (new binding wins); otherwise the bound <code>ctx</code>. Preset args
              always prepend. We set <code>bound.prototype</code> to an object linked to <code>fn.prototype</code> so{' '}
              <code>new bound(...)</code> instances have the right prototype chain and <code>instanceof</code> works.
              (Native <code>bind</code> also makes the bound function have no own <code>prototype</code> and a{' '}
              <code>length</code> reflecting remaining args &mdash; finer details the spec mandates for full
              compliance.)
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
