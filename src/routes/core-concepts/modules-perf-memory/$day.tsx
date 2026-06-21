import { createFileRoute } from '@tanstack/react-router'
import ModulesDay from '../../../pages/core-concepts/ModulesDay'

export const Route = createFileRoute('/core-concepts/modules-perf-memory/$day')({
  component: ModulesDay,
})
