import { createFileRoute } from '@tanstack/react-router'
import ExecutionContextGuide from '../../pages/core-concepts/ExecutionContextGuide'

export const Route = createFileRoute('/core-concepts/execution-context-guide')({
  component: ExecutionContextGuide,
})
