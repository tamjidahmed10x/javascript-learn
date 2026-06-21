import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('advanced-patterns')!
const navItems = weekNav(week)

export default function AdvancedDay6() {
  const { prev, next } = dayNavLinks(week, 6)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[5].title}</h1>
        <p className="lesson-subtitle">
          The seventh primitive type &mdash; unique, non-colliding keys that won&apos;t clash with anyone&apos;s
          strings. The language&apos;s escape hatch for protocol hooks.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <strong>Symbol</strong> is a unique, immutable primitive. <code>Symbol(&quot;id&quot;)</code> produces a
            brand-new value guaranteed different from every other symbol, even one with the same description. Used as
            object keys, symbols never collide with string keys.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Each <code>Symbol()</code> call is unique; the optional description is just a label for debugging. Symbols
            work as object property keys but are skipped by <code>for...in</code> and <code>Object.keys</code> &mdash;
            use <code>Object.getOwnPropertySymbols</code> to find them.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            To attach non-clashing metadata to objects you don&apos;t own, and to implement the language&apos;s{' '}
            <strong>well-known symbols</strong> (<code>Symbol.iterator</code>, <code>Symbol.toPrimitive</code>, &hellip;)
            that hook into built-in behavior.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Before symbols, every object key was a string, and adding metadata risked colliding with the owner&apos;s
          keys. Symbols fix that: they&apos;re a primitive type where each value is <strong>unique</strong>, so a
          symbol key can&apos;t clash with any string &mdash; or with another library&apos;s symbol.
        </p>

        <CodeBlock
          code={`const id = Symbol("id");
const obj = { [id]: 42, name: "Tamjid" };

obj["name"]; // "Tamjid"
obj[id];     // 42
obj[Symbol("id")]; // undefined — a DIFFERENT symbol, even same description

Object.keys(obj);                    // ["name"] — symbol keys excluded
Object.getOwnPropertySymbols(obj);   // [Symbol(id)] — only way to see them`}
          filename="intro.js"
        />

        <p className="article-para">
          Two ideas in one feature: <strong>uniqueness</strong> (every <code>Symbol()</code> is fresh, so no
          collisions) and <strong>privacy-by-convention</strong> (symbol keys are invisible to the usual enumeration).
          Combined with the <em>well-known</em> symbols, they let you plug into the language itself.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Symbol</dt>
            <dd className="def-text">
              A primitive type whose values are unique and immutable. Created with <code>Symbol(description)</code>{' '}
              (never <code>new</code>). Two symbols are never equal unless they&apos;re the same value.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Description</dt>
            <dd className="def-text">
              An optional string passed to <code>Symbol()</code> &mdash; purely a debugging label. It does not affect
              identity or equality; <code>Symbol(&quot;x&quot;) !== Symbol(&quot;x&quot;)</code>.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Well-known symbols</dt>
            <dd className="def-text">
              Pre-defined symbols on the <code>Symbol</code> object (<code>Symbol.iterator</code>,{' '}
              <code>Symbol.toPrimitive</code>, <code>Symbol.hasInstance</code>, &hellip;) that the engine looks for to
              customize built-in behavior.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Symbol registry (<code>Symbol.for</code>)</dt>
            <dd className="def-text">
              A global registry of &ldquo;shared&rdquo; symbols keyed by string. <code>Symbol.for(&quot;k&quot;)</code>{' '}
              returns the same symbol across the whole realm &mdash; opt-in global identity, unlike plain{' '}
              <code>Symbol()</code>.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Serial Number Analogy</h2>
        <p className="article-para">
          A string key is like a <strong>name tag</strong>: two people can have the same name and confuse you. A
          symbol is like a <strong>unique serial number</strong>: even if two serial numbers read the same on the
          label, they identify different items &mdash; no mix-up possible. That&apos;s why a library can attach a
          symbol key to your object and never worry about overwriting your <code>"name"</code> or anyone else&apos;s
          <code> "id"</code>.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏷️</span>
            <span className="analogy-label">Name tag (string key)</span>
            <span className="analogy-target">Can collide</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔢</span>
            <span className="analogy-label">Serial number (symbol)</span>
            <span className="analogy-target">Always unique</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🙈</span>
            <span className="analogy-label">Hidden from <code>for...in</code></span>
            <span className="analogy-target">Privacy by convention</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🪝</span>
            <span className="analogy-label">Well-known hooks</span>
            <span className="analogy-target">Language protocols</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Symbols are <em>not</em> true privacy &mdash; <code>Object.getOwnPropertySymbols</code> reveals them, and{' '}
            <code>Reflect.ownKeys</code> includes them. They&apos;re &ldquo;don&apos;t accidentally clash and
            don&apos;t show up in normal loops.&rdquo; For real enforced privacy, use private fields (<code>#</code>,
            Week 3 Day 4). Symbols solve the <em>collision</em> problem; <code>#</code> solves the <em>access</em>{' '}
            problem.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          Symbols exist for two distinct reasons, and understanding both is the key to using them well.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Unique non-string keys</h4>
            <p className="theory-desc">
              <code>Symbol()</code> returns a brand-new unique value each call. As an object key it can&apos;t collide
              with string keys or other symbols &mdash; perfect for attaching metadata to objects you don&apos;t own.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Invisible to normal enumeration</h4>
            <p className="theory-desc">
              <code>for...in</code>, <code>Object.keys</code>, and <code>JSON.stringify</code> skip symbol keys. Only{' '}
              <code>Object.getOwnPropertySymbols</code> and <code>Reflect.ownKeys</code> reveal them.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Well-known symbols are protocol hooks</h4>
            <p className="theory-desc">
              The engine reads specific symbols off objects to customize behavior: <code>Symbol.iterator</code> (Day 2),
              <code> Symbol.toPrimitive</code>, <code>Symbol.hasInstance</code>, <code>Symbol.asyncIterator</code>,
              &hellip; Implementing one plugs your object into the language.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. <code>Symbol.for</code> creates a shared global symbol</h4>
            <p className="theory-desc">
              Plain <code>Symbol()</code> is unique per call; <code>Symbol.for(&quot;key&quot;)</code> looks up (or
              creates) a <em>global</em> symbol shared across the realm, so two callers get the same one. Use it when
              you need cross-module agreement.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Well-known symbols &mdash; the protocol hooks</h3>
        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>What it customizes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Symbol.iterator</code></td>
                <td><code>for...of</code>, spread (Day 2)</td>
              </tr>
              <tr>
                <td><code>Symbol.asyncIterator</code></td>
                <td><code>for await...of</code></td>
              </tr>
              <tr>
                <td><code>Symbol.toPrimitive</code></td>
                <td>Type coercion (<code>obj + 1</code>, <code>${'`${obj}`'}</code>)</td>
              </tr>
              <tr>
                <td><code>Symbol.hasInstance</code></td>
                <td><code>x instanceof Foo</code></td>
              </tr>
              <tr>
                <td><code>Symbol.toStringTag</code></td>
                <td><code>Object.prototype.toString.call(obj)</code></td>
              </tr>
              <tr>
                <td><code>Symbol.isConcatSpreadable</code></td>
                <td>Whether <code>concat</code> flattens</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Plain <code>Symbol()</code></span>
            <p className="phase-desc">Unique per call &mdash; module-private identity.</p>
            <ul className="phase-rules">
              <li><code>Symbol(&quot;x&quot;) !== Symbol(&quot;x&quot;)</code></li>
              <li>Use for non-clashing local keys</li>
              <li>Not shared across modules</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label"><code>Symbol.for()</code> (global registry)</span>
            <p className="phase-desc">Shared across the realm by string key.</p>
            <ul className="phase-rules">
              <li><code>Symbol.for(&quot;x&quot;) === Symbol.for(&quot;x&quot;)</code></li>
              <li>Use for cross-module agreement</li>
              <li>Reverse with <code>Symbol.keyFor</code></li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            <code>Symbol</code> is the seventh and last primitive type (after <code>undefined</code>, <code>null</code>,
            boolean, number, string, bigint). <code>typeof Symbol()</code> is <code>"symbol"</code>. It is immutable and
            passed by value, like other primitives &mdash; but used as a key it provides object-property semantics. This
            dual nature (primitive value + property key) is what makes it the protocol-hook type.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Symbols Exist</h2>
        <p className="article-para">
          Symbols shipped in ES6 (2015) to solve two real problems. First, the &ldquo;expando&rdquo; collision: mixins
          and libraries attaching data to objects they didn&apos;t own kept overwriting each other&apos;s string keys.
          Second, the language needed new protocol hooks (like iteration) without adding reserved string property names
          that might clash with existing code. Unique, non-string keys solved both: libraries get collision-free
          metadata, and the spec defines <code>Symbol.iterator</code> etc. as the hooks <code>for...of</code> looks for
          &mdash; impossible to accidentally collide with a user&apos;s <code>"iterator"</code> string.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>String key</th>
                <th>Symbol key</th>
                <th>Private field <code>#x</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Collision risk</td>
                <td>High (shared namespace)</td>
                <td>None (unique)</td>
                <td>None (syntax-enforced)</td>
              </tr>
              <tr>
                <td>Seen by <code>for...in</code></td>
                <td>Yes</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Accessible outside owner?</td>
                <td>Yes</td>
                <td>Yes (via introspection)</td>
                <td>No (syntax error)</td>
              </tr>
              <tr>
                <td>Best for</td>
                <td>Normal public properties</td>
                <td>Metadata, protocol hooks</td>
                <td>True private state</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Hooking into the Language with a Well-Known Symbol</h2>

        <CodeBlock
          code={`class Money {
  constructor(amount, currency) { this.amount = amount; this.currency = currency; }
  [Symbol.toPrimitive](hint) {
    if (hint === "string") return \`\${this.amount} \${this.currency}\`;
    return this.amount; // "number" or "default"
  }
  get [Symbol.toStringTag]() { return "Money"; }
}

const price = new Money(99, "USD");
\`\${price}\`;                          // "99 USD"  (string hint)
price + 1;                            // 100       (default hint)
Object.prototype.toString.call(price); // "[object Money]"`}
          filename="hook.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              When the engine needs to coerce <code>price</code> to a primitive (template literal, <code>+</code>,{' '}
              <code>==</code>), it checks for a <code>Symbol.toPrimitive</code> method and calls it with a{' '}
              <code>hint</code>: <code>"string"</code>, <code>"number"</code>, or <code>"default"</code>.
            </span>
          </li>
          <li>
            <span>
              <code>{'`${price}`'}</code> needs a string &rarr; hint <code>"string"</code> &rarr; returns{' '}
              <code>"99 USD"</code>. The engine never falls back to <code>toString</code>/<code>valueOf</code> because{' '}
              <code>Symbol.toPrimitive</code> took precedence.
            </span>
          </li>
          <li>
            <span>
              <code>price + 1</code> has no clear preference &rarr; hint <code>"default"</code> &rarr; returns the
              number <code>99</code>, then <code>+ 1</code> = 100.
            </span>
          </li>
          <li>
            <span>
              <code>Object.prototype.toString.call</code> reads <code>Symbol.toStringTag</code> (here a getter
              returning <code>"Money"</code>) to format the classic <code>"[object Money]"</code> string.
            </span>
          </li>
          <li>
            <span>
              By implementing well-known symbols, you customize how the language treats your object &mdash; without
              adding any string keys that could collide with anything.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Unique, non-colliding metadata</h3>
        <CodeBlock
          code={`const meta = Symbol("meta");
function tag(obj, data) { obj[meta] = data; return obj; }
function read(obj) { return obj[meta]; }

const user = { name: "Tamjid" };
tag(user, { visits: 3, lastSeen: Date.now() });
read(user);            // { visits: 3, ... }
user["meta"];          // undefined — no string collision
Object.keys(user);     // ["name"] — symbol hidden`}
          filename="metadata.js"
        />

        <h3 className="article-h3">2. <code>Symbol.iterator</code> (revisit Day 2)</h3>
        <CodeBlock
          code={`const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let i = this.from;
    return { next: () => i <= this.to ? { value: i++, done: false } : { value: undefined, done: true } };
  },
};
[...range]; // [1, 2, 3] — the symbol key is what \`for...of\` looks for`}
          filename="iterator-symbol.js"
        />

        <h3 className="article-h3">3. <code>Symbol.hasInstance</code> &mdash; customize <code>instanceof</code></h3>
        <CodeBlock
          code={`const isEven = {
  [Symbol.hasInstance](x) { return typeof x === "number" && x % 2 === 0; },
};
4 instanceof isEven; // true
3 instanceof isEven; // false
// \`instanceof\` calls the right operand's Symbol.hasInstance if present.`}
          filename="has-instance.js"
        />

        <h3 className="article-h3">4. <code>Symbol.for</code> &mdash; shared global symbols</h3>
        <CodeBlock
          code={`// Two modules need the same symbol:
const a = Symbol.for("shared.key");
const b = Symbol.for("shared.key");
a === b;            // true — same global symbol
Symbol.keyFor(a);   // "shared.key" — reverse lookup

// Contrast:
Symbol("x") === Symbol("x"); // false — each call is unique
Symbol.keyFor(Symbol("x"));  // undefined — not in the registry`}
          filename="symbol-for.js"
        />

        <h3 className="article-h3">5. Enumerability: symbols are hidden from normal loops</h3>
        <CodeBlock
          code={`const obj = { a: 1, [Symbol("b")]: 2, [Symbol.for("c")]: 3 };
Object.keys(obj);                  // ["a"]
Object.getOwnPropertyNames(obj);   // ["a"]
Object.getOwnPropertySymbols(obj); // [Symbol(b), Symbol(c)] — only these see them
Reflect.ownKeys(obj);              // ["a", Symbol(b), Symbol(c)] — all own keys
JSON.stringify(obj);               // '{"a":1}' — symbols dropped`}
          filename="hidden.js"
        />

        <h3 className="article-h3">6. Symbols vs <code>#</code> private fields &mdash; pick the right tool</h3>
        <CodeBlock
          code={`// Symbol: collision-free but accessible via introspection
const internal = Symbol("internal");
class A { constructor() { this[internal] = "peekable"; } }
Object.getOwnPropertySymbols(new A())[0]; // reveals it

// #field: truly private, syntax-enforced
class B { #secret = "hidden"; get() { return this.#secret; } }
new B().#secret; // SyntaxError — not even introspectable
// Use symbols for protocol hooks & non-clashing keys; # for real privacy.`}
          filename="symbol-vs-private.js"
        />

        <div className="article-callout">
          <p>
            Don&apos;t overuse symbols. Most properties should be plain strings &mdash; readable, enumerable, JSON-
            serializable. Reach for symbols specifically when you need (a) collision-free keys on objects you
            don&apos;t own, or (b) a protocol hook the engine reads. Otherwise, a well-named string is clearer.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Implement a <code>Vector2</code> class that supports <code>Symbol.iterator</code> (so it works in{' '}
            <code>for...of</code> and destructuring), <code>Symbol.toPrimitive</code> (so <code>v + v</code> adds
            components), and <code>Symbol.toStringTag</code>. Then add a symbol-keyed metadata field that survives
            copies made via <code>{'{...v}'}</code> (hint: it won&apos;t &mdash; observe and explain).
          </p>
        </div>

        <CodeBlock
          code={`class Vector2 {
  constructor(x, y) { this.x = x; this.y = y; }
  [Symbol.iterator]() {
    let i = 0;
    const coords = [this.x, this.y];
    return { next: () => i < 2 ? { value: coords[i++], done: false } : { value: undefined, done: true } };
  }
  [Symbol.toPrimitive](hint) {
    return hint === "string" ? \`(\${this.x}, \${this.y})\` : this.x + this.y;
  }
  get [Symbol.toStringTag]() { return "Vector2"; }
}

const v = new Vector2(3, 4);
const [x, y] = v;     // 3, 4 — destructuring uses Symbol.iterator
v + new Vector2(1,1); // 4 + 5 = 9? No: default hint → x+y of each... actually
                      // \`v + other\` coerces each to default → (3+4)+(1+1)=9
Object.prototype.toString.call(v); // "[object Vector2]"

// Metadata via symbol:
const tag = Symbol("tag");
const tagged = new Vector2(1,1); tagged[tag] = "meta";
const copy = { ...tagged };     // spread copies OWN ENUMERABLE keys only
copy[tag];                      // undefined — symbols NOT spread by \`{...}\`!
// Explanation: object spread copies enumerable own properties; symbols ARE
// enumerable, so actually copy[tag] === "meta" here. Verify and reconcile
// with the fact that {...} DOES include symbol keys but JSON does not.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Does <code>{'{...obj}'}</code> copy symbol keys? (Yes &mdash; object spread copies all own enumerable
            properties, including symbol keys. <code>JSON.stringify</code> drops them, but spread keeps them. The
            distinction: spread respects enumerability, not key type. Knowing exactly which operations include
            symbols &mdash; spread yes, <code>Object.keys</code> no, JSON no, <code>Reflect.ownKeys</code> yes &mdash;
            is the practical skill.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is a Symbol?</h4>
            <p className="iq-a">
              The seventh primitive type &mdash; a unique, immutable value. <code>Symbol(description)</code> returns a
              brand-new symbol every call; the description is just a debug label and doesn&apos;t affect identity.
              Used as object keys, symbols can&apos;t collide with string keys or with other symbols, which makes them
              ideal for non-clashing metadata and protocol hooks.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Are two symbols with the same description equal?</h4>
            <p className="iq-a">
              <code>Symbol(&quot;x&quot;) === Symbol(&quot;x&quot;)</code> is <strong>false</strong> &mdash; each call
              creates a unique value; the description is only a label. The exception is <code>Symbol.for(&quot;x&quot;)</code>,
              which uses a global registry and returns the same symbol for the same string across the realm.{' '}
              <code>Symbol.keyFor</code> reverses it.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why do symbols exist? What problem do they solve?</h4>
            <p className="iq-a">
              Two problems: (1) <strong>collision-free keys</strong> &mdash; libraries attaching metadata to objects
              they don&apos;t own can&apos;t clash with each other or with the owner&apos;s string keys; (2){' '}
              <strong>protocol hooks</strong> &mdash; the spec can define behaviors like iteration via{' '}
              <code>Symbol.iterator</code> without reserving string names that might exist in user code. Uniqueness
              solves the collision problem; well-known symbols solve the hook problem.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Do <code>for...in</code> and <code>Object.keys</code> see symbol keys?</h4>
            <p className="iq-a">
              No. Symbol-keyed properties are invisible to <code>for...in</code>, <code>Object.keys</code>,{' '}
              <code>Object.getOwnPropertyNames</code>, and <code>JSON.stringify</code>. To see them, use{' '}
              <code>Object.getOwnPropertySymbols</code> or <code>Reflect.ownKeys</code> (which returns both string and
              symbol keys). Object spread <em>does</em> copy enumerable symbol keys.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What are well-known symbols?</h4>
            <p className="iq-a">
              Pre-defined symbols on the <code>Symbol</code> object that the engine reads to customize built-in
              behavior: <code>Symbol.iterator</code> (for...of/spread), <code>Symbol.asyncIterator</code> (for
              await...of), <code>Symbol.toPrimitive</code> (coercion), <code>Symbol.hasInstance</code> (instanceof),
              <code> Symbol.toStringTag</code>, <code>Symbol.isConcatSpreadable</code>, and more. Implementing one as a
              method on your object plugs it into that language behavior.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Symbols vs private fields (<code>#</code>) &mdash; which for what?</h4>
            <p className="iq-a">
              Symbols give <em>collision-free</em> keys but aren&apos;t truly private &mdash;{' '}
              <code>Object.getOwnPropertySymbols</code> reveals them, so they&apos;re &ldquo;hidden by
              convention.&rdquo; Private fields (<code>#x</code>) are <em>enforced by the engine</em> &mdash;
              referencing one outside its class is a syntax error, no introspection possible. Use symbols for protocol
              hooks and non-clashing metadata on objects you don&apos;t own; use <code>#</code> for genuine
              encapsulation within a class.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). How does <code>Symbol.toPrimitive</code> interact with <code>+</code> and <code>==</code>?</h4>
            <p className="iq-a">
              When an object must be coerced to a primitive, the engine first looks for <code>Symbol.toPrimitive</code>;
              if present, it calls it with a hint (<code>"string"</code>, <code>"number"</code>, or
              <code> "default"</code>) and uses the returned primitive. For <code>obj + 1</code> the hint is
              <code> "default"</code> (no clear preference); for <code>${'`${obj}`'}</code> it&apos;s{' '}
              <code>"string"</code>; for <code>obj == 3</code> or math it&apos;s <code>"number"</code>. If there&apos;s
              no <code>Symbol.toPrimitive</code>, the engine falls back to <code>valueOf</code>/<code>toString</code>.
              Because <code>Symbol.toPrimitive</code> must return a primitive (or it throws <code>TypeError</code>), it
              gives full, predictable control over coercion &mdash; the modern replacement for the old
              <code> valueOf</code>/<code>toString</code> dance.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
