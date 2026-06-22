import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('js-engine-internals')!
const navItems = weekNav(week)

export default function EngineDay6() {
  const { prev, next } = dayNavLinks(week, 6)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[5].title}</h1>
        <p className="lesson-subtitle">
          Every behavior you&apos;ve learned across six weeks is defined in one place: ECMA-262. Learn to read it and
          you stop guessing &mdash; you look up the truth.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>ECMA-262</strong> is the official specification of JavaScript &mdash; the document that defines, in
            precise algorithmic steps, exactly how every operation behaves. It uses <strong>abstract operations</strong>{' '}
            (named pseudo-algorithms) to describe semantics independent of any engine.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Spec operations are written as numbered steps (&ldquo;1. Let <code>x</code> be &hellip; 2. If &hellip;
            return&hellip;&rdquo;), referencing <strong>Specification Types</strong> like <em>Records</em> ({' '}
            <em>Completion</em>, <em>Property Descriptor</em>, <em>Environment Record</em>) and abstract operations
            like <code>ToNumber</code>, <code>OrdinaryGetOwnProperty</code>.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            When behavior is subtle, surprising, or version-dependent: coercion edge cases, equality semantics,
            prototype resolution, <code>this</code> binding, new syntax. The spec is the final authority &mdash; and
            the source every engine implements against.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          For six weeks you&apos;ve learned JavaScript from explanations and examples. Today you meet the source those
          explanations come from: <strong>ECMA-262</strong>, the ECMAScript Language Specification. It&apos;s dense and
          formal, but it has one unbeatable property &mdash; it&apos;s the <em>definition</em>. When behavior is
          ambiguous or surprising, the spec settles it.
        </p>

        <CodeBlock
          code={`// Why is [] == ![] true? Why is 0.1 + 0.2 !== 0.3?
// Why does \`this\` differ in arrow vs regular functions?
// Every answer traces back to a numbered algorithm in ECMA-262.
// Example: the \`==\` operator's steps define exactly what coercions happen.`}
          filename="intro.js"
        />

        <p className="article-para">
          Reading the spec is a skill. It uses a stylized pseudo-code (&ldquo;abstract operations&rdquo;) and special
          types you won&apos;t see in real code. But once you can decode it, you have a superpower: the ability to
          resolve any question about JavaScript authoritatively &mdash; not from a blog that might be wrong, but from
          the definition engines implement.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">ECMA-262</dt>
            <dd className="def-text">
              The ECMAScript Language Specification &mdash; the standard defining JavaScript&apos;s syntax and
              semantics. Maintained by TC39; a new edition yearly (ES2023, ES2024, &hellip;). The source of truth.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Abstract operation</dt>
            <dd className="def-text">
              A named pseudo-algorithm in the spec (e.g., <code>ToNumber</code>, <code>OrdinaryHasInstance</code>).
              Written as numbered steps; not real code, but the precise definition engines implement.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Specification Type</dt>
            <dd className="def-text">
              A spec-only data structure: <em>Records</em> (field bags like <em>Completion Record</em>, <em>Property
              Descriptor</em>, <em>Environment Record</em>), <em>Lists</em>, <em>Sets</em>. Not exposed in JS &mdash;
              they&apos;re how the spec describes engine internals.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><em>Completion Record</em></dt>
            <dd className="def-text">
              The spec&apos;s way of representing a result with a control-flow side: <code>{'{type, value, target}'}</code>{' '}
              where type is <code>normal</code>, <code>return</code>, <code>throw</code>, <code>break</code>, or{' '}
              <code>continue</code>. Every statement/operation produces one.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Recipe Book Analogy</h2>
        <p className="article-para">
          Blogs and tutorials are like <strong>friends describing a dish</strong> &mdash; helpful, but each leaves out
          details and adds opinions. ECMA-262 is the <strong>official recipe book</strong> the kitchen follows: every
          step numbered, every ingredient measured, every technique defined (&ldquo;fold until just combined&rdquo;
          has an exact procedure). It&apos;s harder to read than a friend&apos;s summary, but when dishes turn out
          differently in different kitchens, only the official recipe resolves why.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">📖</span>
            <span className="analogy-label">The official recipe book</span>
            <span className="analogy-target">ECMA-262 (the spec)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔢</span>
            <span className="analogy-label">Numbered, measured steps</span>
            <span className="analogy-target">Abstract operations</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧂</span>
            <span className="analogy-label">Defined techniques</span>
            <span className="analogy-target">Specification Types</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">👨‍🍳</span>
            <span className="analogy-label">The kitchens following it</span>
            <span className="analogy-target">V8, SpiderMonkey, JSC</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The spec is <em>descriptive</em>, not <em>prescriptive about implementation</em>. It says &ldquo;{' '}
            <code>ToNumber(undefined)</code> is <code>NaN</code>&rdquo; &mdash; not how the engine computes that. V8,
            SpiderMonkey, and JSC can implement it however they like, as long as the observable behavior matches. This
            separation is why the same JS runs across engines: they agree on the recipe (the spec), even if their
            kitchens (internals) differ.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; How to Read the Spec</h2>
        <p className="article-para">
          The spec has a grammar of its own. Learn the conventions and the algorithms become readable &mdash; even
          useful for predicting exact behavior.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. &ldquo;Let X be &hellip;&rdquo; / &ldquo;Return &hellip;&rdquo;</h4>
            <p className="theory-desc">
              Variable binding and result. Steps introduce names (<code>Let len be &hellip;</code>) and produce values
              (<code>Return &hellip;</code>). Read it as straight-line pseudo-code.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Abstract operations are callable</h4>
            <p className="theory-desc">
              <code>Call(abs, V, argumentsList)</code>, <code>OrdinaryGet(O, P, Receiver)</code> &mdash; these name
              sub-algorithms defined elsewhere. Follow the reference to see the full procedure.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <em>Records</em> group fields</h4>
            <p className="theory-desc">
              A <em>Property Descriptor</em> is <code>{'{[[Value]], [[Writable]], [[Get]], ...}'}</code>; an{' '}
              <em>Environment Record</em> holds bindings. Double-bracket <code>[[Field]]</code> means an internal slot
              or method, not accessible from JS.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. <em>Completion Records</em> model control flow</h4>
            <p className="theory-desc">
              Every operation returns one. A <code>throw</code> produces <code>{'{type: throw, value: error}'}</code>;
              the surrounding algorithm checks the type and propagates. This is how the spec describes exceptions
              short-circuiting without real try/catch in its pseudo-code.
            </p>
          </div>
        </div>

        <h3 className="article-h3">A real example: <code>0.1 + 0.2 !== 0.3</code></h3>
        <CodeBlock
          code={`// Why is 0.1 + 0.2 === 0.30000000000000004?
// Spec: the \`+\` operator (13.15.3) → ApplyStringOrNumericBinaryOperator
//   → ToNumeric on each → both are Number → Number::add(x, y)
// Number::add returns the IEEE-754 double-precision sum of the two.
// 0.1 and 0.2 are NOT exactly representable in binary floating point;
// their nearest representable values sum to the nearest representable
// value of ...4. The spec defers to IEEE-754 — the "bug" is the format.`}
          filename="float.js"
        />

        <h3 className="article-h3">The <code>[]</code> == <code>![]</code> trace</h3>
        <CodeBlock
          code={`// Why is [] == ![] true? Follow the spec's \`==\` (IsLooselyEqual):
// 1. ![] → ToBoolean([]) → true (arrays are truthy) → !true → false. So RHS = false.
// 2. [] == false → types differ (Object vs Boolean) → ToNumber(false) = 0.
// 3. [] == 0 → ToPrimitive([]) (hint number) → [].valueOf() is [], not primitive,
//    → [].toString() → "" (empty string). So LHS = "".
// 4. "" == 0 → ToNumber("") = 0 → 0 == 0 → true.
// Each coercion is a spec abstract operation. No magic — just steps.`}
          filename="loose-eq.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">When to consult the spec</span>
            <p className="phase-desc">Edge cases and disputed behavior.</p>
            <ul className="phase-rules">
              <li>Coercion / equality corner cases</li>
              <li>Exact iteration/property order</li>
              <li><code>this</code> binding rules</li>
              <li>New syntax semantics</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">When not to</span>
            <p className="phase-desc">Day-to-day code &mdash; use MDN.</p>
            <ul className="phase-rules">
              <li>API usage &amp; examples</li>
              <li>Browser support / polyfills</li>
              <li>Normal idioms</li>
              <li>MDN links to the spec when you need it</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The workflow: hit a surprising behavior &rarr; check MDN (friendly summary + links) &rarr; if unconvinced,
            follow MDN&apos;s spec link to ECMA-262 and read the abstract operation. Over time you&apos;ll recognize
            recurring operations (<code>ToPrimitive</code>, <code>ToNumber</code>, <code>OrdinaryGet</code>,
            <code> Call</code>) and the spec stops feeling impenetrable. It&apos;s the difference between knowing JS
            and <em>understanding</em> JS.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; the Living Spec</h2>
        <p className="article-para">
          ECMA-262 began as ES1 (1997), standardizing what Netscape had built. ES3 (1999) was the baseline for a decade;
          ES5 (2009) brought strict mode and <code>Object</code> methods; ES6/ES2015 was the revolution (classes,
          modules, promises, arrows, let/const). Since 2015 the spec ships yearly (ES2016, &hellip;, ES2024), each
          adding features through TC39&apos;s proposal stages. The spec is now a living document hosted on GitHub &mdash;
          you can read the latest draft anytime, and every behavior in this course traces back to a clause in it. The
          formal style (abstract operations, Completion Records) evolved to make the language precisely defined for
          multiple competing engine implementers.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>ECMA-262 (spec)</th>
                <th>MDN (docs)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Authority</td>
                <td>The definition</td>
                <td>Explains the definition</td>
              </tr>
              <tr>
                <td>Style</td>
                <td>Formal algorithms</td>
                <td>Prose + examples</td>
              </tr>
              <tr>
                <td>Best for</td>
                <td>Resolving ambiguity</td>
                <td>Learning / daily use</td>
              </tr>
              <tr>
                <td>Coverage</td>
                <td>Language core only</td>
                <td>Core + Web APIs</td>
              </tr>
              <tr>
                <td>Reading effort</td>
                <td>High</td>
                <td>Low</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Resolving a Question from the Spec</h2>

        <CodeBlock
          code={`// Question: what does \`{} + []\` evaluate to, and why?
// (Pretend it's parsed as an expression, not a block statement.)`}
          filename="question.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              Start at the operator: <code>+</code> (spec &sect;13.15.3, <code>ApplyStringOrNumericBinaryOperator</code>{' '}
              after <code>EvaluateStringOrNumericBinaryExpression</code>). It calls <code>ToPrimitive</code> on both
              operands with hint <code>number</code>.
            </span>
          </li>
          <li>
            <span>
              RHS <code>[]</code>: <code>ToPrimitive([], number)</code> &rarr; <code>[].valueOf()</code> returns{' '}
              <code>[]</code> (not primitive) &rarr; fall back to <code>[].toString()</code> &rarr; <code>""</code> (empty
              string).
            </span>
          </li>
          <li>
            <span>
              LHS <code>{'{}'}</code>: <code>ToPrimitive({}, number)</code> &rarr; <code>({}).valueOf()</code> returns the
              object &rarr; <code>({}).toString()</code> &rarr; <code>"[object Object]"</code>.
            </span>
          </li>
          <li>
            <span>
              Now <code>"[object Object]" + ""</code>. Per the <code>+</code> spec, if either operand after{' '}
              <code>ToPrimitive</code> is a string, do string concatenation &rarr;{' '}
              <code>"[object Object]"</code>.
            </span>
          </li>
          <li>
            <span>
              Answer: <code>&quot;[object Object]&quot;</code>. Every step came from a named abstract operation
              (<code>ToPrimitive</code>, <code>valueOf</code>, <code>toString</code>, the <code>+</code> rule). No
              guessing &mdash; the spec walked us through.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. <code>ToPrimitive</code> in action</h3>
        <CodeBlock
          code={`// ToPrimitive(obj, hint) tries valueOf, then toString
const o = {
  valueOf() { return 42; },
  toString() { return "forty-two"; },
};
o + 1;        // 43 — valueOf used (hint default → number for +)
\`\${o}\`;       // "42" — valueOf still preferred for hint string? Actually
              // hint string → toString → "forty-two". (Check the spec!)`}
          filename="toprimitive.js"
        />

        <h3 className="article-h3">2. <code>Symbol.toPrimitive</code> overrides the protocol</h3>
        <CodeBlock
          code={`const m = {
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return 99;
    if (hint === "string") return "MONEY";
    return "default";
  },
};
+m;        // 99      (number hint)
\`\${m}\`;   // "MONEY" (string hint)
m + "";    // "default" (+ default hint → string concat)`}
          filename="to-primitive-symbol.js"
        />

        <h3 className="article-h3">3. Property iteration order (integer keys first)</h3>
        <CodeBlock
          code={`const o = { b: 1, 2: 2, a: 3, 1: 4 };
Object.keys(o); // ["1","2","b","a"]
// Spec (OrdinaryOwnPropertyKeys): integer-index keys ascending first, then
// string keys in insertion order. Defined precisely — not engine-specific.`}
          filename="order.js"
        />

        <h3 className="article-h3">4. <code>this</code> binding by the spec</h3>
        <CodeBlock
          code={`// Spec defines \`ResolveThisBinding\` and how each call form sets it:
obj.method();    // OrdinaryCall → \`this\` is the base (obj)
const f = obj.method; f(); // \`this\` is undefined (strict) / global (sloppy)
new F();         // Construct → \`this\` is the new object (Week 3 Day 3)
// Each rule is a spec algorithm. The four rules (Week 2 Day 5) are the
// readable summary; the spec is the precise definition.`}
          filename="this-spec.js"
        />

        <h3 className="article-h3">5. Reading the latest draft</h3>
        <CodeBlock
          code={`// The spec is at tc39.es/ecma262/ (latest draft, free).
// Search by clause or operation name (e.g. "OrdinaryGetOwnProperty").
// MDN pages link to the relevant clause under "Specifications".
// For proposals in progress, see github.com/tc39/proposals (stage 4 = shipped).`}
          filename="reading.js"
        />

        <h3 className="article-h3">6. Internal slots (<code>[[&hellip;]]</code>) aren&apos;t JS-visible</h3>
        <CodeBlock
          code={`// A bound function has [[BoundTargetFunction]], [[BoundThis]], [[BoundArguments]].
// A Promise has [[PromiseState]], [[PromiseResult]], [[PromiseFulfillReactions]].
// These are spec-internal; you can't read them from JS. They explain HOW
// the object behaves, but aren't properties you can access.`}
          filename="internal-slots.js"
        />

        <div className="article-callout">
          <p>
            Two reading tips: (1) read the spec operationally &mdash; pretend you&apos;re the engine executing the
            steps with concrete values; (2) follow abstract-operation references recursively. You&apos;ll often hop
            through two or three (<code>+</code> &rarr; <code>ToPrimitive</code> &rarr; <code>OrdinaryToPrimitive</code>{' '}
            &rarr; <code>toString</code>) before reaching ground truth. That traversal <em>is</em> the learning.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Pick three surprising expressions (<code>[] == ![]</code>, <code>{'{} + []'}</code>,{' '}
            <code>typeof null</code>), predict the result, then resolve each from ECMA-262 by following the abstract
            operations. Write down each step&apos;s operation name. You&apos;ll likely bounce through MDN first.
          </p>
        </div>

        <CodeBlock
          code={`// Resolve these from the spec (predict first):
[] == ![];          // true   — trace: ! → ToBoolean; == → ToNumber, ToPrimitive
{} + [];            // "[object Object]" — ToPrimitive each, + concatenates
typeof null;        // "object" — spec: Type(null) → "object" (a documented bug)
1 + "2" + 3;        // "123" — + is left-assoc: (1+"2")="12", "12"+3="123"

// For each, note the operation chain:
//   [] == ![]  →  IsLooselyEqual → ToBoolean → ToNumber → ToPrimitive → ...
// Practice reading the spec by name, not by guessing.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why is <code>typeof null === &quot;object&quot;</code>? (It&apos;s a documented &ldquo;bug&rdquo; from JS&apos;s
            first implementation: values were tagged with a type prefix, and the object tag was <code>000</code>, which{' '}
            <code>null</code>&apos;s null pointer matched. The spec preserves it for backward compatibility &mdash;
            <code>Type(null)</code> is defined to return <code>&quot;object&quot;</code>. This is a great example of the
            spec enshrining a historical quirk.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is ECMA-262?</h4>
            <p className="iq-a">
              The ECMAScript Language Specification &mdash; the official standard defining JavaScript&apos;s syntax and
              semantics. Maintained by TC39, published yearly (ES2024, &hellip;). It defines behavior as precise
              algorithms (abstract operations) using spec-only types, independent of any engine. It&apos;s the source
              of truth every JS engine implements against.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is an abstract operation in the spec?</h4>
            <p className="iq-a">
              A named pseudo-algorithm (e.g., <code>ToNumber</code>, <code>OrdinaryGet</code>) defining part of the
              language&apos;s semantics in numbered steps. Not real code, but the precise definition engines follow.
              Operations call other operations, forming a graph of definitions that bottoms out at fundamental types
              and math.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why does the spec use <em>Completion Records</em>?</h4>
            <p className="iq-a">
              To model control flow (return/throw/break/continue) within its pseudo-code without real exceptions. Every
              operation returns a <em>Completion Record</em> <code>{'{type, value, target}'}</code>; surrounding steps
              check the type and propagate abrupt completions (a throw short-circuits). It lets the spec describe
              exception short-circuiting uniformly across all operations.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Spec vs MDN &mdash; when do you use each?</h4>
            <p className="iq-a">
              MDN for daily use &mdash; friendly explanations, examples, browser support, and it links to the spec.
              ECMA-262 for resolving ambiguity, edge cases, or exact semantics &mdash; when you need the authoritative
              definition, not a summary. The workflow is MDN first, spec when MDN doesn&apos;t fully settle it.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Trace why <code>[] == ![]</code> is <code>true</code> from the spec.</h4>
            <p className="iq-a">
              (1) RHS: <code>![]</code> &rarr; <code>ToBoolean([])</code> is <code>true</code> (arrays are truthy) &rarr;
              <code> !true</code> is <code>false</code>. (2) Now <code>[] == false</code>: types differ (Object vs
              Boolean) &rarr; <code>ToNumber(false)</code> is <code>0</code>. (3) <code>[] == 0</code>: Object vs
              Number &rarr; <code>ToPrimitive([])</code> (number hint) &rarr; <code>[].valueOf()</code> is{' '}
              <code>[]</code> (not primitive) &rarr; <code>[].toString()</code> is <code>""</code>. (4){' '}
              <code>"" == 0</code>: String vs Number &rarr; <code>ToNumber("")</code> is <code>0</code>. (5){' '}
              <code>0 == 0</code> is <code>true</code>. Every step is a named abstract operation
              (<code>ToBoolean</code>, <code>ToNumber</code>, <code>ToPrimitive</code>, <code>OrdinaryToPrimitive</code>).
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why is <code>typeof null === &quot;object&quot;</code>?</h4>
            <p className="iq-a">
              A historical artifact preserved for backward compatibility. In JS&apos;s first implementation, values
              carried a type tag; the object tag was <code>000</code>, and <code>null</code>&apos;s null pointer
              happened to match it, so <code>typeof null</code> reported <code>&quot;object&quot;</code>. Fixing it
              would break existing code, so the spec enshrines it: <code>Type(null)</code> is defined to return{' '}
              <code>&quot;object&quot;</code>. A classic example of the spec codifying a quirk for compatibility.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How would you use the spec to answer a disputed behavior question definitively?</h4>
            <p className="iq-a">
              Identify the operation in question (e.g., &ldquo;what&apos;s the order of <code>Object.keys</code>?&rdquo;
              &rarr; <code>OrdinaryOwnPropertyKeys</code>; &ldquo;what does <code>+</code> do with two objects?&rdquo;
              &rarr; <code>EvaluateStringOrNumericBinaryExpression</code> + <code>ApplyStringOrNumericBinaryOperator</code>{' '}
              + <code>ToPrimitive</code>). Open the latest ECMA-262 draft (tc39.es/ecma262), find the clause, and
              execute the numbered steps with concrete values, following abstract-operation references recursively until
              you reach ground definitions. The result is authoritative because engines implement against this exact
              algorithm &mdash; any disagreement is an engine bug. The skill is operational reading: treat each{' '}
              <code>Let X be &hellip;</code> as binding a value and walk through. Over time you internalize recurring
              operations (<code>ToPrimitive</code>, <code>ToNumber</code>, <code>OrdinaryGet</code>,{' '}
              <code>Call</code>, <code>OrdinaryHasInstance</code>) and the spec becomes a practical reference, not an
              impenetrable wall. This is the capstone skill: the ability to settle any JS question from first
              principles.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
