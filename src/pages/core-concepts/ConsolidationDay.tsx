import { useParams } from '@tanstack/react-router'
import ConsolidationDay1 from './ConsolidationDay1'
import ConsolidationDay2 from './ConsolidationDay2'
import ConsolidationDay3 from './ConsolidationDay3'
import ConsolidationDay4 from './ConsolidationDay4'
import ConsolidationDay5 from './ConsolidationDay5'
import ConsolidationDay6 from './ConsolidationDay6'
import ConsolidationDay7 from './ConsolidationDay7'
import DayPlaceholder from './DayPlaceholder'

export default function ConsolidationDay() {
  const { day } = useParams({ from: '/core-concepts/consolidation/$day' })
  switch (day) {
    case 'day-1':
      return <ConsolidationDay1 />
    case 'day-2':
      return <ConsolidationDay2 />
    case 'day-3':
      return <ConsolidationDay3 />
    case 'day-4':
      return <ConsolidationDay4 />
    case 'day-5':
      return <ConsolidationDay5 />
    case 'day-6':
      return <ConsolidationDay6 />
    case 'day-7':
      return <ConsolidationDay7 />
    default:
      return <DayPlaceholder />
  }
}
