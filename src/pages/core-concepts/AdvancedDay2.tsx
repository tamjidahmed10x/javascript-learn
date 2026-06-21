import ContentLayout from '../../components/ContentLayout'
import CodeBlock from '../../components/CodeBlock'
import DayNav from '../../components/DayNav'
import { weekNav, getWeekBySlug, dayNavLinks } from './curriculum'
import '../../components/ContentStyles.css'
import './ArticleStyles.css'

const week = getWeekBySlug('advanced-patterns')!
const navItems = weekNav(week)

export default function AdvancedDay2() {
  const { prev, next } = dayNavLinks(week, 2)

  return (
    <ContentLayout title={week.title} subtitle={`Week ${week.week} · ${week.monthLabel}`} navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Day 2 of {week.days.length}</span>
        <h1 className="lesson-title">{week.days[1].title}</h1>
        <p className="lesson-subtitle">
          The protocol behind every <code>for...of</code> and spread. A tiny contract that makes anything
          iterable &mdash; including infinite sequences.
        </p>
      </div>

      {/* ── At a Glance ───────────────────────────────────── */}
      <div className="glance">
        <span className="glance-title">At a Glance</span>
        <div className="glance-grid">
          <span className="glance-label">What</span>
          <p className="glance-text">
            An <strong>iterator</strong> is an object with a <code>next()</code> method that returns{' '}
            <code>{'{ value, done }'}</code>. An <strong>iterable</strong> is anything with a{' '}
            <code>Symbol.iterator</code> method that produces an iterator. Together they&apos;re the contract{' '}
            <code>for...of</code>, spread, and destructuring all use.
          </p>
          <span className="glance-label">How</span>
          <p className="glance-text">
            Each call to <code>next()</code> advances one step and reports the value and whether it&apos;s finished.
            Because the consumer pulls values on demand, iterators are <strong>lazy</strong> &mdash; they can
            represent sequences too big (or infinite) to materialize.
          </p>
          <span className="glance-label">When</span>
          <p className="glance-text">
            Whenever you need a custom data source for <code>for...of</code>, or want to model a stream/lazy sequence.
            Tomorrow&apos;s generators make writing iterators trivial; today you learn the raw protocol they compile
            to.
          </p>
        </div>
      </div>

      {/* ── Introduction ──────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Introduction</h2>
        <p className="article-para">
          You&apos;ve used <code>for...of</code> hundreds of times. Today you see what it actually calls. The answer
          is a tiny, uniform protocol: the loop asks the object for an iterator, then repeatedly calls{' '}
          <code>next()</code> until <code>done</code> is true. Master the protocol and you can make <em>anything</em>{' '}
          work with <code>for...of</code>, spread, and destructuring.
        </p>

        <CodeBlock
          code={`// The iterator protocol, in full:
const it = makeIterator();   // any object with a next() method
it.next(); // { value: 1, done: false }
it.next(); // { value: 2, done: false }
it.next(); // { value: undefined, done: true }

// The iterable protocol — what for...of looks for:
const obj = {
  [Symbol.iterator]() { return makeIterator(); },
};
for (const v of obj) console.log(v); // 1, 2`}
          filename="protocol.js"
        />

        <p className="article-para">
          Two protocols, one relationship: an <em>iterable</em> knows <em>how</em> to make an iterator; an iterator
          knows <em>how</em> to produce the next value. <code>for...of</code> bridges them: get an iterator, call{' '}
          <code>next()</code> repeatedly, stop at <code>done</code>. That&apos;s the whole engine.
        </p>

        <dl className="definition-list">
          <div className="definition">
            <dt className="def-term">Iterator</dt>
            <dd className="def-text">
              Any object implementing <code>next()</code> &rarr; <code>{'{ value, done }'}</code>. It tracks its own
              position; each <code>next()</code> advances by one.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Iterable</dt>
            <dd className="def-text">
              Any object with a <code>[Symbol.iterator]</code> method that returns an iterator. The well-known symbol
              (Day 6) is the hook the language looks for.
            </dd>
          </div>
          <div className="definition">
            <dt className="def-term">Lazy evaluation</dt>
            <dd className="def-text">
              Producing values only when asked. Because <code>next()</code> runs one step at a time, an iterator can
              represent infinite sequences without computing them eagerly.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Analogy ───────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">The Book Pages Analogy</h2>
        <p className="article-para">
          An array is like a book already printed &mdash; every page exists in memory whether you read it or not. An
          iterator is like a <strong>bookmark with a page-turner</strong>: you ask &ldquo;next page?&rdquo; and it
          hands you one page and moves the bookmark. The book doesn&apos;t need to exist in full &mdash; the page can
          be <em>generated</em> on demand. Stop whenever you&apos;ve read enough.
        </p>

        <div className="analogy-grid">
          <div className="analogy-item">
            <span className="analogy-symbol">📖</span>
            <span className="analogy-label">Printed book</span>
            <span className="analogy-target">An array (eager, in memory)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">🔖</span>
            <span className="analogy-label">Bookmark + page-turner</span>
            <span className="analogy-target">An iterator (lazy, on demand)</span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">📄</span>
            <span className="analogy-label">&ldquo;Next page?&rdquo;</span>
            <span className="analogy-target"><code>next() &rarr; {`{value, done}`}</code></span>
          </div>
          <div className="analogy-item">
            <span className="analogy-symbol">♾️</span>
            <span className="analogy-label">Endless book</span>
            <span className="analogy-target">An infinite sequence</span>
          </div>
        </div>

        <div className="article-callout">
          <p>
            Laziness is the superpower. A million-element sequence costs nothing until you ask for values; an infinite
            one (all primes, all Fibonacci numbers) is representable because you only ever materialize what you
            consume. Arrays can&apos;t do this &mdash; they&apos;re eager by definition.
          </p>
        </div>
      </section>

      {/* ── Theory ────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Theory &mdash; The Two Protocols</h2>
        <p className="article-para">
          The spec defines two protocols. Most built-ins (arrays, strings, maps, sets) implement both; you can add
          them to your own objects to plug into <code>for...of</code>, spread, destructuring, and{' '}
          <code>Promise.all</code>.
        </p>

        <div className="theory-list">
          <div className="theory-item">
            <h4 className="theory-title">1. Iterator protocol: <code>next()</code></h4>
            <p className="theory-desc">
              An object is an iterator if it has a <code>next()</code> method returning{' '}
              <code>{'{ value, done }'}</code>. <code>done: false</code> means there&apos;s a value;{' '}
              <code>done: true</code> ends the sequence (value usually <code>undefined</code>).
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">2. Iterable protocol: <code>[Symbol.iterator]</code></h4>
            <p className="theory-desc">
              An object is iterable if it has a method at the <code>Symbol.iterator</code> key that returns an
              iterator. <code>for...of</code> calls it once to get the iterator, then calls <code>next()</code> in a
              loop.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">3. Iterables can be consumed many times</h4>
            <p className="theory-desc">
              Each call to <code>[Symbol.iterator]()</code> should return a <em>fresh</em> iterator, so{' '}
              <code>for...of</code> can run twice. An iterator is single-use &mdash; once exhausted,{' '}
              <code>next()</code> keeps returning <code>done: true</code>.
            </p>
          </div>
          <div className="theory-item">
            <h4 className="theory-title">4. Built-in iterables</h4>
            <p className="theory-desc">
              <code>Array</code>, <code>String</code>, <code>Map</code>, <code>Set</code>,{' '}
              <code>arguments</code>, <code>NodeList</code>, generators (Day 3) are all iterable. Plain objects are{' '}
              <em>not</em> &mdash; that&apos;s why <code>for...of</code> throws on them.
            </p>
          </div>
        </div>

        <h3 className="article-h3">What consumes iterables</h3>
        <div className="phase-pair">
          <div className="phase-card">
            <span className="phase-label">Consumers of the protocol</span>
            <p className="phase-desc">All call <code>[Symbol.iterator]</code> under the hood.</p>
            <ul className="phase-rules">
              <li><code>for...of</code> loops</li>
              <li>Spread: <code>[...iterable]</code></li>
              <li>Destructuring: <code>{'const [a] = iterable'}</code></li>
              <li><code>Promise.all(iterable)</code></li>
              <li><code>Array.from(iterable)</code>, <code>Set</code>/<code>Map</code> ctors</li>
            </ul>
          </div>
          <div className="phase-card">
            <span className="phase-label">Plain objects are NOT iterable</span>
            <p className="phase-desc">They lack <code>Symbol.iterator</code>.</p>
            <ul className="phase-rules">
              <li><code>{'for...of {}'}</code> throws TypeError</li>
              <li>Use <code>for...in</code> for keys (legacy)</li>
              <li>Or <code>Object.entries(obj)</code> (returns an iterable)</li>
              <li>Add <code>[Symbol.iterator]</code> to make one iterable</li>
            </ul>
          </div>
        </div>

        <div className="article-callout">
          <p>
            The optional <code>return()</code> and <code>throw()</code> methods on an iterator let it clean up if the
            consumer stops early (e.g., <code>break</code> in a <code>for...of</code>). <code>for...of</code> calls{' '}
            <code>return()</code> on early exit so the iterator can release resources. Generators (Day 3) get this for
            free; hand-written iterators should implement it for correctness.
          </p>
        </div>
      </section>

      {/* ── History & Comparison ──────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">History &amp; Why Iterables Exist</h2>
        <p className="article-para">
          Before ES6, the only ways to loop were index-based <code>for</code>, <code>for...in</code> (which iterates
          keys, including inherited ones &mdash; a footgun), and <code>forEach</code> (arrays only). There was no
          uniform &ldquo;loop over the elements of anything.&rdquo; ES6 (2015) introduced the iterable/iterator
          protocols and <code>for...of</code> to give the language one universal iteration contract &mdash; the same
          one that arrays, strings, maps, sets, and generators all speak. It also enabled lazy sequences and laid the
          groundwork for generators (Day 3) and async iteration.
        </p>

        <div className="this-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Array</th>
                <th>Iterator</th>
                <th>Generator (Day 3)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eager or lazy</td>
                <td>Eager (all in memory)</td>
                <td>Lazy (on demand)</td>
                <td>Lazy (suspends/resumes)</td>
              </tr>
              <tr>
                <td>Can be infinite</td>
                <td>No</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Random access</td>
                <td>Yes (<code>arr[i]</code>)</td>
                <td>No (forward only)</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Reusable</td>
                <td>Yes</td>
                <td>Single-use</td>
                <td>Iterable is reusable; iterator single-use</td>
              </tr>
              <tr>
                <td>Boilerplate to write</td>
                <td>None (literal)</td>
                <td>Some (manual <code>next</code>)</td>
                <td>Little (<code>function*</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Flow &mdash; What <code>for...of</code> Actually Does</h2>

        <CodeBlock
          code={`const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

for (const n of range) console.log(n); // 1, 2, 3`}
          filename="range.js"
        />

        <ol className="article-steps">
          <li>
            <span>
              <code>for...of</code> calls <code>range[Symbol.iterator]()</code> once to get a fresh iterator. The
              closure inside captures <code>current = 1</code> and <code>last = 3</code>.
            </span>
          </li>
          <li>
            <span>
              The loop calls <code>next()</code>. <code>current (1) &lt;= last (3)</code>, so it returns{' '}
              <code>{'{ value: 1, done: false }'}</code> and <code>current</code> becomes 2. <code>for...of</code>{' '}
              assigns <code>n = 1</code> and runs the body.
            </span>
          </li>
          <li>
            <span>
              Next iteration: <code>next()</code> returns <code>{'{ value: 2, done: false }'}</code>,{' '}
              <code>n = 2</code>, body runs. Then <code>{'{ value: 3 }'}</code>, <code>n = 3</code>.
            </span>
          </li>
          <li>
            <span>
              Next call: <code>current (4) &gt; last (3)</code> &rarr; returns{' '}
              <code>{'{ value: undefined, done: true }'}</code>. The loop sees <code>done</code> and exits.
            </span>
          </li>
          <li>
            <span>
              A second <code>for...of</code> on the same <code>range</code> calls <code>[Symbol.iterator]()</code>{' '}
              again, getting a <em>fresh</em> iterator starting at 1. The iterable is reusable; the iterator is not.
            </span>
          </li>
        </ol>
      </section>

      {/* ── Code Examples ─────────────────────────────────── */}
      <section className="day-section">
        <h2 className="article-h2">Code Examples</h2>

        <h3 className="article-h3">1. A hand-written iterator over an array</h3>
        <CodeBlock
          code={`function makeIterator(arr) {
  let i = 0;
  return {
    next() {
      return i < arr.length
        ? { value: arr[i++], done: false }
        : { value: undefined, done: true };
    },
  };
}
const it = makeIterator(["a", "b"]);
it.next(); // { value: "a", done: false }
it.next(); // { value: "b", done: false }
it.next(); // { value: undefined, done: true }`}
          filename="hand-written.js"
        />

        <h3 className="article-h3">2. Making a plain object iterable</h3>
        <CodeBlock
          code={`const users = { alice: 30, bob: 25 };
// users is NOT iterable by default:
// for (const v of users) {} // TypeError

// Make it iterable over its values:
users[Symbol.iterator] = function () {
  const values = Object.values(this);
  let i = 0;
  return {
    next: () => i < values.length
      ? { value: values[i++], done: false }
      : { value: undefined, done: true },
  };
};
for (const age of users) console.log(age); // 30, 25`}
          filename="make-iterable.js"
        />

        <h3 className="article-h3">3. An infinite lazy sequence</h3>
        <CodeBlock
          code={`const naturals = {
  [Symbol.iterator]() {
    let n = 0;
    return { next: () => ({ value: n++, done: false }) };
  },
};

// Take the first 5 with a bounded loop:
const first5 = [];
for (const n of naturals) {
  first5.push(n);
  if (first5.length === 5) break;
}
first5; // [0, 1, 2, 3, 4]
// The sequence never ends — but we only pulled 5 values.`}
          filename="infinite.js"
        />

        <h3 className="article-h3">4. <code>return()</code> for early-exit cleanup</h3>
        <CodeBlock
          code={`const lines = (filename) => ({
  [Symbol.iterator]() {
    const handle = openFile(filename); // pretend resource
    let done = false;
    return {
      next() {
        const line = handle.readLine();
        if (line === null) { done = true; handle.close(); }
        return done ? { value: undefined, done: true } : { value: line, done: false };
      },
      return() {           // called on early exit (break/throw)
        if (!done) handle.close();
        return { value: undefined, done: true };
      },
    };
  },
});
for (const l of lines("f.txt")) { if (l.startsWith("#")) break; }
// \`return()\` ran — file was closed despite the break.`}
          filename="return-cleanup.js"
        />

        <h3 className="article-h3">5. Iterators are single-use</h3>
        <CodeBlock
          code={`const it = [1, 2, 3][Symbol.iterator]();
[...it]; // [1, 2, 3]
[...it]; // [] — exhausted, returns done immediately

// Contrast: the ARRAY is reusable (each [Symbol.iterator]() is fresh):
const arr = [1, 2, 3];
[...arr]; // [1, 2, 3]
[...arr]; // [1, 2, 3]`}
          filename="single-use.js"
        />

        <div className="article-callout">
          <p>
            The trap: spreading an iterator consumes it. If you <code>[...it]</code> a generator-based iterator twice,
            the second is empty. Spread and <code>Array.from</code> <em>exhaust</em> a single-use iterator &mdash;
            re-call <code>[Symbol.iterator]()</code> (or re-invoke the generator) for a fresh one.
          </p>
        </div>
      </section>

      {/* ── Practice ─────────────────────────────────────── */}
      <section className="day-section">
        <div className="practice-callout">
          <span className="practice-callout-label">Practice (75 minutes)</span>
          <p>
            Make a <code>Range(start, end, step)</code> object iterable, and a <code>Fibonacci</code> iterable
            (infinite). Then write a <code>take(iterable, n)</code> that pulls the first <code>n</code> values from any
            iterable &mdash; proving you can consume infinite sequences safely.
          </p>
        </div>

        <CodeBlock
          code={`// 1. Finite range
function Range(start, end, step = 1) {
  return {
    [Symbol.iterator]() {
      let v = start;
      return {
        next: () => v <= end
          ? { value: (v += step) - step, done: false }
          : { value: undefined, done: true },
      };
    },
  };
}
[...Range(1, 10, 2)]; // [1, 3, 5, 7, 9]

// 2. Infinite Fibonacci
const Fibonacci = {
  [Symbol.iterator]() {
    let a = 0, b = 1;
    return {
      next: () => {
        const value = a;
        [a, b] = [b, a + b];
        return { value, done: false };
      },
    };
  },
};

// 3. take — works on ANY iterable, finite or infinite
function take(iterable, n) {
  const out = [];
  const it = iterable[Symbol.iterator]();
  for (let i = 0; i < n; i++) {
    const { value, done } = it.next();
    if (done) break;
    out.push(value);
  }
  return out;
}
take(Fibonacci, 8); // [0, 1, 1, 2, 3, 5, 8, 13]`}
          filename="practice.js"
        />

        <div className="practice-callout">
          <span className="practice-callout-label">Then ask yourself</span>
          <p className="article-para" style={{ marginTop: '0.5rem' }}>
            Why does <code>take</code> work on an infinite iterable without hanging? (Because it only calls{' '}
            <code>next()</code> <code>n</code> times then stops. The iterator never &ldquo;finishes&rdquo; &mdash; the
            consumer just decides it has had enough. That&apos;s the laziness contract: the producer yields on demand,
            never ahead of time.)
          </p>
        </div>
      </section>

      {/* ── Interview Questions ───────────────────────────── */}
      <section className="day-section">
        <div className="interview-callout">
          <span className="interview-callout-label">Interview Questions</span>

          <div className="iq-block">
            <h4 className="iq-q">Q1. What is an iterator vs an iterable?</h4>
            <p className="iq-a">
              An <em>iterator</em> is an object with a <code>next()</code> method returning{' '}
              <code>{'{ value, done }'}</code> &mdash; it produces one value at a time and tracks position. An{' '}
              <em>iterable</em> is an object with a <code>[Symbol.iterator]</code> method that returns an iterator.
              The iterable knows how to make iterators; iterators know how to produce values. <code>for...of</code>{' '}
              bridges them.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q2. How does <code>for...of</code> work internally?</h4>
            <p className="iq-a">
              It calls <code>obj[Symbol.iterator]()</code> once to get an iterator, then loops calling{' '}
              <code>next()</code>. Each <code>{'{ value, done }'}</code>: if <code>done</code> is false, the body runs
              with <code>value</code>; if true, the loop exits. On early exit (<code>break</code>/<code>throw</code>),
              it calls the iterator&apos;s optional <code>return()</code> for cleanup.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q3. Why are iterators called &ldquo;lazy&rdquo;?</h4>
            <p className="iq-a">
              Because they produce values only when <code>next()</code> is called &mdash; not ahead of time. This lets
              them represent sequences that are too large to materialize, or genuinely infinite (Fibonacci, primes).
              The consumer pulls values on demand, so cost is proportional to what&apos;s actually used, not the full
              potential size.
            </p>
          </div>

          <div className="iq-block">
            <h4 className="iq-q">Q4. Why can&apos;t you <code>for...of</code> a plain object?</h4>
            <p className="iq-a">
              Plain objects don&apos;t implement <code>[Symbol.iterator]</code>, so <code>for...of</code> throws a{' '}
              <code>TypeError</code>. They&apos;re keyed collections, not sequences. Use <code>Object.keys</code>/
              <code>values</code>/<code>entries</code> (which return iterables), or add a{' '}
              <code>[Symbol.iterator]</code> method yourself. <code>for...in</code> iterates keys but has inheritance
              footguns and is legacy.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q5 (Medium). What happens if you spread an iterator twice?</h4>
            <CodeBlock
              code={`const it = gen()[Symbol.iterator]();
const a = [...it];
const b = [...it];`}
              filename="q5.js"
            />
            <p className="iq-a">
              <code>a</code> gets the values, <code>b</code> is empty. Spread exhausts a single-use iterator: each{' '}
              <code>next()</code> advances it until <code>done</code>, and a second spread starts from the exhausted
              state. Iterables (vs iterators) are reusable because each <code>[Symbol.iterator]()</code> call returns a
              fresh iterator; an iterator itself is one-shot.
            </p>
          </div>

          <div className="iq-block iq-medium">
            <h4 className="iq-q">Q6 (Medium). What is <code>return()</code> on an iterator for?</h4>
            <p className="iq-a">
              It signals early termination &mdash; the consumer stopped before <code>done</code> (a <code>break</code>,
              <code> return</code>, or <code>throw</code> inside <code>for...of</code>). The iterator should release
              any resources (file handles, network) and return <code>{'{ done: true }'}</code>.{' '}
              <code>for...of</code> calls it automatically on early exit. Hand-written iterators that hold resources
              should implement it; generators get it for free (Day 3).
            </p>
          </div>

          <div className="iq-block iq-hard">
            <h4 className="iq-q">Q7 (Hard). Implement <code>map</code> for any iterable, lazily.</h4>
            <p className="iq-a">
              <code>{'function mapIterable(iterable, fn) { const it = iterable[Symbol.iterator](); return { [Symbol.iterator]() { return this; }, next() { const r = it.next(); return r.done ? r : { value: fn(r.value), done: false }; } }; }'}</code>{' '}
              Wrap the source iterator: each <code>next()</code> pulls one value from the source, applies{' '}
              <code>fn</code>, and returns it. Because it pulls lazily, it works on infinite iterables and never
              materializes the full sequence. This is exactly what generators (Day 3) express far more concisely &mdash;
              <code> mapIterable</code> is the manual version of <code>{'function* mapGen(it, fn) { for (const v of it) yield fn(v); }'}</code>.
            </p>
          </div>
        </div>
      </section>

      <DayNav prev={prev} next={next} />
    </ContentLayout>
  )
}
