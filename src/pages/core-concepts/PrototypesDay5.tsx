import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('prototypes-oop')!
const navItems = weekNav(week)

export default function PrototypesDay5() {
  const { prev, next } = dayNavLinks(week, 5)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[4].title}</h1>
        <p className="lesson-subtitle">
          <code>extends</code> links two prototypes. <code>super</code> lets a child reach back up the chain it
          just built.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <code>class Child extends Parent</code> sets up a chain: <code>Child.prototype</code>&apos;s{' '}
            <code>[[Prototype]]</code> points to <code>Parent.prototype</code>, and <code>Child</code> itself chains
            to <code>Parent</code>. The result is a longer prototype chain instances can walk.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            <code>super.method()</code> calls the parent&apos;s method (one link up the prototype chain).{' '}
            <code>super(...)</code> in a child constructor calls the parent constructor and <em>must</em> run before{' '}
            <code>this</code> is used. Overriding replaces a method; <code>super</code> reuses the parent&apos;s.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            When one type genuinely is-a specialization of another (<code>Dog</code> is-an <code>Animal</code>).
            Avoid deep hierarchies &mdash; Day 6 explains why composition is often a better tool than inheritance.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Inheritance in JavaScript is just <strong>linking prototypes</strong>. The <code>extends</code> keyword
          does the linking for you; <code>super</code> is how you call across the link. Here is the whole idea:
        </p>

        <CodeBlock
          code={`class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}

class Dog extends Animal {
  constructor(name) {
    super(name);             // call Animal's constructor
    this.legs = 4;
  }
  speak() {
    return super.speak() + " (woof!)";  // call Animal's speak, then extend
  }
}

const d = new Dog("Rex");
d.speak(); // "Rex makes a sound (woof!)"`}
          filename="inheritance.js"
        />

        <p className="article-para">
          Two prototypes, two links. <code>Dog.prototype</code> chains up to <code>Animal.prototype</code>, so{' '}
          <code>d</code> can reach <code>Animal</code>&apos;s methods. <code>Dog</code> overrides{' '}
          <code>speak</code>, then uses <code>super.speak()</code> to borrow the original behavior. That is
          inheritance in a nutshell.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term"><code>extends</code></dt>
            <dd className="def-text">
              Creates two links: <code>Child.prototype &rarr; Parent.prototype</code> (instance methods) and{' '}
              <code>Child &rarr; Parent</code> (static methods). The child is a specialization of the parent.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>super</code> (method form)</dt>
            <dd className="def-text">
              <code>super.m()</code> calls <code>m</code> on the parent class&apos;s prototype. Used to reuse or
              augment overridden methods without re-implementing them.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>super(...)</code> (constructor form)</dt>
            <dd className="def-text">
              Calls the parent constructor. In a subclass it <strong>must</strong> be invoked before{' '}
              <code>this</code> is referenced &mdash; the parent sets up the object the child extends.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Two-Link Analogy</h2>
        <p className="article-para">
          Inheritance creates <strong>two</strong> separate chains, and people forget the second one. Think of a
          company: there&apos;s an org chart for <em>employees</em> (instances &rarr; prototypes) and a separate
          one for <em>departments</em> (the classes/functions themselves). <code>extends</code> wires up both.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🧬</span>
            <span className="analogy-label">Instance chain</span>
            <span className="analogy-target">Child.prototype &rarr; Parent.prototype</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏢</span>
            <span className="analogy-label">Static chain</span>
            <span className="analogy-target">Child &rarr; Parent (the functions)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📞</span>
            <span className="analogy-label">Calling up</span>
            <span className="analogy-target"><code>super</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">✏️</span>
            <span className="analogy-label">Customizing</span>
            <span className="analogy-target">Override + super</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Because <code>Child</code> chains to <code>Parent</code>, <strong>static methods are
            inherited</strong> &mdash; <code>Child.staticMethod()</code> finds it on <code>Parent</code> if{' '}
            <code>Child</code> doesn&apos;t define its own. The two chains move in parallel.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          Let&apos;s make the two links concrete and trace how <code>super</code> actually finds things.
        </p>

        <CodeBlock
          code={`class A { static sa() { return "A static"; } am() { return "A method"; } }
class B extends A { static sb() { return "B static"; } bm() { return "B method"; } }

// The TWO links:
Object.getPrototypeOf(B.prototype) === A.prototype; // true (instance)
Object.getPrototypeOf(B) === A;                      // true (static)

const b = new B();
b.am();   // "A method" — found via B.prototype → A.prototype
B.sa();   // "A static" — found via B → A

// Full instance chain: b → B.prototype → A.prototype → Object.prototype → null`}
          filename="two-links.js"
        />

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. <code>extends</code> wires both prototypes</h4>
            <p className="theory-desc">
              <code>B.prototype.__proto__ === A.prototype</code> and <code>B.__proto__ === A</code>. Instance and
              static lookups both walk up to <code>A</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. <code>super.method()</code> is a one-level lookup</h4>
            <p className="theory-desc">
              Inside a <code>B</code> method, <code>super.m</code> resolves to <code>A.prototype.m</code> &mdash; the
              parent&apos;s version &mdash; but still runs with <code>this</code> bound to the current instance.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. <code>super()</code> in a constructor is mandatory first</h4>
            <p className="theory-desc">
              A subclass constructor must call <code>super()</code> before touching <code>this</code>. Until then,
              <code> this</code> is uninitialized (a ReferenceError). The parent builds the base; the child extends
              it.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Overrides replace; <code>super</code> reuses</h4>
            <p className="theory-desc">
              Defining <code>am()</code> in <code>B</code> shadows <code>A</code>&apos;s on the chain (own prototype
              wins). Calling <code>super.am()</code> reaches past the shadow to <code>A</code>&apos;s version.
            </p>
          </div>
        </div>

        <h3 className="article-h3">Why <code>this</code> before <code>super()</code> is forbidden</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Without <code>extends</code></span>
            <p className="phase-desc">
              <code>new</code> creates the object and <code>this</code> is ready immediately when the constructor
              runs.
            </p>
            <ul className="phase-rules">
              <li>One-step creation</li>
              <li><code>this</code> usable at once</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">With <code>extends</code></span>
            <p className="phase-desc">
              <code>new</code> defers object creation to the <em>parent</em> constructor via <code>super()</code>.
              Until <code>super()</code> runs, <code>this</code> doesn&apos;t exist yet.
            </p>
            <ul className="phase-rules">
              <li><code>this</code> is uninitialized</li>
              <li>Must call <code>super()</code> first</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            This is why the &ldquo;must call super before this&rdquo; rule exists: in a subclass, the engine
            delegates the actual object allocation to the parent. The child constructor is really a
            <em> post-processing</em> step that runs after <code>super()</code> returns the base object.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Pre-<code>class</code> Inheritance</h2>
        <p className="article-para">
          Before <code>extends</code> (2015), inheritance meant manually linking prototypes with{' '}
          <code>Object.create</code> and a confusing <code>Child.call(this, ...)</code> pattern. It worked but was
          error-prone &mdash; the &ldquo;two links&rdquo; had to be set by hand, static inheritance didn&apos;t
          happen, and <code>super</code> didn&apos;t exist (you called <code>Parent.prototype.method.call(this)</code>{' '}
          instead). The <code>class</code>/<code>extends</code> syntax hides all of this while using the exact same
          chain underneath.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Old prototype inheritance</th>
                <th><code>class extends</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Link prototypes</td>
                <td><code>Object.create</code> by hand</td>
                <td>Automatic</td>
              </tr>
              <tr>
                <td>Call parent ctor</td>
                <td><code>Parent.call(this)</code></td>
                <td><code>super()</code></td>
              </tr>
              <tr>
                <td>Call parent method</td>
                <td><code>Parent.prototype.m.call(this)</code></td>
                <td><code>super.m()</code></td>
              </tr>
              <tr>
                <td>Static inheritance</td>
                <td>No (manual copy)</td>
                <td>Automatic</td>
              </tr>
              <tr>
                <td>Underlying model</td>
                <td>Prototype chain</td>
                <td>Same prototype chain</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Tracing a Subclass Call</h2>

        <CodeBlock
          code={`class Vehicle {
  constructor(wheels) { this.wheels = wheels; }
  describe() { return \`\${this.wheels} wheels\`; }
}
class Car extends Vehicle {
  constructor(brand) {
    super(4);             // (A) parent builds the base
    this.brand = brand;   // (B) now \`this\` exists
  }
  describe() {
    return \`\${this.brand}: \${super.describe()}\`; // (C) reuse parent
  }
}
const c = new Car("Toyota");
c.describe(); // "Toyota: 4 wheels"`}
          filename="subclass-trace.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>new Car("Toyota")</code> starts. Because <code>Car</code> extends <code>Vehicle</code>,{' '}
              <code>this</code> is <em>not</em> allocated yet &mdash; creation is deferred to <code>super()</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>(A)</strong> <code>super(4)</code> calls <code>Vehicle</code>&apos;s constructor. It creates
              the object, sets <code>this.wheels = 4</code>, and returns the base object to <code>Car</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>(B)</strong> Now <code>this</code> is valid inside <code>Car</code>.{' '}
              <code>this.brand = "Toyota"</code> adds the child-specific property.
            </span>
          </li>
          <li>
            <span>
              The instance <code>c</code> has chain <code>c &rarr; Car.prototype &rarr; Vehicle.prototype &rarr;
              Object.prototype &rarr; null</code>.
            </span>
          </li>
          <li>
            <span>
              <strong>(C)</strong> <code>c.describe()</code> finds <code>describe</code> on{' '}
              <code>Car.prototype</code>. It runs with <code>this === c</code>. <code>super.describe()</code>{' '}
              resolves to <code>Vehicle.prototype.describe</code> (one level up) but still runs with{' '}
              <code>this === c</code> &rarr; <code>"4 wheels"</code>. Result: <code>"Toyota: 4 wheels"</code>.
            </span>
          </li>
        </ol>

        <p className="article-para">
          The crucial subtlety: <code>super.describe()</code> runs with <code>this</code> = the <em>child</em>{' '}
          instance, not the parent. So any <code>this.wheels</code> inside <code>Vehicle.describe</code> reads from{' '}
          <code>c</code>. <code>super</code> redirects the <em>method lookup</em>, not <code>this</code>.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Method overriding + augmentation</h3>
        <CodeBlock
          code={`class Shape {
  area() { return 0; }
  toString() { return \`Shape (area \${this.area()})\`; }
}
class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }       // override
  toString() { return "Circle, " + super.toString(); } // augment
}

new Circle(2).toString(); // "Circle, Shape (area 12.566...)"`}
          filename="override.js"
        />

        <h3 className="article-h3">2. <code>this</code> before <code>super</code> throws</h3>
        <CodeBlock
          code={`class Base { constructor() { this.x = 1; } }
class Bad extends Base {
  constructor() {
    this.y = 2;   // ReferenceError: must call super first!
    super();
  }
}
new Bad(); // throws

class Good extends Base {
  constructor() {
    super();      // OK first
    this.y = 2;   // now \`this\` is valid
  }
}`}
          filename="super-order.js"
        />

        <h3 className="article-h3">3. Static inheritance</h3>
        <CodeBlock
          code={`class Animal {
  static kingdom = "Animalia";
  static create(name) { return new this(name); } // \`this\` = the class
  constructor(name) { this.name = name; }
}
class Dog extends Animal {
  constructor(name) { super(name); }
}

Dog.kingdom;         // "Animalia" — inherited via Child → Parent
Dog.create("Rex");   // works! \`this\` is Dog → returns a Dog
// Note: \`this\` in a static method is the class it was called on, so
// create() uses new this(...) → new Dog(...) → correct subclass.`}
          filename="static-inherit.js"
        />

        <h3 className="article-h3">4. Extending built-ins</h3>
        <CodeBlock
          code={`// You can extend native classes — they're written to support it.
class LoggedArray extends Array {
  push(...items) {
    console.log("pushing", items);
    return super.push(...items);
  }
}
const a = new LoggedArray();
a.push(1, 2); // logs, then [1, 2]
a instanceof Array; // true

// Built-ins like Array, Error, Map support \`extends\` since ES6.
class MyError extends Error {
  constructor(msg, code) { super(msg); this.code = code; this.name = "MyError"; }
}`}
          filename="extend-builtin.js"
        />

        <h3 className="article-h3">5. <code>instanceof</code> across the hierarchy</h3>
        <CodeBlock
          code={`class A {}
class B extends A {}
class C extends B {}
const c = new C();

c instanceof C; // true
c instanceof B; // true  — chain reaches B.prototype
c instanceof A; // true  — chain reaches A.prototype
c instanceof Object; // true
// instanceof walks the WHOLE chain, so a subclass instance is an
// instance of every ancestor. This is Liskov substitution in action.`}
          filename="instanceof-chain.js"
        />

        <div className="article-callout">
          <p>
            <code>super</code> is statically bound to the class where it&apos;s written, not resolved dynamically at
            call time. So <code>super.m()</code> always means &ldquo;the parent of <em>this</em> class,&rdquo;
            even if <code>this</code> is a further subclass. This differs from some other languages&apos;{' '}
            <code>super</code>.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Build a hierarchy: <code>Employee</code> (name, salary) &rarr; <code>Manager</code> (adds{' '}
            <code>reports</code> array and an <code>addReport</code> method) &rarr; <code>Director</code> (overrides{' '}
            <code>salary</code> with a getter adding a bonus). Use <code>super</code> in every constructor and
            method override, and prove <code>instanceof</code> works at every level.
          </p>
        </div>

        <CodeBlock
          code={`class Employee {
  constructor(name, salary) {
    this.name = name;
    this._salary = salary;
  }
  get salary() { return this._salary; }
  describe() { return \`\${this.name}: $\${this.salary}\`; }
}

class Manager extends Employee {
  constructor(name, salary) {
    super(name, salary);
    this.reports = [];
  }
  addReport(emp) { this.reports.push(emp); return this; }
  describe() { return super.describe() + \` (\${this.reports.length} reports)\`; }
}

class Director extends Manager {
  constructor(name, salary, bonus) {
    super(name, salary);
    this.bonus = bonus;
  }
  get salary() { return super.salary + this.bonus; } // augment getter
}

const d = new Director("Sam", 100000, 50000);
d.addReport(new Employee("Pat", 60000));
d.describe(); // "Sam: $150000 (1 reports)"

d instanceof Director; // true
d instanceof Manager;  // true
d instanceof Employee; // true`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            In <code>Director</code>&apos;s <code>salary</code> getter, what does <code>super.salary</code> return
            &mdash; the <code>Employee</code> getter or the field? (It runs <code>Employee</code>&apos;s getter, which
            reads <code>this._salary</code> &mdash; 100000 &mdash; because <code>super.salary</code> is one level up
            from <code>Director.prototype</code>, landing on <code>Manager.prototype</code>, which has no{' '}
            <code>salary</code>, so it continues to <code>Employee.prototype</code>&apos;s getter. <code>this</code>{' '}
            is still <code>d</code>.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What does <code>extends</code> set up?</h4>
            <p className="iq-a">
              Two prototype links: <code>Child.prototype.__proto__ === Parent.prototype</code> (so instances inherit
              parent methods) and <code>Child.__proto__ === Parent</code> (so static methods are inherited). It also
              marks <code>Child</code> as a subclass so its constructor defers object creation to{' '}
              <code>super()</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. Why must <code>super()</code> be called before <code>this</code> in a subclass?</h4>
            <p className="iq-a">
              In a subclass, <code>new</code> does not create the object immediately &mdash; it delegates creation
              to the parent constructor via <code>super()</code>. Until <code>super()</code> runs, <code>this</code>{' '}
              is uninitialized and referencing it throws a <code>ReferenceError</code>. The parent builds the base
              object; the child then extends it.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is <code>this</code> inside a method called via <code>super</code>?</h4>
            <p className="iq-a">
              The current instance &mdash; the same <code>this</code> as the calling method. <code>super</code> only
              changes <em>where the method is looked up</em> (one level up the prototype chain); it does not change{' '}
              <code>this</code>. So a parent method invoked via <code>super</code> still sees the child&apos;s
              instance properties.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Are static methods inherited?</h4>
            <p className="iq-a">
              Yes. Because <code>Child.__proto__ === Parent</code>, a static method lookup on <code>Child</code>{' '}
              falls through to <code>Parent</code>. Inside a static method, <code>this</code> is the class the method
              was called on, so a parent&apos;s <code>{'static create() { return new this() }'}</code> correctly
              builds instances of the subclass.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Output and why?</h4>
            <CodeBlock
              code={`class P { greet() { return "P"; } }
class C extends P { greet() { return "C" + super.greet(); } }
class G extends C { greet() { return "G" + super.greet(); } }
console.log(new G().greet());`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>"GCP"</code>. Each <code>greet</code> calls <code>super.greet()</code>, which looks up one level
              on the prototype chain: <code>G.greet</code> &rarr; <code>C.greet</code> &rarr; <code>P.greet</code>.
              Each prepends its letter, so the calls unwrap as <code>P</code> then <code>"C" + "P"</code> then{' '}
              <code>"G" + "CP"</code>. <code>super</code> is statically bound per method, so each class reaches its
              own immediate parent.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Can you override a getter with a regular method (or vice versa)?</h4>
            <p className="iq-a">
              You can override any property with any property of the same name on the child&apos;s prototype, but
              mixing an accessor with a data property (or the reverse) leads to confusing behavior and is poor
              practice. Override a getter with a getter; use <code>super.x</code> inside it to reuse the parent&apos;s
              accessor. Consistency avoids surprises in property descriptors.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Implement prototypal inheritance without <code>class</code> or <code>extends</code>.</h4>
            <p className="iq-a">
              <code>{'function Parent(){} Parent.prototype.p=function(){return"P"}'}</code> /{' '}
              <code>{'function Child(){ Parent.call(this) } Child.prototype=Object.create(Parent.prototype) Child.prototype.constructor=Child Child.prototype.c=function(){return Parent.prototype.p.call(this)+"C"}'}</code>{' '}
              The three essentials: (1) call the parent constructor as a function with <code>Parent.call(this)</code>{' '}
              to set instance fields, (2) set <code>Child.prototype</code> to an object linked to{' '}
              <code>Parent.prototype</code> via <code>Object.create</code> (the instance-method link), (3) repair the{' '}
              <code>constructor</code> back-reference. There is no static link and no real <code>super</code> &mdash;
              you call <code>Parent.prototype.method.call(this)</code> by hand. This is precisely what{' '}
              <code>class extends</code> automates.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
