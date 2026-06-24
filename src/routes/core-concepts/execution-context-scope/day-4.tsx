import { createFileRoute } from '@tanstack/react-router'
import Day4 from '../../../pages/core-concepts/Day4'
import { dayHead } from '../../../seo'

export const Route = createFileRoute(
  '/core-concepts/execution-context-scope/day-4',
)({
  head: () => dayHead('execution-context-scope', 4),
  component: Day4,
})
