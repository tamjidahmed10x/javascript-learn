import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('prototypes-oop')!
const navItems = weekNav(week)

export default function PrototypesDay1() {
  const { next } = dayNavLinks(week, 1)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[0].title}</h1>
        <p className="lesson-subtitle">
          JavaScript has no classes. It has objects linked to other objects &mdash; and that one link explains
          everything.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            Every object has a hidden link called <code>[[Prototype]]</code> pointing to another object. When a
            property isn&apos;t found on the object itself, the engine follows that link and keeps following it.
            That chain of links is the <strong>prototype chain</strong>.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            A property lookup starts on the receiver, then walks <code>[[Prototype]]</code> &rarr;{' '}
            <code>[[Prototype]]</code> &rarr; &hellip; until it finds the property or reaches <code>null</code>.
            It stops at the first match and never searches upward again for that read.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always. Every read of any property &mdash; <code>arr.push</code>, <code>str.split</code>,{' '}
            <code>obj.toString</code> &mdash; is a prototype-chain lookup. You use it hundreds of times a day
            without noticing.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Forget classes for a week. Here is how JavaScript actually models objects: every object carries a
          private pointer to <strong>another object</strong> that acts as its fallback. You read it here first
          because every other day this week builds on it.
        </p>

        <CodeBlock
          code={`const animal = { breathes: true };
const dog = Object.create(animal);
dog.barks = true;

dog.barks;     // true   — own property
dog.breathes;  // true   — NOT own, found on animal
dog.eats;      // undefined — not found anywhere`}
          filename="first-chain.js"
        />

        <p className="article-para">
          <code>dog</code> has no <code>breathes</code> property of its own. Yet the read succeeds. The engine
          didn&apos;t give up when it missed on <code>dog</code> &mdash; it walked to <code>dog</code>&apos;s
          prototype (<code>animal</code>) and found it there. That walk is the entire mechanism of inheritance
          in JavaScript.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Prototype</dt>
            <dd className="def-text">
              The object that another object delegates to. Used as a fallback during property lookups.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Prototype Chain</dt>
            <dd className="def-text">
              The linked list formed by following <code>[[Prototype]]</code> pointers from object to object,
              ending at <code>null</code>.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term"><code>[[Prototype]]</code></dt>
            <dd className="def-text">
              The internal slot storing the prototype link. Not a real property &mdash; you read it with{' '}
              <code>Object.getPrototypeOf()</code> or the <code>__proto__</code> accessor (Day 2).
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Delegation Analogy</h2>
        <p className="article-para">
          Imagine a junior employee (<code>dog</code>) who doesn&apos;t know the answer to a question. Instead of
          saying &ldquo;I don&apos;t know,&rdquo; they escalate to their manager (<code>animal</code>). The
          manager either answers or escalates further. The question only fails if it reaches the top and nobody
          knows.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🧑</span>
            <span className="analogy-label">The asker</span>
            <span className="analogy-target">The object you read from</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📎</span>
            <span className="analogy-label">The org chart</span>
            <span className="analogy-target">The prototype chain</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">⬆️</span>
            <span className="analogy-label">Escalation</span>
            <span className="analogy-target">Following [[Prototype]]</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🛑</span>
            <span className="analogy-label">The CEO with no boss</span>
            <span className="analogy-target">null (chain end)</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Crucially, this is <strong>delegation, not copying</strong>. <code>dog</code> does not get its own
            copy of <code>breathes</code>. It borrows <code>animal</code>&apos;s at read time. Change{' '}
            <code>animal.breathes</code> and every dog that delegates to it sees the change instantly.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          The lookup algorithm is small enough to memorize. Every property read in JavaScript runs through it.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Check own properties first</h4>
            <p className="theory-desc">
              The engine looks for the key on the object itself. If it&apos;s there (own or inherited as own via
              assignment), return it. No chain walk needed.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Follow the <code>[[Prototype]]</code> link</h4>
            <p className="theory-desc">
              On a miss, read the object&apos;s <code>[[Prototype]]</code> and repeat the search on that object.
              This is one hop up the chain.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Stop at <code>null</code></h4>
            <p className="theory-desc">
              The chain terminates at <code>null</code> &mdash; <code>Object.prototype.__proto__</code> is{' '}
              <code>null</code>. A miss there means the property doesn&apos;t exist; the read returns{' '}
              <code>undefined</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Writes usually don&apos;t walk the chain</h4>
            <p className="theory-desc">
              Assigning <code>dog.breathes = false</code> creates a new own property on <code>dog</code> (shadowing)
              rather than mutating <code>animal</code>. Day 5 covers the exceptions.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The universal root: <code>Object.prototype</code></h3>
        <p className="article-para">
          Every &ldquo;normal&rdquo; object eventually chains up to <code>Object.prototype</code>, which holds{' '}
          <code>toString</code>, <code>hasOwnProperty</code>, <code>valueOf</code>, and friends. That is why every
          object can call those methods.
        </p>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Class-based mental model (wrong for JS)</span>
            <p className="phase-desc">
              A class is a template. Instances get their own copies of the methods defined in the class.
            </p>
            <ul className="phase-rules">
              <li>Methods are copied onto instances</li>
              <li>Inheritance = copying down a hierarchy</li>
              <li>Classes are the primary unit</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Prototypal reality (correct)</span>
            <p className="phase-desc">
              There are only objects. Methods live on the prototype object and are <em>delegated to</em>, never
              copied.
            </p>
            <ul className="phase-rules">
              <li>One shared prototype holds the methods</li>
              <li>Inheritance = linking objects together</li>
              <li>Objects are the primary unit</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Prototypes</h2>
        <p className="article-para">
          Brendan Eich was hired in 1995 to put Scheme (a Lisp) in the browser. Marketing demanded a Java-like
          syntax. The compromise: a language with prototype-based objects (inspired by Self) wearing Java&apos;s
          clothes. That is why JavaScript has <code>new</code>, constructors, and a <code>class</code> keyword
          that, until 2015, didn&apos;t exist &mdash; the underlying model was always prototypes.
        </p>
        <p className="article-para">
          The 2015 <code>class</code> keyword did <strong>not</strong> change the model. It is syntax sugar over
          the prototype machinery you&apos;re learning today. This is why understanding prototypes matters even in
          a codebase full of <code>class</code>: the interview question &ldquo;how does a JS class work
          internally?&rdquo; has only one honest answer &mdash; prototypes.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>JavaScript</th>
                <th>Java</th>
                <th>Python</th>
                <th>Self</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inheritance model</td>
                <td>Prototypal (delegation)</td>
                <td>Class-based</td>
                <td>Class-based</td>
                <td>Prototypal</td>
              </tr>
              <tr>
                <td>Are methods copied?</td>
                <td>No (shared on prototype)</td>
                <td>Effectively yes</td>
                <td>Stored on class</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Can objects link directly?</td>
                <td>Yes (<code>Object.create</code>)</td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>class</code> keyword</td>
                <td>Sugar over prototypes</td>
                <td>Native</td>
                <td>Native</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; Walking the Chain</h2>

        <CodeBlock
          code={`const grand = { inherited: "from grand" };
const parent = Object.create(grand);
parent.own = "on parent";
const child = Object.create(parent);
child.label = "child";

child.inherited; // ?`}
          filename="three-deep.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              Read <code>child.inherited</code>. Does <code>child</code> own <code>inherited</code>? No &mdash;
              only <code>label</code>.
            </span>
          </li>
          <li>
            <span>
              Follow <code>child.[[Prototype]]</code> &rarr; <code>parent</code>. Does <code>parent</code> own{' '}
              <code>inherited</code>? No &mdash; only <code>own</code>.
            </span>
          </li>
          <li>
            <span>
              Follow <code>parent.[[Prototype]]</code> &rarr; <code>grand</code>. Does <code>grand</code> own{' '}
              <code>inherited</code>? Yes &rarr; return <code>"from grand"</code>.
            </span>
          </li>
          <li>
            <span>
              The walk stopped. Two hops, one result. If <code>grand</code> also missed, the next hop would be{' '}
              <code>Object.prototype</code>, then <code>null</code>, returning <code>undefined</code>.
            </span>
          </li>
        </ol>

        <p className="article-para">
          You can observe the same chain on plain objects you never touched:
        </p>
        <CodeBlock
          code={`const obj = {};
obj.toString;        // ƒ toString() — from Object.prototype
obj.hasOwnProperty;  // ƒ hasOwnProperty() — from Object.prototype

Object.getPrototypeOf(obj) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype);         // null (chain end)`}
          filename="plain-object.js"
        />
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. Setting a link with <code>Object.create</code></h3>
        <CodeBlock
          code={`const vehicle = { move() { return "moving"; } };
const car = Object.create(vehicle);   // car.[[Prototype]] = vehicle

car.move();           // "moving" — delegated
car.hasOwnProperty("move"); // false — it's inherited

// Confirm the link:
Object.getPrototypeOf(car) === vehicle; // true`}
          filename="object-create.js"
        />

        <h3 className="article-h3">2. Shadowing an inherited property</h3>
        <CodeBlock
          code={`const base = { speed: 10 };
const fast = Object.create(base);

fast.speed;   // 10 — from base
fast.speed = 99;  // creates an OWN property on fast
fast.speed;   // 99 — own wins, chain no longer consulted

base.speed;   // 10 — base was never touched`}
          filename="shadowing.js"
        />

        <h3 className="article-h3">3. The chain is live</h3>
        <CodeBlock
          code={`const proto = { greet() { return "hi"; } };
const obj = Object.create(proto);

obj.greet();      // "hi"
proto.greet = function () { return "hello"; };
obj.greet();      // "hello" — sees the change, no copy was made

proto.farewell = function () { return "bye"; };
obj.farewell();   // "bye" — new methods appear for free`}
          filename="live-chain.js"
        />

        <h3 className="article-h3">4. Arrays chain to <code>Array.prototype</code></h3>
        <CodeBlock
          code={`const nums = [1, 2, 3];
nums.map;          // ƒ map() — not own, from Array.prototype
nums.push;         // ƒ push() — from Array.prototype

Object.getPrototypeOf(nums) === Array.prototype; // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
// nums → Array.prototype → Object.prototype → null`}
          filename="array-chain.js"
        />

        <h3 className="article-h3">5. Performance: long chains cost reads</h3>
        <CodeBlock
          code={`// Each miss is a hop. A 1000-deep chain means up to 1000 hops
// for a missing property. Engines cache lookups (inline caching),
// but deep delegation is still a code smell. Keep chains shallow.
const deep = Object.create(
  Object.create(
    Object.create(
      Object.create({ found: "way down" })
    )
  )
);
deep.found; // works, but walks 4 links`}
          filename="deep-chain.js"
        />

        <div className="article-callout">
          <p>
            <strong>hasOwnProperty</strong> tells you whether a property lives on the object itself (ignoring the
            chain). <code>in</code> tells you whether it&apos;s reachable (own <em>or</em> inherited). They answer
            different questions &mdash; don&apos;t mix them up.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Using only <code>Object.create</code> and <code>Object.getPrototypeOf</code> (no <code>class</code>, no{' '}
            <code>new</code>), model a 3-level chain: <code>device</code> &rarr; <code>phone</code> &rarr;{' '}
            <code>smartphone</code>. Put a shared method on each level and prove it&apos;s reachable from the child
            without being copied.
          </p>
        </div>

        <CodeBlock
          code={`const device = {
  powered: true,
  powerOff() { this.powered = false; },
};

const phone = Object.create(device);
phone.ring = function () { return "brrrng"; };

const smartphone = Object.create(phone);
smartphone.browse = function () { return this.powered ? "online" : "offline"; };

smartphone.ring();        // "brrrng" — delegated to phone
smartphone.powerOff();    // runs device.powerOff with this=smartphone
smartphone.powered;       // false — \`this\` was smartphone
smartphone.browse();      // "offline"

// Prove nothing was copied:
smartphone.hasOwnProperty("ring");       // false
smartphone.hasOwnProperty("powered");    // false
smartphone.hasOwnProperty("browse");     // true`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            When <code>powerOff</code> ran, what was <code>this</code>? (Answer: <code>smartphone</code>. Methods
            delegated up the chain still execute with <code>this</code> bound to the original receiver &mdash; the
            link Week 2&apos;s <code>this</code> rules have to this week&apos;s prototypes.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is the prototype chain?</h4>
            <p className="iq-a">
              The series of objects connected by <code>[[Prototype]]</code> links that the engine walks when a
              property isn&apos;t found on the receiver. It starts at the object, follows <code>[[Prototype]]</code>{' '}
              to the next object, and continues until the property is found or the chain ends at <code>null</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. How do you read an object&apos;s prototype?</h4>
            <p className="iq-a">
              With <code>Object.getPrototypeOf(obj)</code> (preferred) or the legacy <code>obj.__proto__</code>{' '}
              accessor. The link itself lives in the internal <code>[[Prototype]]</code> slot, which isn&apos;t a
              normal property and can&apos;t be read directly.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. What terminates the prototype chain?</h4>
            <p className="iq-a">
              <code>null</code>. <code>Object.prototype</code> is the root for ordinary objects, and its{' '}
              <code>[[Prototype]]</code> is <code>null</code>. When a lookup reaches <code>null</code> without a
              match, the property is absent and the read returns <code>undefined</code>.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Does assigning a property walk the chain?</h4>
            <p className="iq-a">
              Generally no &mdash; assignment creates or updates an <em>own</em> property on the receiver, shadowing
              any inherited one rather than mutating the prototype. Exceptions exist (setters on the prototype, and
              read-only properties in strict mode), covered in Day 5.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q5. <code>hasOwnProperty</code> vs the <code>in</code> operator?</h4>
            <p className="iq-a">
              <code>obj.hasOwnProperty(&apos;x&apos;)</code> is true only if <code>x</code> is an own property.
              <code> &apos;x&apos; in obj</code> is true if <code>x</code> is reachable anywhere along the chain.{' '}
              <code>in</code> searches; <code>hasOwnProperty</code> does not.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Output and why?</h4>
            <CodeBlock
              code={`const a = { x: 1 };
const b = Object.create(a);
b.x = 2;
console.log(b.x, a.x);`}
              filename="q6.js"
            />
            <p className="iq-a">
              <code>2 1</code>. The assignment <code>b.x = 2</code> creates an own property on <code>b</code>,
              shadowing the inherited one. <code>b.x</code> now reads the own value (2); <code>a.x</code> was never
              touched (1). Reads consult own properties first and short-circuit.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q7 (Medium). Output and why?</h4>
            <CodeBlock
              code={`const proto = { greet: () => "hi" };
const obj = Object.create(proto);
proto.greet = () => "hello";
console.log(obj.greet());`}
              filename="q7.js"
            />
            <p className="iq-a">
              <code>"hello"</code>. The chain is live &mdash; <code>obj</code> holds a link to <code>proto</code>,
              not a snapshot. Replacing <code>proto.greet</code> is visible to <code>obj</code> immediately because
              the lookup happens at read time, delegating to the (now changed) prototype.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q8 (Hard). Trace every lookup and the final value.</h4>
            <CodeBlock
              code={`const o = { v: 1 };
const p = Object.create(o);
const q = Object.create(p);
q.v = 5;
delete q.v;
console.log(q.v);`}
              filename="q8.js"
            />
            <p className="iq-a">
              <code>1</code>. First <code>q.v = 5</code> creates an own property on <code>q</code>. Then{' '}
              <code>delete q.v</code> removes it. Now <code>q.v</code> misses on <code>q</code>, walks to{' '}
              <code>p</code> (miss), walks to <code>o</code> (hit, value 1). <code>delete</code> only removes own
              properties &mdash; it cannot delete inherited ones &mdash; so the chain lookup falls through to{' '}
              <code>o</code>.
            </p>
          </div>
        </div>
      </section>

      <DayNav next={next} />
    </ContentLayout>
  )
}
