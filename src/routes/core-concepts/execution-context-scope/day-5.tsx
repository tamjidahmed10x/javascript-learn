import { createFileRoute } from '@tanstack/react-router'
import Day5 from '../../../pages/core-concepts/Day5'
import { dayHead } from '../../../seo'

export const Route = createFileRoute(
  '/core-concepts/execution-context-scope/day-5',
)({
  head: () => dayHead('execution-context-scope', 5),
  component: Day5,
})
