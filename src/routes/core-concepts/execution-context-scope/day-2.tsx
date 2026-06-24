import { createFileRoute } from '@tanstack/react-router'
import Day2 from '../../../pages/core-concepts/Day2'
import { dayHead } from '../../../seo'

export const Route = createFileRoute(
  '/core-concepts/execution-context-scope/day-2',
)({
  head: () => dayHead('execution-context-scope', 2),
  component: Day2,
})
