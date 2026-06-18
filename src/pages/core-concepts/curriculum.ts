import type { NavItem } from '../../components/ContentLayout'
import type { DayNavLink } from '../../components/DayNav'

/**
 * Single source of truth for the 8-week curriculum.
 * The week index pages (WeekIndexPage) and coming-soon day pages (DayPlaceholder)
 * both read from this data. navConfig.ts keeps its own Week 1 nav for the existing
 * Day 1–7 lesson pages.
 */

export interface DaySummary {
  day: number
  title: string
  topics: string[]
}

export interface Week {
  week: number
  slug: string
  title: string
  month: 1 | 2
  monthLabel: string
  subtitle: string
  /** Short chips shown under the title (e.g. "7 days"). */
  meta: string[]
  /** Whether daily lessons exist yet. */
  status: 'available' | 'upcoming'
  /** Bridge copy shown at the bottom of the week index. Supports **bold**. */
  bridge: string
  days: DaySummary[]
}

const CORE = 'Core Mastery'
const EXPERT = 'Expert Level'

export const curriculum: Week[] = [
  {
    week: 1,
    slug: 'execution-context-scope',
    title: 'Execution Context & Scope',
    month: 1,
    monthLabel: CORE,
    subtitle: 'Daily time: 2–3 hours. 7 days of progressively deeper understanding.',
    meta: ['7 days', '6 hard problems', '20+ output questions'],
    status: 'available',
    bridge:
      'When you finish Week 1, **Week 2 (Closures & Functions)** is where JavaScript interviews start becoming genuinely difficult — and where many experienced frontend developers discover gaps in their understanding.',
    days: [
      { day: 1, title: 'How JavaScript Executes Code', topics: ['Execution Context', 'Global & Function Contexts', 'Call Stack'] },
      { day: 2, title: 'Hoisting', topics: ['Variable Hoisting', 'Function Hoisting', 'Function Expression Hoisting'] },
      { day: 3, title: 'TDZ + let + const', topics: ['Temporal Dead Zone', 'Why let exists', 'Why const exists'] },
      { day: 4, title: 'Scope', topics: ['Global Scope', 'Function Scope', 'Block Scope', 'Lexical Scope'] },
      { day: 5, title: 'Scope Chain Deep Dive', topics: ['Nested scope resolution', 'Shadowing', 'Step-by-step analysis'] },
      { day: 6, title: 'Hard Interview Problems', topics: ['var vs let in loops', 'TDZ edge cases', 'Closure + setTimeout'] },
      { day: 7, title: 'Revision + Mock Interview', topics: ['All topics reviewed', '20 output questions', 'Timed answers'] },
    ],
  },
  {
    week: 2,
    slug: 'closures-functions',
    title: 'Closures & Functions',
    month: 1,
    monthLabel: CORE,
    subtitle: 'Where JavaScript interviews start getting genuinely hard.',
    meta: ['7 days', 'Closures + this', 'call / apply / bind'],
    status: 'available',
    bridge:
      '**Week 3 (Prototypes & OOP)** rewrites how you think about inheritance. Most developers carry class-based mental models from other languages — JavaScript does it differently.',
    days: [
      { day: 1, title: 'Closures, Defined', topics: ['What a closure is', 'Why closures exist', 'The lexical environment'] },
      { day: 2, title: 'Closure Patterns', topics: ['Memoization', 'Partial application', 'The module pattern'] },
      { day: 3, title: 'First-Class & Higher-Order Functions', topics: ['Functions as values', 'map / filter / reduce', 'Returning functions'] },
      { day: 4, title: 'call, apply, bind', topics: ['Explicit binding', 'Borrowing methods', 'Currying with bind'] },
      { day: 5, title: 'The this Keyword', topics: ['Default binding', 'Implicit binding', 'Explicit & new binding'] },
      { day: 6, title: 'Arrow vs Regular Functions', topics: ['Lexical this', 'When to use arrows', 'arguments object'] },
      { day: 7, title: 'Revision + Hard Problems', topics: ['Closure puzzles', 'this output questions', 'Self-assessment'] },
    ],
  },
  {
    week: 3,
    slug: 'prototypes-oop',
    title: 'Prototypes & OOP',
    month: 1,
    monthLabel: CORE,
    subtitle: 'How inheritance actually works in JavaScript.',
    meta: ['7 days', 'Prototype chain', 'Classes under the hood'],
    status: 'upcoming',
    bridge:
      'With OOP behind you, **Week 4 (Async JS)** is the most practically important week. The event loop, promises, and async/await internals come up in every interview.',
    days: [
      { day: 1, title: 'The Prototype Chain', topics: ['[[Prototype]]', 'Property lookup', 'The end of the chain'] },
      { day: 2, title: '__proto__ vs prototype', topics: ['Function.prototype', 'Object.create', 'The difference'] },
      { day: 3, title: 'Constructor Functions', topics: ['The new operator', 'Instance properties', 'Prototype methods'] },
      { day: 4, title: 'ES6 Classes', topics: ['class syntax', 'Sugar over constructors', 'Static methods'] },
      { day: 5, title: 'Inheritance & super', topics: ['extends', 'super()', 'Overriding methods'] },
      { day: 6, title: 'Composition vs Inheritance', topics: ['Mixins', 'Object composition', 'When to avoid classes'] },
      { day: 7, title: 'Revision + Hard Problems', topics: ['Prototype puzzles', 'OOP output questions', 'Self-assessment'] },
    ],
  },
  {
    week: 4,
    slug: 'async-js',
    title: 'Asynchronous JavaScript',
    month: 1,
    monthLabel: CORE,
    subtitle: 'The event loop, promises, and async/await internals.',
    meta: ['7 days', 'Event loop', 'Promises + async/await'],
    status: 'upcoming',
    bridge:
      'Month 1 complete. **Month 2** moves from understanding to mastery — **Week 5 (Advanced Patterns)** introduces currying, generators, proxies, and the metaprogramming primitives that separate senior candidates.',
    days: [
      { day: 1, title: 'The JS Runtime', topics: ['Call stack', 'Web APIs', 'Task queue'] },
      { day: 2, title: 'The Event Loop', topics: ['Microtasks vs macrotasks', 'Execution order', 'Starvation'] },
      { day: 3, title: 'Callbacks & Callback Hell', topics: ['Error-first callbacks', 'Pyramid of doom', 'Inversion of control'] },
      { day: 4, title: 'Promises', topics: ['States', 'then / catch / finally', 'Chaining'] },
      { day: 5, title: 'async / await', topics: ['Syntactic sugar', 'Under the hood', 'Top-level await'] },
      { day: 6, title: 'Error Handling & Combinators', topics: ['try / catch', 'Promise.all', 'race & allSettled'] },
      { day: 7, title: 'Revision + Hard Problems', topics: ['Output ordering', 'Async puzzles', 'Self-assessment'] },
    ],
  },
  {
    week: 5,
    slug: 'advanced-patterns',
    title: 'Advanced Patterns',
    month: 2,
    monthLabel: EXPERT,
    subtitle: 'Functional patterns and metaprogramming primitives.',
    meta: ['7 days', 'Currying & generators', 'Proxy & Reflect'],
    status: 'upcoming',
    bridge:
      '**Week 6 (Modules, Performance & Memory)** connects your code to the engine that runs it: how modules bundle, how garbage collection reclaims memory, and how leaks happen.',
    days: [
      { day: 1, title: 'Currying & Composition', topics: ['Currying', 'pipe & compose', 'Point-free style'] },
      { day: 2, title: 'Iterators', topics: ['Iterator protocol', 'Symbol.iterator', 'Lazy evaluation'] },
      { day: 3, title: 'Generators', topics: ['function*', 'yield & yield*', 'Two-way communication'] },
      { day: 4, title: 'Proxy & Reflect', topics: ['Traps', 'The Reflect API', 'Use cases'] },
      { day: 5, title: 'Weak Collections', topics: ['WeakMap', 'WeakSet', 'WeakRef & FinalizationRegistry'] },
      { day: 6, title: 'Symbols', topics: ['Unique keys', 'Well-known symbols', 'Use cases'] },
      { day: 7, title: 'Revision + Hard Problems', topics: ['Pattern puzzles', 'Metaprogramming questions', 'Self-assessment'] },
    ],
  },
  {
    week: 6,
    slug: 'modules-perf-memory',
    title: 'Modules, Performance & Memory',
    month: 2,
    monthLabel: EXPERT,
    subtitle: 'How code is bundled, executed, and garbage-collected.',
    meta: ['7 days', 'ESM vs CJS', 'GC & memory leaks'],
    status: 'upcoming',
    bridge:
      '**Week 7 (JS Engine Internals)** goes inside V8 itself — parsing, JIT compilation, hidden classes, and the deoptimization traps that quietly kill performance.',
    days: [
      { day: 1, title: 'ES Modules vs CommonJS', topics: ['Static structure', 'Live bindings', 'Under the hood'] },
      { day: 2, title: 'Module Bundling', topics: ['Dependency graph', 'Code splitting', 'Tree shaking'] },
      { day: 3, title: 'Garbage Collection', topics: ['Reachability', 'Mark & sweep', 'Generational GC'] },
      { day: 4, title: 'Memory Leaks', topics: ['Common causes', 'Detection', 'Heap snapshots'] },
      { day: 5, title: 'Delegate, Debounce, Throttle', topics: ['Event delegation', 'Debounce', 'Throttle'] },
      { day: 6, title: 'Timing & requestAnimationFrame', topics: ['requestAnimationFrame', 'Microtask timing', 'Scheduling'] },
      { day: 7, title: 'Revision + Hard Problems', topics: ['Performance puzzles', 'Memory tracing', 'Self-assessment'] },
    ],
  },
  {
    week: 7,
    slug: 'js-engine-internals',
    title: 'JS Engine Internals',
    month: 2,
    monthLabel: EXPERT,
    subtitle: 'V8, JIT, hidden classes, and reading the spec.',
    meta: ['7 days', 'V8 & JIT', 'Hidden classes'],
    status: 'upcoming',
    bridge:
      'Final stretch. **Week 8 (Consolidation & Hard Problems)** has you re-implement Promise, new, call/apply/bind, and an event emitter from scratch — then solve 10 hard interview problems.',
    days: [
      { day: 1, title: 'The V8 Pipeline', topics: ['Parsing', 'AST', 'The Ignition interpreter'] },
      { day: 2, title: 'JIT & Optimization', topics: ['TurboFan', 'Hidden classes', 'Inline caching'] },
      { day: 3, title: 'Deoptimization', topics: ['What kills perf', 'Polymorphism', 'Bailouts'] },
      { day: 4, title: 'Stack vs Heap', topics: ['Primitives', 'Objects & references', 'Memory layout'] },
      { day: 5, title: 'eval, with, strict mode', topics: ['eval', 'with', 'strict mode'] },
      { day: 6, title: 'Reading the Spec', topics: ['ECMA-262 structure', 'Abstract operations', 'Following algorithms'] },
      { day: 7, title: 'Revision + Hard Problems', topics: ['Engine puzzles', 'Perf output questions', 'Self-assessment'] },
    ],
  },
  {
    week: 8,
    slug: 'consolidation',
    title: 'Consolidation & Hard Problems',
    month: 2,
    monthLabel: EXPERT,
    subtitle: 'Re-implement the language from scratch.',
    meta: ['7 days', 'Build from scratch', '10 hard problems'],
    status: 'upcoming',
    bridge:
      "That's the full journey: from execution context to engine internals. Revisit any week, or re-solve the hard problems until the answers are automatic.",
    days: [
      { day: 1, title: 'Promise from Scratch (1/2)', topics: ['States & transitions', 'then chaining', 'Resolution'] },
      { day: 2, title: 'Promise from Scratch (2/2)', topics: ['Async resolution', 'Rejection', 'finally'] },
      { day: 3, title: 'call, apply, bind from Scratch', topics: ['call', 'apply', 'bind'] },
      { day: 4, title: 'new from Scratch', topics: ['Object creation', 'Prototype link', 'Constructor return'] },
      { day: 5, title: 'EventEmitter, Debounce, Deep Clone', topics: ['EventEmitter', 'debounce', 'deepClone'] },
      { day: 6, title: '10 Hard Interview Problems', topics: ['Solve', 'Explain', 'Trade-offs'] },
      { day: 7, title: 'Final Revision + Self-Assessment', topics: ['Full review', 'Self-assessment', "What's next"] },
    ],
  },
]

/* ── Helpers ──────────────────────────────────────────────────── */

export function weekPath(slug: string): string {
  return `/core-concepts/${slug}`
}

export function dayPath(slug: string, day: number): string {
  return `/core-concepts/${slug}/day-${day}`
}

export function getWeekBySlug(slug: string): Week | undefined {
  return curriculum.find((w) => w.slug === slug)
}

export function getWeek(number: number): Week | undefined {
  return curriculum.find((w) => w.week === number)
}

/** Sidebar nav for a week: Overview + the 7 days. */
export function weekNav(week: Week): NavItem[] {
  return [
    { label: 'Overview', path: weekPath(week.slug) },
    ...week.days.map((d) => ({
      label: `Day ${d.day}: ${d.title}`,
      path: dayPath(week.slug, d.day),
    })),
  ]
}

/** Previous / next day links for the day-nav at the bottom of a day page. */
export function dayNavLinks(week: Week, day: number): { prev?: DayNavLink; next?: DayNavLink } {
  const prev = day > 1 ? { label: `Day ${day - 1}: ${week.days[day - 2].title}`, path: dayPath(week.slug, day - 1) } : undefined
  const next = day < week.days.length ? { label: `Day ${day + 1}: ${week.days[day].title}`, path: dayPath(week.slug, day + 1) } : undefined
  return { prev, next }
}

/** Parse a `$day` route param like "day-3" into a 1-based number, or undefined. */
export function parseDayParam(param: string | undefined): number | undefined {
  if (!param) return undefined
  const match = param.match(/^day-(\d+)$/)
  if (!match) return undefined
  const n = Number(match[1])
  return n >= 1 ? n : undefined
}
