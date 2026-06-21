import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('prototypes-oop')!
const navItems = weekNav(week)

export default function PrototypesDay2() {
  const { prev, next } = dayNavLinks(week, 2)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[1].title}</h1>
        <p className="lesson-subtitle">
          Two names that look identical, live on different things, and confuse everyone the first time.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <code>__proto__</code> is a property on <strong>every object</strong> that exposes its{' '}
            <code>[[Prototype]]</code> link. <code>prototype</code> is a property on <strong>functions</strong>{' '}
            that specifies the object to use as <code>[[Prototype]]</code> when the function is called with{' '}
            <code>new</code>.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            <code>obj.__proto__</code> answers &ldquo;what does <code>obj</code> delegate to?&rdquo;{' '}
            <code>fn.prototype</code> answers &ldquo;if I <code>new</code> this function, what will the
            instances delegate to?&rdquo; Different questions, different owners.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Use <code>Object.getPrototypeOf</code> / <code>Object.create</code> in real code &mdash; not{' '}
            <code>__proto__</code>. Understand <code>.prototype</code> because it is the link between functions and
            the objects they manufacture (Day 3, Day 4).
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          If you take one day from this week, take this one. The difference between <code>__proto__</code> and{' '}
          <code>prototype</code> is the single most-asked prototype question in interviews, and the most common
          source of confusion when people first see the chain.
        </p>

        <CodeBlock
          code={`function Foo() {}
const f = new Foo();

// Two different things:
Foo.prototype;   // the object instances will delegate to
f.__proto__;     // what f actually delegates to

f.__proto__ === Foo.prototype; // TRUE — the link the constructor set

// But also:
typeof Foo;            // "function"
Foo.__proto__;         // exists too! functions are objects`}
          filename="two-protos.js"
        />

        <p className="article-para">
          Read that last block twice. <code>Foo.prototype</code> and <code>f.__proto__</code> happen to point at
          the same object &mdash; but they are accessed on different things and mean different things. The
          confusion is the point of today.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term"><code>__proto__</code></dt>
            <dd className="def-text">
              An accessor property (getter/setter) defined on <code>Object.prototype</code> that exposes every
              object&apos;s internal <code>[[Prototype]]</code> link. Legacy; prefer the methods below.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>prototype</code></dt>
            <dd className="def-text">
              A property that exists on <strong>functions</strong> (because functions are potential constructors).
              Its value is the object that becomes the <code>[[Prototype]]</code> of instances created by{' '}
              <code>new</code>.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>Object.create</code></dt>
            <dd className="def-text">
              The clean way to set an object&apos;s <code>[[Prototype]]</code> at creation time without touching{' '}
              <code>__proto__</code> or using a constructor: <code>Object.create(proto)</code>.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Blueprint Analogy</h2>
        <p className="article-para">
          Think of a constructor function as a <strong>factory</strong> and its <code>.prototype</code> as the{' '}
          <strong>shared manual</strong> the factory staples onto every product. The product (<code>f</code>) has a
          sticker (<code>__proto__</code>) pointing to that manual. When the product doesn&apos;t know how to do
          something, it consults the manual the sticker points to.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🏭</span>
            <span className="analogy-label">The factory</span>
            <span className="analogy-target">The function / constructor</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📖</span>
            <span className="analogy-label">The shared manual</span>
            <span className="analogy-target"><code>fn.prototype</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏷️</span>
            <span className="analogy-label">The sticker on the product</span>
            <span className="analogy-target"><code>instance.__proto__</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📦</span>
            <span className="analogy-label">The product</span>
            <span className="analogy-target">The instance</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The sticker (<code>__proto__</code>) and the manual (<code>.prototype</code>) are the same physical
            object, but you reach for it differently depending on whether you&apos;re standing at the factory or
            holding the product. Same object, two doors.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          The cleanest way to keep them apart is to remember <strong>who owns each property</strong>.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. <code>__proto__</code> lives on every object</h4>
            <p className="theory-desc">
              Technically it&apos;s a getter/setter on <code>Object.prototype</code> inherited by all objects. It
              reads or writes the <code>[[Prototype]]</code> internal slot. Functions have it too &mdash; because
              functions are objects.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>.prototype</code> lives on functions</h4>
            <p className="theory-desc">
              When you write <code>function Foo()</code>, the engine auto-creates <code>Foo.prototype</code> (a
              plain object with a <code>constructor</code> property back to <code>Foo</code>). Arrow functions
              don&apos;t get one.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>new</code> wires them together</h4>
            <p className="theory-desc">
              Calling <code>new Foo()</code> creates a fresh object whose <code>[[Prototype]]</code> is set to{' '}
              <code>Foo.prototype</code>. That is the whole connection: the constructor&apos;s{' '}
              <code>.prototype</code> becomes each instance&apos;s <code>__proto__</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Functions chain up to <code>Function.prototype</code></h4>
            <p className="theory-desc">
              A function is an object, so <code>Foo.__proto__ === Function.prototype</code>. That is how{' '}
              <code>call</code>, <code>bind</code>, and <code>apply</code> are available on every function (Week 2,
              Day 4).
            </p>
          </div>
        </div>

        <h3 className="article-h3">The full picture for one constructor</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label"><code>fn.prototype</code> (on the function)</span>
            <p className="phase-desc">
              The template object for <em>future instances</em>. Add methods here; all instances see them via the
              chain.
            </p>
            <ul className="phase-rules">
              <li>Owned by the function</li>
              <li>Auto-created when the function is declared</li>
              <li>Has <code>.constructor</code> &rarr; back to the function</li>
              <li>Read as: &ldquo;instances&apos; prototype&rdquo;</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label"><code>obj.__proto__</code> (on the instance)</span>
            <p className="phase-desc">
              The actual <code>[[Prototype]]</code> link of a given object &mdash; where it delegates.
            </p>
            <ul className="phase-rules">
              <li>Inherited from <code>Object.prototype</code></li>
              <li>Exists on every object</li>
              <li>For instances: equals the constructor&apos;s <code>.prototype</code></li>
              <li>Read as: &ldquo;my prototype&rdquo;</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            <code>__proto__</code> is officially deprecated as a feature you write yourself. It lingers for
            backwards compatibility. In modern code, use <code>Object.getPrototypeOf</code> (read),{' '}
            <code>Object.setPrototypeOf</code> (write, slow &mdash; avoid), and <code>Object.create</code> (set at
            birth, fast).
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Two Names</h2>
        <p className="article-para">
          Original JavaScript (1995) exposed the prototype link only through <code>__proto__</code>, but it was an
          implementation detail of Netscape&apos;s engine &mdash; the double underscore meant &ldquo;internal,
          don&apos;t touch.&rdquo; Developers touched it anyway. By the time ES5 (2009) standardized the
          reflection API (<code>Object.getPrototypeOf</code>), the legacy accessor was too widely used to remove,
          so it was standardized too &mdash; with a warning.
        </p>
        <p className="article-para">
          The <code>.prototype</code> property, by contrast, has always been first-class: it is the mechanism by
          which <code>new</code> links instances to a shared methods object. The two coexist because they serve
          genuinely different roles &mdash; one describes a link, the other declares a template.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>__proto__</code></th>
                <th><code>prototype</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exists on</td>
                <td>All objects</td>
                <td>Functions (and classes)</td>
              </tr>
              <tr>
                <td>Describes</td>
                <td>Where this object delegates</td>
                <td>Where its instances will delegate</td>
              </tr>
              <tr>
                <td>Direction</td>
                <td>Instance &rarr; its prototype</td>
                <td>Constructor &rarr; instance&apos;s prototype</td>
              </tr>
              <tr>
                <td>Standard?</td>
                <td>Legacy (Annex B)</td>
                <td>Core</td>
              </tr>
              <tr>
                <td>Modern alternative</td>
                <td><code>Object.getPrototypeOf</code></td>
                <td>(still the API)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; How <code>new</code> Connects Them</h2>

        <CodeBlock
          code={`function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + " makes a sound";
};

const a = new Animal("Rex");`}
          filename="connection.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              Declaring <code>function Animal</code> auto-creates <code>Animal.prototype</code> &mdash; a plain
              object with <code>constructor: Animal</code>.
            </span>
          </li>
          <li>
            <span>
              <code>Animal.prototype.speak = ...</code> adds a method to that shared object.
            </span>
          </li>
          <li>
            <span>
              <code>new Animal("Rex")</code> creates a fresh object and sets its <code>[[Prototype]]</code> to{' '}
              <code>Animal.prototype</code>. So <code>Object.getPrototypeOf(a) === Animal.prototype</code>.
            </span>
          </li>
          <li>
            <span>
              The constructor body runs with <code>this</code> bound to that new object (Week 2&apos;s{' '}
              <code>new</code> binding), setting <code>this.name = "Rex"</code>.
            </span>
          </li>
          <li>
            <span>
              <code>a.speak()</code> misses on <code>a</code>, walks to <code>Animal.prototype</code>, finds{' '}
              <code>speak</code>, runs it with <code>this === a</code> &rarr; <code>"Rex makes a sound"</code>.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. The defining equality</h3>
        <CodeBlock
          code={`function Thing() {}
const t = new Thing();

t.__proto__ === Thing.prototype;              // true
Object.getPrototypeOf(t) === Thing.prototype; // true (preferred)

// And the constructor back-link:
Thing.prototype.constructor === Thing;        // true
t.constructor === Thing;                       // true (inherited!)`}
          filename="equality.js"
        />

        <h3 className="article-h3">2. <code>Object.create</code> sets the link cleanly</h3>
        <CodeBlock
          code={`const proto = { shared: "method" };
const obj = Object.create(proto);

Object.getPrototypeOf(obj) === proto; // true
obj.shared;                           // "method"

// No constructor, no __proto__ assignment, no new. Just a link.`}
          filename="object-create.js"
        />

        <h3 className="article-h3">3. Functions are objects too &mdash; they chain up</h3>
        <CodeBlock
          code={`function fn() {}

fn.__proto__ === Function.prototype;        // true (call/bind live here)
Function.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__;                  // null — chain end

// Full chain: fn → Function.prototype → Object.prototype → null`}
          filename="function-chain.js"
        />

        <h3 className="article-h3">4. Arrow functions have no <code>prototype</code></h3>
        <CodeBlock
          code={`function regular() {}
regular.prototype; // { constructor: regular } — exists

const arrow = () => {};
arrow.prototype;    // undefined — arrows aren't constructors
new arrow();        // TypeError: arrow is not a constructor`}
          filename="no-arrow-prototype.js"
        />

        <h3 className="article-h3">5. Mutating <code>.prototype</code> vs reassigning it</h3>
        <CodeBlock
          code={`function C() {}
const before = new C();

// MUTATE the prototype object (old instances still see it):
C.prototype.greet = function () { return "hi"; };
before.greet(); // "hi" — same object, new method

// REASSIGN to a new object (old instances keep the OLD link):
C.prototype = { wave: function () { return "bye"; } };
const after = new C();
after.wave();   // "bye"
before.wave;    // undefined — before still points at the old prototype
before.greet(); // "hi"      — still works, old prototype unchanged`}
          filename="mutate-vs-reassign.js"
        />

        <div className="article-callout">
          <p>
            The <code>constructor</code> property on a prototype is not special to the engine &mdash; it&apos;s just
            a reference back to the function. It&apos;s useful for introspection (<code>obj.constructor</code>) but
            can be overwritten or lost. Don&apos;t rely on it for anything that matters.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            On paper, draw the prototype relationships for this snippet without running it. Then verify each{' '}
            <code>===</code> claim by running it.
          </p>
        </div>

        <CodeBlock
          code={`function Vehicle() {}
Vehicle.prototype.move = function () { return "vroom"; };

const car = new Vehicle();

// Predict each, then confirm:
// 1. Object.getPrototypeOf(car) === Vehicle.prototype
// 2. car.__proto__ === Vehicle.prototype
// 3. Vehicle.prototype.constructor === Vehicle
// 4. car.constructor === Vehicle
// 5. Vehicle.__proto__ === Function.prototype
// 6. Vehicle.prototype.__proto__ === Object.prototype
// 7. Object.getPrototypeOf(car).move === car.move

// Bonus: rewrite using Object.create only (no \`new\`, no function).`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            If you do <code>car.constructor = &quot;oops&quot;</code>, does <code>Vehicle</code> change? (Answer:
            no &mdash; you created an own property on <code>car</code> shadowing the inherited one.{' '}
            <code>Vehicle.prototype.constructor</code> is untouched.) This is why <code>constructor</code> is not a
            reliable identity check.
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is the difference between <code>__proto__</code> and <code>prototype</code>?</h4>
            <p className="iq-a">
              <code>__proto__</code> is an accessor on every object that exposes its <code>[[Prototype]]</code> link
              (where it delegates). <code>prototype</code> is a property on functions that specifies the object
              instances will delegate to when the function is used as a constructor with <code>new</code>. Same
              object, reached from two directions for two purposes.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What does <code>Object.create(proto)</code> do?</h4>
            <p className="iq-a">
              Creates a new empty object whose <code>[[Prototype]]</code> is set to <code>proto</code>. It is the
              modern, clean way to establish a prototype link without a constructor or <code>__proto__</code>{' '}
              assignment. It can also take a property-descriptor map as the second argument.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why is <code>__proto__</code> discouraged?</h4>
            <p className="iq-a">
              It is legacy (standardized in Annex B for compatibility only), it is a getter/setter (so reads and
              writes have surprising performance and behavior), and it pollutes every object via{' '}
              <code>Object.prototype</code>. <code>Object.getPrototypeOf</code> / <code>Object.create</code> are
              explicit and preferred.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Do arrow functions have a <code>prototype</code> property?</h4>
            <p className="iq-a">
              No. Arrows cannot be used as constructors (<code>new</code> throws), so they have no{' '}
              <code>.prototype</code> and no <code>constructor</code> back-link. This connects to Week 2 Day 6:
              arrows are not templates for objects.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Output and why?</h4>
            <CodeBlock
              code={`function A() {}
const a1 = new A();
A.prototype = { x: 1 };
const a2 = new A();

console.log(a1.x, a2.x);`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>undefined 1</code>. <code>a1</code> was created when <code>A.prototype</code> pointed at the
              original object, so <code>a1.__proto__</code> still references that original (no <code>x</code>).
              Reassigning <code>A.prototype</code> swaps in a new object; only instances created <em>afterwards</em>{' '}
              (<code>a2</code>) link to it. Existing instances keep their original link &mdash; reassignment does not
              retroactively re-wire them.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Is <code>obj.constructor</code> a reliable type check?</h4>
            <CodeBlock
              code={`const proto = { constructor: "anything" };
const obj = Object.create(proto);
console.log(obj.constructor);`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>"anything"</code>. <code>constructor</code> is just an inherited property; it can be set to any
              value, lost when you reassign a prototype, or missing entirely. It is not enforced by the engine and
              must not be used as a type/identity check. Use <code>instanceof</code> or{' '}
              <code>Object.getPrototypeOf</code> comparisons instead.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Explain every link in this chain.</h4>
            <CodeBlock
              code={`function Foo() {}
const f = new Foo();

// Trace:
Foo.__proto__;
Foo.prototype.__proto__;
Foo.__proto__.__proto__;
Object.getPrototypeOf(f).__proto__;`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>Foo.__proto__</code> is <code>Function.prototype</code> (functions delegate there for{' '}
              <code>call</code>/<code>bind</code>). <code>Foo.prototype.__proto__</code> is{' '}
              <code>Object.prototype</code> (the auto-created prototype is a plain object).{' '}
              <code>Foo.__proto__.__proto__</code> is <code>Object.prototype</code> (one more hop up from{' '}
              <code>Function.prototype</code>, which is itself a plain object).{' '}
              <code>Object.getPrototypeOf(f)</code> is <code>Foo.prototype</code>, so its <code>.__proto__</code> is{' '}
              <code>Object.prototype</code>. Every road for ordinary objects leads to{' '}
              <code>Object.prototype</code> then <code>null</code>.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
