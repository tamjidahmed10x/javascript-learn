import { Link, type LinkProps } from '@tanstack/react-router'
import ContentLayout, { type NavItem } from '../../components/ContentLayout'
import { week1NavItems } from './navConfig'
import '../../components/ContentStyles.css'

export default function Week1Index() {
  const navItems: NavItem[] = [
    { label: 'Overview', path: '/core-concepts/execution-context-scope' },
    ...week1NavItems,
  ]

  const daySummaries = [
    { day: 1, title: 'How JavaScript Executes Code', topics: ['Execution Context', 'Global & Function Contexts', 'Call Stack'] },
    { day: 2, title: 'Hoisting', topics: ['Variable Hoisting', 'Function Hoisting', 'Function Expression Hoisting'] },
    { day: 3, title: 'TDZ + let + const', topics: ['Temporal Dead Zone', 'Why let exists', 'Why const exists'] },
    { day: 4, title: 'Scope', topics: ['Global Scope', 'Function Scope', 'Block Scope', 'Lexical Scope'] },
    { day: 5, title: 'Scope Chain Deep Dive', topics: ['Nested scope resolution', 'Shadowing', 'Step-by-step analysis'] },
    { day: 6, title: 'Hard Interview Problems', topics: ['var vs let in loops', 'TDZ edge cases', 'Closure + setTimeout'] },
    { day: 7, title: 'Revision + Mock Interview', topics: ['All topics reviewed', '20 output questions', 'Timed answers'] },
  ]

  return (
    <ContentLayout title="Core Concepts" subtitle="JavaScript internals" navItems={navItems}>
      <div className="lesson-header">
        <span className="lesson-tag">Week 1</span>
        <h1 className="lesson-title">Execution Context & Scope</h1>
        <p className="lesson-subtitle">
          Daily time: 2–3 hours. 7 days of progressively deeper understanding.
        </p>
        <div className="lesson-meta">
          <span className="lesson-meta-item">7 days</span>
          <span className="lesson-meta-item">6 hard problems</span>
          <span className="lesson-meta-item">20+ output questions</span>
        </div>
      </div>

      <div className="day-grid">
        {daySummaries.map((day) => (
          <Link key={day.day} to={`/core-concepts/execution-context-scope/day-${day.day}` as LinkProps['to']} className="day-card">
            <div className="day-card-header">
              <span className="day-card-num">{day.day}</span>
              <svg className="day-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <h3 className="day-card-title">{day.title}</h3>
            <ul className="day-card-topics">
              {day.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <div className="week-bridge" style={{ marginTop: '2.5rem' }}>
        <p>
          When you finish Week 1, <strong>Week 2 (Closures + this)</strong> is where JavaScript interviews start becoming genuinely difficult — and where many experienced frontend developers discover gaps in their understanding.
        </p>
      </div>
    </ContentLayout>
  )
}
