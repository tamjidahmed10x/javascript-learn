import { createFileRoute } from '@tanstack/react-router'
import ConsolidationDay from '../../../pages/core-concepts/ConsolidationDay'

export const Route = createFileRoute('/core-concepts/consolidation/$day')({
  component: ConsolidationDay,
})
