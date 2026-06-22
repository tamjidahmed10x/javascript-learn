import { createFileRoute } from '@tanstack/react-router'
import EngineDay from '../../../pages/core-concepts/EngineDay'

export const Route = createFileRoute('/core-concepts/js-engine-internals/$day')({
  component: EngineDay,
})
