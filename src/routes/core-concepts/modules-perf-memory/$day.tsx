import { createFileRoute, notFound } from '@tanstack/react-router'
import ModulesDay from '../../../pages/core-concepts/ModulesDay'
import { getWeekBySlug, parseDayParam } from '../../../pages/core-concepts/curriculum'
import { dayHead } from '../../../seo'

const SLUG = 'modules-perf-memory'

export const Route = createFileRoute('/core-concepts/modules-perf-memory/$day')({
  beforeLoad: ({ params }) => {
    const week = getWeekBySlug(SLUG)!
    const day = parseDayParam(params.day)
    if (!day || day < 1 || day > week.days.length) throw notFound()
  },
  head: ({ params }) => dayHead(SLUG, parseDayParam(params.day)!),
  component: ModulesDay,
})
