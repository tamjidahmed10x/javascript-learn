import { Link, useLocation, type LinkProps } from '@tanstack/react-router'
import ContentLayout from '../../components/ContentLayout'
import ComingSoon from '../../components/ComingSoon'
import '../../components/ContentStyles.css'
import {
  getWeekBySlug,
  parseDayParam,
  weekNav,
  weekPath,
} from './curriculum'

/**
 * Shared component for every coming-soon day route (weeks 2–8). Self-contained:
 * derives its week + day from the current URL so route files can import it
 * directly (`component: DayPlaceholder`) and stay free of inline wrappers.
 */
export default function DayPlaceholder() {
  const { pathname } = useLocation()
  // pathname like "/core-concepts/<slug>/day-3"
  const segments = pathname.split('/').filter(Boolean)
  const slug = segments[1]
  const dayParam = segments[2]

  const week = getWeekBySlug(slug ?? '')
  const navItems = week ? weekNav(week) : []
  const day = parseDayParam(dayParam)
  const dayValid = !!(week && day && day >= 1 && day <= week.days.length)

  return (
    <ContentLayout
      title={week?.title ?? 'JavaScript'}
      subtitle={week ? `Week ${week.week} · ${week.monthLabel}` : 'Curriculum'}
      navItems={navItems}
    >
      {dayValid && week && day ? (
        <ComingSoon week={week} day={day} />
      ) : (
        <div className="lesson-header">
          <span className="lesson-tag">{week ? `Week ${week.week}` : 'Not found'}</span>
          <h1 className="lesson-title">No lesson here</h1>
          <p className="lesson-subtitle">
            That day isn&apos;t part of the plan{week ? ` for ${week.title}` : ''}.
          </p>
          <Link
            to={(week ? weekPath(week.slug) : '/') as LinkProps['to']}
            className="coming-soon-back"
            style={{ marginTop: '1rem' }}
          >
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
            Back to {week ? week.title : 'home'}
          </Link>
        </div>
      )}
    </ContentLayout>
  )
}
