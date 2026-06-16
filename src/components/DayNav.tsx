import { Link, type LinkProps } from '@tanstack/react-router'
import './DayNav.css'

export interface DayNavLink {
  label: string
  path: string
}

interface DayNavProps {
  prev?: DayNavLink
  next?: DayNavLink
}

export default function DayNav({ prev, next }: DayNavProps) {
  return (
    <nav className="day-nav" aria-label="Day navigation">
      {prev ? (
        <Link to={prev.path as LinkProps['to']} className="day-nav-link day-nav-prev">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="day-nav-dir">Previous</span>
          <span className="day-nav-label">{prev.label}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={next.path as LinkProps['to']} className="day-nav-link day-nav-next">
          <span className="day-nav-dir">Next</span>
          <span className="day-nav-label">{next.label}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      ) : <span />}
    </nav>
  )
}
