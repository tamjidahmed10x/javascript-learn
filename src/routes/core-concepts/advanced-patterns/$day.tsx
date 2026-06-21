import { createFileRoute } from '@tanstack/react-router'
import AdvancedDay from '../../../pages/core-concepts/AdvancedDay'

export const Route = createFileRoute('/core-concepts/advanced-patterns/$day')({
  component: AdvancedDay,
})
