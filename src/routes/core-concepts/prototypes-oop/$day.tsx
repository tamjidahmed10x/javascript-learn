import { createFileRoute } from '@tanstack/react-router'
import PrototypesDay from '../../../pages/core-concepts/PrototypesDay'

export const Route = createFileRoute('/core-concepts/prototypes-oop/$day')({
  component: PrototypesDay,
})
