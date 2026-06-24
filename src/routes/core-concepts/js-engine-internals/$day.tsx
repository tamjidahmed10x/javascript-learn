import { createFileRoute, notFound } from '@tanstack/react-router'
import EngineDay from '../../../pages/core-concepts/EngineDay'
import { getWeekBySlug, parseDayParam } from '../../../pages/core-concepts/curriculum'
import { dayHead } from '../../../seo'

const SLUG = 'js-engine-internals'

export const Route = createFileRoute('/core-concepts/js-engine-internals/$day')({
  beforeLoad: ({ params }) => {
    const week = getWeekBySlug(SLUG)!
    const day = parseDayParam(params.day)
    if (!day || day < 1 || day > week.days.length) throw notFound()
  },
  head: ({ params }) => dayHead(SLUG, parseDayParam(params.day)!),
  component: EngineDay,
})
