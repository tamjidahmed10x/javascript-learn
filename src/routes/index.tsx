import { createFileRoute } from '@tanstack/react-router'
import Landing from '../pages/Landing'
import { homeHead } from '../seo'

export const Route = createFileRoute('/')({
  head: () => homeHead(),
  component: Landing,
})
