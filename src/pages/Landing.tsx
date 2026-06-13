import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import './Landing.css'

/* ── Data ────────────────────────────────────────────────────── */

const sections = [
  {
    title: 'Core Concepts',
    description:
      'Closures, prototypal inheritance, the event loop, execution context, scope chains, `this` binding — the fundamentals interviewers probe deepest.',
    path: '/core-concepts/execution-context-scope',
    tag: 'Internals',
  },
  {
    title: 'Interview Prep',
    description:
      'Common patterns, system design in JavaScript, algorithm fundamentals, and the conceptual questions that separate candidates.',
    path: '/interview-prep',
    tag: 'Practice',
  },
  {
    title: 'Browser & DOM',
    description:
      'Event delegation, the rendering pipeline, layout thrashing, the critical rendering path, Web APIs, and performance patterns.',
    path: '/browser-dom',
    tag: 'Runtime',
  },
  {
    title: 'Modern JS Features',
    description:
      'ES modules, promises & async/await internals, iterators & generators, proxies, symbols, and the language features reshaping the ecosystem.',
    path: '/modern-js',
    tag: 'ES2024+',
  },
]

/* ── Simple syntax highlighter (no dependency) ─────────────────── */

function highlightJS(code: string): React.ReactNode[] {
  const lines = code.split('\n')
  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = []
    let remaining = line
    let key = 0

    while (remaining.length > 0) {
      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)/)
      if (commentMatch) {
        parts.push(
          <span key={key++} className="comment">
            {commentMatch[1]}
          </span>
        )
        remaining = remaining.slice(commentMatch[1].length)
        continue
      }

      // Strings (single or double quoted)
      const stringMatch = remaining.match(/^(['"])(.*?)(\1)/)
      if (stringMatch) {
        parts.push(
          <span key={key++} className="string">
            {stringMatch[0]}
          </span>
        )
        remaining = remaining.slice(stringMatch[0].length)
        continue
      }

      // Numbers
      const numMatch = remaining.match(/^(\d+)/)
      if (numMatch) {
        parts.push(
          <span key={key++} className="number">
            {numMatch[1]}
          </span>
        )
        remaining = remaining.slice(numMatch[1].length)
        continue
      }

      // Keywords
      const kwMatch = remaining.match(
        /^(function|return|let|const|var|if|else|for|while|new|class|extends|import|export|from|async|await|yield|typeof|instanceof|in|of|switch|case|break|continue|default|try|catch|throw|finally|this|true|false|null|undefined|void|delete)\b/
      )
      if (kwMatch) {
        parts.push(
          <span key={key++} className="keyword">
            {kwMatch[1]}
          </span>
        )
        remaining = remaining.slice(kwMatch[1].length)
        continue
      }

      // Function calls (word followed by parenthesis)
      const fnMatch = remaining.match(/^([a-zA-Z_$][\w$]*)\s*(?=\()/
      )
      if (fnMatch) {
        parts.push(
          <span key={key++} className="function">
            {fnMatch[1]}
          </span>
        )
        remaining = remaining.slice(fnMatch[1].length)
        continue
      }

      // Regular character
      parts.push(remaining[0])
      remaining = remaining.slice(1)
    }

    return (
      <span key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 ? '\n' : ''}
      </span>
    )
  })
}

const codeExample = `// Closures: functions that remember their lexical scope
function createCounter(initial = 0) {
  let count = initial

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  }
}

const counter = createCounter(10)
counter.increment() // 11
counter.increment() // 12
counter.decrement() // 11
counter.getCount()  // 11`

/* ── Components ───────────────────────────────────────────────── */

function Header() {
  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Primary">
        <Link to="/" className="nav-logo" aria-label="js.learn Home">
          <span className="logo-bracket">{'{'}</span>
          <span className="logo-text">js.learn</span>
          <span className="logo-bracket">{'}'}</span>
        </Link>
        <div className="nav-actions">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">
          Learn JavaScript&nbsp;<span className="hero-accent">to its core.</span>
        </h1>
        <p className="hero-subtitle">
          Structured, opinionated deep-dives into the internals that matter in
          interviews. Written for developers who already write JS — now it's time
          to explain it.
        </p>
      </div>
    </section>
  )
}

function SectionCard({
  title,
  description,
  path,
  tag,
  index,
}: {
  title: string
  description: string
  path: string
  tag: string
  index: number
}) {
  return (
    <Link
      to={path}
      className="section-card"
      style={{ '--card-i': index } as React.CSSProperties}
    >
      <div className="card-header">
        <span className="card-tag">{tag}</span>
        <svg
          className="card-arrow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </Link>
  )
}

function TopicsGrid() {
  return (
    <section className="topics" id="topics">
      <div className="topics-inner">
        <h2 className="topics-heading">Learning paths</h2>
        <div className="topics-grid">
          {sections.map((section, i) => (
            <SectionCard key={section.path} {...section} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CodePreview() {
  return (
    <section className="code-preview">
      <div className="code-preview-inner">
        <div className="code-preview-text">
          <h2>Not syntax. Mechanics.</h2>
          <p>
            Every topic goes past the surface into how JavaScript actually works.
            Understand the engine, not just the API.
          </p>
        </div>
        <div className="code-block">
          <div className="code-block-header">
            <div className="code-dots">
              <span className="code-dot" />
              <span className="code-dot" />
              <span className="code-dot" />
            </div>
            <span className="code-filename">closures.js</span>
          </div>
          <pre className="code-pre">
            <code>{highlightJS(codeExample)}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-bracket">{'{'}</span>
          <span className="logo-text">js.learn</span>
          <span className="logo-bracket">{'}'}</span>
        </div>
        <p className="footer-note">
          Built for developers who want to understand JavaScript deeply.
        </p>
      </div>
    </footer>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function Landing() {
  return (
    <div className="landing">
      <Header />
      <main>
        <Hero />
        <TopicsGrid />
        <CodePreview />
      </main>
      <Footer />
    </div>
  )
}
