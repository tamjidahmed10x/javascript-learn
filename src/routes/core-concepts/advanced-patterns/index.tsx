import { createFileRoute } from '@tanstack/react-router'
import WeekIndexPage from '../../../pages/core-concepts/WeekIndexPage'
import { weekHead } from '../../../seo'

export const Route = createFileRoute('/core-concepts/advanced-patterns/')({
  head: () => weekHead('advanced-patterns'),
  component: WeekIndexPage,
})
