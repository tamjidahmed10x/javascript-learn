import { createFileRoute, notFound } from '@tanstack/react-router'
import ConsolidationDay from '../../../pages/core-concepts/ConsolidationDay'
import { getWeekBySlug, parseDayParam } from '../../../pages/core-concepts/curriculum'
import { dayHead } from '../../../seo'

const SLUG = 'consolidation'

export const Route = createFileRoute('/core-concepts/consolidation/$day')({
  beforeLoad: ({ params }) => {
    const week = getWeekBySlug(SLUG)!
    const day = parseDayParam(params.day)
    if (!day || day < 1 || day > week.days.length) throw notFound()
  },
  head: ({ params }) => dayHead(SLUG, parseDayParam(params.day)!),
  component: ConsolidationDay,
})
