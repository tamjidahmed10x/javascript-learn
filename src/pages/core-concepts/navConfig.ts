import type { NavItem } from '../../components/ContentLayout'
import type { DayNavLink } from '../../components/DayNav'

export const week1NavItems: NavItem[] = [
  { label: 'Day 1: How JS Executes Code', path: '/core-concepts/execution-context-scope/day-1' },
  { label: 'Day 2: Hoisting', path: '/core-concepts/execution-context-scope/day-2' },
  { label: 'Day 3: TDZ + let + const', path: '/core-concepts/execution-context-scope/day-3' },
  { label: 'Day 4: Revision + Mock Interview', path: '/core-concepts/execution-context-scope/day-4' },
  { label: 'Day 5: Scope Chain Deep Dive', path: '/core-concepts/execution-context-scope/day-5' },
  { label: 'Day 6: Hard Problems', path: '/core-concepts/execution-context-scope/day-6' },
  { label: 'Day 7: Revision', path: '/core-concepts/execution-context-scope/day-7' },
]

const basePath = '/core-concepts/execution-context-scope'

export function getDayNav(day: number): { prev?: DayNavLink; next?: DayNavLink } {
  const dayLabels: Record<number, string> = {
    1: 'How JS Executes Code',
    2: 'Hoisting',
    3: 'TDZ + let + const',
    4: 'Revision + Mock Interview',
    5: 'Scope Chain Deep Dive',
    6: 'Hard Problems',
    7: 'Revision',
  }

  const prev = day > 1 ? { label: `Day ${day - 1}: ${dayLabels[day - 1]}`, path: `${basePath}/day-${day - 1}` } : undefined
  const next = day < 7 ? { label: `Day ${day + 1}: ${dayLabels[day + 1]}`, path: `${basePath}/day-${day + 1}` } : undefined

  return { prev, next }
}
