import { createFileRoute } from '@tanstack/react-router'
import Day6 from '../../../pages/core-concepts/Day6'
import { dayHead } from '../../../seo'

export const Route = createFileRoute(
  '/core-concepts/execution-context-scope/day-6',
)({
  head: () => dayHead('execution-context-scope', 6),
  component: Day6,
})
