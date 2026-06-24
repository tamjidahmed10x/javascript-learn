import { createFileRoute, notFound } from '@tanstack/react-router'
import AsyncDay from '../../../pages/core-concepts/AsyncDay'
import { getWeekBySlug, parseDayParam } from '../../../pages/core-concepts/curriculum'
import { dayHead } from '../../../seo'

const SLUG = 'async-js'

export const Route = createFileRoute('/core-concepts/async-js/$day')({
  beforeLoad: ({ params }) => {
    const week = getWeekBySlug(SLUG)!
    const day = parseDayParam(params.day)
    if (!day || day < 1 || day > week.days.length) throw notFound()
  },
  head: ({ params }) => dayHead(SLUG, parseDayParam(params.day)!),
  component: AsyncDay,
})
