import { createFileRoute, notFound } from '@tanstack/react-router'
import AdvancedDay from '../../../pages/core-concepts/AdvancedDay'
import { getWeekBySlug, parseDayParam } from '../../../pages/core-concepts/curriculum'
import { dayHead } from '../../../seo'

const SLUG = 'advanced-patterns'

export const Route = createFileRoute('/core-concepts/advanced-patterns/$day')({
  beforeLoad: ({ params }) => {
    const week = getWeekBySlug(SLUG)!
    const day = parseDayParam(params.day)
    if (!day || day < 1 || day > week.days.length) throw notFound()
  },
  head: ({ params }) => dayHead(SLUG, parseDayParam(params.day)!),
  component: AdvancedDay,
})
