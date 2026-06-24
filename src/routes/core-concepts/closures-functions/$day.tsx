import { createFileRoute, notFound } from '@tanstack/react-router'
import ClosuresDay from '../../../pages/core-concepts/ClosuresDay'
import { getWeekBySlug, parseDayParam } from '../../../pages/core-concepts/curriculum'
import { dayHead } from '../../../seo'

const SLUG = 'closures-functions'

export const Route = createFileRoute('/core-concepts/closures-functions/$day')({
  // Validate the day param before render. Invalid days return a real 404
  // instead of HTTP 200 with a "coming soon" page (soft-404 fix).
  beforeLoad: ({ params }) => {
    const week = getWeekBySlug(SLUG)!
    const day = parseDayParam(params.day)
    if (!day || day < 1 || day > week.days.length) throw notFound()
  },
  head: ({ params }) => dayHead(SLUG, parseDayParam(params.day)!),
  component: ClosuresDay,
})
