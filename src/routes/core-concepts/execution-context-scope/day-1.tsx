import { createFileRoute } from '@tanstack/react-router'
import Day1 from '../../../pages/core-concepts/Day1'
import { dayHead } from '../../../seo'

export const Route = createFileRoute(
  '/core-concepts/execution-context-scope/day-1',
)({
  head: () => dayHead('execution-context-scope', 1),
  component: Day1,
})
