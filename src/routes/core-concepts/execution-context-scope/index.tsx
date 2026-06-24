import { createFileRoute } from '@tanstack/react-router'
import WeekIndexPage from '../../../pages/core-concepts/WeekIndexPage'
import { weekHead } from '../../../seo'

export const Route = createFileRoute('/core-concepts/execution-context-scope/')({
  head: () => weekHead('execution-context-scope'),
  component: WeekIndexPage,
})
