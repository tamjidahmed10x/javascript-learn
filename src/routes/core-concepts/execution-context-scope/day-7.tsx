import { createFileRoute } from '@tanstack/react-router'
import Day7 from '../../../pages/core-concepts/Day7'
import { dayHead } from '../../../seo'

export const Route = createFileRoute(
  '/core-concepts/execution-context-scope/day-7',
)({
  head: () => dayHead('execution-context-scope', 7),
  component: Day7,
})
