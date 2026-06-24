import { createFileRoute } from '@tanstack/react-router'
import ExecutionContextGuide from '../../pages/core-concepts/ExecutionContextGuide'
import { abs } from '../../seo'

const SLUG = 'execution-context-guide'
const TITLE = 'JavaScript Execution Context — A Complete Guide | js.learn'
const DESCRIPTION =
  'The invisible scaffolding under every piece of JavaScript: creation vs execution phases, the scope chain, and the this value. A complete reference for interviews.'
const URL = abs(`/core-concepts/${SLUG}`)

export const Route = createFileRoute('/core-concepts/execution-context-guide')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: URL },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
    ],
    links: [{ rel: 'canonical', href: URL }],
  }),
  component: ExecutionContextGuide,
})
