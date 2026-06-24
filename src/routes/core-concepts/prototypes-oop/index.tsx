import { createFileRoute } from '@tanstack/react-router'
import WeekIndexPage from '../../../pages/core-concepts/WeekIndexPage'
import { weekHead } from '../../../seo'

export const Route = createFileRoute('/core-concepts/prototypes-oop/')({
  head: () => weekHead('prototypes-oop'),
  component: WeekIndexPage,
})
