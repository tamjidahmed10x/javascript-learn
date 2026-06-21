import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('prototypes-oop')!
const navItems = weekNav(week)

export default function PrototypesDay6() {
  const { prev, next } = dayNavLinks(week, 6)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 6 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[5].title}</h1>
        <p className="lesson-subtitle">
          &ldquo;Favor object composition over class inheritance.&rdquo; &mdash; the Gang of Four, because deep
          hierarchies break down fast.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>Composition</strong> builds objects by combining small, independent pieces (functions or
            behavior objects) rather than deriving them from a parent class. <strong>Mixins</strong> copy methods
            onto an object; <strong>object composition</strong> delegates to separate capability objects.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            A mixin is a function that takes a target and adds methods: <code>Object.assign(Target.prototype,
            Behaviors)</code>. Composition favors <em>has-a</em> / <em>can-do</em> relationships over{' '}
            <em>is-a</em>, stitching capabilities together at construction time.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Reach for composition when a type needs capabilities from multiple sources, when the hierarchy would be
            shallow and shifting, or when you want to avoid the fragile-base-class problem. Use inheritance only for
            true is-a relationships.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Inheritance answers &ldquo;what <em>is</em> this?&rdquo; Composition answers &ldquo;what can this{' '}
          <em>do</em>?&rdquo; The difference matters the moment your hierarchy grows past two levels or needs to mix
          capabilities from more than one source.
        </p>

        <CodeBlock
          code={`// Inheritance forces a single line of descent:
class Bird extends Animal {}        // Bird IS an Animal
class Penguin extends Bird {}        // Penguin IS a Bird
// Penguin can't also extend Swimmer. Single inheritance wall.

// Composition lets you bolt on capabilities freely:
const canFly = (o) => ({ ...o, fly() { return "flying"; } });
const canSwim = (o) => ({ ...o, swim() { return "swimming"; } });

const penguin = canSwim({ name: "Pingu" });   // can swim, not fly
const eagle = canFly({ name: "Eddie" });       // can fly`}
          filename="intro.js"
        />

        <p className="article-para">
          <code>Penguin</code> is a bird that swims but doesn&apos;t fly. In a single-inheritance world you either
          give <code>Bird</code> a <code>fly</code> method (penguins inherit a lie) or split the hierarchy into
          <code> FlyingBird</code> / <code>FlightlessBird</code> (and then where do ducks go?). Composition sidesteps
          the whole mess: ask for the behaviors you need.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Mixin</dt>
            <dd className="def-text">
              A set of methods designed to be <em>copied</em> onto a class or object to add a capability, without
              becoming a parent. Implemented via <code>Object.assign</code> or a factory function.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Object composition</dt>
            <dd className="def-text">
              Building an object by giving it references to other objects that provide behavior, then delegating to
              them. &ldquo;Compose what it can do, don&apos;t inherit what it is.&rdquo;
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Fragile base class</dt>
            <dd className="def-text">
              The problem that a &ldquo;harmless&rdquo; change to a parent class silently breaks subclasses that
              depended on its internal behavior. Deeper hierarchies amplify it.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The LEGO Analogy</h2>
        <p className="article-para">
          Inheritance is a family tree: you inherit traits from ancestors, and you can&apos;t have two biological
          parents in a single-inheritance system. Composition is a box of LEGO bricks: snap together the pieces you
          want &mdash; wheels, a motor, a horn &mdash; into whatever shape serves the task.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🌳</span>
            <span className="analogy-label">Family tree</span>
            <span className="analogy-target">Inheritance (is-a)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧱</span>
            <span className="analogy-label">LEGO bricks</span>
            <span className="analogy-target">Composition (has-a / can-do)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔌</span>
            <span className="analogy-label">Plug-in module</span>
            <span className="analogy-target">Mixin</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🧰</span>
            <span className="analogy-label">Toolbox you delegate to</span>
            <span className="analogy-target">Composed helper object</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            &ldquo;Favor object composition over class inheritance&rdquo; is the second principle of object-oriented
            design from the Gang of Four (1994). It predates JavaScript by a year and is repeated in almost every
            serious OOP book since &mdash; because inheritance misused causes more pain than inheritance used well
            solves.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; Why Inheritance Breaks</h2>
        <p className="article-para">
          Inheritance isn&apos;t wrong; it&apos;s a sharp tool. It shines for <strong>true is-a</strong>{' '}
          relationships (<code>Dog</code> is-an <code>Animal</code>) and fails when stretched. The classic failure
          modes:
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. The diamond problem (single inheritance wall)</h4>
            <p className="theory-desc">
              A type needs behavior from two unrelated parents. JavaScript only allows one <code>extends</code>, so
              you&apos;re forced to invent artificial intermediate classes or duplicate code.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. The banana / gorilla / jungle problem</h4>
            <p className="theory-desc">
              &ldquo;You wanted a banana but what you got was a gorilla holding the banana and the entire
              jungle.&rdquo; Extending a class drags in its whole ancestor chain &mdash; methods and dependencies
              you never asked for.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. The fragile base class</h4>
            <p className="theory-desc">
              Subclasses rely on parent internals. A &ldquo;safe&rdquo; parent change can break every subclass in
              ways the parent author never imagined. The deeper the tree, the worse it gets.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Rigid taxonomies</h4>
            <p className="theory-desc">
              Real-world categories shift. A hierarchy designed today won&apos;t fit tomorrow&apos;s requirements,
              and refactoring a deep inheritance tree is expensive and risky.
            </p>
          </div>
        </div>

        <h3 className="article-h3">When to use which</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Use inheritance when&hellip;</span>
            <p className="phase-desc">There is a genuine, stable <em>is-a</em> relationship.</p>
            <ul className="phase-rules">
              <li><code>Error</code> &rarr; <code>MyError</code></li>
              <li><code>Array</code> &rarr; <code>LoggedArray</code></li>
              <li>Shallow (1&ndash;2 levels)</li>
              <li>Subclass truly substitutes for parent (Liskov)</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Use composition when&hellip;</span>
            <p className="phase-desc">The object <em>has</em> or <em>can-do</em> something, not <em>is</em> it.</p>
            <ul className="phase-rules">
              <li>Mixing capabilities from many sources</li>
              <li>Behavior changes at runtime</li>
              <li>Avoiding deep rigid trees</li>
              <li>Testing / mocking in isolation</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            <strong>Liskov substitution</strong> is the real test: can you swap a subclass instance everywhere a
            parent is expected, with no surprise? If <code>Penguin extends Bird</code> and <code>Bird</code> promises{' '}
            <code>fly()</code>, a penguin breaks the contract. When substitution fails, the relationship isn&apos;t
            really is-a &mdash; it&apos;s a hint you wanted composition.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; the JavaScript Take</h2>
        <p className="article-para">
          The composition-over-inheritance advice comes from the 1994 Design Patterns book, aimed at class-based
          languages. JavaScript, being prototype-based, makes composition especially natural &mdash; objects are
          just bags of properties, and you can mix, delegate, or freeze behavior at runtime. The pre-<code>class</code>{' '}
          era leaned heavily on mixins and the module pattern; modern JS combines <code>class</code> for is-a
          relationships with mixins and composition for capabilities, and increasingly uses plain functions over
          data.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Inheritance (<code>extends</code>)</th>
                <th>Mixin</th>
                <th>Object composition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Relationship</td>
                <td>is-a</td>
                <td>can-do (copied)</td>
                <td>has-a / delegates-to</td>
              </tr>
              <tr>
                <td>Source limit</td>
                <td>One parent</td>
                <td>Many</td>
                <td>Many</td>
              </tr>
              <tr>
                <td>How applied</td>
                <td>At class definition</td>
                <td><code>Object.assign</code> / factory</td>
                <td>Held as fields, delegated</td>
              </tr>
              <tr>
                <td>Runtime flexibility</td>
                <td>Static</td>
                <td>Static (once copied)</td>
                <td>Dynamic (swap the helper)</td>
              </tr>
              <tr>
                <td>Coupling</td>
                <td>Tight (whole ancestor chain)</td>
                <td>Medium</td>
                <td>Loose</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Three Ways to Add <code>fly</code></h2>

        <CodeBlock
          code={`// 1. INHERITANCE — one parent only, drags the chain
class Animal { breathe() { return "inhale"; } }
class Bird extends Animal { fly() { return "flap"; } }
class Penguin extends Bird { /* oops, penguins don't fly */ }

// 2. MIXIN — copy behavior onto the prototype
const canFly = { fly() { return "flap"; } };
const canSwim = { swim() { return "paddle"; } };
class Penguin2 {}
Object.assign(Penguin2.prototype, canSwim); // swim copied in, no fly
new Penguin2().swim(); // "paddle"

// 3. COMPOSITION — hold capability objects, delegate
const flyer = { fly() { return "flap"; } };
const swimmer = { swim() { return "paddle"; } };
const makeDuck = () => ({
  flyer, swimmer, // has-a: delegate to these
  fly() { return this.flyer.fly(); },
  swim() { return this.swimmer.swim(); },
});`}
          filename="three-ways.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Inheritance</strong> is rigid: <code>Penguin</code> inherits <code>fly</code> whether it wants
              to or not, because the capability lives on the parent class.
            </span>
          </li>
          <li>
            <span>
              <strong>Mixin</strong> copies only the methods you ask for onto the target&apos;s prototype.{' '}
              <code>Penguin2</code> gets <code>swim</code> but never <code>fly</code> &mdash; capabilities are
              à-la-carte.
            </span>
          </li>
          <li>
            <span>
              <strong>Composition</strong> keeps capabilities as separate objects and delegates at call time. Swap{' '}
              <code>flyer</code> for a <code>glider</code> and behavior changes without touching the duck.
            </span>
          </li>
          <li>
            <span>
              In all three, the final object responds to the same messages &mdash; the difference is <em>how the
              behavior got there and how changeable it is</em>.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Mixin via <code>Object.assign</code></h3>
        <CodeBlock
          code={`// Define a capability as a plain object of methods.
const Serializable = {
  serialize() { return JSON.stringify(this); },
  toJSON() {
    return Object.fromEntries(
      Object.entries(this).filter(([k]) => typeof this[k] !== "function")
    );
  },
};

class User {}
Object.assign(User.prototype, Serializable);

const u = new User();
u.name = "Tamjid";
u.serialize(); // '{"name":"Tamjid"}'
// Serializable is NOT a parent — its methods were copied onto the prototype.`}
          filename="mixin-assign.js"
        />

        <h3 className="article-h3">2. Mixin as a factory (typed-friendly, shared state)</h3>
        <CodeBlock
          code={`// A mixin factory can carry its own private state via closure.
function withLogging(Base) {
  return class extends Base {
    log(msg) { console.log(\`[\${new Date().toISOString()}] \${msg}\`); return this; }
  };
}

class Service { fetch() { return "data"; } }
class LoggedService extends withLogging(Service) {}

const s = new LoggedService();
s.log("starting").fetch(); // logs, then "data"
// This is "mixin via class expression" — composes with extends, keeps \`super\`.`}
          filename="mixin-factory.js"
        />

        <h3 className="article-h3">3. Composition over inheritance (the duck)</h3>
        <CodeBlock
          code={`// Capabilities as small, independent modules.
const quackBehavior = { quack() { return "quack"; } };
const flyBehavior = { fly() { return "flap"; } };
const noFly = { fly() { return "can't fly"; } };

// Build a duck by composing — choose behaviors at creation.
function createDuck({ fly = flyBehavior } = {}) {
  return {
    ...quackBehavior,
    ...fly,
  };
}

const mallard = createDuck();
const rubber = createDuck({ fly: noFly });

mallard.quack(); // "quack"
mallard.fly();   // "flap"
rubber.fly();    // "can't fly"
// No class hierarchy. Behaviors are swappable data.`}
          filename="composition.js"
        />

        <h3 className="article-h3">4. Functional composition (the modern default)</h3>
        <CodeBlock
          code={`// Often the cleanest JS: plain functions operating on plain data.
const data = [{ x: 1 }, { x: 2 }, { x: 3 }];

const result = data
  .map((d) => ({ ...d, y: d.x * 2 }))
  .filter((d) => d.y > 2)
  .reduce((sum, d) => sum + d.y, 0);

result; // 10 (4 + 6)
// No classes, no \`this\`, no prototype chain. Just data + pure functions.
// This is how most data-transformation code is best written in JS.`}
          filename="functional.js"
        />

        <h3 className="article-h3">5. When inheritance still wins</h3>
        <CodeBlock
          code={`// Genuine is-a + the language gives you useful machinery:
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try { throw new ValidationError("email", "invalid"); }
catch (e) {
  e instanceof Error;        // true — stack trace, message all free
  e instanceof ValidationError; // true
  e.field;                   // "email"
}
// Error already provides .stack, .message, .name. Extending is correct here:
// a ValidationError truly IS an Error. Composition would lose \`instanceof Error\`.`}
          filename="inheritance-wins.js"
        />

        <div className="article-callout">
          <p>
            Mixins via <code>Object.assign</code> can silently overwrite methods if two mixins define the same name,
            and the order of assignment decides who wins &mdash; a quiet source of bugs. With composition, conflicts
            are explicit because each capability lives behind its own object (<code>this.flyer.fly()</code> vs{' '}
            <code>this.swimmer.swim()</code>).
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (90 minutes)</span>
          <p>
            Model game entities two ways &mdash; first with a class hierarchy, then with composition &mdash; and
            compare. Entities: a <code>Player</code> that moves and attacks, a <code>Dragon</code> that moves,
            attacks, and flies, a <code>TreasureChest</code> that does nothing but can be opened. Notice where the
            class version forces awkward parents, and where composition just snaps pieces together.
          </p>
        </div>

        <CodeBlock
          code={`// COMPOSITION version — small capability objects
const movable = { move(dx, dy) { this.x += dx; this.y += dy; return this; } };
const attackable = { attack(target) { return \`\${this.name} hits \${target}\`; } };
const flyable = { fly() { return \`\${this.name} takes off\`; } };
const openable = { open() { return \`\${this.name} creaks open\`; } };

function makeEntity(name, ...capabilities) {
  return Object.assign({ name, x: 0, y: 0 }, ...capabilities);
}

const player = makeEntity("Hero", movable, attackable);
const dragon = makeEntity("Smaug", movable, attackable, flyable);
const chest = makeEntity("Chest", openable);

player.move(1, 0).attack("orc"); // "Hero hits orc"
dragon.fly();                      // "Smaug takes off"
chest.open();                      // "Chest creaks open"
// Player can't fly() — it wasn't given flyable. No lies in the type.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            If you now need a <code>FlyingChest</code> (a mimic that flies), how hard is each version? (Composition:
            add <code>flyable</code> to the list &mdash; done. Inheritance: invent a new shared parent or duplicate{' '}
            <code>fly</code>.) This asymmetry is the practical heart of &ldquo;favor composition.&rdquo;
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Composition vs inheritance &mdash; when do you choose each?</h4>
            <p className="iq-a">
              Inheritance for stable, true <em>is-a</em> relationships (<code>MyError extends Error</code>) that
              satisfy Liskov substitution. Composition when an object <em>has-a</em> or <em>can-do</em> something,
              needs capabilities from multiple sources, or its behavior should be swappable at runtime. The Gang of
              Four advice is to prefer composition because inheritance couples tightly and is rigid.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is a mixin and how do you implement one?</h4>
            <p className="iq-a">
              A mixin is a bundle of methods meant to be copied onto a class or object to add a capability, without
              being a parent. In JS you implement it with <code>Object.assign(Target.prototype, MixinObject)</code> or
              a factory function that returns a subclass (<code>{'(Base) => class extends Base {...}'}</code>). Mixins
              let one class draw capabilities from many sources, sidestepping single inheritance.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What is the fragile base class problem?</h4>
            <p className="iq-a">
              When a change to a base class breaks subclasses that depended on its internal behavior or method
              contracts. Because subclasses rely on parent implementation details, even a &ldquo;safe&rdquo; parent
              edit can ripple destructively. It&apos;s a core reason deep inheritance is discouraged.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. What is Liskov substitution and why does it matter here?</h4>
            <p className="iq-a">
              Subtypes must be usable anywhere their parent type is, without changing correctness. If{' '}
              <code>Penguin extends Bird</code> but <code>Bird</code> promises <code>fly()</code>, a penguin violates
              the contract. When substitution fails, the relationship isn&apos;t really is-a &mdash; a signal to use
              composition instead so each capability is opt-in.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). Implement a <code>withTimestamp</code> mixin.</h4>
            <p className="iq-a">
              <code>{'function withTimestamp(Base) { return class extends Base { constructor(...a){ super(...a); this.createdAt=new Date() } getAge(){ return Date.now()-this.createdAt.getTime() } } }'}</code>{' '}
              Use as <code>class Event extends withTimestamp(Base) {}</code>. The factory returns a subclass so it
              composes cleanly with <code>super</code> and stays a real <code>extends</code> relationship. Each mixed
              instance gets <code>createdAt</code> and <code>getAge()</code> for free.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What&apos;s a risk of mixin-based composition?</h4>
            <p className="iq-a">
              Name collisions: two mixins defining the same method silently overwrite one another, with the last{' '}
              <code>Object.assign</code> winning &mdash; a quiet, hard-to-debug bug. It can also flatten the{' '}
              <code>this</code> namespace into one bag, reducing explicitness. Object composition (delegating to
              separate held objects) avoids collisions because each capability sits behind its own property.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Why is &ldquo;a penguin is a bird&rdquo; a flawed inheritance?</h4>
            <p className="iq-a">
              Because the intuitive biological hierarchy doesn&apos;t match the behavioral contract. If{' '}
              <code>Bird</code> exposes <code>fly()</code>, then every <code>Bird</code> subtype promises flight &mdash;
              but penguins can&apos;t fly, so <code>Penguin extends Bird</code> violates Liskov substitution (code
              expecting <code>fly()</code> to work breaks). The fix is composition: model &ldquo;can fly&rdquo; as a
              capability (mix <code>flyable</code> into flying species only), and keep <code>Bird</code> free of the{' '}
              <code>fly</code> assumption. The lesson: biological is-a and behavioral is-a are different &mdash;
              design hierarchies around behavior, not taxonomy.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
