import { useParams } from '@tanstack/react-router'
import ModulesDay1 from './ModulesDay1'
import ModulesDay2 from './ModulesDay2'
import ModulesDay3 from './ModulesDay3'
import ModulesDay4 from './ModulesDay4'
import ModulesDay5 from './ModulesDay5'
import ModulesDay6 from './ModulesDay6'
import ModulesDay7 from './ModulesDay7'
import DayPlaceholder from './DayPlaceholder'

export default function ModulesDay() {
  const { day } = useParams({ from: '/core-concepts/modules-perf-memory/$day' })
  switch (day) {
    case 'day-1':
      return <ModulesDay1 />
    case 'day-2':
      return <ModulesDay2 />
    case 'day-3':
      return <ModulesDay3 />
    case 'day-4':
      return <ModulesDay4 />
    case 'day-5':
      return <ModulesDay5 />
    case 'day-6':
      return <ModulesDay6 />
    case 'day-7':
      return <ModulesDay7 />
    default:
      return <DayPlaceholder />
  }
}
