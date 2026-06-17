import { useLocation } from '@tanstack/react-router'
import WeekIndex from '../../components/WeekIndex'
import { getWeekBySlug } from './curriculum'

/**
 * Route-connected wrapper around the presentational WeekIndex. Derives the week
 * from the current URL ("/core-concepts/<slug>") so every week-index route can
 * share one component (`component: WeekIndexPage`).
 */
export default function WeekIndexPage() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  const week = getWeekBySlug(segments[1] ?? '')
  if (!week) return null
  return <WeekIndex week={week} />
}
