import { createFileRoute } from '@tanstack/react-router'
import Day3 from '../../../pages/core-concepts/Day3'
import { dayHead } from '../../../seo'

export const Route = createFileRoute(
  '/core-concepts/execution-context-scope/day-3',
)({
  head: () => dayHead('execution-context-scope', 3),
  component: Day3,
})
