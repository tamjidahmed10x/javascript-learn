import { createFileRoute, notFound } from '@tanstack/react-router'
import PrototypesDay from '../../../pages/core-concepts/PrototypesDay'
import { getWeekBySlug, parseDayParam } from '../../../pages/core-concepts/curriculum'
import { dayHead } from '../../../seo'

const SLUG = 'prototypes-oop'

export const Route = createFileRoute('/core-concepts/prototypes-oop/$day')({
  beforeLoad: ({ params }) => {
    const week = getWeekBySlug(SLUG)!
    const day = parseDayParam(params.day)
    if (!day || day < 1 || day > week.days.length) throw notFound()
  },
  head: ({ params }) => dayHead(SLUG, parseDayParam(params.day)!),
  component: PrototypesDay,
})
