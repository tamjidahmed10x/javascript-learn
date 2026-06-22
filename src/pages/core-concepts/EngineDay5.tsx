import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('js-engine-internals')!
const navItems = weekNav(week)

export default function EngineDay5() {
  const { prev, next } = dayNavLinks(week, 5)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 5 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[4].title}</h1>
        <p className="lesson-subtitle">
          Where values live decides how they&apos;re passed, copied, and collected. Primitives on the stack, objects on
          the heap &mdash; and the &ldquo;by value vs by reference&rdquo; rule falls out of that.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            JS memory lives in two regions: the <strong>stack</strong> (call frames &mdash; primitives, local
            variables, references) and the <strong>heap</strong> (objects, dynamically allocated, GC-managed).
            Primitives are stored by value; objects live on the heap and variables hold references to them.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            A function call pushes a frame of locals onto the stack; assigning a primitive copies the value, assigning
            an object copies the reference (both names point to one heap object). The stack unwinds on return; heap
            objects are freed by the GC when unreachable (Week 6 Day 3).
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Always. Understanding stack vs heap explains &ldquo;by value vs by reference,&rdquo; why closures keep
            variables alive (Week 2), why deep recursion overflows the stack, and what the GC actually reclaims.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          You&apos;ve heard &ldquo;primitives are passed by value, objects by reference.&rdquo; That&apos;s the
          consequence of a deeper fact: values live in one of two memory regions with very different lifetimes and
          costs. Today we make the stack-vs-heap model precise &mdash; the foundation under closures, GC, and the
          &ldquo;copy vs share&rdquo; behavior you use daily.
        </p>

        <CodeBlock
          code={`let a = 5;       // 5 stored in \`a\`'s slot (primitive, by value)
let b = a;       // COPIES 5 into \`b\`'s slot. a and b are independent.
b = 10;
console.log(a);  // 5 — a unchanged

let o = { n: 1 }; // object lives on the HEAP; \`o\` holds a reference
let p = o;        // COPIES the reference, not the object. o and p share.
p.n = 99;
console.log(o.n); // 99 — same object, seen through both names`}
          filename="intro.js"
        />

        <p className="article-para">
          Reassigning <code>b</code> didn&apos;t affect <code>a</code> &mdash; the primitive was copied. Mutating{' '}
          <code>p.n</code> <em>did</em> affect <code>o.n</code> &mdash; because <code>o</code> and <code>p</code> hold
          references to the <em>same</em> heap object. This single distinction is the root of almost every
          &ldquo;why did this change?&rdquo; bug.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Stack</dt>
            <dd className="def-text">
              A LIFO region of call frames. Each function call pushes locals (primitives and references); return pops
              them. Fast, automatic, last-in-first-out. Bounded &mdash; deep recursion overflows it.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Heap</dt>
            <dd className="def-text">
              A region for dynamically allocated objects, surviving beyond any single call. Unstructured; managed by
              the garbage collector. Closures capture heap-allocated environments (Week 2 Day 1).
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">By value (primitives)</dt>
            <dd className="def-text">
              Assignment/copying duplicates the actual value into a new slot. The two copies are independent &mdash;
              changing one never affects the other.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">By reference (objects)</dt>
            <dd className="def-text">
              Assignment copies the reference (a pointer), not the object. Two variables share one heap object;
              mutating through one is visible through the other.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Sticky Note vs the House Analogy</h2>
        <p className="article-para">
          A <strong>primitive</strong> is like a number written on a <strong>sticky note</strong>: copy it and you have
          two independent notes &mdash; scribbling on one leaves the other alone. An <strong>object</strong> is like a{' '}
          <strong>house</strong> with an address: a variable is just the address written on a note. Copy the variable
          and you copy the <em>address</em>, not the house &mdash; both notes lead to the same front door. Repainting
          through either address changes the one shared house.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🗒️</span>
            <span className="analogy-label">A sticky note with a number</span>
            <span className="analogy-target">Primitive (by value)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🏠</span>
            <span className="analogy-label">A house at an address</span>
            <span className="analogy-target">Heap object</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📍</span>
            <span className="analogy-label">A note with the address</span>
            <span className="analogy-target">A reference (by reference)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">Stack of trays (LIFO)</span>
            <span className="analogy-target">The call stack</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The subtle bit: <strong>&ldquo;by reference&rdquo; means by reference <em>value</em></strong>. JS has no
            true by-reference parameters (where reassigning inside a function affects the caller&apos;s variable). When
            you pass an object, the function receives a copy of the reference &mdash; it can mutate the shared object,
            but reassigning its parameter won&apos;t change the caller&apos;s variable. That&apos;s why{' '}
            <code>{'function reassign(o){ o = {} }'}</code> doesn&apos;t affect the caller.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Two Regions</h2>
        <p className="article-para">
          Stack and heap differ in structure, lifetime, cost, and management. The distinction shapes everything from
          argument passing to GC to overflow errors.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Stack: structured, automatic, bounded</h4>
            <p className="theory-desc">
              A LIFO stack of frames, one per active call. Locals (primitives + references) live here; return pops the
              frame instantly. No GC needed &mdash; lifetime is the call. Bounded size &rarr; <code>RangeError</code> on
              overflow.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Heap: unstructured, dynamic, GC-managed</h4>
            <p className="theory-desc">
              Objects allocated as needed, addressed by reference, surviving beyond any single call. Lifetime is
              reachability (Week 6 Day 3), not scope. The GC reclaims unreachable objects.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Primitives: by value</h4>
            <p className="theory-desc">
              <code>number</code>, <code>string</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>,{' '}
              <code>bigint</code>, <code>symbol</code> are stored/copied by value. Each variable slot holds the actual
              value (for small types, inline; strings are an immutable special case).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Objects: on the heap, referenced</h4>
            <p className="theory-desc">
              <code>Object</code>, <code>Array</code>, <code>Function</code>, <code>Date</code>, etc. live on the heap.
              Variables/parameters hold references; assignment and passing copy the reference. Mutation is shared.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The by-reference-value subtlety</h3>
        <CodeBlock
          code={`function mutate(obj) { obj.n = 99; }    // mutates the shared object ✓
function reassign(obj) { obj = { n: 0 }; } // rebinds LOCAL param only ✗

const x = { n: 1 };
mutate(x);   console.log(x.n);   // 99 — mutation visible
reassign(x); console.log(x.n);   // 99 — reassignment did NOT affect x
// \`obj\` inside reassign is a COPY of the reference; pointing it at a new
// object doesn't change where \`x\` points. There is no "output parameter".`}
          filename="ref-value.js"
        />

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Stack-allocated (per call frame)</span>
            <p className="phase-desc">Short-lived, automatic, fast.</p>
            <ul className="phase-rules">
              <li>Local primitive values</li>
              <li>References (pointers) to heap objects</li>
              <li>Function return addresses</li>
              <li>Freed on return (no GC)</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Heap-allocated</span>
            <p className="phase-desc">Dynamic lifetime, GC-managed.</p>
            <ul className="phase-rules">
              <li>All objects, arrays, functions</li>
              <li>Closure environments (Week 2)</li>
              <li>Captured-by-closure variables</li>
              <li>Freed when unreachable</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            This is why closures (Week 2 Day 1) &ldquo;keep variables alive&rdquo;: the closure references a heap
            environment holding the captured variables. As long as the closure is reachable, that environment (and its
            variables) is reachable &mdash; the GC can&apos;t reclaim it. Stack variables are gone the moment their
            frame pops; only by escaping to the heap (via a closure) do they outlive the call.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Two Regions</h2>
        <p className="article-para">
          The stack/heap split is older than JavaScript &mdash; it comes from Algol/C and reflects two genuinely
          different needs: fast automatic storage for short-lived locals (stack), and flexible dynamic storage for
          data whose lifetime isn&apos;t tied to a call (heap). JavaScript adopts it: primitives fit the stack model
          (cheap, copyable, short-lived), objects need the heap (dynamically sized, shared, outliving calls). The
          language makes the choice invisible &mdash; you never explicitly &ldquo;allocate&rdquo; &mdash; but the model
          still governs argument passing, equality, mutation, and GC. Strings sit between: immutable and value-like in
          semantics, but reference-stored for efficiency (you treat them as by-value and never notice).
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Stack</th>
                <th>Heap</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Structure</td>
                <td>LIFO frames</td>
                <td>Unstructured graph</td>
              </tr>
              <tr>
                <td>Lifetime</td>
                <td>The function call</td>
                <td>Until unreachable</td>
              </tr>
              <tr>
                <td>Management</td>
                <td>Automatic (push/pop)</td>
                <td>Garbage collector</td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>Very fast</td>
                <td>Slower (alloc + GC)</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>Bounded (overflow risk)</td>
                <td>Large (limited by RAM)</td>
              </tr>
              <tr>
                <td>Holds</td>
                <td>Primitives + references</td>
                <td>Objects, arrays, closures</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; A Call, Stack Frames, and the Heap</h2>

        <CodeBlock
          code={`function makeCounter() {
  let count = 0;                  // local primitive — frame-local, escapes via closure
  return () => ++count;           // closure captures count → heap environment
}
const c1 = makeCounter();
const c2 = makeCounter();
c1(); c1(); c2();
console.log(c1(), c2()); // 3, 1 — each counter has its OWN count`}
          filename="flow.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>makeCounter()</code> is called &rarr; a stack frame is pushed with local <code>count = 0</code>.
              Normally <code>count</code> would die when the frame pops &mdash; but the returned closure references it.
            </span>
          </li>
          <li>
            <span>
              Because the closure outlives the call, V8 <strong>escapes</strong> <code>count</code> to the{' '}
              <strong>heap</strong>: it lives in a heap-allocated environment object the closure points to. The stack
              frame still pops; the data survives.
            </span>
          </li>
          <li>
            <span>
              <code>c1</code> and <code>c2</code> each hold a closure referencing a <em>separate</em> heap environment
              (two <code>makeCounter</code> calls &rarr; two environments &rarr; two <code>count</code>s). They
              don&apos;t share state.
            </span>
          </li>
          <li>
            <span>
              Calling <code>c1()</code> pushes a frame for the arrow function; <code>++count</code> mutates{' '}
              <code>c1</code>&apos;s heap environment. <code>c2</code>&apos;s is untouched. Frames pop on return; the
              environments persist because the closures (reachable globals) reference them.
            </span>
          </li>
          <li>
            <span>
              When <code>c1</code>/<code>c2</code> go out of scope (no references), their heap environments become
              unreachable &rarr; the GC reclaims them. The stack needed no management; the heap waited for the GC.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. By value &mdash; primitives copy</h3>
        <CodeBlock
          code={`let a = 1, b = a; b = 2;
console.log(a, b); // 1 2 — independent copies

let s = "hi", t = s; t = "bye";
console.log(s, t); // hi bye — strings behave like values (immutable)`}
          filename="by-value.js"
        />

        <h3 className="article-h3">2. By reference &mdash; objects share</h3>
        <CodeBlock
          code={`const o = { n: 1 }, p = o;
p.n = 2;
console.log(o.n); // 2 — same object
// To get an independent copy, clone explicitly:
const copy = { ...o }; // shallow copy — new object, own props copied
copy.n = 99;
console.log(o.n); // 2 — original untouched`}
          filename="by-reference.js"
        />

        <h3 className="article-h3">3. Shallow vs deep copy</h3>
        <CodeBlock
          code={`const nested = { a: 1, child: { b: 2 } };
const shallow = { ...nested };
shallow.child.b = 99;
console.log(nested.child.b); // 99 — shallow copy shared the nested object!

// Deep copy: structuredClone (built-in) or a library
const deep = structuredClone(nested);
deep.child.b = 0;
console.log(nested.child.b); // 99 — original intact`}
          filename="shallow-deep.js"
        />

        <h3 className="article-h3">4. Reassigning a parameter doesn&apos;t affect the caller</h3>
        <CodeBlock
          code={`function reset(o) { o = { n: 0 }; } // rebinds the local \`o\` only
const x = { n: 5 };
reset(x);
console.log(x.n); // 5 — \`x\` still points at the original object`}
          filename="reassign.js"
        />

        <h3 className="article-h3">5. Stack overflow &mdash; the bounded stack</h3>
        <CodeBlock
          code={`function recurse() { return recurse(); }
recurse(); // RangeError: Maximum call stack size exceeded
// Each call pushes a frame; deep/unbounded recursion exhausts the stack.
// Generators/await (Week 5) avoid this for "deep" async flows — each
// await pops the frame and resumes later via a heap continuation.`}
          filename="overflow.js"
        />

        <h3 className="article-h3">6. Equality reflects storage</h3>
        <CodeBlock
          code={`1 === 1;                         // true — value equality
{ a: 1 } === { a: 1 };            // false — different heap objects
const o = { a: 1 };
o === o;                          // true — same reference
Object.is(NaN, NaN);              // true — value-aware (handles NaN)`}
          filename="equality.js"
        />

        <div className="article-callout">
          <p>
            The practical rules: (1) <strong>primitives compare by value, objects by identity</strong> &mdash; two{' '}
            <code>{'{a:1}'}</code> literals are not <code>===</code>. (2) <strong>copying objects is opt-in</strong>{' '}
            &mdash; assignment shares; use <code>{'{...o}'}</code> (shallow) or <code>structuredClone</code> (deep) to
            copy. (3) <strong>functions can mutate shared objects but not rebind caller variables</strong> &mdash; if
            you need to &ldquo;return&rdquo; a new value, return it, don&apos;t try to reassign a parameter.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Predict the output of by-value vs by-reference snippets before running. Then implement a function that
            &ldquo;adds a property&rdquo; to an object (mutation, visible) vs one that &ldquo;replaces&rdquo; the object
            (rebind, invisible) and observe the difference. Finally, write shallow vs deep copy and confirm nested
            mutation behavior.
          </p>
        </div>

        <CodeBlock
          code={`// Predict, then run:
let a = 1, b = a; b++; console.log(a, b);             // 1, 2
let o = { n: 1 }, p = o; p.n++; console.log(o.n);     // 2 — shared
const arr = [1, 2], c = arr; c.push(3); console.log(arr.length); // 3 — shared

// Mutation vs rebind:
function mutate(x) { x.tagged = true; }   // caller sees it
function replace(x) { x = { tagged: true }; } // caller does NOT see it
const obj = {};
mutate(obj);   console.log(obj.tagged); // true
replace(obj);  console.log(obj.tagged); // still true (replace did nothing)

// Shallow vs deep:
const nested = { a: { b: 1 } };
const shallow = { ...nested }; shallow.a.b = 2; console.log(nested.a.b); // 2
const deep = structuredClone(nested); deep.a.b = 3; console.log(nested.a.b); // 2`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does <code>{'{ ...nested }'}</code> not protect <code>nested.a</code>? (Because spread copies only the{' '}
            <em>top-level</em> own properties &mdash; and the value of <code>a</code> is a <em>reference</em> to the
            nested object. So <code>shallow.a</code> and <code>nested.a</code> are two references to the same heap
            object; mutating <code>shallow.a.b</code> mutates that shared object. Deep copy recursively duplicates, so
            no sharing remains.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Stack vs heap in JavaScript?</h4>
            <p className="iq-a">
              The stack holds call frames &mdash; local primitives and references, one frame per active call, freed
              automatically on return, bounded (overflow risk). The heap holds objects (and closure environments),
              dynamically allocated, addressed by reference, with lifetime governed by reachability and managed by the
              GC. Primitives are stored/copied by value; objects live on the heap and variables hold references.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. &ldquo;By value vs by reference&rdquo; &mdash; explain.</h4>
            <p className="iq-a">
              Primitives are by value: assignment and passing copy the actual value into a new slot, so two copies are
              independent. Objects are by reference: assignment copies the reference (pointer), not the object, so two
              variables share one heap object and mutations through one are visible through the other. The choice
              follows from where the value lives (stack slot vs heap object).
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. If objects are &ldquo;by reference,&rdquo; why can&apos;t a function rebind a caller&apos;s variable?</h4>
            <p className="iq-a">
              Because JS passes references <em>by value</em>. The function receives a copy of the reference; it can
              mutate the shared object it points to (visible to the caller), but reassigning the parameter (pointing it
              at a new object) only changes the local copy &mdash; the caller&apos;s variable still references the
              original. JS has no true by-reference output parameters. To &ldquo;return&rdquo; a new value, return it.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why does a stack overflow happen?</h4>
            <p className="iq-a">
              The call stack is bounded. Each function call pushes a frame; unbounded or very deep recursion pushes
              frames until the stack&apos;s limit is hit &mdash; throwing <code>RangeError: Maximum call stack size
              exceeded</code>. There&apos;s no heap-style growth. Iteration (no frames) or async/generators (which
              suspend and pop frames, resuming from heap continuations) avoid it for effectively-unbounded depth.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). How do closures keep variables alive past their function&apos;s return?</h4>
            <p className="iq-a">
              A closure references its lexical environment, which holds the captured variables. When the closure
              outlives the call that created it (returned, stored), V8 <em>escapes</em> that environment to the heap
              &mdash; it&apos;s no longer tied to the popped stack frame. As long as the closure is reachable, the heap
              environment (and its variables) is reachable and survives; the GC reclaims it only when the closure itself
              becomes unreachable (Week 2 Day 1, Week 6 Day 3).
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Shallow copy vs deep copy &mdash; when does each matter?</h4>
            <p className="iq-a">
              A shallow copy (<code>{'{...o}'}</code>, <code>Object.assign</code>) duplicates the top-level properties
              &mdash; but if a property value is an object, the copy holds the same reference, so nested objects are
              shared and mutating them affects the original. A deep copy (<code>structuredClone</code>, a library)
              recursively duplicates, so no sharing remains. Shallow is fast and fine for flat or immutable-nested
              data; deep is required when nested objects are mutable and must be independent.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Are JS primitives really always on the stack? Explain the nuance.</h4>
            <p className="iq-a">
              Semantically, primitives behave as by-value (copy on assignment, compare by value) &mdash; that&apos;s the
              observable contract and the right mental model. But the physical storage is an implementation detail:
              small integers (SMIs) are often stored inline in a variable slot or even &ldquo;tagged&rdquo; into the
              pointer itself (no allocation), so they&apos;re effectively stack/register-resident. Strings are
              immutable and reference-stored on the heap (a new string literal may allocate), yet they behave by-value
              because they can&apos;t be mutated. <code>bigint</code> and symbols have their own representation. And a
              primitive captured by a closure is escaped to the heap environment like any captured variable. So
              &ldquo;primitives on the stack&rdquo; is a useful teaching model for the <em>semantics</em>, but the
              engine optimizes storage based on size, mutability, and escape analysis &mdash; the value semantics are
              preserved regardless of where bytes physically sit. The spec mandates the by-value behavior, not the
              location.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
