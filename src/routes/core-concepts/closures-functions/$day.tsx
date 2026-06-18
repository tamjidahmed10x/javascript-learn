import { createFileRoute } from '@tanstack/react-router'
import ClosuresDay from '../../../pages/core-concepts/ClosuresDay'

export const Route = createFileRoute('/core-concepts/closures-functions/$day')({
  component: ClosuresDay,
})
