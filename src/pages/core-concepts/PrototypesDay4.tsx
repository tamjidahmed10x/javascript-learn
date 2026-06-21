import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('prototypes-oop')!
const navItems = weekNav(week)

export default function PrototypesDay4() {
  const { prev, next } = dayNavLinks(week, 4)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 4 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[3].title}</h1>
        <p className="lesson-subtitle">
          New syntax, same prototype chain. <code>class</code> is a cleaner way to write yesterday&apos;s
          constructor &mdash; nothing more, nothing less.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            A <code>class</code> declaration defines a constructor function plus methods on its{' '}
            <code>prototype</code>, all in one block. Under the hood it <em>is</em> a function with a{' '}
            <code>.prototype</code> object &mdash; exactly what Day 3 built by hand.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            The <code>constructor</code> method is the function body. Other methods go on{' '}
            <code>Class.prototype</code>. <code>static</code> methods go on the class itself. <code>get</code>/{' '}
            <code>set</code>, computed names, and private (<code>#</code>) fields extend the surface.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Whenever you need many objects with shared behavior. <code>class</code> is the idiomatic modern syntax,
            but remember it <strong>requires</strong> <code>new</code>, runs in strict mode, and is not hoisted in
            the usable sense.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          The fastest way to understand <code>class</code> is to desugar it. Here is a class and the constructor
          pattern it compiles to:
        </p>

        <CodeBlock
          code={`// ES6 class...
class User {
  constructor(name) { this.name = name; }     // instance setup
  greet() { return "Hi, " + this.name; }       // prototype method
  static create(name) { return new User(name); } // on the class itself
}

// ...is roughly this constructor function:
function User(name) { this.name = name; }
User.prototype.greet = function () { return "Hi, " + this.name; };
User.create = function (name) { return new User(name); };`}
          filename="desugar.js"
        />

        <p className="article-para">
          The class is the constructor pattern, prettier. It does not add classes in the Java sense &mdash; there
          are still only objects and the prototype chain. Today we learn the syntax, what it enforces, and the new
          features it adds beyond plain constructors.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term"><code>constructor</code></dt>
            <dd className="def-text">
              The special method that runs on <code>new</code>. There can be at most one per class. Omit it and a
              default empty constructor is used.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>static</code></dt>
            <dd className="def-text">
              Prefixes a method that lives on the class (the function object), not on{' '}
              <code>Class.prototype</code>. Called as <code>Class.method()</code>, not <code>instance.method()</code>.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>#field</code> (private)</dt>
            <dd className="def-text">
              A truly private class field, inaccessible outside the class body. The first real privacy mechanism in
              JavaScript &mdash; closures no longer needed for this.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Same Engine, New Dashboard</h2>
        <p className="article-para">
          Think of <code>class</code> as a redesigned dashboard over the same engine. The engine (constructor +
          prototype + <code>new</code>) is unchanged; the dashboard groups the controls into one panel and adds
          safety interlocks (strict mode, required <code>new</code>, no hoisted use).
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">⚙️</span>
            <span className="analogy-label">The engine</span>
            <span className="analogy-target">Constructor + prototype (Day 3)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🖥️</span>
            <span className="analogy-label">The dashboard</span>
            <span className="analogy-target"><code>class</code> syntax</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔒</span>
            <span className="analogy-label">New safety lock</span>
            <span className="analogy-target">Required <code>new</code>, strict mode</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔐</span>
            <span className="analogy-label">New feature</span>
            <span className="analogy-target"><code>#</code> private fields</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Calling a class without <code>new</code> throws <code>TypeError: Class constructor X cannot be invoked
            without &apos;new&apos;</code>. This is the single biggest behavioral difference from a plain
            constructor function &mdash; and the reason classes are safer.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; What a Class Really Is</h2>
        <p className="article-para">
          A <code>class</code> declaration evaluates to <strong>a function</strong>. That function is the
          constructor; the methods you write become properties on its <code>.prototype</code>. Verify it:
        </p>

        <CodeBlock
          code={`class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  toString() { return \`(\${this.x}, \${this.y})\`; }
}

typeof Point;                          // "function" — it IS a function
Point.prototype.toString;              // ƒ toString() — method on prototype
Point.prototype.constructor === Point; // true

const p = new Point(1, 2);
p.toString();                          // "(1, 2)"
Object.getPrototypeOf(p) === Point.prototype; // true`}
          filename="class-is-function.js"
        />

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Methods are non-enumerable &amp; on the prototype</h4>
            <p className="theory-desc">
              Unlike <code>Fn.prototype.m = function...</code>, class methods are defined as non-enumerable &mdash;
              they won&apos;t show up in <code>for...in</code> loops. Cleaner.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. The class body runs in strict mode automatically</h4>
            <p className="theory-desc">
              You cannot opt out. <code>this</code> defaults to <code>undefined</code>, not global, on misuse &mdash;
              no silent global pollution.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Not hoisted in the usable sense (TDZ)</h4>
            <p className="theory-desc">
              Like <code>let</code>/<code>const</code>, a class exists in a temporal dead zone before its
              declaration. You cannot use it earlier in the file than where it&apos;s defined.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Internal-only <code>constructor</code> &amp; no callable without <code>new</code></h4>
            <p className="theory-desc">
              <code>Point()</code> (no <code>new</code>) throws. The class is also a special &ldquo;class
              constructor&rdquo; function that cannot be <code>call</code>&apos;d directly &mdash; it must be{' '}
              <code>new</code>&apos;d.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Where each piece lives</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">On <code>Class.prototype</code> (instance side)</span>
            <p className="phase-desc">Called as <code>instance.method()</code>. The delegation layer.</p>
            <ul className="phase-rules">
              <li><code>constructor</code> (the body)</li>
              <li>Regular methods</li>
              <li>Getters / setters</li>
              <li>Public fields (per instance, technically on <code>this</code>)</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">On the class itself (static side)</span>
            <p className="phase-desc">Called as <code>Class.method()</code>. Lives on the function object.</p>
            <ul className="phase-rules">
              <li><code>static</code> methods</li>
              <li><code>static</code> fields</li>
              <li><code>static</code> blocks</li>
              <li><code>static</code> getters / setters</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why <code>class</code> Arrived in 2015</h2>
        <p className="article-para">
          For two decades developers emulated classes with constructor functions and a tangle of patterns. ES6
          (2015) added the <code>class</code> keyword not to change the language model &mdash; prototypes stayed
          &mdash; but to give the common pattern a dedicated, readable syntax and to fix its sharpest edges (the
          missing-<code>new</code> footgun, global pollution). Later editions added private fields (<code>#</code>,
          2022), static blocks, and public fields.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Function constructor</th>
                <th><code>class</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Underlying type</td>
                <td>Function</td>
                <td>Function (special constructor)</td>
              </tr>
              <tr>
                <td>Callable without <code>new</code></td>
                <td>Yes (unsafe)</td>
                <td>No (throws)</td>
              </tr>
              <tr>
                <td>Strict mode</td>
                <td>Optional</td>
                <td>Always on</td>
              </tr>
              <tr>
                <td>Hoisted for use</td>
                <td>Yes (declaration)</td>
                <td>No (TDZ)</td>
              </tr>
              <tr>
                <td>Private fields</td>
                <td>Only via closures</td>
                <td><code>#field</code></td>
              </tr>
              <tr>
                <td>Enumerable methods</td>
                <td>Yes (assigned)</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="article-callout">
          <p>
            Classes are <strong>first-class</strong> &mdash; you can pass them around, return them, store them.
            <code>{'const Factory = class { ... }'}</code> (a class expression) is perfectly valid, useful for dynamic
            class generation.
          </p>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Defining and Instantiating</h2>

        <CodeBlock
          code={`class BankAccount {
  #balance; // private field declared

  constructor(owner, initial = 0) {
    this.owner = owner;        // public field (on this)
    this.#balance = initial;   // private field (truly hidden)
  }

  deposit(amount) {            // → BankAccount.prototype.deposit
    this.#balance += amount;
    return this;
  }

  get balance() {              // getter — accessed as account.balance
    return this.#balance;
  }

  static fee = 2;              // static field — BankAccount.fee
  static transfer(from, to, amt) {  // static method
    from.#withdraw(amt);
    to.deposit(amt - BankAccount.fee);
  }

  #withdraw(amount) { this.#balance -= amount; } // private method
}

const acc = new BankAccount("Tamjid", 100);
acc.deposit(50);
acc.balance;           // 150 — getter, no parentheses
acc.#balance;          // SyntaxError — private, not accessible outside
BankAccount.fee;       // 2 — static`}
          filename="full-feature.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>class BankAccount</code> creates a function (the <code>constructor</code>) with a{' '}
              <code>.prototype</code> holding <code>deposit</code> and the <code>balance</code> getter.
            </span>
          </li>
          <li>
            <span>
              <code>new BankAccount("Tamjid", 100)</code> runs the constructor: <code>this.owner</code> (public) and{' '}
              <code>this.#balance</code> (private) are set on the instance.
            </span>
          </li>
          <li>
            <span>
              <code>acc.deposit(50)</code> delegates up to <code>BankAccount.prototype.deposit</code>, runs with{' '}
              <code>this === acc</code>, mutates the private field.
            </span>
          </li>
          <li>
            <span>
              <code>acc.balance</code> triggers the getter (no parens) &mdash; a prototype property defined as an
              accessor, not a data property.
            </span>
          </li>
          <li>
            <span>
              <code>acc.#balance</code> outside the class body is a syntax error &mdash; true privacy enforced by
              the engine, not convention.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Public fields &amp; methods</h3>
        <CodeBlock
          code={`class Counter {
  count = 0;            // public field (runs before constructor body)
  step = 1;

  increment() {         // prototype method
    this.count += this.step;
    return this.count;
  }
}

const c = new Counter();
c.increment(); // 1
c.step = 5;
c.increment(); // 6`}
          filename="public-fields.js"
        />

        <h3 className="article-h3">2. Getters and setters</h3>
        <CodeBlock
          code={`class Temperature {
  #celsius = 0;
  get celsius() { return this.#celsius; }
  set celsius(v) { this.#celsius = v; }
  get fahrenheit() { return this.#celsius * 9/5 + 32; }
  set fahrenheit(v) { this.#celsius = (v - 32) * 5/9; }
}

const t = new Temperature();
t.fahrenheit = 98.6;
t.celsius; // 37`}
          filename="getters-setters.js"
        />

        <h3 className="article-h3">3. Static members &amp; static blocks</h3>
        <CodeBlock
          code={`class Config {
  static instances = 0;       // static field, shared across all calls
  static registry = new Map();

  static {                    // static init block — runs once, on class creation
    Config.instances = 0;
  }

  constructor(name) {
    this.name = name;
    Config.instances++;
    Config.registry.set(name, this);
  }

  static count() { return Config.instances; } // static method
}

new Config("a"); new Config("b");
Config.count(); // 2
Config.registry.get("a"); // Config instance`}
          filename="static.js"
        />

        <h3 className="article-h3">4. Private fields and methods</h3>
        <CodeBlock
          code={`class Token {
  #value;
  constructor(v) { this.#value = v; }
  #validate() { return this.#value > 0; }   // private method
  spend(amount) {
    if (!this.#validate()) throw new Error("invalid");
    if (amount > this.#value) throw new Error("insufficient");
    this.#value -= amount;
  }
  get value() { return this.#value; }
}

const t = new Token(100);
t.spend(30);
t.value;        // 70
t.#value;       // SyntaxError (outside the class)
t.#validate();  // SyntaxError`}
          filename="private.js"
        />

        <h3 className="article-h3">5. Class expressions &amp; class fields with <code>this</code></h3>
        <CodeBlock
          code={`// Class as an expression — first-class value
const Animal = class {
  speak() { return "..."; }
};

// Class field arrow = pre-bound method (the React pattern)
class Button {
  label = "Click";
  onClick = () => {        // class field arrow: this is always the instance
    console.log(this.label);
  };
}

const b = new Button();
const fn = b.onClick;
fn(); // "Click" — no detachment bug (Week 2 Day 5)
// Contrast: a regular method would lose \`this\` when detached.`}
          filename="expression-arrow.js"
        />

        <div className="article-callout">
          <p>
            The class-field arrow (<code>{'onClick = () => {...}'}</code>) is the modern fix for the detached-method
            <code>this</code> bug from Week 2. It is an <em>instance property</em> holding an arrow that closes over{' '}
            <code>this</code> &mdash; so it survives detachment. It costs one function per instance, unlike a
            prototype method. Day 6 weighs that trade-off.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Build a <code>Stack</code> as a class with a private <code>#items</code> array, instance methods, a{' '}
            <code>size</code> getter, a static <code>fromArray</code> factory, and a class-field-arrow{' '}
            <code>clear</code> that stays bound. Then translate it back to the constructor form from Day 3 and
            confirm they behave identically.
          </p>
        </div>

        <CodeBlock
          code={`class Stack {
  #items = [];                 // private, per instance
  static #max = 1000;          // private static

  push(x) { this.#items.push(x); return this; }
  pop() { return this.#items.pop(); }
  get size() { return this.#items.length; }

  clear = () => { this.#items = []; }; // class-field arrow, bound

  static fromArray(arr) {      // static factory
    const s = new Stack();
    arr.forEach((x) => s.push(x));
    return s;
  }
}

const s = Stack.fromArray([1, 2, 3]);
s.size;        // 3 — getter
const detach = s.clear;
detach();      // works — arrow is pre-bound
s.size;        // 0

// Equivalent constructor form (Day 3):
// function Stack() { this._items = []; }  // no true privacy
// Stack.prototype.push = ...`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Which of your methods are per-instance vs shared on the prototype? (<code>clear</code> is per-instance
            because it&apos;s a class field holding a function; <code>push</code>/<code>pop</code> are shared via{' '}
            <code>Stack.prototype</code>. Trade-off: bound arrow = safety, but one function per instance.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Is a JavaScript <code>class</code> a real class?</h4>
            <p className="iq-a">
              No &mdash; it is syntactic sugar over a constructor function plus prototype methods. <code>typeof
              Class === &quot;function&quot;</code>, and instances inherit via the same <code>[[Prototype]]</code>{' '}
              chain as Day 1&ndash;3. The keyword improves ergonomics and adds safety, but the model is unchanged.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What does calling a class without <code>new</code> do?</h4>
            <p className="iq-a">
              It throws <code>TypeError: Class constructor X cannot be invoked without &apos;new&apos;</code>.
              Unlike plain constructor functions, classes cannot be misused this way &mdash; this is the key safety
              improvement over the pre-class pattern.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Where do methods go &mdash; instance or prototype?</h4>
            <p className="iq-a">
              Regular methods land on <code>Class.prototype</code> (shared, one copy). <code>static</code> methods
              land on the class function itself. Public/private fields and class-field arrows go on each instance
              (<code>this</code>). Getters/setters are accessors on the prototype.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. How do private fields differ from a closure-based private variable?</h4>
            <p className="iq-a">
              <code>#field</code> is enforced by the engine: it cannot be read or written outside the class body
              (a syntax error even to name it). Closure privacy works but only within the closure&apos;s scope, can
              leak via methods, and cannot be accessed even by subclasses. <code>#</code> fields are also truly
              per-instance and participate in inheritance within the same class.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What does this output and why?</h4>
            <CodeBlock
              code={`class A {
  constructor() { console.log("A ctor"); }
  greet() { return "A"; }
}
class B extends A {
  constructor() {
    super();
    console.log("B ctor");
  }
  greet() { return super.greet() + "B"; }
}
const b = new B();
console.log(b.greet());`}
              filename="q5.js"
            />
            <p className="iq-a">
              Logs <code>A ctor</code>, <code>B ctor</code>, then <code>"AB"</code>. (Full inheritance mechanics are
              Day 5, but the shape: <code>super()</code> calls the parent constructor, and <code>super.greet()</code>{' '}
              delegates to the parent&apos;s method. <code>new B()</code> runs <code>A</code>&apos;s constructor
              first via <code>super()</code>, then <code>B</code>&apos;s body.)
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why might a class-field arrow be preferred over a prototype method?</h4>
            <p className="iq-a">
              A class-field arrow (<code>{'onClick = () => {...}'}</code>) is pre-bound to the instance, so it keeps{' '}
              <code>this</code> when detached &mdash; essential for callbacks passed to event handlers or React
              components. The cost: one function object per instance instead of one shared. Use it when{' '}
              <code>this</code>-stability matters more than the memory savings.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Are class methods enumerable? Does <code>for...in</code> list them?</h4>
            <CodeBlock
              code={`class C {
  a() {}
  b() {}
}
const c = new C();
for (const k in c) console.log(k);`}
              filename="q7.js"
            />
            <p className="iq-a">
              Nothing is logged. Class methods are defined on the prototype as <strong>non-enumerable</strong>, so{' '}
              <code>for...in</code> skips them (it only iterates enumerable own <em>and</em> inherited properties,
              but non-enumerable inherited methods are excluded). Public instance fields <em>are</em> enumerable, so
              they would appear. This is a deliberate cleanliness improvement over assigning{' '}
              <code>Fn.prototype.m = function...</code> by hand, which makes <code>m</code> enumerable.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
