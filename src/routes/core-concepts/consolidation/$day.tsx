import { createFileRoute } from '@tanstack/react-router'
import DayPlaceholder from '../../../pages/core-concepts/DayPlaceholder'

export const Route = createFileRoute('/core-concepts/consolidation/$day')({
  component: DayPlaceholder,
})
