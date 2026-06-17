import { Link, type LinkProps } from '@tanstack/react-router'
import DayNav from './DayNav'
import { dayNavLinks, weekPath, type Week } from '../pages/core-concepts/curriculum'

/**
 * Placeholder shown on day pages whose lesson hasn't been written yet.
 * On-brand: the "status" is a code comment, and the planned topics are listed
 * so the outline still carries information. No decorative imagery.
 */
export default function ComingSoon({ week, day }: { week: Week; day: number }) {
  const dayData = week.days.find((d) => d.day === day)
  const { prev, next } = dayNavLinks(week, day)

  return (
    <>
      <div className="lesson-header">
        <span className="lesson-tag">
          Week {week.week} · Day {day}
        </span>
        <h1 className="lesson-title">{dayData?.title ?? `Day ${day}`}</h1>
        <p className="lesson-subtitle">{week.title}</p>
      </div>

      <div className="lesson-code" role="note" aria-label="Lesson not yet written">
        <div className="lesson-code-header">
          <div className="lesson-code-dots">
            <span className="lesson-code-dot" />
            <span className="lesson-code-dot" />
            <span className="lesson-code-dot" />
          </div>
          <span className="lesson-code-filename">{week.slug}/day-{day}.md</span>
        </div>
        <pre className="lesson-code-pre">
          <code>
            <span className="syn-comment">{`// status: upcoming`}</span>{'\n'}
            <span className="syn-comment">{`// this lesson hasn't been written yet.`}</span>{'\n'}
            <span className="syn-comment">{`// check back soon — or write it yourself first,`}</span>{'\n'}
            <span className="syn-comment">{`// then come back to compare notes.`}</span>
          </code>
        </pre>
      </div>

      {dayData && dayData.topics.length > 0 && (
        <div className="coming-soon-topics">
          <span className="content-block-label">Planned topics</span>
          <ul className="learn-list">
            {dayData.topics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <Link to={weekPath(week.slug) as LinkProps['to']} className="coming-soon-back">
        <svg
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
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to {week.title}
      </Link>

      <DayNav prev={prev} next={next} />
    </>
  )
}
