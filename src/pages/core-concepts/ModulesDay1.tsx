import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('modules-perf-memory')!
const navItems = weekNav(week)

export default function ModulesDay1() {
  const { next } = dayNavLinks(week, 1)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 1 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[0].title}</h1>
        <p className="lesson-subtitle">
          Two module systems, one critical difference: when the structure is known. That single fact explains
          tree-shaking, live bindings, and why bundlers love ESM.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            <strong>CommonJS</strong> (Node&apos;s original system) loads modules dynamically at runtime via{' '}
            <code>require</code>/<code>module.exports</code>. <strong>ES Modules</strong> (ESM, the standard) are{' '}
            <strong>statically</strong> analyzable &mdash; imports/exports are declared up front, enabling optimization.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            CJS copies exported values as snapshots and lets you <code>require</code> conditionally. ESM exports are{' '}
            <strong>live bindings</strong> &mdash; read-only references that track the exporter&apos;s current value &mdash;
            and imports must be top-level and static.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Modern code targets ESM. CJS lingers in older Node packages and config files (<code>.cjs</code>,{' '}
            <code>require</code> in legacy code). Knowing both matters for tooling, interop, and the interview question
            &ldquo;why does ESM enable tree-shaking?&rdquo;
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          Before 2015, JavaScript had no module system &mdash; everything shared one global scope, and developers
          fought namespace collisions with IIFEs and naming conventions. Two systems filled the gap: CommonJS (Node,
          2009) and, later, ES Modules (ES6, 2015). They look similar but behave fundamentally differently &mdash; and
          the difference is the foundation of modern bundling.
        </p>

        <CodeBlock
          code={`// CommonJS (Node)
const fs = require("fs");              // runtime call, returns a value
module.exports = { greet: () => "hi" }; // assigns a property

// ES Modules (the standard)
import fs from "fs";                   // static, top-level, hoisted
export const greet = () => "hi";       // a live binding, not a copy`}
          filename="two-systems.js"
        />

        <p className="article-para">
          The visual difference is small; the mechanical difference is huge. <code>require</code> is an ordinary
          function call that runs when execution reaches it &mdash; its result is unknown until runtime. ESM{' '}
          <code>import</code> is a declaration the engine parses before any code runs &mdash; the entire module
          structure is known <em>statically</em>. That single distinction (dynamic vs static) is why bundlers can
          tree-shake ESM but not CJS.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">CommonJS (CJS)</dt>
            <dd className="def-text">
              Node&apos;s module system: <code>require()</code> to import, <code>module.exports</code> to export. Values
              are copied at require-time; <code>require</code> can be called anywhere, conditionally.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">ES Modules (ESM)</dt>
            <dd className="def-text">
              The standard: <code>import</code>/<code>export</code>. Static and top-level only. Exports are live
              bindings; imports are hoisted and read-only. The basis for tree-shaking.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Live binding</dt>
            <dd className="def-text">
              An ESM export is a reference to a variable that always reflects its current value in the exporting
              module &mdash; not a snapshot taken at import time. Mutate it in the exporter and the importer sees the
              new value.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Static structure</dt>
            <dd className="def-text">
              Imports/exports are fixed at parse time &mdash; you can&apos;t conditionally import or put an{' '}
              <code>import</code> inside an <code>if</code>. This is what lets tools analyze the module graph without
              running the code.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Menu vs the Kitchen Order Analogy</h2>
        <p className="article-para">
          CommonJS is like ordering at a <strong>counter</strong>: you walk up anytime, ask for a dish, and get a plate
          handed to you (a copy of the food). The kitchen doesn&apos;t know what you&apos;ll order until you order it
          &mdash; dynamic. ES Modules are like a printed <strong>menu submitted before service</strong>: every dish
          you&apos;ll want is declared up front, so the kitchen can prepare, combine, and even remove dishes nobody
          ordered (tree-shaking). Static.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">🍽️</span>
            <span className="analogy-label">Order at the counter (CJS)</span>
            <span className="analogy-target">Dynamic <code>require</code>, value copied</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📋</span>
            <span className="analogy-label">Pre-submitted menu (ESM)</span>
            <span className="analogy-target">Static <code>import</code>, live binding</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📸</span>
            <span className="analogy-label">A photocopy of the dish</span>
            <span className="analogy-target">CJS snapshot exports</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔗</span>
            <span className="analogy-label">A live feed from the kitchen</span>
            <span className="analogy-target">ESM live bindings</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The static structure is the whole reason ESM won the tooling war. Because imports are known at parse time,
            a bundler can build the complete dependency graph <em>without executing the code</em>, then drop everything
            unused. With CJS, a <code>require</code> could be anything (a variable, a conditional), so you must run the
            module to know what it loads &mdash; no safe tree-shaking.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory</h2>
        <p className="article-para">
          Four differences drive everything else. Memorize them &mdash; they explain bundler behavior, interop
          pitfalls, and the &ldquo;why ESM&rdquo; question.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Static vs dynamic structure</h4>
            <p className="theory-desc">
              ESM imports are top-level declarations known at parse time. CJS <code>require</code> is a runtime function
              call that can be conditional, dynamic, or in a loop. Static &rarr; analyzable; dynamic &rarr; not.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Live bindings vs snapshots</h4>
            <p className="theory-desc">
              ESM exports are live references; mutating the exporter&apos;s variable updates every importer. CJS copies
              the value at <code>require</code>-time &mdash; later changes to the export aren&apos;t seen (except for
              object-property mutations on a shared object).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Async vs sync loading</h4>
            <p className="theory-desc">
              ESM modules load and evaluate asynchronously (a multi-phase pipeline: parse, instantiate, evaluate).
              CJS <code>require</code> is synchronous &mdash; it blocks while the module loads and runs, which is fine
              for local files but a problem for network-loaded code.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Strict mode and top-level scope</h4>
            <p className="theory-desc">
              ESM modules are always in strict mode and have their own module scope (no shared globals). CJS modules
              share a <code>this === module.exports</code> context and aren&apos;t automatically strict.
            </p>
          </div>
        </div>

        <h3 className="article-h3">The live binding in action</h3>
        <CodeBlock
          code={`// counter.mjs (ESM)
export let count = 0;
export function increment() { count++; }

// app.mjs
import { count, increment } from "./counter.mjs";
console.log(count); // 0
increment();
console.log(count); // 1 — LIVE: importer sees the exporter's new value`}
          filename="live-binding.mjs"
        />
        <CodeBlock
          code={`// counter.js (CJS)
let count = 0;
function increment() { count++; }
module.exports = { count, increment };

// app.js
const { count, increment } = require("./counter");
console.log(count); // 0
increment();
console.log(count); // STILL 0 — count was COPIED at require time`}
          filename="snapshot.cjs"
        />
        <p className="article-para">
          The CJS version stays 0 because <code>count</code> was copied when <code>require</code> ran; the later{' '}
          <code>count++</code> mutated the exporter&apos;s internal variable, not your copy. ESM&apos;s live binding
          avoids this &mdash; the importer reads through to the exporter&apos;s current value each access.
        </p>

        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">CommonJS</span>
            <p className="phase-desc">Dynamic, synchronous, snapshots.</p>
            <ul className="phase-rules">
              <li><code>require()</code> / <code>module.exports</code></li>
              <li>Values copied at require-time</li>
              <li><code>require</code> can be conditional/dynamic</li>
              <li>Synchronous loading</li>
              <li>Not statically analyzable</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">ES Modules</span>
            <p className="phase-desc">Static, async, live bindings.</p>
            <ul className="phase-rules">
              <li><code>import</code> / <code>export</code></li>
              <li>Live references to exports</li>
              <li>Top-level imports only</li>
              <li>Async load pipeline</li>
              <li>Statically analyzable &rarr; tree-shakeable</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The &ldquo;snapshot&rdquo; in CJS is subtle: it snapshots the <em>binding</em>, not the object. If{' '}
            <code>module.exports = {`{ obj }`}</code> and you mutate <code>obj.prop</code>, the importer sees it (same
            object reference). But reassigning <code>count = 5</code> in the exporter is invisible to importers that
            already destructured <code>count</code>. ESM has no such trap &mdash; every named export is a live view.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; the Module Wars</h2>
        <p className="article-para">
          JavaScript shipped in 1995 with no modules &mdash; just global scripts. For 15 years developers emulated
          modules with the module pattern (closures, Week 2 Day 2), AMD (RequireJS, browser-focused, async), and
          CommonJS (Node, server-focused, sync). When ES6 standardized ESM in 2015, it borrowed the best ideas: static
          imports ( analyzable like CJS) plus async loading (like AMD). Adoption took years because of interop &mdash;
          Node added ESM support gradually (experimental in 12, stable in 14, unflagged in 16+), and the ecosystem is
          still mid-migration. Today ESM is the default for new code; CJS persists in legacy packages.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>CommonJS</th>
                <th>ES Modules</th>
                <th>AMD (legacy)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Structure</td>
                <td>Dynamic</td>
                <td>Static</td>
                <td>Dynamic (callback-based)</td>
              </tr>
              <tr>
                <td>Exports</td>
                <td>Snapshots</td>
                <td>Live bindings</td>
                <td>Snapshots</td>
              </tr>
              <tr>
                <td>Loading</td>
                <td>Synchronous</td>
                <td>Async (phased)</td>
                <td>Async</td>
              </tr>
              <tr>
                <td>Tree-shakeable?</td>
                <td>No</td>
                <td>Yes</td>
                <td>Limited</td>
              </tr>
              <tr>
                <td>Born in</td>
                <td>Node (2009)</td>
                <td>ES6 (2015)</td>
                <td>RequireJS (2011)</td>
              </tr>
              <tr>
                <td>File extensions</td>
                <td><code>.cjs</code> / <code>.js</code> (legacy)</td>
                <td><code>.mjs</code> / <code>.js</code> (type:module)</td>
                <td>&mdash;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; The ESM Load Pipeline</h2>

        <CodeBlock
          code={`// app.mjs
import { greet } from "./greet.mjs";
console.log(greet());

// greet.mjs
console.log("greet module evaluating");
export function greet() { return "hi"; }`}
          filename="pipeline.mjs"
        />

        <ol className="article-steps">
          <li>
            <span>
              <strong>Construction (parse):</strong> the engine reads <code>app.mjs</code>, sees the <code>import</code>,
              and fetches <code>greet.mjs</code>. It builds the module graph &mdash; <em>without running anything</em>.
              All imports are discovered here, statically.
            </span>
          </li>
          <li>
            <span>
              <strong>Instantiation:</strong> the engine creates the module records and wires up the live bindings &mdash;
              <code> greet</code> in <code>app.mjs</code> is linked to the <code>greet</code> export in{' '}
              <code>greet.mjs</code>. Still no code has run.
            </span>
          </li>
          <li>
            <span>
              <strong>Evaluation:</strong> modules run in dependency order, bottom-up. <code>greet.mjs</code> evaluates
              first (printing &ldquo;greet module evaluating&rdquo;), then <code>app.mjs</code> runs and calls{' '}
              <code>greet()</code> &rarr; &ldquo;hi&rdquo;.
            </span>
          </li>
          <li>
            <span>
              Because imports are <em>hoisted</em> and bindings are live, <code>app.mjs</code> can use{' '}
              <code>greet</code> even though it&apos;s declared later in the file &mdash; the binding exists from
              instantiation, and cyclic imports resolve to partially-initialized state (a known ESM edge case).
            </span>
          </li>
        </ol>

        <p className="article-para">
          CJS collapses all this into one synchronous step: <code>require</code> loads, runs, and returns the value in a
          single call, blocking the thread. That&apos;s simpler but kills analyzability and async loading &mdash; the
          trade-off at the heart of the two systems.
        </p>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. ESM named &amp; default exports</h3>
        <CodeBlock
          code={`// greet.mjs
export const greeting = "hi";        // named export (live binding)
export function greet() { return greeting; }
export default function () { return "default hi"; } // one default per module

// app.mjs
import hi, { greet, greeting } from "./greet.mjs"; // default first, then named
hi(); greet(); // "default hi", "hi"`}
          filename="esm-exports.mjs"
        />

        <h3 className="article-h3">2. CJS exports &amp; the snapshot gotcha</h3>
        <CodeBlock
          code={`// counter.cjs
let count = 0;
setTimeout(() => { count = 99; }, 100); // change AFTER export
module.exports = { count }; // snapshot of 0 at require time

// app.cjs
const { count } = require("./counter");
setTimeout(() => { console.log(count); }, 200); // 0 — not 99. Snapshot.`}
          filename="cjs-snapshot.cjs"
        />

        <h3 className="article-h3">3. ESM live binding sees the change</h3>
        <CodeBlock
          code={`// counter.mjs
export let count = 0;
setTimeout(() => { count = 99; }, 100);

// app.mjs
import { count } from "./counter.mjs";
setTimeout(() => { console.log(count); }, 200); // 99 — live binding`}
          filename="esm-live.mjs"
        />

        <h3 className="article-h3">4. Dynamic import (the ESM escape hatch)</h3>
        <CodeBlock
          code={`// ESM is static, but \`import()\` is a runtime function returning a promise:
const button = document.querySelector("#load");
button.addEventListener("click", async () => {
  const heavy = await import("./heavy.mjs"); // loaded on demand
  heavy.run();
});
// Used for code splitting (Day 2) and lazy-loading routes/components.`}
          filename="dynamic-import.mjs"
        />

        <h3 className="article-h3">5. Interop: importing CJS from ESM</h3>
        <CodeBlock
          code={`// legacy.cjs
module.exports = function () { return "from cjs"; };

// app.mjs
import legacy from "./legacy.cjs"; // default import = module.exports
legacy(); // "from cjs"
// CJS exports become the ESM default. Named imports from CJS may not work
// reliably — use \`import('x')\` then destructure, or \`cjs-module-lexer\`.`}
          filename="interop.mjs"
        />

        <h3 className="article-h3">6. Why ESM enables tree-shaking</h3>
        <CodeBlock
          code={`// utils.mjs — ESM
export function used() { return "kept"; }
export function unused() { return "dropped"; } // never imported anywhere

// Bundler sees \`import { used }\` statically, knows \`unused\` is unreferenced,
// and REMOVES it from the output. With CJS, \`unused\` might have side effects
// the bundler can't detect, so it must keep it. Static structure = safe removal.`}
          filename="tree-shake.mjs"
        />

        <div className="article-callout">
          <p>
            A real-world interop trap: <code>{'import { x } from "cjs-module"'}</code> often fails because CJS has no
            named exports the engine can see statically &mdash; it just has <code>module.exports</code>. Tools like{' '}
            <code>cjs-module-lexer</code> scan CJS to detect named exports, but it&apos;s heuristic. When in doubt, use
            the default import (<code>import cjs from "..."</code>) and destructure at runtime.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (60 minutes)</span>
          <p>
            Demonstrate the live-binding vs snapshot difference: write the same &ldquo;counter&rdquo; module in both ESM
            (<code>.mjs</code>) and CJS (<code>.cjs</code>), each exporting a <code>count</code> and an{' '}
            <code>increment</code>, and two importer files. Run each in Node and confirm ESM shows the updated value
            while CJS shows the snapshot.
          </p>
        </div>

        <CodeBlock
          code={`// counter.mjs — ESM, live binding
export let count = 0;
export function increment() { count++; }
// app.mjs
import { count, increment } from "./counter.mjs";
console.log(count); increment(); console.log(count); // 0, then 1

// counter.cjs — CJS, snapshot
let count = 0;
function increment() { count++; }
module.exports = { count, increment };
// app.cjs
const { count, increment } = require("./counter.cjs");
console.log(count); increment(); console.log(count); // 0, then 0 (snapshot!)

// Run: node app.mjs  →  0, 1
//      node app.cjs  →  0, 0
// The CJS count was copied at require time; the exporter's mutation is invisible.`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            How would you make the CJS version show the updated count? (Export an object and mutate its property:{' '}
            <code>{'module.exports = { state: { count: 0 } }'}</code>, then <code>increment</code> does{' '}
            <code>state.count++</code>. The importer holds the same object reference, so it sees the mutation. This is
            the &ldquo;shared object&rdquo; workaround &mdash; clunky, which is exactly why ESM&apos;s live bindings are
            better.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. Difference between CommonJS and ES Modules?</h4>
            <p className="iq-a">
              CJS is dynamic and synchronous: <code>require()</code> is a runtime call that returns a snapshot of{' '}
              <code>module.exports</code>, and can be conditional. ESM is static: <code>import</code>/<code>export</code>{' '}
              are top-level declarations known at parse time, exports are live bindings, and loading is async. The
              static structure makes ESM statically analyzable (tree-shakeable); CJS is not.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. What is a live binding, and why does it matter?</h4>
            <p className="iq-a">
              An ESM export is a live reference: importers always see the exporter&apos;s current value, even after it
              changes. CJS copies the value at <code>require</code>-time, so later reassignments in the exporter are
              invisible to importers. Live bindings prevent stale-data bugs and make modules behave predictably across
              mutation &mdash; a key correctness advantage of ESM.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why does ESM enable tree-shaking but CJS doesn&apos;t?</h4>
            <p className="iq-a">
              Because ESM imports are static &mdash; declared at the top level, known at parse time. A bundler can build
              the full dependency graph <em>without executing code</em> and safely drop unreferenced exports. CJS{' '}
              <code>require</code> is a runtime function that could be conditional or dynamic, and exports may have side
              effects, so the bundler can&apos;t safely remove anything without running the module.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Can you conditionally import in ESM?</h4>
            <p className="iq-a">
              Not with a static <code>import</code> &mdash; those are top-level and unconditional. But the dynamic{' '}
              <code>import()</code> function returns a promise and can be called anywhere, conditionally, on event. It&apos;s
              how ESM achieves lazy-loading and code splitting without sacrificing static analyzability of the rest.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What does <code>node</code> use to decide if a <code>.js</code> file is ESM or CJS?</h4>
            <p className="iq-a">
              The nearest <code>package.json</code>: if <code>{'"type": "module"'}</code>, <code>.js</code> files are ESM;
              otherwise CJS. You can override per-file with extensions (<code>.mjs</code> is always ESM,{' '}
              <code>.cjs</code> always CJS). This is why mixing systems in one project requires care with extensions and{' '}
              <code>type</code> fields &mdash; the wrong setting makes <code>import</code>/<code>require</code> throw.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). Why does <code>{'import { x } from "cjs-pkg"'}</code> sometimes fail?</h4>
            <p className="iq-a">
              CJS has no static named exports &mdash; just <code>module.exports</code>, a single value set at runtime.
              ESM named imports require statically-known exports, which CJS can&apos;t provide. Node uses{' '}
              <code>cjs-module-lexer</code> to heuristically detect named exports from CJS source, but it isn&apos;t
              perfect. The reliable interop pattern is the default import (<code>import cjs from "pkg"</code> &rarr; the
              whole <code>module.exports</code>), then destructure at runtime.
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Describe the three phases of ESM loading and why cyclic imports behave differently than CJS.</h4>
            <p className="iq-a">
              ESM loads in three phases: (1) <strong>Construction</strong> &mdash; fetch and parse all modules, building
              the dependency graph without executing; (2) <strong>Instantiation</strong> &mdash; create module records
              and wire up live bindings (linking import names to export slots); (3) <strong>Evaluation</strong> &mdash;
              run modules in dependency order, bottom-up. Because bindings are created in phase 2 before any code runs,
              a cyclic import returns a live binding that starts empty and fills in during phase 3 &mdash; so accessing
              an export before the cycle completes gives <code>undefined</code> (for <code>var</code>)/throws (for{' '}
              <code>let</code>/<code>const</code>/TDZ). CJS, by contrast, returns whatever <code>module.exports</code>{' '}
              held at the moment of the cyclic <code>require</code> (often a partial object) &mdash; a snapshot, not a
              live view. ESM cycles are deterministic but partial; CJS cycles are order-dependent snapshots. The phased
              model is also what makes ESM async and tree-shakeable.
            </p>
          </div>
        </div>
      </section>

      <DayNav next={next} />
    </ContentLayout>
  )
}
