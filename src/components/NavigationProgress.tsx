import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import './NavigationProgress.css'

type Phase = 'idle' | 'loading' | 'completing'

/**
 * NProgress-style top loading bar driven by TanStack Router's navigation state.
 * Shows whenever a route's loader is pending during a navigation, creeps toward
 * completion, then snaps to 100% and fades out when the navigation resolves.
 * Preloads triggered by hover-intent do not trip it (router only reports
 * `isLoading` once a navigation actually commits).
 *
 * The phase is derived in render from `isLoading`; the only effect schedules
 * the timed fade-out teardown, which can't be derived synchronously.
 */
export default function NavigationProgress() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const [completing, setCompleting] = useState(false)
  const wasLoading = useRef(false)

  useEffect(() => {
    if (!isLoading && wasLoading.current) {
      // Navigation just resolved — hold the completing bar for its fade-out.
      setCompleting(true)
      const t = setTimeout(() => setCompleting(false), 500)
      wasLoading.current = isLoading
      return () => clearTimeout(t)
    }
    wasLoading.current = isLoading
  }, [isLoading])

  const phase: Phase = isLoading ? 'loading' : completing ? 'completing' : 'idle'
  if (phase === 'idle') return null

  return (
    <div className="nav-progress" data-phase={phase} aria-hidden="true">
      <div className="nav-progress-bar" />
    </div>
  )
}
