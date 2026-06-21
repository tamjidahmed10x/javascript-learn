import { createFileRoute } from '@tanstack/react-router'
import AsyncDay from '../../../pages/core-concepts/AsyncDay'

export const Route = createFileRoute('/core-concepts/async-js/$day')({
  component: AsyncDay,
})
