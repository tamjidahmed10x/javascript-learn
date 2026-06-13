import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import type { NavItem } from '../../components/ContentLayout'
import { week1NavItems } from './navConfig'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const navItems: NavItem[] = [
  { label: 'Overview', path: '/core-concepts/execution-context-scope' },
  ...week1NavItems,
  { label: 'EC Reference Guide', path: '/core-concepts/execution-context-guide' },
]

export default function ExecutionContextGuide() {
  return (
    <ContentLayout title="Core Concepts" subtitle="Week 1" navItems={navItems}>
      <article className="article">
        <header className="article-header">
          <span className="lesson-tag">Reference</span>
          <h1 className="lesson-title">JavaScript Execution Context — A Complete Guide</h1>
          <p className="article-lead">
            The invisible scaffolding under every piece of JavaScript you write. Understanding execution contexts makes JavaScript predictable.
          </p>
        </header>

        {/* ── What Is an Execution Context? ─────────────────── */}
        <section className="article-section" id="what-is">
          <h2 className="article-h2">What Is an Execution Context?</h2>
          <p>
            When a JavaScript engine runs your code, it doesn't just read it line by line in a vacuum.
            It creates a structured environment around every piece of code before it even begins executing.
            That environment is called an <strong>execution context</strong>.
          </p>
          <p>
            Think of it as the <em>"room"</em> in which your code lives. The room knows what variables exist,
            what <code>this</code> refers to, and what outer scope it has access to. Everything in JavaScript —
            every function call, every global script — runs inside one of these rooms.
          </p>
          <p>There are three types of execution contexts:</p>
          <ol className="article-ol">
            <li><strong>Global Execution Context (GEC)</strong></li>
            <li><strong>Function Execution Context (FEC)</strong></li>
            <li>
              <strong>Eval Execution Context</strong> — rarely used; considered unsafe and largely
              ignored in modern practice
            </li>
          </ol>
        </section>

        {/* ── The Call Stack ────────────────────────────────── */}
        <section className="article-section" id="call-stack">
          <h2 className="article-h2">The Call Stack</h2>
          <p>
            Before going deeper, you need to understand the <strong>call stack</strong> — the mechanism
            JavaScript uses to track execution contexts.
          </p>
          <p>
            The call stack is a LIFO (Last In, First Out) data structure. When a script starts, the Global
            Execution Context is pushed onto the stack. Every time a function is called, a new Function
            Execution Context is pushed on top. When that function finishes, its context is popped off, and
            control returns to whatever was below it.
          </p>

          <div className="stack-visual">
            <div className="stack-row stack-active">
              <span className="stack-label">FEC: greet()</span>
              <span className="stack-note">← currently running</span>
            </div>
            <div className="stack-row">
              <span className="stack-label">FEC: sayHello()</span>
            </div>
            <div className="stack-row">
              <span className="stack-label">GEC</span>
              <span className="stack-note">← always at the bottom</span>
            </div>
          </div>

          <p>
            JavaScript is single-threaded, meaning only one execution context runs at a time — always
            the one on top of the stack.
          </p>
        </section>

        {/* ── Phases ───────────────────────────────────────── */}
        <section className="article-section" id="phases">
          <h2 className="article-h2">Phases of an Execution Context</h2>
          <p>
            Every execution context, whether global or function-level, is created and runs in
            <strong>two distinct phases</strong>.
          </p>

          <h3 className="article-h3">Phase 1 — Creation Phase</h3>
          <p className="article-subnote">Hoisting happens here.</p>
          <p>
            Before a single line of your code runs, the JavaScript engine scans through it and sets up the
            execution context. During this phase:
          </p>

          <div className="article-card">
            <h4 className="article-card-title">Variables declared with <code>var</code></h4>
            <p>
              Are registered in memory and initialized to <code>undefined</code>. They exist before
              their line is reached, but their value is <code>undefined</code> until the assignment is
              actually executed.
            </p>
          </div>

          <div className="article-card">
            <h4 className="article-card-title">Function declarations</h4>
            <p>
              Are fully hoisted — not just the name, but the entire function body. You can call a function
              declaration before it appears in the source code, and it will work.
            </p>
          </div>

          <div className="article-card">
            <h4 className="article-card-title"><code>let</code> and <code>const</code> declarations</h4>
            <p>
              Are also registered in memory during the creation phase, but they are <strong>not
              initialized</strong>. They sit in the <strong>Temporal Dead Zone (TDZ)</strong> — they exist
              as names, but accessing them before their declaration line throws a <code>ReferenceError</code>.
            </p>
          </div>

          <div className="article-card">
            <h4 className="article-card-title"><code>this</code> is bound</h4>
            <p>
              Its value is determined during creation. In the global context, <code>this</code> refers
              to the global object (<code>window</code> in browsers, <code>global</code> in Node.js).
              In a function context, <code>this</code> depends on how the function was called.
            </p>
          </div>

          <div className="article-card">
            <h4 className="article-card-title">Outer environment (scope chain)</h4>
            <p>
              The engine records a reference to the outer lexical environment. This is what makes closures
              possible.
            </p>
          </div>

          <h3 className="article-h3">Phase 2 — Execution Phase</h3>
          <p>
            Now the engine goes through your code line by line, top to bottom, and actually executes it.
            Variable assignments are made. Functions are called, triggering new execution contexts on the
            stack. Expressions are evaluated. Results are returned.
          </p>
        </section>

        {/* ── Components ───────────────────────────────────── */}
        <section className="article-section" id="components">
          <h2 className="article-h2">Components Inside an Execution Context</h2>
          <p>Each execution context contains three core components.</p>

          <h3 className="article-h3">1. The Variable Environment</h3>
          <p>
            This is where all variable and function declarations are stored. In older ES5 terms, this was
            called the <strong>Variable Object</strong>. It holds:
          </p>
          <ul className="learn-list">
            <li>Variables declared with <code>var</code></li>
            <li>Function declarations</li>
            <li>The function's arguments object (inside function contexts)</li>
          </ul>

          <h3 className="article-h3">2. The Lexical Environment</h3>
          <p>
            Introduced more formally with ES6, the lexical environment is where <code>let</code> and{' '}
            <code>const</code> bindings live. It also contains a reference to the <strong>outer lexical
            environment</strong> — the lexical environment of the scope where the function was <em>defined
            </em>, not where it was <em>called</em>. This distinction is the entire foundation of{' '}
            <strong>closures</strong>.
          </p>

          <h3 className="article-h3">3. The <code>this</code> Binding</h3>
          <p>
            This is one of the most misunderstood parts of JavaScript. <code>this</code> is not a variable
            you set — it's a binding determined at call time (with some exceptions).
          </p>

          <div className="this-table">
            <table>
              <thead>
                <tr>
                  <th>Context</th>
                  <th><code>this</code> value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Global context</td>
                  <td><code>window</code> (browser) / <code>global</code> (Node.js)</td>
                </tr>
                <tr>
                  <td>Regular function call</td>
                  <td><code>undefined</code> (strict) / global object (non-strict)</td>
                </tr>
                <tr>
                  <td>Method call (obj.fn())</td>
                  <td>The object to the left of the dot</td>
                </tr>
                <tr>
                  <td>Constructor call (new)</td>
                  <td>The newly created object</td>
                </tr>
                <tr>
                  <td><code>call</code>, <code>apply</code>, <code>bind</code></td>
                  <td>Explicitly set by you</td>
                </tr>
                <tr>
                  <td>Arrow function</td>
                  <td>Inherited from surrounding lexical context</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── GEC ───────────────────────────────────────────── */}
        <section className="article-section" id="gec">
          <h2 className="article-h2">The Global Execution Context in Detail</h2>
          <p>
            When your JavaScript file first loads, the engine creates the Global Execution Context
            automatically. It is the foundation of everything.
          </p>
          <p>During its creation phase:</p>
          <ul className="check-list">
            <li>A global object is created (<code>window</code> in browsers)</li>
            <li><code>this</code> is set to that global object</li>
            <li>All <code>var</code> declarations and function declarations in the global scope are hoisted</li>
          </ul>
          <p>
            There is exactly one Global Execution Context per JavaScript runtime. It stays on the bottom
            of the call stack for the entire lifetime of the program.
          </p>
        </section>

        {/* ── FEC ──────────────────────────────────────────── */}
        <section className="article-section" id="fec">
          <h2 className="article-h2">Function Execution Contexts in Detail</h2>
          <p>
            Every time a function is <strong>called</strong> (not defined — called), a brand new Function
            Execution Context is created and pushed onto the call stack.
          </p>

          <CodeBlock
            code={`function outer() {
  let x = 10;

  function inner() {
    let y = 20;
    console.log(x + y); // 30 — x from outer's lexical env
  }

  inner();
}

outer();`}
            filename="fec.js"
          />

          <p style={{ color: 'var(--color-muted)', margin: '0.75rem 0' }}>
            When <code>outer()</code> is called, a new FEC is created for it. When <code>inner()</code>{' '}
            is called from inside <code>outer()</code>, another FEC is created. <code>inner</code>'s
            lexical environment has a reference to <code>outer</code>'s lexical environment — so when it
            looks up <code>x</code>, it finds it there. This chain of outer environment references is
            the <strong>scope chain</strong>.
          </p>
          <p style={{ color: 'var(--color-muted)' }}>
            When <code>inner()</code> finishes, its FEC is destroyed and popped off the stack. When{' '}
            <code>outer()</code> finishes, its FEC is destroyed too. Control returns to the GEC.
          </p>
        </section>

        {/* ── Scope Chain ──────────────────────────────────── */}
        <section className="article-section" id="scope-chain">
          <h2 className="article-h2">The Scope Chain</h2>
          <p>
            Every execution context has access to its own variables and to the variables of every outer
            scope up the chain. This is the scope chain — a linked list of lexical environments going
            from the current context outward to the global.
          </p>

          <div className="article-callout">
            <p>
              <strong>The key rule:</strong> the scope chain is determined by where functions are written
              in the source code, not where they are called from. This is called{' '}
              <strong>lexical scoping</strong> (or <strong>static scoping</strong>).
            </p>
          </div>

          <CodeBlock
            code={`let name = "global";

function foo() {
  console.log(name); // "global"
}

function bar() {
  let name = "bar";
  foo(); // foo is called here, but its scope chain goes to global
}

bar(); // logs "global", not "bar"`}
            filename="lexical.js"
          />

          <p style={{ color: 'var(--color-muted)', margin: '0.5rem 0' }}>
            Even though <code>foo</code> is called from inside <code>bar</code>, it doesn't have access
            to <code>bar</code>'s <code>name</code>. Its outer environment is the global scope because
            that's where it was <em>defined</em>.
          </p>
        </section>

        {/* ── Closures ──────────────────────────────────────── */}
        <section className="article-section" id="closures">
          <h2 className="article-h2">Closures — The Practical Consequence</h2>
          <p>
            A closure happens when a function retains access to its outer lexical environment even after
            that outer function has finished executing and its execution context has been removed from
            the call stack.
          </p>

          <CodeBlock
            code={`function makeCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3`}
            filename="closure.js"
          />

          <p style={{ color: 'var(--color-muted)', margin: '0.5rem 0' }}>
            <code>makeCounter()</code> finishes running, its FEC is destroyed — but the inner function
            still holds a reference to the lexical environment where <code>count</code> lives. The garbage
            collector doesn't clean up <code>count</code> because there's still an active reference to
            it. This is a closure.
          </p>

          <div className="article-callout">
            <p>
              Closures are not a "trick" or an edge case — they are the direct, inevitable result of how
              execution contexts work.
            </p>
          </div>
        </section>

        {/* ── Hoisting Revisited ────────────────────────────── */}
        <section className="article-section" id="hoisting">
          <h2 className="article-h2">Hoisting — Revisited with Full Context</h2>
          <p>
            Hoisting is not "JavaScript moves your code to the top." That's a metaphor. What actually
            happens is that during the <strong>creation phase</strong> of an execution context, declarations
            are registered in memory before the execution phase begins.
          </p>

          <CodeBlock
            code={`console.log(a); // undefined — var hoisted, initialized to undefined
var a = 5;

console.log(b); // ReferenceError — let is in TDZ
let b = 10;

hello(); // "Hello!" — function declaration fully hoisted
function hello() {
  console.log("Hello!");
}

world(); // TypeError: world is not a function
var world = function () {
  console.log("World!");
};`}
            filename="hoisting.js"
          />

          <p style={{ color: 'var(--color-muted)', margin: '0.5rem 0' }}>
            The last example is important: <code>world</code> is a variable declared with <code>var</code>,
            so it's hoisted as <code>undefined</code>. Calling <code>undefined()</code> throws a{' '}
            <code>TypeError</code>. Only the variable name is hoisted — not the function expression
            assigned to it.
          </p>
        </section>

        {/* ── this Revisited ───────────────────────────────── */}
        <section className="article-section" id="this-binding">
          <h2 className="article-h2"><code>this</code> Binding — One More Look</h2>
          <p>
            Because <code>this</code> is bound during the creation phase of each execution context, its
            value is determined by how the function is invoked, not how it's defined. This trips up
            developers constantly.
          </p>

          <CodeBlock
            code={`const obj = {
  name: "Tamjid",
  greet: function () {
    console.log(this.name);
  },
  greetArrow: () => {
    console.log(this.name); // undefined — arrow has no own this
  },
};

obj.greet();       // "Tamjid" — this === obj
obj.greetArrow();  // undefined — this === window/global

const fn = obj.greet;
fn();              // undefined in strict mode — this is not obj anymore`}
            filename="this.js"
          />

          <p style={{ color: 'var(--color-muted)', margin: '0.5rem 0' }}>
            When you extract a method from an object and call it as a plain function, <code>this</code> is
            no longer the object. The method definition doesn't change. The <em>call site</em> changed,
            and so <code>this</code> changed.
          </p>
        </section>

        {/* ── Putting It Together ───────────────────────────── */}
        <section className="article-section" id="walkthrough">
          <h2 className="article-h2">Putting It All Together</h2>
          <p>Here is what happens, step by step, when this code runs:</p>

          <CodeBlock
            code={`let x = 1;

function add(a, b) {
  return a + b;
}

function multiply(n) {
  let result = add(n, n);
  return result;
}

let answer = multiply(5);`}
            filename="full.js"
          />

          <ol className="article-steps">
            <li>
              The JavaScript engine creates the <strong>Global Execution Context</strong>.
            </li>
            <li>
              <strong>Creation phase (GEC):</strong> <code>x</code> is registered (TDZ, <code>let</code>).
              <code>add</code> and <code>multiply</code> are fully hoisted as function declarations.{' '}
              <code>answer</code> is registered (TDZ).
            </li>
            <li>
              <strong>Execution phase (GEC) begins:</strong> <code>x</code> is assigned <code>1</code>.{' '}
              <code>answer</code> triggers a call to <code>multiply(5)</code>.
            </li>
            <li>
              A new <strong>Function Execution Context for <code>multiply</code></strong> is pushed onto
              the stack. <code>n</code> is <code>5</code>. <code>result</code> is registered.
            </li>
            <li>
              Inside <code>multiply</code>, <code>add(n, n)</code> is called. A new <strong>
              FEC for <code>add</code></strong> is pushed. <code>a</code> is <code>5</code>, <code>b</code> is{' '}
              <code>5</code>.
            </li>
            <li>
              <code>add</code> returns <code>10</code>. Its FEC is popped off the stack.
            </li>
            <li>
              Back in <code>multiply</code>: <code>result</code> is assigned <code>10</code>.{' '}
              <code>multiply</code> returns <code>10</code>. Its FEC is popped.
            </li>
            <li>
              Back in the GEC: <code>answer</code> is assigned <code>10</code>.
            </li>
            <li>
              The script ends. The GEC remains on the stack until the page or runtime shuts down.
            </li>
          </ol>
        </section>

        {/* ── Summary ───────────────────────────────────────── */}
        <section className="article-section" id="summary">
          <h2 className="article-h2">Summary</h2>
          <p>
            The execution context is the invisible scaffolding under every piece of JavaScript you write.
            It determines what variables exist, what <code>this</code> means, what scope you can reach,
            and in what order things happen. Two phases — creation and execution — govern every context.
            The call stack tracks which context is currently active. The scope chain, built from lexical
            environment references, makes closures natural rather than magical. And <code>this</code>,
            bound fresh in each context, depends entirely on the call site.
          </p>

          <div className="article-callout">
            <p>
              Understanding execution contexts doesn't just make you better at debugging — it makes
              JavaScript <strong>predictable</strong>.
            </p>
          </div>
        </section>
      </article>
    </ContentLayout>
  )
}
