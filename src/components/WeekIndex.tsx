import { Link, type LinkProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import ContentLayout from './ContentLayout'
import { weekNav, dayPath, type Week } from '../pages/core-concepts/curriculum'
import './ContentStyles.css'

/** Renders **bold** segments inside a string as <strong>. */
function renderRich(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  )
}

export default function WeekIndex({ week }: { week: Week }) {
  const navItems = weekNav(week)

  return (
    <ContentLayout
      title={week.title}
      subtitle={`Week ${week.week} · ${week.monthLabel}`}
      navItems={navItems}
    >
      <div className="lesson-header">
        <span className="lesson-tag">Week {week.week}</span>
        <h1 className="lesson-title">{week.title}</h1>
        <p className="lesson-subtitle">{week.subtitle}</p>
        <div className="lesson-meta">
          {week.meta.map((m) => (
            <span key={m} className="lesson-meta-item">
              {m}
            </span>
          ))}
          {week.status === 'upcoming' && (
            <span className="lesson-meta-item lesson-meta-status">In progress</span>
          )}
        </div>
      </div>

      {week.status === 'upcoming' && (
        <p className="week-status-line">
          Outline only — daily lessons are still being written. Each card below is a placeholder
          until its day ships.
        </p>
      )}

      <div className="day-grid">
        {week.days.map((d) => (
          <Link
            key={d.day}
            to={dayPath(week.slug, d.day) as LinkProps['to']}
            className="day-card"
          >
            <div className="day-card-header">
              <span className="day-card-num">{d.day}</span>
              <svg
                className="day-card-arrow"
                width="14"
                height="14"
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
            <h3 className="day-card-title">{d.title}</h3>
            <ul className="day-card-topics">
              {d.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <div className="week-bridge" style={{ marginTop: '2.5rem' }}>
        <p>{renderRich(week.bridge)}</p>
      </div>
    </ContentLayout>
  )
}
