import { createFileRoute } from '@tanstack/react-router'
import WeekIndexPage from '../../../pages/core-concepts/WeekIndexPage'
import { weekHead } from '../../../seo'

export const Route = createFileRoute('/core-concepts/modules-perf-memory/')({
  head: () => weekHead('modules-perf-memory'),
  component: WeekIndexPage,
})
